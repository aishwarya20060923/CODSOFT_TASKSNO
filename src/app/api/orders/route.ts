import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateOrderNumber, generateTransactionId } from "@/lib/utils";

const TAX_RATE = 0.05; // 5% standard tax

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const orderType = searchParams.get("orderType");
    const activeOnly = searchParams.get("activeOnly") === "true";

    const where: any = {};
    if (userId) where.userId = userId;
    if (orderType) where.orderType = orderType;

    if (activeOnly) {
      where.status = { in: ["PLACED", "ACCEPTED", "PREPARING", "READY"] };
    } else if (status && status !== "ALL") {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        payments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      orderType,
      tableNumber,
      notes,
      items,
      paymentMethod = "CARD",
      paymentStatus = "PAID",
      userId,
    } = body;

    if (!customerName || !customerPhone || !items || !items.length) {
      return NextResponse.json(
        { error: "Customer name, phone, and at least one item are required" },
        { status: 400 }
      );
    }

    // Fetch live prices from database to ensure pricing integrity
    const itemIds = items.map((i: any) => i.menuItemId);
    const dbMenuItems = await prisma.menuItem.findMany({
      where: { id: { in: itemIds } },
    });

    const menuMap = new Map(dbMenuItems.map((m) => [m.id, m]));

    // Verify item availability / stock
    for (const item of dbMenuItems) {
      if (item.stockStatus === "OUT_OF_STOCK" || !item.isAvailable) {
        return NextResponse.json(
          { error: `"${item.name}" is currently Out of Stock and cannot be ordered.` },
          { status: 400 }
        );
      }
    }

    let calculatedSubtotal = 0;
    const orderItemData = items.map((i: any) => {
      const dbItem = menuMap.get(i.menuItemId);
      if (!dbItem) {
        throw new Error(`Menu item not found: ${i.menuItemId}`);
      }
      const qty = parseInt(i.quantity, 10) || 1;
      const unitPrice = dbItem.price;
      const lineTotal = Number((unitPrice * qty).toFixed(2));
      calculatedSubtotal += lineTotal;

      return {
        menuItemId: dbItem.id,
        quantity: qty,
        unitPrice,
        totalPrice: lineTotal,
        specialInstructions: i.specialInstructions || null,
      };
    });

    calculatedSubtotal = Number(calculatedSubtotal.toFixed(2));

    // Handle optional coupon
    let discountAmount = 0;
    let appliedCouponCode: string | null = null;
    if (body.couponCode) {
      const code = String(body.couponCode).trim().toUpperCase();
      const coupon = await prisma.coupon.findUnique({
        where: { code },
      });

      if (coupon && coupon.active && calculatedSubtotal >= coupon.minOrderAmount) {
        appliedCouponCode = coupon.code;
        if (coupon.discountType === "PERCENTAGE") {
          discountAmount = Number(((calculatedSubtotal * coupon.discountValue) / 100).toFixed(2));
        } else {
          discountAmount = Number(coupon.discountValue.toFixed(2));
        }
        discountAmount = Math.min(discountAmount, calculatedSubtotal);
      }
    }

    const discountedSubtotal = Math.max(0, calculatedSubtotal - discountAmount);
    const tax = Number((discountedSubtotal * TAX_RATE).toFixed(2));
    const totalAmount = Number((discountedSubtotal + tax).toFixed(2));

    const orderNumber = generateOrderNumber();

    // Create order with items & payment record in transaction
    const order = await prisma.order.create({
      data: {
        orderNumber,
        orderType: orderType === "TAKEAWAY" ? "TAKEAWAY" : "DINE_IN",
        status: "PLACED",
        paymentStatus,
        paymentMethod,
        subtotal: calculatedSubtotal,
        discountAmount,
        couponCode: appliedCouponCode,
        tax,
        totalAmount,
        customerName: customerName.trim(),
        customerEmail: customerEmail?.trim() || "",
        customerPhone: customerPhone.trim(),
        tableNumber: orderType === "DINE_IN" ? tableNumber || "Table 1" : null,
        notes: notes || null,
        userId: userId || null,
        items: {
          create: orderItemData,
        },
        ...(paymentStatus === "PAID" && {
          payments: {
            create: {
              transactionId: generateTransactionId(),
              amount: totalAmount,
              status: "PAID",
              method: paymentMethod,
            },
          },
        }),
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        payments: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}

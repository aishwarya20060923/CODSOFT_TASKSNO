import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, subtotal } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json({ valid: false, error: "Please enter a valid coupon code" }, { status: 400 });
    }

    const orderSubtotal = parseFloat(subtotal) || 0;
    if (orderSubtotal <= 0) {
      return NextResponse.json({ valid: false, error: "Order subtotal must be greater than 0" }, { status: 400 });
    }

    const normalizedCode = code.trim().toUpperCase();

    // Look up coupon in database
    const coupon = await prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });

    if (!coupon || !coupon.active) {
      return NextResponse.json({ valid: false, error: "Invalid or expired coupon code" }, { status: 404 });
    }

    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return NextResponse.json({ valid: false, error: "This coupon code has expired" }, { status: 400 });
    }

    if (orderSubtotal < coupon.minOrderAmount) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order amount for ${coupon.code} is ₹${coupon.minOrderAmount}. Add more dishes to qualify!`,
      }, { status: 400 });
    }

    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = Number(((orderSubtotal * coupon.discountValue) / 100).toFixed(2));
    } else {
      discountAmount = Number(coupon.discountValue.toFixed(2));
    }

    // Discount cannot exceed subtotal
    discountAmount = Math.min(discountAmount, orderSubtotal);
    const discountedSubtotal = Math.max(0, orderSubtotal - discountAmount);
    const tax = Number((discountedSubtotal * 0.05).toFixed(2));
    const finalTotal = Number((discountedSubtotal + tax).toFixed(2));

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discountAmount,
      subtotal: orderSubtotal,
      discountedSubtotal,
      tax,
      finalTotal,
    });
  } catch (error: any) {
    console.error("POST /api/coupons/validate error:", error);
    return NextResponse.json({ valid: false, error: error.message || "Failed to validate coupon" }, { status: 500 });
  }
}

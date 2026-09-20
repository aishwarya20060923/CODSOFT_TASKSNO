import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      todayOrdersCount,
      allOrders,
      activeReservationsCount,
      totalCustomersCount,
      popularItems,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({
        where: {
          createdAt: { gte: today },
        },
      }),
      prisma.order.findMany({
        select: {
          totalAmount: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
        },
      }),
      prisma.reservation.count({
        where: {
          status: { in: ["PENDING", "CONFIRMED", "SEATED"] },
        },
      }),
      prisma.user.count({
        where: { role: "CUSTOMER" },
      }),
      prisma.orderItem.groupBy({
        by: ["menuItemId"],
        _sum: { quantity: true },
        orderBy: {
          _sum: { quantity: "desc" },
        },
        take: 5,
      }),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: { menuItem: true },
          },
        },
      }),
    ]);

    // Calculate total revenue and today revenue
    let totalRevenue = 0;
    let todayRevenue = 0;
    const ordersByStatus: Record<string, number> = {
      PLACED: 0,
      ACCEPTED: 0,
      PREPARING: 0,
      READY: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };

    allOrders.forEach((order) => {
      if (order.paymentStatus === "PAID") {
        totalRevenue += order.totalAmount;
        if (new Date(order.createdAt) >= today) {
          todayRevenue += order.totalAmount;
        }
      }
      if (ordersByStatus[order.status] !== undefined) {
        ordersByStatus[order.status]++;
      }
    });

    // Fetch dish details for popular items
    const dishIds = popularItems.map((p) => p.menuItemId);
    const dishDetails = await prisma.menuItem.findMany({
      where: { id: { in: dishIds } },
    });
    const dishMap = new Map(dishDetails.map((d) => [d.id, d]));

    const enrichedPopularDishes = popularItems.map((p) => ({
      item: dishMap.get(p.menuItemId),
      ordersCount: p._sum.quantity || 0,
    }));

    const pendingOrders =
      (ordersByStatus.PLACED || 0) +
      (ordersByStatus.ACCEPTED || 0) +
      (ordersByStatus.PREPARING || 0);

    return NextResponse.json({
      totalOrders,
      todayOrders: todayOrdersCount,
      pendingOrders,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      todayRevenue: Number(todayRevenue.toFixed(2)),
      activeReservations: activeReservationsCount,
      totalCustomers: totalCustomersCount,
      ordersByStatus,
      statusBreakdown: ordersByStatus,
      popularDishes: enrichedPopularDishes,
      recentOrders,
    });
  } catch (error: any) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch stats" }, { status: 500 });
  }
}

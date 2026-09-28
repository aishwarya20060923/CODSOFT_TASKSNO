import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const customers = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      include: {
        orders: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
          },
        },
        reservations: {
          select: {
            id: true,
            date: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const enriched = customers.map((c) => {
      const totalSpent = c.orders.reduce((sum, o) => sum + o.totalAmount, 0);
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        avatar: c.avatar,
        ordersCount: c.orders.length,
        reservationsCount: c.reservations.length,
        totalSpent: Number(totalSpent.toFixed(2)),
        createdAt: c.createdAt,
      };
    });

    return NextResponse.json(enriched);
  } catch (error: any) {
    console.error("GET /api/customers error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch customers" }, { status: 500 });
  }
}

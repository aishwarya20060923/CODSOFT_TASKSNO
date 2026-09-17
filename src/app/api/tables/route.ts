import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const timeSlot = searchParams.get("timeSlot");

    let tables = await prisma.restaurantTable.findMany({
      orderBy: { tableNumber: "asc" },
      include: {
        reservations: {
          where: {
            status: { notIn: ["CANCELLED", "COMPLETED"] },
            ...(date && { date }),
            ...(timeSlot && { timeSlot }),
          },
        },
      },
    });

    // If date & timeSlot provided, mark table availability accordingly
    const mapped = tables.map((t) => {
      const isReserved = t.reservations.length > 0;
      return {
        ...t,
        isSlotAvailable: !isReserved && t.status !== "MAINTENANCE",
      };
    });

    return NextResponse.json(mapped);
  } catch (error: any) {
    console.error("GET /api/tables error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch tables" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tableNumber, capacity, location, status } = body;

    const table = await prisma.restaurantTable.create({
      data: {
        tableNumber: parseInt(tableNumber, 10),
        capacity: parseInt(capacity, 10) || 4,
        location: location || "INDOOR",
        status: status || "AVAILABLE",
      },
    });

    return NextResponse.json(table, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/tables error:", error);
    return NextResponse.json({ error: error.message || "Failed to create table" }, { status: 500 });
  }
}

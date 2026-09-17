import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateReservationNumber } from "@/lib/utils";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const date = searchParams.get("date");
    const status = searchParams.get("status");

    const where: any = {};
    if (userId) where.userId = userId;
    if (date) where.date = date;
    if (status && status !== "ALL") where.status = status;

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        table: true,
      },
      orderBy: [
        { date: "desc" },
        { timeSlot: "asc" },
      ],
    });

    return NextResponse.json(reservations);
  } catch (error: any) {
    console.error("GET /api/reservations error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch reservations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      date,
      timeSlot,
      guestCount,
      specialRequests,
      tableId,
      userId,
    } = body;

    if (!customerName || !customerPhone || !date || !timeSlot) {
      return NextResponse.json(
        { error: "Customer name, phone, date, and time slot are required" },
        { status: 400 }
      );
    }

    let assignedTableId = tableId;

    // If specific table selected, verify it's not already booked for the same date and time
    if (assignedTableId) {
      const existingConflict = await prisma.reservation.findFirst({
        where: {
          tableId: assignedTableId,
          date,
          timeSlot,
          status: { notIn: ["CANCELLED"] },
        },
      });

      if (existingConflict) {
        return NextResponse.json(
          {
            error: "This table is already booked for the selected date and time slot. Please choose another table or time.",
          },
          { status: 409 }
        );
      }
    } else {
      // Auto-assign an available table with sufficient capacity
      const allTables = await prisma.restaurantTable.findMany({
        where: {
          capacity: { gte: parseInt(guestCount, 10) || 2 },
          status: { not: "MAINTENANCE" },
        },
        orderBy: { capacity: "asc" },
      });

      const bookedReservations = await prisma.reservation.findMany({
        where: {
          date,
          timeSlot,
          status: { notIn: ["CANCELLED"] },
        },
        select: { tableId: true },
      });

      const bookedTableIds = new Set(bookedReservations.map((r) => r.tableId).filter(Boolean));
      const availableTable = allTables.find((t) => !bookedTableIds.has(t.id));

      if (!availableTable) {
        return NextResponse.json(
          {
            error: "No available tables found for the selected party size and time slot. Please select a different time.",
          },
          { status: 409 }
        );
      }

      assignedTableId = availableTable.id;
    }

    const reservationNumber = generateReservationNumber();

    const reservation = await prisma.reservation.create({
      data: {
        reservationNumber,
        customerName: customerName.trim(),
        customerEmail: customerEmail?.trim() || "",
        customerPhone: customerPhone.trim(),
        date,
        timeSlot,
        guestCount: parseInt(guestCount, 10) || 2,
        specialRequests: specialRequests || null,
        status: "CONFIRMED",
        tableId: assignedTableId,
        userId: userId || null,
      },
      include: {
        table: true,
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/reservations error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create reservation" },
      { status: 500 }
    );
  }
}

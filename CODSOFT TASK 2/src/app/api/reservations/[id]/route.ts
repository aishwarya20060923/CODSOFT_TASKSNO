import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, tableId, guestCount, specialRequests } = body;

    const updated = await prisma.reservation.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(tableId && { tableId }),
        ...(guestCount && { guestCount: parseInt(guestCount, 10) }),
        ...(specialRequests !== undefined && { specialRequests }),
      },
      include: {
        table: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PATCH /api/reservations/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.reservation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Reservation deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

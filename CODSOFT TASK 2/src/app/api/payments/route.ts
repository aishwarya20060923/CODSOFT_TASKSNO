import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateTransactionId } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { orderId, amount, method = "CARD", status = "PAID" } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const payment = await prisma.payment.create({
      data: {
        orderId,
        transactionId: generateTransactionId(),
        amount: amount || order.totalAmount,
        method,
        status,
      },
    });

    // Update order payment status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: status,
        paymentMethod: method,
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/payments error:", error);
    return NextResponse.json({ error: error.message || "Payment simulation failed" }, { status: 500 });
  }
}

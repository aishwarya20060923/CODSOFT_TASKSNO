"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { Order } from "@/types";
import { formatPrice } from "@/lib/utils";
import OrderReceipt from "@/components/orders/OrderReceipt";
import { CheckCircle2, ArrowRight, Clock, UtensilsCrossed } from "lucide-react";

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((d) => setOrder(d))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-600 font-semibold text-sm">Loading order confirmation...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Order not found</h2>
        <Link href="/menu" className="mt-4 inline-block text-orange-600 font-bold hover:underline">
          Return to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-8">
      {/* Celebration Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Payment & Order Confirmed
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">
            Thank You, {order.customerName}!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Your dining ticket <strong className="font-mono text-orange-600 font-bold">{order.orderNumber}</strong> has been transmitted directly to the kitchen display.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href={`/track/${order.id}`}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-600/20 flex items-center gap-2 transition-all"
          >
            <Clock className="w-4 h-4" />
            <span>Track Live Kitchen Progress</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/menu"
            className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Order More Food</span>
          </Link>
        </div>
      </div>

      {/* Itemized Order Receipt */}
      <OrderReceipt order={order} />
    </div>
  );
}

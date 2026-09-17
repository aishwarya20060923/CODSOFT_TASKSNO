"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { Order } from "@/types";
import OrderTimeline from "@/components/orders/OrderTimeline";
import OrderReceipt from "@/components/orders/OrderReceipt";
import {
  UtensilsCrossed,
  RefreshCw,
  ArrowLeft,
  PhoneCall,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchOrder = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) {
        throw new Error("Order not found or link has expired");
      }
      const data = await res.json();
      setOrder(data);
    } catch (e: any) {
      setError(e.message || "Failed to load order.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    // Auto-poll every 4 seconds to catch kitchen updates live
    const interval = setInterval(() => {
      fetchOrder(true);
    }, 4000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-600 font-semibold text-sm">Loading real-time order tracking...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <p className="text-red-600 font-bold mb-4">{error || "Order not found"}</p>
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to My Orders</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Top Breadcrumb & Live Refresh Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/orders"
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-semibold text-slate-500">Live Kitchen Polling</span>
          <button
            onClick={() => fetchOrder(false)}
            disabled={isRefreshing}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Refresh Order"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Hero Status Card */}
      <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-orange-400 font-bold text-xs uppercase tracking-wider">
                Order Tracking Status
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-0.5 font-mono">
                {order.orderNumber}
              </h1>
            </div>

            <div className="text-right">
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-extrabold bg-orange-500 text-slate-950 uppercase shadow-xs">
                {order.status}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                {order.orderType === "DINE_IN"
                  ? `Dine-In • ${order.tableNumber || "Table"}`
                  : "Takeaway Counter Pickup"}
              </p>
            </div>
          </div>

          {/* Stepper */}
          <div className="pt-4 border-t border-slate-700/60">
            <OrderTimeline status={order.status} />
          </div>

          {/* Estimated Completion Message */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {order.status === "COMPLETED"
                  ? "Order has been fulfilled. Enjoy your meal!"
                  : order.status === "READY"
                  ? "Your meal is ready! Please collect it from the counter or wait for server."
                  : "Estimated preparation time: 15–20 minutes."}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-orange-400 font-semibold">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Need help? Dial +1 (555) 346-3337</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Receipt Breakdown */}
      <OrderReceipt order={order} />
    </div>
  );
}

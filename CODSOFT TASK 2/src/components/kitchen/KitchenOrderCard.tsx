"use client";

import React, { useState } from "react";
import { Order, OrderStatus } from "@/types";
import { Clock, ChefHat, Bell, CheckCircle, ArrowRight, AlertTriangle } from "lucide-react";

interface KitchenOrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
}

export default function KitchenOrderCard({ order, onUpdateStatus }: KitchenOrderCardProps) {
  const [loading, setLoading] = useState(false);

  // Time elapsed
  const createdDate = new Date(order.createdAt);
  const elapsedMins = Math.floor((Date.now() - createdDate.getTime()) / 60000);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PLACED":
        return {
          bg: "bg-amber-100 text-amber-900 border-amber-300",
          label: "New Order",
          nextStatus: "ACCEPTED" as OrderStatus,
          btnText: "Accept Order",
          btnColor: "bg-blue-600 hover:bg-blue-700 text-white",
        };
      case "ACCEPTED":
        return {
          bg: "bg-blue-100 text-blue-900 border-blue-300",
          label: "Accepted",
          nextStatus: "PREPARING" as OrderStatus,
          btnText: "Start Cooking",
          btnColor: "bg-amber-600 hover:bg-amber-700 text-white",
        };
      case "PREPARING":
        return {
          bg: "bg-orange-100 text-orange-900 border-orange-300",
          label: "In Preparation",
          nextStatus: "READY" as OrderStatus,
          btnText: "Mark as Ready",
          btnColor: "bg-emerald-600 hover:bg-emerald-700 text-white",
        };
      case "READY":
        return {
          bg: "bg-emerald-100 text-emerald-900 border-emerald-300",
          label: "Ready for Pickup",
          nextStatus: "COMPLETED" as OrderStatus,
          btnText: "Complete Order",
          btnColor: "bg-slate-800 hover:bg-slate-900 text-white",
        };
      case "COMPLETED":
        return {
          bg: "bg-slate-100 text-slate-700 border-slate-300",
          label: "Fulfilled",
          nextStatus: null,
          btnText: "",
          btnColor: "",
        };
      default:
        return {
          bg: "bg-slate-100 text-slate-700 border-slate-300",
          label: status,
          nextStatus: null,
          btnText: "",
          btnColor: "",
        };
    }
  };

  const statusConfig = getStatusBadge(order.status);

  const handleAction = async () => {
    if (!statusConfig.nextStatus) return;
    setLoading(true);
    try {
      await onUpdateStatus(order.id, statusConfig.nextStatus);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-3xl border shadow-sm transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        order.status === "PLACED"
          ? "border-amber-400 bg-amber-50/20 ring-2 ring-amber-300/50"
          : order.status === "PREPARING"
          ? "border-orange-300 bg-orange-50/10"
          : order.status === "READY"
          ? "border-emerald-400 bg-emerald-50/20"
          : "border-slate-200 bg-white"
      }`}
    >
      {/* Top Header */}
      <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-lg text-slate-900 font-mono">
              {order.orderNumber}
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusConfig.bg}`}
            >
              {statusConfig.label}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <Clock className="w-3.5 h-3.5" />
            <span className={elapsedMins > 20 ? "text-red-600 font-bold" : ""}>
              {elapsedMins === 0 ? "Just now" : `${elapsedMins} mins ago`}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span
            className={`inline-block px-3 py-1 rounded-xl text-xs font-bold ${
              order.orderType === "DINE_IN"
                ? "bg-purple-100 text-purple-900"
                : "bg-teal-100 text-teal-900"
            }`}
          >
            {order.orderType === "DINE_IN" ? order.tableNumber || "Dine-In" : "Takeaway"}
          </span>
          <p className="text-[11px] text-slate-500 mt-1 truncate max-w-[120px]">
            {order.customerName}
          </p>
        </div>
      </div>

      {/* Items Section */}
      <div className="p-4 flex-1 space-y-3">
        <div className="space-y-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 text-sm p-2 rounded-xl bg-slate-50/80 border border-slate-100"
            >
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                  {item.quantity}
                </span>
                <div>
                  <p className="font-bold text-slate-900 leading-tight">
                    {item.menuItem.name}
                  </p>
                  {item.specialInstructions && (
                    <p className="text-xs text-red-600 font-semibold mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      {item.specialInstructions}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Notes */}
        {order.notes && (
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <strong>Notes: </strong>
            <span>{order.notes}</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      {statusConfig.nextStatus && (
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={handleAction}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 ${
              statusConfig.btnColor
            } ${loading ? "opacity-50 cursor-wait" : ""}`}
          >
            {loading ? (
              <span>Updating...</span>
            ) : (
              <>
                <span>{statusConfig.btnText}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

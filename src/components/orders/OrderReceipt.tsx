"use client";

import React from "react";
import { Order } from "@/types";
import { formatPrice } from "@/lib/utils";
import { UtensilsCrossed, Printer, CheckCircle, Clock } from "lucide-react";

interface OrderReceiptProps {
  order: Order;
}

export default function OrderReceipt({ order }: OrderReceiptProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">DineDesk Restaurant</h2>
            <p className="text-xs text-slate-500">Official Dining Invoice & Order Summary</p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold self-start sm:self-auto transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Receipt</span>
        </button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100 text-xs">
        <div>
          <span className="text-slate-400 block mb-0.5">Order Number</span>
          <span className="font-bold text-slate-900 text-sm font-mono">{order.orderNumber}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Date & Time</span>
          <span className="font-semibold text-slate-800">
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Dining Type</span>
          <span className="font-bold text-orange-600">
            {order.orderType === "DINE_IN"
              ? `Dine-In (${order.tableNumber || "Table"})`
              : "Takeaway Pickup"}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Payment Status</span>
          <span
            className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-md text-[11px] ${
              order.paymentStatus === "PAID"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-800"
            }`}
          >
            <CheckCircle className="w-3 h-3" />
            {order.paymentStatus} ({order.paymentMethod})
          </span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="py-4 border-b border-slate-100 text-xs flex flex-wrap gap-4 justify-between bg-slate-50/50 p-3 rounded-xl my-4">
        <div>
          <span className="text-slate-400">Customer: </span>
          <strong className="text-slate-900">{order.customerName}</strong>
        </div>
        <div>
          <span className="text-slate-400">Phone: </span>
          <span className="text-slate-700">{order.customerPhone}</span>
        </div>
        {order.customerEmail && (
          <div>
            <span className="text-slate-400">Email: </span>
            <span className="text-slate-700">{order.customerEmail}</span>
          </div>
        )}
      </div>

      {/* Items Table */}
      <div className="py-4">
        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
          Ordered Items
        </h4>
        <div className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex items-start justify-between gap-4 text-sm">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{item.quantity}x</span>
                  <span className="font-semibold text-slate-800">{item.menuItem.name}</span>
                </div>
                {item.specialInstructions && (
                  <p className="text-xs text-orange-600 italic mt-0.5 pl-6">
                    Note: {item.specialInstructions}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900">{formatPrice(item.totalPrice)}</span>
                <span className="text-xs text-slate-400 block">
                  {formatPrice(item.unitPrice)} each
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Notes */}
      {order.notes && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 mb-6">
          <strong>Order Notes: </strong>
          <span>{order.notes}</span>
        </div>
      )}

      {/* Total Calculations */}
      <div className="bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-100 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Item Subtotal</span>
          <span className="font-semibold text-slate-800">{formatPrice(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>5% Restaurant GST (2.5% CGST + 2.5% SGST)</span>
          <span className="font-semibold text-slate-800">{formatPrice(order.tax)}</span>
        </div>
        <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
          <span>Total Paid</span>
          <span className="text-orange-600 text-lg">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}

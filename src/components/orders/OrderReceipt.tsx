"use client";

import React from "react";
import { Order } from "@/types";
import { formatPrice } from "@/lib/utils";
import { UtensilsCrossed, Printer, CheckCircle, Clock, ShieldCheck } from "lucide-react";

interface OrderReceiptProps {
  order: Order;
}

export default function OrderReceipt({ order }: OrderReceiptProps) {
  const handlePrint = () => {
    window.print();
  };

  const discount = order.discountAmount || 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md print:shadow-none print:border-none print:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-bold shadow-md shadow-orange-600/20">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              DineDesk Restaurant
            </h2>
            <p className="text-xs text-slate-500">
              Tax Invoice & Dining Receipt • GSTIN: 29AABCD1234E1Z5
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="print:hidden inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold self-start sm:self-auto transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Receipt</span>
        </button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100 text-xs">
        <div>
          <span className="text-slate-400 block mb-0.5">Order ID</span>
          <span className="font-bold text-slate-900 text-sm font-mono">
            {order.orderNumber}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Date & Time</span>
          <span className="font-semibold text-slate-800">
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Dining Format</span>
          <span className="font-bold text-orange-600">
            {order.orderType === "DINE_IN"
              ? `Dine-In (${order.tableNumber || "Table"})`
              : "Takeaway Counter"}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Order Status</span>
          <span
            className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-lg text-xs ${
              order.status === "COMPLETED"
                ? "bg-emerald-100 text-emerald-800"
                : order.status === "READY"
                ? "bg-blue-100 text-blue-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            <Clock className="w-3 h-3" />
            {order.status}
          </span>
        </div>
      </div>

      {/* Customer & Payment Bar */}
      <div className="py-3.5 border-b border-slate-100 text-xs flex flex-wrap gap-4 justify-between bg-slate-50/80 p-3.5 rounded-2xl my-4">
        <div>
          <span className="text-slate-400">Guest: </span>
          <strong className="text-slate-900">{order.customerName}</strong>
        </div>
        <div>
          <span className="text-slate-400">Phone: </span>
          <span className="text-slate-700 font-mono">{order.customerPhone}</span>
        </div>
        <div>
          <span className="text-slate-400">Payment: </span>
          <span className="font-semibold text-slate-800">
            {order.paymentMethod} •{" "}
            <span className="text-emerald-700 font-bold">{order.paymentStatus}</span>
          </span>
        </div>
      </div>

      {/* Items Table */}
      <div className="py-4">
        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
          Ordered Delicacies
        </h4>
        <div className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="py-3 flex items-start justify-between gap-4 text-sm"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 w-6">
                    {item.quantity}x
                  </span>
                  <span className="font-bold text-slate-800">
                    {item.menuItem.name}
                  </span>
                  {item.menuItem.isVegetarian ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" title="Veg" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0" title="Non-Veg" />
                  )}
                </div>
                {item.specialInstructions && (
                  <p className="text-xs text-orange-600 italic mt-0.5 pl-8">
                    Note: {item.specialInstructions}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900">
                  {formatPrice(item.totalPrice)}
                </span>
                <span className="text-xs text-slate-400 block font-normal">
                  {formatPrice(item.unitPrice)} each
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Notes */}
      {order.notes && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 text-xs text-amber-900 mb-6">
          <strong>Order Notes: </strong>
          <span>{order.notes}</span>
        </div>
      )}

      {/* Bill Computation */}
      <div className="bg-slate-50 rounded-2xl p-4.5 space-y-2 border border-slate-100 text-xs text-slate-600">
        <div className="flex justify-between">
          <span>Item Subtotal</span>
          <span className="font-bold text-slate-800 font-mono">
            {formatPrice(order.subtotal)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-700 font-bold">
            <span>
              Coupon Discount {order.couponCode ? `(${order.couponCode})` : ""}
            </span>
            <span className="font-mono">-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>5% Restaurant GST (2.5% CGST + 2.5% SGST)</span>
          <span className="font-bold text-slate-800 font-mono">
            {formatPrice(order.tax)}
          </span>
        </div>

        <div className="flex justify-between text-base font-black text-slate-900 pt-2.5 border-t border-slate-200">
          <span>Final Total</span>
          <span className="text-orange-600 text-lg font-mono">
            {formatPrice(order.totalAmount)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-400 space-y-1">
        <p className="font-semibold text-slate-600">
          Thank you for dining with DineDesk!
        </p>
        <p className="text-[11px]">
          450 Heritage Marg, Indiranagar, Bengaluru, Karnataka 560038 • +91 98300 12345
        </p>
      </div>
    </div>
  );
}

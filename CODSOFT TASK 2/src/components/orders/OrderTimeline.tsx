"use client";

import React from "react";
import { OrderStatus } from "@/types";
import { CheckCircle2, Clock, ChefHat, BellRing, Sparkles, AlertCircle } from "lucide-react";

interface OrderTimelineProps {
  status: OrderStatus;
}

export default function OrderTimeline({ status }: OrderTimelineProps) {
  const steps: { key: OrderStatus; label: string; desc: string; icon: any }[] = [
    {
      key: "PLACED",
      label: "Order Placed",
      desc: "Sent to kitchen dispatch",
      icon: Clock,
    },
    {
      key: "ACCEPTED",
      label: "Confirmed",
      desc: "Kitchen confirmed ticket",
      icon: CheckCircle2,
    },
    {
      key: "PREPARING",
      label: "Preparing",
      desc: "Chef is cooking on the stove",
      icon: ChefHat,
    },
    {
      key: "READY",
      label: "Ready",
      desc: "Plated & ready for service",
      icon: BellRing,
    },
    {
      key: "COMPLETED",
      label: "Completed",
      desc: "Served & fulfilled",
      icon: Sparkles,
    },
  ];

  const statusOrder: Record<OrderStatus, number> = {
    PLACED: 0,
    ACCEPTED: 1,
    PREPARING: 2,
    READY: 3,
    COMPLETED: 4,
    CANCELLED: -1,
  };

  const currentIndex = statusOrder[status] ?? 0;

  if (status === "CANCELLED") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
        <h3 className="font-bold text-lg">Order Cancelled</h3>
        <p className="text-xs text-red-600 mt-1">This order has been cancelled by restaurant management or customer request.</p>
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      {/* Desktop Stepper */}
      <div className="hidden sm:flex items-center justify-between relative">
        {/* Continuous Connecting Line */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-200 -z-0">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isDone
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : isCurrent
                    ? "bg-orange-600 text-white ring-4 ring-orange-500/20 shadow-lg shadow-orange-600/30 scale-110"
                    : "bg-white border-2 border-slate-200 text-slate-400"
                }`}
              >
                <Icon className={`w-5 h-5 ${isCurrent ? "animate-pulse" : ""}`} />
              </div>

              <span
                className={`mt-2.5 text-xs font-bold ${
                  isCurrent
                    ? "text-orange-600"
                    : isDone
                    ? "text-emerald-700"
                    : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
              <span className="text-[10px] text-slate-400 text-center max-w-[90px] hidden md:block">
                {step.desc}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Stepper (Vertical) */}
      <div className="sm:hidden space-y-4 relative pl-8">
        <div className="absolute left-3.5 top-3 bottom-3 w-0.5 bg-slate-200">
          <div
            className="w-full bg-orange-600 transition-all duration-500"
            style={{ height: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex items-start gap-3 relative">
              <div
                className={`absolute -left-8 w-7 h-7 rounded-xl flex items-center justify-center text-xs ${
                  isDone
                    ? "bg-emerald-600 text-white"
                    : isCurrent
                    ? "bg-orange-600 text-white ring-4 ring-orange-400/20"
                    : "bg-white border-2 border-slate-200 text-slate-400"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              <div>
                <p
                  className={`text-sm font-bold ${
                    isCurrent
                      ? "text-orange-600"
                      : isDone
                      ? "text-emerald-700"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-slate-500">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

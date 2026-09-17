"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import { X, CreditCard, QrCode, Banknote, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface CheckoutModalProps {
  onClose: () => void;
}

export default function CheckoutModal({ onClose }: CheckoutModalProps) {
  const { items, orderType, tableNumber, customerNotes, subtotal, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // Form State
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "UPI" | "CASH">("CARD");
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"DETAILS" | "PROCESSING" | "SUCCESS">("DETAILS");
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }

    setError("");
    setLoading(true);
    setStep("PROCESSING");

    try {
      // 1. Simulate payment network delay
      await new Promise((r) => setTimeout(r, 1200));

      // 2. Post order to backend
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          customerPhone: phone.trim(),
          customerEmail: email.trim(),
          orderType,
          tableNumber: orderType === "DINE_IN" ? tableNumber : null,
          notes: customerNotes,
          items: items.map((ci) => ({
            menuItemId: ci.menuItem.id,
            quantity: ci.quantity,
            specialInstructions: ci.specialInstructions,
          })),
          paymentMethod,
          paymentStatus: "PAID",
          userId: user?.id || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to place order.");
      }

      const orderData = await res.json();
      setCompletedOrder(orderData);
      setStep("SUCCESS");
      clearCart();

      // Redirect to order confirmation page after brief success showcase
      setTimeout(() => {
        router.push(`/order-confirmation/${orderData.id}`);
      }, 1600);
    } catch (err: any) {
      console.error("Order error", err);
      setError(err.message || "Something went wrong.");
      setStep("DETAILS");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Complete Your Order</h3>
              <p className="text-[11px] text-slate-400">Secure simulated restaurant checkout</p>
            </div>
          </div>

          {step !== "PROCESSING" && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        {step === "PROCESSING" ? (
          <div className="p-12 text-center space-y-4">
            <Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto" />
            <h4 className="font-bold text-lg text-slate-900">Processing Your Payment...</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Simulating encrypted payment authorization with restaurant POS gateway...
            </p>
          </div>
        ) : step === "SUCCESS" ? (
          <div className="p-12 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-extrabold text-2xl text-slate-900">Order Confirmed!</h4>
            <p className="text-sm text-slate-600">
              Order <strong className="text-orange-600 font-mono">{completedOrder?.orderNumber}</strong> has been placed and sent to the kitchen.
            </p>
            <p className="text-xs text-slate-400">Redirecting to live order tracking...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {error}
              </div>
            )}

            {/* Customer Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Guest Contact Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (for receipt)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Simulated Payment Methods */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Select Simulated Payment Method
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("CARD")}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === "CARD"
                      ? "border-orange-500 bg-orange-50 text-orange-950 font-bold ring-2 ring-orange-500/20 shadow-2xs"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-orange-600" />
                  <span className="text-[11px]">Card / RuPay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("UPI")}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === "UPI"
                      ? "border-orange-500 bg-orange-50 text-orange-950 font-bold ring-2 ring-orange-500/20 shadow-2xs"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <QrCode className="w-5 h-5 text-orange-600" />
                  <span className="text-[11px]">UPI / QR (GPay)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("CASH")}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === "CASH"
                      ? "border-orange-500 bg-orange-50 text-orange-950 font-bold ring-2 ring-orange-500/20 shadow-2xs"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Banknote className="w-5 h-5 text-orange-600" />
                  <span className="text-[11px]">Cash at Counter</span>
                </button>
              </div>
            </div>

            {/* Total Summary */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Dining Type</span>
                <span className="font-semibold text-slate-800">
                  {orderType === "DINE_IN" ? `Dine-In (${tableNumber})` : "Takeaway"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Restaurant GST 5% (CGST + SGST)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-1.5 border-t border-slate-200">
                <span>Total Due</span>
                <span className="text-orange-600 font-black">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-orange-600/25 transition-all active:scale-98"
            >
              Confirm & Pay {formatPrice(total)}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import {
  X,
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Tag,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface CheckoutModalProps {
  onClose: () => void;
}

export default function CheckoutModal({ onClose }: CheckoutModalProps) {
  const { items, orderType, tableNumber, customerNotes, subtotal, clearCart } =
    useCart();
  const { user } = useAuth();
  const router = useRouter();

  // Form State
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "UPI" | "CASH">("CARD");

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    description: string;
    discountAmount: number;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"DETAILS" | "PROCESSING" | "SUCCESS">("DETAILS");
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Totals calculations with coupon discount
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const calculatedTax = Number((discountedSubtotal * 0.05).toFixed(2));
  const finalTotal = Number((discountedSubtotal + calculatedTax).toFixed(2));

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    setCouponError("");
    setCouponSuccess("");

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });

      const data = await res.json();
      if (!res.ok || !data.valid) {
        setCouponError(data.error || "Invalid coupon code");
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon({
          code: data.coupon.code,
          description: data.coupon.description,
          discountAmount: data.discountAmount,
        });
        setCouponCode(data.coupon.code);
        setCouponSuccess(`Coupon applied! Saved ₹${data.discountAmount}`);
      }
    } catch (e: any) {
      setCouponError("Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    setCouponSuccess("");
  };

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
          couponCode: appliedCoupon ? appliedCoupon.code : null,
          discountAmount: appliedCoupon ? appliedCoupon.discountAmount : 0,
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
              aria-label="Close modal"
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
              Simulating payment gateway authorization with instant receipt generation.
            </p>
          </div>
        ) : step === "SUCCESS" ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-scale-up">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-black text-xl text-slate-900">Order Confirmed!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Ticket #{completedOrder?.orderNumber} has been dispatched to the kitchen.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* Guest Contact Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Guest Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98300 12345"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email (for digital invoice)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Promo Coupons & Discounts */}
            <div className="pt-2 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-orange-600" />
                  <span>2. Promo Coupon / Voucher</span>
                </h4>
                {appliedCoupon && (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-[11px] font-bold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Coupon Input Box */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code (e.g. DINE20)"
                  disabled={Boolean(appliedCoupon) || couponLoading}
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-slate-50"
                />
                {!appliedCoupon ? (
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1"
                  >
                    {couponLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                    <span>Apply</span>
                  </button>
                ) : (
                  <span className="px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Applied
                  </span>
                )}
              </div>

              {/* Quick Demo Coupons Chips */}
              {!appliedCoupon && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-slate-400">Try demo:</span>
                  {[
                    { code: "WELCOME10", label: "10% OFF" },
                    { code: "DINE20", label: "20% OFF" },
                    { code: "FLAT100", label: "₹100 OFF" },
                  ].map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleApplyCoupon(c.code)}
                      className="px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 text-[10px] font-bold font-mono transition-colors"
                    >
                      {c.code} ({c.label})
                    </button>
                  ))}
                </div>
              )}

              {couponError && (
                <p className="text-[11px] text-red-600 font-medium">{couponError}</p>
              )}
              {couponSuccess && (
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>{couponSuccess}</span>
                </p>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                3. Payment Method
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
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
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

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>-{formatPrice(appliedCoupon.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>5% Restaurant GST (CGST + SGST)</span>
                <span>{formatPrice(calculatedTax)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Due</span>
                <span className="text-orange-600 font-black">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-orange-600/25 transition-all active:scale-98"
            >
              Confirm & Pay {formatPrice(finalTotal)}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

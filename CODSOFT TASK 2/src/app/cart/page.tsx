"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import CheckoutModal from "@/components/cart/CheckoutModal";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  UtensilsCrossed,
  ShoppingBag,
  Clock,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    orderType,
    tableNumber,
    customerNotes,
    subtotal,
    tax,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
    setOrderType,
    setTableNumber,
    setCustomerNotes,
  } = useCart();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [tables, setTables] = useState<any[]>([]);

  // Fetch tables list to populate table number dropdown
  useEffect(() => {
    fetch("/api/tables")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setTables(data);
      })
      .catch((e) => console.error(e));
  }, []);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Your Dining Cart is Empty</h2>
          <p className="text-slate-500 text-xs mb-6 leading-relaxed">
            You haven't added any dishes to your order yet. Explore our handcrafted gourmet menu and treat yourself!
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-md shadow-orange-600/20 text-sm transition-all"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Browse Digital Menu</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>Review Your Order</span>
          <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2.5 py-1 rounded-full">
            {items.reduce((s, i) => s + i.quantity, 0)} Items
          </span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Customize dining preferences and proceed to instant simulated checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                Order Items
              </span>
              <button
                onClick={clearCart}
                className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 p-4 sm:p-6 space-y-4">
              {items.map((ci) => (
                <div
                  key={ci.menuItem.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 first:pt-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img
                        src={ci.menuItem.imageUrl}
                        alt={ci.menuItem.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">
                        {ci.menuItem.name}
                      </h3>
                      <p className="text-xs text-orange-600 font-semibold">
                        {formatPrice(ci.menuItem.price)} each
                      </p>
                      {ci.specialInstructions && (
                        <p className="text-xs text-slate-500 italic mt-0.5">
                          Note: "{ci.specialInstructions}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(ci.menuItem.id, ci.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-slate-900">
                        {ci.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(ci.menuItem.id, ci.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-orange-600 text-white hover:bg-orange-700 flex items-center justify-center font-bold"
                        aria-label="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="font-black text-slate-900 text-base">
                        {formatPrice(ci.menuItem.price * ci.quantity)}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(ci.menuItem.id)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dining Preferences Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Dining Preferences</h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType("DINE_IN")}
                className={`p-3.5 rounded-2xl border text-center flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                  orderType === "DINE_IN"
                    ? "bg-orange-50 border-orange-500 text-orange-900 ring-2 ring-orange-500/20"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                <span>Dine-In at Table</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType("TAKEAWAY")}
                className={`p-3.5 rounded-2xl border text-center flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                  orderType === "TAKEAWAY"
                    ? "bg-orange-50 border-orange-500 text-orange-900 ring-2 ring-orange-500/20"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-orange-600" />
                <span>Takeaway Pickup</span>
              </button>
            </div>

            {orderType === "DINE_IN" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Your Restaurant Table *
                </label>
                <select
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  {tables.length > 0 ? (
                    tables.map((t) => (
                      <option key={t.id} value={`Table ${t.tableNumber}`}>
                        Table {t.tableNumber} ({t.location}, {t.capacity} Guests)
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Table 1">Table 1 (Window, 2 Guests)</option>
                      <option value="Table 2">Table 2 (Window, 2 Guests)</option>
                      <option value="Table 3">Table 3 (Indoor, 4 Guests)</option>
                      <option value="Table 4">Table 4 (Indoor, 4 Guests)</option>
                      <option value="Table 5">Table 5 (Indoor, 4 Guests)</option>
                    </>
                  )}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Order Notes for Kitchen (Optional)
              </label>
              <textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Allergies, packaging preferences, dining requests..."
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Col: Bill Summary & Checkout CTA */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 sticky top-24">
            <h3 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100">
              Billing Breakdown
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Restaurant GST 5% (CGST + SGST)</span>
                <span className="font-bold text-slate-900">{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Service Charge</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Grand Total</span>
                <span className="text-orange-600 text-xl font-black">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={() => setCheckoutOpen(true)}
              className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-orange-600/25 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Simulated Payment Gateway (No Real Charge)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutOpen && (
        <CheckoutModal onClose={() => setCheckoutOpen(false)} />
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { MenuItem } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { X, Plus, Minus, Flame, Sparkles, Clock, ShoppingCart } from "lucide-react";

interface MenuItemModalProps {
  item: MenuItem;
  onClose: () => void;
}

export default function MenuItemModal({ item, onClose }: MenuItemModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");

  const handleAddToCart = () => {
    addToCart(item, quantity, instructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header with Image */}
        <div className="relative h-64 w-full bg-slate-100 shrink-0">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center shadow-md transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm ${
                item.isVegetarian
                  ? "bg-emerald-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              {item.isVegetarian ? "Pure Vegetarian" : "Non-Vegetarian"}
            </span>
            {item.isPopular && (
              <span className="bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" /> Chef's Choice
              </span>
            )}
            {item.isSpicy && (
              <span className="bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                <Flame className="w-3.5 h-3.5" /> Spicy
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-black text-slate-900 leading-tight">
              {item.name}
            </h2>
            <span className="text-2xl font-black text-orange-600 shrink-0">
              {formatPrice(item.price)}
            </span>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed">
            {item.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-slate-400" />
              Prep Time: <strong>{item.preparationTime} minutes</strong>
            </span>
            <span>•</span>
            <span>Freshly Made to Order</span>
          </div>

          {/* Special Instructions Input */}
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Special Instructions / Dietary Notes (Optional)
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Extra spicy, dressing on the side, no onions..."
              rows={2}
              className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-1.5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors font-bold"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-base w-6 text-center text-slate-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700 transition-colors font-bold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
            className={`flex-1 py-3 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
              item.isAvailable
                ? "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20 active:scale-95"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>
              {item.isAvailable
                ? `Add ${quantity} to Order • ${formatPrice(item.price * quantity)}`
                : "Item Sold Out"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

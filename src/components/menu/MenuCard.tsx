"use client";

import React, { useState } from "react";
import { MenuItem } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Plus, Minus, Flame, Sparkles, Clock, Check } from "lucide-react";
import MenuItemModal from "./MenuItemModal";

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const { items, addToCart, updateQuantity } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const cartItem = items.find((ci) => ci.menuItem.id === item.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item, 1);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 1500);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(item.id, quantityInCart + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(item.id, quantityInCart - 1);
  };

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative"
      >
        {/* Image Container */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Availability Overlay */}
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                Sold Out
              </span>
            </div>
          )}

          {/* Dietary Veg/Non-Veg Badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs p-1.5 rounded-lg shadow-sm">
            <div
              className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${
                item.isVegetarian
                  ? "border-emerald-600"
                  : "border-red-600"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  item.isVegetarian ? "bg-emerald-600" : "bg-red-600"
                }`}
              />
            </div>
          </div>

          {/* Badges: Popular / Spicy */}
          <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
            {item.isPopular && (
              <span className="bg-amber-500/95 backdrop-blur-xs text-slate-950 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 fill-slate-950" />
                Popular
              </span>
            )}
            {item.isSpicy && (
              <span className="bg-red-600/90 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                <Flame className="w-3 h-3 fill-white" />
                Spicy
              </span>
            )}
          </div>
        </div>

        {/* Details Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="font-bold text-slate-900 text-base group-hover:text-orange-600 transition-colors line-clamp-1">
                {item.name}
              </h3>
            </div>

            <p className="text-slate-500 text-xs line-clamp-2 mb-3 leading-relaxed">
              {item.description}
            </p>
          </div>

          <div>
            {/* Prep Time */}
            <div className="flex items-center gap-1 text-slate-400 text-xs mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>~{item.preparationTime} mins prep</span>
            </div>

            {/* Price & Add to Cart Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-lg font-black text-slate-900">
                {formatPrice(item.price)}
              </span>

              {item.isAvailable ? (
                quantityInCart > 0 ? (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl p-1"
                  >
                    <button
                      onClick={handleDecrement}
                      className="w-7 h-7 rounded-lg bg-white text-orange-600 border border-orange-200 flex items-center justify-center font-bold hover:bg-orange-600 hover:text-white transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-5 text-center font-bold text-sm text-orange-900">
                      {quantityInCart}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold hover:bg-orange-700 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAdd}
                    className="flex items-center gap-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                )
              ) : (
                <span className="text-xs font-medium text-slate-400 italic">
                  Unavailable
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Added Toast Pill */}
        {addedToast && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xs text-white text-xs py-1 px-3 rounded-full flex items-center gap-1.5 shadow-lg animate-fade-in pointer-events-none z-10">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Added to order</span>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <MenuItemModal item={item} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}

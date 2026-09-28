"use client";

import React, { useState } from "react";
import { MenuItem } from "@/types";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import { Plus, Minus, Flame, Sparkles, Clock, Check, Star, Heart } from "lucide-react";
import MenuItemModal from "./MenuItemModal";

interface MenuCardProps {
  item: MenuItem;
  onToggleFavorite?: (itemId: string, isFav: boolean) => void;
}

export default function MenuCard({ item, onToggleFavorite }: MenuCardProps) {
  const { items, addToCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [favToast, setFavToast] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(Boolean(item.isFavorite));
  const [favLoading, setFavLoading] = useState(false);

  const cartItem = items.find((ci) => ci.menuItem.id === item.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const isOutOfStock = item.stockStatus === "OUT_OF_STOCK" || item.isAvailable === false;
  const isLowStock = item.stockStatus === "LOW_STOCK";

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(item, 1);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 1500);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    updateQuantity(item.id, quantityInCart + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateQuantity(item.id, quantityInCart - 1);
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setFavToast("Please sign in to save favorites");
      setTimeout(() => setFavToast(null), 2000);
      return;
    }

    setFavLoading(true);
    const newFavState = !isFavorite;
    setIsFavorite(newFavState);
    if (onToggleFavorite) onToggleFavorite(item.id, newFavState);

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          menuItemId: item.id,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsFavorite(data.isFavorite);
        setFavToast(data.isFavorite ? "Added to Favorites" : "Removed from Favorites");
      } else {
        // Rollback
        setIsFavorite(!newFavState);
        setFavToast("Could not update favorites");
      }
    } catch (err) {
      setIsFavorite(!newFavState);
      setFavToast("Could not update favorites");
    } finally {
      setFavLoading(false);
      setTimeout(() => setFavToast(null), 1500);
    }
  };

  // Preparation time formatted range
  const minPrep = Math.max(5, item.preparationTime - 5);
  const prepRange = `${minPrep}–${item.preparationTime} mins`;

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

          {/* Availability / Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center z-10">
              <span className="bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                Out of Stock
              </span>
            </div>
          )}

          {/* Dietary Veg/Non-Veg Badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs p-1.5 rounded-lg shadow-sm z-20">
            <div
              className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${
                item.isVegetarian
                  ? "border-emerald-600"
                  : "border-red-600"
              }`}
              title={item.isVegetarian ? "Pure Vegetarian" : "Non-Vegetarian"}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  item.isVegetarian ? "bg-emerald-600" : "bg-red-600"
                }`}
              />
            </div>
          </div>

          {/* Top Right Controls: Favorite Button & Badges */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
            {/* Wishlist / Favorite Heart Button */}
            <button
              onClick={handleFavoriteToggle}
              disabled={favLoading}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all backdrop-blur-xs ${
                isFavorite
                  ? "bg-rose-50 text-rose-600 shadow-sm"
                  : "bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white shadow-xs"
              }`}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`w-4 h-4 transition-transform ${
                  isFavorite ? "fill-rose-500 text-rose-500 scale-110" : ""
                }`}
              />
            </button>
          </div>

          {/* Secondary Badges: Low Stock, Popular, Spicy */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
            <div className="flex gap-1 items-center flex-wrap">
              {isLowStock && !isOutOfStock && (
                <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                  Low Stock
                </span>
              )}
              {item.isPopular && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-2.5 h-2.5 fill-slate-950" />
                  Popular
                </span>
              )}
              {item.isSpicy && (
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                  <Flame className="w-2.5 h-2.5 fill-white" />
                  Spicy
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Details Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-slate-900 text-base group-hover:text-orange-600 transition-colors line-clamp-1">
                {item.name}
              </h3>
            </div>

            {/* Ratings Bar */}
            <div className="flex items-center gap-2 mb-2">
              {item.reviewCount && item.reviewCount > 0 ? (
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-black text-amber-900">
                    {item.averageRating}
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    ({item.reviewCount})
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Star className="w-3 h-3 text-slate-300" />
                  <span>Chef special</span>
                </div>
              )}

              {/* Prep Time */}
              <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>~{prepRange}</span>
              </div>
            </div>

            <p className="text-slate-500 text-xs line-clamp-2 mb-3 leading-relaxed">
              {item.description}
            </p>
          </div>

          <div>
            {/* Price & Add to Cart Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-lg font-black text-slate-900">
                {formatPrice(item.price)}
              </span>

              {!isOutOfStock ? (
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
                <span className="px-2.5 py-1 bg-slate-100 text-slate-400 text-xs font-bold rounded-lg cursor-not-allowed">
                  Sold Out
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Added Toast Pill */}
        {addedToast && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xs text-white text-xs py-1 px-3 rounded-full flex items-center gap-1.5 shadow-lg animate-fade-in pointer-events-none z-30">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Added to order</span>
          </div>
        )}

        {/* Favorite Toast Pill */}
        {favToast && (
          <div className="absolute top-12 right-3 bg-slate-900/90 backdrop-blur-xs text-white text-[11px] py-1 px-2.5 rounded-lg flex items-center gap-1.5 shadow-lg animate-fade-in pointer-events-none z-30">
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
            <span>{favToast}</span>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <MenuItemModal
          item={{ ...item, isFavorite }}
          onClose={() => setModalOpen(false)}
          onToggleFavorite={handleFavoriteToggle}
        />
      )}
    </>
  );
}

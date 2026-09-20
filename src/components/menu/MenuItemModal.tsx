"use client";

import React, { useState, useEffect } from "react";
import { MenuItem, Review } from "@/types";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import {
  X,
  Plus,
  Minus,
  Flame,
  Sparkles,
  Clock,
  ShoppingCart,
  Star,
  Heart,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";

interface MenuItemModalProps {
  item: MenuItem;
  onClose: () => void;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

export default function MenuItemModal({
  item,
  onClose,
  onToggleFavorite,
}: MenuItemModalProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [activeTab, setActiveTab] = useState<"DETAILS" | "REVIEWS">("DETAILS");

  const isOutOfStock =
    item.stockStatus === "OUT_OF_STOCK" || item.isAvailable === false;
  const isLowStock = item.stockStatus === "LOW_STOCK";

  const minPrep = Math.max(5, item.preparationTime - 5);
  const prepRange = `${minPrep}–${item.preparationTime} mins`;

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch(`/api/reviews?menuItemId=${item.id}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews || []);
        }
      } catch (e) {
        console.error("Failed to load reviews", e);
      } finally {
        setLoadingReviews(false);
      }
    }
    loadReviews();
  }, [item.id]);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
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

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center z-10">
              <span className="bg-rose-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                Currently Out of Stock
              </span>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center shadow-md transition-all z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Favorite Button */}
          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className={`absolute top-4 right-16 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all z-20 backdrop-blur-xs ${
                item.isFavorite
                  ? "bg-rose-50 text-rose-600"
                  : "bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white"
              }`}
              aria-label="Toggle favorite"
            >
              <Heart
                className={`w-4 h-4 ${
                  item.isFavorite ? "fill-rose-500 text-rose-500" : ""
                }`}
              />
            </button>
          )}

          {/* Badges */}
          <div className="absolute bottom-4 left-4 flex gap-1.5 flex-wrap z-20">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 ${
                item.isVegetarian
                  ? "bg-emerald-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-white" />
              <span>{item.isVegetarian ? "Pure Veg" : "Non-Veg"}</span>
            </span>

            {isLowStock && (
              <span className="bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg text-xs font-black shadow-sm flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Low Stock
              </span>
            )}

            {item.isPopular && (
              <span className="bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" /> Chef's Choice
              </span>
            )}
            {item.isSpicy && (
              <span className="bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                <Flame className="w-3.5 h-3.5" /> Spicy
              </span>
            )}
          </div>
        </div>

        {/* Navigation Tabs (Details vs Reviews) */}
        <div className="flex border-b border-slate-100 px-6 pt-2 bg-slate-50/50">
          <button
            onClick={() => setActiveTab("DETAILS")}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === "DETAILS"
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Dish Details
          </button>
          <button
            onClick={() => setActiveTab("REVIEWS")}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === "REVIEWS"
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Customer Reviews</span>
            {reviews.length > 0 && (
              <span className="bg-orange-100 text-orange-800 text-[10px] px-1.5 py-0.2 rounded-full">
                {reviews.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === "DETAILS" ? (
            <>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  {item.name}
                </h2>
                <span className="text-2xl font-black text-orange-600 shrink-0">
                  {formatPrice(item.price)}
                </span>
              </div>

              {/* Rating Star Badge */}
              <div className="flex items-center gap-2">
                {item.reviewCount && item.reviewCount > 0 ? (
                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-black text-amber-950">
                      {item.averageRating}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      ({item.reviewCount} customer reviews)
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">Authentic recipe</span>
                )}
              </div>

              <p className="text-slate-600 text-sm leading-relaxed">
                {item.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-orange-600" />
                  Prep Time: <strong>{prepRange}</strong>
                </span>
                <span>•</span>
                <span>Freshly Cooked to Order</span>
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
            </>
          ) : (
            /* Reviews List */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Verified Diner Feedback
                </span>
                {item.averageRating && (
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-black">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{item.averageRating} / 5.0</span>
                  </div>
                )}
              </div>

              {loadingReviews ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  Loading verified guest reviews...
                </p>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-medium">
                    No reviews yet for this delicacy.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Order this dish and be the first to share your experience!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 font-bold text-[10px] flex items-center justify-center">
                            {rev.user?.name?.charAt(0) || "G"}
                          </div>
                          <span className="text-xs font-bold text-slate-800">
                            {rev.user?.name || "Verified Guest"}
                          </span>
                        </div>
                        <div className="flex items-center text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= rev.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {rev.comment && (
                        <p className="text-xs text-slate-600 leading-relaxed italic">
                          "{rev.comment}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-1.5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={isOutOfStock}
              className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors font-bold disabled:opacity-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-base w-6 text-center text-slate-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              disabled={isOutOfStock}
              className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700 transition-colors font-bold disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 py-3 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
              !isOutOfStock
                ? "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20 active:scale-95"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>
              {!isOutOfStock
                ? `Add ${quantity} to Order • ${formatPrice(item.price * quantity)}`
                : "Item Out of Stock"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

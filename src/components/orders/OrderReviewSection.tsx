"use client";

import React, { useState, useEffect } from "react";
import { Order, Review } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Star, MessageSquare, CheckCircle, Send, Loader2 } from "lucide-react";

interface OrderReviewSectionProps {
  order: Order;
}

export default function OrderReviewSection({ order }: OrderReviewSectionProps) {
  const { user } = useAuth();
  const [existingReviews, setExistingReviews] = useState<Record<string, Review>>({});
  const [loading, setLoading] = useState(true);

  // Form states per item
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<Record<string, { type: "success" | "error"; text: string }>>({});

  useEffect(() => {
    async function loadOrderReviews() {
      try {
        const res = await fetch(`/api/reviews?orderId=${order.id}`);
        if (res.ok) {
          const data = await res.json();
          const map: Record<string, Review> = {};
          (data.reviews || []).forEach((r: Review) => {
            map[r.menuItemId] = r;
          });
          setExistingReviews(map);
        }
      } catch (e) {
        console.error("Failed to load order reviews", e);
      } finally {
        setLoading(false);
      }
    }
    loadOrderReviews();
  }, [order.id]);

  const handleSetRating = (itemId: string, star: number) => {
    setRatings((prev) => ({ ...prev, [itemId]: star }));
  };

  const handleSetComment = (itemId: string, val: string) => {
    setComments((prev) => ({ ...prev, [itemId]: val }));
  };

  const handleSubmitReview = async (menuItemId: string) => {
    const rating = ratings[menuItemId] || 5;
    const comment = comments[menuItemId] || "";
    const effectiveUserId = user?.id || order.userId;

    if (!effectiveUserId) {
      setMessages((prev) => ({
        ...prev,
        [menuItemId]: { type: "error", text: "Please sign in to submit a rating" },
      }));
      return;
    }

    setSubmitting((prev) => ({ ...prev, [menuItemId]: true }));
    setMessages((prev) => ({ ...prev, [menuItemId]: { type: "success", text: "" } }));

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment,
          menuItemId,
          userId: effectiveUserId,
          orderId: order.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => ({
          ...prev,
          [menuItemId]: { type: "error", text: data.error || "Failed to submit review" },
        }));
      } else {
        setExistingReviews((prev) => ({
          ...prev,
          [menuItemId]: data,
        }));
        setMessages((prev) => ({
          ...prev,
          [menuItemId]: { type: "success", text: "Review submitted! Thank you." },
        }));
      }
    } catch (e: any) {
      setMessages((prev) => ({
        ...prev,
        [menuItemId]: { type: "error", text: "Network error submitting review" },
      }));
    } finally {
      setSubmitting((prev) => ({ ...prev, [menuItemId]: false }));
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Rate & Review Your Dishes
            </h3>
            <p className="text-xs text-slate-500">
              Share your culinary experience with the chef and fellow diners.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-xs text-slate-400 py-4 text-center">
          Loading dish reviews...
        </p>
      ) : (
        <div className="space-y-4 divide-y divide-slate-100">
          {order.items.map((item) => {
            const menuItem = item.menuItem;
            const existing = existingReviews[menuItem.id];
            const currentRating = ratings[menuItem.id] || 5;
            const currentComment = comments[menuItem.id] || "";
            const isSubmitting = submitting[menuItem.id] || false;
            const message = messages[menuItem.id];

            return (
              <div key={item.id} className="pt-4 first:pt-0 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={menuItem.imageUrl}
                      alt={menuItem.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {menuItem.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {item.quantity}x ordered
                      </p>
                    </div>
                  </div>

                  {existing ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Reviewed</span>
                    </div>
                  ) : null}
                </div>

                {existing ? (
                  /* Already reviewed: show submitted rating and comment */
                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= existing.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                      <span className="text-slate-700 font-bold ml-1.5">
                        {existing.rating} / 5 Stars
                      </span>
                    </div>
                    {existing.comment && (
                      <p className="text-slate-600 italic">
                        "{existing.comment}"
                      </p>
                    )}
                    <span className="text-[10px] text-slate-400 block pt-0.5">
                      Your feedback has been recorded.
                    </span>
                  </div>
                ) : (
                  /* Not reviewed yet: interactive form */
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        Your Rating:
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleSetRating(menuItem.id, star)}
                            className="p-1 text-amber-400 hover:scale-115 transition-transform"
                            aria-label={`Rate ${star} stars`}
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= currentRating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentComment}
                        onChange={(e) => handleSetComment(menuItem.id, e.target.value)}
                        placeholder="Share a short review (e.g. Delicious spices, perfectly cooked)..."
                        className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleSubmitReview(menuItem.id)}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-2xs"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        <span>Submit</span>
                      </button>
                    </div>

                    {message && (
                      <p
                        className={`text-[11px] font-medium ${
                          message.type === "success"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {message.text}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

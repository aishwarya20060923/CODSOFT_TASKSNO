"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Shield,
  UtensilsCrossed,
  Calendar,
  LogOut,
  Heart,
  ShoppingCart,
  Trash2,
  Clock,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saved, setSaved] = useState(false);

  // Favorites state
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [cartToast, setCartToast] = useState<string | null>(null);

  const fetchFavorites = async () => {
    if (!user) return;
    setLoadingFavorites(true);
    try {
      const res = await fetch(`/api/favorites?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setFavorites(data || []);
      }
    } catch (e) {
      console.error("Failed to load favorites", e);
    } finally {
      setLoadingFavorites(false);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      fetchFavorites();
    }
  }, [user]);

  const handleRemoveFavorite = async (menuItemId: string) => {
    if (!user) return;
    try {
      await fetch(`/api/favorites?userId=${user.id}&menuItemId=${menuItemId}`, {
        method: "DELETE",
      });
      setFavorites((prev) => prev.filter((f) => f.menuItemId !== menuItemId));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddToCartFromFavorites = (menuItem: any) => {
    addToCart(menuItem, 1);
    setCartToast(`Added ${menuItem.name} to cart`);
    setTimeout(() => setCartToast(null), 1800);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
          <User className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Sign in to view your profile</h2>
          <p className="text-xs text-slate-500">Access saved orders, reservations, and favorite dishes.</p>
          <Link
            href="/login"
            className="inline-block w-full py-3 bg-orange-600 text-white rounded-xl font-bold text-xs hover:bg-orange-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      ...user,
      name,
      phone,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Account Profile & Favorites
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal dining details, contact preferences, and saved favorite delicacies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-orange-100 border-2 border-orange-200 text-orange-700 flex items-center justify-center font-bold text-2xl mx-auto overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name.charAt(0)
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>

          <div className="pt-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200">
              Role: {user.role}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2 text-xs">
            <Link
              href="/orders"
              className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold flex items-center justify-between"
            >
              <span>View Past Orders</span>
              <UtensilsCrossed className="w-3.5 h-3.5 text-orange-600" />
            </Link>
            <Link
              href="/reservations"
              className="py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold flex items-center justify-between"
            >
              <span>View Reservations</span>
              <Calendar className="w-3.5 h-3.5 text-orange-600" />
            </Link>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold flex items-center justify-between mt-2"
            >
              <span>Sign Out</span>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Edit Details Form */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <h3 className="font-extrabold text-slate-900 text-base mb-4">Edit Information</h3>
          {saved && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 font-semibold">
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Email cannot be changed directly in demo mode.</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98300 12345"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="py-2.5 px-6 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Favorites / Wishlist Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">My Favorite Dishes</h3>
              <p className="text-[11px] text-slate-400">Your handpicked dining shortlist</p>
            </div>
          </div>
          <span className="text-xs bg-rose-50 text-rose-700 font-bold px-2.5 py-1 rounded-full border border-rose-200">
            {favorites.length} Saved
          </span>
        </div>

        {cartToast && (
          <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold animate-fade-in">
            {cartToast}
          </div>
        )}

        {loadingFavorites ? (
          <p className="text-xs text-slate-400 py-6 text-center">Loading your favorites...</p>
        ) : favorites.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <Heart className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No favorite dishes saved yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click the heart icon on any dish across the digital menu to save it to your personal dining shortlist!
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Explore Food Menu</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {favorites.map((fav) => {
              const item = fav.menuItem;
              if (!item) return null;
              return (
                <div
                  key={fav.id}
                  className="bg-slate-50 rounded-2xl border border-slate-200/80 p-3.5 flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-18 h-18 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div
                          className={`w-3 h-3 rounded-xs border flex items-center justify-center shrink-0 ${
                            item.isVegetarian ? "border-emerald-600" : "border-red-600"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.isVegetarian ? "bg-emerald-600" : "bg-red-600"
                            }`}
                          />
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs truncate">
                          {item.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1">
                        {item.reviewCount > 0 ? (
                          <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {item.averageRating}
                          </span>
                        ) : null}
                        <span className="flex items-center gap-0.5 text-slate-400">
                          <Clock className="w-3 h-3" />
                          ~{item.preparationTime}m
                        </span>
                      </div>

                      <p className="text-xs font-black text-slate-900">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                    <button
                      onClick={() => handleAddToCartFromFavorites(item)}
                      disabled={item.stockStatus === "OUT_OF_STOCK" || item.isAvailable === false}
                      className="flex-1 py-1.5 px-3 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 disabled:text-slate-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>{item.stockStatus === "OUT_OF_STOCK" ? "Sold Out" : "Order"}</span>
                    </button>
                    <button
                      onClick={() => handleRemoveFavorite(item.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

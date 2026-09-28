"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MenuItem, MenuCategory } from "@/types";
import MenuCard from "@/components/menu/MenuCard";
import {
  UtensilsCrossed,
  Calendar,
  Sparkles,
  ChefHat,
  Clock,
  ShieldCheck,
  ArrowRight,
  Star,
  Flame,
  Award,
} from "lucide-react";

export default function HomePage() {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [itemsRes, catRes] = await Promise.all([
          fetch("/api/menu"),
          fetch("/api/categories"),
        ]);
        if (itemsRes.ok && catRes.ok) {
          const itemsData: MenuItem[] = await itemsRes.json();
          const catData: MenuCategory[] = await catRes.json();
          setFeaturedItems(itemsData.filter((i) => i.isPopular).slice(0, 6));
          setCategories(catData);
        }
      } catch (e) {
        console.error("Failed to load landing data", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-28">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 opacity-25 mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&auto=format&fit=crop&q=80"
            alt="Restaurant Ambiance"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Award-Winning Culinary Experience
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Savor Gourmet Craftsmanship at{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                DineDesk
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Immerse yourself in artisanal flavors crafted with heritage recipes, local farm-fresh ingredients, and modern culinary flair. Order directly to your table or reserve your spot today.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/menu"
                className="px-7 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold rounded-2xl shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all hover:scale-105"
              >
                <UtensilsCrossed className="w-5 h-5" />
                <span>Order Food Now</span>
              </Link>

              <Link
                href="/reservations"
                className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-2xl backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105"
              >
                <Calendar className="w-5 h-5" />
                <span>Reserve a Table</span>
              </Link>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800">
              <div>
                <p className="text-2xl font-black text-orange-400">4.9 ★</p>
                <p className="text-xs text-slate-400">2,500+ Reviews</p>
              </div>
              <div>
                <p className="text-2xl font-black text-amber-400">15 min</p>
                <p className="text-xs text-slate-400">Avg. Prep Time</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-400">100%</p>
                <p className="text-xs text-slate-400">Fresh Ingredients</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Menu Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Explore Our Digital Menu
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Curated Categories
            </h2>
          </div>
          <Link
            href="/menu"
            className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/menu?category=${cat.slug}`}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-orange-500 hover:shadow-lg transition-all text-center p-3 flex flex-col items-center justify-between"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden mb-2 shadow-xs group-hover:scale-105 transition-transform">
                <img
                  src={cat.imageUrl || ""}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-orange-600 transition-colors">
                  {cat.name}
                </h3>
                {cat._count && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {cat._count.items} dishes
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Chef's Specials / Featured Dishes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600">
              <Sparkles className="w-4 h-4" />
              <span>Chef's Masterpieces</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Popular & Trending Dishes
            </h2>
          </div>
          <Link
            href="/menu"
            className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
          >
            <span>See all {featuredItems.length > 0 ? "dishes" : ""}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-80 bg-slate-200 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Platform Workflow: How DineDesk Works */}
      <section className="bg-gradient-to-b from-slate-100 to-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Seamless Hospitality Tech
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-1">
              How DineDesk Operates
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              A synchronized ecosystem connecting diners, kitchen line chefs, and administrators in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all text-center">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4 font-black text-xl">
                1
              </div>
              <h3 className="font-black text-lg text-slate-900 mb-2">Digital Discovery</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Explore interactive menus with dietary filters, photos, and live availability. Order for dine-in or takeaway with custom requests.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 font-black text-xl">
                2
              </div>
              <h3 className="font-black text-lg text-slate-900 mb-2">Live Kitchen Dispatch</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Tickets flow directly to the Kitchen Display System (KDS). Line cooks accept, prep, and update order statuses in real-time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 font-black text-xl">
                3
              </div>
              <h3 className="font-black text-lg text-slate-900 mb-2">Tracking & Table Service</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Guests monitor order progress through 5 dynamic stages or arrive at their reserved table with seamless confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Reservation Banner Call-to-Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-600 to-amber-600 text-white p-8 sm:p-12 shadow-xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              Instant Booking Available
            </span>
            <h2 className="text-3xl sm:text-4xl font-black">
              Reserve Your Table for Tonight
            </h2>
            <p className="text-orange-100 text-sm leading-relaxed">
              Planning a date night, birthday celebration, or business banquet? Pick your dining zone (Window, Indoor, Outdoor, Private) and secure your table with zero double-booking hassle.
            </p>
            <div className="pt-2">
              <Link
                href="/reservations"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-2xl shadow-lg transition-all hover:scale-105"
              >
                <Calendar className="w-4 h-4 text-orange-400" />
                <span>Book a Table Now</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

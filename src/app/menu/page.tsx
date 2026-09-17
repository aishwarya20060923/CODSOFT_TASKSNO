"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MenuItem, MenuCategory } from "@/types";
import MenuCard from "@/components/menu/MenuCard";
import MenuFilters from "@/components/menu/MenuFilters";
import { UtensilsCrossed, Sparkles, Loader2 } from "lucide-react";

function MenuPageContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [spicyOnly, setSpicyOnly] = useState(false);

  // Sync category param if URL changes
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  // Load Menu Items and Categories
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [catRes, itemRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/menu"),
        ]);
        if (catRes.ok && itemRes.ok) {
          const catData = await catRes.json();
          const itemData = await itemRes.json();
          setCategories(catData);
          setItems(itemData);
        }
      } catch (err) {
        console.error("Error fetching menu:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter items in memory for instantaneous user experience
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category Match
      if (activeCategory !== "all" && item.category?.slug !== activeCategory) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }

      // Vegetarian filter
      if (vegOnly && !item.isVegetarian) {
        return false;
      }

      // Spicy filter
      if (spicyOnly && !item.isSpicy) {
        return false;
      }

      return true;
    });
  }, [items, activeCategory, searchQuery, vegOnly, spicyOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-2">
          <UtensilsCrossed className="w-3.5 h-3.5" />
          Chef-Curated Digital Menu
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Explore Our Gastronomic Selections
        </h1>
        <p className="text-slate-600 text-sm mt-2">
          Handcrafted artisanal recipes made to order with authentic seasonal ingredients.
        </p>
      </div>

      {/* Filter Component */}
      <MenuFilters
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        vegOnly={vegOnly}
        onToggleVeg={() => setVegOnly(!vegOnly)}
        spicyOnly={spicyOnly}
        onToggleSpicy={() => setSpicyOnly(!spicyOnly)}
      />

      {/* Item Counter / Filter Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-6 px-1">
        <span>
          Showing <strong>{filteredItems.length}</strong> delicacies
          {activeCategory !== "all" && ` in ${categories.find(c => c.slug === activeCategory)?.name || activeCategory}`}
        </span>
        {(searchQuery || vegOnly || spicyOnly || activeCategory !== "all") && (
          <button
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
              setVegOnly(false);
              setSpicyOnly(false);
            }}
            className="text-orange-600 font-bold hover:underline"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Grid of Dishes */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="h-80 bg-slate-200 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No dishes match your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Try adjusting your search query, dietary preferences, or selecting another category.
          </p>
          <button
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
              setVegOnly(false);
              setSpicyOnly(false);
            }}
            className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-xs font-semibold">Loading Chef's Digital Menu...</p>
        </div>
      }
    >
      <MenuPageContent />
    </Suspense>
  );
}

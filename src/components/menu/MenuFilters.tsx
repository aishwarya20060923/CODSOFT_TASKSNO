"use client";

import React from "react";
import { MenuCategory } from "@/types";
import { Search, Flame, X } from "lucide-react";

interface MenuFiltersProps {
  categories: MenuCategory[];
  activeCategory: string;
  onSelectCategory: (slug: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  dietaryFilter?: "all" | "veg" | "nonveg";
  onSelectDietary?: (d: "all" | "veg" | "nonveg") => void;
  vegOnly?: boolean;
  onToggleVeg?: () => void;
  spicyOnly: boolean;
  onToggleSpicy: () => void;
}

export default function MenuFilters({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  dietaryFilter = "all",
  onSelectDietary,
  vegOnly = false,
  onToggleVeg,
  spicyOnly,
  onToggleSpicy,
}: MenuFiltersProps) {
  // Normalize dietary filter mode
  const currentDietary = onSelectDietary
    ? dietaryFilter
    : vegOnly
    ? "veg"
    : "all";

  const handleSetDietary = (val: "all" | "veg" | "nonveg") => {
    if (onSelectDietary) {
      onSelectDietary(val);
    } else if (onToggleVeg) {
      if (val === "veg" && !vegOnly) onToggleVeg();
      if (val === "all" && vegOnly) onToggleVeg();
    }
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Top Controls: Search Bar & Toggle Pills */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by dish name, ingredient..."
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dietary Filters & Spicy Toggle */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {/* Segmented Dietary Group: All | Veg | Non-Veg */}
          <div className="inline-flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-2xs shrink-0">
            <button
              onClick={() => handleSetDietary("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentDietary === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              All
            </button>

            <button
              onClick={() => handleSetDietary("veg")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentDietary === "veg"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50"
              }`}
            >
              <div className={`w-3 h-3 rounded-xs border flex items-center justify-center ${
                currentDietary === "veg" ? "border-white" : "border-emerald-600"
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  currentDietary === "veg" ? "bg-white" : "bg-emerald-600"
                }`} />
              </div>
              <span>Veg</span>
            </button>

            <button
              onClick={() => handleSetDietary("nonveg")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentDietary === "nonveg"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-rose-700 hover:bg-rose-50/50"
              }`}
            >
              <div className={`w-3 h-3 rounded-xs border flex items-center justify-center ${
                currentDietary === "nonveg" ? "border-white" : "border-rose-600"
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  currentDietary === "nonveg" ? "bg-white" : "bg-rose-600"
                }`} />
              </div>
              <span>Non-Veg</span>
            </button>
          </div>

          {/* Spicy Dishes Toggle */}
          <button
            onClick={onToggleSpicy}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border shrink-0 ${
              spicyOnly
                ? "bg-red-50 text-red-800 border-red-300 ring-2 ring-red-500/20 shadow-2xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-red-600" />
            <span>Spicy Dishes</span>
          </button>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 pt-1">
        <button
          onClick={() => onSelectCategory("all")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeCategory === "all"
              ? "bg-orange-600 text-white shadow-md shadow-orange-600/20 scale-102"
              : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          All Delicacies
        </button>

        {categories.map((cat) => {
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-orange-600 text-white shadow-md shadow-orange-600/20 scale-102"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{cat.name}</span>
              {cat._count && cat._count.items > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {cat._count.items}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Order, OrderStatus } from "@/types";
import KitchenOrderCard from "@/components/kitchen/KitchenOrderCard";
import {
  ChefHat,
  Bell,
  RefreshCw,
  Clock,
  CheckCircle2,
  Filter,
  Flame,
  UtensilsCrossed,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react";

function KitchenDashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "ACTIVE";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [prevOrderCount, setPrevOrderCount] = useState(0);

  const fetchOrders = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data: Order[] = await res.json();
        
        // Sound notification check if new order arrives
        const placedCount = data.filter((o) => o.status === "PLACED").length;
        if (soundEnabled && placedCount > prevOrderCount && prevOrderCount > 0) {
          playBeep();
        }
        setPrevOrderCount(placedCount);
        setOrders(data);
      }
    } catch (e) {
      console.error("Failed to fetch kitchen orders", e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // AudioContext not allowed before user interaction
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 4000);
    return () => clearInterval(interval);
  }, [soundEnabled, prevOrderCount]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? updated : o))
        );
      }
    } catch (e) {
      console.error("Status update error", e);
    }
  };

  // Status Metrics
  const placedOrders = orders.filter((o) => o.status === "PLACED");
  const acceptedOrders = orders.filter((o) => o.status === "ACCEPTED");
  const preparingOrders = orders.filter((o) => o.status === "PREPARING");
  const readyOrders = orders.filter((o) => o.status === "READY");
  const completedOrders = orders.filter((o) => o.status === "COMPLETED");

  const activeOrders = orders.filter((o) =>
    ["PLACED", "ACCEPTED", "PREPARING", "READY"].includes(o.status)
  );

  // Tab Filtering
  const displayedOrders = (() => {
    switch (activeTab) {
      case "PLACED":
        return placedOrders;
      case "PREPARING":
        return [...acceptedOrders, ...preparingOrders];
      case "READY":
        return readyOrders;
      case "COMPLETED":
        return completedOrders;
      case "ACTIVE":
      default:
        return activeOrders;
    }
  })();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <ChefHat className="w-4 h-4" />
            <span>Kitchen Display System (KDS)</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span>Live Kitchen Order Board</span>
            {placedOrders.length > 0 && (
              <span className="text-xs bg-red-600 text-white font-black px-2.5 py-1 rounded-full animate-bounce">
                {placedOrders.length} New
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time incoming orders, ticket status progression, and queue fulfillment.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border ${
              soundEnabled
                ? "bg-slate-900 text-white border-slate-800"
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            <span>{soundEnabled ? "Alert Sound ON" : "Muted"}</span>
          </button>

          {/* Manual Refresh */}
          <button
            onClick={() => fetchOrders(false)}
            disabled={isRefreshing}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-orange-600" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => setActiveTab("PLACED")}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeTab === "PLACED"
              ? "bg-amber-500 text-slate-950 border-amber-600 shadow-md ring-2 ring-amber-400/50"
              : "bg-white border-slate-200 hover:border-amber-400"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">New Placed</span>
            <Bell className="w-4 h-4" />
          </div>
          <p className="text-3xl font-black mt-2 font-mono">{placedOrders.length}</p>
        </div>

        <div
          onClick={() => setActiveTab("PREPARING")}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeTab === "PREPARING"
              ? "bg-orange-500 text-white border-orange-600 shadow-md ring-2 ring-orange-400/50"
              : "bg-white border-slate-200 hover:border-orange-400"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Cooking</span>
            <Flame className="w-4 h-4" />
          </div>
          <p className="text-3xl font-black mt-2 font-mono">
            {acceptedOrders.length + preparingOrders.length}
          </p>
        </div>

        <div
          onClick={() => setActiveTab("READY")}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeTab === "READY"
              ? "bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400/50"
              : "bg-white border-slate-200 hover:border-emerald-400"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">Ready for Service</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-3xl font-black mt-2 font-mono">{readyOrders.length}</p>
        </div>

        <div
          onClick={() => setActiveTab("ACTIVE")}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            activeTab === "ACTIVE"
              ? "bg-slate-900 text-white border-slate-950 shadow-md ring-2 ring-slate-700"
              : "bg-white border-slate-200 hover:border-slate-400"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider">All Active</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-3xl font-black mt-2 font-mono">{activeOrders.length}</p>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { key: "ACTIVE", label: "All Active Tickets", count: activeOrders.length },
          { key: "PLACED", label: "New Incoming", count: placedOrders.length },
          { key: "PREPARING", label: "In Kitchen Prep", count: acceptedOrders.length + preparingOrders.length },
          { key: "READY", label: "Ready for Pickup", count: readyOrders.length },
          { key: "COMPLETED", label: "Fulfilled / History", count: completedOrders.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === tab.key
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === tab.key ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 bg-slate-200 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : displayedOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
          <ChefHat className="w-14 h-14 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-lg">No Orders in this Queue</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {activeTab === "ACTIVE"
              ? "Kitchen order queue is currently clear! New incoming tickets will display here automatically."
              : `There are currently no tickets marked as "${activeTab}".`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedOrders.map((order) => (
            <KitchenOrderCard
              key={order.id}
              order={order}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function KitchenDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-xs font-semibold">Loading Kitchen Display System...</p>
        </div>
      }
    >
      <KitchenDashboardContent />
    </Suspense>
  );
}

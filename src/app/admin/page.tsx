"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
  DollarSign,
  ShoppingBag,
  Calendar,
  Users,
  UtensilsCrossed,
  Layers,
  MapPin,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Clock,
  Shield,
  RefreshCw,
} from "lucide-react";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Failed to load admin stats", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
            <Shield className="w-4 h-4" />
            <span>Executive Administration</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Restaurant Operations & Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time business performance, incoming orders, revenue, and table bookings.
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-orange-600" : ""}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">
            {stats ? formatPrice(stats.totalRevenue) : "$0.00"}
          </p>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{stats ? formatPrice(stats.todayRevenue) : "$0.00"} today</span>
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Orders
            </span>
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">
            {stats ? stats.totalOrders : 0}
          </p>
          <p className="text-xs text-orange-600 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{stats ? stats.todayOrders : 0} orders today</span>
          </p>
        </div>

        {/* Active Reservations */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Table Bookings
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">
            {stats ? stats.activeReservations : 0}
          </p>
          <p className="text-xs text-purple-600 font-semibold">
            <span>Active & confirmed guest bookings</span>
          </p>
        </div>

        {/* Registered Customers */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Customer Accounts
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">
            {stats ? stats.totalCustomers : 0}
          </p>
          <p className="text-xs text-blue-600 font-semibold">
            <span>Registered restaurant patrons</span>
          </p>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link
          href="/admin/orders"
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-orange-500 hover:shadow-md transition-all text-center group"
        >
          <ShoppingBag className="w-6 h-6 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-xs text-slate-900">Manage Orders</h4>
        </Link>

        <Link
          href="/admin/menu"
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-orange-500 hover:shadow-md transition-all text-center group"
        >
          <UtensilsCrossed className="w-6 h-6 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-xs text-slate-900">Food Menu</h4>
        </Link>

        <Link
          href="/admin/categories"
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-orange-500 hover:shadow-md transition-all text-center group"
        >
          <Layers className="w-6 h-6 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-xs text-slate-900">Categories</h4>
        </Link>

        <Link
          href="/admin/tables"
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-orange-500 hover:shadow-md transition-all text-center group"
        >
          <MapPin className="w-6 h-6 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-xs text-slate-900">Tables</h4>
        </Link>

        <Link
          href="/admin/reservations"
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-orange-500 hover:shadow-md transition-all text-center group"
        >
          <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-xs text-slate-900">Reservations</h4>
        </Link>

        <Link
          href="/admin/customers"
          className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-orange-500 hover:shadow-md transition-all text-center group"
        >
          <Users className="w-6 h-6 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-xs text-slate-900">Customers</h4>
        </Link>
      </div>

      {/* Two Column Section: Popular Items & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Popular Dishes (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Top Selling Dishes</span>
            </h3>
            <Link href="/admin/menu" className="text-xs text-orange-600 font-bold hover:underline">
              Menu items
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.popularDishes && stats.popularDishes.length > 0 ? (
              stats.popularDishes.map((pd: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 font-black text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 text-xs truncate max-w-[170px]">
                        {pd.item?.name || "Dish Item"}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {pd.item?.price ? formatPrice(pd.item.price) : ""}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-800 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                    {pd.ordersCount} sold
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No sales data recorded yet.</p>
            )}
          </div>
        </div>

        {/* Recent Orders Log (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-base">Recent Order Tickets</h3>
            <Link href="/admin/orders" className="text-xs text-orange-600 font-bold hover:underline">
              View all orders
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((ord: any) => (
                <div key={ord.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-slate-900">{ord.orderNumber}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-slate-700">{ord.customerName}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {ord.orderType === "DINE_IN" ? `Dine-In (${ord.tableNumber || "Table"})` : "Takeaway"} • {ord.items.length} items
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">{formatPrice(ord.totalAmount)}</span>
                    <span
                      className={`inline-block font-bold text-[10px] px-2 py-0.2 rounded-md uppercase ${
                        ord.status === "COMPLETED"
                          ? "bg-slate-100 text-slate-700"
                          : ord.status === "READY"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No recent orders found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

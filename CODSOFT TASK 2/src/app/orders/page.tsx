"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Order } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  ArrowRight,
  Clock,
  CheckCircle,
  Search,
  RotateCw,
  UtensilsCrossed,
} from "lucide-react";

export default function OrdersHistoryPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = user?.id ? `/api/orders?userId=${user.id}` : `/api/orders`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error("Error fetching orders:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const filteredOrders = orders.filter((o) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(term) ||
      o.customerName.toLowerCase().includes(term) ||
      o.items.some((i) => i.menuItem.name.toLowerCase().includes(term))
    );
  });

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item.menuItem, item.quantity);
    });
    alert(`Re-added ${order.items.length} dishes to your dining cart!`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PLACED":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "ACCEPTED":
        return "bg-blue-100 text-blue-900 border-blue-300";
      case "PREPARING":
        return "bg-orange-100 text-orange-900 border-orange-300";
      case "READY":
        return "bg-emerald-100 text-emerald-900 border-emerald-300";
      case "COMPLETED":
        return "bg-slate-100 text-slate-800 border-slate-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            My Order History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track active live orders or review past culinary receipts.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search order # or dish name..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800">No Orders Found</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 mb-4">
            {searchTerm ? "No orders match your search term." : "You haven't placed any orders yet."}
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Explore Menu</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Order Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-lg text-slate-900">
                    {order.orderNumber}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {order.orderType === "DINE_IN"
                      ? `Dine-In (${order.tableNumber || "Table"})`
                      : "Takeaway"}
                  </span>
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-4">
                  <span>
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span>•</span>
                  <span>{order.customerName}</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-700">
                    {order.paymentStatus} ({order.paymentMethod})
                  </span>
                </div>

                {/* Items preview snippet */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {order.items.map((item) => (
                    <span
                      key={item.id}
                      className="inline-block bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-lg"
                    >
                      <strong>{item.quantity}x</strong> {item.menuItem.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Total & Action Buttons */}
              <div className="flex items-center justify-between md:justify-end gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-left md:text-right">
                  <span className="text-[11px] text-slate-400 block">Total Amount</span>
                  <span className="text-xl font-black text-slate-900">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReorder(order)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Order Again"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Re-Order</span>
                  </button>

                  <Link
                    href={`/track/${order.id}`}
                    className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-orange-600/20 transition-all"
                  >
                    <span>Track Live</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

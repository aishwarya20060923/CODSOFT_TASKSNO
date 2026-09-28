"use client";

import React, { useState, useEffect } from "react";
import { Order, OrderStatus } from "@/types";
import { formatPrice } from "@/lib/utils";
import OrderReceipt from "@/components/orders/OrderReceipt";
import {
  ShoppingBag,
  Search,
  Eye,
  CheckCircle,
  X,
  Clock,
  Printer,
  ChevronDown,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [inspectOrder, setInspectOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
        if (inspectOrder?.id === orderId) {
          setInspectOrder(updated);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "ALL" && o.status !== statusFilter) return false;
    if (typeFilter !== "ALL" && o.orderType !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Master Order Log</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Customer Orders Book
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Live order tracking, bill receipts, payment status overrides, and dining records.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, guest name, phone..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="DINE_IN">Dine-In</option>
            <option value="TAKEAWAY">Takeaway</option>
          </select>

          {["ALL", "PLACED", "ACCEPTED", "PREPARING", "READY", "COMPLETED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-16 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800">No Orders Found</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
            Try adjusting your search query or filter tags.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Dining Type</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total & Payment</th>
                  <th className="p-4">Status Override</th>
                  <th className="p-4 text-right">View Ticket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-black text-slate-900 text-sm">
                      {ord.orderNumber}
                    </td>

                    <td className="p-4">
                      <strong className="text-slate-900 block font-bold">{ord.customerName}</strong>
                      <span className="text-[11px] text-slate-500">{ord.customerPhone}</span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block font-bold px-2 py-0.5 rounded text-[10px] ${
                          ord.orderType === "DINE_IN"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-teal-100 text-teal-800"
                        }`}
                      >
                        {ord.orderType === "DINE_IN"
                          ? `Dine-In (${ord.tableNumber || "Table"})`
                          : "Takeaway"}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-slate-700">
                        {ord.items.reduce((s, i) => s + i.quantity, 0)} items
                      </span>
                      <p className="text-[10px] text-slate-400 truncate max-w-xs">
                        {ord.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(", ")}
                      </p>
                    </td>

                    <td className="p-4">
                      <span className="font-black text-slate-900 text-sm block">
                        {formatPrice(ord.totalAmount)}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                        {ord.paymentStatus} ({ord.paymentMethod})
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                          ord.status === "COMPLETED"
                            ? "bg-slate-100 text-slate-700 border-slate-300"
                            : ord.status === "READY"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : ord.status === "PREPARING"
                            ? "bg-orange-50 text-orange-800 border-orange-300"
                            : ord.status === "ACCEPTED"
                            ? "bg-blue-50 text-blue-800 border-blue-300"
                            : "bg-amber-50 text-amber-800 border-amber-300"
                        }`}
                      >
                        <option value="PLACED">PLACED</option>
                        <option value="ACCEPTED">ACCEPTED</option>
                        <option value="PREPARING">PREPARING</option>
                        <option value="READY">READY</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setInspectOrder(ord)}
                        className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors inline-flex items-center gap-1 text-xs font-bold"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect / Receipt Modal */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setInspectOrder(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold"
            >
              <X className="w-5 h-5" />
            </button>
            <OrderReceipt order={inspectOrder} />
          </div>
        </div>
      )}
    </div>
  );
}

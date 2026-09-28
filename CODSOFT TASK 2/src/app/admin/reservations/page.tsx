"use client";

import React, { useState, useEffect } from "react";
import { Reservation } from "@/types";
import { Calendar, Clock, Users, Phone, Search, Trash2, CheckCircle2 } from "lucide-react";

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reservations");
      if (res.ok) {
        const data = await res.json();
        setReservations(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? updated : r))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Cancel and delete this reservation?")) return;
    try {
      const res = await fetch(`/api/reservations/${id}`, { method: "DELETE" });
      if (res.ok) {
        setReservations((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = reservations.filter((r) => {
    if (selectedStatus !== "ALL" && r.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.reservationNumber.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.customerPhone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700 mb-1">
            <Calendar className="w-4 h-4" />
            <span>Table Bookings</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Guest Reservations Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor incoming party bookings, seat arriving diners, and manage floor capacity.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reservation #, guest name, phone..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {["ALL", "CONFIRMED", "SEATED", "COMPLETED", "CANCELLED"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedStatus === st
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations Table */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-16 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800">No Reservations Found</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
            No party bookings match your search query or filter.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-4">Reservation #</th>
                  <th className="p-4">Guest Details</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Party Size</th>
                  <th className="p-4">Table</th>
                  <th className="p-4">Status Action</th>
                  <th className="p-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-black text-slate-900 text-sm">
                      {res.reservationNumber}
                    </td>

                    <td className="p-4">
                      <strong className="text-slate-900 block font-bold">{res.customerName}</strong>
                      <span className="text-[11px] text-slate-500">{res.customerPhone}</span>
                      {res.specialRequests && (
                        <p className="text-[10px] text-orange-600 italic mt-0.5 max-w-xs">
                          Req: {res.specialRequests}
                        </p>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-slate-800 block">{res.date}</span>
                      <span className="text-[11px] text-orange-600 font-semibold">{res.timeSlot}</span>
                    </td>

                    <td className="p-4 font-bold text-slate-700">
                      {res.guestCount} Guests
                    </td>

                    <td className="p-4">
                      {res.table ? (
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-bold">
                          Table {res.table.tableNumber} ({res.table.location})
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="p-4">
                      <select
                        value={res.status}
                        onChange={(e) => handleStatusChange(res.id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                          res.status === "CONFIRMED"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : res.status === "SEATED"
                            ? "bg-blue-50 text-blue-800 border-blue-300"
                            : res.status === "COMPLETED"
                            ? "bg-slate-100 text-slate-700 border-slate-300"
                            : "bg-red-50 text-red-800 border-red-300"
                        }`}
                      >
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="SEATED">SEATED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(res.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

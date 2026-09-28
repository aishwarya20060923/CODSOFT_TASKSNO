"use client";

import React, { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { Users, Search, ShoppingBag, Calendar, DollarSign, Mail, Phone } from "lucide-react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone && c.phone.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
            <Users className="w-4 h-4" />
            <span>Customer Relations</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Registered Customers & Diners
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track dining patronage, lifetime food spend, and table reservation history.
          </p>
        </div>
      </div>

      <div className="relative max-w-sm w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer name, email, phone..."
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800">No Customers Found</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
            No patrons match your search query.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Orders Placed</th>
                  <th className="p-4">Table Bookings</th>
                  <th className="p-4">Lifetime Spend</th>
                  <th className="p-4 text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-sm border border-orange-200 overflow-hidden shrink-0">
                          {cust.avatar ? (
                            <img src={cust.avatar} alt={cust.name} className="w-full h-full object-cover" />
                          ) : (
                            cust.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <strong className="text-slate-900 block font-bold text-sm">
                            {cust.name}
                          </strong>
                          <span className="text-[11px] text-slate-400">DineDesk Member</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="text-slate-700 flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{cust.email}</span>
                        </span>
                        {cust.phone && (
                          <span className="text-slate-500 flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{cust.phone}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 font-bold text-slate-800">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                        {cust.ordersCount} Orders
                      </span>
                    </td>

                    <td className="p-4 font-bold text-slate-800">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                        {cust.reservationsCount} Bookings
                      </span>
                    </td>

                    <td className="p-4 font-black text-emerald-700 text-sm">
                      {formatPrice(cust.totalSpent)}
                    </td>

                    <td className="p-4 text-right text-slate-400">
                      {new Date(cust.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
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

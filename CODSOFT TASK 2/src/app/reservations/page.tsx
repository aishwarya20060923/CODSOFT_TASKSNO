"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Reservation, RestaurantTable } from "@/types";
import {
  Calendar,
  Clock,
  Users,
  UtensilsCrossed,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Sparkles,
  Phone,
  Mail,
  User as UserIcon,
} from "lucide-react";

const TIME_SLOTS = [
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
  "08:30 PM",
  "09:00 PM",
];

export default function ReservationsPage() {
  const { user } = useAuth();

  // Booking Form State
  const todayStr = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(todayStr);
  const [timeSlot, setTimeSlot] = useState("07:30 PM");
  const [guestCount, setGuestCount] = useState(2);
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [specialRequests, setSpecialRequests] = useState("");

  // Data State
  const [tables, setTables] = useState<any[]>([]);
  const [myReservations, setMyReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [successBooking, setSuccessBooking] = useState<Reservation | null>(null);

  // Sync user details if user logs in
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerEmail) setCustomerEmail(user.email);
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);
    }
  }, [user]);

  // Fetch tables and reservations for selected date and slot
  const fetchAvailability = async () => {
    setFetchLoading(true);
    try {
      const res = await fetch(`/api/tables?date=${date}&timeSlot=${encodeURIComponent(timeSlot)}`);
      if (res.ok) {
        const data = await res.json();
        setTables(data);
        // Default select first available table that fits guests
        const firstAvailable = data.find(
          (t: any) => t.isSlotAvailable && t.capacity >= guestCount
        );
        if (firstAvailable) {
          setSelectedTableId(firstAvailable.id);
        } else {
          setSelectedTableId("");
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchMyReservations = async () => {
    try {
      const url = user?.id ? `/api/reservations?userId=${user.id}` : `/api/reservations`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMyReservations(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [date, timeSlot, guestCount]);

  useEffect(() => {
    fetchMyReservations();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setError("Please provide your name and phone number.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
          date,
          timeSlot,
          guestCount: parseInt(String(guestCount), 10),
          specialRequests: specialRequests.trim(),
          tableId: selectedTableId || undefined,
          userId: user?.id || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Reservation failed.");
      }

      setSuccessBooking(data);
      fetchAvailability();
      fetchMyReservations();
    } catch (err: any) {
      setError(err.message || "Failed to reserve table.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Calendar className="w-3.5 h-3.5" />
          Table Booking & Reservations
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Reserve Your Dining Experience
        </h1>
        <p className="text-slate-600 text-sm mt-2">
          Select date, time, party size, and preferred dining area. Guaranteed seating with real-time collision prevention.
        </p>
      </div>

      {/* Main Reservation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Booking Wizard (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <span>Table Reservation Details</span>
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-600" />
                  <span>Reservation Date *</span>
                </label>
                <input
                  type="date"
                  min={todayStr}
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-orange-600" />
                  <span>Number of Guests *</span>
                </label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value, 10))}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time Slot Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                <span>Select Seating Time Slot *</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = timeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visual Table Selection with Double Booking Prevention */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  <span>Choose Your Table Location & Zone</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {fetchLoading ? "Checking slots..." : "Live availability"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {tables.map((tbl) => {
                  const isAvailable = tbl.isSlotAvailable && tbl.capacity >= guestCount;
                  const isSelected = selectedTableId === tbl.id;

                  return (
                    <button
                      key={tbl.id}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedTableId(tbl.id)}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        !isAvailable
                          ? "bg-slate-100/70 border-slate-200 opacity-50 cursor-not-allowed text-slate-400"
                          : isSelected
                          ? "bg-orange-50 border-orange-500 text-orange-950 ring-2 ring-orange-500/30 shadow-xs"
                          : "bg-white border-slate-200 hover:border-slate-300 text-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-extrabold text-xs font-mono">
                          Table {tbl.tableNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            !isAvailable
                              ? "bg-red-100 text-red-700"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {!isAvailable ? "Booked" : "Available"}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        <span>{tbl.location}</span> • <span>Up to {tbl.capacity}p</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Guest Contact Information */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Guest Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (for confirmation)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Special Requests / Occasion (Optional)
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Anniversary, birthday cake request, quiet corner..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !selectedTableId}
              className={`w-full py-4 rounded-2xl font-bold text-sm shadow-md transition-all ${
                loading || !selectedTableId
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/25 active:scale-98"
              }`}
            >
              {loading
                ? "Checking & Booking..."
                : !selectedTableId
                ? "Please Select an Available Table"
                : `Confirm Reservation for ${guestCount} Guests`}
            </button>
          </form>
        </div>

        {/* Right 5 Cols: Confirmation or Restaurant Guidelines */}
        <div className="lg:col-span-5 space-y-6">
          {successBooking ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Reservation Confirmed!
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono">
                  {successBooking.reservationNumber}
                </h3>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-100 space-y-2 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Date</span>
                  <span className="font-bold">{successBooking.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time Slot</span>
                  <span className="font-bold text-orange-600">{successBooking.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Party Size</span>
                  <span className="font-bold">{successBooking.guestCount} Guests</span>
                </div>
                {successBooking.table && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assigned Table</span>
                    <span className="font-bold">Table {successBooking.table.tableNumber} ({successBooking.table.location})</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Guest Name</span>
                  <span className="font-bold">{successBooking.customerName}</span>
                </div>
              </div>

              <p className="text-xs text-emerald-800">
                A confirmation SMS / email has been generated. Please arrive 5–10 minutes prior to your time slot.
              </p>

              <button
                onClick={() => setSuccessBooking(null)}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Book Another Table
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  Dining Policies & Benefits
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Why Book at DineDesk?
                </h3>
              </div>

              <ul className="space-y-4 text-xs text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white block">Guaranteed Zero Double-Booking</strong>
                    Tables are locked immediately upon confirmation so your reserved slot is 100% held.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white block">15-Minute Grace Period</strong>
                    We hold your table for up to 15 minutes past your reservation time before releasing to walk-in diners.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white block">Special Celebrations</strong>
                    Let us know in advance and our kitchen will prepare complimentary celebratory dessert platters!
                  </div>
                </li>
              </ul>
            </div>
          )}

          {/* Active Bookings Section */}
          {myReservations.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">
                Recent Bookings
              </h3>
              <div className="space-y-3">
                {myReservations.slice(0, 3).map((res) => (
                  <div
                    key={res.id}
                    className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-slate-900 block">
                        {res.reservationNumber}
                      </span>
                      <span className="text-slate-500">
                        {res.date} • {res.timeSlot} ({res.guestCount} Guests)
                      </span>
                    </div>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                        res.status === "CONFIRMED"
                          ? "bg-emerald-100 text-emerald-800"
                          : res.status === "SEATED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {res.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  UtensilsCrossed,
  ChefHat,
  Shield,
  User,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAs } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = await login(email, password);
    setLoading(false);

    if (success) {
      // Direct based on email convention
      if (email.includes("admin")) {
        router.push("/admin");
      } else if (email.includes("kitchen")) {
        router.push("/kitchen");
      } else {
        router.push("/menu");
      }
    } else {
      setError("Invalid credentials. Please verify your email and password or use the demo buttons below.");
    }
  };

  const handleDemoClick = async (role: "CUSTOMER" | "KITCHEN" | "ADMIN") => {
    setLoading(true);
    await loginAs(role);
    setLoading(false);

    if (role === "ADMIN") {
      router.push("/admin");
    } else if (role === "KITCHEN") {
      router.push("/kitchen");
    } else {
      router.push("/menu");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-600/30">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Welcome to Dine<span className="text-orange-600">Desk</span>
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to access restaurant ordering, reservations, and operations.
          </p>
        </div>

        {/* Demo Fast Login Cards */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-5 text-white shadow-xl space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast Demo Sign-In (1-Click Evaluation)</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoClick("CUSTOMER")}
              className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-center transition-all hover:scale-102 flex flex-col items-center gap-1"
            >
              <User className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-bold">Customer</span>
              <span className="text-[9px] text-slate-400">Order/Book</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick("KITCHEN")}
              className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-center transition-all hover:scale-102 flex flex-col items-center gap-1"
            >
              <ChefHat className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] font-bold">Kitchen</span>
              <span className="text-[9px] text-slate-400">Order Tickets</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick("ADMIN")}
              className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-center transition-all hover:scale-102 flex flex-col items-center gap-1"
            >
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-[11px] font-bold">Admin</span>
              <span className="text-[9px] text-slate-400">Manage All</span>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@dinedesk.com"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              {loading ? "Authenticating..." : "Sign In to DineDesk"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{" "}
            <Link href="/register" className="font-bold text-orange-600 hover:underline">
              Create Customer Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Shield, ChefHat, User, LogOut, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DemoUserBanner() {
  const { user, loginAs, logout } = useAuth();
  const router = useRouter();

  const handleRoleSwitch = async (role: "CUSTOMER" | "KITCHEN" | "ADMIN") => {
    await loginAs(role);
    if (role === "ADMIN") {
      router.push("/admin");
    } else if (role === "KITCHEN") {
      router.push("/kitchen");
    } else {
      router.push("/menu");
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white text-xs px-4 py-2 border-b border-slate-700/60 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Evaluation Quick Switch:
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Active Role:{" "}
            <span className="font-bold text-white uppercase bg-slate-700/80 px-2 py-0.5 rounded border border-slate-600">
              {user?.role || "GUEST (Customer View)"}
            </span>
          </span>
          {user && (
            <span className="text-slate-400 hidden md:inline">({user.name})</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 text-[11px] hidden lg:inline mr-1">Switch Persona:</span>
          
          <button
            onClick={() => handleRoleSwitch("CUSTOMER")}
            className={`px-2.5 py-1 rounded flex items-center gap-1 transition-all ${
              user?.role === "CUSTOMER"
                ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                : "bg-slate-700/70 hover:bg-slate-700 text-slate-200 border border-slate-600"
            }`}
          >
            <User className="w-3 h-3" />
            <span>Customer</span>
          </button>

          <button
            onClick={() => handleRoleSwitch("KITCHEN")}
            className={`px-2.5 py-1 rounded flex items-center gap-1 transition-all ${
              user?.role === "KITCHEN"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                : "bg-slate-700/70 hover:bg-slate-700 text-slate-200 border border-slate-600"
            }`}
          >
            <ChefHat className="w-3 h-3" />
            <span>Kitchen Staff</span>
          </button>

          <button
            onClick={() => handleRoleSwitch("ADMIN")}
            className={`px-2.5 py-1 rounded flex items-center gap-1 transition-all ${
              user?.role === "ADMIN"
                ? "bg-blue-500 text-white font-bold shadow-sm"
                : "bg-slate-700/70 hover:bg-slate-700 text-slate-200 border border-slate-600"
            }`}
          >
            <Shield className="w-3 h-3" />
            <span>Admin</span>
          </button>

          {user && (
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              title="Log out"
              className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded border border-red-500/30 flex items-center gap-1 ml-1"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

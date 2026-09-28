"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  UtensilsCrossed,
  ShoppingCart,
  Calendar,
  Clock,
  User,
  Menu as MenuIcon,
  X,
  ChefHat,
  Shield,
  LogOut,
  Layers,
  LayoutDashboard,
  Users,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Define links based on user role
  const isKitchen = user?.role === "KITCHEN";
  const isAdmin = user?.role === "ADMIN";

  const customerLinks = [
    { name: "Home", href: "/" },
    { name: "Digital Menu", href: "/menu" },
    { name: "Reservations", href: "/reservations" },
    { name: "My Orders", href: "/orders" },
  ];

  const kitchenLinks = [
    { name: "Kitchen Display", href: "/kitchen" },
    { name: "Active Tickets", href: "/kitchen?tab=ACTIVE" },
    { name: "Completed", href: "/kitchen?tab=COMPLETED" },
  ];

  const adminLinks = [
    { name: "Overview", href: "/admin" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Menu", href: "/admin/menu" },
    { name: "Categories", href: "/admin/categories" },
    { name: "Tables", href: "/admin/tables" },
    { name: "Reservations", href: "/admin/reservations" },
    { name: "Customers", href: "/admin/customers" },
  ];

  const navLinks = isAdmin ? adminLinks : isKitchen ? kitchenLinks : customerLinks;

  return (
    <header className="sticky top-[37px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href={isAdmin ? "/admin" : isKitchen ? "/kitchen" : "/"} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              {isAdmin ? (
                <Shield className="w-5 h-5" />
              ) : isKitchen ? (
                <ChefHat className="w-5 h-5" />
              ) : (
                <UtensilsCrossed className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
                <span>Dine<span className="text-orange-600">Desk</span></span>
                {isAdmin && (
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded uppercase">
                    Admin
                  </span>
                )}
                {isKitchen && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded uppercase">
                    Kitchen
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 -mt-1 hidden sm:block">Smart Restaurant Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.split("?")[0]));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-orange-50 text-orange-600 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Cart & Profile / Login */}
          <div className="flex items-center space-x-3">
            {/* Cart Icon (Customer view) */}
            {!isAdmin && !isKitchen && (
              <Link
                href="/cart"
                className="relative p-2 text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-xs">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Account / Login Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase">{user.role}</p>
                  </div>
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs shadow-orange-600/20 transition-all hover:shadow-md"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive
                    ? "bg-orange-50 text-orange-600 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm text-slate-800 font-medium"
                >
                  <User className="w-4 h-4 text-orange-600" />
                  My Profile ({user.role})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-600 font-medium hover:underline flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold text-white bg-orange-600 rounded-lg"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

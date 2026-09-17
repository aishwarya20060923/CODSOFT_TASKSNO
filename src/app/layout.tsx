import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import DemoUserBanner from "@/components/layout/DemoUserBanner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "DineDesk | Modern Restaurant Ordering & Table Management",
  description: "Explore exquisite digital menus, place online dine-in/takeaway food orders, track live kitchen progress, and reserve tables with DineDesk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <AuthProvider>
          <CartProvider>
            {/* Top 1-click role switcher for fast evaluation */}
            <DemoUserBanner />

            {/* Role-adaptive Navigation */}
            <Navbar />

            {/* Main Application View */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

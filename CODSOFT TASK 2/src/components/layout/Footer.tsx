import React from "react";
import Link from "next/link";
import { UtensilsCrossed, Phone, Mail, MapPin, Clock, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold shadow-md shadow-orange-600/30">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Dine<span className="text-orange-500">Desk</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              DineDesk is an end-to-end digital restaurant management and online ordering platform empowering seamless guest dining, reservations, and real-time kitchen workflows.
            </p>
            <div className="text-xs text-orange-400 font-semibold bg-orange-950/40 border border-orange-900/50 p-2.5 rounded-lg inline-block">
              CodSoft Internship Project — Task 2
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-orange-400 transition-colors">Restaurant Home</Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-orange-400 transition-colors">Digital Food Menu</Link>
              </li>
              <li>
                <Link href="/reservations" className="hover:text-orange-400 transition-colors">Book a Table</Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-orange-400 transition-colors">Order Tracking</Link>
              </li>
              <li>
                <Link href="/kitchen" className="hover:text-orange-400 transition-colors">Kitchen Display (KDS)</Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-orange-400 transition-colors">Restaurant Admin</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Hours of Operation */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400" />
              Opening Hours
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex justify-between pb-1.5 border-b border-slate-800">
                <span>Monday – Thursday</span>
                <span className="text-white font-medium">11:00 AM – 10:30 PM</span>
              </li>
              <li className="flex justify-between pb-1.5 border-b border-slate-800">
                <span>Friday – Saturday</span>
                <span className="text-white font-medium">11:00 AM – 11:30 PM</span>
              </li>
              <li className="flex justify-between pb-1.5 border-b border-slate-800">
                <span>Sunday Brunch & Dinner</span>
                <span className="text-white font-medium">10:00 AM – 10:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Location & Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Contact & Location</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>450 Heritage Marg, Indiranagar, Bengaluru, Karnataka 560038</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <span>+91 (80) 4567 8900 / +91 98300 12345</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <span>reservations@dinedesk.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DineDesk Restaurant Platform. Built with Next.js, Prisma & Tailwind CSS.</p>
          <p className="flex items-center gap-1">
            Crafted for <span className="text-slate-300 font-medium">CodSoft Full Stack Internship</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

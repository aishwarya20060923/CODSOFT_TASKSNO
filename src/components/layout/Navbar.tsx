'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, ShieldCheck, UserCheck, BookOpen, ExternalLink } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const getCurrentRole = () => {
    if (pathname.startsWith('/admin')) return 'admin';
    if (pathname.startsWith('/teacher')) return 'teacher';
    if (pathname.startsWith('/student')) return 'student';
    return 'landing';
  };

  const currentRole = getCurrentRole();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">EduManage</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 tracking-wider">
                  CodSoft Task 1
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Full-Stack Education Platform</p>
            </div>
          </Link>
        </div>

        {/* 1-Click Role Switcher for Demo / Presentation */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400 mr-1 hidden md:inline">Demo Role Switcher:</span>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <Link
              href="/admin/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                currentRole === 'admin'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Admin</span>
            </Link>

            <Link
              href="/teacher/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                currentRole === 'teacher'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Teacher</span>
            </Link>

            <Link
              href="/student/dashboard"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                currentRole === 'student'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>Student</span>
            </Link>
          </div>

          <Link
            href="/"
            className="ml-2 text-xs font-medium text-slate-500 hover:text-slate-800 hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-slate-200 transition"
          >
            <span>Overview</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, ShieldCheck, UserCheck, BookOpen, ExternalLink } from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';

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
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#131d33]/95 backdrop-blur shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight">EduManage</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 tracking-wider">
                  College System
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Full-Stack Education Platform</p>
            </div>
          </Link>
        </div>

        {/* 1-Click Role Switcher & Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mr-1 hidden lg:inline">Role Switcher:</span>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <Link
              href="/admin/dashboard"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                currentRole === 'admin'
                  ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Admin</span>
            </Link>

            <Link
              href="/teacher/dashboard"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                currentRole === 'teacher'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Teacher</span>
            </Link>

            <Link
              href="/student/dashboard"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                currentRole === 'student'
                  ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="hidden sm:inline">Student</span>
            </Link>
          </div>

          <Link
            href="/"
            className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition"
          >
            <span>Overview</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Theme Toggle Button */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

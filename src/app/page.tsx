import Link from 'next/link';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  BookOpen,
  CalendarCheck,
  FileSpreadsheet,
  Receipt,
  ArrowRight,
  Sparkles,
  Database,
  Code,
  Layers,
  Award,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
        {/* Decorative background gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-100/60 via-indigo-50/40 to-transparent blur-2xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Internship Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-semibold mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>CodSoft Full-Stack Web Development Internship • Task 1</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            EduManage <span className="text-blue-600">Student Management</span> Platform
          </h1>

          <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A digitized education management ecosystem connecting administrators, teachers, and
            students. Manage admissions, track daily attendance, grade examinations, and clear fee
            dues seamlessly.
          </p>

          {/* Quick Launch Portals */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
            {/* 1. Admin Portal Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-500/50 transition duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  Role: Administrator
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Admin Dashboard</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Manage student enrollment, faculty appointments, class allocations, and oversee
                  institutional fee realization ledgers.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <p className="flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Dr. Sarah Jenkins (Demo Admin)
                  </p>
                </div>
              </div>

              <Link
                href="/admin/dashboard"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                <span>Launch Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 2. Teacher Portal Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                  <UserCheck className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                  Role: Faculty Member
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Teacher Portal</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Interactive daily attendance marking (Present/Absent/Late), schedule inspection, and
                  comprehensive examination grading.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <p className="flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Prof. Robert Lang (Math Dept Head)
                  </p>
                </div>
              </div>

              <Link
                href="/teacher/dashboard"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                <span>Launch Teacher Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 3. Student Portal Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-purple-500/50 transition duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">
                  Role: Enrolled Student
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Student Portal</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  View personal attendance compliance, print official semester report cards, and
                  clear tuition invoices with instant receipts.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <p className="flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Alex Morgan (Roll: STU-2026-001)
                  </p>
                </div>
              </div>

              <Link
                href="/student/dashboard"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                <span>Launch Student Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Complete Educational Workflow
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Designed according to CodSoft Task 1 specifications to digitize institutional records.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <CalendarCheck className="w-8 h-8 text-emerald-600 mb-3" />
              <h4 className="font-bold text-slate-900 text-sm">Attendance Register</h4>
              <p className="text-xs text-slate-500 mt-1">
                Real-time daily presence logging with 1-click batch present actions and student tardy notes.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <FileSpreadsheet className="w-8 h-8 text-blue-600 mb-3" />
              <h4 className="font-bold text-slate-900 text-sm">Examination & Grading</h4>
              <p className="text-xs text-slate-500 mt-1">
                Live grade computation (A+ through F), class averages, and printable official transcripts.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <Receipt className="w-8 h-8 text-amber-600 mb-3" />
              <h4 className="font-bold text-slate-900 text-sm">Fee Invoicing & Dues</h4>
              <p className="text-xs text-slate-500 mt-1">
                Automated invoice generation, payment simulation, and transparent financial audit ledgers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <Database className="w-8 h-8 text-purple-600 mb-3" />
              <h4 className="font-bold text-slate-900 text-sm">Prisma ORM & SQLite</h4>
              <p className="text-xs text-slate-500 mt-1">
                Type-safe relational database schema with instant pre-seeded mock records for smooth demo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Bar */}
      <footer className="py-8 bg-slate-50 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-slate-800">EduManage</span>
            <span>• Full Stack Web Development Internship</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span>Next.js 15 (App Router)</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>Prisma ORM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

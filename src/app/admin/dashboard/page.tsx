import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import {
  Users,
  GraduationCap,
  Building2,
  CreditCard,
  UserPlus,
  Receipt,
  ArrowUpRight,
  Clock,
  TrendingUp,
  Award,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [
    totalStudents,
    totalTeachers,
    totalClasses,
    invoices,
    attendances,
    recentStudents,
  ] = await Promise.all([
    prisma.studentProfile.count(),
    prisma.teacherProfile.count(),
    prisma.class.count(),
    prisma.feeInvoice.findMany({
      include: { student: { include: { user: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.attendance.findMany(),
    prisma.studentProfile.findMany({
      take: 5,
      orderBy: { user: { createdAt: 'desc' } },
      include: { user: true, class: true },
    }),
  ]);

  // Calculations
  const totalBilled = invoices.reduce((acc, inv) => acc + inv.amount, 0);
  const totalCollected = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const totalPending = totalBilled - totalCollected;
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  const totalAttendanceRecords = attendances.length;
  const presentRecords = attendances.filter((a) => a.status === 'PRESENT').length;
  const attendanceRate =
    totalAttendanceRecords > 0 ? Math.round((presentRecords / totalAttendanceRecords) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs uppercase tracking-wider font-semibold px-3 py-1 bg-white/10 backdrop-blur rounded-full text-blue-200 inline-block mb-3">
            Academic Year 2026 – Fall Semester
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Institutional Administration Overview
          </h1>
          <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
            Welcome back, Dr. Anandita Verma. Real-time institutional telemetry, active enrollments,
            faculty deployments, and fee realization metrics.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/admin/students"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md transition"
            >
              <UserPlus className="w-4 h-4" />
              Manage Students
            </Link>
            <Link
              href="/admin/fees"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/15 backdrop-blur transition"
            >
              <Receipt className="w-4 h-4" />
              Fee Accounting
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Enrolled Students
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold text-slate-900">{totalStudents}</p>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              100% active standing
            </p>
          </div>
        </div>

        {/* Total Faculty */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Faculty Members
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold text-slate-900">{totalTeachers}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Across 3 academic departments</p>
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Campus Attendance
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold text-slate-900">{attendanceRate}%</p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${attendanceRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Fee Collection */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Fee Realization
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalCollected)}</p>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
              <span>{collectionRate}% Collected</span>
              <span className="text-rose-600 font-medium">{formatCurrency(totalPending)} due</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Enrolled Students */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recently Enrolled Students</h2>
              <p className="text-xs text-slate-500">Student roster with assigned classes</p>
            </div>
            <Link
              href="/admin/students"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all directory <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Roll No</th>
                  <th className="px-5 py-3">Class</th>
                  <th className="px-5 py-3">Parent Contact</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3.5 flex items-center gap-3">
                      <img
                        src={s.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={s.user.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{s.user.name}</p>
                        <p className="text-xs text-slate-500">{s.user.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-600 font-medium">
                      {s.rollNumber}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 text-xs rounded-lg font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {s.class.name}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">
                      <p className="font-medium text-slate-800">{s.parentName || 'N/A'}</p>
                      <p className="text-slate-400">{s.parentPhone || 'N/A'}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Enrolled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fee Collection Status */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Fee Realization</h2>
              <Link
                href="/admin/fees"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Invoices
              </Link>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">Collection Progress</span>
                  <span className="text-slate-900">{collectionRate}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${collectionRate}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[11px] font-medium text-slate-500 uppercase">Total Billed</p>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">
                    {formatCurrency(totalBilled)}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <p className="text-[11px] font-medium text-emerald-700 uppercase">Received</p>
                  <p className="text-lg font-bold text-emerald-800 mt-0.5">
                    {formatCurrency(totalCollected)}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-amber-900">Uncollected Balance</p>
                  <p className="text-xs text-amber-700">Awaiting student clearing</p>
                </div>
                <span className="text-base font-bold text-amber-900">
                  {formatCurrency(totalPending)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Automated financial cycle active for Fall 2026.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

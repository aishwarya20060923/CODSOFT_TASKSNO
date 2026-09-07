import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatCurrency, calculateGrade, getGradeBadgeColor } from '@/lib/utils';
import {
  CalendarCheck,
  Award,
  Receipt,
  User,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StudentDashboardPage() {
  // Primary demo student: Alex Morgan
  const student = await prisma.studentProfile.findFirst({
    where: { rollNumber: 'STU-2026-001' },
    include: {
      user: true,
      class: {
        include: {
          teacher: { include: { user: true } },
          subjects: true,
        },
      },
      attendances: { orderBy: { date: 'desc' } },
      marks: {
        include: { subject: true, exam: true },
      },
      feeInvoices: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!student) {
    return <div className="p-8 text-center text-slate-500">Student profile not found.</div>;
  }

  // Attendance rate
  const totalDays = student.attendances.length;
  const presentDays = student.attendances.filter((a) => a.status === 'PRESENT').length;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  // Academic Marks Average
  const scores = student.marks.map((m) => m.marksObtained);
  const avgScore =
    scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const overallGrade = calculateGrade(avgScore);

  // Fees
  const totalDues = student.feeInvoices.reduce((acc, inv) => acc + inv.amount, 0);
  const paidDues = student.feeInvoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const pendingBalance = totalDues - paidDues;

  return (
    <div className="space-y-8">
      {/* Student Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={
                student.user.avatar ||
                'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80'
              }
              alt={student.user.name}
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-0.5 bg-purple-500/30 text-purple-200 border border-purple-400/30 rounded-full">
                  Student Portal
                </span>
                <span className="font-mono text-xs text-slate-300">{student.rollNumber}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                {student.user.name}
              </h1>
              <p className="text-purple-200 text-xs md:text-sm mt-0.5">
                {student.class.name} • Class Advisory: {student.class.teacher?.user.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/student/results"
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              View Report Card
            </Link>
            <Link
              href="/student/fees"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 backdrop-blur transition flex items-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              Fee Receipts
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* GPA / Average */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Academic Standing
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-3xl font-bold text-slate-900">{avgScore}%</p>
            <span
              className={`px-2.5 py-0.5 text-xs font-bold rounded-md border ${getGradeBadgeColor(
                overallGrade
              )}`}
            >
              Grade {overallGrade}
            </span>
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Honor Roll Standing
          </p>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Attendance Record
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{attendanceRate}%</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            {presentDays} of {totalDays} sessions attended
          </p>
        </div>

        {/* Fee Dues */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Fee Invoices
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {pendingBalance === 0 ? '$0.00' : formatCurrency(pendingBalance)}
          </p>
          <p
            className={`text-xs font-medium mt-1.5 ${
              pendingBalance > 0 ? 'text-amber-600' : 'text-emerald-600'
            }`}
          >
            {pendingBalance > 0
              ? 'Pending invoice due Sept 30'
              : 'All semester dues cleared'}
          </p>
        </div>
      </div>

      {/* Two Column Layout: Current Marks & Noticeboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Scores Preview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Mid-Term Assessment Scores</h2>
              <p className="text-xs text-slate-500">Evaluated by subject faculty</p>
            </div>
            <Link
              href="/student/results"
              className="text-xs font-semibold text-purple-700 hover:text-purple-800 flex items-center gap-1"
            >
              Full Transcript <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {student.marks.map((mark) => (
              <div
                key={mark.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">
                      {mark.subject.name}
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {mark.subject.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{mark.remarks || 'Satisfactory'}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-bold text-slate-900 text-sm">{mark.marksObtained}</span>
                    <span className="text-xs text-slate-400"> / {mark.maxMarks}</span>
                  </div>
                  <span
                    className={`w-10 text-center px-2 py-0.5 text-xs font-bold rounded-lg border ${getGradeBadgeColor(
                      mark.grade
                    )}`}
                  >
                    {mark.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements & Schedule */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              Upcoming Academic Schedule
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                <p className="font-bold text-purple-900">Final Term Preparatory Exams</p>
                <p className="text-purple-700 mt-0.5">Begins October 12, 2026</p>
                <p className="text-purple-500 text-[11px] mt-1">Syllabus uploaded to portal</p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                <p className="font-bold text-blue-900">Science Exhibition & Lab Project</p>
                <p className="text-blue-700 mt-0.5">Submission Deadline: Sept 25</p>
                <p className="text-blue-500 text-[11px] mt-1">Physics & Chemistry Labs</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100">
                <p className="font-bold text-amber-900">Sports Meet Registrations</p>
                <p className="text-amber-700 mt-0.5">Open until Friday</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/student/attendance"
              className="text-xs font-semibold text-purple-700 hover:text-purple-800 flex items-center justify-between"
            >
              <span>Check Attendance History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

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

import { redirect } from 'next/navigation';
import { getAuthenticatedStudent } from '@/lib/auth';
import EditProfileModal from '@/components/student/EditProfileModal';

export const dynamic = 'force-dynamic';

export default async function StudentDashboardPage() {
  const student = await getAuthenticatedStudent();

  if (!student) {
    redirect('/student/login');
  }

  const [announcements, assignments] = await Promise.all([
    prisma.announcement.findMany({
      where: {
        OR: [{ classId: null }, { classId: student.classId }],
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.assignment.findMany({
      where: {
        subject: {
          classId: student.classId,
        },
      },
      include: {
        subject: true,
        teacher: { include: { user: true } },
      },
      orderBy: { dueDate: 'asc' },
      take: 3,
    }),
  ]);

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

          <div className="flex flex-wrap items-center gap-2.5">
            <EditProfileModal
              student={{
                id: student.id,
                rollNumber: student.rollNumber,
                name: student.user.name,
                email: student.user.email,
                avatar: student.user.avatar,
                phone: student.phone,
                parentName: student.parentName,
                parentPhone: student.parentPhone,
                address: student.address,
                className: student.class.name,
              }}
            />
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
        <div className="bg-white dark:bg-[#131d33] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Academic Standing
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{avgScore}%</p>
            <span
              className={`px-2.5 py-0.5 text-xs font-bold rounded-md border ${getGradeBadgeColor(
                overallGrade
              )}`}
            >
              Grade {overallGrade}
            </span>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Honor Roll Standing
          </p>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white dark:bg-[#131d33] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Attendance Record
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{attendanceRate}%</p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
            {presentDays} of {totalDays} sessions attended
          </p>
        </div>

        {/* Fee Dues */}
        <div className="bg-white dark:bg-[#131d33] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Fee Invoices
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
            {formatCurrency(pendingBalance)}
          </p>
          <p
            className={`text-xs font-medium mt-1.5 ${
              pendingBalance > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
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
        <div className="lg:col-span-2 bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Mid-Term Assessment Scores</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Evaluated by subject faculty</p>
            </div>
            <Link
              href="/student/results"
              className="text-xs font-semibold text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center gap-1"
            >
              Full Transcript <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {student.marks.map((mark) => (
              <div
                key={mark.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50/70 dark:hover:bg-slate-800/60 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">
                      {mark.subject.name}
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">
                      {mark.subject.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{mark.remarks || 'Satisfactory'}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{mark.marksObtained}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500"> / {mark.maxMarks}</span>
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

        {/* Announcements & Assignments */}
        <div className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Notices & Coursework
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800/50">
                {announcements.length + assignments.length} Active
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {assignments.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block mb-2">
                    Pending Coursework
                  </span>
                  <div className="space-y-2">
                    {assignments.map((asg) => (
                      <div
                        key={asg.id}
                        className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/25 border border-purple-100 dark:border-purple-900/50 hover:border-purple-300 dark:hover:border-purple-600 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-purple-950 dark:text-purple-200 truncate">{asg.title}</span>
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-purple-200/60 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 font-bold shrink-0">
                            {asg.subject.code}
                          </span>
                        </div>
                        <p className="text-purple-700 dark:text-purple-300/90 mt-1 text-[11px] line-clamp-1">
                          {asg.description}
                        </p>
                        <div className="mt-1.5 flex items-center justify-between text-[11px] text-purple-600 dark:text-purple-400">
                          <span>{asg.subject.name}</span>
                          <span>Due: {asg.dueDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {announcements.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block mb-2 mt-3">
                    Faculty Announcements
                  </span>
                  <div className="space-y-2">
                    {announcements.map((ann) => (
                      <div
                        key={ann.id}
                        className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/25 border border-blue-100 dark:border-blue-900/50 hover:border-blue-300 dark:hover:border-blue-600 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-950 dark:text-blue-200 truncate">{ann.title}</span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-200/60 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 shrink-0">
                            {ann.category}
                          </span>
                        </div>
                        <p className="text-blue-700 dark:text-blue-300/90 mt-1 text-[11px] line-clamp-2">
                          {ann.content}
                        </p>
                        <p className="text-[10px] text-blue-500 dark:text-blue-400 mt-1">By {ann.authorName}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {assignments.length === 0 && announcements.length === 0 && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50">
                    <p className="font-bold text-purple-900 dark:text-purple-200">Final Term Preparatory Exams</p>
                    <p className="text-purple-700 dark:text-purple-300 mt-0.5">Begins October 12, 2026</p>
                    <p className="text-purple-500 dark:text-purple-400 text-[11px] mt-1">Syllabus uploaded to portal</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
                    <p className="font-bold text-blue-900 dark:text-blue-200">Science Exhibition & Lab Project</p>
                    <p className="text-blue-700 dark:text-blue-300 mt-0.5">Submission Deadline: Sept 25</p>
                    <p className="text-blue-500 dark:text-blue-400 text-[11px] mt-1">Physics & Chemistry Labs</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
                    <p className="font-bold text-amber-900 dark:text-amber-200">Sports Meet Registrations</p>
                    <p className="text-amber-700 dark:text-amber-300 mt-0.5">Open until Friday</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/student/attendance"
              className="text-xs font-semibold text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center justify-between"
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

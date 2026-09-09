import Link from 'next/link';
import prisma from '@/lib/prisma';
import {
  CalendarCheck,
  FileSpreadsheet,
  Users,
  Clock,
  BookOpen,
  ArrowRight,
  Sparkles,
  GraduationCap,
  FileText,
  Bell,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { redirect } from 'next/navigation';
import { getAuthenticatedTeacher } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function TeacherDashboardPage() {
  const teacher = await getAuthenticatedTeacher();

  // If unauthenticated, redirect to teacher login
  if (!teacher) {
    redirect('/teacher/login');
  }

  // Calculate unique students taught across advisory classes and taught subjects
  const studentMap = new Map<string, { id: string; name: string; rollNumber: string }>();
  teacher.classes.forEach((c: any) => {
    c.students?.forEach((s: any) => {
      studentMap.set(s.id, { id: s.id, name: s.user?.name || '', rollNumber: s.rollNumber });
    });
  });
  teacher.subjects.forEach((sub: any) => {
    sub.class?.students?.forEach((s: any) => {
      studentMap.set(s.id, { id: s.id, name: s.user?.name || '', rollNumber: s.rollNumber });
    });
  });
  const totalStudentsTaught = studentMap.size;

  // Attendance summary metrics recorded by this teacher
  const [totalSessionsRecorded, presentCount, recentAnnouncements] = await Promise.all([
    prisma.attendance.count({
      where: { teacherId: teacher.id },
    }),
    prisma.attendance.count({
      where: { teacherId: teacher.id, status: 'PRESENT' },
    }),
    prisma.announcement.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const overallAttendanceRate =
    totalSessionsRecorded > 0
      ? Math.round((presentCount / totalSessionsRecorded) * 100)
      : 95;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <img
                src={
                  teacher.user.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    teacher.user.name
                  )}&background=047857&color=ffffff&bold=true`
                }
                alt={teacher.user.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-emerald-400/30 shadow-lg shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-0.5 bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 rounded-full">
                    Faculty Portal
                  </span>
                  <span className="font-mono text-xs text-slate-300 px-2 py-0.5 bg-white/10 rounded-md">
                    {teacher.employeeId}
                  </span>
                  <span className="text-xs text-emerald-200">{teacher.department}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Welcome, {teacher.user.name}
                </h1>
                <p className="mt-1 text-emerald-100/90 text-xs sm:text-sm max-w-xl">
                  {teacher.designation} • {teacher.qualification || 'Academic Faculty'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link
                href="/teacher/attendance"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold shadow-md transition"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Mark Attendance</span>
              </Link>
              <Link
                href="/teacher/exams"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/15 backdrop-blur transition"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Gradebook</span>
              </Link>
            </div>
          </div>

          {/* Quick Action Pills */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap gap-2 text-xs">
            <span className="text-emerald-200 font-bold self-center mr-1">Quick Actions:</span>
            <Link
              href="/teacher/attendance"
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition flex items-center gap-1.5"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-emerald-300" />
              Mark Attendance
            </Link>
            <Link
              href="/teacher/students"
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-blue-300" />
              My Students ({totalStudentsTaught})
            </Link>
            <Link
              href="/teacher/exams"
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-purple-300" />
              Enter Marks
            </Link>
            <Link
              href="/teacher/assignments"
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              Assignments ({teacher.assignments.length})
            </Link>
            <Link
              href="/teacher/announcements"
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5 text-rose-300" />
              Announcements
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#131d33] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Assigned Subjects</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{teacher.subjects.length}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Curriculum courses</p>
        </div>

        <div className="bg-white dark:bg-[#131d33] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Assigned Classes</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {Array.from(new Set(teacher.subjects.map((s) => s.class.name))).length}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Teaching cohorts</p>
        </div>

        <div className="bg-white dark:bg-[#131d33] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total Students</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{totalStudentsTaught}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Enrolled in your subjects</p>
        </div>

        <div className="bg-white dark:bg-[#131d33] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Attendance Rate</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{overallAttendanceRate}%</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{totalSessionsRecorded} student logs</p>
        </div>
      </div>

      {/* Main Split: Assigned Subjects & Classes / Announcements & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Assigned Subjects & Cohorts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assigned Subjects Card */}
          <div className="bg-white dark:bg-[#131d33] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Your Assigned Subjects & Classes
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Curriculum courses and cohorts assigned to {teacher.user.name}
                </p>
              </div>
              <Link
                href="/teacher/attendance"
                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Take Attendance</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {teacher.subjects.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/80 hover:border-emerald-300 dark:hover:border-emerald-700/60 hover:shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">{sub.name}</h3>
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800/60">
                        {sub.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Class: <strong className="text-slate-700 dark:text-slate-200">{sub.class.name}</strong> • Room{' '}
                      {sub.class.room || 'N/A'} • {sub.class.students.length} Enrolled Students
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/teacher/attendance?subjectId=${sub.id}&classId=${sub.class.id}`}
                      className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition"
                    >
                      Attendance
                    </Link>
                    <Link
                      href={`/teacher/exams?subjectId=${sub.id}&classId=${sub.class.id}`}
                      className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl transition"
                    >
                      Enter Marks
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Assigned Programs & Classes */}
          {teacher.classes.length > 0 && (
            <div className="bg-white dark:bg-[#131d33] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Assigned Academic Programs
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Academic programs and cohorts assigned to your faculty profile
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teacher.classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{cls.name}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-bold uppercase">
                        {cls.teacherId === teacher.id ? 'Class Advisor' : 'Assigned Faculty'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Room: {cls.room} • Students: {cls.students?.length || 0}
                    </p>
                    <div className="pt-2 flex items-center gap-2">
                      <Link
                        href={`/teacher/students?classId=${cls.id}`}
                        className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        View Students Roster →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Recent Announcements & Quick Schedule */}
        <div className="space-y-6">
          {/* Department Announcements Card */}
          <div className="bg-white dark:bg-[#131d33] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Recent Announcements
              </h2>
              <Link
                href="/teacher/announcements"
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              {recentAnnouncements.length === 0 ? (
                <p className="text-slate-400 italic py-2">No announcements published.</p>
              ) : (
                recentAnnouncements.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 dark:text-white">{item.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed line-clamp-2">
                      {item.content}
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                      Posted by {item.authorName}
                    </span>
                  </div>
                ))
              )}
            </div>

            <Link
              href="/teacher/announcements"
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 mt-2"
            >
              <span>Manage Announcements</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Institutional Faculty Directory Link */}
          <div className="bg-slate-900 dark:bg-[#0f172a] p-6 rounded-2xl border border-transparent dark:border-slate-800 text-white shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm">Faculty Senate Directory</h3>
            </div>
            <p className="text-xs text-slate-300 dark:text-slate-400 leading-relaxed">
              Explore departmental colleagues, HODs, and academic peer directories across all disciplines.
            </p>
            <Link
              href="/teacher/faculty"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 hover:text-emerald-200 pt-1"
            >
              <span>Browse Full Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

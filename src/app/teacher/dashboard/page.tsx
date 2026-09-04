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
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TeacherDashboardPage() {
  // Fetch teacher (Prof. Robert Lang) and his classes & subjects
  const teacher = await prisma.teacherProfile.findFirst({
    where: { employeeId: 'EMP-MATH-101' },
    include: {
      user: true,
      classes: {
        include: {
          students: { include: { user: true } },
          subjects: true,
        },
      },
      subjects: {
        include: { class: true },
      },
    },
  });

  const totalStudentsTaught =
    teacher?.classes.reduce((acc, c) => acc + c.students.length, 0) || 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs uppercase tracking-wider font-semibold px-3 py-1 bg-white/10 backdrop-blur rounded-full text-emerald-200 inline-block mb-3">
            Faculty Portal • {teacher?.department || 'Department of Mathematics'}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome, {teacher?.user.name}
          </h1>
          <p className="mt-2 text-emerald-100/90 text-sm md:text-base leading-relaxed">
            {teacher?.designation}. Access your assigned student cohorts, log daily class
            attendance, and submit evaluation marks for mid-term exams.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/teacher/attendance"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-bold shadow-md transition"
            >
              <CalendarCheck className="w-4 h-4" />
              Mark Today&apos;s Attendance
            </Link>
            <Link
              href="/teacher/exams"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/15 backdrop-blur transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Open Gradebook
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Assigned Classes</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{teacher?.classes.length || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Active class advisory</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Students</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalStudentsTaught}</p>
          <p className="text-xs text-slate-400 mt-1">Across advisory cohorts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Taught Subjects</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{teacher?.subjects.length || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Math & Computer Science</p>
        </div>
      </div>

      {/* Class Cohorts & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Classes Under Advisory */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Your Class Cohorts</h2>
            <Link
              href="/teacher/attendance"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              Attendance System <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {teacher?.classes.map((cls) => (
              <div
                key={cls.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900">{cls.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-medium">
                      Primary Advisory
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Room {cls.room} • {cls.students.length} Enrolled Students • {cls.subjects.length}{' '}
                    Subjects
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/teacher/attendance?classId=${cls.id}`}
                    className="px-3.5 py-2 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl transition"
                  >
                    Take Attendance
                  </Link>
                  <Link
                    href={`/teacher/exams?classId=${cls.id}`}
                    className="px-3.5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition"
                  >
                    Gradebook
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Sidebar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">Today&apos;s Class Schedule</h2>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border-l-4 border-emerald-500 border border-slate-100">
              <span className="font-semibold text-slate-900">09:00 AM – 10:30 AM</span>
              <p className="font-medium text-slate-700 mt-0.5">Advanced Mathematics (MATH-101)</p>
              <p className="text-slate-400 text-[11px]">Grade 10 - Section A • Room 101</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border-l-4 border-blue-500 border border-slate-100">
              <span className="font-semibold text-slate-900">11:00 AM – 12:30 PM</span>
              <p className="font-medium text-slate-700 mt-0.5">Computer Science & Python (CS-105)</p>
              <p className="text-slate-400 text-[11px]">Grade 10 - Section A • Computer Lab</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border-l-4 border-indigo-500 border border-slate-100">
              <span className="font-semibold text-slate-900">02:00 PM – 03:00 PM</span>
              <p className="font-medium text-slate-700 mt-0.5">Faculty Academic Senate Meeting</p>
              <p className="text-slate-400 text-[11px]">Main Conference Hall</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

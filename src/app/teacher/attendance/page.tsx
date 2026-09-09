import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import AttendanceClient from '@/components/teacher/AttendanceClient';
import { getAuthenticatedTeacher } from '@/lib/auth';
import { BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TeacherAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ subjectId?: string; classId?: string; date?: string }>;
}) {
  const teacher = await getAuthenticatedTeacher();
  if (!teacher) {
    redirect('/teacher/login');
  }

  const resolvedParams = await searchParams;

  // Fetch only subjects assigned to this teacher
  const subjects = await prisma.subject.findMany({
    where: {
      OR: [
        { teacherId: teacher.id },
        { teacherAssignments: { some: { teacherId: teacher.id } } },
      ],
    },
    include: {
      class: true,
    },
    orderBy: { name: 'asc' },
  });

  if (subjects.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Daily Attendance Register</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Log daily classroom attendance and verify subject-wise presence.
          </p>
        </div>

        <div className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Assigned Subjects</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            You are not currently assigned to teach any curriculum subjects. Please contact the administrator to assign subjects to your faculty profile.
          </p>
        </div>
      </div>
    );
  }

  // Server-side authorization check: verify selected subject belongs to this teacher
  let activeSubject = subjects.find((s) => s.id === resolvedParams.subjectId);
  if (!activeSubject) {
    activeSubject = subjects[0];
  }

  const today = new Date().toISOString().split('T')[0];
  const activeDate = resolvedParams.date || today;

  // Fetch students enrolled in this subject's class
  const students = await prisma.studentProfile.findMany({
    where: { classId: activeSubject.class.id },
    include: { user: true },
    orderBy: { rollNumber: 'asc' },
  });

  // Fetch existing attendance logs for this subject, class, and date
  const existingAttendances = await prisma.attendance.findMany({
    where: {
      subjectId: activeSubject.id,
      classId: activeSubject.class.id,
      date: activeDate,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Daily Attendance Register</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Log and verify subject-wise attendance for your assigned cohorts.
          </p>
        </div>
      </div>

      <AttendanceClient
        subjects={subjects}
        activeSubject={activeSubject}
        students={students}
        existingAttendances={existingAttendances}
        selectedDate={activeDate}
      />
    </div>
  );
}

import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ExamsClient from '@/components/teacher/ExamsClient';
import { getAuthenticatedTeacher } from '@/lib/auth';
import { BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TeacherExamsPage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string; examId?: string; subjectId?: string }>;
}) {
  const teacher = await getAuthenticatedTeacher();
  if (!teacher) {
    redirect('/teacher/login');
  }

  const resolvedParams = await searchParams;

  // Fetch only subjects assigned to this teacher
  const teacherSubjects = await prisma.subject.findMany({
    where: {
      OR: [
        { teacherId: teacher.id },
        { teacherAssignments: { some: { teacherId: teacher.id } } },
      ],
    },
    include: {
      class: {
        include: {
          students: { include: { user: true } },
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  if (teacherSubjects.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Examination & Marks</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Grade assessments, record subject-wise marks, and compute performance metrics.
          </p>
        </div>

        <div className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Assigned Subjects</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            You are not currently assigned to teach any curriculum subjects. Marks entry is restricted to assigned instructors.
          </p>
        </div>
      </div>
    );
  }

  // Determine active subject (must be one of this teacher's subjects)
  let activeSubject = teacherSubjects.find((s) => s.id === resolvedParams.subjectId);
  if (!activeSubject) {
    activeSubject = teacherSubjects[0];
  }

  // Find or fetch exam for this class
  let exam = await prisma.exam.findFirst({
    where: { classId: activeSubject.classId },
    orderBy: { createdAt: 'desc' },
  });

  if (!exam) {
    exam = await prisma.exam.create({
      data: {
        name: 'Mid-Term Evaluation 2026',
        term: 'Semester 1',
        classId: activeSubject.classId,
        startDate: '2026-08-10',
        endDate: '2026-08-18',
      },
    });
  }

  const students = activeSubject.class.students;

  // Fetch marks for this exam and this teacher's subjects
  const allMarks = await prisma.mark.findMany({
    where: {
      examId: exam.id,
      subjectId: { in: teacherSubjects.map((s) => s.id) },
    },
  });

  const subjectOptions = teacherSubjects.map((s) => ({
    id: s.id,
    name: `${s.name} (${s.class.name})`,
    code: s.code,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Examination & Marks</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Grade assessments and record subject-wise marks for your assigned courses.
        </p>
      </div>

      <ExamsClient
        exam={{ id: exam.id, name: exam.name, term: exam.term }}
        subjects={subjectOptions}
        students={students}
        allMarks={allMarks}
        initialSubjectId={activeSubject.id}
      />
    </div>
  );
}

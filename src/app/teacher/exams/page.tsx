import prisma from '@/lib/prisma';
import ExamsClient from '@/components/teacher/ExamsClient';

export const dynamic = 'force-dynamic';

export default async function TeacherExamsPage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string; examId?: string }>;
}) {
  const resolvedParams = await searchParams;

  const exams = await prisma.exam.findMany({
    include: {
      class: {
        include: {
          students: { include: { user: true } },
          subjects: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const activeExam = exams[0];
  if (!activeExam) {
    return <div className="p-8 text-center text-slate-500">No exams configured.</div>;
  }

  const subjects = activeExam.class.subjects;
  const students = activeExam.class.students;

  // Fetch existing marks for this exam and the first subject
  const initialMarks = await prisma.mark.findMany({
    where: {
      examId: activeExam.id,
      subjectId: subjects[0]?.id,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Examination & Marks</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Grade mid-term assessments, record subject marks, and compute GPA standing.
        </p>
      </div>

      <ExamsClient
        exam={{ id: activeExam.id, name: activeExam.name, term: activeExam.term }}
        subjects={subjects}
        students={students}
        initialMarks={initialMarks}
      />
    </div>
  );
}

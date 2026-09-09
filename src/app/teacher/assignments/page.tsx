import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import TeacherAssignmentsClient from '@/components/teacher/TeacherAssignmentsClient';
import { getAuthenticatedTeacher } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function TeacherAssignmentsPage() {
  const teacher = await getAuthenticatedTeacher();
  if (!teacher) {
    redirect('/teacher/login');
  }

  const subjectIds = teacher.subjects.map((s) => s.id);

  const assignments = await prisma.assignment.findMany({
    where: {
      subjectId: { in: subjectIds },
    },
    include: {
      subject: true,
    },
    orderBy: { dueDate: 'asc' },
  });

  const subjectOptions = teacher.subjects.map((s) => ({
    id: s.id,
    name: s.name,
    code: s.code,
  }));

  return (
    <div className="space-y-6">
      <TeacherAssignmentsClient assignments={assignments} subjects={subjectOptions} />
    </div>
  );
}

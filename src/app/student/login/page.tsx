import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getAuthenticatedStudentRoll } from '@/lib/auth';
import StudentLoginClient from '@/components/student/StudentLoginClient';

export const dynamic = 'force-dynamic';

export default async function StudentLoginPage() {
  const currentRoll = await getAuthenticatedStudentRoll();

  const students = await prisma.studentProfile.findMany({
    include: {
      user: true,
    },
    orderBy: { rollNumber: 'asc' },
  });

  const tags: Record<string, string> = {
    'STU-2026-001': 'Academic Merit',
    'STU-2026-002': 'Top Scorer',
    'STU-2026-003': 'Partial Dues',
    'STU-2026-004': 'High Achiever',
    'STU-2026-005': 'Overdue Fee / Late Logs',
    'STU-2026-006': 'Sports Dues Pending',
  };

  const demoStudents = students.map((s) => ({
    rollNumber: s.rollNumber,
    name: s.user.name,
    email: s.user.email,
    avatar: s.user.avatar,
    tag: tags[s.rollNumber] || 'Enrolled Student',
  }));

  return <StudentLoginClient demoStudents={demoStudents} activeRoll={currentRoll || null} />;
}

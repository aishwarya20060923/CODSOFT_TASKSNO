import prisma from '@/lib/prisma';
import ReportCardClient from '@/components/student/ReportCardClient';

export const dynamic = 'force-dynamic';

export default async function StudentResultsPage() {
  const student = await prisma.studentProfile.findFirst({
    where: { rollNumber: 'STU-2026-001' },
    include: {
      user: true,
      class: {
        include: {
          teacher: { include: { user: true } },
        },
      },
      marks: {
        include: {
          subject: true,
          exam: true,
        },
        orderBy: { subject: { name: 'asc' } },
      },
    },
  });

  if (!student) {
    return <div className="p-8 text-center text-slate-500">Student not found.</div>;
  }

  return (
    <ReportCardClient
      student={{
        name: student.user.name,
        email: student.user.email,
        rollNumber: student.rollNumber,
        className: student.class.name,
        adviserName: student.class.teacher?.user.name || 'Staff Faculty',
      }}
      marks={student.marks}
    />
  );
}

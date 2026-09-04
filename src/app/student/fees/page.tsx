import prisma from '@/lib/prisma';
import StudentFeesClient from '@/components/student/StudentFeesClient';

export const dynamic = 'force-dynamic';

export default async function StudentFeesPage() {
  const student = await prisma.studentProfile.findFirst({
    where: { rollNumber: 'STU-2026-001' },
    include: {
      feeInvoices: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!student) {
    return <div className="p-8 text-center text-slate-500">Student not found.</div>;
  }

  return <StudentFeesClient invoices={student.feeInvoices} />;
}

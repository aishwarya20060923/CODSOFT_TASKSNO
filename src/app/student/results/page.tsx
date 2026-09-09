import { redirect } from 'next/navigation';
import { getAuthenticatedStudent } from '@/lib/auth';
import ReportCardClient from '@/components/student/ReportCardClient';

export const dynamic = 'force-dynamic';

export default async function StudentResultsPage() {
  const student = await getAuthenticatedStudent();

  if (!student) {
    redirect('/student/login');
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

import { redirect } from 'next/navigation';
import { getAuthenticatedStudent } from '@/lib/auth';
import StudentFeesClient from '@/components/student/StudentFeesClient';

export const dynamic = 'force-dynamic';

export default async function StudentFeesPage() {
  const student = await getAuthenticatedStudent();

  if (!student) {
    redirect('/student/login');
  }

  return <StudentFeesClient invoices={student.feeInvoices} />;
}

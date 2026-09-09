import { redirect } from 'next/navigation';
import { getAuthenticatedStudentRoll } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function StudentPage() {
  const roll = await getAuthenticatedStudentRoll();
  if (roll) {
    redirect('/student/dashboard');
  } else {
    redirect('/student/login');
  }
}

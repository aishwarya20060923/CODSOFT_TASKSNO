import { NextResponse } from 'next/server';
import { getAuthenticatedStudent } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const student = await getAuthenticatedStudent();

  if (!student) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    student: {
      id: student.id,
      rollNumber: student.rollNumber,
      name: student.user.name,
      email: student.user.email,
      avatar: student.user.avatar,
      className: student.class?.name || '',
    },
  });
}

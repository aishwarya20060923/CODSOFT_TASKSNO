import { NextResponse } from 'next/server';
import { getAuthenticatedTeacher } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const teacher = await getAuthenticatedTeacher();

  if (!teacher) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    teacher: {
      id: teacher.id,
      employeeId: teacher.employeeId,
      name: teacher.user.name,
      email: teacher.user.email,
      avatar: teacher.user.avatar,
      department: teacher.department,
      designation: teacher.designation,
      assignedSubjectsCount: teacher.subjects.length,
      assignedClassesCount: teacher.classes.length,
      classes: teacher.classes.map((c) => ({ id: c.id, name: c.name })),
      subjects: teacher.subjects.map((s) => ({ id: s.id, name: s.name, code: s.code })),
    },
  });
}

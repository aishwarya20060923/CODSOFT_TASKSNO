import prisma from '@/lib/prisma';
import TeacherLoginClient from '@/components/teacher/TeacherLoginClient';
import { getAuthenticatedTeacherEmployeeId } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function TeacherLoginPage() {
  const activeEmployeeId = await getAuthenticatedTeacherEmployeeId();

  // Fetch all institutional demo teachers from Prisma
  const teacherProfiles = await prisma.teacherProfile.findMany({
    include: {
      user: true,
      subjects: {
        select: { name: true },
      },
    },
    orderBy: { employeeId: 'asc' },
  });

  const demoTeachers = teacherProfiles.map((t) => ({
    employeeId: t.employeeId,
    name: t.user.name,
    email: t.user.email,
    department: t.department,
    designation: t.designation,
    avatar: t.user.avatar,
    subjects: Array.from(new Set(t.subjects.map((s) => s.name))),
  }));

  return (
    <div className="w-full">
      <TeacherLoginClient demoTeachers={demoTeachers} activeEmployeeId={activeEmployeeId} />
    </div>
  );
}

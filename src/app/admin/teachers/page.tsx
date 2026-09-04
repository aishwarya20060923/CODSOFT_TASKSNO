import prisma from '@/lib/prisma';
import TeachersClient from '@/components/admin/TeachersClient';

export const dynamic = 'force-dynamic';

export default async function AdminTeachersPage() {
  const teachers = await prisma.teacherProfile.findMany({
    include: {
      user: true,
      classes: true,
      subjects: true,
    },
    orderBy: { employeeId: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Faculty & Teachers</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Academic personnel roster, department assignments, and instructor profiles.
        </p>
      </div>

      <TeachersClient teachers={teachers} />
    </div>
  );
}

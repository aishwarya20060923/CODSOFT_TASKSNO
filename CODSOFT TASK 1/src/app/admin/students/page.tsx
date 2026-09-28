import prisma from '@/lib/prisma';
import StudentsClient from '@/components/admin/StudentsClient';

export const dynamic = 'force-dynamic';

export default async function AdminStudentsPage() {
  const [students, classes] = await Promise.all([
    prisma.studentProfile.findMany({
      include: {
        user: true,
        class: true,
      },
      orderBy: { rollNumber: 'asc' },
    }),
    prisma.class.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Students Directory</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage institutional student admissions, classroom allocations, and guardian records.
        </p>
      </div>

      <StudentsClient students={students} classes={classes} />
    </div>
  );
}

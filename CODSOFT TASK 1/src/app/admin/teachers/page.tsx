import prisma from '@/lib/prisma';
import TeachersClient from '@/components/admin/TeachersClient';

export const dynamic = 'force-dynamic';

export default async function AdminTeachersPage() {
  const [teachers, classes, subjects] = await Promise.all([
    prisma.teacherProfile.findMany({
      include: {
        user: true,
        classes: true,
        classAssignments: {
          include: { class: true },
        },
        subjects: true,
      },
      orderBy: { employeeId: 'asc' },
    }),
    prisma.class.findMany({
      orderBy: { name: 'asc' },
    }),
    prisma.subject.findMany({
      include: { class: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  const mappedTeachers = teachers.map((t) => {
    const classMap = new Map<string, any>();
    t.classes?.forEach((c) => classMap.set(c.id, c));
    t.classAssignments?.forEach((ca) => {
      if (ca.class) classMap.set(ca.class.id, ca.class);
    });
    return {
      ...t,
      classes: Array.from(classMap.values()),
      classAssignments: t.classAssignments,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Faculty & Teachers</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Academic personnel roster, department assignments, and instructor profiles.
        </p>
      </div>

      <TeachersClient teachers={mappedTeachers} classes={classes} subjects={subjects} />
    </div>
  );
}

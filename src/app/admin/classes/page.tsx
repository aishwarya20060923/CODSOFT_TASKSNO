import prisma from '@/lib/prisma';
import ClassesClient from '@/components/admin/ClassesClient';

export const dynamic = 'force-dynamic';

export default async function AdminClassesPage() {
  const [classes, teachers] = await Promise.all([
    prisma.class.findMany({
      include: {
        teacher: {
          include: { user: true },
        },
        teacherAssignments: {
          include: {
            teacher: { include: { user: true } },
          },
        },
        students: {
          select: { id: true },
        },
        subjects: {
          include: {
            teacher: { include: { user: true } },
          },
        },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.teacherProfile.findMany({
      include: {
        user: true,
      },
      orderBy: { employeeId: 'asc' },
    }),
  ]);

  return <ClassesClient classes={classes} teachers={teachers} />;
}

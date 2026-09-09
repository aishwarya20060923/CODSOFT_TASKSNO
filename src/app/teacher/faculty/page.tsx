import prisma from '@/lib/prisma';
import TeacherFacultyClient from '@/components/teacher/TeacherFacultyClient';

export const dynamic = 'force-dynamic';

export default async function TeacherFacultyPage() {
  const faculty = await prisma.teacherProfile.findMany({
    include: {
      user: true,
      classes: true,
      classAssignments: {
        include: { class: true },
      },
      subjects: true,
    },
    orderBy: { employeeId: 'asc' },
  });

  const mappedFaculty = faculty.map((t) => {
    const classMap = new Map<string, any>();
    t.classes?.forEach((c) => classMap.set(c.id, c));
    t.classAssignments?.forEach((ca) => {
      if (ca.class) classMap.set(ca.class.id, ca.class);
    });
    return {
      ...t,
      classes: Array.from(classMap.values()),
    };
  });

  return (
    <div className="space-y-6">
      <TeacherFacultyClient faculty={mappedFaculty} />
    </div>
  );
}

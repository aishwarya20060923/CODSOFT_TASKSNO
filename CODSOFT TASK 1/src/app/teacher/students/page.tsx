import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import TeacherStudentsClient, { TeacherStudentItem } from '@/components/teacher/TeacherStudentsClient';
import { getAuthenticatedTeacher } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function TeacherStudentsPage() {
  const teacher = await getAuthenticatedTeacher();
  if (!teacher) {
    redirect('/teacher/login');
  }

  // Teacher's assigned subjects and classes
  const teacherSubjects = teacher.subjects;
  const teacherSubjectIds = teacherSubjects.map((s) => s.id);
  const teacherClassIds = Array.from(
    new Set([
      ...teacher.classes.map((c) => c.id),
      ...teacherSubjects.map((s) => s.classId),
    ])
  );

  // Fetch only students belonging to these classes
  const students = await prisma.studentProfile.findMany({
    where: {
      classId: { in: teacherClassIds },
    },
    include: {
      user: true,
      class: true,
      attendances: {
        where: {
          subjectId: { in: teacherSubjectIds },
        },
      },
    },
    orderBy: { rollNumber: 'asc' },
  });

  // Transform into TeacherStudentItem array
  const formattedStudents: TeacherStudentItem[] = students.map((st) => {
    // Subjects this teacher teaches to this student
    const studentTeacherSubjects = teacherSubjects.filter((s) => s.classId === st.classId);
    const subjectNames = studentTeacherSubjects.map((s) => s.name);
    const subjectIds = studentTeacherSubjects.map((s) => s.id);

    const total = st.attendances.length;
    const present = st.attendances.filter((a) => a.status === 'PRESENT').length;
    const pct = total > 0 ? Math.round((present / total) * 100) : 100;

    return {
      id: st.id,
      rollNumber: st.rollNumber,
      name: st.user.name,
      email: st.user.email,
      avatar: st.user.avatar,
      className: st.class.name,
      classId: st.class.id,
      subjectNames,
      subjectIds,
      totalSessions: total,
      presentSessions: present,
      attendancePct: pct,
      parentPhone: st.parentPhone,
    };
  });

  const subjectOptions = teacherSubjects.map((s) => ({
    id: s.id,
    name: s.name,
    code: s.code,
  }));

  const classOptions = Array.from(
    new Map(
      teacherSubjects.map((s) => [s.class.id, { id: s.class.id, name: s.class.name }])
    ).values()
  );

  return (
    <div className="space-y-6">
      <TeacherStudentsClient
        students={formattedStudents}
        subjects={subjectOptions}
        classes={classOptions}
      />
    </div>
  );
}

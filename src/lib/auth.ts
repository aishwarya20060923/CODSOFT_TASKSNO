import { cookies } from 'next/headers';
import prisma from './prisma';

export const STUDENT_COOKIE_NAME = 'edumanage_student_session';
export const TEACHER_COOKIE_NAME = 'edumanage_teacher_session';

// --- Student Authentication ---
export async function getAuthenticatedStudentRoll(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(STUDENT_COOKIE_NAME);
  return session?.value || null;
}

export async function getAuthenticatedStudent() {
  const roll = await getAuthenticatedStudentRoll();
  if (!roll) return null;

  try {
    const student = await prisma.studentProfile.findFirst({
      where: {
        rollNumber: {
          equals: roll,
        },
      },
      include: {
        user: true,
        class: {
          include: {
            teacher: { include: { user: true } },
            subjects: {
              include: {
                teacher: { include: { user: true } },
              },
            },
          },
        },
        attendances: {
          include: {
            subject: {
              include: {
                teacher: { include: { user: true } },
              },
            },
            teacher: { include: { user: true } },
          },
          orderBy: { date: 'desc' },
        },
        marks: {
          include: { subject: true, exam: true },
          orderBy: { subject: { name: 'asc' } },
        },
        feeInvoices: { orderBy: { createdAt: 'desc' } },
      },
    });

    return student;
  } catch (err) {
    console.error('Error fetching authenticated student:', err);
    return null;
  }
}

// --- Teacher Authentication ---
export async function getAuthenticatedTeacherEmployeeId(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(TEACHER_COOKIE_NAME);
  return session?.value || null;
}

export async function getAuthenticatedTeacher() {
  const empId = await getAuthenticatedTeacherEmployeeId();
  if (!empId) return null;

  try {
    const teacher = await prisma.teacherProfile.findFirst({
      where: {
        employeeId: empId,
      },
      include: {
        user: true,
        classes: {
          include: {
            students: {
              include: { user: true },
              orderBy: { rollNumber: 'asc' },
            },
            subjects: true,
          },
        },
        classAssignments: {
          include: {
            class: {
              include: {
                students: {
                  include: { user: true },
                  orderBy: { rollNumber: 'asc' },
                },
                subjects: true,
              },
            },
          },
        },
        subjects: {
          include: {
            class: {
              include: {
                students: {
                  include: { user: true },
                  orderBy: { rollNumber: 'asc' },
                },
              },
            },
          },
        },
        subjectAssignments: {
          include: {
            subject: {
              include: {
                class: {
                  include: {
                    students: {
                      include: { user: true },
                      orderBy: { rollNumber: 'asc' },
                    },
                  },
                },
              },
            },
          },
        },
        assignments: {
          include: { subject: true },
          orderBy: { dueDate: 'asc' },
        },
        announcements: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!teacher) return null;

    // Merge all assigned classes from teacher.classes, classAssignments, and taught subjects
    const classMap = new Map<string, any>();
    teacher.classes.forEach((cls) => classMap.set(cls.id, cls));
    teacher.classAssignments?.forEach((ca) => {
      if (ca.class) classMap.set(ca.class.id, ca.class);
    });
    teacher.subjects?.forEach((sub) => {
      if (sub.class) classMap.set(sub.class.id, sub.class);
    });

    // Merge all assigned subjects from teacher.subjects and subjectAssignments
    const subjectMap = new Map<string, any>();
    teacher.subjects.forEach((sub) => subjectMap.set(sub.id, sub));
    teacher.subjectAssignments?.forEach((sa) => {
      if (sa.subject) subjectMap.set(sa.subject.id, sa.subject);
    });

    return {
      ...teacher,
      classes: Array.from(classMap.values()),
      subjects: Array.from(subjectMap.values()),
    };
  } catch (err) {
    console.error('Error fetching authenticated teacher:', err);
    return null;
  }
}

// --- Server-Side Authorization Checks ---
export async function verifyTeacherSubjectAccess(
  teacherId: string,
  subjectId: string
): Promise<boolean> {
  const [directSubject, assignedSubject] = await Promise.all([
    prisma.subject.findFirst({
      where: {
        id: subjectId,
        teacherId: teacherId,
      },
    }),
    prisma.teacherSubjectAssignment.findFirst({
      where: {
        teacherId,
        subjectId,
      },
    }),
  ]);
  return !!directSubject || !!assignedSubject;
}

export async function verifyTeacherClassAccess(
  teacherId: string,
  classId: string
): Promise<boolean> {
  // A teacher has access to a class if assigned via TeacherClassAssignment,
  // primary advisory, or teaching a subject in that class.
  const [hasAssignment, isAdvisory, teachesSubject] = await Promise.all([
    prisma.teacherClassAssignment.findFirst({
      where: { classId, teacherId },
    }),
    prisma.class.findFirst({
      where: { id: classId, teacherId },
    }),
    prisma.subject.findFirst({
      where: {
        classId,
        OR: [
          { teacherId },
          { teacherAssignments: { some: { teacherId } } },
        ],
      },
    }),
  ]);
  return !!hasAssignment || !!isAdvisory || !!teachesSubject;
}


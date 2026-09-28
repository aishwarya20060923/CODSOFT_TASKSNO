'use server';

import { revalidatePath } from 'next/cache';
import prisma from './prisma';
import { getAuthenticatedTeacher } from './auth';

// 1. Student Actions
export async function createStudent(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const rollNumber = formData.get('rollNumber') as string;
  const classId = formData.get('classId') as string;
  const gender = (formData.get('gender') as string) || 'Other';
  const phone = formData.get('phone') as string;
  const parentName = formData.get('parentName') as string;
  const parentPhone = formData.get('parentPhone') as string;
  const address = formData.get('address') as string;
  const customAvatar = (formData.get('avatar') as string)?.trim();

  // Neutral professional formal default or monogram (NO cartoon dicebear)
  const avatar =
    customAvatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=ffffff&bold=true&rounded=true`;

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: 'STUDENT',
        avatar,
      },
    });

    await prisma.studentProfile.create({
      data: {
        userId: user.id,
        rollNumber,
        classId,
        gender,
        phone,
        parentName,
        parentPhone,
        address,
      },
    });

    revalidatePath('/admin/students');
    revalidatePath('/admin');
    return { success: true, message: 'Student registered successfully with professional profile!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to register student' };
  }
}

export async function updateStudentProfile(formData: FormData) {
  const studentId = formData.get('studentId') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const rollNumber = formData.get('rollNumber') as string;
  const classId = formData.get('classId') as string;
  const phone = formData.get('phone') as string;
  const parentName = formData.get('parentName') as string;
  const parentPhone = formData.get('parentPhone') as string;
  const address = formData.get('address') as string;
  const customAvatar = (formData.get('avatar') as string)?.trim();

  try {
    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: { user: true },
    });

    if (!student) {
      return { success: false, error: 'Student profile not found' };
    }

    const avatar =
      customAvatar ||
      student.user.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name || student.user.name)}&background=4f46e5&color=ffffff&bold=true&rounded=true`;

    await prisma.user.update({
      where: { id: student.userId },
      data: {
        name: name || student.user.name,
        email: email || student.user.email,
        avatar,
      },
    });

    await prisma.studentProfile.update({
      where: { id: studentId },
      data: {
        rollNumber: rollNumber || student.rollNumber,
        classId: classId || student.classId,
        phone: phone !== undefined ? phone : student.phone,
        parentName: parentName !== undefined ? parentName : student.parentName,
        parentPhone: parentPhone !== undefined ? parentPhone : student.parentPhone,
        address: address !== undefined ? address : student.address,
      },
    });

    revalidatePath('/admin/students');
    revalidatePath('/student/dashboard');
    revalidatePath('/student');
    return { success: true, message: 'Student profile updated successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update student profile' };
  }
}

// 2. Teacher Actions
export async function createTeacher(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const employeeId = formData.get('employeeId') as string;
  const department = formData.get('department') as string;
  const designation = (formData.get('designation') as string) || 'Faculty Member';
  const phone = formData.get('phone') as string;
  const qualification = formData.get('qualification') as string;
  const customAvatar = (formData.get('avatar') as string)?.trim();

  const avatar =
    customAvatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=059669&color=ffffff&bold=true&rounded=true`;

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: 'TEACHER',
        avatar,
      },
    });

    await prisma.teacherProfile.create({
      data: {
        userId: user.id,
        employeeId,
        department,
        designation,
        phone,
        qualification,
      },
    });

    revalidatePath('/admin/teachers');
    revalidatePath('/admin');
    revalidatePath('/teacher/faculty');
    return { success: true, message: 'Teacher appointed successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to register teacher' };
  }
}

// 3. Class & Curriculum Actions
export async function createClass(formData: FormData) {
  const name = formData.get('name') as string;
  const grade = formData.get('grade') as string;
  const section = formData.get('section') as string;
  const room = (formData.get('room') as string) || null;
  const teacherId = (formData.get('teacherId') as string) || null;

  if (!name || !grade || !section) {
    return { success: false, error: 'Class Name, Grade, and Section are required.' };
  }

  try {
    await prisma.class.create({
      data: {
        name,
        grade,
        section,
        room,
        teacherId: teacherId && teacherId !== 'none' ? teacherId : null,
      },
    });

    revalidatePath('/admin/classes');
    revalidatePath('/admin');
    revalidatePath('/teacher/dashboard');
    return { success: true, message: `Class ${name} appointed successfully!` };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create class' };
  }
}

export async function createSubjectSchedule(formData: FormData) {
  const name = formData.get('name') as string;
  const code = formData.get('code') as string;
  const classId = formData.get('classId') as string;
  const teacherId = (formData.get('teacherId') as string) || null;

  if (!name || !code || !classId) {
    return { success: false, error: 'Subject Name, Code, and Class are required.' };
  }

  try {
    await prisma.subject.create({
      data: {
        name,
        code,
        classId,
        teacherId: teacherId && teacherId !== 'none' ? teacherId : null,
      },
    });

    revalidatePath('/admin/classes');
    revalidatePath('/admin');
    revalidatePath('/teacher/exams');
    return { success: true, message: `Subject ${name} (${code}) scheduled successfully!` };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to schedule subject' };
  }
}

// 3. Attendance Actions
export async function saveSubjectAttendance(
  subjectId: string,
  classId: string,
  date: string,
  attendanceRecords: {
    studentId: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE';
    remarks?: string;
  }[]
) {
  try {
    const teacher = await getAuthenticatedTeacher();
    if (!teacher) {
      return { success: false, error: 'Unauthorized: You must be logged in as a teacher.' };
    }

    // Server-side authorization check: verify teacher is assigned to this subject
    const ownsSubject = teacher.subjects.some((s) => s.id === subjectId);
    if (!ownsSubject) {
      return {
        success: false,
        error: 'Forbidden: You are only authorized to mark attendance for your assigned subjects.',
      };
    }

    for (const record of attendanceRecords) {
      await prisma.attendance.upsert({
        where: {
          studentId_subjectId_date: {
            studentId: record.studentId,
            subjectId,
            date,
          },
        },
        update: {
          status: record.status,
          remarks: record.remarks || '',
          classId,
          teacherId: teacher.id,
        },
        create: {
          studentId: record.studentId,
          subjectId,
          classId,
          teacherId: teacher.id,
          date,
          status: record.status,
          remarks: record.remarks || '',
        },
      });
    }

    revalidatePath('/teacher/attendance');
    revalidatePath('/teacher/dashboard');
    revalidatePath('/teacher/students');
    revalidatePath('/student/attendance');
    revalidatePath('/student/dashboard');

    return {
      success: true,
      message: `Attendance for ${attendanceRecords.length} students on ${date} saved successfully!`,
    };
  } catch (error: any) {
    console.error('Error in saveSubjectAttendance:', error);
    return { success: false, error: error.message || 'Failed to record subject attendance' };
  }
}

export async function saveClassAttendance(
  classId: string,
  date: string,
  attendanceRecords: { studentId: string; status: 'PRESENT' | 'ABSENT' | 'LATE'; remarks?: string }[]
) {
  try {
    const teacher = await getAuthenticatedTeacher();
    const teacherId = teacher?.id || null;

    for (const record of attendanceRecords) {
      await prisma.attendance.upsert({
        where: {
          studentId_subjectId_date: {
            studentId: record.studentId,
            subjectId: 'GENERAL',
            date,
          },
        },
        update: {
          status: record.status,
          remarks: record.remarks || '',
          classId,
          teacherId,
        },
        create: {
          classId,
          date,
          studentId: record.studentId,
          subjectId: 'GENERAL',
          teacherId,
          status: record.status,
          remarks: record.remarks || '',
        },
      });
    }

    revalidatePath('/teacher/attendance');
    revalidatePath('/admin');
    revalidatePath('/student/attendance');
    return { success: true, message: `Attendance for ${date} saved successfully!` };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to record attendance' };
  }
}

// 4. Examination & Marks Actions
export async function saveExamMarks(
  examId: string,
  subjectId: string,
  marksRecords: {
    studentId: string;
    marksObtained: number;
    maxMarks: number;
    grade: string;
    remarks?: string;
  }[]
) {
  try {
    const teacher = await getAuthenticatedTeacher();
    if (teacher) {
      // Server-side authorization check: verify teacher owns this subject
      const ownsSubject = teacher.subjects.some((s) => s.id === subjectId);
      if (!ownsSubject) {
        return {
          success: false,
          error: 'Forbidden: You are only authorized to enter marks for your assigned subjects.',
        };
      }
    }

    for (const record of marksRecords) {
      await prisma.mark.upsert({
        where: {
          examId_studentId_subjectId: {
            examId,
            studentId: record.studentId,
            subjectId,
          },
        },
        update: {
          marksObtained: record.marksObtained,
          maxMarks: record.maxMarks,
          grade: record.grade,
          remarks: record.remarks || '',
        },
        create: {
          examId,
          studentId: record.studentId,
          subjectId,
          marksObtained: record.marksObtained,
          maxMarks: record.maxMarks,
          grade: record.grade,
          remarks: record.remarks || '',
        },
      });
    }

    revalidatePath('/teacher/exams');
    revalidatePath('/student/results');
    return { success: true, message: 'Marks updated and published successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to save marks' };
  }
}

// 5. Fee Actions
export async function createFeeInvoice(formData: FormData) {
  const studentId = formData.get('studentId') as string;
  const title = formData.get('title') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const dueDate = formData.get('dueDate') as string;
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

  try {
    await prisma.feeInvoice.create({
      data: {
        invoiceNumber,
        studentId,
        title,
        amount,
        paidAmount: 0,
        dueDate,
        status: 'PENDING',
      },
    });

    revalidatePath('/admin/fees');
    revalidatePath('/student/fees');
    return { success: true, message: 'Fee invoice issued successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to issue invoice' };
  }
}

export async function payFeeInvoice(invoiceId: string, paymentMethod: string = 'Online Portal') {
  try {
    const invoice = await prisma.feeInvoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) throw new Error('Invoice not found');

    await prisma.feeInvoice.update({
      where: { id: invoiceId },
      data: {
        status: 'PAID',
        paidAmount: invoice.amount,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod,
      },
    });

    revalidatePath('/admin/fees');
    revalidatePath('/student/fees');
    return { success: true, message: 'Payment recorded successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to record payment' };
  }
}

// 6. Assignment Actions
export async function createAssignment(formData: FormData) {
  try {
    const teacher = await getAuthenticatedTeacher();
    if (!teacher) {
      return { success: false, error: 'Unauthorized: Teacher login required.' };
    }

    const title = (formData.get('title') as string)?.trim();
    const description = (formData.get('description') as string)?.trim();
    const dueDate = (formData.get('dueDate') as string)?.trim();
    const subjectId = (formData.get('subjectId') as string)?.trim();

    if (!title || !dueDate || !subjectId) {
      return { success: false, error: 'Title, due date, and subject are required.' };
    }

    // Verify teacher teaches this subject
    const ownsSubject = teacher.subjects.some((s) => s.id === subjectId);
    if (!ownsSubject) {
      return {
        success: false,
        error: 'Forbidden: You can only create assignments for your assigned subjects.',
      };
    }

    await prisma.assignment.create({
      data: {
        title,
        description: description || '',
        dueDate,
        subjectId,
        teacherId: teacher.id,
      },
    });

    revalidatePath('/teacher/assignments');
    revalidatePath('/teacher/dashboard');
    revalidatePath('/student/dashboard');

    return { success: true, message: 'Assignment created successfully!' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create assignment' };
  }
}

// 7. Announcement Actions
export async function createAnnouncement(formData: FormData) {
  try {
    const teacher = await getAuthenticatedTeacher();
    const title = (formData.get('title') as string)?.trim();
    const content = (formData.get('content') as string)?.trim();
    const category = (formData.get('category') as string)?.trim() || 'GENERAL';
    const classId = (formData.get('classId') as string)?.trim() || null;

    if (!title || !content) {
      return { success: false, error: 'Title and content are required.' };
    }

    const authorName = teacher ? teacher.user.name : 'Academic Administration';
    const teacherId = teacher ? teacher.id : null;

    await prisma.announcement.create({
      data: {
        title,
        content,
        category,
        authorName,
        teacherId,
        classId: classId || null,
      },
    });

    revalidatePath('/teacher/announcements');
    revalidatePath('/teacher/dashboard');
    revalidatePath('/student/dashboard');

    return { success: true, message: 'Announcement published successfully!' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to publish announcement' };
  }
}

// 8. Admin Teacher Management Actions
export async function updateTeacherProfile(formData: FormData) {
  try {
    const teacherId = formData.get('teacherId') as string;
    const name = (formData.get('name') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();
    const department = (formData.get('department') as string)?.trim();
    const designation = (formData.get('designation') as string)?.trim();
    const phone = (formData.get('phone') as string)?.trim();
    const qualification = (formData.get('qualification') as string)?.trim();
    const avatar = (formData.get('avatar') as string)?.trim();

    const existing = await prisma.teacherProfile.findUnique({
      where: { id: teacherId },
      include: { user: true },
    });

    if (!existing) {
      return { success: false, error: 'Teacher not found' };
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: existing.userId },
        data: {
          name: name || existing.user.name,
          email: email || existing.user.email,
          avatar: avatar !== undefined ? (avatar || null) : existing.user.avatar,
        },
      }),
      prisma.teacherProfile.update({
        where: { id: teacherId },
        data: {
          department: department || existing.department,
          designation: designation || existing.designation,
          phone: phone || null,
          qualification: qualification || null,
        },
      }),
    ]);

    revalidatePath('/admin/teachers');
    revalidatePath('/teacher/dashboard');
    revalidatePath('/teacher/faculty');
    return { success: true, message: 'Faculty profile updated successfully!' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update teacher profile' };
  }
}

export async function assignTeacherSubject(formData: FormData) {
  try {
    const teacherId = formData.get('teacherId') as string;
    const subjectId = formData.get('subjectId') as string;

    await prisma.subject.update({
      where: { id: subjectId },
      data: { teacherId },
    });

    revalidatePath('/admin/teachers');
    revalidatePath('/admin/classes');
    revalidatePath('/teacher/dashboard');
    return { success: true, message: 'Subject assigned to faculty successfully!' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to assign subject' };
  }
}

export async function assignTeacherClass(formData: FormData) {
  try {
    const teacherId = formData.get('teacherId') as string;
    const classId = formData.get('classId') as string;
    const classIds = formData.getAll('classIds') as string[];

    if (!teacherId) {
      return { success: false, error: 'Teacher ID is required.' };
    }

    if (classIds && classIds.length > 0) {
      // Sync multiple classes for this teacher
      await prisma.$transaction(async (tx) => {
        await tx.teacherClassAssignment.deleteMany({
          where: { teacherId },
        });
        await tx.teacherClassAssignment.createMany({
          data: classIds.map((cId) => ({
            teacherId,
            classId: cId,
          })),
        });
      });
    } else if (classId) {
      // Single class assignment via upsert
      await prisma.teacherClassAssignment.upsert({
        where: {
          teacherId_classId: { teacherId, classId },
        },
        update: {},
        create: {
          teacherId,
          classId,
        },
      });
      // Optionally update advisory if class doesn't have one
      const targetClass = await prisma.class.findUnique({ where: { id: classId } });
      if (targetClass && !targetClass.teacherId) {
        await prisma.class.update({
          where: { id: classId },
          data: { teacherId },
        });
      }
    }

    revalidatePath('/admin/teachers');
    revalidatePath('/admin/classes');
    revalidatePath('/teacher/dashboard');
    revalidatePath('/teacher/students');
    return { success: true, message: 'Program assignments updated successfully!' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to assign class' };
  }
}

export async function assignClassTeachers(formData: FormData) {
  try {
    const classId = formData.get('classId') as string;
    const teacherIds = formData.getAll('teacherIds') as string[];

    if (!classId) {
      return { success: false, error: 'Class ID is required.' };
    }

    await prisma.$transaction(async (tx) => {
      await tx.teacherClassAssignment.deleteMany({
        where: { classId },
      });
      if (teacherIds && teacherIds.length > 0) {
        await tx.teacherClassAssignment.createMany({
          data: teacherIds.map((tId) => ({
            teacherId: tId,
            classId,
          })),
        });
        // Set first teacher as class advisory head if not set
        const cls = await tx.class.findUnique({ where: { id: classId } });
        if (cls && (!cls.teacherId || !teacherIds.includes(cls.teacherId))) {
          await tx.class.update({
            where: { id: classId },
            data: { teacherId: teacherIds[0] },
          });
        }
      }
    });

    revalidatePath('/admin/teachers');
    revalidatePath('/admin/classes');
    revalidatePath('/teacher/dashboard');
    revalidatePath('/teacher/students');
    return { success: true, message: 'Program faculty roster updated successfully!' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update program faculty' };
  }
}

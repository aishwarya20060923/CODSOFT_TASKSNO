'use server';

import { revalidatePath } from 'next/cache';
import prisma from './prisma';

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

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: 'STUDENT',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
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
    return { success: true, message: 'Student registered successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to register student' };
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

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: 'TEACHER',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
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
    return { success: true, message: 'Teacher registered successfully!' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to register teacher' };
  }
}

// 3. Attendance Actions
export async function saveClassAttendance(
  classId: string,
  date: string,
  attendanceRecords: { studentId: string; status: 'PRESENT' | 'ABSENT' | 'LATE'; remarks?: string }[]
) {
  try {
    for (const record of attendanceRecords) {
      await prisma.attendance.upsert({
        where: {
          studentId_date: {
            studentId: record.studentId,
            date,
          },
        },
        update: {
          status: record.status,
          remarks: record.remarks || '',
        },
        create: {
          classId,
          date,
          studentId: record.studentId,
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

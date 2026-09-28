'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import prisma from './prisma';

const STUDENT_COOKIE_NAME = 'edumanage_student_session';

function isValidDemoPassword(identifier: string, passwordAttempt: string): boolean {
  const cleanPassword = passwordAttempt.trim();
  if (cleanPassword === 'student123') return true;

  const idLower = identifier.toLowerCase().trim();
  const validNames = ['aarav', 'ananya', 'rohan', 'diya', 'arjun', 'kavya'];
  for (const name of validNames) {
    if (idLower.includes(name) && cleanPassword.toLowerCase() === `${name}123`) {
      return true;
    }
  }

  if (cleanPassword === 'student@123' || cleanPassword === 'demo123') {
    return true;
  }

  return false;
}

export async function loginStudentAction(formData: FormData) {
  const identifier = (formData.get('identifier') as string)?.trim() || '';
  const password = (formData.get('password') as string)?.trim() || '';

  if (!identifier) {
    return { success: false, error: 'Please enter your Roll Number or Student Email' };
  }

  if (!password) {
    return { success: false, error: 'Please enter your password' };
  }

  const student = await prisma.studentProfile.findFirst({
    where: {
      OR: [
        { rollNumber: identifier },
        { user: { email: identifier.toLowerCase() } },
        { user: { name: identifier } },
      ],
    },
    include: {
      user: true,
    },
  });

  if (!student) {
    return {
      success: false,
      error: 'Student record not found with the provided credentials. Try roll number STU-2026-001.',
    };
  }

  if (!isValidDemoPassword(student.rollNumber + ' ' + student.user.name, password)) {
    return {
      success: false,
      error: `Invalid password for ${student.user.name}. Demo password is 'student123' or '${student.user.name.split(' ')[0].toLowerCase()}123'.`,
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(STUDENT_COOKIE_NAME, student.rollNumber, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  revalidatePath('/student');
  revalidatePath('/student/dashboard');
  revalidatePath('/student/attendance');
  revalidatePath('/student/results');
  revalidatePath('/student/fees');

  redirect('/student/dashboard');
}

export async function loginStudentDirectAction(rollNumber: string) {
  const student = await prisma.studentProfile.findUnique({
    where: { rollNumber },
  });

  if (!student) {
    return { success: false, error: 'Student not found' };
  }

  const cookieStore = await cookies();
  cookieStore.set(STUDENT_COOKIE_NAME, student.rollNumber, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  revalidatePath('/student');
  revalidatePath('/student/dashboard');
  revalidatePath('/student/attendance');
  revalidatePath('/student/results');
  revalidatePath('/student/fees');

  redirect('/student/dashboard');
}

export async function logoutStudentAction() {
  const cookieStore = await cookies();
  cookieStore.delete(STUDENT_COOKIE_NAME);

  revalidatePath('/student');
  redirect('/student/login');
}

// ==========================================
// TEACHER AUTHENTICATION SERVER ACTIONS
// ==========================================
const TEACHER_COOKIE_NAME = 'edumanage_teacher_session';

function isValidTeacherPassword(identifier: string, passwordAttempt: string): boolean {
  const cleanPassword = passwordAttempt.trim().toLowerCase();
  if (
    cleanPassword === 'teacher123' ||
    cleanPassword === 'teacher@123' ||
    cleanPassword === 'demo123' ||
    cleanPassword === 'admin123'
  ) {
    return true;
  }

  const idLower = identifier.toLowerCase().trim();
  const validNames = ['rajesh', 'priya', 'rahul', 'sneha', 'meenakshi', 'sharma', 'nair', 'kumar', 'patil'];
  for (const name of validNames) {
    if (idLower.includes(name) && cleanPassword === `${name}123`) {
      return true;
    }
  }

  return false;
}

export async function loginTeacherAction(formData: FormData) {
  const identifier = (formData.get('identifier') as string)?.trim() || '';
  const password = (formData.get('password') as string)?.trim() || '';

  if (!identifier) {
    return { success: false, error: 'Please enter your Employee ID or Faculty Email' };
  }

  if (!password) {
    return { success: false, error: 'Please enter your password' };
  }

  // Find teacher by Employee ID, Email, or Name
  const teacher = await prisma.teacherProfile.findFirst({
    where: {
      OR: [
        { employeeId: { equals: identifier } },
        { user: { email: { equals: identifier.toLowerCase() } } },
        { user: { name: { contains: identifier } } },
      ],
    },
    include: {
      user: true,
    },
  });

  if (!teacher) {
    return {
      success: false,
      error: 'Teacher account not found. Please verify your Employee ID (e.g., EMP-MATH-101) or email.',
    };
  }

  if (!isValidTeacherPassword(teacher.employeeId + ' ' + teacher.user.name, password)) {
    return {
      success: false,
      error: `Invalid password for ${teacher.user.name}. Demo password is 'teacher123'.`,
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(TEACHER_COOKIE_NAME, teacher.employeeId, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  revalidatePath('/teacher');
  revalidatePath('/teacher/dashboard');
  revalidatePath('/teacher/attendance');
  revalidatePath('/teacher/students');
  revalidatePath('/teacher/exams');
  revalidatePath('/teacher/faculty');

  redirect('/teacher/dashboard');
}

export async function loginTeacherDirectAction(employeeId: string) {
  const teacher = await prisma.teacherProfile.findUnique({
    where: { employeeId },
  });

  if (!teacher) {
    return { success: false, error: 'Teacher not found' };
  }

  const cookieStore = await cookies();
  cookieStore.set(TEACHER_COOKIE_NAME, teacher.employeeId, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  revalidatePath('/teacher');
  revalidatePath('/teacher/dashboard');
  revalidatePath('/teacher/attendance');
  revalidatePath('/teacher/students');
  revalidatePath('/teacher/exams');
  revalidatePath('/teacher/faculty');

  redirect('/teacher/dashboard');
}

export async function logoutTeacherAction() {
  const cookieStore = await cookies();
  cookieStore.delete(TEACHER_COOKIE_NAME);

  revalidatePath('/teacher');
  redirect('/teacher/login');
}


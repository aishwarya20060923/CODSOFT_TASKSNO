import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing records...');
  await prisma.teacherClassAssignment.deleteMany();
  await prisma.teacherSubjectAssignment.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.mark.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.feeInvoice.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.teacherProfile.deleteMany();
  await prisma.class.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding Users, Teachers, Classes, and Subjects...');

  // 1. Admin User
  const adminUser = await prisma.user.create({
    data: {
      name: 'Dr. Anandita Verma',
      email: 'admin@edumanage.edu.in',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    },
  });

  // 2. The 4 Demo Teachers explicitly requested
  // 1. Prof. Rajesh Sharma – Mathematics
  const userRajesh = await prisma.user.create({
    data: {
      name: 'Prof. Rajesh Sharma',
      email: 'rajesh.sharma@edumanage.edu.in',
      role: 'TEACHER',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80',
    },
  });
  const teacherRajesh = await prisma.teacherProfile.create({
    data: {
      userId: userRajesh.id,
      employeeId: 'EMP-MATH-101',
      department: 'Mathematics',
      designation: 'Professor & HOD',
      phone: '+91 98450 23456',
      qualification: 'Ph.D. in Applied Mathematics (IIT Delhi)',
    },
  });

  // 2. Prof. Priya Nair – Computer Science, Java
  const userPriya = await prisma.user.create({
    data: {
      name: 'Prof. Priya Nair',
      email: 'priya.nair@edumanage.edu.in',
      role: 'TEACHER',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80',
    },
  });
  const teacherPriya = await prisma.teacherProfile.create({
    data: {
      userId: userPriya.id,
      employeeId: 'EMP-CS-102',
      department: 'Computer Science',
      designation: 'Associate Professor & Lab Head',
      phone: '+91 98111 22334',
      qualification: 'M.Tech, Ph.D. in Computer Science (IISc Bangalore)',
    },
  });

  // 3. Prof. Rahul Kumar – Database Management
  const userRahul = await prisma.user.create({
    data: {
      name: 'Prof. Rahul Kumar',
      email: 'rahul.kumar@edumanage.edu.in',
      role: 'TEACHER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    },
  });
  const teacherRahul = await prisma.teacherProfile.create({
    data: {
      userId: userRahul.id,
      employeeId: 'EMP-DB-103',
      department: 'Business Administration',
      designation: 'Associate Professor',
      phone: '+91 98220 33445',
      qualification: 'Ph.D. in Management Studies (IIT Bombay)',
    },
  });

  // 4. Prof. Sneha Patil – Commerce & Accounting (B.Com)
  const userSneha = await prisma.user.create({
    data: {
      name: 'Prof. Sneha Patil',
      email: 'sneha.patil@edumanage.edu.in',
      role: 'TEACHER',
      avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=300&auto=format&fit=crop&q=80',
    },
  });
  const teacherSneha = await prisma.teacherProfile.create({
    data: {
      userId: userSneha.id,
      employeeId: 'EMP-WEB-104',
      department: 'Commerce & Accounting',
      designation: 'Assistant Professor',
      phone: '+91 98205 66778',
      qualification: 'M.Com, Ph.D. in Commerce (Pune University)',
    },
  });

  // 5. Prof. Anjali Mehta – Management & Commerce (BBA + B.Com)
  const userAnjali = await prisma.user.create({
    data: {
      name: 'Prof. Anjali Mehta',
      email: 'anjali.mehta@edumanage.edu.in',
      role: 'TEACHER',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    },
  });
  const teacherAnjali = await prisma.teacherProfile.create({
    data: {
      userId: userAnjali.id,
      employeeId: 'EMP-MGMT-105',
      department: 'Management & Commerce',
      designation: 'Associate Professor',
      phone: '+91 98410 55667',
      qualification: 'Ph.D. in Business Administration (IIM Ahmedabad)',
    },
  });

  // 3. Classes - Exactly 3 Programs: BCA, BBA, and B.Com (No semesters)
  const classBCA = await prisma.class.create({
    data: {
      name: 'BCA',
      grade: 'BCA',
      section: 'A',
      room: 'Computer Lab / Hall 301',
      teacherId: teacherRajesh.id,
    },
  });

  const classBBA = await prisma.class.create({
    data: {
      name: 'BBA',
      grade: 'BBA',
      section: 'A',
      room: 'Seminar Hall 201',
      teacherId: teacherAnjali.id,
    },
  });

  const classBCom = await prisma.class.create({
    data: {
      name: 'B.Com',
      grade: 'BCOM',
      section: 'A',
      room: 'Commerce Hall 101',
      teacherId: teacherSneha.id,
    },
  });

  // 3b. Program Assignments (TeacherClassAssignment: Many-to-Many)
  // BCA: Rajesh, Priya, Rahul, Sneha
  // BBA: Rahul, Anjali
  // B.Com: Sneha, Anjali
  await prisma.teacherClassAssignment.createMany({
    data: [
      { teacherId: teacherRajesh.id, classId: classBCA.id },
      { teacherId: teacherPriya.id, classId: classBCA.id },
      { teacherId: teacherRahul.id, classId: classBCA.id },
      { teacherId: teacherSneha.id, classId: classBCA.id },
      { teacherId: teacherRahul.id, classId: classBBA.id },
      { teacherId: teacherAnjali.id, classId: classBBA.id },
      { teacherId: teacherSneha.id, classId: classBCom.id },
      { teacherId: teacherAnjali.id, classId: classBCom.id },
    ],
  });

  // 4. Subjects assigned to teachers
  // BCA Subjects (Linked to classBCA):
  // - Prof. Rajesh Sharma -> Advanced Mathematics, Computer Science
  const subBCA_Math = await prisma.subject.create({
    data: {
      name: 'Advanced Mathematics',
      code: 'BCA-301',
      classId: classBCA.id,
      teacherId: teacherRajesh.id,
    },
  });

  const subBCA_CS = await prisma.subject.create({
    data: {
      name: 'Computer Science',
      code: 'BCA-305',
      classId: classBCA.id,
      teacherId: teacherRajesh.id,
    },
  });

  // Co-assign Computer Science to Prof. Priya Nair as well
  await prisma.teacherSubjectAssignment.create({
    data: {
      teacherId: teacherPriya.id,
      subjectId: subBCA_CS.id,
    },
  });

  // - Prof. Priya Nair -> Java Programming, Cloud Computing
  const subBCA_Java = await prisma.subject.create({
    data: {
      name: 'Java Programming',
      code: 'BCA-303',
      classId: classBCA.id,
      teacherId: teacherPriya.id,
    },
  });

  const subBCA_Cloud = await prisma.subject.create({
    data: {
      name: 'Cloud Computing',
      code: 'BCA-306',
      classId: classBCA.id,
      teacherId: teacherPriya.id,
    },
  });

  // - Prof. Rahul Kumar -> Database Management (BCA)
  const subBCA_DB = await prisma.subject.create({
    data: {
      name: 'Database Management',
      code: 'BCA-302',
      classId: classBCA.id,
      teacherId: teacherRahul.id,
    },
  });

  // - Prof. Sneha Patil -> Web Development (BCA)
  const subBCA_Web = await prisma.subject.create({
    data: {
      name: 'Web Development',
      code: 'BCA-304',
      classId: classBCA.id,
      teacherId: teacherSneha.id,
    },
  });

  // BBA Subjects (Linked to classBBA, assigned to Prof. Rahul Kumar & Prof. Anjali Mehta):
  const subBBA_PM = await prisma.subject.create({
    data: {
      name: 'Principles of Management',
      code: 'BBA-PM',
      classId: classBBA.id,
      teacherId: teacherRahul.id,
    },
  });

  const subBBA_FM = await prisma.subject.create({
    data: {
      name: 'Financial Management',
      code: 'BBA-FM',
      classId: classBBA.id,
      teacherId: teacherRahul.id,
    },
  });

  const subBBA_BC = await prisma.subject.create({
    data: {
      name: 'Business Communication',
      code: 'BBA-BC',
      classId: classBBA.id,
      teacherId: teacherRahul.id,
    },
  });

  const subBBA_BO = await prisma.subject.create({
    data: {
      name: 'Business Organization',
      code: 'BBA-BO',
      classId: classBBA.id,
      teacherId: teacherAnjali.id,
    },
  });

  const subBBA_MM = await prisma.subject.create({
    data: {
      name: 'Marketing Management',
      code: 'BBA-MM',
      classId: classBBA.id,
      teacherId: teacherAnjali.id,
    },
  });

  // B.Com Subjects (Linked to classBCom, assigned to Prof. Sneha Patil & Prof. Anjali Mehta):
  const subBCom_FA = await prisma.subject.create({
    data: {
      name: 'Financial Accounting',
      code: 'BCOM-FA',
      classId: classBCom.id,
      teacherId: teacherSneha.id,
    },
  });

  const subBCom_CA = await prisma.subject.create({
    data: {
      name: 'Corporate Accounting',
      code: 'BCOM-CA',
      classId: classBCom.id,
      teacherId: teacherSneha.id,
    },
  });

  const subBCom_BL = await prisma.subject.create({
    data: {
      name: 'Business Law',
      code: 'BCOM-BL',
      classId: classBCom.id,
      teacherId: teacherSneha.id,
    },
  });

  const subBCom_CST = await prisma.subject.create({
    data: {
      name: 'Cost Accounting',
      code: 'BCOM-CST',
      classId: classBCom.id,
      teacherId: teacherAnjali.id,
    },
  });

  const subBCom_BE = await prisma.subject.create({
    data: {
      name: 'Business Economics',
      code: 'BCOM-BE',
      classId: classBCom.id,
      teacherId: teacherAnjali.id,
    },
  });

  // 5. Students
  // Enrolled in BCA 3rd Semester: Aarav Sharma (demo topper), Ananya Iyer, Rohan Verma, Diya Patel, Arjun Reddy, Kavya Nair
  const studentsBCA = [
    {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@student.edumanage.edu.in',
      roll: 'STU-2026-001',
      gender: 'Male',
      dob: '2005-04-12',
      phone: '+91 98201 12345',
      parentName: 'Vikram Sharma',
      parentPhone: '+91 98201 54321',
      address: 'Flat 402, Shanti Niketan, Bandra West, Mumbai',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Ananya Iyer',
      email: 'ananya.iyer@student.edumanage.edu.in',
      roll: 'STU-2026-002',
      gender: 'Female',
      dob: '2005-08-23',
      phone: '+91 98450 67890',
      parentName: 'Suresh Iyer',
      parentPhone: '+91 98450 98765',
      address: '14, Indiranagar 100ft Road, Bengaluru',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Rohan Verma',
      email: 'rohan.verma@student.edumanage.edu.in',
      roll: 'STU-2026-003',
      gender: 'Male',
      dob: '2005-02-15',
      phone: '+91 98101 23456',
      parentName: 'Alok Verma',
      parentPhone: '+91 98101 65432',
      address: 'B-45, Greater Kailash Part 1, New Delhi',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Diya Patel',
      email: 'diya.patel@student.edumanage.edu.in',
      roll: 'STU-2026-004',
      gender: 'Female',
      dob: '2005-11-05',
      phone: '+91 98250 34567',
      parentName: 'Mahesh Patel',
      parentPhone: '+91 98250 76543',
      address: '7, Satellite Road, Ahmedabad, Gujarat',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Arjun Reddy',
      email: 'arjun.reddy@student.edumanage.edu.in',
      roll: 'STU-2026-005',
      gender: 'Male',
      dob: '2005-06-30',
      phone: '+91 98490 45678',
      parentName: 'Venkat Reddy',
      parentPhone: '+91 98490 87654',
      address: 'Road No 36, Jubilee Hills, Hyderabad',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Kavya Nair',
      email: 'kavya.nair@student.edumanage.edu.in',
      roll: 'STU-2026-006',
      gender: 'Female',
      dob: '2005-09-18',
      phone: '+91 98470 56789',
      parentName: 'Gopinath Nair',
      parentPhone: '+91 98470 98765',
      address: 'Green Meadows, Panampilly Nagar, Kochi, Kerala',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    },
  ];

  const createdBCAStudents: { user: any; profile: any }[] = [];
  for (const s of studentsBCA) {
    const user = await prisma.user.create({
      data: {
        name: s.name,
        email: s.email,
        role: 'STUDENT',
        avatar: s.avatar,
      },
    });
    const profile = await prisma.studentProfile.create({
      data: {
        userId: user.id,
        rollNumber: s.roll,
        classId: classBCA.id,
        gender: s.gender,
        dob: s.dob,
        phone: s.phone,
        parentName: s.parentName,
        parentPhone: s.parentPhone,
        address: s.address,
      },
    });
    createdBCAStudents.push({ user, profile });
  }

  // Students for BBA Program
  const studentsBBA = [
    {
      name: 'Aditya Rao',
      email: 'aditya.rao@student.edumanage.edu.in',
      roll: 'STU-2026-007',
      gender: 'Male',
      dob: '2005-03-14',
      phone: '+91 98221 44556',
      parentName: 'Sudhir Rao',
      parentPhone: '+91 98221 99887',
      address: '22, FC Road, Shivajinagar, Pune',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Meera Joshi',
      email: 'meera.joshi@student.edumanage.edu.in',
      roll: 'STU-2026-008',
      gender: 'Female',
      dob: '2005-07-21',
      phone: '+91 98301 77665',
      parentName: 'Subir Joshi',
      parentPhone: '+91 98301 33221',
      address: 'Flat 3B, Lake Gardens, Kolkata',
      avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Karan Shah',
      email: 'karan.shah@student.edumanage.edu.in',
      roll: 'STU-2026-009',
      gender: 'Male',
      dob: '2005-01-19',
      phone: '+91 98190 33445',
      parentName: 'Mahesh Shah',
      parentPhone: '+91 98190 77889',
      address: '401, Vile Parle West, Mumbai',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Neha Kapoor',
      email: 'neha.kapoor@student.edumanage.edu.in',
      roll: 'STU-2026-010',
      gender: 'Female',
      dob: '2005-11-08',
      phone: '+91 98711 55667',
      parentName: 'Rajiv Kapoor',
      parentPhone: '+91 98711 11223',
      address: 'C-Block, Greater Kailash, New Delhi',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    },
  ];

  const createdBBAStudents: { user: any; profile: any }[] = [];
  for (const s of studentsBBA) {
    const user = await prisma.user.create({
      data: { name: s.name, email: s.email, role: 'STUDENT', avatar: s.avatar },
    });
    const profile = await prisma.studentProfile.create({
      data: {
        userId: user.id,
        rollNumber: s.roll,
        classId: classBBA.id,
        gender: s.gender,
        dob: s.dob,
        phone: s.phone,
        parentName: s.parentName,
        parentPhone: s.parentPhone,
        address: s.address,
      },
    });
    createdBBAStudents.push({ user, profile });
  }

  // Students for B.Com Program
  const studentsBCom = [
    {
      name: 'Rahul Mehta',
      email: 'rahul.mehta@student.edumanage.edu.in',
      roll: 'STU-2026-011',
      gender: 'Male',
      dob: '2005-06-11',
      phone: '+91 98200 44551',
      parentName: 'Ramesh Mehta',
      parentPhone: '+91 98200 88992',
      address: '15, Marine Drive, Mumbai',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Sneha Rao',
      email: 'sneha.rao@student.edumanage.edu.in',
      roll: 'STU-2026-012',
      gender: 'Female',
      dob: '2005-05-16',
      phone: '+91 98451 88772',
      parentName: 'Col. K.S. Rao',
      parentPhone: '+91 98451 44332',
      address: 'Brigade Millennium, JP Nagar, Bengaluru',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Varun Gupta',
      email: 'varun.gupta@student.edumanage.edu.in',
      roll: 'STU-2026-013',
      gender: 'Male',
      dob: '2005-08-25',
      phone: '+91 98102 33441',
      parentName: 'Sanjay Gupta',
      parentPhone: '+91 98102 77665',
      address: 'Sector 15, Noida, UP',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Pooja Nair',
      email: 'pooja.nair@student.edumanage.edu.in',
      roll: 'STU-2026-014',
      gender: 'Female',
      dob: '2005-10-30',
      phone: '+91 98471 22334',
      parentName: 'Madhavan Nair',
      parentPhone: '+91 98471 55667',
      address: 'Kaloor, Ernakulam, Kerala',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    },
  ];

  const createdBComStudents: { user: any; profile: any }[] = [];
  for (const s of studentsBCom) {
    const user = await prisma.user.create({
      data: { name: s.name, email: s.email, role: 'STUDENT', avatar: s.avatar },
    });
    const profile = await prisma.studentProfile.create({
      data: {
        userId: user.id,
        rollNumber: s.roll,
        classId: classBCom.id,
        gender: s.gender,
        dob: s.dob,
        phone: s.phone,
        parentName: s.parentName,
        parentPhone: s.parentPhone,
        address: s.address,
      },
    });
    createdBComStudents.push({ user, profile });
  }

  // 6. Seed Realistic Subject-Wise Attendance
  // Target for Aarav Sharma:
  // - Mathematics: 17 Present out of 20 = 85%
  // - Database Management: 18 Present out of 20 = 90%
  // - Java: 15 Present out of 19 = 78% (or 14/18 = 78%)
  // - Web Development: 23 Present out of 25 = 92%
  // - Computer Science: 17 Present out of 20 = 85%
  // - Cloud: 18 Present out of 20 = 90%

  const dates25 = [
    '2026-08-03', '2026-08-04', '2026-08-05', '2026-08-06', '2026-08-07',
    '2026-08-10', '2026-08-11', '2026-08-12', '2026-08-13', '2026-08-14',
    '2026-08-17', '2026-08-18', '2026-08-19', '2026-08-20', '2026-08-21',
    '2026-08-24', '2026-08-25', '2026-08-26', '2026-08-27', '2026-08-28',
    '2026-08-31', '2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04',
  ];

  // Helper to generate subject attendance
  async function seedSubjectAttendance(
    subject: any,
    teacher: any,
    datesList: string[],
    targetPresentsForAarav: number
  ) {
    const totalSessions = datesList.length;
    const aaravAbsentIndices = new Set<number>();
    const totalAbsents = totalSessions - targetPresentsForAarav;
    for (let k = 0; k < totalAbsents; k++) {
      aaravAbsentIndices.add((k * 5 + 3) % totalSessions);
    }

    for (let dIdx = 0; dIdx < datesList.length; dIdx++) {
      const date = datesList[dIdx];
      for (let sIdx = 0; sIdx < createdBCAStudents.length; sIdx++) {
        const student = createdBCAStudents[sIdx];
        let isPresent = true;
        let remarks = 'Present on time';

        if (sIdx === 0) {
          // Aarav Sharma
          if (aaravAbsentIndices.has(dIdx)) {
            isPresent = false;
            remarks = 'Excused absence / Medical';
          }
        } else {
          // Other students have varied realistic attendance
          if ((dIdx + sIdx * 3) % 7 === 0) {
            isPresent = false;
            remarks = 'Absent without leave';
          }
        }

        await prisma.attendance.create({
          data: {
            studentId: student.profile.id,
            subjectId: subject.id,
            teacherId: teacher.id,
            classId: classBCA.id,
            date,
            status: isPresent ? 'PRESENT' : 'ABSENT',
            remarks,
          },
        });
      }
    }
  }

  console.log('Seeding Subject-Wise Attendance Records for BCA...');
  // 1. Mathematics: 20 sessions, Aarav: 17 Present (85%) - Teacher: Prof. Rajesh Sharma
  await seedSubjectAttendance(subBCA_Math, teacherRajesh, dates25.slice(0, 20), 17);

  // 2. Database Management: 20 sessions, Aarav: 18 Present (90%) - Teacher: Prof. Rahul Kumar
  await seedSubjectAttendance(subBCA_DB, teacherRahul, dates25.slice(0, 20), 18);

  // 3. Java: 18 sessions, Aarav: 14 Present (78%) - Teacher: Prof. Priya Nair
  await seedSubjectAttendance(subBCA_Java, teacherPriya, dates25.slice(0, 18), 14);

  // 4. Web Development: 25 sessions, Aarav: 23 Present (92%) - Teacher: Prof. Sneha Patil
  await seedSubjectAttendance(subBCA_Web, teacherSneha, dates25, 23);

  // 5. Computer Science: 20 sessions, Aarav: 17 Present (85%) - Teacher: Prof. Rajesh Sharma
  await seedSubjectAttendance(subBCA_CS, teacherRajesh, dates25.slice(0, 20), 17);

  // 6. Cloud Computing: 20 sessions, Aarav: 18 Present (90%) - Teacher: Prof. Priya Nair
  await seedSubjectAttendance(subBCA_Cloud, teacherPriya, dates25.slice(0, 20), 18);

  // BBA Attendance (2 teachers: Prof. Rahul Kumar & Prof. Anjali Mehta)
  console.log('Seeding Subject-Wise Attendance Records for BBA...');
  for (const st of createdBBAStudents) {
    for (let dIdx = 0; dIdx < 15; dIdx++) {
      const date = dates25[dIdx];
      await prisma.attendance.create({
        data: {
          studentId: st.profile.id,
          subjectId: subBBA_PM.id,
          teacherId: teacherRahul.id,
          classId: classBBA.id,
          date,
          status: dIdx % 5 === 0 ? 'ABSENT' : 'PRESENT',
          remarks: dIdx % 5 === 0 ? 'Absent' : 'Present on time',
        },
      });
      await prisma.attendance.create({
        data: {
          studentId: st.profile.id,
          subjectId: subBBA_BO.id,
          teacherId: teacherAnjali.id,
          classId: classBBA.id,
          date,
          status: dIdx % 6 === 0 ? 'ABSENT' : 'PRESENT',
          remarks: dIdx % 6 === 0 ? 'Absent' : 'Present on time',
        },
      });
    }
  }

  // B.Com Attendance (2 teachers: Prof. Sneha Patil & Prof. Anjali Mehta)
  console.log('Seeding Subject-Wise Attendance Records for B.Com...');
  for (const st of createdBComStudents) {
    for (let dIdx = 0; dIdx < 15; dIdx++) {
      const date = dates25[dIdx];
      await prisma.attendance.create({
        data: {
          studentId: st.profile.id,
          subjectId: subBCom_FA.id,
          teacherId: teacherSneha.id,
          classId: classBCom.id,
          date,
          status: dIdx % 5 === 0 ? 'ABSENT' : 'PRESENT',
          remarks: dIdx % 5 === 0 ? 'Absent' : 'Present on time',
        },
      });
      await prisma.attendance.create({
        data: {
          studentId: st.profile.id,
          subjectId: subBCom_CST.id,
          teacherId: teacherAnjali.id,
          classId: classBCom.id,
          date,
          status: dIdx % 6 === 0 ? 'ABSENT' : 'PRESENT',
          remarks: dIdx % 6 === 0 ? 'Absent' : 'Present on time',
        },
      });
    }
  }

  // 7. Seed Mid-Term Exam & Marks
  console.log('Seeding Examination & Marks...');
  const examBCA = await prisma.exam.create({
    data: {
      name: 'Mid-Term Assessment 2026',
      term: 'Academic Year 2026',
      classId: classBCA.id,
      startDate: '2026-08-10',
      endDate: '2026-08-18',
    },
  });

  const bcaSubjects = [subBCA_Math, subBCA_CS, subBCA_Java, subBCA_DB, subBCA_Web, subBCA_Cloud];
  const marksPerStudent: Record<string, number[]> = {
    'STU-2026-001': [95, 92, 88, 94, 96, 91], // Aarav Sharma (Top grade)
    'STU-2026-002': [92, 94, 95, 89, 93, 90], // Ananya Iyer
    'STU-2026-003': [78, 82, 75, 84, 88, 80], // Rohan Verma
    'STU-2026-004': [88, 85, 90, 94, 91, 87], // Diya Patel
    'STU-2026-005': [68, 72, 70, 74, 80, 75], // Arjun Reddy
    'STU-2026-006': [84, 86, 82, 88, 85, 89], // Kavya Nair
  };

  const getGrade = (marks: number) => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B';
    if (marks >= 60) return 'C';
    if (marks >= 50) return 'D';
    return 'F';
  };

  for (const st of createdBCAStudents) {
    const scores = marksPerStudent[st.profile.rollNumber] || [85, 85, 85, 85, 85, 85];
    for (let j = 0; j < bcaSubjects.length; j++) {
      const score = scores[j];
      await prisma.mark.create({
        data: {
          examId: examBCA.id,
          studentId: st.profile.id,
          subjectId: bcaSubjects[j].id,
          marksObtained: score,
          maxMarks: 100,
          grade: getGrade(score),
          remarks: score >= 90 ? 'Outstanding Academic Performance' : score >= 80 ? 'Very Good' : 'Satisfactory',
        },
      });
    }
  }

  // 8. Seed Assignments
  console.log('Seeding Course Assignments...');
  await prisma.assignment.create({
    data: {
      title: 'Linear Algebra & Matrix Transformations Problem Set',
      description: 'Solve problems 1 to 15 from Chapter 4 on Eigenvalues and Orthogonal Decomposition.',
      dueDate: '2026-09-20',
      subjectId: subBCA_Math.id,
      teacherId: teacherRajesh.id,
    },
  });

  await prisma.assignment.create({
    data: {
      title: 'Relational Database Normalization (3NF & BCNF Case Study)',
      description: 'Decompose the unnormalized schema for the Hospital Management System into BCNF.',
      dueDate: '2026-09-22',
      subjectId: subBCA_DB.id,
      teacherId: teacherRajesh.id,
    },
  });

  await prisma.assignment.create({
    data: {
      title: 'Multithreading & Collections Framework in Java',
      description: 'Implement a thread-safe producer-consumer queue using Java Concurrent Utilities.',
      dueDate: '2026-09-25',
      subjectId: subBCA_Java.id,
      teacherId: teacherPriya.id,
    },
  });

  await prisma.assignment.create({
    data: {
      title: 'Responsive Portfolio with Tailwind CSS & Next.js',
      description: 'Design and deploy a semantic, fully responsive multi-page web application.',
      dueDate: '2026-09-28',
      subjectId: subBCA_Web.id,
      teacherId: teacherPriya.id,
    },
  });

  // 9. Seed Announcements
  console.log('Seeding Department Announcements...');
  await prisma.announcement.create({
    data: {
      title: 'Mid-Term Assessment Grade Cards Published',
      content: 'Grade cards for BCA have been released and verified by the academic committee.',
      category: 'ACADEMIC',
      authorName: 'Prof. Rajesh Sharma',
      teacherId: teacherRajesh.id,
      classId: classBCA.id,
    },
  });

  await prisma.announcement.create({
    data: {
      title: 'ACM Student Chapter Technical Workshop on Cloud Native & Docker',
      content: 'Hands-on session scheduled for Saturday 10:00 AM at the Advanced Computing Laboratory.',
      category: 'GENERAL',
      authorName: 'Prof. Priya Nair',
      teacherId: teacherPriya.id,
      classId: classBCA.id,
    },
  });

  await prisma.announcement.create({
    data: {
      title: 'Strategic Management & Business Case Study Competition',
      content: 'BBA departmental case study registrations are now open for the National Inter-College Summit.',
      category: 'EXAM',
      authorName: 'Prof. Anjali Mehta',
      teacherId: teacherAnjali.id,
      classId: classBBA.id,
    },
  });

  // 10. Fee Invoices (for Aarav Sharma)
  await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'INV-2026-001',
      studentId: createdBCAStudents[0].profile.id,
      title: 'Annual Tuition & Academic Fee',
      amount: 45000.0,
      paidAmount: 45000.0,
      dueDate: '2026-08-15',
      status: 'PAID',
      paymentDate: '2026-08-12',
      paymentMethod: 'UPI (Google Pay)',
    },
  });

  await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'INV-2026-002',
      studentId: createdBCAStudents[0].profile.id,
      title: 'Advanced Computing & DBMS Laboratory Fee',
      amount: 8500.0,
      paidAmount: 8500.0,
      dueDate: '2026-08-20',
      status: 'PAID',
      paymentDate: '2026-08-19',
      paymentMethod: 'Net Banking (HDFC Bank)',
    },
  });

  console.log('✅ Database seeded successfully with multi-teacher college structure!');
  console.log('Programs: BCA, BBA, B.Com');
  console.log('Teachers (5 Demo Faculty Members):');
  console.log('1. Prof. Rajesh Sharma (EMP-MATH-101): BCA -> Advanced Mathematics, Computer Science');
  console.log('2. Prof. Priya Nair (EMP-CS-102): BCA -> Java Programming, Computer Science, Cloud Computing');
  console.log('3. Prof. Rahul Kumar (EMP-DB-103): BCA + BBA -> Database Management, Principles of Management, Financial Management, Business Communication');
  console.log('4. Prof. Sneha Patil (EMP-WEB-104): BCA + B.Com -> Web Development, Financial Accounting, Corporate Accounting, Business Law');
  console.log('5. Prof. Anjali Mehta (EMP-MGMT-105): BBA + B.Com -> Business Organization, Marketing Management, Business Economics, Cost Accounting');
  console.log('Demo Password for all teachers: teacher123');
  console.log('Demo Student: Aarav Sharma (STU-2026-001)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing records...');
  await prisma.mark.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.feeInvoice.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.teacherProfile.deleteMany();
  await prisma.class.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding Users and Profiles...');

  // 1. Admin User
  const adminUser = await prisma.user.create({
    data: {
      name: 'Dr. Sarah Jenkins',
      email: 'admin@edumanage.edu',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
  });

  // 2. Teacher Users
  const teacher1User = await prisma.user.create({
    data: {
      name: 'Prof. Robert Lang',
      email: 'teacher.math@edumanage.edu',
      role: 'TEACHER',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
  });

  const teacher2User = await prisma.user.create({
    data: {
      name: 'Dr. Elena Rostova',
      email: 'teacher.sci@edumanage.edu',
      role: 'TEACHER',
      avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
    },
  });

  const teacher3User = await prisma.user.create({
    data: {
      name: 'Ms. Clara Oswald',
      email: 'teacher.eng@edumanage.edu',
      role: 'TEACHER',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
  });

  const teacher1Profile = await prisma.teacherProfile.create({
    data: {
      userId: teacher1User.id,
      employeeId: 'EMP-MATH-101',
      department: 'Mathematics',
      designation: 'Department Head & Sr. Professor',
      phone: '+1 (555) 234-5671',
      qualification: 'Ph.D. in Applied Mathematics',
    },
  });

  const teacher2Profile = await prisma.teacherProfile.create({
    data: {
      userId: teacher2User.id,
      employeeId: 'EMP-SCI-102',
      department: 'Science & Physics',
      designation: 'Associate Professor',
      phone: '+1 (555) 345-6782',
      qualification: 'M.Sc. in Physics & Quantum Mechanics',
    },
  });

  const teacher3Profile = await prisma.teacherProfile.create({
    data: {
      userId: teacher3User.id,
      employeeId: 'EMP-HUM-103',
      department: 'Humanities & English',
      designation: 'Senior Lecturer',
      phone: '+1 (555) 456-7893',
      qualification: 'M.A. in English Literature',
    },
  });

  // 3. Classes
  const class10A = await prisma.class.create({
    data: {
      name: 'Grade 10 - Section A',
      grade: '10',
      section: 'A',
      room: 'Hall 101',
      teacherId: teacher1Profile.id,
    },
  });

  const class10B = await prisma.class.create({
    data: {
      name: 'Grade 10 - Section B',
      grade: '10',
      section: 'B',
      room: 'Hall 102',
      teacherId: teacher2Profile.id,
    },
  });

  const class12A = await prisma.class.create({
    data: {
      name: 'Grade 12 - Advanced STEM',
      grade: '12',
      section: 'A',
      room: 'Lab 205',
      teacherId: teacher3Profile.id,
    },
  });

  // 4. Subjects for Class 10A
  const subMath = await prisma.subject.create({
    data: {
      name: 'Advanced Mathematics',
      code: 'MATH-101',
      classId: class10A.id,
      teacherId: teacher1Profile.id,
    },
  });

  const subPhysics = await prisma.subject.create({
    data: {
      name: 'Physics & Mechanics',
      code: 'PHY-102',
      classId: class10A.id,
      teacherId: teacher2Profile.id,
    },
  });

  const subChemistry = await prisma.subject.create({
    data: {
      name: 'Inorganic Chemistry',
      code: 'CHEM-103',
      classId: class10A.id,
      teacherId: teacher2Profile.id,
    },
  });

  const subEnglish = await prisma.subject.create({
    data: {
      name: 'English & Composition',
      code: 'ENG-104',
      classId: class10A.id,
      teacherId: teacher3Profile.id,
    },
  });

  const subCS = await prisma.subject.create({
    data: {
      name: 'Computer Science & Python',
      code: 'CS-105',
      classId: class10A.id,
      teacherId: teacher1Profile.id,
    },
  });

  // 5. Students in Class 10A
  const studentData = [
    {
      name: 'Alex Morgan',
      email: 'alex.morgan@student.edumanage.edu',
      roll: 'STU-2026-001',
      gender: 'Male',
      dob: '2009-04-12',
      phone: '+1 (555) 789-0011',
      parentName: 'Thomas Morgan',
      parentPhone: '+1 (555) 998-1122',
      address: '742 Evergreen Terrace, Springfield',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Sophia Chen',
      email: 'sophia.chen@student.edumanage.edu',
      roll: 'STU-2026-002',
      gender: 'Female',
      dob: '2009-08-23',
      phone: '+1 (555) 789-0022',
      parentName: 'David Chen',
      parentPhone: '+1 (555) 998-2233',
      address: '124 Blossom Hill, Silicon Valley',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Marcus Rashford',
      email: 'marcus.r@student.edumanage.edu',
      roll: 'STU-2026-003',
      gender: 'Male',
      dob: '2009-02-15',
      phone: '+1 (555) 789-0033',
      parentName: 'Robert Rashford',
      parentPhone: '+1 (555) 998-3344',
      address: '10 Old Trafford Road, Manchester',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Emily Watson',
      email: 'emily.w@student.edumanage.edu',
      roll: 'STU-2026-004',
      gender: 'Female',
      dob: '2009-11-05',
      phone: '+1 (555) 789-0044',
      parentName: 'Sarah Watson',
      parentPhone: '+1 (555) 998-4455',
      address: '42 Baker Street, London',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'David Kim',
      email: 'david.kim@student.edumanage.edu',
      roll: 'STU-2026-005',
      gender: 'Male',
      dob: '2009-06-30',
      phone: '+1 (555) 789-0055',
      parentName: 'Joon Kim',
      parentPhone: '+1 (555) 998-5566',
      address: '88 Gangnam Blvd, Metro City',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Aaliyah Patel',
      email: 'aaliyah.p@student.edumanage.edu',
      roll: 'STU-2026-006',
      gender: 'Female',
      dob: '2009-09-18',
      phone: '+1 (555) 789-0066',
      parentName: 'Vikram Patel',
      parentPhone: '+1 (555) 998-6677',
      address: '500 Tech Park Way, Austin',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const createdStudents = [];
  for (const s of studentData) {
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
        classId: class10A.id,
        gender: s.gender,
        dob: s.dob,
        phone: s.phone,
        parentName: s.parentName,
        parentPhone: s.parentPhone,
        address: s.address,
      },
    });

    createdStudents.push({ user, profile });
  }

  // 6. Seed Attendance (Past 8 School Days)
  const schoolDates = [
    '2026-08-24',
    '2026-08-25',
    '2026-08-26',
    '2026-08-27',
    '2026-08-28',
    '2026-08-31',
    '2026-09-01',
    '2026-09-02',
    '2026-09-03',
    '2026-09-04',
  ];

  for (const date of schoolDates) {
    for (let i = 0; i < createdStudents.length; i++) {
      const student = createdStudents[i];
      let status = 'PRESENT';
      let remarks: string | null = 'On time';

      // Realistic variation
      if (i === 2 && date === '2026-08-27') {
        status = 'ABSENT';
        remarks = 'Medical leave';
      } else if (i === 4 && (date === '2026-08-28' || date === '2026-09-02')) {
        status = 'LATE';
        remarks = 'Bus delay';
      } else if (i === 5 && date === '2026-08-31') {
        status = 'ABSENT';
        remarks = 'Family emergency';
      }

      await prisma.attendance.create({
        data: {
          date,
          studentId: student.profile.id,
          classId: class10A.id,
          status,
          remarks,
        },
      });
    }
  }

  // 7. Seed Exams & Marks
  const midtermExam = await prisma.exam.create({
    data: {
      name: 'Mid-Term Examination 2026',
      term: 'Semester 1',
      classId: class10A.id,
      startDate: '2026-08-10',
      endDate: '2026-08-18',
    },
  });

  const subjects = [subMath, subPhysics, subChemistry, subEnglish, subCS];

  // Grade calculator helper
  const getGrade = (marks: number) => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B';
    if (marks >= 60) return 'C';
    if (marks >= 50) return 'D';
    return 'F';
  };

  const sampleMarksDistribution: Record<string, number[]> = {
    'STU-2026-001': [95, 91, 88, 92, 98], // Alex Morgan (Honor roll)
    'STU-2026-002': [98, 96, 94, 89, 95], // Sophia Chen
    'STU-2026-003': [78, 82, 75, 84, 88], // Marcus
    'STU-2026-004': [88, 85, 90, 94, 91], // Emily
    'STU-2026-005': [68, 72, 70, 74, 80], // David
    'STU-2026-006': [84, 86, 82, 88, 85], // Aaliyah
  };

  for (const st of createdStudents) {
    const marksArr = sampleMarksDistribution[st.profile.rollNumber] || [80, 80, 80, 80, 80];
    for (let j = 0; j < subjects.length; j++) {
      const score = marksArr[j];
      await prisma.mark.create({
        data: {
          examId: midtermExam.id,
          studentId: st.profile.id,
          subjectId: subjects[j].id,
          marksObtained: score,
          maxMarks: 100,
          grade: getGrade(score),
          remarks: score >= 90 ? 'Outstanding Performance' : score >= 80 ? 'Very Good' : 'Satisfactory',
        },
      });
    }
  }

  // 8. Seed Fee Invoices
  const alexProfile = createdStudents[0].profile;
  const sophiaProfile = createdStudents[1].profile;
  const marcusProfile = createdStudents[2].profile;
  const emilyProfile = createdStudents[3].profile;
  const davidProfile = createdStudents[4].profile;
  const aaliyahProfile = createdStudents[5].profile;

  // Alex invoices (Primary demo student)
  await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'INV-2026-001',
      studentId: alexProfile.id,
      title: 'Fall Semester 2026 Tuition Fee',
      amount: 1450.0,
      paidAmount: 1450.0,
      dueDate: '2026-08-15',
      status: 'PAID',
      paymentDate: '2026-08-12',
      paymentMethod: 'Debit Card (Stripe)',
    },
  });

  await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'INV-2026-002',
      studentId: alexProfile.id,
      title: 'Science Lab & Tech Facility Access',
      amount: 320.0,
      paidAmount: 320.0,
      dueDate: '2026-08-20',
      status: 'PAID',
      paymentDate: '2026-08-19',
      paymentMethod: 'Net Banking',
    },
  });

  await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'INV-2026-003',
      studentId: alexProfile.id,
      title: 'Annual Sports & Library Subscriptions',
      amount: 180.0,
      paidAmount: 0.0,
      dueDate: '2026-09-30',
      status: 'PENDING',
    },
  });

  // Sophia Chen
  await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'INV-2026-004',
      studentId: sophiaProfile.id,
      title: 'Fall Semester 2026 Tuition Fee',
      amount: 1450.0,
      paidAmount: 1450.0,
      dueDate: '2026-08-15',
      status: 'PAID',
      paymentDate: '2026-08-10',
      paymentMethod: 'Credit Card',
    },
  });

  // Marcus Rashford
  await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'INV-2026-005',
      studentId: marcusProfile.id,
      title: 'Fall Semester 2026 Tuition Fee',
      amount: 1450.0,
      paidAmount: 1000.0,
      dueDate: '2026-08-15',
      status: 'PARTIAL',
      paymentDate: '2026-08-14',
      paymentMethod: 'Cash Deposit',
    },
  });

  // David Kim
  await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'INV-2026-006',
      studentId: davidProfile.id,
      title: 'Fall Semester 2026 Tuition Fee',
      amount: 1450.0,
      paidAmount: 0.0,
      dueDate: '2026-08-15',
      status: 'OVERDUE',
    },
  });

  // Emily & Aaliyah
  await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'INV-2026-007',
      studentId: emilyProfile.id,
      title: 'Fall Semester 2026 Tuition Fee',
      amount: 1450.0,
      paidAmount: 1450.0,
      dueDate: '2026-08-15',
      status: 'PAID',
      paymentDate: '2026-08-14',
      paymentMethod: 'Bank Wire',
    },
  });

  await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'INV-2026-008',
      studentId: aaliyahProfile.id,
      title: 'Fall Semester 2026 Tuition Fee',
      amount: 1450.0,
      paidAmount: 0.0,
      dueDate: '2026-09-25',
      status: 'PENDING',
    },
  });

  console.log('Database seeded successfully!');
  console.log('Admin user:', adminUser.email);
  console.log('Teacher user:', teacher1User.email);
  console.log('Student user:', createdStudents[0].user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

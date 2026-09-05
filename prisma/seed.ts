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

  console.log('Seeding Users and Profiles with Indian names...');

  // 1. Admin User (Indian)
  const adminUser = await prisma.user.create({
    data: {
      name: 'Dr. Anandita Verma',
      email: 'admin@edumanage.edu.in',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
  });

  // 2. Teacher Users (Indian Faculty)
  const teacher1User = await prisma.user.create({
    data: {
      name: 'Prof. Rajesh Sharma',
      email: 'rajesh.sharma@edumanage.edu.in',
      role: 'TEACHER',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
  });

  const teacher2User = await prisma.user.create({
    data: {
      name: 'Dr. Sunita Rao',
      email: 'sunita.rao@edumanage.edu.in',
      role: 'TEACHER',
      avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80',
    },
  });

  const teacher3User = await prisma.user.create({
    data: {
      name: 'Ms. Priya Nair',
      email: 'priya.nair@edumanage.edu.in',
      role: 'TEACHER',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
  });

  const teacher1Profile = await prisma.teacherProfile.create({
    data: {
      userId: teacher1User.id,
      employeeId: 'EMP-MATH-101',
      department: 'Department of Mathematics',
      designation: 'Head of Department & Professor',
      phone: '+91 98450 23456',
      qualification: 'Ph.D. in Applied Mathematics (IIT Delhi)',
    },
  });

  const teacher2Profile = await prisma.teacherProfile.create({
    data: {
      userId: teacher2User.id,
      employeeId: 'EMP-SCI-102',
      department: 'Department of Physics & Chemistry',
      designation: 'Associate Professor',
      phone: '+91 98765 43210',
      qualification: 'M.Sc., Ph.D. in Physics (IISc Bangalore)',
    },
  });

  const teacher3Profile = await prisma.teacherProfile.create({
    data: {
      userId: teacher3User.id,
      employeeId: 'EMP-HUM-103',
      department: 'Department of English Literature',
      designation: 'Senior Assistant Professor',
      phone: '+91 98111 22334',
      qualification: 'M.A., M.Phil in English (Delhi University)',
    },
  });

  // 3. Classes
  const class10A = await prisma.class.create({
    data: {
      name: 'Class 10 - Section A',
      grade: '10',
      section: 'A',
      room: 'Hall 101',
      teacherId: teacher1Profile.id,
    },
  });

  const class10B = await prisma.class.create({
    data: {
      name: 'Class 10 - Section B',
      grade: '10',
      section: 'B',
      room: 'Hall 102',
      teacherId: teacher2Profile.id,
    },
  });

  const class12A = await prisma.class.create({
    data: {
      name: 'Class 12 - PCM & CS',
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

  // 5. Students in Class 10A (Indian Names)
  const studentData = [
    {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@student.edumanage.edu.in',
      roll: 'STU-2026-001',
      gender: 'Male',
      dob: '2009-04-12',
      phone: '+91 98201 12345',
      parentName: 'Vikram Sharma',
      parentPhone: '+91 98201 54321',
      address: 'Flat 402, Shanti Niketan, Bandra West, Mumbai',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Ananya Iyer',
      email: 'ananya.iyer@student.edumanage.edu.in',
      roll: 'STU-2026-002',
      gender: 'Female',
      dob: '2009-08-23',
      phone: '+91 98450 67890',
      parentName: 'Suresh Iyer',
      parentPhone: '+91 98450 98765',
      address: '14, Indiranagar 100ft Road, Bengaluru',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Rohan Verma',
      email: 'rohan.verma@student.edumanage.edu.in',
      roll: 'STU-2026-003',
      gender: 'Male',
      dob: '2009-02-15',
      phone: '+91 98101 23456',
      parentName: 'Alok Verma',
      parentPhone: '+91 98101 65432',
      address: 'B-45, Greater Kailash Part 1, New Delhi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Diya Patel',
      email: 'diya.patel@student.edumanage.edu.in',
      roll: 'STU-2026-004',
      gender: 'Female',
      dob: '2009-11-05',
      phone: '+91 98250 34567',
      parentName: 'Mahesh Patel',
      parentPhone: '+91 98250 76543',
      address: '7, Satellite Road, Ahmedabad, Gujarat',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Arjun Reddy',
      email: 'arjun.reddy@student.edumanage.edu.in',
      roll: 'STU-2026-005',
      gender: 'Male',
      dob: '2009-06-30',
      phone: '+91 98490 45678',
      parentName: 'Venkat Reddy',
      parentPhone: '+91 98490 87654',
      address: 'Road No 36, Jubilee Hills, Hyderabad',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Kavya Nair',
      email: 'kavya.nair@student.edumanage.edu.in',
      roll: 'STU-2026-006',
      gender: 'Female',
      dob: '2009-09-18',
      phone: '+91 98470 56789',
      parentName: 'Gopinath Nair',
      parentPhone: '+91 98470 98765',
      address: 'Green Meadows, Panampilly Nagar, Kochi, Kerala',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
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

  // 6. Seed Attendance (Past 10 School Days)
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
      let remarks: string | null = 'Present on time';

      if (i === 2 && date === '2026-08-27') {
        status = 'ABSENT';
        remarks = 'Medical leave';
      } else if (i === 4 && (date === '2026-08-28' || date === '2026-09-02')) {
        status = 'LATE';
        remarks = 'School bus delayed';
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

  const getGrade = (marks: number) => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B';
    if (marks >= 60) return 'C';
    if (marks >= 50) return 'D';
    return 'F';
  };

  const sampleMarksDistribution: Record<string, number[]> = {
    'STU-2026-001': [96, 92, 90, 94, 98], // Aarav Sharma (Topper / Merit)
    'STU-2026-002': [98, 95, 94, 91, 96], // Ananya Iyer
    'STU-2026-003': [78, 82, 75, 84, 88], // Rohan Verma
    'STU-2026-004': [88, 85, 90, 94, 91], // Diya Patel
    'STU-2026-005': [68, 72, 70, 74, 80], // Arjun Reddy
    'STU-2026-006': [84, 86, 82, 88, 85], // Kavya Nair
  };

  for (const st of createdStudents) {
    const marksArr = sampleMarksDistribution[st.profile.rollNumber] || [85, 85, 85, 85, 85];
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
          remarks: score >= 90 ? 'Outstanding Academic Performance' : score >= 80 ? 'Very Good' : 'Satisfactory',
        },
      });
    }
  }

  // 8. Seed Fee Invoices in Indian Rupees (₹)
  const aaravProfile = createdStudents[0].profile;
  const ananyaProfile = createdStudents[1].profile;
  const rohanProfile = createdStudents[2].profile;
  const diyaProfile = createdStudents[3].profile;
  const arjunProfile = createdStudents[4].profile;
  const kavyaProfile = createdStudents[5].profile;

  // Aarav Sharma Invoices (Demo Student)
  await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'INV-2026-001',
      studentId: aaravProfile.id,
      title: 'Fall Semester Tuition & Academic Fee',
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
      studentId: aaravProfile.id,
      title: 'Science & Computer Science Laboratory Fee',
      amount: 8500.0,
      paidAmount: 8500.0,
      dueDate: '2026-08-20',
      status: 'PAID',
      paymentDate: '2026-08-19',
      paymentMethod: 'Net Banking (HDFC Bank)',
    },
  });

  await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'INV-2026-003',
      studentId: aaravProfile.id,
      title: 'Annual Sports Complex & Library Fee',
      amount: 3500.0,
      paidAmount: 0.0,
      dueDate: '2026-09-30',
      status: 'PENDING',
    },
  });

  // Ananya Iyer
  await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'INV-2026-004',
      studentId: ananyaProfile.id,
      title: 'Fall Semester Tuition & Academic Fee',
      amount: 45000.0,
      paidAmount: 45000.0,
      dueDate: '2026-08-15',
      status: 'PAID',
      paymentDate: '2026-08-10',
      paymentMethod: 'UPI (PhonePe)',
    },
  });

  // Rohan Verma
  await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'INV-2026-005',
      studentId: rohanProfile.id,
      title: 'Fall Semester Tuition & Academic Fee',
      amount: 45000.0,
      paidAmount: 25000.0,
      dueDate: '2026-08-15',
      status: 'PARTIAL',
      paymentDate: '2026-08-14',
      paymentMethod: 'RuPay Card',
    },
  });

  // Arjun Reddy
  await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'INV-2026-006',
      studentId: arjunProfile.id,
      title: 'Fall Semester Tuition & Academic Fee',
      amount: 45000.0,
      paidAmount: 0.0,
      dueDate: '2026-08-15',
      status: 'OVERDUE',
    },
  });

  // Diya Patel
  await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'INV-2026-007',
      studentId: diyaProfile.id,
      title: 'Fall Semester Tuition & Academic Fee',
      amount: 45000.0,
      paidAmount: 45000.0,
      dueDate: '2026-08-15',
      status: 'PAID',
      paymentDate: '2026-08-14',
      paymentMethod: 'Net Banking (SBI)',
    },
  });

  // Kavya Nair
  await prisma.feeInvoice.create({
    data: {
      invoiceNumber: 'INV-2026-008',
      studentId: kavyaProfile.id,
      title: 'Fall Semester Tuition & Academic Fee',
      amount: 45000.0,
      paidAmount: 0.0,
      dueDate: '2026-09-25',
      status: 'PENDING',
    },
  });

  console.log('Database seeded with Indian names and INR amounts successfully!');
  console.log('Admin user:', adminUser.email, adminUser.name);
  console.log('Teacher user:', teacher1User.email, teacher1User.name);
  console.log('Student user:', createdStudents[0].user.email, createdStudents[0].user.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

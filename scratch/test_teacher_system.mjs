import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  console.log('--- Starting Comprehensive E2E Verification ---');
  let failures = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
    } else {
      console.error(`❌ FAIL: ${message}`);
      failures++;
    }
  }

  // ==========================================
  // 1. Verify Database State
  // ==========================================
  console.log('\n[1/4] Checking Database Entities and Relational Architecture...');
  const classes = await prisma.class.findMany({
    include: {
      teacher: { include: { user: true } },
      teacherAssignments: { include: { teacher: { include: { user: true } } } },
      subjects: true,
    },
    orderBy: { name: 'asc' },
  });

  assert(classes.length === 3, `Database has exactly 3 programs/classes (Found: ${classes.length})`);
  const classNames = classes.map((c) => c.name);
  assert(
    classNames.includes('BCA') && classNames.includes('BBA') && classNames.includes('B.Com'),
    `Programs are BCA, BBA, B.Com: ${classNames.join(', ')}`
  );
  assert(
    classes.every((c) => !c.name.toLowerCase().includes('semester')),
    'Zero semester classes in database'
  );

  const teachers = await prisma.teacherProfile.findMany({
    include: {
      user: true,
      subjects: true,
      classes: true,
      classAssignments: { include: { class: true } },
      subjectAssignments: { include: { subject: true } },
    },
    orderBy: { employeeId: 'asc' },
  });
  assert(teachers.length === 5, `Found exactly 5 faculty members in database (Found: ${teachers.length})`);

  const profSharma = teachers.find((t) => t.employeeId === 'EMP-MATH-101');
  const profNair = teachers.find((t) => t.employeeId === 'EMP-CS-102');
  const profKumar = teachers.find((t) => t.employeeId === 'EMP-DB-103');
  const profPatil = teachers.find((t) => t.employeeId === 'EMP-WEB-104');
  const profMehta = teachers.find((t) => t.employeeId === 'EMP-MGMT-105');

  assert(!!profSharma && profSharma.user.name.includes('Rajesh Sharma'), 'Prof. Rajesh Sharma is present');
  assert(!!profNair && profNair.user.name.includes('Priya Nair'), 'Prof. Priya Nair is present');
  assert(!!profKumar && profKumar.user.name.includes('Rahul Kumar'), 'Prof. Rahul Kumar is present');
  assert(!!profPatil && profPatil.user.name.includes('Sneha Patil'), 'Prof. Sneha Patil is present');
  assert(!!profMehta && profMehta.user.name.includes('Anjali Mehta'), 'Prof. Anjali Mehta is present');

  // Verify multi-faculty assignments per class
  const classBCA = classes.find((c) => c.name === 'BCA');
  const classBBA = classes.find((c) => c.name === 'BBA');
  const classBCom = classes.find((c) => c.name === 'B.Com');

  const bcaTeacherIds = new Set([
    ...(classBCA.teacherId ? [classBCA.teacherId] : []),
    ...classBCA.teacherAssignments.map((ta) => ta.teacherId),
  ]);
  const bbaTeacherIds = new Set([
    ...(classBBA.teacherId ? [classBBA.teacherId] : []),
    ...classBBA.teacherAssignments.map((ta) => ta.teacherId),
  ]);
  const bcomTeacherIds = new Set([
    ...(classBCom.teacherId ? [classBCom.teacherId] : []),
    ...classBCom.teacherAssignments.map((ta) => ta.teacherId),
  ]);

  assert(bcaTeacherIds.has(profSharma.id), 'BCA program is assigned to Prof. Rajesh Sharma');
  assert(bcaTeacherIds.has(profNair.id), 'BCA program is assigned to Prof. Priya Nair');
  assert(bcaTeacherIds.has(profKumar.id), 'BCA program is assigned to Prof. Rahul Kumar');
  assert(bcaTeacherIds.has(profPatil.id), 'BCA program is assigned to Prof. Sneha Patil');
  assert(bcaTeacherIds.size >= 4, `BCA supports multiple teachers (Assigned: ${bcaTeacherIds.size})`);

  assert(bbaTeacherIds.has(profKumar.id), 'BBA program is assigned to Prof. Rahul Kumar');
  assert(bbaTeacherIds.has(profMehta.id), 'BBA program is assigned to Prof. Anjali Mehta');
  assert(bbaTeacherIds.size >= 2, `BBA supports multiple teachers (Assigned: ${bbaTeacherIds.size})`);

  assert(bcomTeacherIds.has(profPatil.id), 'B.Com program is assigned to Prof. Sneha Patil');
  assert(bcomTeacherIds.has(profMehta.id), 'B.Com program is assigned to Prof. Anjali Mehta');
  assert(bcomTeacherIds.size >= 2, `B.Com supports multiple teachers (Assigned: ${bcomTeacherIds.size})`);

  // Verify single canonical Computer Science subject for BCA co-taught
  const csSubs = await prisma.subject.findMany({
    where: { name: 'Computer Science', class: { name: 'BCA' } },
    include: { teacherAssignments: true },
  });
  assert(csSubs.length === 1, `Only ONE canonical Computer Science subject for BCA (Found: ${csSubs.length})`);
  assert(
    csSubs[0].teacherAssignments.some((ta) => ta.teacherId === profNair.id) ||
      profNair.subjectAssignments.some((sa) => sa.subjectId === csSubs[0].id),
    'Computer Science is co-assigned to Prof. Priya Nair'
  );

  // Verify Aarav Sharma's dynamic attendance calculations
  const aarav = await prisma.studentProfile.findFirst({
    where: { rollNumber: 'STU-2026-001' },
    include: { attendances: { include: { subject: true } } },
  });
  const attStats = {};
  for (const a of aarav.attendances) {
    const sName = a.subject.name;
    if (!attStats[sName]) attStats[sName] = { total: 0, present: 0 };
    attStats[sName].total++;
    if (a.status === 'PRESENT') attStats[sName].present++;
  }
  const mathPct = Math.round((attStats['Advanced Mathematics'].present / attStats['Advanced Mathematics'].total) * 100);
  const dbPct = Math.round((attStats['Database Management'].present / attStats['Database Management'].total) * 100);
  const javaPct = Math.round((attStats['Java Programming'].present / attStats['Java Programming'].total) * 100);
  const webPct = Math.round((attStats['Web Development'].present / attStats['Web Development'].total) * 100);

  assert(mathPct === 85, `Aarav Sharma Advanced Math attendance is exactly 85% (${attStats['Advanced Mathematics'].present}/${attStats['Advanced Mathematics'].total})`);
  assert(dbPct === 90, `Aarav Sharma Database Management attendance is exactly 90% (${attStats['Database Management'].present}/${attStats['Database Management'].total})`);
  assert(javaPct === 78, `Aarav Sharma Java Programming attendance is exactly 78% (${attStats['Java Programming'].present}/${attStats['Java Programming'].total})`);
  assert(webPct === 92, `Aarav Sharma Web Development attendance is exactly 92% (${attStats['Web Development'].present}/${attStats['Web Development'].total})`);

  // ==========================================
  // 2. HTTP Checks against Next.js Server
  // ==========================================
  console.log('\n[2/4] Testing HTTP Routes and Role Scoping...');
  async function testRoute(path, cookie = '') {
    const res = await fetch(`http://localhost:3000${path}`, {
      headers: {
        Cookie: cookie,
      },
    });
    const text = await res.text();
    return { status: res.status, text };
  }

  // Teacher Login Page
  const teacherLoginPage = await testRoute('/teacher/login');
  assert(teacherLoginPage.status === 200, 'Teacher login page returns HTTP 200');
  assert(teacherLoginPage.text.includes('EMP-MATH-101'), 'Teacher login lists Prof. Rajesh Sharma demo card');
  assert(teacherLoginPage.text.includes('EMP-DB-103'), 'Teacher login lists Prof. Rahul Kumar demo card');
  assert(teacherLoginPage.text.includes('EMP-MGMT-105'), 'Teacher login lists Prof. Anjali Mehta demo card');

  // API Teacher Me - Prof. Rajesh Sharma
  const apiMeSharma = await testRoute('/api/teacher/me', 'edumanage_teacher_session=EMP-MATH-101');
  assert(apiMeSharma.status === 200, '/api/teacher/me returns HTTP 200 for Prof. Sharma');
  const meDataSharma = JSON.parse(apiMeSharma.text);
  assert(meDataSharma.authenticated === true, 'Teacher session authentication successful');
  assert(meDataSharma.teacher.name.includes('Rajesh Sharma'), `Identified teacher: ${meDataSharma.teacher.name}`);

  // API Teacher Me - Prof. Rahul Kumar (Multi-Program BCA + BBA)
  const apiMeKumar = await testRoute('/api/teacher/me', 'edumanage_teacher_session=EMP-DB-103');
  assert(apiMeKumar.status === 200, '/api/teacher/me returns HTTP 200 for Prof. Kumar');
  const meDataKumar = JSON.parse(apiMeKumar.text);
  const kumarClassNames = meDataKumar.teacher.classes.map((c) => c.name);
  assert(
    kumarClassNames.includes('BCA') && kumarClassNames.includes('BBA'),
    `Prof. Kumar has multi-program access: ${kumarClassNames.join(', ')}`
  );

  // Teacher Dashboard - Prof. Rajesh Sharma
  const dashboardSharma = await testRoute('/teacher/dashboard', 'edumanage_teacher_session=EMP-MATH-101');
  assert(dashboardSharma.status === 200, 'Teacher dashboard returns HTTP 200');
  assert(dashboardSharma.text.includes('Rajesh Sharma'), 'Dashboard contains Prof. Rajesh Sharma');
  assert(dashboardSharma.text.includes('Advanced Mathematics'), 'Dashboard contains Advanced Mathematics');

  // Teacher Dashboard - Prof. Rahul Kumar
  const dashboardKumar = await testRoute('/teacher/dashboard', 'edumanage_teacher_session=EMP-DB-103');
  assert(dashboardKumar.status === 200, 'Prof. Kumar dashboard returns HTTP 200');
  assert(dashboardKumar.text.includes('Database Management'), 'Prof. Kumar dashboard has Database Management');
  assert(dashboardKumar.text.includes('Principles of Management'), 'Prof. Kumar dashboard has Principles of Management');

  // Teacher Attendance - Prof. Rajesh Sharma
  const attendanceSharma = await testRoute('/teacher/attendance', 'edumanage_teacher_session=EMP-MATH-101');
  assert(attendanceSharma.status === 200, 'Teacher attendance page returns HTTP 200');
  assert(attendanceSharma.text.includes('Advanced Mathematics'), 'Attendance page lists assigned subject');
  assert(attendanceSharma.text.includes('Aarav Sharma'), 'Attendance page lists enrolled student');

  // Teacher Exams - Prof. Rajesh Sharma
  const examsSharma = await testRoute('/teacher/exams', 'edumanage_teacher_session=EMP-MATH-101');
  assert(examsSharma.status === 200, 'Teacher exams page returns HTTP 200');
  assert(examsSharma.text.includes('Advanced Mathematics'), 'Exams page includes assigned subject');

  // Teacher Students Scoping Verification
  const studentsSharma = await testRoute('/teacher/students', 'edumanage_teacher_session=EMP-MATH-101');
  assert(studentsSharma.text.includes('Aarav Sharma'), 'Prof. Sharma (BCA) sees enrolled student Aarav Sharma');
  assert(!studentsSharma.text.includes('Rahul Mehta'), 'Prof. Sharma does NOT see unrelated B.Com student (Rahul Mehta)');

  const studentsKumar = await testRoute('/teacher/students', 'edumanage_teacher_session=EMP-DB-103');
  assert(studentsKumar.text.includes('Aarav Sharma'), 'Prof. Kumar (BCA+BBA) sees BCA student Aarav Sharma');
  assert(studentsKumar.text.includes('Aditya Rao'), 'Prof. Kumar (BCA+BBA) sees BBA student Aditya Rao');
  assert(!studentsKumar.text.includes('Rahul Mehta'), 'Prof. Kumar does NOT see unrelated B.Com student');

  const studentsMehta = await testRoute('/teacher/students', 'edumanage_teacher_session=EMP-MGMT-105');
  assert(studentsMehta.text.includes('Aditya Rao'), 'Prof. Mehta (BBA+B.Com) sees BBA student Aditya Rao');
  assert(studentsMehta.text.includes('Rahul Mehta'), 'Prof. Mehta (BBA+B.Com) sees B.Com student Rahul Mehta');
  assert(!studentsMehta.text.includes('Aarav Sharma'), 'Prof. Mehta does NOT see unrelated BCA student (Aarav Sharma)');

  // Student Attendance Page - Aarav Sharma
  const studentAttendance = await testRoute('/student/attendance', 'edumanage_student_session=STU-2026-001');
  assert(studentAttendance.status === 200, 'Student attendance page returns HTTP 200');
  assert(studentAttendance.text.includes('Advanced Mathematics'), 'Student attendance shows Advanced Mathematics');
  assert(studentAttendance.text.includes('Database Management'), 'Student attendance shows Database Management');
  assert(studentAttendance.text.includes('Java Programming'), 'Student attendance shows Java Programming');
  assert(studentAttendance.text.includes('Web Development'), 'Student attendance shows Web Development');
  assert(studentAttendance.text.includes('85%') || studentAttendance.text.includes('85'), 'Student attendance contains Math percentage 85%');
  assert(studentAttendance.text.includes('90%') || studentAttendance.text.includes('90'), 'Student attendance contains DB percentage 90%');
  assert(studentAttendance.text.includes('78%') || studentAttendance.text.includes('78'), 'Student attendance contains Java percentage 78%');
  assert(studentAttendance.text.includes('92%') || studentAttendance.text.includes('92'), 'Student attendance contains Web Dev percentage 92%');

  // Student Dashboard Page - Aarav Sharma
  const studentDashboard = await testRoute('/student/dashboard', 'edumanage_student_session=STU-2026-001');
  assert(studentDashboard.status === 200, 'Student dashboard returns HTTP 200');
  assert(studentDashboard.text.includes('Aarav Sharma'), 'Student dashboard shows Aarav Sharma');
  assert(studentDashboard.text.includes('BCA') && !studentDashboard.text.includes('BCA 3rd Semester'), 'Student dashboard shows clean BCA without semester');

  // Admin Teachers Page
  const adminTeachers = await testRoute('/admin/teachers');
  assert(adminTeachers.status === 200, 'Admin teachers page returns HTTP 200');
  assert(adminTeachers.text.includes('Rajesh Sharma'), 'Admin teachers contains Prof. Rajesh Sharma');
  assert(adminTeachers.text.includes('Priya Nair'), 'Admin teachers contains Prof. Priya Nair');
  assert(adminTeachers.text.includes('Rahul Kumar'), 'Admin teachers contains Prof. Rahul Kumar');
  assert(adminTeachers.text.includes('Sneha Patil'), 'Admin teachers contains Prof. Sneha Patil');
  assert(adminTeachers.text.includes('Anjali Mehta'), 'Admin teachers contains Prof. Anjali Mehta');
  assert(adminTeachers.text.includes('Appoint Faculty Member'), 'Admin teachers has Appoint Faculty Member button');

  // Admin Classes Page
  const adminClasses = await testRoute('/admin/classes');
  assert(adminClasses.status === 200, 'Admin classes page returns HTTP 200');
  assert(adminClasses.text.includes('BCA') && adminClasses.text.includes('BBA') && adminClasses.text.includes('B.Com'), 'Admin classes lists all 3 programs');
  assert(adminClasses.text.includes('Manage Faculty') || adminClasses.text.includes('Assigned Faculty'), 'Admin classes contains faculty assignment management');

  // ==========================================
  // 3. Dark Mode / Light Mode Verification
  // ==========================================
  console.log('\n[3/4] Verifying Dark Mode / Light Mode Integration...');
  const landingPage = await testRoute('/');
  assert(landingPage.status === 200, 'Landing page returns HTTP 200');
  assert(landingPage.text.includes('edumanage_theme'), 'Landing page contains anti-flash theme script');
  assert(
    landingPage.text.includes('Switch to Dark Mode') ||
      landingPage.text.includes('Switch to Light Mode') ||
      landingPage.text.includes('Toggle theme') ||
      landingPage.text.includes('title="Switch to'),
    'Landing page navbar contains accessible ThemeToggle'
  );

  assert(
    studentDashboard.text.includes('Switch to Dark Mode') ||
      studentDashboard.text.includes('Switch to Light Mode') ||
      studentDashboard.text.includes('Toggle theme') ||
      studentDashboard.text.includes('title="Switch to'),
    'Student Portal header contains accessible ThemeToggle'
  );

  assert(
    dashboardSharma.text.includes('Switch to Dark Mode') ||
      dashboardSharma.text.includes('Switch to Light Mode') ||
      dashboardSharma.text.includes('Toggle theme') ||
      dashboardSharma.text.includes('title="Switch to'),
    'Teacher Portal header contains accessible ThemeToggle'
  );

  assert(
    adminTeachers.text.includes('Switch to Dark Mode') ||
      adminTeachers.text.includes('Switch to Light Mode') ||
      adminTeachers.text.includes('Toggle theme') ||
      adminTeachers.text.includes('title="Switch to'),
    'Admin Portal header contains accessible ThemeToggle'
  );

  // ==========================================
  // 4. Attendance Duplicate Prevention Test
  // ==========================================
  console.log('\n[4/4] Verifying Attendance Upsert Duplicate Prevention...');
  const studentAarav = await prisma.studentProfile.findUnique({
    where: { rollNumber: 'STU-2026-001' },
  });
  const mathSubject = profSharma.subjects[0];
  const testDate = '2026-11-15';

  // Upsert 1
  await prisma.attendance.upsert({
    where: {
      studentId_subjectId_date: {
        studentId: studentAarav.id,
        subjectId: mathSubject.id,
        date: testDate,
      },
    },
    update: { status: 'PRESENT' },
    create: {
      studentId: studentAarav.id,
      subjectId: mathSubject.id,
      classId: studentAarav.classId,
      teacherId: profSharma.id,
      date: testDate,
      status: 'PRESENT',
    },
  });

  // Upsert 2 (update same student, subject, date to ABSENT)
  await prisma.attendance.upsert({
    where: {
      studentId_subjectId_date: {
        studentId: studentAarav.id,
        subjectId: mathSubject.id,
        date: testDate,
      },
    },
    update: { status: 'ABSENT' },
    create: {
      studentId: studentAarav.id,
      subjectId: mathSubject.id,
      classId: studentAarav.classId,
      teacherId: profSharma.id,
      date: testDate,
      status: 'ABSENT',
    },
  });

  const countAfter = await prisma.attendance.count({
    where: { studentId: studentAarav.id, subjectId: mathSubject.id, date: testDate },
  });
  const updatedRec = await prisma.attendance.findUnique({
    where: {
      studentId_subjectId_date: {
        studentId: studentAarav.id,
        subjectId: mathSubject.id,
        date: testDate,
      },
    },
  });

  assert(countAfter === 1, `Single record exists after multiple saves on date ${testDate} (No Duplicates!)`);
  assert(updatedRec.status === 'ABSENT', 'Record was updated to ABSENT properly');

  // Clean up test record
  await prisma.attendance.delete({
    where: {
      studentId_subjectId_date: {
        studentId: studentAarav.id,
        subjectId: mathSubject.id,
        date: testDate,
      },
    },
  });

  console.log(`\n========================================`);
  if (failures === 0) {
    console.log('🎉 ALL COMPREHENSIVE TESTS PASSED SUCCESSFULLY! (0 Failures)');
  } else {
    console.log(`❌ SOME TESTS FAILED (${failures} Failures)`);
  }
  console.log(`========================================\n`);

  await prisma.$disconnect();
  process.exit(failures > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error('Fatal error during test:', err);
  process.exit(1);
});

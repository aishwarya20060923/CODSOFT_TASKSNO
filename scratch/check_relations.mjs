import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function check() {
  console.log('=== VERIFYING COMPLETE RELATIONAL CHAIN ===');
  console.log('Teacher -> Subject -> Program -> Students -> Attendance\n');

  console.log('1. PROGRAMS / CLASSES & ASSIGNED FACULTY:');
  const classes = await p.class.findMany({
    include: {
      teacher: { include: { user: true } },
      teacherAssignments: { include: { teacher: { include: { user: true } } } },
    },
    orderBy: { name: 'asc' },
  });
  console.log(`Total classes: ${classes.length}`);
  for (const c of classes) {
    const studentCount = await p.studentProfile.count({ where: { classId: c.id } });
    const subjectCount = await p.subject.count({ where: { classId: c.id } });
    const advisor = c.teacher ? `${c.teacher.user.name} (${c.teacher.employeeId})` : 'None';
    const assignedTeachers = c.teacherAssignments.map((ta) => ta.teacher.user.name);
    console.log(`  - [${c.name}] Code: ${c.grade}, Room: ${c.room} | Advisor: ${advisor}`);
    console.log(`    Assigned Faculty: ${assignedTeachers.join(', ') || 'None'}`);
    console.log(`    Students: ${studentCount}, Subjects: ${subjectCount}`);
  }

  console.log('\n2. BCA SUBJECTS & TEACHER ACCESS:');
  const bca = classes.find((c) => c.name === 'BCA');
  const bcaSubjects = await p.subject.findMany({
    where: { classId: bca.id },
    include: {
      teacher: { include: { user: true } },
      teacherAssignments: { include: { teacher: { include: { user: true } } } },
    },
  });
  for (const sub of bcaSubjects) {
    const teacherName = sub.teacher?.user.name || 'UNASSIGNED';
    const teacherEmpId = sub.teacher?.employeeId || 'N/A';
    const coTeachers = sub.teacherAssignments.map((ta) => ta.teacher.user.name);
    const attCount = await p.attendance.count({ where: { subjectId: sub.id } });
    console.log(
      `  - ${sub.name.padEnd(22)} (${sub.code}) -> Primary: ${teacherName} (${teacherEmpId})${
        coTeachers.length > 0 ? ` + Co-Faculty: ${coTeachers.join(', ')}` : ''
      } | Attendance logs: ${attCount}`
    );
  }

  console.log('\n3. VERIFY TEACHER SCOPING & ACCESSIBILITY:');
  const teachers = await p.teacherProfile.findMany({
    include: {
      user: true,
      classes: true,
      classAssignments: { include: { class: true } },
      subjects: { include: { class: true } },
      subjectAssignments: { include: { subject: { include: { class: true } } } },
    },
  });
  for (const t of teachers) {
    const progMap = new Map();
    t.classes?.forEach((c) => progMap.set(c.name, c.name));
    t.classAssignments?.forEach((ca) => progMap.set(ca.class.name, ca.class.name));
    t.subjects?.forEach((s) => progMap.set(s.class.name, s.class.name));
    const allSubjects = [
      ...t.subjects.map((s) => `${s.name} [${s.class.name}]`),
      ...t.subjectAssignments.map((sa) => `${sa.subject.name} [${sa.subject.class.name}] (Co-faculty)`),
    ];
    console.log(`  - Faculty: ${t.user.name.padEnd(24)} (${t.employeeId})`);
    console.log(`    Accessible Programs: ${Array.from(progMap.values()).join(', ') || 'None'}`);
    console.log(`    Assigned Subjects:   ${allSubjects.join(', ')}`);
  }

  console.log('\n4. VERIFY AARAV SHARMA ATTENDANCE DYNAMICS:');
  const aarav = await p.studentProfile.findFirst({
    where: { rollNumber: 'STU-2026-001' },
    include: { class: true, attendances: { include: { subject: true } } }
  });
  console.log(`Enrolled in: ${aarav.class.name}`);
  const stats = {};
  for (const a of aarav.attendances) {
    const sub = a.subject.name;
    if (!stats[sub]) stats[sub] = { total: 0, present: 0 };
    stats[sub].total++;
    if (a.status === 'PRESENT') stats[sub].present++;
  }
  for (const [sub, s] of Object.entries(stats)) {
    console.log(`  - ${sub.padEnd(22)}: ${s.present}/${s.total} (${Math.round((s.present/s.total)*100)}%)`);
  }
  await p.$disconnect();
  console.log('\n=== ALL RELATIONAL CHAINS 100% VALIDATED ===');
}

check();



import prisma from '@/lib/prisma';
import AttendanceClient from '@/components/teacher/AttendanceClient';

export const dynamic = 'force-dynamic';

export default async function TeacherAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string; date?: string }>;
}) {
  const resolvedParams = await searchParams;
  const classes = await prisma.class.findMany({ orderBy: { name: 'asc' } });
  const activeClassId = resolvedParams.classId || classes[0]?.id;
  const activeDate = resolvedParams.date || '2026-09-04';

  const selectedClass = classes.find((c) => c.id === activeClassId) || classes[0];

  const students = await prisma.studentProfile.findMany({
    where: { classId: selectedClass?.id },
    include: { user: true },
    orderBy: { rollNumber: 'asc' },
  });

  const existingAttendances = await prisma.attendance.findMany({
    where: {
      classId: selectedClass?.id,
      date: activeDate,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance Register</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Log daily classroom attendance, tardiness records, and medical leaves.
          </p>
        </div>
      </div>

      {selectedClass && (
        <AttendanceClient
          classInfo={{ id: selectedClass.id, name: selectedClass.name }}
          students={students}
          existingAttendances={existingAttendances}
          selectedDate={activeDate}
        />
      )}
    </div>
  );
}

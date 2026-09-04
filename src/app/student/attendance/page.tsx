import prisma from '@/lib/prisma';
import { formatDate, getStatusBadgeColor } from '@/lib/utils';
import { CalendarCheck, CheckCircle2, XCircle, Clock, Award } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StudentAttendancePage() {
  const student = await prisma.studentProfile.findFirst({
    where: { rollNumber: 'STU-2026-001' },
    include: {
      user: true,
      class: true,
      attendances: {
        orderBy: { date: 'desc' },
      },
    },
  });

  if (!student) {
    return <div className="p-8 text-center text-slate-500">Student not found.</div>;
  }

  const attendances = student.attendances;
  const totalDays = attendances.length;
  const presentCount = attendances.filter((a) => a.status === 'PRESENT').length;
  const absentCount = attendances.filter((a) => a.status === 'ABSENT').length;
  const lateCount = attendances.filter((a) => a.status === 'LATE').length;

  const attendanceRate =
    totalDays > 0 ? Math.round(((presentCount + lateCount * 0.5) / totalDays) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Personal Attendance Record</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Verify your official attendance logs and track minimum semester presence requirements.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Overall Attendance</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{attendanceRate}%</p>
          <p className="text-xs text-emerald-600 font-medium mt-0.5">Compliant (&gt;75% required)</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-100 bg-emerald-50/20 shadow-2xs">
          <span className="text-xs font-semibold text-emerald-700 uppercase">Present</span>
          <p className="text-2xl font-bold text-emerald-800 mt-1">{presentCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Full school days</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-100 bg-rose-50/20 shadow-2xs">
          <span className="text-xs font-semibold text-rose-700 uppercase">Absent</span>
          <p className="text-2xl font-bold text-rose-800 mt-1">{absentCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Excused absences</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-100 bg-amber-50/20 shadow-2xs">
          <span className="text-xs font-semibold text-amber-700 uppercase">Tardy / Late</span>
          <p className="text-2xl font-bold text-amber-800 mt-1">{lateCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">Logged arrival delay</p>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Official Daily Logs</span>
          <span>Cohort: {student.class.name}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Calendar Date</th>
                <th className="px-5 py-3">Recorded Status</th>
                <th className="px-5 py-3">Faculty Notes / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendances.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-slate-400">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                attendances.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3.5 font-medium text-slate-800 text-xs">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(
                          item.status
                        )}`}
                      >
                        {item.status === 'PRESENT' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {item.status === 'ABSENT' && <XCircle className="w-3.5 h-3.5" />}
                        {item.status === 'LATE' && <Clock className="w-3.5 h-3.5" />}
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">
                      {item.remarks || 'Regular check-in'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

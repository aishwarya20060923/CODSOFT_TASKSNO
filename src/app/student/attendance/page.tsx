import { redirect } from 'next/navigation';
import { getAuthenticatedStudent } from '@/lib/auth';
import { formatDate, getStatusBadgeColor } from '@/lib/utils';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  UserCheck,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StudentAttendancePage() {
  const student = await getAuthenticatedStudent();

  if (!student) {
    redirect('/student/login');
  }

  const attendances = student.attendances;
  const totalSessions = attendances.length;
  const presentCount = attendances.filter((a) => a.status === 'PRESENT').length;
  const absentCount = attendances.filter((a) => a.status === 'ABSENT').length;
  const lateCount = attendances.filter((a) => a.status === 'LATE').length;

  const overallAttendanceRate =
    totalSessions > 0 ? Math.round(((presentCount + lateCount * 0.5) / totalSessions) * 100) : 0;

  // Calculate subject-wise metrics dynamically from database records
  const subjects = student.class.subjects || [];
  const subjectStats = subjects.map((sub) => {
    const subLogs = attendances.filter((a) => a.subjectId === sub.id);
    const subTotal = subLogs.length;
    const subPresent = subLogs.filter((a) => a.status === 'PRESENT').length;
    const subAbsent = subLogs.filter((a) => a.status === 'ABSENT').length;
    const subPct = subTotal > 0 ? Math.round((subPresent / subTotal) * 100) : 0;

    return {
      id: sub.id,
      name: sub.name,
      code: sub.code,
      facultyName: sub.teacher?.user.name || 'Faculty Member',
      totalSessions: subTotal,
      presentDays: subPresent,
      absentDays: subAbsent,
      percentage: subPct,
    };
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-0.5 bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 rounded-full border border-purple-200 dark:border-purple-800">
            {student.class.name}
          </span>
          <span className="font-mono text-xs text-slate-400 dark:text-slate-500 font-semibold">{student.rollNumber}</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Attendance Record & Course Presence
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Verify your subject-wise presence logs and maintain compliance with the 75% minimum institutional attendance requirement.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#131d33] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Overall Attendance</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{overallAttendanceRate}%</p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2">
            <div
              className={`h-1.5 rounded-full ${
                overallAttendanceRate >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(overallAttendanceRate, 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
            {overallAttendanceRate >= 75 ? 'Compliant (>75% required)' : 'Action required (<75%)'}
          </p>
        </div>

        <div className="bg-white dark:bg-[#131d33] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Present Days</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-300 mt-2">{presentCount}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Total verified sessions</p>
        </div>

        <div className="bg-white dark:bg-[#131d33] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Absent Days</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-800 dark:text-rose-300 mt-2">{absentCount}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Excused & medical leaves</p>
        </div>

        <div className="bg-white dark:bg-[#131d33] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total Classes</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{totalSessions}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Across all registered subjects</p>
        </div>
      </div>

      {/* Subject-Wise Attendance Breakdown */}
      <div className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Subject-Wise Attendance Breakdown
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Calculated dynamically from live classroom session records
            </p>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Academic Program: <strong className="text-slate-800 dark:text-slate-200">{student.class.name}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Subject & Code</th>
                <th className="px-5 py-3.5">Faculty Instructor</th>
                <th className="px-5 py-3.5 text-center">Present / Total</th>
                <th className="px-5 py-3.5">Attendance %</th>
                <th className="px-5 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {subjectStats.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400 text-xs">
                    No curriculum subjects registered.
                  </td>
                </tr>
              ) : (
                subjectStats.map((item) => {
                  const isCompliant = item.percentage >= 75;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                      {/* Subject Name & Code */}
                      <td className="px-5 py-4">
                        <span className="font-bold text-slate-900 dark:text-white block">{item.name}</span>
                        <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                          {item.code}
                        </span>
                      </td>

                      {/* Faculty Instructor */}
                      <td className="px-5 py-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {item.facultyName}
                      </td>

                      {/* Present / Total */}
                      <td className="px-5 py-4 text-center">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
                          {item.presentDays}
                        </span>
                        <span className="text-slate-400 dark:text-slate-500 text-xs"> / {item.totalSessions}</span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                          ({item.absentDays} absent)
                        </span>
                      </td>

                      {/* Percentage & Progress Bar */}
                      <td className="px-5 py-4 min-w-[160px]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{item.percentage}%</span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">Target: 75%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              item.percentage >= 85
                                ? 'bg-emerald-500'
                                : item.percentage >= 75
                                ? 'bg-blue-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${Math.min(item.percentage, 100)}%` }}
                          />
                        </div>
                      </td>

                      {/* Compliance Badge */}
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                            item.percentage >= 85
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                              : item.percentage >= 75
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                          }`}
                        >
                          {isCompliant ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          <span>{isCompliant ? 'Eligible' : 'Warning'}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Chronological History Logs */}
      <div className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-bold text-slate-900 dark:text-white text-sm">Session Attendance History</span>
          <span>{attendances.length} Total Recorded Logs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3">Calendar Date</th>
                <th className="px-5 py-3">Course / Subject</th>
                <th className="px-5 py-3">Faculty Instructor</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {attendances.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400 text-xs">
                    No session logs found.
                  </td>
                </tr>
              ) : (
                attendances.map((item) => {
                  const subjectName = item.subject?.name || 'General Class Attendance';
                  const facultyName =
                    item.teacher?.user.name ||
                    item.subject?.teacher?.user.name ||
                    'Faculty Coordinator';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      {/* Calendar Date */}
                      <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-200 text-xs whitespace-nowrap">
                        {formatDate(item.date)}
                      </td>

                      {/* Subject Name */}
                      <td className="px-5 py-3.5 text-xs font-bold text-slate-900 dark:text-white">
                        {subjectName}
                      </td>

                      {/* Faculty Instructor */}
                      <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {facultyName}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadgeColor(
                            item.status
                          )}`}
                        >
                          {item.status === 'PRESENT' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {item.status === 'ABSENT' && <XCircle className="w-3.5 h-3.5" />}
                          {item.status === 'LATE' && <Clock className="w-3.5 h-3.5" />}
                          <span>{item.status}</span>
                        </span>
                      </td>

                      {/* Remarks */}
                      <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                        {item.remarks || <span className="italic text-slate-400 dark:text-slate-500">—</span>}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

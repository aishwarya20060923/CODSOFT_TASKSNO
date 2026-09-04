'use client';

import { useState } from 'react';
import { Calendar, CheckCircle2, UserCheck, XCircle, Clock, Save } from 'lucide-react';
import { saveClassAttendance } from '@/lib/actions';

interface StudentData {
  id: string;
  rollNumber: string;
  user: {
    name: string;
    avatar: string | null;
  };
}

interface ExistingAttendance {
  studentId: string;
  date: string;
  status: string;
  remarks: string | null;
}

interface Props {
  classInfo: {
    id: string;
    name: string;
  };
  students: StudentData[];
  existingAttendances: ExistingAttendance[];
  selectedDate: string;
}

type StatusType = 'PRESENT' | 'ABSENT' | 'LATE';

export default function AttendanceClient({
  classInfo,
  students,
  existingAttendances,
  selectedDate: initialDate,
}: Props) {
  const [date, setDate] = useState(initialDate);

  // Initialize state map: studentId -> { status, remarks }
  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, { status: StatusType; remarks: string }>
  >(() => {
    const map: Record<string, { status: StatusType; remarks: string }> = {};
    for (const student of students) {
      const match = existingAttendances.find(
        (a) => a.studentId === student.id && a.date === initialDate
      );
      map[student.id] = {
        status: (match?.status as StatusType) || 'PRESENT',
        remarks: match?.remarks || '',
      };
    }
    return map;
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const handleStatusChange = (studentId: string, status: StatusType) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const markAllPresent = () => {
    const updated = { ...attendanceMap };
    for (const student of students) {
      updated[student.id] = {
        status: 'PRESENT',
        remarks: 'Present on time',
      };
    }
    setAttendanceMap(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);

    const records = students.map((s) => ({
      studentId: s.id,
      status: attendanceMap[s.id]?.status || 'PRESENT',
      remarks: attendanceMap[s.id]?.remarks || '',
    }));

    const res = await saveClassAttendance(classInfo.id, date, records);

    setSaving(false);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message || 'Attendance saved successfully!' });
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to save attendance' });
    }
  };

  // Metrics
  const presentCount = Object.values(attendanceMap).filter((v) => v.status === 'PRESENT').length;
  const absentCount = Object.values(attendanceMap).filter((v) => v.status === 'ABSENT').length;
  const lateCount = Object.values(attendanceMap).filter((v) => v.status === 'LATE').length;
  const percentage =
    students.length > 0 ? Math.round(((presentCount + lateCount * 0.5) / students.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top summary & controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100">
            {classInfo.name}
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-2">Daily Attendance Register</h2>
          <p className="text-xs text-slate-500">Record and verify daily classroom presence.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-hidden"
            />
          </div>

          <button
            type="button"
            onClick={markAllPresent}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
          >
            Mark All Present
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Register'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Attendance Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-400">Total Enrolled</span>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{students.length}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 shadow-2xs">
          <span className="text-xs font-medium text-emerald-700">Present</span>
          <p className="text-xl font-bold text-emerald-800 mt-0.5">{presentCount}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-100 bg-rose-50/30 shadow-2xs">
          <span className="text-xs font-medium text-rose-700">Absent</span>
          <p className="text-xl font-bold text-rose-800 mt-0.5">{absentCount}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-100 bg-amber-50/30 shadow-2xs">
          <span className="text-xs font-medium text-amber-700">Late / Tardy</span>
          <p className="text-xl font-bold text-amber-800 mt-0.5">{lateCount}</p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Student Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Roll No</th>
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3">Remarks / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => {
                const currentStatus = attendanceMap[student.id]?.status || 'PRESENT';
                const currentRemarks = attendanceMap[student.id]?.remarks || '';

                return (
                  <tr key={student.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-600">
                      {student.rollNumber}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            student.user.avatar ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.user.name}`
                          }
                          alt={student.user.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <span className="font-semibold text-slate-900 text-sm">
                          {student.user.name}
                        </span>
                      </div>
                    </td>

                    {/* 3 Status Buttons */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'PRESENT')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            currentStatus === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Present</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'LATE')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            currentStatus === 'LATE'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Late</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'ABSENT')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            currentStatus === 'ABSENT'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Absent</span>
                        </button>
                      </div>
                    </td>

                    {/* Remarks input */}
                    <td className="px-5 py-3.5">
                      <input
                        type="text"
                        placeholder="Add note (optional)..."
                        value={currentRemarks}
                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                        className="w-full max-w-xs px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

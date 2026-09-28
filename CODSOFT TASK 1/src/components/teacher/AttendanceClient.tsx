'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  CheckCircle2,
  UserCheck,
  XCircle,
  Clock,
  Save,
  BookOpen,
  Building2,
  Sparkles,
  Users,
  AlertCircle,
} from 'lucide-react';
import { saveSubjectAttendance } from '@/lib/actions';

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

interface SubjectOption {
  id: string;
  name: string;
  code: string;
  class: {
    id: string;
    name: string;
    room: string | null;
  };
}

interface Props {
  subjects: SubjectOption[];
  activeSubject: SubjectOption;
  students: StudentData[];
  existingAttendances: ExistingAttendance[];
  selectedDate: string;
}

type StatusType = 'PRESENT' | 'ABSENT';

export default function AttendanceClient({
  subjects,
  activeSubject,
  students,
  existingAttendances,
  selectedDate: initialDate,
}: Props) {
  const router = useRouter();
  const [date, setDate] = useState(initialDate);

  // Initialize status map: studentId -> { status, remarks }
  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, { status: StatusType; remarks: string }>
  >(() => {
    const map: Record<string, { status: StatusType; remarks: string }> = {};
    for (const student of students) {
      const match = existingAttendances.find(
        (a) => a.studentId === student.id && a.date === initialDate
      );
      map[student.id] = {
        status: match?.status === 'ABSENT' ? 'ABSENT' : 'PRESENT',
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

  const markAllAbsent = () => {
    const updated = { ...attendanceMap };
    for (const student of students) {
      updated[student.id] = {
        status: 'ABSENT',
        remarks: 'Absent',
      };
    }
    setAttendanceMap(updated);
  };

  const handleSubjectChange = (newSubjectId: string) => {
    const selected = subjects.find((s) => s.id === newSubjectId);
    if (selected) {
      router.push(
        `/teacher/attendance?subjectId=${selected.id}&classId=${selected.class.id}&date=${date}`
      );
    }
  };

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    router.push(
      `/teacher/attendance?subjectId=${activeSubject.id}&classId=${activeSubject.class.id}&date=${newDate}`
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);

    const records = students.map((s) => ({
      studentId: s.id,
      status: (attendanceMap[s.id]?.status || 'PRESENT') as 'PRESENT' | 'ABSENT',
      remarks: attendanceMap[s.id]?.remarks || '',
    }));

    const res = await saveSubjectAttendance(
      activeSubject.id,
      activeSubject.class.id,
      date,
      records
    );

    setSaving(false);
    if (res.success) {
      setFeedback({
        type: 'success',
        message: res.message || 'Attendance records saved and synchronized with Student Portal!',
      });
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to record attendance' });
    }
  };

  // Live Metrics
  const presentCount = Object.values(attendanceMap).filter((v) => v.status === 'PRESENT').length;
  const absentCount = Object.values(attendanceMap).filter((v) => v.status === 'ABSENT').length;
  const percentage =
    students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Filter & Selector Bar */}
      <div className="bg-white dark:bg-[#131d33] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Subject Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Assigned Subject</span>
            </label>
            <select
              value={activeSubject.id}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs cursor-pointer"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.code}) • {sub.class.name}
                </option>
              ))}
            </select>
          </div>

          {/* Class (Readonly / Scoped to Subject) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Class / Cohort</span>
            </label>
            <div className="w-full px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
              <span>{activeSubject.class.name}</span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-normal">
                Room {activeSubject.class.room || 'TBA'}
              </span>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Attendance Date</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/20 focus:outline-none transition shadow-2xs cursor-pointer"
            />
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Session Status:</span>
            <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              {presentCount} Present
            </span>
            <span className="px-2.5 py-0.5 rounded-full font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
              {absentCount} Absent
            </span>
            <span className="text-slate-400 dark:text-slate-500">({percentage}% Attendance)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={markAllPresent}
              className="px-3 py-1.5 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-xl transition cursor-pointer"
            >
              Mark All Present
            </button>
            <button
              type="button"
              onClick={markAllAbsent}
              className="px-3 py-1.5 text-xs font-bold bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 rounded-xl transition cursor-pointer"
            >
              Mark All Absent
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-700'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-2 border-rose-300 dark:border-rose-700'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Attendance Register Table */}
      <div className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Enrolled Students for {activeSubject.name}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Class: {activeSubject.class.name} • {students.length} Total Enrolled Students
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Attendance'}</span>
          </button>
        </div>

        {students.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No Students Enrolled</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              No student profiles found for {activeSubject.class.name}.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Roll Number</th>
                  <th className="px-5 py-3 text-center">Attendance Status</th>
                  <th className="px-5 py-3">Remarks / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.map((st) => {
                  const status = attendanceMap[st.id]?.status || 'PRESENT';
                  const remarks = attendanceMap[st.id]?.remarks || '';

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                      {/* Name & Avatar */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              st.user.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                st.user.name
                              )}&background=6366f1&color=ffffff&bold=true`
                            }
                            alt={st.user.name}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                            {st.user.name}
                          </span>
                        </div>
                      </td>

                      {/* Roll Number */}
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {st.rollNumber}
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="px-5 py-3.5 text-center">
                        <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 gap-1">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.id, 'PRESENT')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                              status === 'PRESENT'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.id, 'ABSENT')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                              status === 'ABSENT'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </button>
                        </div>
                      </td>

                      {/* Remarks Input */}
                      <td className="px-5 py-3.5">
                        <input
                          type="text"
                          value={remarks}
                          onChange={(e) => handleRemarksChange(st.id, e.target.value)}
                          placeholder="Optional notes (e.g., Medical leave, On time)..."
                          className="w-full px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg focus:border-emerald-600 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Save Row */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Attendance changes are immediately synchronized with the Student Portal upon saving.
          </p>

          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Attendance'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

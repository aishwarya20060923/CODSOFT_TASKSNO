'use client';

import { useState } from 'react';
import { Award, Save, CheckCircle2, TrendingUp, Users, BookOpen } from 'lucide-react';
import { calculateGrade, getGradeBadgeColor } from '@/lib/utils';
import { saveExamMarks } from '@/lib/actions';

interface StudentData {
  id: string;
  rollNumber: string;
  user: {
    name: string;
    avatar: string | null;
  };
}

interface MarkData {
  id?: string;
  subjectId: string;
  studentId: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  remarks: string | null;
}

interface Props {
  exam: {
    id: string;
    name: string;
    term: string;
  };
  subjects: {
    id: string;
    name: string;
    code: string;
  }[];
  students: StudentData[];
  allMarks: MarkData[];
  initialSubjectId?: string;
}

type StudentMarkEntry = {
  marks: number;
  maxMarks: number;
  remarks: string;
};

export default function ExamsClient({
  exam,
  subjects,
  students,
  allMarks,
  initialSubjectId,
}: Props) {
  const defaultSubjectId =
    (initialSubjectId && subjects.some((s) => s.id === initialSubjectId)
      ? initialSubjectId
      : subjects[0]?.id) || '';

  const [selectedSubjectId, setSelectedSubjectId] = useState(defaultSubjectId);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  // Subject-wise state map: [subjectId][studentId] -> { marks, maxMarks, remarks }
  const [marksBySubject, setMarksBySubject] = useState<
    Record<string, Record<string, StudentMarkEntry>>
  >(() => {
    const state: Record<string, Record<string, StudentMarkEntry>> = {};

    for (const sub of subjects) {
      state[sub.id] = {};
      for (const student of students) {
        const existing = allMarks.find(
          (m) => m.subjectId === sub.id && m.studentId === student.id
        );
        state[sub.id][student.id] = {
          marks: existing !== undefined ? existing.marksObtained : 75,
          maxMarks: existing !== undefined ? existing.maxMarks : 100,
          remarks: existing?.remarks || 'Satisfactory academic progress',
        };
      }
    }

    return state;
  });

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const currentSubjectMarks = marksBySubject[selectedSubjectId] || {};

  const handleScoreChange = (studentId: string, value: number) => {
    const validValue = Math.max(0, Math.min(100, isNaN(value) ? 0 : value));
    setMarksBySubject((prev) => ({
      ...prev,
      [selectedSubjectId]: {
        ...prev[selectedSubjectId],
        [studentId]: {
          ...(prev[selectedSubjectId]?.[studentId] || { marks: 0, maxMarks: 100, remarks: '' }),
          marks: validValue,
        },
      },
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setMarksBySubject((prev) => ({
      ...prev,
      [selectedSubjectId]: {
        ...prev[selectedSubjectId],
        [studentId]: {
          ...(prev[selectedSubjectId]?.[studentId] || { marks: 0, maxMarks: 100, remarks: '' }),
          remarks,
        },
      },
    }));
  };

  const handleSave = async () => {
    if (!selectedSubjectId) return;
    setSaving(true);
    setFeedback(null);

    const records = students.map((s) => {
      const data = currentSubjectMarks[s.id] || { marks: 0, maxMarks: 100, remarks: '' };
      return {
        studentId: s.id,
        marksObtained: data.marks,
        maxMarks: data.maxMarks,
        grade: calculateGrade(data.marks, data.maxMarks),
        remarks: data.remarks,
      };
    });

    const res = await saveExamMarks(exam.id, selectedSubjectId, records);

    setSaving(false);
    if (res.success) {
      setFeedback({
        type: 'success',
        message: `${currentSubject?.name || 'Subject'} marks saved and published successfully!`,
      });
      setTimeout(() => setFeedback(null), 3500);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to save marks' });
    }
  };

  // Metrics calculated strictly for the currently selected subject
  const currentScores = students.map((s) => currentSubjectMarks[s.id]?.marks ?? 0);
  const avgScore =
    currentScores.length > 0
      ? Math.round(currentScores.reduce((a, b) => a + b, 0) / currentScores.length)
      : 0;
  const maxScore = currentScores.length > 0 ? Math.max(...currentScores) : 0;
  const passingCount = currentScores.filter((s) => s >= 50).length;
  const passPercentage =
    currentScores.length > 0 ? Math.round((passingCount / currentScores.length) * 100) : 0;
  const gradedStudentsCount = students.filter(
    (s) => currentSubjectMarks[s.id] !== undefined
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Subject Switcher */}
      <div className="bg-white dark:bg-[#131d33] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
              {exam.term}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{exam.name}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-2">Evaluation & Marks Grading</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select a subject from the curriculum to view and manage student scores.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Subject Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs shadow-2xs">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="text-slate-500 dark:text-slate-400 font-medium">Subject:</span>
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                setFeedback(null);
              }}
              className="bg-transparent text-slate-800 dark:text-white font-bold text-xs focus:outline-hidden cursor-pointer"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id} className="dark:bg-slate-800 dark:text-white">
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing...' : 'Save & Publish Marks'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Performance Metrics for the Selected Subject */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#131d33] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-medium text-slate-400 dark:text-slate-400">
            Class Average ({currentSubject?.code})
          </span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{avgScore}%</p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-2">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, avgScore)}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-[#131d33] p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-2xs">
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Highest Score</span>
          <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-300 mt-0.5">{maxScore} / 100</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Top cohort mark</p>
        </div>

        <div className="bg-white dark:bg-[#131d33] p-4 rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-950/20 shadow-2xs">
          <span className="text-xs font-medium text-blue-700 dark:text-blue-400">Pass Percentage</span>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-300 mt-0.5">{passPercentage}%</p>
          <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">{passingCount} of {students.length} passed</p>
        </div>

        <div className="bg-white dark:bg-[#131d33] p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-2xs">
          <span className="text-xs font-medium text-indigo-700 dark:text-indigo-400">Graded Students</span>
          <p className="text-2xl font-bold text-indigo-800 dark:text-indigo-300 mt-0.5">
            {gradedStudentsCount} / {students.length}
          </p>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1">Subject evaluated</p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}
        >
          {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Grade Entry Table */}
      <div className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {currentSubject?.name} ({currentSubject?.code}) Roster
          </span>
          <span>Max Marks: 100</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3">Roll No</th>
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3 text-center">Marks Obtained (100)</th>
                <th className="px-5 py-3 text-center">Calculated Grade</th>
                <th className="px-5 py-3">Subject Evaluation Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map((student) => {
                const currentData = currentSubjectMarks[student.id] || {
                  marks: 0,
                  maxMarks: 100,
                  remarks: '',
                };
                const calculatedGrade = calculateGrade(currentData.marks, currentData.maxMarks);

                return (
                  <tr key={student.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
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
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <span className="font-semibold text-slate-900 dark:text-white text-sm">
                          {student.user.name}
                        </span>
                      </div>
                    </td>

                    {/* Score Input */}
                    <td className="px-5 py-3.5 text-center">
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={currentData.marks}
                          onChange={(e) =>
                            handleScoreChange(student.id, parseFloat(e.target.value))
                          }
                          className="w-20 px-2 py-1.5 text-center font-bold text-slate-900 dark:text-white text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        />
                        <span className="text-xs text-slate-400 font-semibold">/ 100</span>
                      </div>
                    </td>

                    {/* Dynamic Grade Badge */}
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-bold rounded-lg border ${getGradeBadgeColor(
                          calculatedGrade
                        )}`}
                      >
                        {calculatedGrade}
                      </span>
                    </td>

                    {/* Remarks Input */}
                    <td className="px-5 py-3.5">
                      <input
                        type="text"
                        placeholder="Subject-specific evaluation..."
                        value={currentData.remarks}
                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                        className="w-full max-w-sm px-2.5 py-1 text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden placeholder:text-slate-400 dark:placeholder:text-slate-500"
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

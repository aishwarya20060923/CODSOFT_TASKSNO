'use client';

import { useState } from 'react';
import { Award, Save, CheckCircle2, TrendingUp, Users } from 'lucide-react';
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
  initialMarks: MarkData[];
}

export default function ExamsClient({ exam, subjects, students, initialMarks }: Props) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  // Map: studentId -> { marksObtained, maxMarks, remarks }
  const [marksMap, setMarksMap] = useState<
    Record<string, { marks: number; maxMarks: number; remarks: string }>
  >(() => {
    const map: Record<string, { marks: number; maxMarks: number; remarks: string }> = {};
    for (const s of students) {
      const existing = initialMarks.find((m) => m.studentId === s.id);
      map[s.id] = {
        marks: existing ? existing.marksObtained : 80,
        maxMarks: existing ? existing.maxMarks : 100,
        remarks: existing?.remarks || 'Satisfactory progress',
      };
    }
    return map;
  });

  const handleScoreChange = (studentId: string, value: number) => {
    const validValue = Math.max(0, Math.min(100, isNaN(value) ? 0 : value));
    setMarksMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marks: validValue,
      },
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setMarksMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);

    const records = students.map((s) => {
      const data = marksMap[s.id] || { marks: 0, maxMarks: 100, remarks: '' };
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
      setFeedback({ type: 'success', message: res.message || 'Grades saved successfully!' });
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to save grades' });
    }
  };

  // Metrics
  const scores = Object.values(marksMap).map((v) => v.marks);
  const avgScore =
    scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
  const passingCount = scores.filter((s) => s >= 50).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Subject Switcher */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-100">
              {exam.term}
            </span>
            <span className="text-xs text-slate-500 font-medium">{exam.name}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-2">Evaluation & Marks Grading</h2>
          <p className="text-xs text-slate-500">
            Submit student scores and evaluate curriculum proficiency.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Subject:</span>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-hidden"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
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

      {/* Real-time Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-400">Class Average</span>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{avgScore}%</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 shadow-2xs">
          <span className="text-xs font-medium text-emerald-700">Highest Score</span>
          <p className="text-xl font-bold text-emerald-800 mt-0.5">{maxScore} / 100</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-100 bg-blue-50/30 shadow-2xs">
          <span className="text-xs font-medium text-blue-700">Pass Percentage</span>
          <p className="text-xl font-bold text-blue-800 mt-0.5">
            {students.length > 0 ? Math.round((passingCount / students.length) * 100) : 0}%
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 shadow-2xs">
          <span className="text-xs font-medium text-indigo-700">Graded Students</span>
          <p className="text-xl font-bold text-indigo-800 mt-0.5">
            {students.length} of {students.length}
          </p>
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

      {/* Grade Entry Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Roll No</th>
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3 text-center">Marks Obtained (100)</th>
                <th className="px-5 py-3 text-center">Calculated Grade</th>
                <th className="px-5 py-3">Faculty Evaluation Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => {
                const currentData = marksMap[student.id] || {
                  marks: 0,
                  maxMarks: 100,
                  remarks: '',
                };
                const calculatedGrade = calculateGrade(currentData.marks, currentData.maxMarks);

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
                          className="w-20 px-2 py-1.5 text-center font-bold text-slate-900 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
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
                        placeholder="Evaluation notes..."
                        value={currentData.remarks}
                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                        className="w-full max-w-sm px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
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

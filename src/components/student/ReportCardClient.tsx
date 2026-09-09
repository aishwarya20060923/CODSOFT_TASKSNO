'use client';

import { Printer, Award, GraduationCap, CheckCircle } from 'lucide-react';
import { calculateGrade, getGradeBadgeColor } from '@/lib/utils';

interface MarkRecord {
  id: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  remarks: string | null;
  subject: {
    name: string;
    code: string;
  };
  exam: {
    name: string;
    term: string;
  };
}

interface StudentInfo {
  rollNumber: string;
  name: string;
  email: string;
  className: string;
  adviserName: string;
}

export default function ReportCardClient({
  student,
  marks,
}: {
  student: StudentInfo;
  marks: MarkRecord[];
}) {
  const handlePrint = () => {
    window.print();
  };

  const totalObtained = marks.reduce((sum, m) => sum + m.marksObtained, 0);
  const totalMax = marks.reduce((sum, m) => sum + m.maxMarks, 0);
  const overallPercentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
  const overallGrade = calculateGrade(overallPercentage);

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Academic Report Card</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Official semester transcript and faculty performance evaluation.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Download Transcript</span>
        </button>
      </div>

      {/* Official Report Card Sheet */}
      <div className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
        {/* Institutional Header */}
        <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-6 mb-6 text-center relative">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-2 shadow-md">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-wider text-slate-900 dark:text-white">
            EduManage International Academy
          </h2>
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
            Office of the Registrar & Academic Council
          </p>
          <p className="text-sm font-bold text-purple-700 dark:text-purple-400 mt-2">
            OFFICIAL SEMESTER PERFORMANCE REPORT • FALL 2026
          </p>
        </div>

        {/* Student Metadata Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 mb-6 text-xs">
          <div>
            <span className="text-slate-400 dark:text-slate-500 font-medium uppercase text-[10px]">Student Name</span>
            <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{student.name}</p>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500 font-medium uppercase text-[10px]">Roll Number</span>
            <p className="font-mono font-bold text-blue-700 dark:text-blue-400 text-sm mt-0.5">{student.rollNumber}</p>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500 font-medium uppercase text-[10px]">Cohort / Class</span>
            <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{student.className}</p>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500 font-medium uppercase text-[10px]">Class Adviser</span>
            <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{student.adviserName}</p>
          </div>
        </div>

        {/* Grades Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-xs text-slate-700 dark:text-slate-300 uppercase font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">Subject Code</th>
                <th className="px-4 py-3">Subject Title</th>
                <th className="px-4 py-3 text-center">Max Marks</th>
                <th className="px-4 py-3 text-center">Marks Obtained</th>
                <th className="px-4 py-3 text-center">Grade</th>
                <th className="px-4 py-3">Faculty Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs sm:text-sm">
              {marks.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-mono font-semibold text-slate-600 dark:text-slate-400">
                    {m.subject.code}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{m.subject.name}</td>
                  <td className="px-4 py-3 text-center text-slate-500 dark:text-slate-400 font-medium">{m.maxMarks}</td>
                  <td className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">
                    {m.marksObtained}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-md border ${getGradeBadgeColor(
                        m.grade
                      )}`}
                    >
                      {m.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-xs">{m.remarks || 'Commendable'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Transcript Summary */}
        <div className="border-t-2 border-slate-200 dark:border-slate-700 pt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase">Total Score</span>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {totalObtained} <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">/ {totalMax}</span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50">
            <span className="text-purple-700 dark:text-purple-300 text-xs font-medium uppercase">Overall Percentage</span>
            <p className="text-xl font-bold text-purple-900 dark:text-purple-200 mt-0.5">{overallPercentage}%</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between">
            <div>
              <span className="text-emerald-700 dark:text-emerald-300 text-xs font-medium uppercase">Final Academic Standing</span>
              <p className="text-xl font-bold text-emerald-900 dark:text-emerald-200 mt-0.5">Grade {overallGrade}</p>
            </div>
            <Award className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>

        {/* Official Signatures */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-6 text-center text-xs text-slate-500 dark:text-slate-400">
          <div>
            <div className="h-10 border-b border-slate-300 dark:border-slate-700 w-32 mx-auto mb-1 flex items-end justify-center font-serif italic text-slate-800 dark:text-slate-200 text-sm">
              Prof. Rajesh Sharma
            </div>
            <p className="font-semibold text-slate-700 dark:text-slate-300">Class Teacher</p>
          </div>
          <div>
            <div className="h-10 border-b border-slate-300 dark:border-slate-700 w-32 mx-auto mb-1 flex items-end justify-center font-serif italic text-slate-800 dark:text-slate-200 text-sm">
              Dr. Anandita Verma
            </div>
            <p className="font-semibold text-slate-700 dark:text-slate-300">Dean of Academics</p>
          </div>
          <div>
            <div className="h-10 border-b border-slate-300 dark:border-slate-700 w-32 mx-auto mb-1 flex items-end justify-center font-serif italic text-emerald-700 dark:text-emerald-400 text-xs font-bold">
              OFFICIAL SEAL
            </div>
            <p className="font-semibold text-slate-700 dark:text-slate-300">Office of Registrar</p>
          </div>
        </div>
      </div>
    </div>
  );
}

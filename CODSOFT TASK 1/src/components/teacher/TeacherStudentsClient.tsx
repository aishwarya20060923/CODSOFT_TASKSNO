'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Users,
  BookOpen,
  Building2,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  GraduationCap,
} from 'lucide-react';

export interface TeacherStudentItem {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  avatar: string | null;
  className: string;
  classId: string;
  subjectNames: string[];
  subjectIds: string[];
  totalSessions: number;
  presentSessions: number;
  attendancePct: number;
  parentPhone: string | null;
}

interface Props {
  students: TeacherStudentItem[];
  subjects: { id: string; name: string; code: string }[];
  classes: { id: string; name: string }[];
}

export default function TeacherStudentsClient({ students, subjects, classes }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedClass, setSelectedClass] = useState('ALL');

  const filteredStudents = useMemo(() => {
    return students.filter((st) => {
      const matchesSearch =
        st.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        st.rollNumber.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        st.email.toLowerCase().includes(searchTerm.toLowerCase().trim());

      const matchesSubject =
        selectedSubject === 'ALL' || st.subjectIds.includes(selectedSubject);

      const matchesClass = selectedClass === 'ALL' || st.classId === selectedClass;

      return matchesSearch && matchesSubject && matchesClass;
    });
  }, [students, searchTerm, selectedSubject, selectedClass]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-0.5 bg-white/10 rounded-full text-emerald-200 border border-emerald-400/20 inline-block mb-2">
            Classroom Cohort Roster
          </span>
          <h1 className="text-2xl font-bold tracking-tight">My Students</h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
            Students currently enrolled in your assigned curriculum courses and class advisory cohorts.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur border border-white/15 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-200 block">
              Enrolled Students
            </span>
            <span className="text-xl font-bold text-white">{students.length}</span>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur border border-white/15 text-center">
            <span className="text-[10px] uppercase font-bold text-teal-200 block">Courses Taught</span>
            <span className="text-xl font-bold text-white">{subjects.length}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#131d33] p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name or roll number..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-emerald-600 focus:outline-none transition shadow-2xs placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Subject Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-emerald-600 focus:outline-none transition shadow-2xs cursor-pointer"
            >
              <option value="ALL" className="dark:bg-slate-800 dark:text-white">All Assigned Subjects</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id} className="dark:bg-slate-800 dark:text-white">
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-emerald-600 focus:outline-none transition shadow-2xs cursor-pointer"
            >
              <option value="ALL" className="dark:bg-slate-800 dark:text-white">All Teaching Classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id} className="dark:bg-slate-800 dark:text-white">
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{filteredStudents.length}</strong> of{' '}
            <strong className="text-slate-900 dark:text-white">{students.length}</strong> students
          </span>
          {(searchTerm || selectedSubject !== 'ALL' || selectedClass !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedSubject('ALL');
                setSelectedClass('ALL');
              }}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#131d33]">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Students Found</h3>
            <p className="text-xs text-slate-400 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              No enrolled students matched your search criteria in your assigned cohorts.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-5 py-3.5">Roll Number</th>
                  <th className="px-5 py-3.5">Class</th>
                  <th className="px-5 py-3.5">Enrolled Course(s)</th>
                  <th className="px-5 py-3.5 text-center">Attendance Rate</th>
                  <th className="px-5 py-3.5">Parent Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map((st) => {
                  const isGood = st.attendancePct >= 75;

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                      {/* Name & Avatar */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              st.avatar ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                st.name
                              )}&background=047857&color=ffffff&bold=true`
                            }
                            alt={st.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm block">
                              {st.name}
                            </span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-400 block">{st.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Roll Number */}
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {st.rollNumber}
                        </span>
                      </td>

                      {/* Class */}
                      <td className="px-5 py-3.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {st.className}
                      </td>

                      {/* Enrolled Courses Taught by this Teacher */}
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {st.subjectNames.map((sub, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-100 dark:border-emerald-800/50"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Attendance % */}
                      <td className="px-5 py-3.5 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isGood ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          <span className={isGood ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}>
                            {st.attendancePct}%
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-400 font-normal">
                            ({st.presentSessions}/{st.totalSessions})
                          </span>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-300">
                        {st.parentPhone ? (
                          <div className="flex items-center gap-1 font-mono">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{st.parentPhone}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not available</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

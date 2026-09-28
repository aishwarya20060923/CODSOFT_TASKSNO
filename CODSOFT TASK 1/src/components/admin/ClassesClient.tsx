'use client';

import { useState } from 'react';
import {
  Building2,
  Users,
  BookOpen,
  DoorOpen,
  Award,
  Plus,
  Calendar,
  X,
  CheckCircle2,
} from 'lucide-react';
import { createClass, createSubjectSchedule, assignClassTeachers } from '@/lib/actions';

interface TeacherOption {
  id: string;
  user: {
    name: string;
  };
  department: string;
}

interface SubjectItem {
  id: string;
  name: string;
  code: string;
  teacher: {
    user: {
      name: string;
    };
  } | null;
}

interface ClassItem {
  id: string;
  name: string;
  grade: string;
  section: string;
  room: string | null;
  teacher: {
    user: {
      name: string;
    };
  } | null;
  teacherAssignments?: {
    teacher: {
      id: string;
      user: {
        name: string;
      };
    };
  }[];
  students: {
    id: string;
  }[];
  subjects: SubjectItem[];
}

export default function ClassesClient({
  classes,
  teachers,
}: {
  classes: ClassItem[];
  teachers: TeacherOption[];
}) {
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [manageFacultyClass, setManageFacultyClass] = useState<ClassItem | null>(null);
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const handleCreateClass = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    const res = await createClass(formData);

    setSubmitting(false);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message || 'Class appointed successfully!' });
      setTimeout(() => {
        setIsClassModalOpen(false);
        setFeedback(null);
      }, 1200);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to appoint class' });
    }
  };

  const handleCreateSubject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    const res = await createSubjectSchedule(formData);

    setSubmitting(false);
    if (res.success) {
      setFeedback({
        type: 'success',
        message: res.message || 'Subject scheduled successfully!',
      });
      setTimeout(() => {
        setIsSubjectModalOpen(false);
        setFeedback(null);
      }, 1200);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to schedule subject' });
    }
  };

  const handleAssignFaculty = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!manageFacultyClass) return;
    setSubmitting(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    formData.set('classId', manageFacultyClass.id);

    const res = await assignClassTeachers(formData);
    setSubmitting(false);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message || 'Program faculty updated!' });
      setTimeout(() => {
        setManageFacultyClass(null);
        setFeedback(null);
      }, 1200);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to update program faculty' });
    }
  };

  const inputStyle = {};
  const inputClass =
    'w-full px-3 py-2 text-sm font-semibold !text-slate-900 dark:!text-white bg-white dark:bg-slate-800/90 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal caret-blue-600 shadow-2xs transition';

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Classes & Subjects</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Curriculum allocation, classrooms, and teacher-subject alignments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsSubjectModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 shadow-2xs transition cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>Schedule Subject</span>
          </button>

          <button
            type="button"
            onClick={() => setIsClassModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Appoint New Class</span>
          </button>
        </div>
      </div>

      {/* Grid of Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50">
                  Program: {cls.grade}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <DoorOpen className="w-3.5 h-3.5 text-slate-400" />
                  {cls.room || 'Room TBA'}
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{cls.name}</h2>

              {/* Class Teacher */}
              <div className="py-2.5 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700 mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase">Class Advisory Head</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {cls.teacher?.user.name || 'Unassigned Faculty'}
                  </p>
                </div>
                <Award className="w-4 h-4 text-indigo-500" />
              </div>

              {/* Assigned Faculty */}
              {(() => {
                const assignedNames = new Set<string>();
                if (cls.teacher?.user.name) assignedNames.add(cls.teacher.user.name);
                cls.teacherAssignments?.forEach((ta) => {
                  if (ta.teacher?.user.name) assignedNames.add(ta.teacher.user.name);
                });
                cls.subjects?.forEach((s) => {
                  if (s.teacher?.user.name) assignedNames.add(s.teacher.user.name);
                });
                const namesList = Array.from(assignedNames);
                return (
                  <div className="py-2.5 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700 mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[11px] font-medium text-slate-400 uppercase">
                        Assigned Faculty ({namesList.length})
                      </p>
                      <button
                        type="button"
                        onClick={() => setManageFacultyClass(cls)}
                        className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Manage
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {namesList.map((name, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-semibold border border-blue-200/80 dark:border-blue-800/50"
                        >
                          {name}
                        </span>
                      ))}
                      {namesList.length === 0 && (
                        <span className="text-xs text-slate-400 italic">No faculty appointed</span>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100/80 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    Students
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
                    {cls.students.length} Enrolled
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100/80 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-slate-400" />
                    Curriculum
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
                    {cls.subjects.length} Subjects
                  </span>
                </div>
              </div>

              {/* Subjects List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Subject Schedule</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedClassId(cls.id);
                      setIsSubjectModalOpen(true);
                    }}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-0.5 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {cls.subjects.length === 0 ? (
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic py-2">
                      No subjects configured yet. Click &apos;Add&apos; to schedule a subject.
                    </p>
                  ) : (
                    cls.subjects.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70 dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs border border-slate-100 dark:border-slate-700/80 transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-semibold px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded">
                            {sub.code}
                          </span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">{sub.name}</span>
                        </div>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {sub.teacher?.user.name ? sub.teacher.user.name.split(' ')[0] : 'Staff'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal 1: Appoint New Class */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#131d33] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Appoint New Class
              </h3>
              <button
                onClick={() => setIsClassModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div
                className={`mt-4 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleCreateClass} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Program Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. BCA, BBA, or B.Com"
                  style={inputStyle}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Program Code *</label>
                  <input
                    type="text"
                    name="grade"
                    required
                    placeholder="e.g. BCA, BBA, or BCOM"
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Section *</label>
                  <input
                    type="text"
                    name="section"
                    required
                    placeholder="e.g. A, B, or Honors"
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Room / Lecture Hall</label>
                  <input
                    type="text"
                    name="room"
                    placeholder="e.g. Computer Lab / Hall 301"
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Appoint Class Teacher
                  </label>
                  <select name="teacherId" style={inputStyle} className={inputClass}>
                    <option value="none">-- Select Faculty Advisor --</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.user.name} ({t.department})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Appointing...' : 'Appoint Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Schedule Class Subject */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#131d33] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Schedule Class Subject
              </h3>
              <button
                onClick={() => setIsSubjectModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div
                className={`mt-4 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubject} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Target Class *</label>
                <select
                  name="classId"
                  required
                  defaultValue={selectedClassId}
                  style={inputStyle}
                  className={inputClass}
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Grade {c.grade}-{c.section})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Accountancy & Finance"
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Subject Code *
                  </label>
                  <input
                    type="text"
                    name="code"
                    required
                    placeholder="e.g. ACC-101"
                    style={inputStyle}
                    className={`${inputClass} font-mono`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Assigned Faculty Teacher
                </label>
                <select name="teacherId" style={inputStyle} className={inputClass}>
                  <option value="none">-- Assign Faculty Instructor --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.user.name} ({t.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Scheduling...' : 'Schedule Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Manage Assigned Faculty */}
      {manageFacultyClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Appoint Program Faculty
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{manageFacultyClass.name}</p>
              </div>
              <button
                onClick={() => setManageFacultyClass(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div
                className={`mt-4 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleAssignFaculty} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Select Faculty Members Assigned to this Program
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  {teachers.map((t) => {
                    const isChecked =
                      manageFacultyClass.teacherAssignments?.some((ta) => ta.teacher?.id === t.id) ||
                      manageFacultyClass.teacher?.user.name === t.user.name;
                    return (
                      <label key={t.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition">
                        <input
                          type="checkbox"
                          name="teacherIds"
                          value={t.id}
                          defaultChecked={isChecked}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{t.user.name}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{t.department}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Check all faculty instructors who teach or mentor in this program.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setManageFacultyClass(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Save Faculty Assignments'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

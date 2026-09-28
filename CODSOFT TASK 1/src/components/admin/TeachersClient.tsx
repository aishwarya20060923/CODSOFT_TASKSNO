'use client';

import { useState } from 'react';
import {
  UserPlus,
  X,
  Phone,
  Mail,
  Award,
  BookOpen,
  CheckCircle2,
  Edit2,
  PlusCircle,
  Search,
  Eye,
  Layers,
  BookMarked,
} from 'lucide-react';
import {
  createTeacher,
  updateTeacherProfile,
  assignTeacherSubject,
  assignTeacherClass,
} from '@/lib/actions';

interface TeacherItem {
  id: string;
  employeeId: string;
  department: string;
  designation: string;
  phone: string | null;
  qualification: string | null;
  user: {
    name: string;
    email: string;
    avatar: string | null;
  };
  classes: {
    id: string;
    name: string;
  }[];
  subjects: {
    id: string;
    name: string;
    code: string;
  }[];
}

interface ClassItem {
  id: string;
  name: string;
  grade?: string | null;
  room?: string | null;
}

interface SubjectItem {
  id: string;
  name: string;
  code: string;
  class?: {
    name: string;
  };
}

const PROFESSOR_PORTRAIT_PRESETS = [
  {
    label: 'Prof. Male 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'Prof. Female 1',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'Prof. Male 2',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'Prof. Female 2',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'Prof. Male 3',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'Prof. Female 3',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  },
];

export default function TeachersClient({
  teachers,
  classes = [],
  subjects = [],
}: {
  teachers: TeacherItem[];
  classes?: ClassItem[];
  subjects?: SubjectItem[];
}) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherItem | null>(null);
  const [assignSubjectTeacher, setAssignSubjectTeacher] = useState<TeacherItem | null>(null);
  const [assignClassTeacher, setAssignClassTeacher] = useState<TeacherItem | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<TeacherItem | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [teacherAvatar, setTeacherAvatar] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const inputStyle = {};
  const inputClass =
    'w-full px-3 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal caret-indigo-600 shadow-2xs transition';

  // Departments list for filter
  const departments = Array.from(new Set(teachers.map((t) => t.department).filter(Boolean)));

  // Filtered teachers
  const filteredTeachers = teachers.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      t.user.name.toLowerCase().includes(q) ||
      t.employeeId.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q) ||
      t.subjects.some((s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));

    const matchesDept = selectedDept === 'ALL' || t.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  // Handle Create Teacher
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    if (teacherAvatar) {
      formData.set('avatar', teacherAvatar);
    }
    const res = await createTeacher(formData);

    setSubmitting(false);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message || 'Teacher appointed successfully!' });
      setTimeout(() => {
        setIsCreateModalOpen(false);
        setTeacherAvatar('');
        setFeedback(null);
      }, 1200);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to appoint teacher' });
    }
  };

  // Handle Edit Teacher
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTeacher) return;
    setSubmitting(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    formData.set('teacherId', editingTeacher.id);
    if (editAvatar) {
      formData.set('avatar', editAvatar);
    }

    const res = await updateTeacherProfile(formData);
    setSubmitting(false);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message || 'Faculty profile updated!' });
      setTimeout(() => {
        setEditingTeacher(null);
        setEditAvatar('');
        setFeedback(null);
      }, 1200);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to update profile' });
    }
  };

  // Handle Assign Subject
  const handleAssignSubject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!assignSubjectTeacher) return;
    setSubmitting(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    formData.set('teacherId', assignSubjectTeacher.id);

    const res = await assignTeacherSubject(formData);
    setSubmitting(false);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message || 'Subject assigned!' });
      setTimeout(() => {
        setAssignSubjectTeacher(null);
        setFeedback(null);
      }, 1200);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to assign subject' });
    }
  };

  // Handle Assign Class
  const handleAssignClass = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!assignClassTeacher) return;
    setSubmitting(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    formData.set('teacherId', assignClassTeacher.id);

    const res = await assignTeacherClass(formData);
    setSubmitting(false);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message || 'Class advisory assigned!' });
      setTimeout(() => {
        setAssignClassTeacher(null);
        setFeedback(null);
      }, 1200);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to assign class' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search, Filter & Action Bar */}
      <div className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search faculty by name, ID, department, or subject..."
              style={inputStyle}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal"
            />
          </div>

          <div className="w-full sm:w-56">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={inputStyle}
              className="w-full px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:border-indigo-600 focus:outline-none"
            >
              <option value="ALL">All Departments ({departments.length})</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => {
            setIsCreateModalOpen(true);
            setTeacherAvatar('');
            setFeedback(null);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Appoint Faculty Member</span>
        </button>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <p>
          Showing <strong className="text-slate-800 dark:text-slate-200">{filteredTeachers.length}</strong> of{' '}
          <strong className="text-slate-800 dark:text-slate-200">{teachers.length}</strong> faculty members
        </p>
      </div>

      {/* Grid of Teachers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeachers.map((t) => (
          <div
            key={t.id}
            className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-3.5 mb-4">
                <img
                  src={
                    t.user.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      t.user.name
                    )}&background=059669&color=ffffff&bold=true&rounded=true`
                  }
                  alt={t.user.name}
                  className="w-13 h-13 rounded-xl object-cover border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">{t.user.name}</h3>
                    <button
                      onClick={() => setViewingTeacher(t)}
                      className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{t.designation}</p>
                  <span className="inline-block mt-1 font-mono text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                    {t.employeeId}
                  </span>
                </div>
              </div>

              <div className="space-y-2 py-3 border-t border-b border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">{t.department}</span>
                </div>
                {t.qualification && (
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span className="truncate">{t.qualification}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span className="truncate">{t.user.email}</span>
                </div>
                {t.phone && (
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span>{t.phone}</span>
                  </div>
                )}
              </div>

              {/* Classes & Subjects Assigned */}
              <div className="mt-3.5 space-y-2.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Class Advisory
                    </span>
                    <button
                      onClick={() => {
                        setAssignClassTeacher(t);
                        setFeedback(null);
                      }}
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-0.5 cursor-pointer"
                    >
                      <PlusCircle className="w-3 h-3" /> Assign
                    </button>
                  </div>
                  {t.classes.length === 0 ? (
                    <span className="text-xs text-slate-400 dark:text-slate-500 italic">No class assigned</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {t.classes.map((c) => (
                        <span
                          key={c.id}
                          className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-100 dark:border-blue-800/60"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Taught Subjects
                    </span>
                    <button
                      onClick={() => {
                        setAssignSubjectTeacher(t);
                        setFeedback(null);
                      }}
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-0.5 cursor-pointer"
                    >
                      <PlusCircle className="w-3 h-3" /> Assign
                    </button>
                  </div>
                  {t.subjects.length === 0 ? (
                    <span className="text-xs text-slate-400 dark:text-slate-500 italic">No subjects assigned</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {t.subjects.map((s) => (
                        <span
                          key={s.id}
                          className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-100 dark:border-emerald-800/60"
                        >
                          {s.name} ({s.code})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setEditingTeacher(t);
                  setEditAvatar(t.user.avatar || '');
                  setFeedback(null);
                }}
                className="flex-1 py-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/60 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Edit2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Edit Profile
              </button>
              <button
                onClick={() => setViewingTeacher(t)}
                className="py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-600 dark:text-slate-300 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: Edit Teacher Profile */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#131d33] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Edit Faculty Profile: {editingTeacher.user.name}
              </h3>
              <button
                onClick={() => {
                  setEditingTeacher(null);
                  setFeedback(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
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

            <form onSubmit={handleUpdate} className="mt-4 space-y-4">
              {/* Photo Input & Presets */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Profile Photo (Formal Portrait URL)
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={
                      editAvatar ||
                      editingTeacher.user.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
                    }
                    alt="Preview"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-indigo-600 shadow-sm shrink-0"
                  />
                  <input
                    type="url"
                    name="avatar"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    placeholder="Paste image URL..."
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PROFESSOR_PORTRAIT_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditAvatar(p.url)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition font-medium cursor-pointer ${
                        editAvatar === p.url
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setEditAvatar('')}
                    className="text-[11px] px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium cursor-pointer"
                  >
                    Clear Preset
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Faculty Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingTeacher.user.name}
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Academic Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    defaultValue={editingTeacher.user.email}
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Employee ID (Read-only)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={editingTeacher.employeeId}
                    style={inputStyle}
                    className={`${inputClass} font-mono cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Academic Department *
                  </label>
                  <input
                    type="text"
                    name="department"
                    required
                    defaultValue={editingTeacher.department}
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Designation</label>
                  <input
                    type="text"
                    name="designation"
                    defaultValue={editingTeacher.designation}
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={editingTeacher.phone || ''}
                    placeholder="+91 98450 12345"
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Highest Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  defaultValue={editingTeacher.qualification || ''}
                  placeholder="e.g. Ph.D. in Computer Science"
                  style={inputStyle}
                  className={inputClass}
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Assign Subject */}
      {assignSubjectTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#131d33] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Assign Subject to Faculty
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{assignSubjectTeacher.user.name}</p>
              </div>
              <button
                onClick={() => setAssignSubjectTeacher(null)}
                className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
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

            <form onSubmit={handleAssignSubject} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Select Subject to Assign
                </label>
                <select
                  name="subjectId"
                  required
                  style={inputStyle}
                  className="w-full px-3 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-indigo-600 focus:outline-none"
                >
                  <option value="">-- Choose Subject --</option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} ({sub.code}) {sub.class ? `• ${sub.class.name}` : ''}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                  Assigning this subject grants the faculty member authorization to record
                  attendance and enter exam marks for this course.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setAssignSubjectTeacher(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Assigning...' : 'Assign Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Assign Class Advisory */}
      {assignClassTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#131d33] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Assign Class Advisory
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{assignClassTeacher.user.name}</p>
              </div>
              <button
                onClick={() => setAssignClassTeacher(null)}
                className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
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

            <form onSubmit={handleAssignClass} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  Select Programs / Classes to Assign
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  {classes.map((cls) => {
                    const isChecked = assignClassTeacher.classes?.some((c) => c.id === cls.id);
                    return (
                      <label key={cls.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition">
                        <input
                          type="checkbox"
                          name="classIds"
                          value={cls.id}
                          defaultChecked={isChecked}
                          className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{cls.name}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{cls.room || 'Room TBA'}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                  Select one or more programs/classes for this faculty member.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setAssignClassTeacher(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Save Program Assignments'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Faculty Details View */}
      {viewingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#131d33] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Faculty Academic Dossier</h3>
              <button
                onClick={() => setViewingTeacher(null)}
                className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={
                    viewingTeacher.user.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      viewingTeacher.user.name
                    )}&background=059669&color=ffffff&bold=true&rounded=true`
                  }
                  alt={viewingTeacher.user.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-600 shadow-md shrink-0"
                />
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">{viewingTeacher.user.name}</h4>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {viewingTeacher.designation}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{viewingTeacher.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                    Employee ID
                  </span>
                  <p className="font-mono font-bold text-slate-800 dark:text-slate-200">{viewingTeacher.employeeId}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                    Academic Email
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {viewingTeacher.user.email}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Phone</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {viewingTeacher.phone || 'Not registered'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                    Qualification
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {viewingTeacher.qualification || 'Not specified'}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-1.5">
                  Assigned Subjects ({viewingTeacher.subjects.length})
                </span>
                {viewingTeacher.subjects.length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic">No subjects currently assigned</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {viewingTeacher.subjects.map((sub) => (
                      <span
                        key={sub.id}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/60"
                      >
                        {sub.name} ({sub.code})
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-1.5">
                  Class Advisory ({viewingTeacher.classes.length})
                </span>
                {viewingTeacher.classes.length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic">No class advisory assigned</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {viewingTeacher.classes.map((cls) => (
                      <span
                        key={cls.id}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800/60"
                      >
                        {cls.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setViewingTeacher(null)}
                  className="px-4 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Appoint Faculty Member */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#131d33] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Appoint Faculty Member
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
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

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              {/* Photo Input & Presets */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Faculty Portrait (Professional Portrait URL)
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={
                      teacherAvatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
                    }
                    alt="Preview"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-indigo-600 shadow-sm shrink-0"
                  />
                  <input
                    type="url"
                    name="avatar"
                    value={teacherAvatar}
                    onChange={(e) => setTeacherAvatar(e.target.value)}
                    placeholder="Paste image URL..."
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PROFESSOR_PORTRAIT_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTeacherAvatar(p.url)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition font-medium cursor-pointer ${
                        teacherAvatar === p.url
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setTeacherAvatar('')}
                    className="text-[11px] px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium cursor-pointer"
                  >
                    Clear Preset
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Faculty Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Dr. Amitabh Sen"
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Academic Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="amitabh.sen@edumanage.edu.in"
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    required
                    placeholder="EMP-CS-104"
                    style={inputStyle}
                    className={`${inputClass} font-mono`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Academic Department *
                  </label>
                  <input
                    type="text"
                    name="department"
                    required
                    placeholder="e.g. Computer Science & AI"
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Designation</label>
                  <input
                    type="text"
                    name="designation"
                    placeholder="e.g. Professor & HOD"
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+91 98450 12345"
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Highest Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  placeholder="e.g. Ph.D. in Computer Science (IIT Bombay)"
                  style={inputStyle}
                  className={inputClass}
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Appointing...' : 'Appoint Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  Search,
  UserPlus,
  X,
  Filter,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Edit2,
  Camera,
  Check,
} from 'lucide-react';
import { createStudent, updateStudentProfile } from '@/lib/actions';

interface StudentItem {
  id: string;
  rollNumber: string;
  gender: string;
  phone: string | null;
  parentName: string | null;
  parentPhone: string | null;
  address: string | null;
  user: {
    name: string;
    email: string;
    avatar: string | null;
  };
  class: {
    id: string;
    name: string;
  };
}

interface ClassItem {
  id: string;
  name: string;
}

const FORMAL_AVATAR_PRESETS = [
  {
    label: 'Formal Male 1',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'Formal Female 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'Formal Male 2',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'Formal Female 2',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'Formal Male 3',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'Formal Female 3',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
  },
];

export default function StudentsClient({
  students,
  classes,
}: {
  students: StudentItem[];
  classes: ClassItem[];
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [enrollAvatar, setEnrollAvatar] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'ALL' || s.class.id === selectedClass;
    return matchesSearch && matchesClass;
  });

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    if (enrollAvatar) {
      formData.set('avatar', enrollAvatar);
    }
    const res = await createStudent(formData);

    setSubmitting(false);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message || 'Student enrolled successfully!' });
      setTimeout(() => {
        setIsModalOpen(false);
        setEnrollAvatar('');
        setFeedback(null);
      }, 1200);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to enroll student' });
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingStudent) return;
    setSubmitting(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    formData.set('studentId', editingStudent.id);
    if (editAvatar) {
      formData.set('avatar', editAvatar);
    }
    const res = await updateStudentProfile(formData);

    setSubmitting(false);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message || 'Student updated successfully!' });
      setTimeout(() => {
        setEditingStudent(null);
        setEditAvatar('');
        setFeedback(null);
      }, 1200);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to update student' });
    }
  };

  const inputStyle = {};
  const inputClass =
    'w-full px-3 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal caret-blue-600 shadow-2xs transition';

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 w-full sm:w-auto items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by student name, roll no, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={inputStyle}
              className="w-full pl-10 pr-4 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 shadow-2xs placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal"
            />
          </div>

          {/* Class Filter */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:inline pointer-events-none" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={inputStyle}
              className="py-2 px-3 text-sm font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 shadow-2xs cursor-pointer"
            >
              <option value="ALL">All Programs</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Enroll Student Button */}
        <button
          onClick={() => {
            setIsModalOpen(true);
            setEnrollAvatar('');
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Enroll New Student</span>
        </button>
      </div>

      {/* Student Cards / Table */}
      <div className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredStudents.length}</strong> of{' '}
            {students.length} students
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3">Student Name</th>
                <th className="px-5 py-3">Roll Number</th>
                <th className="px-5 py-3">Class Enrolled</th>
                <th className="px-5 py-3">Gender</th>
                <th className="px-5 py-3">Parent Info</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400 dark:text-slate-500">
                    No students match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            s.user.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              s.user.name
                            )}&background=4f46e5&color=ffffff&bold=true&rounded=true`
                          }
                          alt={s.user.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{s.user.name}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {s.user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-blue-700 dark:text-blue-400">
                      {s.rollNumber}
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/60">
                        {s.class.name}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600 dark:text-slate-300">{s.gender}</td>
                    <td className="px-5 py-4 text-xs">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{s.parentName || '—'}</p>
                      <p className="text-slate-400 dark:text-slate-500">{s.parentPhone || ''}</p>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600 dark:text-slate-300">
                      {s.phone ? (
                        <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                          <Phone className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                          {s.phone}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingStudent(s);
                          setEditAvatar(s.user.avatar || '');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800/60 rounded-lg transition cursor-pointer"
                        title="Edit Student Profile & Photo"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Enroll New Student */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#131d33] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Enroll New Student
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
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
              {/* Photo Preset & Custom URL */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Profile Photo (Professional Formals / Custom URL)
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={
                      enrollAvatar ||
                      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80'
                    }
                    alt="Preview"
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-600 shadow-sm shrink-0"
                  />
                  <input
                    type="url"
                    name="avatar"
                    value={enrollAvatar}
                    onChange={(e) => setEnrollAvatar(e.target.value)}
                    placeholder="Paste image URL (or select preset below)..."
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1.5">
                    Or select a formal student preset:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {FORMAL_AVATAR_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEnrollAvatar(p.url)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition font-medium cursor-pointer ${
                          enrollAvatar === p.url
                            ? 'bg-blue-600 text-white border-blue-600 font-bold'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setEnrollAvatar('')}
                      className="text-[11px] px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium cursor-pointer"
                    >
                      Clear / Initial Monogram
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Aditya Kulkarni"
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="aditya@student.edumanage.edu.in"
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    required
                    placeholder="STU-2026-007"
                    style={inputStyle}
                    className={`${inputClass} font-mono`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Class Assignment *
                  </label>
                  <select name="classId" required style={inputStyle} className={inputClass}>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Gender</label>
                  <select name="gender" style={inputStyle} className={inputClass}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Student Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+91 98765 43210"
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Guardian / Parent Name
                  </label>
                  <input
                    type="text"
                    name="parentName"
                    placeholder="e.g. Ramesh Kulkarni"
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Guardian Phone
                  </label>
                  <input
                    type="text"
                    name="parentPhone"
                    placeholder="+91 98111 22334"
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Flat 101, Model Colony, Pune, Maharashtra"
                  style={inputStyle}
                  className={inputClass}
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Enrolling...' : 'Complete Enrollment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Edit Existing Student Profile & Photo */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#131d33] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Edit Student Profile & Photo
              </h3>
              <button
                onClick={() => setEditingStudent(null)}
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
              {/* Photo Preview & Edit */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Profile Photo (Formal Wear / Custom URL)
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={
                      editAvatar ||
                      editingStudent.user.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        editingStudent.user.name
                      )}&background=4f46e5&color=ffffff&bold=true`
                    }
                    alt="Current Avatar"
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-600 shadow-sm shrink-0"
                  />
                  <input
                    type="url"
                    name="avatar"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    placeholder="Enter image URL..."
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-1.5">
                    Or select a formal student portrait preset:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {FORMAL_AVATAR_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditAvatar(p.url)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition font-medium cursor-pointer ${
                          editAvatar === p.url
                            ? 'bg-blue-600 text-white border-blue-600 font-bold'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500'
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
                      Clear / Initial Monogram
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingStudent.user.name}
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    defaultValue={editingStudent.user.email}
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Roll Number *
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    required
                    defaultValue={editingStudent.rollNumber}
                    style={inputStyle}
                    className={`${inputClass} font-mono`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Class Assignment *
                  </label>
                  <select
                    name="classId"
                    required
                    defaultValue={editingStudent.class.id}
                    style={inputStyle}
                    className={inputClass}
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={editingStudent.phone || ''}
                    placeholder="+91 98765 43210"
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Guardian Name
                  </label>
                  <input
                    type="text"
                    name="parentName"
                    defaultValue={editingStudent.parentName || ''}
                    placeholder="Guardian Name"
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Guardian Phone
                  </label>
                  <input
                    type="text"
                    name="parentPhone"
                    defaultValue={editingStudent.parentPhone || ''}
                    placeholder="+91 98111 22334"
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    defaultValue={editingStudent.address || ''}
                    placeholder="Residential address"
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

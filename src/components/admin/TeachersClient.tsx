'use client';

import { useState } from 'react';
import { UserPlus, X, Phone, Mail, Award, BookOpen, CheckCircle2 } from 'lucide-react';
import { createTeacher } from '@/lib/actions';

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

export default function TeachersClient({ teachers }: { teachers: TeacherItem[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    const res = await createTeacher(formData);

    setSubmitting(false);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message || 'Teacher appointed successfully!' });
      setTimeout(() => {
        setIsModalOpen(false);
        setFeedback(null);
      }, 1200);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to appoint teacher' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Showing <strong className="text-slate-800">{teachers.length}</strong> active faculty
          members
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Appoint Faculty Member</span>
        </button>
      </div>

      {/* Grid of Teachers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {teachers.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-3.5 mb-4">
                <img
                  src={
                    t.user.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.user.name}`
                  }
                  alt={t.user.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-100"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{t.user.name}</h3>
                  <p className="text-xs font-semibold text-indigo-600">{t.designation}</p>
                  <span className="inline-block mt-1 font-mono text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                    {t.employeeId}
                  </span>
                </div>
              </div>

              <div className="space-y-2 py-3 border-t border-b border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-800">{t.department}</span>
                </div>
                {t.qualification && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{t.qualification}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{t.user.email}</span>
                </div>
                {t.phone && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{t.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Assigned Courses / Classes */}
            <div className="mt-4 pt-2">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Assigned Classes & Subjects
              </p>
              <div className="flex flex-wrap gap-1.5">
                {t.classes.length === 0 && t.subjects.length === 0 ? (
                  <span className="text-xs text-slate-400">No active teaching assignments</span>
                ) : (
                  <>
                    {t.classes.map((c) => (
                      <span
                        key={c.id}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium border border-blue-100"
                      >
                        {c.name}
                      </span>
                    ))}
                    {t.subjects.map((sub) => (
                      <span
                        key={sub.id}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium border border-emerald-100"
                      >
                        {sub.name}
                      </span>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Appoint Faculty */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600" />
                Appoint New Faculty Member
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
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

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Faculty Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Dr. Arthur Vance"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Academic Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="vance@edumanage.edu"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    required
                    placeholder="EMP-FAC-205"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Academic Department *
                  </label>
                  <input
                    type="text"
                    name="department"
                    required
                    placeholder="e.g. Physics & Computer Science"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    placeholder="e.g. Associate Professor"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+1 (555) 888-9900"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Highest Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  placeholder="e.g. Ph.D. in Computer Science (MIT)"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  {submitting ? 'Registering...' : 'Appoint Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

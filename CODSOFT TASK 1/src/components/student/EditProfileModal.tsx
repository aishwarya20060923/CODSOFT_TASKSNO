'use client';

import { useState } from 'react';
import { Camera, Edit2, X, CheckCircle2, Phone, MapPin, User, Check } from 'lucide-react';
import { updateStudentProfile } from '@/lib/actions';

interface StudentInfo {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  avatar: string | null;
  phone: string | null;
  parentName: string | null;
  parentPhone: string | null;
  address: string | null;
  className: string;
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

export default function EditProfileModal({ student }: { student: StudentInfo }) {
  const [isOpen, setIsOpen] = useState(false);
  const [avatar, setAvatar] = useState(student.avatar || '');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    formData.set('studentId', student.id);
    if (avatar) {
      formData.set('avatar', avatar);
    }
    const res = await updateStudentProfile(formData);

    setSubmitting(false);
    if (res.success) {
      setFeedback({
        type: 'success',
        message: res.message || 'Profile and photo updated successfully!',
      });
      setTimeout(() => {
        setIsOpen(false);
        setFeedback(null);
        window.location.reload();
      }, 1200);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to update profile' });
    }
  };

  const inputClass =
    'w-full px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-500/20 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 caret-purple-600 shadow-2xs transition';

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setAvatar(student.avatar || '');
        }}
        className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold border border-white/20 backdrop-blur transition flex items-center gap-1.5 cursor-pointer"
        title="Edit Profile & Photo"
      >
        <Camera className="w-4 h-4 text-purple-200" />
        <span>Edit Profile & Photo</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[#131d33] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Edit Profile & Photo
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Update your formal portrait and personal contact information
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div
                className={`mt-4 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-left">
              {/* Profile Photo Preview & Preset Picker */}
              <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 space-y-3">
                <label className="block text-xs font-bold text-purple-900 dark:text-purple-200">
                  Profile Photo (Formal Wear / Image URL)
                </label>
                <div className="flex items-center gap-3.5">
                  <img
                    src={
                      avatar ||
                      student.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        student.name
                      )}&background=6366f1&color=ffffff&bold=true`
                    }
                    alt={student.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-600 shadow-md shrink-0"
                  />
                  <div className="flex-1">
                    <input
                      type="url"
                      name="avatar"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="Paste image URL..."
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-purple-800 dark:text-purple-300 font-medium block mb-1.5">
                    Or choose from professional student portraits:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {FORMAL_AVATAR_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(p.url)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition font-medium cursor-pointer ${
                          avatar === p.url
                            ? 'bg-purple-600 text-white border-purple-600 font-bold'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-purple-200 dark:border-purple-800 hover:border-purple-400'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setAvatar('')}
                      className="text-[11px] px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium cursor-pointer"
                    >
                      Clear / Initial Monogram
                    </button>
                  </div>
                </div>
              </div>

              {/* Readonly Academic Info */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-medium block">Roll Number</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{student.rollNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-medium block">Enrolled Class</span>
                  <span className="font-bold text-slate-900 dark:text-white">{student.className}</span>
                </div>
              </div>

              {/* Editable Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={student.name}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    defaultValue={student.email}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Student Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={student.phone || ''}
                    placeholder="+91 98201 12345"
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
                    defaultValue={student.parentName || ''}
                    placeholder="Guardian Name"
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
                  defaultValue={student.address || ''}
                  placeholder="Full home address"
                  className={inputClass}
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving Profile...' : 'Save Profile & Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

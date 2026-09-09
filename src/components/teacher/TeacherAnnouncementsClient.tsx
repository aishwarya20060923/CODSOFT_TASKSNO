'use client';

import { useState } from 'react';
import { Bell, Plus, Calendar, CheckCircle2, X, AlertCircle, Tag } from 'lucide-react';
import { createAnnouncement } from '@/lib/actions';

interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  category: string;
  authorName: string;
  createdAt: Date;
}

export default function TeacherAnnouncementsClient({
  announcements,
}: {
  announcements: AnnouncementItem[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    const res = await createAnnouncement(formData);

    setSubmitting(false);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message || 'Announcement published successfully!' });
      setTimeout(() => {
        setIsModalOpen(false);
        setFeedback(null);
      }, 1200);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to publish announcement' });
    }
  };

  const inputClass =
    'w-full px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-emerald-600 focus:outline-none transition shadow-2xs placeholder:text-slate-400 dark:placeholder:text-slate-500';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Academic & Department Announcements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Publish notices, exam schedules, and department circulars visible to students.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post Announcement</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {announcements.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center">
            <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Announcements Published</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              You haven&apos;t posted any announcements yet. Click &quot;Post Announcement&quot; to publish one.
            </p>
          </div>
        ) : (
          announcements.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-100 dark:border-emerald-800 uppercase">
                    {item.category}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 text-xs">
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base mt-2">{item.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {item.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                <span>Author:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{item.authorName}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#131d33] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Post Department Announcement</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div
                className={`mt-3 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Category *
                </label>
                <select name="category" required className={inputClass}>
                  <option value="ACADEMIC" className="dark:bg-slate-800 dark:text-white">Academic</option>
                  <option value="EXAM" className="dark:bg-slate-800 dark:text-white">Examination</option>
                  <option value="GENERAL" className="dark:bg-slate-800 dark:text-white">General Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g., Mid-Term Examination Guidelines"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Announcement Content *
                </label>
                <textarea
                  name="content"
                  required
                  rows={4}
                  placeholder="Write the full announcement details..."
                  className={inputClass}
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Publishing...' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

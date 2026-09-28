'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Eye,
  EyeOff,
  LogIn,
  BookOpen,
  Briefcase,
} from 'lucide-react';
import { loginTeacherAction, loginTeacherDirectAction } from '@/lib/auth-actions';

export interface DemoTeacher {
  employeeId: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  avatar: string | null;
  subjects: string[];
}

interface Props {
  demoTeachers: DemoTeacher[];
  activeEmployeeId?: string | null;
}

export default function TeacherLoginClient({ demoTeachers, activeEmployeeId }: Props) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [directLoadingId, setDirectLoadingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('identifier', identifier.trim());
    formData.append('password', password);

    try {
      const res = await loginTeacherAction(formData);
      if (res && !res.success) {
        setError(res.error || 'Invalid faculty credentials');
        setLoading(false);
      }
    } catch (err: any) {
      if (err?.message?.includes('NEXT_REDIRECT')) {
        return;
      }
      setError('An error occurred during teacher authentication. Please try again.');
      setLoading(false);
    }
  };

  const handleQuickFill = (teacher: DemoTeacher) => {
    setIdentifier(teacher.employeeId);
    setPassword('teacher123');
    setError(null);
  };

  const handleDirectLogin = async (employeeId: string) => {
    setError(null);
    setDirectLoadingId(employeeId);
    try {
      await loginTeacherDirectAction(employeeId);
    } catch (err: any) {
      if (err?.message?.includes('NEXT_REDIRECT')) {
        return;
      }
      setError('Failed to log in directly. Please try again.');
      setDirectLoadingId(null);
    }
  };

  const activeTeacher = demoTeachers.find((t) => t.employeeId === activeEmployeeId);

  const inputStyle = {};
  const inputClass =
    'w-full pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/20 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal caret-emerald-600 shadow-2xs transition';

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-10 px-4 relative z-10">
      <div className="w-full max-w-4xl space-y-6">
        {/* Active Session Notice Banner */}
        {activeTeacher && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-200 dark:border-emerald-800/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-900 dark:text-emerald-200">
            <div className="flex items-center gap-3">
              <img
                src={
                  activeTeacher.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    activeTeacher.name
                  )}&background=047857&color=ffffff&bold=true`
                }
                alt={activeTeacher.name}
                className="w-11 h-11 rounded-xl object-cover border-2 border-emerald-300 dark:border-emerald-700 shadow-xs shrink-0"
              />
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400 block">
                  Active Faculty Session
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Logged in as {activeTeacher.name}{' '}
                  <span className="text-emerald-700 dark:text-emerald-400 text-xs font-mono">
                    ({activeTeacher.employeeId})
                  </span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeTeacher.designation} • {activeTeacher.department}
                </p>
              </div>
            </div>
            <Link
              href="/teacher/dashboard"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>Go to Teacher Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Login Form Box */}
          <div className="lg:col-span-6 bg-white dark:bg-[#131d33] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-md shadow-emerald-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Teacher Portal Login</h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Access your assigned subjects, student cohorts, and daily attendance register.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Employee ID / Faculty Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. EMP-MATH-101 or rajesh.sharma@edumanage.edu.in"
                    style={inputStyle}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (demo: teacher123)"
                    style={inputStyle}
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Sign In as Teacher</span>
                      <LogIn className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 text-center text-xs text-slate-400 dark:text-slate-500">
                Demo password for all faculty accounts:{' '}
                <code className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono px-1.5 py-0.5 rounded font-bold">
                  teacher123
                </code>
              </div>
            </form>
          </div>

          {/* 1-Click Demo Teacher Accounts */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900 dark:bg-[#131d33] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-300">
                  Role-Based Demo Accounts
                </span>
              </div>
              <h2 className="text-lg font-bold">Select a Demo Teacher to Log In</h2>
              <p className="text-xs text-slate-300 mt-1">
                Each teacher has their own assigned subjects and cohorts. Click below to test individual role-based access.
              </p>

              <div className="mt-5 space-y-3">
                {demoTeachers.map((t) => {
                  const isActive = t.employeeId === activeEmployeeId;
                  const isDirectLoading = directLoadingId === t.employeeId;

                  return (
                    <div
                      key={t.employeeId}
                      className={`p-3.5 rounded-2xl transition border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-emerald-950/80 border-emerald-500 shadow-sm'
                          : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700/80'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <img
                          src={
                            t.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              t.name
                            )}&background=047857&color=ffffff&bold=true`
                          }
                          alt={t.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-slate-600 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-white text-sm truncate">{t.name}</h3>
                            {isActive && (
                              <span className="px-1.5 py-0.2 bg-emerald-500 text-slate-950 font-extrabold text-[10px] rounded-sm">
                                CURRENT
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-emerald-400 font-medium">
                            {t.department} •{' '}
                            <span className="font-mono text-slate-400">{t.employeeId}</span>
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {t.subjects.map((sub, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-slate-200 font-semibold"
                              >
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleQuickFill(t)}
                          className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition cursor-pointer"
                          title="Fill credentials into form"
                        >
                          Quick Fill
                        </button>
                        <button
                          type="button"
                          disabled={isDirectLoading}
                          onClick={() => handleDirectLogin(t.employeeId)}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          {isDirectLoading ? (
                            <span>Logging in...</span>
                          ) : (
                            <>
                              <span>Log In</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

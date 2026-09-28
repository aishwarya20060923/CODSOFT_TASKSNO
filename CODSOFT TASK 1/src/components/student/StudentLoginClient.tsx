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
} from 'lucide-react';
import { loginStudentAction, loginStudentDirectAction } from '@/lib/auth-actions';

interface DemoStudent {
  rollNumber: string;
  name: string;
  email: string;
  avatar: string | null;
  tag: string;
}

interface Props {
  demoStudents: DemoStudent[];
  activeRoll?: string | null;
}

export default function StudentLoginClient({ demoStudents, activeRoll }: Props) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [directLoadingRoll, setDirectLoadingRoll] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('identifier', identifier.trim());
    formData.append('password', password);

    try {
      const res = await loginStudentAction(formData);
      if (res && !res.success) {
        setError(res.error || 'Invalid credentials');
        setLoading(false);
      }
    } catch (err: any) {
      if (err?.message?.includes('NEXT_REDIRECT')) {
        return;
      }
      setError('An error occurred during authentication. Please try again.');
      setLoading(false);
    }
  };

  const handleQuickFill = (student: DemoStudent) => {
    setIdentifier(student.rollNumber);
    setPassword('student123');
    setError(null);
  };

  const handleDirectLogin = async (rollNumber: string) => {
    setError(null);
    setDirectLoadingRoll(rollNumber);
    try {
      await loginStudentDirectAction(rollNumber);
    } catch (err: any) {
      if (err?.message?.includes('NEXT_REDIRECT')) {
        return;
      }
      setError('Failed to log in directly. Please try again.');
      setDirectLoadingRoll(null);
    }
  };

  const activeStudent = demoStudents.find((s) => s.rollNumber === activeRoll);

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-10 px-4 relative z-10">
      <div className="w-full max-w-4xl space-y-6">
        {/* Active Session Notice Banner if already logged in */}
        {activeStudent && (
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border-2 border-purple-200 dark:border-purple-800/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-purple-900 dark:text-purple-200">
            <div className="flex items-center gap-3">
              <img
                src={
                  activeStudent.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    activeStudent.name
                  )}`
                }
                alt={activeStudent.name}
                className="w-10 h-10 rounded-full border border-purple-300 dark:border-purple-700"
              />
              <div>
                <p className="text-xs font-semibold text-purple-700 dark:text-purple-300">Currently Active Student</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {activeStudent.name}{' '}
                  <span className="font-mono text-purple-700 dark:text-purple-300 font-semibold text-xs">
                    ({activeStudent.rollNumber})
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/student/dashboard"
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left column: Login Box */}
          <div className="lg:col-span-6 bg-white dark:bg-[#131d33] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xl relative z-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-slate-900 dark:text-white">Student Portal</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300">
                    Authentication
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Sign in to access your personal academic records</p>
              </div>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="student-identifier"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 cursor-pointer"
                >
                  Roll Number or Student Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none select-none z-10" />
                  <input
                    id="student-identifier"
                    name="identifier"
                    type="text"
                    required
                    autoComplete="username"
                    spellCheck={false}
                    placeholder="e.g. STU-2026-001 or aarav.sharma@..."
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (error) setError(null);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-500/20 focus:outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal caret-purple-600 shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="student-password"
                    className="text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    Password
                  </label>
                  <span className="text-[11px] text-purple-700 dark:text-purple-300 font-bold bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800/80">
                    Demo: student123
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none select-none z-10" />
                  <input
                    id="student-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Enter demo password..."
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    className="w-full pl-10 pr-11 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-purple-600 focus:ring-4 focus:ring-purple-500/20 focus:outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal caret-purple-600 shadow-2xs"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer z-10"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || directLoadingRoll !== null}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Student Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Helper note */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <KeyRound className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>Universal password for all demo accounts: </span>
              <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-purple-700 dark:text-purple-300 font-bold font-mono">
                student123
              </code>
            </div>
          </div>

          {/* Right column: 1-Click Demo Accounts Picker */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Demo Accounts Fast Fill & Sign-In</h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">6 Enrolled Students</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Click a card to fill the login form, or click{' '}
              <strong className="text-purple-700 dark:text-purple-400 font-semibold">1-Click Sign In</strong> to log in
              instantly:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {demoStudents.map((s) => {
                const isSelected = identifier === s.rollNumber;
                const isDirectLoading = directLoadingRoll === s.rollNumber;

                return (
                  <div
                    key={s.rollNumber}
                    className={`p-3.5 rounded-2xl border transition flex flex-col justify-between group ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131d33] hover:border-purple-300 dark:hover:border-purple-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div
                      onClick={() => handleQuickFill(s)}
                      className="flex items-start gap-3 cursor-pointer"
                      title="Click to fill credentials"
                    >
                      <img
                        src={
                          s.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                            s.name
                          )}`
                        }
                        alt={s.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-purple-700 dark:group-hover:text-purple-300">
                            {s.name}
                          </p>
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                          )}
                        </div>
                        <p className="font-mono text-[11px] text-blue-700 dark:text-blue-400 font-semibold mt-0.5">
                          {s.rollNumber}
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {s.tag}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickFill(s)}
                        className="text-[11px] text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold cursor-pointer"
                      >
                        Fill Form
                      </button>
                      <button
                        type="button"
                        disabled={isDirectLoading || loading}
                        onClick={() => handleDirectLogin(s.rollNumber)}
                        className="px-2.5 py-1 text-[11px] font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-2xs transition flex items-center gap-1 cursor-pointer disabled:opacity-60"
                      >
                        <LogIn className="w-3 h-3" />
                        <span>{isDirectLoading ? 'Signing in...' : '1-Click Sign In'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/60 text-xs text-purple-900 dark:text-purple-200 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <span>🔒 Role-Based Data Isolation</span>
              </p>
              <p className="text-[11px] text-purple-800/80 dark:text-purple-300/80 leading-relaxed">
                Each student sees strictly their own records. Rohan Verma has medical leaves and
                partial fees, Arjun Reddy has tardiness logs and overdue dues, and Aarav Sharma has
                merit grades.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

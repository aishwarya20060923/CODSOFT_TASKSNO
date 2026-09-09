'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CreditCard,
  Building2,
  CalendarCheck,
  FileSpreadsheet,
  Award,
  Receipt,
  User,
  LogOut,
  BookOpen,
} from 'lucide-react';
import { logoutStudentAction, logoutTeacherAction } from '@/lib/auth-actions';

interface LoggedInStudent {
  name: string;
  rollNumber: string;
  avatar?: string | null;
  className?: string;
}

interface LoggedInTeacher {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  avatar?: string | null;
  department: string;
  designation: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentStudent, setCurrentStudent] = useState<LoggedInStudent | null>(null);
  const [currentTeacher, setCurrentTeacher] = useState<LoggedInTeacher | null>(null);

  const getRole = () => {
    if (pathname.startsWith('/admin')) return 'admin';
    if (pathname.startsWith('/teacher')) return 'teacher';
    if (pathname.startsWith('/student')) return 'student';
    return null;
  };

  const role = getRole();

  useEffect(() => {
    if (role === 'student' && pathname !== '/student/login') {
      fetch('/api/student/me')
        .then((res) => res.json())
        .then((data) => {
          if (data?.authenticated && data.student) {
            setCurrentStudent(data.student);
          }
        })
        .catch(() => {});
    } else if (role === 'teacher' && pathname !== '/teacher/login') {
      fetch('/api/teacher/me')
        .then((res) => res.json())
        .then((data) => {
          if (data?.authenticated && data.teacher) {
            setCurrentTeacher(data.teacher);
          }
        })
        .catch(() => {});
    }
  }, [role, pathname]);

  // Hide sidebar completely on student or teacher login screens
  if (!role || pathname === '/student/login' || pathname === '/teacher/login') return null;

  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Students Directory', href: '/admin/students', icon: Users },
    { name: 'Faculty & Teachers', href: '/admin/teachers', icon: GraduationCap },
    { name: 'Classes & Subjects', href: '/admin/classes', icon: Building2 },
    { name: 'Fee Management', href: '/admin/fees', icon: CreditCard },
  ];

  const teacherLinks = [
    { name: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
    { name: 'Mark Attendance', href: '/teacher/attendance', icon: CalendarCheck },
    { name: 'My Students', href: '/teacher/students', icon: Users },
    { name: 'Enter Marks', href: '/teacher/exams', icon: FileSpreadsheet },
    { name: 'Assignments', href: '/teacher/assignments', icon: BookOpen },
    { name: 'Announcements', href: '/teacher/announcements', icon: Award },
    { name: 'Faculty Directory', href: '/teacher/faculty', icon: GraduationCap },
  ];

  const studentLinks = [
    { name: 'Student Portal', href: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Attendance Record', href: '/student/attendance', icon: CalendarCheck },
    { name: 'Grades & Report Card', href: '/student/results', icon: Award },
    { name: 'Fees & Invoices', href: '/student/fees', icon: Receipt },
  ];

  const links =
    role === 'admin' ? adminLinks : role === 'teacher' ? teacherLinks : studentLinks;

  const studentSubtitle = currentStudent
    ? `${currentStudent.name} (${currentStudent.rollNumber})`
    : 'Student Account';

  const teacherSubtitle = currentTeacher
    ? `${currentTeacher.name} (${currentTeacher.department})`
    : 'Faculty Account';

  const roleMeta = {
    admin: {
      title: 'Administrator',
      subtitle: 'Dr. Anandita Verma',
      badge: 'Admin Access',
      badgeColor: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    },
    teacher: {
      title: currentTeacher ? currentTeacher.designation : 'Faculty Portal',
      subtitle: teacherSubtitle,
      badge: 'Teacher Access',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    },
    student: {
      title: currentStudent?.className ? `Class: ${currentStudent.className}` : 'Student Portal',
      subtitle: studentSubtitle,
      badge: 'Student Access',
      badgeColor: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    },
  }[role];

  const handleStudentLogout = async () => {
    await logoutStudentAction();
  };

  const handleTeacherLogout = async () => {
    await logoutTeacherAction();
  };

  return (
    <aside className="w-64 bg-white dark:bg-[#131d33] border-r border-slate-200 dark:border-slate-800 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0 transition-colors">
      <div>
        {/* Profile Card Header */}
        <div className="p-3.5 mb-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${roleMeta.badgeColor}`}>
              {roleMeta.badge}
            </span>
            {role === 'student' && (
              <button
                type="button"
                onClick={handleStudentLogout}
                title="Log out"
                className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Exit</span>
              </button>
            )}
            {role === 'teacher' && (
              <button
                type="button"
                onClick={handleTeacherLogout}
                title="Log out"
                className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Exit</span>
              </button>
            )}
          </div>
          <p className="font-semibold text-sm text-slate-900 dark:text-white truncate" title={roleMeta.subtitle}>
            {roleMeta.subtitle}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{roleMeta.title}</p>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            const isTeacher = role === 'teacher';
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? isTeacher
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold border-l-4 border-emerald-600 pl-2.5 shadow-2xs'
                      : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold border-l-4 border-blue-600 pl-2.5 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? isTeacher
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Role Actions */}
      <div className="space-y-2">
        {role === 'student' && (
          <div className="p-2.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-purple-900 dark:text-purple-200">Student Account</span>
              <span className="font-mono text-[10px] text-purple-700 dark:text-purple-300 font-bold">
                {currentStudent?.rollNumber || ''}
              </span>
            </div>
            <button
              type="button"
              onClick={handleStudentLogout}
              className="w-full mt-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-purple-200 dark:border-purple-800/60 hover:border-rose-200 dark:hover:border-rose-800 transition shadow-2xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out / Switch Student</span>
            </button>
          </div>
        )}

        {role === 'teacher' && (
          <div className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-emerald-900 dark:text-emerald-200">Faculty Account</span>
              <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">
                {currentTeacher?.employeeId || ''}
              </span>
            </div>
            <button
              type="button"
              onClick={handleTeacherLogout}
              className="w-full mt-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-emerald-200 dark:border-emerald-800/60 hover:border-rose-200 dark:hover:border-rose-800 transition shadow-2xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out / Switch Teacher</span>
            </button>
          </div>
        )}

        <div className="p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100/80 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200">
          <p className="font-semibold flex items-center gap-1.5 mb-0.5">
            <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Active Session
          </p>
          <p className="text-[11px] text-blue-700/90 dark:text-blue-300/80 leading-relaxed">
            Switch roles anytime via the top bar for your LinkedIn demonstration video.
          </p>
        </div>
      </div>
    </aside>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const getRole = () => {
    if (pathname.startsWith('/admin')) return 'admin';
    if (pathname.startsWith('/teacher')) return 'teacher';
    if (pathname.startsWith('/student')) return 'student';
    return null;
  };

  const role = getRole();
  if (!role) return null;

  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Students Directory', href: '/admin/students', icon: Users },
    { name: 'Faculty & Teachers', href: '/admin/teachers', icon: GraduationCap },
    { name: 'Classes & Subjects', href: '/admin/classes', icon: Building2 },
    { name: 'Fee Management', href: '/admin/fees', icon: CreditCard },
  ];

  const teacherLinks = [
    { name: 'Teacher Overview', href: '/teacher/dashboard', icon: LayoutDashboard },
    { name: 'Daily Attendance', href: '/teacher/attendance', icon: CalendarCheck },
    { name: 'Exams & Gradebook', href: '/teacher/exams', icon: FileSpreadsheet },
  ];

  const studentLinks = [
    { name: 'Student Portal', href: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Attendance Record', href: '/student/attendance', icon: CalendarCheck },
    { name: 'Grades & Report Card', href: '/student/results', icon: Award },
    { name: 'Fees & Invoices', href: '/student/fees', icon: Receipt },
  ];

  const links =
    role === 'admin' ? adminLinks : role === 'teacher' ? teacherLinks : studentLinks;

  const roleMeta = {
    admin: {
      title: 'Administrator',
      subtitle: 'Dr. Anandita Verma',
      badge: 'Admin Access',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    },
    teacher: {
      title: 'Faculty Portal',
      subtitle: 'Prof. Rajesh Sharma (Math)',
      badge: 'Teacher Access',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    student: {
      title: 'Student Portal',
      subtitle: 'Aarav Sharma (STU-001)',
      badge: 'Student Access',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    },
  }[role];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0">
      <div>
        {/* Profile Card Header */}
        <div className="p-3.5 mb-5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${roleMeta.badgeColor}`}>
              {roleMeta.badge}
            </span>
          </div>
          <p className="font-semibold text-sm text-slate-900 truncate">{roleMeta.subtitle}</p>
          <p className="text-xs text-slate-500">{roleMeta.title}</p>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600 pl-2.5 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100/80 text-xs text-blue-900">
        <p className="font-semibold flex items-center gap-1.5 mb-0.5">
          <User className="w-3.5 h-3.5 text-blue-600" />
          Active Session
        </p>
        <p className="text-[11px] text-blue-700/90 leading-relaxed">
          Switch roles anytime via the top bar for your LinkedIn demonstration video.
        </p>
      </div>
    </aside>
  );
}

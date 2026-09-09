'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Award,
  Building2,
  Users,
  Briefcase,
  ExternalLink,
} from 'lucide-react';

export interface TeacherDirectoryItem {
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
    grade: string;
    section: string;
  }[];
  subjects: {
    id: string;
    name: string;
    code: string;
  }[];
}

export default function TeacherFacultyClient({
  faculty,
}: {
  faculty: TeacherDirectoryItem[];
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  // Extract unique departments
  const departments = useMemo(() => {
    const set = new Set<string>();
    faculty.forEach((f) => {
      if (f.department) set.add(f.department);
    });
    return ['ALL', ...Array.from(set)];
  }, [faculty]);

  // Filtered faculty list
  const filteredFaculty = useMemo(() => {
    return faculty.filter((member) => {
      const matchesDept = selectedDept === 'ALL' || member.department === selectedDept;
      const searchLower = searchTerm.toLowerCase().trim();
      if (!searchLower) return matchesDept;

      const matchesName = member.user.name.toLowerCase().includes(searchLower);
      const matchesEmpId = member.employeeId.toLowerCase().includes(searchLower);
      const matchesDeptName = member.department.toLowerCase().includes(searchLower);
      const matchesDesignation = member.designation.toLowerCase().includes(searchLower);
      const matchesSubject = member.subjects.some((s) =>
        s.name.toLowerCase().includes(searchLower) || s.code.toLowerCase().includes(searchLower)
      );
      const matchesClass = member.classes.some((c) =>
        c.name.toLowerCase().includes(searchLower)
      );

      return (
        matchesDept &&
        (matchesName || matchesEmpId || matchesDeptName || matchesDesignation || matchesSubject || matchesClass)
      );
    });
  }, [faculty, searchTerm, selectedDept]);

  // Department counts
  const totalClassesAdvisory = faculty.reduce((acc, f) => acc + f.classes.length, 0);
  const totalSubjectsTaught = faculty.reduce((acc, f) => acc + f.subjects.length, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold px-3 py-1 bg-white/10 backdrop-blur rounded-full text-emerald-200 border border-emerald-400/20 inline-flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              Academic Senate Roster
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Institutional Faculty Directory
          </h1>
          <p className="mt-2 text-emerald-100/90 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Connect with departmental colleagues, academic leadership, and subject coordinators across all divisions of EduManage.
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur border border-white/10">
              <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
                <Users className="w-4 h-4" />
                Total Faculty
              </div>
              <p className="text-2xl font-bold text-white mt-1">{faculty.length}</p>
              <p className="text-[11px] text-emerald-100/70">Professors & Instructors</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur border border-white/10">
              <div className="flex items-center gap-2 text-teal-200 text-xs font-semibold uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                Departments
              </div>
              <p className="text-2xl font-bold text-white mt-1">{departments.length - 1}</p>
              <p className="text-[11px] text-teal-100/70">Academic Divisions</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur border border-white/10">
              <div className="flex items-center gap-2 text-cyan-200 text-xs font-semibold uppercase tracking-wider">
                <Briefcase className="w-4 h-4" />
                Class Advisors
              </div>
              <p className="text-2xl font-bold text-white mt-1">{totalClassesAdvisory}</p>
              <p className="text-[11px] text-cyan-100/70">Active Class Cohorts</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur border border-white/10">
              <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                Curriculum Courses
              </div>
              <p className="text-2xl font-bold text-white mt-1">{totalSubjectsTaught}</p>
              <p className="text-[11px] text-emerald-100/70">Taught Subjects</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white dark:bg-[#131d33] p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search faculty by name, department, designation, subject, or ID..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold !text-slate-900 dark:!text-white bg-white dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/20 focus:outline-none placeholder:text-slate-400 placeholder:font-normal caret-emerald-600 shadow-2xs transition"
            />
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
            Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredFaculty.length}</strong> of{' '}
            <strong className="text-slate-900 dark:text-white font-bold">{faculty.length}</strong> faculty members
          </span>
        </div>

        {/* Department Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] mr-1">
            Department:
          </span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap ${
                selectedDept === dept
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {dept === 'ALL' ? 'All Departments' : dept.replace('Department of ', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Faculty Cards Grid */}
      {filteredFaculty.length === 0 ? (
        <div className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center">
          <GraduationCap className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Faculty Members Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            No colleagues matched your search query. Try clearing filters or searching with a different term.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDept('ALL');
            }}
            className="mt-4 px-4 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-xl transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFaculty.map((teacher) => {
            const avatarUrl =
              teacher.user.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                teacher.user.name
              )}&background=047857&color=ffffff&bold=true`;

            const isHOD = teacher.designation.toLowerCase().includes('head');

            return (
              <div
                key={teacher.id}
                className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Top Bar / Role Tag */}
                  <div className="p-5 pb-0 flex items-start justify-between gap-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isHOD
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                      }`}
                    >
                      {teacher.designation}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 dark:text-slate-400 font-semibold">
                      {teacher.employeeId}
                    </span>
                  </div>

                  {/* Profile Header */}
                  <div className="p-5 pt-3 flex items-start gap-3.5">
                    <img
                      src={avatarUrl}
                      alt={teacher.user.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-xs shrink-0 group-hover:border-emerald-500 transition"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base truncate leading-snug">
                        {teacher.user.name}
                      </h3>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5 truncate">
                        {teacher.department}
                      </p>
                      {teacher.qualification && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 flex items-center gap-1 truncate">
                          <Award className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="truncate">{teacher.qualification}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Academic Assignment Badges */}
                  <div className="px-5 pb-3 space-y-2.5">
                    {/* Advisory Cohorts */}
                    {teacher.classes.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block mb-1">
                          Class Advisory:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {teacher.classes.map((cls) => (
                            <span
                              key={cls.id}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-semibold border border-blue-200/80 dark:border-blue-800/60"
                            >
                              {cls.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Courses Taught */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block mb-1">
                        Curriculum Subjects ({teacher.subjects.length}):
                      </span>
                      {teacher.subjects.length === 0 ? (
                        <span className="text-[11px] text-slate-400 italic">No assigned courses</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects.map((sub) => (
                            <span
                              key={sub.id}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700"
                            >
                              {sub.name} ({sub.code})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer / Contact Details */}
                <div className="p-4 bg-slate-50/80 dark:bg-[#0f172a] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <div className="space-y-1 min-w-0">
                    <a
                      href={`mailto:${teacher.user.email}`}
                      className="flex items-center gap-1.5 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium truncate text-slate-600 dark:text-slate-300"
                      title={teacher.user.email}
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{teacher.user.email}</span>
                    </a>
                    {teacher.phone && (
                      <a
                        href={`tel:${teacher.phone}`}
                        className="flex items-center gap-1.5 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium text-slate-600 dark:text-slate-300"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{teacher.phone}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

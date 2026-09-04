import prisma from '@/lib/prisma';
import { Building2, Users, BookOpen, DoorOpen, Award } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminClassesPage() {
  const classes = await prisma.class.findMany({
    include: {
      teacher: {
        include: { user: true },
      },
      students: {
        include: { user: true },
      },
      subjects: {
        include: {
          teacher: { include: { user: true } },
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Classes & Subjects</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Curriculum allocation, classrooms, and teacher-subject alignments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                  Grade {cls.grade} – Section {cls.section}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <DoorOpen className="w-3.5 h-3.5 text-slate-400" />
                  {cls.room || 'Room TBA'}
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 mb-1">{cls.name}</h2>

              {/* Class Teacher */}
              <div className="py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100 mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase">Class Teacher</p>
                  <p className="text-xs font-bold text-slate-800">
                    {cls.teacher?.user.name || 'Unassigned'}
                  </p>
                </div>
                <Award className="w-4 h-4 text-indigo-500" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100/80">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    Students
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    {cls.students.length} Enrolled
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100/80">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-slate-400" />
                    Curriculum
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                    {cls.subjects.length} Subjects
                  </span>
                </div>
              </div>

              {/* Subjects List */}
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-2">Subject Schedule</p>
                <div className="space-y-1.5">
                  {cls.subjects.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No subjects configured yet</p>
                  ) : (
                    cls.subjects.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 hover:bg-slate-50 text-xs border border-slate-100"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-semibold px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded">
                            {sub.code}
                          </span>
                          <span className="font-medium text-slate-800">{sub.name}</span>
                        </div>
                        <span className="text-slate-500 text-[11px]">
                          {sub.teacher?.user.name.split(' ')[1] || 'Staff'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

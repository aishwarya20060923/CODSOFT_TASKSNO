import Sidebar from '@/components/layout/Sidebar';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 max-w-7xl w-full mx-auto">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50/50">
        {children}
      </div>
    </div>
  );
}

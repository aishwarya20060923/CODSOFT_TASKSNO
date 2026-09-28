import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import TeacherAnnouncementsClient from '@/components/teacher/TeacherAnnouncementsClient';
import { getAuthenticatedTeacher } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function TeacherAnnouncementsPage() {
  const teacher = await getAuthenticatedTeacher();
  if (!teacher) {
    redirect('/teacher/login');
  }

  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <TeacherAnnouncementsClient announcements={announcements} />
    </div>
  );
}

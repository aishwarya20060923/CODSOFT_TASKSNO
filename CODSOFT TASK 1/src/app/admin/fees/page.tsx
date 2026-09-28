import prisma from '@/lib/prisma';
import FeesClient from '@/components/admin/FeesClient';

export const dynamic = 'force-dynamic';

export default async function AdminFeesPage() {
  const [invoices, students] = await Promise.all([
    prisma.feeInvoice.findMany({
      include: {
        student: {
          include: {
            user: true,
            class: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.studentProfile.findMany({
      include: {
        user: true,
      },
      orderBy: { rollNumber: 'asc' },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Institutional Fee Management</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Fee invoicing, tuition clearing, and financial compliance ledgers.
        </p>
      </div>

      <FeesClient invoices={invoices} students={students} />
    </div>
  );
}

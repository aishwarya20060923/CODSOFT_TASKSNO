'use client';

import { useState } from 'react';
import {
  CreditCard,
  PlusCircle,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeColor } from '@/lib/utils';
import { createFeeInvoice, payFeeInvoice } from '@/lib/actions';

interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  title: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: string;
  paymentDate: string | null;
  paymentMethod: string | null;
  student: {
    rollNumber: string;
    user: {
      name: string;
      email: string;
    };
    class: {
      name: string;
    };
  };
}

interface StudentOption {
  id: string;
  rollNumber: string;
  user: {
    name: string;
  };
}

export default function FeesClient({
  invoices,
  students,
}: {
  invoices: InvoiceItem[];
  students: StudentOption[];
}) {
  const [filter, setFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'OVERDUE'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const totalBilled = invoices.reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = invoices.reduce((sum, i) => sum + i.paidAmount, 0);
  const totalPending = totalBilled - totalPaid;

  const filteredInvoices = invoices.filter((inv) => {
    const matchesFilter =
      filter === 'ALL'
        ? true
        : filter === 'PAID'
        ? inv.status === 'PAID'
        : filter === 'PENDING'
        ? inv.status === 'PENDING' || inv.status === 'PARTIAL'
        : inv.status === 'OVERDUE';

    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.student.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleCreateInvoice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    const res = await createFeeInvoice(formData);

    setSubmitting(false);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message || 'Invoice issued successfully!' });
      setTimeout(() => {
        setIsModalOpen(false);
        setFeedback(null);
      }, 1200);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Failed to issue invoice' });
    }
  };

  const handleMarkPaid = async (id: string) => {
    setActionLoading(id);
    await payFeeInvoice(id, 'Admin Cash/Transfer Desk');
    setActionLoading(null);
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold uppercase">Total Invoiced</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalBilled)}</p>
          <p className="text-xs text-slate-400 mt-0.5">{invoices.length} total generated bills</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-emerald-600 font-semibold uppercase">Total Realized</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{formatCurrency(totalPaid)}</p>
          <p className="text-xs text-emerald-600 mt-0.5">
            {totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0}% clearance rate
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-rose-600 font-semibold uppercase">Pending Dues</span>
          <p className="text-2xl font-bold text-rose-700 mt-1">{formatCurrency(totalPending)}</p>
          <p className="text-xs text-rose-500 mt-0.5">Awaiting fee collection</p>
        </div>
      </div>

      {/* Action and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 w-full sm:w-auto items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoice, student or roll..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            {(['ALL', 'PAID', 'PENDING', 'OVERDUE'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-lg capitalize transition ${
                  filter === status ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
                }`}
              >
                {status.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Issue Fee Invoice</span>
        </button>
      </div>

      {/* Invoice Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Invoice Details</th>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Due Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    No invoice records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{inv.title}</p>
                      <p className="font-mono text-xs text-slate-400">{inv.invoiceNumber}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">{inv.student.user.name}</p>
                      <p className="text-xs text-slate-400">
                        {inv.student.rollNumber} • {inv.student.class.name}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">{formatCurrency(inv.amount)}</p>
                      {inv.paidAmount > 0 && inv.paidAmount < inv.amount && (
                        <p className="text-xs text-emerald-600">
                          Paid: {formatCurrency(inv.paidAmount)}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(inv.dueDate)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeColor(
                          inv.status
                        )}`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {inv.status !== 'PAID' ? (
                        <button
                          onClick={() => handleMarkPaid(inv.id)}
                          disabled={actionLoading === inv.id}
                          className="px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition disabled:opacity-50"
                        >
                          {actionLoading === inv.id ? 'Recording...' : 'Mark as Paid'}
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-700 font-medium flex items-center justify-end gap-1">
                          <CheckCircle className="w-4 h-4 text-emerald-500" /> Paid
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Issue Fee Invoice */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Issue Fee Invoice
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div
                className={`mt-4 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                <span>{feedback.message}</span>
              </div>
            )}

            <form onSubmit={handleCreateInvoice} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Select Student *
                </label>
                <select
                  name="studentId"
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.user.name} ({s.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Invoice Title / Description *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Science Lab & Exam Fee"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Amount (INR ₹) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    name="amount"
                    required
                    placeholder="15000"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    required
                    defaultValue="2026-09-30"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  {submitting ? 'Generating...' : 'Issue Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

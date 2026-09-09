'use client';

import { useState } from 'react';
import { CreditCard, CheckCircle2, Calendar, Receipt, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeColor } from '@/lib/utils';
import { payFeeInvoice } from '@/lib/actions';

interface FeeInvoiceItem {
  id: string;
  invoiceNumber: string;
  title: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: string;
  paymentDate: string | null;
  paymentMethod: string | null;
}

export default function StudentFeesClient({ invoices }: { invoices: FeeInvoiceItem[] }) {
  const [selectedInvoice, setSelectedInvoice] = useState<FeeInvoiceItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('Online Debit Card');
  const [processing, setProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const pendingAmount = totalBilled - totalPaid;

  const handlePay = async () => {
    if (!selectedInvoice) return;
    setProcessing(true);
    setFeedback(null);

    const res = await payFeeInvoice(selectedInvoice.id, paymentMethod);

    setProcessing(false);
    if (res.success) {
      setFeedback({ type: 'success', message: 'Payment approved! Receipt generated successfully.' });
      setTimeout(() => {
        setSelectedInvoice(null);
        setFeedback(null);
      }, 1500);
    } else {
      setFeedback({ type: 'error', message: res.error || 'Payment failed' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Fee Invoices & Receipts</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Review academic tuition bills, payment dates, and instant receipts.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#131d33] p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">Total Semester Fees</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(totalBilled)}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{invoices.length} invoices generated</p>
        </div>

        <div className="bg-white dark:bg-[#131d33] p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-2xs">
          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold uppercase">Cleared Payments</span>
          <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-300 mt-1">{formatCurrency(totalPaid)}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">Verified by Bursar</p>
        </div>

        <div className="bg-white dark:bg-[#131d33] p-4 rounded-xl border border-amber-100 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/20 shadow-2xs">
          <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold uppercase">Pending Dues</span>
          <p className="text-2xl font-bold text-amber-800 dark:text-amber-300 mt-1">
            {pendingAmount > 0 ? formatCurrency(pendingAmount) : '$0.00'}
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
            {pendingAmount > 0 ? 'Due soon' : 'No balance due'}
          </p>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Official Fee Schedule</span>
          <span>Academic Year 2026</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    inv.status === 'PAID'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{inv.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono text-slate-600 dark:text-slate-400 font-medium">{inv.invoiceNumber}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      Due: {formatDate(inv.dueDate)}
                    </span>
                    {inv.paymentDate && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                          Paid on {formatDate(inv.paymentDate)} via {inv.paymentMethod}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-white text-lg">{formatCurrency(inv.amount)}</p>
                  <span
                    className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusBadgeColor(
                      inv.status
                    )}`}
                  >
                    {inv.status}
                  </span>
                </div>

                {inv.status !== 'PAID' && (
                  <button
                    onClick={() => setSelectedInvoice(inv)}
                    className="px-4 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Pay Online Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Payment Simulation */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#131d33] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                EduManage Payment Gateway
              </h3>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback && (
              <div
                className={`mt-4 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                <span>{feedback.message}</span>
              </div>
            )}

            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Paying For</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedInvoice.title}</p>
              <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-600 dark:text-slate-400">Total Due Amount</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {formatCurrency(selectedInvoice.amount)}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Select Payment Channel
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI (GPay / PhonePe)')}
                  className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                    paymentMethod.startsWith('UPI')
                      ? 'border-purple-600 dark:border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <p className="font-semibold">UPI Payment</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">GPay / PhonePe / Paytm</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Net Banking (SBI / HDFC)')}
                  className={`p-3 rounded-xl border text-left font-medium transition cursor-pointer ${
                    paymentMethod.startsWith('Net Banking')
                      ? 'border-purple-600 dark:border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <p className="font-semibold">Net Banking / RuPay</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">SBI, HDFC, ICICI & RuPay</p>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>256-bit encrypted demonstration gateway. Instant receipt clearing.</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePay}
                disabled={processing}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50 cursor-pointer"
              >
                <span>{processing ? 'Clearing...' : 'Confirm Payment'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, Copy, Check, Filter, CreditCard, Building2, Smartphone } from 'lucide-react';
import { WithdrawalRecord } from '../types';

interface WithdrawalHistoryViewProps {
  records: WithdrawalRecord[];
  onBack: () => void;
  onApproveRecord?: (id: string) => void;
  currentUserEmail?: string;
}

export const WithdrawalHistoryView: React.FC<WithdrawalHistoryViewProps> = ({
  records,
  onBack,
  currentUserEmail,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'SUCCESSFUL'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const userSpecificRecords = currentUserEmail
    ? records.filter((r) => r.userEmail?.toLowerCase() === currentUserEmail.toLowerCase())
    : records;

  const filteredRecords = userSpecificRecords.filter((rec) => {
    if (filter === 'ALL') return true;
    return rec.status === filter;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 space-y-4 pb-28 text-slate-100">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="btn-history-back"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white py-1.5 px-3 rounded-xl hover:bg-slate-800 transition-all cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <h2 className="text-sm font-bold text-white">
          Payout Statements
        </h2>

        <div className="w-16 flex justify-end">
          <span className="text-[11px] font-mono font-bold text-cyan-300 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
            {userSpecificRecords.length}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex rounded-2xl bg-slate-950 p-1 text-xs font-semibold border border-slate-800">
        <button
          onClick={() => setFilter('ALL')}
          className={`flex-1 py-2 rounded-xl transition-all cursor-pointer min-h-[40px] ${
            filter === 'ALL'
              ? 'bg-slate-800 text-cyan-300 font-bold border border-cyan-500/30 shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All ({userSpecificRecords.length})
        </button>
        <button
          onClick={() => setFilter('PENDING')}
          className={`flex-1 py-2 rounded-xl transition-all cursor-pointer min-h-[40px] ${
            filter === 'PENDING'
              ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('SUCCESSFUL')}
          className={`flex-1 py-2 rounded-xl transition-all cursor-pointer min-h-[40px] ${
            filter === 'SUCCESSFUL'
              ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Settled
        </button>
      </div>

      {/* Record list */}
      <div className="space-y-3">
        {filteredRecords.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 rounded-3xl border border-slate-800 shadow-xs">
            <CreditCard className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-300">No Withdrawal Records Found</p>
            <p className="text-xs text-slate-500 mt-1">
              Your requested payouts and settlement status will appear here.
            </p>
          </div>
        ) : (
          filteredRecords.map((rec) => {
            const isBank = rec.type === 'BANK' || !!rec.bankDetails;
            return (
              <div
                key={rec.id}
                className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white font-mono">
                      ₹{rec.amount.toFixed(2)}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 ${
                      isBank ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {isBank ? <Building2 className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                      <span>{isBank ? 'Bank IMPS' : (rec.type || 'UPI')}</span>
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                      rec.status === 'SUCCESSFUL'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : rec.status === 'REJECTED'
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {rec.status === 'SUCCESSFUL' ? 'SETTLED' : rec.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                  {isBank && rec.bankDetails ? (
                    <>
                      <div className="flex justify-between text-slate-400">
                        <span>A/C Holder:</span>
                        <span className="text-white font-semibold">{rec.bankDetails.accountHolderName}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Bank:</span>
                        <span className="text-white font-semibold">{rec.bankDetails.bankName}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Account No:</span>
                        <span className="font-mono text-cyan-300 font-bold">{rec.bankDetails.accountNumber}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>IFSC:</span>
                        <span className="font-mono text-emerald-300 font-bold">{rec.bankDetails.ifscCode}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-slate-400">
                      <span>UPI ID:</span>
                      <span className="font-mono text-cyan-300 font-bold">{rec.upiId || 'Direct UPI'}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-500 pt-1 border-t border-slate-900 text-[11px]">
                    <span>Order Ref:</span>
                    <span className="font-mono text-slate-400">{rec.orderNumber || rec.id}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Timestamp:</span>
                    <span className="text-slate-400">{rec.time}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

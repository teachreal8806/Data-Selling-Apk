import React, { useState } from 'react';
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, Copy, Check, Filter, CreditCard } from 'lucide-react';
import { WithdrawalRecord } from '../types';

interface WithdrawalHistoryViewProps {
  records: WithdrawalRecord[];
  onBack: () => void;
  onApproveRecord?: (id: string) => void;
}

export const WithdrawalHistoryView: React.FC<WithdrawalHistoryViewProps> = ({
  records,
  onBack,
  onApproveRecord,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'SUCCESSFUL'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredRecords = records.filter((rec) => {
    if (filter === 'ALL') return true;
    return rec.status === filter;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-4 pb-28 text-slate-800">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="btn-history-back"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 py-1.5 px-3 rounded-xl hover:bg-slate-100 transition-all cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <h2 className="text-sm font-black text-slate-900">
          Payout Statements
        </h2>

        <div className="w-16 flex justify-end">
          <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
            {records.length}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex rounded-2xl bg-slate-100 p-1 text-xs font-bold border border-slate-200">
        <button
          onClick={() => setFilter('ALL')}
          className={`flex-1 py-2 rounded-xl transition-all cursor-pointer min-h-[44px] ${
            filter === 'ALL'
              ? 'bg-white text-indigo-700 font-extrabold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All ({records.length})
        </button>
        <button
          onClick={() => setFilter('PENDING')}
          className={`flex-1 py-2 rounded-xl transition-all cursor-pointer min-h-[44px] ${
            filter === 'PENDING'
              ? 'bg-white text-amber-700 font-extrabold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('SUCCESSFUL')}
          className={`flex-1 py-2 rounded-xl transition-all cursor-pointer min-h-[44px] ${
            filter === 'SUCCESSFUL'
              ? 'bg-white text-emerald-700 font-extrabold shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Settled
        </button>
      </div>

      {/* Record list */}
      <div className="space-y-2.5">
        {filteredRecords.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-xs">
            <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">No Withdrawal Records Found</p>
            <p className="text-xs text-slate-500 mt-1">
              Your requested payouts and settlement status will show here.
            </p>
          </div>
        ) : (
          filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900 font-mono">
                    ₹{rec.amount.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-bold">
                    {rec.method}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                    rec.status === 'SUCCESSFUL'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : rec.status === 'REJECTED'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {rec.status === 'SUCCESSFUL' ? 'SETTLED' : rec.status}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Beneficiary UPI:</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-slate-800">
                    <span>{rec.upiId}</span>
                    <button
                      onClick={() => handleCopy(rec.upiId)}
                      className="p-1 hover:text-indigo-600 cursor-pointer"
                    >
                      {copiedId === rec.upiId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Requested On:</span>
                  <span>{rec.timestamp}</span>
                </div>

                {rec.bankReference && (
                  <div className="flex justify-between text-emerald-700 font-mono text-[11px] pt-1 border-t border-slate-200">
                    <span>Bank RRN:</span>
                    <span>{rec.bankReference}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

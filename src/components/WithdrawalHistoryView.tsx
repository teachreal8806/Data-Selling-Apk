import React, { useState } from 'react';
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, Copy, Check, Filter } from 'lucide-react';
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
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="btn-history-back"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 py-1.5 px-2 rounded-lg hover:bg-slate-100 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <h2 className="text-sm font-bold text-slate-900">
          Withdrawal History
        </h2>

        <div className="w-16 flex justify-end">
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {records.length}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-medium text-slate-600">
        <button
          onClick={() => setFilter('ALL')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            filter === 'ALL'
              ? 'bg-white text-slate-900 font-bold shadow-2xs'
              : 'hover:text-slate-900'
          }`}
        >
          All ({records.length})
        </button>
        <button
          onClick={() => setFilter('PENDING')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            filter === 'PENDING'
              ? 'bg-white text-amber-700 font-bold shadow-2xs'
              : 'hover:text-slate-900'
          }`}
        >
          Pending ({records.filter((r) => r.status === 'PENDING').length})
        </button>
        <button
          onClick={() => setFilter('SUCCESSFUL')}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            filter === 'SUCCESSFUL'
              ? 'bg-white text-emerald-700 font-bold shadow-2xs'
              : 'hover:text-slate-900'
          }`}
        >
          Successful ({records.filter((r) => r.status === 'SUCCESSFUL').length})
        </button>
      </div>

      {/* History Cards List */}
      {filteredRecords.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-2xs space-y-2">
          <Clock className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No withdrawal records</p>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            When you request a withdrawal, all status updates and order numbers will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs hover:shadow-xs transition-all space-y-3 animate-in fade-in duration-200"
            >
              {/* Top Row matching Frame 00:13 */}
              <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
                <h3 className="text-sm font-bold text-slate-900">
                  Withdraw
                </h3>
                
                {/* Status Badge */}
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md tracking-wider uppercase ${
                    record.status === 'PENDING'
                      ? 'bg-amber-100/80 text-amber-700 border border-amber-200/60'
                      : 'bg-emerald-100/80 text-emerald-700 border border-emerald-200/60'
                  }`}
                >
                  {record.status}
                </span>
              </div>

              {/* Details Key-Value Rows matching Frame 00:13 */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-normal">Balance</span>
                  <span className="text-slate-900 font-bold">
                    ₹{record.amount.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-normal">Type</span>
                  <span className="text-slate-700 font-medium">
                    {record.type}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-normal">Time</span>
                  <span className="text-slate-600 font-mono text-[11px]">
                    {record.time}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-slate-400 font-normal">Order number</span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-800 font-mono font-medium text-[11px] tracking-wider">
                      {record.orderNumber}
                    </span>
                    <button
                      onClick={() => handleCopy(record.orderNumber)}
                      title="Copy order number"
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-sm"
                    >
                      {copiedId === record.orderNumber ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                {record.upiId && (
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-50 pt-1.5">
                    <span>Account / UPI</span>
                    <span className="font-mono text-slate-500">{record.upiId}</span>
                  </div>
                )}
              </div>

              {/* Simulate Approval helper for pending items */}
              {record.status === 'PENDING' && onApproveRecord && (
                <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] text-amber-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Processing via bank switch...
                  </span>
                  <button
                    onClick={() => onApproveRecord(record.id)}
                    className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-sm transition-all"
                  >
                    Simulate Payout
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

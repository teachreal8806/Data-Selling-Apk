import React from 'react';
import { ArrowLeft, ShieldCheck, FileText, Lock, CheckCircle2 } from 'lucide-react';

interface TermsViewProps {
  onBack: () => void;
}

export const TermsView: React.FC<TermsViewProps> = ({ onBack }) => {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-4 pb-28 text-slate-800">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="btn-terms-back"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 py-1.5 px-3 rounded-xl hover:bg-slate-100 transition-all cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <h2 className="text-sm font-black text-slate-900">Terms & Legal Policy</h2>
        <div className="w-12" />
      </div>

      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-4 text-xs text-slate-600 leading-relaxed">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-black text-sm">
          <FileText className="w-4 h-4 text-indigo-600" />
          <span>User Agreement & Privacy Guarantee</span>
        </div>

        <div>
          <h4 className="font-extrabold text-slate-900 text-xs mb-1">1. Bandwidth Monetization</h4>
          <p className="text-slate-600">
            By enabling data selling on DataSell, you authorize the platform to route non-sensitive, encrypted network verification requests through your excess internet bandwidth. You retain complete control and can stop selling at any time.
          </p>
        </div>

        <div>
          <h4 className="font-extrabold text-slate-900 text-xs mb-1">2. Absolute Privacy Guarantee</h4>
          <p className="text-slate-600">
            The software operates strictly at the socket/transport level. We do NOT inspect, record, or access your browser cookies, search history, storage files, personal messages, or credentials.
          </p>
        </div>

        <div>
          <h4 className="font-extrabold text-slate-900 text-xs mb-1">3. Payouts & Settlement</h4>
          <p className="text-slate-600">
            Earnings are calculated in real time per megabyte (MB) successfully relayed. Accumulated balances may be withdrawn via UPI (PhonePe, Google Pay, or Virtual Payment Addresses). Settlement requests are queued immediately and completed promptly.
          </p>
        </div>

        <div>
          <h4 className="font-extrabold text-slate-900 text-xs mb-1">4. Fair Usage Policy</h4>
          <p className="text-slate-600">
            Users must connect using genuine consumer broadband or mobile cellular data networks. Any attempt to generate automated synthetic packets or bypass telemetry will result in account review.
          </p>
        </div>

        <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-start gap-2.5 text-indigo-900">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            All bandwidth transmissions are secured via end-to-end TLS 1.3 socket tunnels. Bank payouts comply with NPCI UPI security standards.
          </p>
        </div>
      </div>
    </div>
  );
};

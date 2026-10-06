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

  // Generate UPI URI
  const upiUri = `upi://pay?pa=${encodeURIComponent(depositConfig.upiId)}&pn=${encodeURIComponent(
    depositConfig.payeeName
  )}&am=${numAmount > 0 ? numAmount.toFixed(2) : '200.00'}&cu=INR&tn=DataSell_Deposit`;

  // QR Code URL
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
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-red-600 py-1.5 px-3 rounded-xl hover:bg-amber-100/50 transition-all cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 text-red-600" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-bold text-red-950 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full shadow-xs">
          <QrCode className="w-3.5 h-3.5 text-red-600" />
          <span>Instant UPI Deposit</span>
        </div>

        <button
          onClick={onGoToWithdraw}
          className="text-xs font-bold text-red-600 hover:text-red-800 py-1.5 px-2 transition-all cursor-pointer"
        >
          Withdrawal ➔
        </button>
      </div>

      {submitted ? (
        /* Submission Success Confirmation */
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-xl text-center space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-red-600 mx-auto shadow-xs">
            <CheckCircle2 className="w-9 h-9 text-emerald-600" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">Deposit Submitted!</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your ₹{numAmount.toFixed(2)} deposit with UTR <span className="font-mono font-bold text-red-600">{utrNumber}</span> has been received.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 text-left text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Gateway Status:</span>
              <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">VERIFYING UTR</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Method:</span>
              <span className="text-slate-800 font-bold">{method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Expected Time:</span>
              <span className="text-emerald-700 font-bold">1 - 3 Minutes</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={onGoToWithdraw}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs shadow-md transition-all cursor-pointer border border-yellow-300"
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
          {/* Top Cancel Payment Bar ("payment karne ke uper cancel ka option add kar dijiye sir") */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 border border-amber-300 shadow-xs">
            <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              <span>UPI Deposit Gateway</span>
            </span>
            <button
              type="button"
              onClick={onBack}
              id="btn-cancel-deposit-top"
              className="py-1 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1 border border-yellow-300"
            >
              <span>Cancel Payment</span>
            </button>
          </div>

          {/* Instructions Notice Banner */}
          {userState.requireDepositBeforeWithdrawal && !userState.hasCompletedRequiredDeposit && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-black text-red-950">Required Verification Deposit:</span> A one-time deposit of ₹{userState.requiredDepositAmount || 200} is required to verify your UPI payment account and activate automated withdrawals.
              </div>
            </div>
          )}

          {/* QR Code Card in Red & Yellow Theme */}
          <div className="bg-white rounded-3xl p-5 border-2 border-amber-300 shadow-md text-center space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Scan & Pay Any UPI App</span>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold border border-emerald-300">
                Auto-Verified 24/7
              </span>
            </div>

            {/* QR Scanner Container */}
            <div className="relative mx-auto w-56 h-56 rounded-2xl bg-white p-3 border-2 border-amber-300 shadow-inner flex items-center justify-center overflow-hidden">
              <img 
                src={qrUrl} 
                alt="UPI Deposit QR Code" 
                className="w-full h-full object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Payee Name & Official UPI ID */}
            <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Payee:</span>
                <span className="font-bold text-slate-900">{depositConfig.payeeName}</span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-amber-200/80">
                <span className="text-xs font-mono font-bold text-red-700 truncate">{depositConfig.upiId}</span>
                <button
                  id="btn-copy-upi-id"
                  onClick={handleCopyUpi}
                  className="py-1 px-2.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-500 text-white text-[11px] font-black flex items-center gap-1 active:scale-95 transition-all cursor-pointer shadow-xs border border-yellow-300"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy UPI'}</span>
                </button>
              </div>
            </div>

            {/* 1-Tap Launch in Mobile Apps in Red & Yellow Theme (No blue) */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] text-slate-500 font-medium">Or pay instantly via your preferred UPI app:</p>
              <div className="grid grid-cols-4 gap-2">
                <a
                  href={upiUri}
                  onClick={() => setMethod('PhonePe')}
                  className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-[11px] text-center active:scale-95 transition-all shadow-xs"
                >
                  PhonePe
                </a>
                <a
                  href={upiUri}
                  onClick={() => setMethod('GPay')}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 font-bold text-[11px] text-center active:scale-95 transition-all shadow-xs"
                >
                  GPay
                </a>
                <a
                  href={upiUri}
                  onClick={() => setMethod('Paytm')}
                  className="p-2 rounded-xl bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-950 font-bold text-[11px] text-center active:scale-95 transition-all shadow-xs"
                >
                  Paytm
                </a>
                <a
                  href={upiUri}
                  onClick={() => setMethod('BHIM')}
                  className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-900 font-bold text-[11px] text-center active:scale-95 transition-all shadow-xs"
                >
                  BHIM
                </a>
              </div>
            </div>
          </div>

          {/* Deposit Form with Amount & UTR */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 border-2 border-amber-300 shadow-md space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-red-950">
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
              <label className="block text-xs font-bold text-slate-800">Amount to Deposit (₹)</label>
              <div className="grid grid-cols-4 gap-2">
                {[99, 199, 500, 1000].map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => handleQuickAmount(val)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer font-mono border ${
                      amount === val.toString()
                        ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white border-yellow-300 shadow-sm font-black'
                        : 'bg-amber-50 text-slate-800 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter deposit amount"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-amber-300 text-sm font-mono font-bold text-slate-900 bg-white focus:outline-hidden focus:border-red-500"
              />
            </div>

            {/* UTR Reference Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">12-Digit UTR / UPI Reference No.</label>
                <span className="text-[10px] text-red-600 font-bold uppercase">Required</span>
              </div>
              <input
                type="text"
                required
                maxLength={24}
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="e.g. 429182749102"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-amber-300 text-sm font-mono font-bold text-slate-900 bg-white focus:outline-hidden focus:border-red-500"
              />
            </div>

            {/* Action Buttons: Submit + Cancel */}
            <div className="space-y-2 pt-1">
              <button
                type="submit"
                id="btn-submit-deposit-utr"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer min-h-[48px] flex items-center justify-center gap-2 border border-yellow-300"
              >
                <CheckCircle2 className="w-4 h-4 text-yellow-300" />
                <span>Verify & Submit UTR (₹{numAmount.toFixed(2)})</span>
              </button>

              <button
                type="button"
                onClick={onBack}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel & Return to Dashboard
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

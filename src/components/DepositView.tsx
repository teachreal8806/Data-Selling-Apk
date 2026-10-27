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
    <div className="w-full max-w-md mx-auto px-4 py-3 space-y-4 pb-28 text-slate-100">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="btn-deposit-back"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white py-1.5 px-3 rounded-xl hover:bg-slate-800 transition-all cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-1.5 bg-slate-900 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/30 text-xs font-bold">
          <QrCode className="w-3.5 h-3.5 text-cyan-400" />
          <span>Instant UPI Deposit</span>
        </div>

        <div className="w-8" />
      </div>

      {submitted ? (
        /* Success Confirmation Card */
        <div className="rounded-3xl bg-slate-900 border border-emerald-500/40 p-6 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Deposit Submitted!</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
              Your ₹{numAmount.toFixed(2)} deposit with UTR <span className="font-mono text-cyan-400 font-bold">{utrNumber}</span> is received. It will be credited within 2-5 minutes after bank ledger verification.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-left space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Amount:</span>
              <span className="font-mono font-bold text-white">₹{numAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Payment Mode:</span>
              <span className="font-semibold text-slate-200">{method}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Status:</span>
              <span className="text-amber-400 font-bold">VERIFYING (Pending)</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={onGoToWithdraw}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5"
            >
              <span>Go to Withdrawal Page</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSubmitted(false);
                setUtrNumber('');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition-all cursor-pointer min-h-[44px]"
            >
              Submit Another Deposit
            </button>
          </div>
        </div>
      ) : (
        /* Main Deposit Card in Obsidian & Cyan */
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-4">
          
          {/* Payee Info Banner */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Verified Merchant</p>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <span>{depositConfig.payeeName}</span>
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </h3>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              AUTO-MATCH ACTIVE
            </span>
          </div>

          {/* Dynamic QR Code Frame with Neon Corners */}
          <div className="relative mx-auto w-64 h-64 bg-slate-950 rounded-2xl p-3 border border-cyan-500/30 flex items-center justify-center shadow-lg">
            {/* Corner Markers */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

            <img
              src={qrUrl}
              alt="UPI QR Code"
              className="w-full h-full object-contain rounded-xl bg-white p-2"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Copy UPI ID Bar */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Official UPI ID</p>
              <p className="text-xs font-mono font-bold text-cyan-300 truncate">{depositConfig.upiId}</p>
            </div>
            <button
              onClick={handleCopyUpi}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 min-h-[40px] ${
                copied
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy UPI'}</span>
            </button>
          </div>

          {/* Quick Amount Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select or Enter Amount (₹)
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[100, 200, 500, 1000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAmount(val)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer min-h-[40px] border ${
                    amount === val.toString()
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  ₹{val}
                </button>
              ))}
            </div>

            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="Enter custom amount"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-hidden focus:border-cyan-400"
            />
          </div>

          {/* UPI App Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Transferring via Application
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['PhonePe', 'GPay', 'Paytm', 'BHIM'] as const).map((app) => (
                <button
                  key={app}
                  type="button"
                  onClick={() => setMethod(app)}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[40px] border ${
                    method === app
                      ? 'bg-slate-800 text-cyan-400 border-cyan-500/50 shadow-xs'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {app}
                </button>
              ))}
            </div>
          </div>

          {/* 12-Digit UTR Input Form */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-slate-800">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  12-Digit UPI Reference Number / UTR
                </label>
                <span className="text-[10px] text-cyan-400 font-mono">Mandatory</span>
              </div>
              <input
                type="text"
                required
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="e.g. 423985729103"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm tracking-wider focus:outline-hidden focus:border-cyan-400"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Payment successful hone ke baad UPI app se 12-digit UTR copy karke yahan paste karein.
              </p>
            </div>

            <button
              type="submit"
              id="btn-submit-deposit-utr"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer min-h-[46px] flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Submit UTR for Instant Credit (₹{numAmount.toFixed(2)})</span>
            </button>
          </form>

        </div>
      )}

    </div>
  );
};

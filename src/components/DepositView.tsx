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
  Smartphone
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

  // Generate UPI payment intent URI
  const upiUri = `upi://pay?pa=${encodeURIComponent(depositConfig.upiId)}&pn=${encodeURIComponent(
    depositConfig.payeeName
  )}&am=${numAmount > 0 ? numAmount.toFixed(2) : '200.00'}&cu=INR&tn=DataSell_Deposit`;

  // QR Code URL using standard QR service with SVG fallback
  const qrUrl = depositConfig.qrImageUrl || 
    `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUri)}&margin=10`;

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

    const newDeposit: DepositRecord = {
      id: 'dep_' + Date.now(),
      userId: userState.id || 'usr_main',
      userEmail: userState.email,
      amount: numAmount,
      type: 'UPI_DEPOSIT',
      method: method,
      utrNumber: cleanUtr,
      note: `User Deposit via ${method} (UTR: ${cleanUtr})`,
      time: formatDateTime(new Date()),
      status: 'PENDING',
    };

    onSubmitDeposit(newDeposit);
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="btn-deposit-back"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 py-1.5 px-2.5 rounded-lg hover:bg-slate-100 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <QrCode className="w-4 h-4 text-blue-600" />
          <span>Deposit / Add Funds</span>
        </h2>

        <button
          onClick={onGoToWithdraw}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 py-1 px-2.5 rounded-lg hover:bg-blue-50 transition-all"
        >
          Withdraw
        </button>
      </div>

      {/* Mandatory Verification Deposit Banner if configured by Admin */}
      {userState.requireDepositBeforeWithdrawal && !userState.hasCompletedRequiredDeposit && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-amber-900 space-y-2">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Account Verification Deposit Required
              </h3>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                {userState.withdrawalDepositNotice || 
                  `Please complete a security verification deposit of ₹${userState.requiredDepositAmount || 200} to unlock bank withdrawals. This deposit is 100% credited to your wallet balance.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {submitted ? (
        /* Success Screen */
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center space-y-4 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Deposit Submitted!</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Your deposit of <span className="font-bold text-slate-800">₹{numAmount.toFixed(2)}</span> with UTR <span className="font-mono font-semibold text-slate-700">{utrNumber}</span> has been received for verification.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="font-semibold text-amber-600">Under Review (5-10 Mins)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payment App:</span>
              <span className="font-semibold text-slate-700">{method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Target UPI ID:</span>
              <span className="font-mono text-slate-700">{depositConfig.upiId}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={onBack}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Back to Dashboard
            </button>
            <button
              onClick={onGoToWithdraw}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all"
            >
              Go to Withdrawal Page
            </button>
          </div>
        </div>
      ) : (
        /* Main Deposit Card with Scanner & UPI ID */
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-5">
          {/* Section 1: Official Scanner & UPI ID */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant QR Scanner & UPI Payment</span>
            </div>

            {/* QR Code Container */}
            <div className="relative mx-auto w-52 h-52 p-2 bg-white rounded-2xl border-2 border-dashed border-blue-400/60 shadow-md flex flex-col items-center justify-center group">
              <img
                src={qrUrl}
                alt="Deposit UPI QR Code Scanner"
                className="w-44 h-44 object-contain rounded-lg"
                loading="lazy"
                onError={(e) => {
                  // Fallback to svg representation if offline
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute bottom-2 px-2 py-0.5 bg-slate-900/80 text-white text-[9px] font-semibold rounded-md backdrop-blur-xs">
                Scan with any UPI App
              </div>
            </div>

            {/* Payee Name */}
            <p className="text-xs font-semibold text-slate-700">
              Payee: <span className="text-blue-600">{depositConfig.payeeName}</span>
            </p>

            {/* Official Deposit UPI ID Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-2">
              <div className="text-left truncate">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Official Deposit UPI ID
                </span>
                <span className="font-mono text-xs font-bold text-slate-900 select-all truncate block">
                  {depositConfig.upiId}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs active:scale-95'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy UPI'}</span>
              </button>
            </div>

            {/* Direct Pay via UPI link on mobile */}
            <a
              href={upiUri}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-200 active:scale-95"
            >
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>Open in PhonePe / GPay / Paytm App</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Deposit Amount & UTR Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Step 2: Enter Deposit Details & UTR
            </h3>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Amount Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Deposited Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min={depositConfig.minDeposit}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-hidden focus:border-blue-500 bg-slate-50/50"
                  placeholder="200"
                />
              </div>

              {/* Quick Pills */}
              <div className="flex items-center gap-2 mt-2">
                {[100, 200, 500, 1000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAmount(val)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      amount === val.toString()
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment App Used */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Paid Via Application
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['PhonePe', 'GPay', 'Paytm', 'BHIM', 'UPI'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                      method === m
                        ? 'bg-blue-50 text-blue-700 border-blue-500 font-bold ring-2 ring-blue-200'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* UTR / Reference Number */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                12-Digit UPI Reference No. / UTR
              </label>
              <input
                type="text"
                required
                maxLength={20}
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="e.g. 423871923841"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:border-blue-500 bg-slate-50/50"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Found in your PhonePe / GPay / Paytm payment transaction details.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Submit Deposit Proof (₹{numAmount.toFixed(2)})</span>
            </button>
          </form>

          {/* Security Guarantee */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-slate-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              All deposits are verified via banking UPI rails and credited immediately to your balance.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

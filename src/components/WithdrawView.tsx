import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Sparkles, QrCode, ArrowRight, CreditCard, ShieldCheck } from 'lucide-react';
import { UserState } from '../types';

interface WithdrawViewProps {
  userState: UserState;
  onBack: () => void;
  onSubmitWithdrawal: (amount: number, upiId: string, method: 'PhonePe' | 'GPay' | 'UPI') => boolean;
  onGoToHistory: () => void;
  onOpenDeposit?: () => void;
}

export const WithdrawView: React.FC<WithdrawViewProps> = ({
  userState,
  onBack,
  onSubmitWithdrawal,
  onGoToHistory,
  onOpenDeposit,
}) => {
  const isDepositBlocked = !!(userState.requireDepositBeforeWithdrawal && !userState.hasCompletedRequiredDeposit);
  const requiredDepositAmount = userState.requiredDepositAmount || 200;

  const [amount, setAmount] = useState<string>('500');
  const [selectedMethod, setSelectedMethod] = useState<'PhonePe' | 'GPay' | 'UPI'>(
    userState.selectedPaymentMethod || 'PhonePe'
  );
  const [upiId, setUpiId] = useState<string>(userState.savedUpiId || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString());
    setErrorMessage(null);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // If user has deposit requirement enforced by Admin
    if (isDepositBlocked) {
      setErrorMessage(
        `Account Verification Required: Please deposit ₹${requiredDepositAmount} via QR Scanner / UPI first to activate bank payout rails.`
      );
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Please enter a valid amount.');
      return;
    }

    if (numAmount > userState.balance) {
      setErrorMessage(`Insufficient balance! Your current balance is ₹${userState.balance.toFixed(2)}.`);
      return;
    }

    if (!upiId.trim() || !upiId.includes('@')) {
      setErrorMessage('Please enter a valid UPI ID (e.g., yourname@oksbi or mobile@ybl).');
      return;
    }

    const success = onSubmitWithdrawal(numAmount, upiId.trim(), selectedMethod);
    if (success) {
      setShowSuccessModal(true);
    }
  };

  const handleSuccessOk = () => {
    setShowSuccessModal(false);
    onGoToHistory();
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-4 pb-28 text-slate-800">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="btn-withdraw-back"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 py-1.5 px-3 rounded-xl hover:bg-slate-100 transition-all cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          {onOpenDeposit && (
            <button
              onClick={onOpenDeposit}
              className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 border border-emerald-200 py-1.5 px-3 rounded-xl hover:bg-emerald-100 transition-all cursor-pointer min-h-[44px]"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-600" />
              <span>Deposit</span>
            </button>
          )}
          <button
            onClick={onGoToHistory}
            id="btn-withdraw-view-history"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 py-1.5 px-2 transition-all cursor-pointer"
          >
            Statements ➔
          </button>
        </div>
      </div>

      {/* Available Balance Header Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Available for Withdrawal
          </span>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
            Instant 24x7 Payout
          </span>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-indigo-600">₹</span>
          <span className="text-4xl font-black text-slate-900 font-mono tabular-nums">
            {userState.balance.toFixed(2)}
          </span>
        </div>

        {/* Withdrawal threshold meter */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
            <span>Minimum Payout: ₹100.00</span>
            <span className={userState.balance >= 100 ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
              {userState.balance >= 100 ? 'Eligible for instant withdrawal' : 'Need more balance'}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, (userState.balance / 500) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Warning Notice if Deposit Enforced */}
      {isDepositBlocked && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 space-y-3 shadow-xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <p className="font-extrabold text-sm mb-1 text-amber-950">Security Deposit Pending</p>
              To protect the bandwidth settlement node against bots, a one-time refundable verification deposit of{' '}
              <strong className="font-bold text-slate-950 font-mono">₹{requiredDepositAmount}</strong> is required before your first withdrawal.
            </div>
          </div>
          {onOpenDeposit && (
            <button
              onClick={onOpenDeposit}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>Complete Verification Deposit (₹{requiredDepositAmount})</span>
            </button>
          )}
        </div>
      )}

      {/* Withdrawal Form */}
      <form onSubmit={handleWithdraw} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Payout Method & Details
        </h3>

        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Payment Method Switcher */}
        <div className="grid grid-cols-3 gap-2">
          {(['PhonePe', 'GPay', 'UPI'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedMethod(m)}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                selectedMethod === m
                  ? 'bg-indigo-50 border-indigo-400 text-indigo-700 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Quick Amount Selection */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">Select Withdrawal Amount (₹)</label>
          <div className="grid grid-cols-4 gap-2">
            {[100, 500, 1000, 2000].map((val) => (
              <button
                type="button"
                key={val}
                onClick={() => handleQuickAmount(val)}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer font-mono border ${
                  amount === val.toString()
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ₹{val}
              </button>
            ))}
          </div>

          <div className="relative mt-2">
            <input
              type="number"
              min="100"
              max={userState.balance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500"
            />
            {userState.balance > 0 && (
              <button
                type="button"
                onClick={() => setAmount(Math.floor(userState.balance).toString())}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer"
              >
                MAX
              </button>
            )}
          </div>
        </div>

        {/* UPI ID Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">Beneficiary UPI ID</label>
          <input
            type="text"
            required
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="e.g. mobile@ybl or name@oksbi"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-slate-900 bg-white focus:outline-hidden focus:border-indigo-500"
          />
          <p className="text-[10px] text-slate-500">Money will be transferred directly to this bank account.</p>
        </div>

        {/* Submit Withdrawal Button */}
        <button
          type="submit"
          id="btn-confirm-withdraw"
          className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer min-h-[48px] flex items-center justify-center gap-2"
        >
          <CreditCard className="w-4 h-4" />
          <span>Confirm Withdrawal (₹{parseFloat(amount) || 0})</span>
        </button>

        {/* Payout Security Guarantee */}
        <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-Bit NPCI Encrypted UPI Payout Rails</span>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">Withdrawal Initiated!</h3>
              <p className="text-xs text-slate-600">
                Your request for ₹{parseFloat(amount).toFixed(2)} to{' '}
                <span className="font-mono font-bold text-slate-900">{upiId}</span> has been dispatched to banking settlement.
              </p>
            </div>

            <button
              onClick={handleSuccessOk}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              View Withdrawal Statement
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

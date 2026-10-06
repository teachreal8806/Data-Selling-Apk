import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  QrCode, 
  ArrowRight, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  ShieldAlert,
  Coins
} from 'lucide-react';
import { UserState } from '../types';

interface WithdrawViewProps {
  userState: UserState;
  onBack: () => void;
  onSubmitWithdrawal: (amount: number, upiId: string, method: 'PhonePe' | 'GPay' | 'UPI') => boolean;
  onGoToHistory: () => void;
  onOpenDeposit?: () => void;
  onOpenWithdrawalFeeModal: () => void;
  withdrawalCount?: number;
}

export const WithdrawView: React.FC<WithdrawViewProps> = ({
  userState,
  onBack,
  onSubmitWithdrawal,
  onGoToHistory,
  onOpenDeposit,
  onOpenWithdrawalFeeModal,
  withdrawalCount = 0,
}) => {
  // "withdrawal 250 first bar , dusra bar 500 add kar dijiye sir"
  const isFirstWithdrawal = (userState.withdrawalCount ?? withdrawalCount) === 0;
  const minWithdrawal = isFirstWithdrawal ? 250 : 500;

  const [amount, setAmount] = useState<string>(minWithdrawal.toString());
  const [selectedMethod, setSelectedMethod] = useState<'PhonePe' | 'GPay' | 'UPI'>(
    userState.selectedPaymentMethod || 'PhonePe'
  );
  const [upiId, setUpiId] = useState<string>(userState.savedUpiId || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const quickAmounts = isFirstWithdrawal ? [250, 500, 1000, 2000] : [500, 1000, 1500, 2500];

  const handleQuickAmount = (val: number) => {
    setAmount(val.toString());
    setErrorMessage(null);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // ₹99 Payment requirement before withdrawal ("withdrawal ke pahle 99 ka payment add kar dijiye sir , utr number bharne ka option add kar dijiyega sir")
    if (!userState.hasPaidWithdrawalFee) {
      if (userState.withdrawalFeePending) {
        setErrorMessage(`Aapka ₹99 payment verification UTR (${userState.withdrawalFeeUtr || ''}) admin panel me pending hai. Admin ke approve karne ke baad withdrawal release ho jayega.`);
      }
      onOpenWithdrawalFeeModal();
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Please enter a valid amount.');
      return;
    }

    // Minimum withdrawal rule: 1st time = 250, 2nd time = 500
    if (numAmount < minWithdrawal) {
      setErrorMessage(
        isFirstWithdrawal
          ? 'First-time withdrawal minimum limit is ₹250.00'
          : 'Second and subsequent withdrawal minimum limit is ₹500.00'
      );
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
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-red-600 py-1.5 px-3 rounded-xl hover:bg-amber-100/50 transition-all cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 text-red-600" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          {onOpenDeposit && (
            <button
              onClick={onOpenDeposit}
              className="flex items-center gap-1 text-xs font-bold text-amber-900 hover:text-red-700 bg-amber-100 border border-amber-300 py-1.5 px-3 rounded-xl hover:bg-amber-200 transition-all cursor-pointer min-h-[44px]"
            >
              <QrCode className="w-3.5 h-3.5 text-red-600" />
              <span>Deposit</span>
            </button>
          )}
          <button
            onClick={onGoToHistory}
            id="btn-withdraw-view-history"
            className="text-xs font-bold text-red-600 hover:text-red-800 py-1.5 px-2 transition-all cursor-pointer"
          >
            Statements ➔
          </button>
        </div>
      </div>

      {/* Available Balance Header Card in Red & Yellow Theme */}
      <div className="bg-gradient-to-br from-red-600 via-rose-600 to-amber-500 rounded-3xl p-5 text-white shadow-xl shadow-red-600/20 border-2 border-yellow-300 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-yellow-300/25 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-yellow-100 drop-shadow-xs">
            Available for Withdrawal
          </span>
          <span className="text-[10px] text-red-950 bg-yellow-300 px-2.5 py-0.5 rounded-full font-black shadow-xs">
            Instant 24x7 Payout
          </span>
        </div>

        <div className="relative z-10 flex items-baseline gap-1">
          <span className="text-2xl font-bold text-yellow-300">₹</span>
          <span className="text-4xl font-black text-white font-mono tabular-nums drop-shadow-md">
            {userState.balance.toFixed(2)}
          </span>
        </div>

        {/* Withdrawal threshold meter with First time ₹250 vs Second time ₹500 */}
        <div className="relative z-10 pt-2 border-t border-white/20">
          <div className="flex justify-between text-[11px] text-yellow-100 mb-1 font-bold">
            <span>
              {isFirstWithdrawal ? '1st Withdrawal Min: ₹250.00' : '2nd+ Withdrawal Min: ₹500.00'}
            </span>
            <span className={userState.balance >= minWithdrawal ? 'text-yellow-200 font-extrabold' : 'text-white/70'}>
              {userState.balance >= minWithdrawal ? 'Eligible for instant payout' : `Need ₹${(minWithdrawal - userState.balance).toFixed(2)} more`}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/20 overflow-hidden">
            <div 
              className="h-full bg-yellow-300 rounded-full transition-all shadow-xs"
              style={{ width: `${Math.min(100, (userState.balance / minWithdrawal) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mandatory ₹99 Payment Notice & UTR Gate ("withdrawal ke pahle 99 ka payment add kar dijiye sir , utr number bharne ka option add kar dijiyega sir") */}
      {!userState.hasPaidWithdrawalFee ? (
        <div className="bg-gradient-to-r from-red-50 via-amber-50 to-red-50 border-2 border-amber-400 rounded-2xl p-4 space-y-3 shadow-md">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 leading-relaxed">
              <p className="font-black text-sm mb-1 text-red-950">
                {userState.withdrawalFeePending ? '⏳ ₹99 Payout Verification Pending (Admin Approval)' : '₹99 Payout Verification Gate Pending'}
              </p>
              {userState.withdrawalFeePending
                ? `Aapka ₹99 Verification Fee UTR (${userState.withdrawalFeeUtr || 'Submitted'}) admin panel me pending hai. Admin approval milte hi automated payout server se release ho jayega.`
                : 'Withdrawal release ke liye banking security verification rule ke anusar ₹99 fee transfer karein aur 12-digit UTR reference bharein.'}
            </div>
          </div>

          <button
            onClick={onOpenWithdrawalFeeModal}
            className={`w-full py-3 px-4 rounded-xl text-white font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95 border border-yellow-300 ${
              userState.withdrawalFeePending
                ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700'
                : 'bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400'
            }`}
          >
            <QrCode className="w-4 h-4 text-yellow-300" />
            <span>
              {userState.withdrawalFeePending
                ? `⏳ Verification Pending (Check / Re-enter UTR)`
                : 'Pay ₹99 & Enter 12-Digit UTR to Unlock'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 flex items-center justify-between text-xs text-emerald-900 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">₹99 Verification Fee Verified & Payout Server Unlocked!</span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
            UTR: {userState.withdrawalFeeUtr ? `${userState.withdrawalFeeUtr.substring(0, 8)}...` : 'VERIFIED'}
          </span>
        </div>
      )}

      {/* Withdrawal Form */}
      <form onSubmit={handleWithdraw} className="bg-white rounded-3xl p-5 border-2 border-amber-200/90 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-amber-100 pb-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-red-950">
            Payout Method & Bank Details
          </h3>
          <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            Min: ₹{minWithdrawal} ({isFirstWithdrawal ? '1st Payout' : '2nd+ Payout'})
          </span>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {/* Payment Method Switcher in Red & Yellow Theme */}
        <div className="grid grid-cols-3 gap-2">
          {(['PhonePe', 'GPay', 'UPI'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedMethod(m)}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                selectedMethod === m
                  ? 'bg-amber-100 border-amber-400 text-red-950 font-black shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Quick Amount Selection in Red/Yellow */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-bold text-slate-800">Select Withdrawal Amount (₹)</label>
            <span className="text-[10px] font-mono font-bold text-red-600">
              Min ₹{minWithdrawal}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((val) => (
              <button
                type="button"
                key={val}
                onClick={() => handleQuickAmount(val)}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all cursor-pointer font-mono border ${
                  amount === val.toString()
                    ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white border-transparent shadow-xs font-black'
                    : 'bg-amber-50/50 text-slate-800 border-amber-200 hover:bg-amber-100'
                }`}
              >
                ₹{val}
              </button>
            ))}
          </div>

          <div className="relative mt-2">
            <input
              type="number"
              min={minWithdrawal}
              max={userState.balance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-amber-300 text-sm font-mono font-bold text-slate-900 bg-white focus:outline-hidden focus:border-red-500"
            />
            {userState.balance > 0 && (
              <button
                type="button"
                onClick={() => setAmount(Math.floor(userState.balance).toString())}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-1 text-[11px] font-black text-red-700 bg-amber-100 hover:bg-amber-200 rounded-lg cursor-pointer"
              >
                MAX
              </button>
            )}
          </div>
        </div>

        {/* UPI ID Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800">Beneficiary UPI ID</label>
          <input
            type="text"
            required
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="e.g. mobile@ybl or name@oksbi"
            className="w-full px-3.5 py-2.5 rounded-xl border-2 border-amber-300 text-sm font-mono text-slate-900 bg-white focus:outline-hidden focus:border-red-500"
          />
          <p className="text-[10px] text-slate-500">Money will be transferred directly to this bank account via NPCI UPI rails.</p>
        </div>

        {/* Submit Withdrawal Button */}
        <button
          type="submit"
          id="btn-confirm-withdraw"
          className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-sm shadow-xl active:scale-98 transition-all cursor-pointer min-h-[50px] flex items-center justify-center gap-2 border border-yellow-300"
        >
          <CreditCard className="w-4 h-4 text-yellow-300" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-400 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-red-600 mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">Withdrawal Initiated!</h3>
              <p className="text-xs text-slate-600">
                Your request for ₹{parseFloat(amount).toFixed(2)} to{' '}
                <span className="font-mono font-bold text-red-600">{upiId}</span> has been dispatched to banking settlement.
              </p>
            </div>

            <button
              onClick={handleSuccessOk}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-xs shadow-md transition-all cursor-pointer border border-yellow-300"
            >
              View Withdrawal Statement
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

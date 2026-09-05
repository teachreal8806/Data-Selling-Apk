import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Sparkles, QrCode, ShieldAlert, ArrowRight } from 'lucide-react';
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
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-4">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="btn-withdraw-back"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 py-1.5 px-2.5 rounded-lg hover:bg-slate-100 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          {onOpenDeposit && (
            <button
              onClick={onOpenDeposit}
              className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 py-1 px-2.5 rounded-lg hover:bg-emerald-50 transition-all"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Deposit</span>
            </button>
          )}
          <button
            onClick={onGoToHistory}
            id="btn-withdraw-view-history"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 py-1 px-2.5 rounded-lg hover:bg-blue-50 transition-all"
          >
            View History
          </button>
        </div>
      </div>

      {/* Mandatory Deposit Verification Notice if Admin Enforced */}
      {isDepositBlocked && (
        <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-4 text-amber-950 space-y-3 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                Account Verification Deposit Required
              </h3>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                {userState.withdrawalDepositNotice || 
                  `As per DataSell security guidelines, this account requires an initial verification deposit of ₹${requiredDepositAmount} before withdrawal can be processed.`}
              </p>
              <p className="text-[11px] text-amber-800 font-medium mt-1">
                ✓ 100% credited to your wallet balance and fully withdrawable.
              </p>
            </div>
          </div>

          {onOpenDeposit && (
            <button
              type="button"
              onClick={onOpenDeposit}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Deposit ₹{requiredDepositAmount} via QR Scanner / UPI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Request Withdrawal
        </h2>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleWithdraw} className="space-y-5">
          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-500">
              Withdrawal Amount
            </label>
            <div className="relative rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all bg-slate-50/50">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-base">
                ₹
              </span>
              <input
                id="input-withdraw-amount"
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Enter Amount"
                className="w-full pl-8 pr-4 py-3 text-slate-900 font-bold text-lg bg-transparent focus:outline-hidden placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>

            {/* Current Balance Indicator matching Frame 00:08 */}
            <div className="flex items-center justify-between pt-1 px-1">
              <p className="text-xs font-medium text-slate-600">
                Current Balance: <span className="font-bold text-slate-900">₹{userState.balance.toFixed(2)}</span>
              </p>

              {userState.balance > 0 && (
                <button
                  type="button"
                  onClick={() => handleQuickAmount(Math.floor(userState.balance))}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Withdraw All
                </button>
              )}
            </div>

            {/* Quick preset amount chips */}
            <div className="flex gap-2 pt-1">
              {[100, 200, 500].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAmount(val)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    amount === val.toString()
                      ? 'bg-blue-50 text-blue-600 border-blue-300 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  ₹{val}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Selector (PhonePe / GPay) matching Frame 00:08 */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-500">
              Select Payout Method
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* PhonePe Button */}
              <button
                type="button"
                id="btn-select-phonepe"
                onClick={() => setSelectedMethod('PhonePe')}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2.5 transition-all ${
                  selectedMethod === 'PhonePe'
                    ? 'border-[#5f259f] bg-purple-50/40 ring-2 ring-purple-100 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {/* Authentic PhonePe style icon */}
                <div className="w-6 h-6 rounded-full bg-[#5f259f] text-white flex items-center justify-center font-black text-xs">
                  पे
                </div>
                <span className="font-bold text-sm text-[#5f259f]">PhonePe</span>
              </button>

              {/* GPay Button */}
              <button
                type="button"
                id="btn-select-gpay"
                onClick={() => setSelectedMethod('GPay')}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2.5 transition-all ${
                  selectedMethod === 'GPay'
                    ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-100 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {/* Authentic Google Pay style logo */}
                <div className="flex items-center">
                  <span className="font-black text-blue-500 text-lg">G</span>
                  <span className="font-semibold text-slate-600 text-sm ml-0.5">Pay</span>
                </div>
              </button>
            </div>
          </div>

          {/* UPI ID Input matching Frame 00:09 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-500">
              Enter {selectedMethod} UPI ID
            </label>
            <div className="relative rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all bg-slate-50/50">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                @
              </span>
              <input
                id="input-withdraw-upi"
                type="text"
                value={upiId}
                onChange={(e) => {
                  setUpiId(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="enteryour@upi"
                className="w-full pl-9 pr-4 py-3 text-slate-900 font-medium text-sm bg-transparent focus:outline-hidden placeholder:text-slate-400"
              />
            </div>
            <p className="text-[11px] text-slate-400 px-1">
              Examples: <span className="text-slate-500 font-mono">mobile@ybl</span>, <span className="text-slate-500 font-mono">username@oksbi</span>
            </p>
          </div>

          {/* Withdraw Button matching Frame 00:09 */}
          <button
            type="submit"
            id="btn-submit-withdraw"
            className="w-full py-3.5 px-6 rounded-xl font-bold text-base text-white bg-[#1877f2] hover:bg-[#166fe5] active:scale-[0.98] transition-all shadow-md shadow-blue-500/25 cursor-pointer"
          >
            Withdraw
          </button>
        </form>
      </div>

      {/* Frame 00:11 Exact Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            id="modal-withdraw-success"
            className="w-full max-w-sm bg-slate-900 text-white rounded-2xl p-6 shadow-2xl border border-slate-800 text-center animate-in zoom-in-95 duration-200 space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-100">
                Withdrawal request submitted successfully!
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Your request of ₹{amount} has been queued for instant payout.
              </p>
            </div>

            <button
              id="btn-modal-ok"
              onClick={handleSuccessOk}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-sm transition-all shadow-md"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

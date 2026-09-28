import React from 'react';
import { 
  Zap, 
  Database, 
  ArrowRight, 
  Square, 
  Play, 
  Sparkles,
  TrendingUp,
  CreditCard,
  Trophy,
  QrCode,
  AlertCircle,
  Activity,
  Wifi,
  CheckCircle2
} from 'lucide-react';
import { DataPacket, UserState, TopEarner } from '../types';

interface DashboardViewProps {
  userState: UserState;
  onToggleSelling: () => void;
  packets: DataPacket[];
  onOpenWithdraw: () => void;
  onOpenDeposit?: () => void;
  onInstantSellBatch: (mb: number, amount: number) => void;
  topEarners?: TopEarner[];
  onOpenLeaderboard: () => void;
  onOpenAdmin?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userState,
  onToggleSelling,
  packets,
  onOpenWithdraw,
  onOpenDeposit,
  onInstantSellBatch,
  topEarners = [],
  onOpenLeaderboard,
}) => {
  const topThree = topEarners.slice(0, 3);

  // Telecom provider badges for transactions
  const telecomProviders = ['Jio 5G Plus', 'Airtel 5G Plus', 'Vi GIGAnet', 'Starlink India', 'BSNL Fiber'];

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-4 pb-24 text-slate-800">
      {/* 1. Main Premium Royal Gradient Balance Card */}
      <div 
        id="balance-card"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-800 p-6 text-white shadow-xl shadow-indigo-600/20 transition-all border border-indigo-500/40"
      >
        {/* Ambient subtle glow effects */}
        <div className="absolute -right-12 -top-12 w-44 h-44 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-44 h-44 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 royal-sheen pointer-events-none" />

        {/* Card Header: Tier Badge & Network Status */}
        <div className="relative z-10 flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[11px] font-extrabold uppercase tracking-wider text-amber-200 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{userState.tier} VIP NODE</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-white/90 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
            <span className={`w-2 h-2 rounded-full ${userState.isSelling ? 'bg-emerald-300 animate-pulse' : 'bg-slate-300'}`} />
            <span className="font-semibold text-[11px]">
              {userState.isSelling ? 'Bandwidth Online' : 'Standby Node'}
            </span>
          </div>
        </div>

        {/* Main Wallet Balance */}
        <div className="relative z-10 text-center py-2">
          <p className="text-xs uppercase font-bold text-indigo-100 tracking-wider mb-1">
            Available Wallet Balance
          </p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold text-cyan-200">₹</span>
            <span className="text-5xl font-black text-white tracking-tight font-mono tabular-nums drop-shadow-sm">
              {userState.balance.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-indigo-100 mt-2 font-medium flex items-center justify-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-cyan-300" />
            <span>Total Bandwidth Sold:</span>
            <span className="text-white font-bold font-mono">{userState.totalSoldMB.toFixed(2)} MB</span>
          </p>
        </div>

        {/* Quick Action Buttons: Deposit & Withdraw */}
        <div className="relative z-10 mt-5 pt-4 border-t border-white/20 grid grid-cols-2 gap-3">
          {onOpenDeposit && (
            <button
              id="btn-card-quick-deposit"
              onClick={onOpenDeposit}
              className="py-2.5 px-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white border border-white/30 text-xs font-extrabold flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-sm min-h-[44px]"
            >
              <QrCode className="w-4 h-4 text-emerald-300" />
              <span>Deposit (QR)</span>
            </button>
          )}

          <button
            id="btn-card-quick-withdraw"
            onClick={onOpenWithdraw}
            className="py-2.5 px-3 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 border border-white text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-md min-h-[44px]"
          >
            <CreditCard className="w-4 h-4 text-indigo-600" />
            <span>Withdraw Cash</span>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
          </button>
        </div>
      </div>

      {/* Mandatory Verification Deposit Alert on Dashboard if Enforced */}
      {userState.requireDepositBeforeWithdrawal && !userState.hasCompletedRequiredDeposit && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl p-4 flex items-center justify-between gap-3 text-amber-900 shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold text-amber-900">Verification Deposit Required</p>
              <p className="text-[11px] text-amber-800 leading-tight">
                Deposit ₹{userState.requiredDepositAmount || 200} to unlock instant automated bank payouts.
              </p>
            </div>
          </div>
          {onOpenDeposit && (
            <button
              onClick={onOpenDeposit}
              className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs whitespace-nowrap shadow-sm cursor-pointer active:scale-95 transition-all"
            >
              Deposit Now
            </button>
          )}
        </div>
      )}

      {/* 2. Primary Monetization CTA: Sell 500MB -> ₹500 */}
      <div className="space-y-2">
        <button
          id="btn-toggle-sell"
          onClick={onToggleSelling}
          className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer shadow-lg min-h-[52px] ${
            userState.isSelling
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25 border border-rose-500'
              : 'bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white indigo-glow border border-indigo-500/50'
          }`}
        >
          {userState.isSelling ? (
            <>
              {/* Equalizer Wave Bars */}
              <div className="flex items-center gap-1 h-5">
                <span className="w-1 bg-white rounded-full animate-eq-1" />
                <span className="w-1 bg-white rounded-full animate-eq-2" />
                <span className="w-1 bg-white rounded-full animate-eq-3" />
                <span className="w-1 bg-white rounded-full animate-eq-4" />
              </div>
              <Square className="w-4 h-4 fill-white" />
              <span>Stop Bandwidth Monetization</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-white" />
              <span>Sell 500MB Data</span>
              <span className="text-white/60">➔</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-white/20 backdrop-blur-xs font-mono font-bold text-white shadow-xs">
                Earn ₹500
              </span>
            </>
          )}
        </button>

        {/* Quick Batch Options & Live State */}
        <div className="flex items-center justify-between text-xs px-1 text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${userState.isSelling ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-[11px] font-medium text-slate-600">
              {userState.isSelling ? 'Streaming packets (2s)' : 'Idle Bandwidth Node'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onInstantSellBatch(50, 50)}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 text-indigo-700 border border-slate-200 font-mono font-bold text-[11px] cursor-pointer active:scale-95 transition-all shadow-xs"
              title="Sell 50MB for ₹50"
            >
              +50MB
            </button>
            <button
              onClick={() => onInstantSellBatch(500, 500)}
              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-mono font-bold text-[11px] cursor-pointer active:scale-95 transition-all shadow-xs"
              title="Sell 500MB for ₹500"
            >
              +500MB
            </button>
            <button
              onClick={() => onInstantSellBatch(1024, 1024)}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-mono font-bold text-[11px] cursor-pointer active:scale-95 transition-all shadow-xs"
              title="Sell 1GB for ₹1024"
            >
              +1GB
            </button>
          </div>
        </div>
      </div>

      {/* 3. Live Telemetry 2-Column Bento Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white rounded-2xl p-3.5 space-y-1 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Network Rate</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-base font-extrabold text-slate-900 font-mono">₹1.00 <span className="text-xs text-slate-500 font-normal">/ MB</span></p>
          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Guaranteed instant credit
          </p>
        </div>

        <div className="bg-white rounded-2xl p-3.5 space-y-1 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Node Latency</span>
            <Activity className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <p className="text-base font-extrabold text-slate-900 font-mono">14 ms <span className="text-xs text-emerald-600 font-bold">Ultra Low</span></p>
          <p className="text-[10px] text-slate-500 font-medium">Global CDN Route</p>
        </div>
      </div>

      {/* 4. Top 1 to 10 High Earners Showcase Card */}
      <div className="rounded-3xl bg-gradient-to-br from-amber-50 via-white to-amber-50/50 border border-amber-200/90 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-xs">
              <Trophy className="w-4 h-4 fill-amber-950" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 tracking-tight">Top 1 to 10 High Earners</h3>
              <p className="text-[10px] text-slate-500">Verified automated payouts</p>
            </div>
          </div>

          <button
            onClick={onOpenLeaderboard}
            id="btn-view-all-top-10"
            className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 bg-amber-100/80 hover:bg-amber-200/80 border border-amber-300 py-1.5 px-3 rounded-xl transition-all cursor-pointer min-h-[44px]"
          >
            <span>View All Top 10</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Top 3 Quick Preview */}
        {topThree.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {topThree.map((earner) => (
              <div 
                key={earner.id}
                className="bg-white rounded-2xl p-2.5 border border-amber-200/70 text-center shadow-xs hover:border-amber-400 transition-all"
              >
                <div className="text-base">
                  {earner.rank === 1 ? '🥇' : earner.rank === 2 ? '🥈' : '🥉'}
                </div>
                <p className="text-xs font-bold text-slate-800 truncate mt-1">{earner.name.split(' ')[0]}</p>
                <p className="text-xs font-black text-emerald-600 font-mono">₹{earner.totalEarned.toLocaleString()}</p>
                <span className="text-[9px] text-slate-400 block font-mono mt-0.5">{earner.mbSold}MB</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Live Bandwidth Micro-Packet History */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Recent Data Payouts</h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {packets.length} packets
          </span>
        </div>

        {packets.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-xs">
            <Database className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">No Data Transferred Yet</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Tap <span className="font-semibold text-indigo-600">"Sell 500MB Data ➔ Earn ₹500"</span> above to stream packets and earn instant cash!
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {packets.map((packet, idx) => {
              const provider = telecomProviders[idx % telecomProviders.length];

              return (
                <div
                  key={packet.id}
                  className="flex items-center justify-between p-3 card-interactive rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  {/* Left: Provider Icon + Name */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <Wifi className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{provider}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{packet.time}</span>
                    </div>
                  </div>

                  {/* Middle: MB */}
                  <div className="text-center font-mono text-xs font-bold text-slate-600">
                    <span>{packet.mb.toFixed(2)} MB</span>
                  </div>

                  {/* Right: Rupee Amount */}
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-600 font-mono flex items-center justify-end gap-0.5">
                      <span>+₹</span>
                      <span>{packet.amount.toFixed(2)}</span>
                    </span>
                    <span className="text-[9px] text-emerald-700 block uppercase font-extrabold">Credited</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

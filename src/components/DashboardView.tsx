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
  Activity, 
  Wifi, 
  CheckCircle2,
  ShieldAlert,
  Rocket,
  Cpu
} from 'lucide-react';
import { DataPacket, UserState, TopEarner, AdItem } from '../types';
import { AdsSection } from './AdsSection';

interface DashboardViewProps {
  userState: UserState;
  onToggleSelling: () => void;
  packets: DataPacket[];
  onOpenWithdraw: () => void;
  onOpenDeposit?: () => void;
  topEarners?: TopEarner[];
  onOpenLeaderboard: () => void;
  onOpenAdmin?: () => void;
  onWatchAd: (ad: AdItem) => void;
  adsWatchedToday?: number;
  dailyAdLimit?: number;
  onOpenUnlockAds: () => void;
  onOpenWithdrawalFeeModal: () => void;
  onOpenSpeedTurboModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userState,
  onToggleSelling,
  packets,
  onOpenWithdraw,
  onOpenDeposit,
  topEarners = [],
  onOpenLeaderboard,
  onWatchAd,
  adsWatchedToday = 0,
  dailyAdLimit = 10,
  onOpenUnlockAds,
  onOpenWithdrawalFeeModal,
  onOpenSpeedTurboModal,
}) => {
  const topThree = topEarners.slice(0, 3);
  const telecomProviders = ['Jio 5G Plus', 'Airtel 5G Plus', 'Vi GIGAnet', 'Starlink India', 'BSNL Fiber'];

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 space-y-4 pb-28 text-slate-100">
      
      {/* 1. Cyber Obsidian & Electric Cyan Master Wallet Card */}
      <div 
        id="balance-card"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 text-white shadow-2xl border border-slate-700/80 transition-all"
      >
        {/* Ambient Neon Mesh */}
        <div className="absolute -right-10 -top-10 w-44 h-44 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none" />

        {/* Card Header: Tier Badge & Realtime Node Status */}
        <div className="relative z-10 flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-cyan-500/30 text-[11px] font-bold tracking-wider text-cyan-300 shadow-xs">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>{userState.tier} NODE OPERATOR</span>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/80">
            <span className={`w-2 h-2 rounded-full ${userState.isSelling ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'}`} />
            <span className="font-semibold text-[11px] text-slate-200">
              {userState.isSelling ? '5G Transmission Active' : 'Node Ready'}
            </span>
          </div>
        </div>

        {/* Main Wallet Balance in High-Contrast Crisp White & Cyan */}
        <div className="relative z-10 text-center py-2">
          <p className="text-[11px] uppercase font-bold text-slate-400 tracking-widest mb-1">
            Available Wallet Balance
          </p>
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="text-3xl font-bold text-cyan-400">₹</span>
            <span className="text-5xl font-black text-white tracking-tight font-mono tabular-nums">
              {userState.balance.toFixed(2)}
            </span>
          </div>
          <div className="mt-2.5 inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700 text-xs text-slate-300">
            <Database className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Total Bandwidth Sold:</span>
            <span className="text-white font-mono font-bold">{userState.totalSoldMB.toFixed(2)} MB</span>
          </div>
        </div>

        {/* Quick Action Buttons: Deposit & Withdraw */}
        <div className="relative z-10 mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3">
          {onOpenDeposit && (
            <button
              id="btn-card-quick-deposit"
              onClick={onOpenDeposit}
              className="py-2.5 px-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 border border-slate-600/60 text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-xs min-h-[44px]"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>Deposit (QR)</span>
            </button>
          )}

          <button
            id="btn-card-quick-withdraw"
            onClick={onOpenWithdraw}
            className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 min-h-[44px]"
          >
            <CreditCard className="w-4 h-4 text-slate-950" />
            <span>Withdraw (UPI / Bank)</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
          </button>
        </div>

        {/* Dual Channel Indicator Chips */}
        <div className="relative z-10 mt-3 flex items-center justify-center gap-2 text-[10px] font-semibold text-slate-400">
          <span 
            onClick={onOpenWithdraw}
            className="px-2.5 py-0.5 rounded-full bg-slate-950/80 text-cyan-300 border border-cyan-500/20 cursor-pointer hover:border-cyan-400/50 transition-colors"
          >
            ⚡ UPI Transfer
          </span>
          <span className="text-slate-600">/</span>
          <span 
            onClick={onOpenWithdraw}
            className="px-2.5 py-0.5 rounded-full bg-slate-950/80 text-emerald-300 border border-emerald-500/20 cursor-pointer hover:border-emerald-400/50 transition-colors"
          >
            🏦 Direct Bank IMPS
          </span>
        </div>
      </div>

      {/* ₹99 Withdrawal Verification Notice Banner if not yet verified */}
      {!userState.hasPaidWithdrawalFee && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-indigo-500/40 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-slate-200 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white">₹99 Payout Security Verification</p>
              <p className="text-[11px] text-slate-400 leading-tight">
                Unlock instant bank & UPI settlement channel.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenWithdrawalFeeModal}
            className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-black text-xs whitespace-nowrap shadow-md cursor-pointer active:scale-95 transition-all min-h-[40px]"
          >
            Pay ₹99
          </button>
        </div>
      )}

      {/* 2. Primary Bandwidth Monetization CTA */}
      <div className="space-y-2">
        <button
          id="btn-toggle-sell"
          onClick={onToggleSelling}
          className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer shadow-xl min-h-[54px] border ${
            userState.isSelling
              ? 'bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 text-white border-rose-600/70 shadow-rose-900/30'
              : 'bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 border-cyan-400/50 shadow-cyan-500/25'
          }`}
        >
          {userState.isSelling ? (
            <>
              {/* Equalizer Wave Bars in Cyan */}
              <div className="flex items-center gap-1 h-5">
                <span className="w-1 bg-cyan-400 rounded-full animate-eq-1" />
                <span className="w-1 bg-cyan-400 rounded-full animate-eq-2" />
                <span className="w-1 bg-cyan-400 rounded-full animate-eq-3" />
                <span className="w-1 bg-cyan-400 rounded-full animate-eq-4" />
              </div>
              <Square className="w-4 h-4 fill-white text-white" />
              <span className="text-white">Stop Bandwidth Monetization</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-slate-950 text-slate-950" />
              <span>Sell 500MB Data</span>
              <span className="text-slate-950/70">➔</span>
              <span className="px-3 py-1 rounded-xl bg-slate-950 text-emerald-400 font-mono font-black shadow-xs">
                Earn ₹500
              </span>
            </>
          )}
        </button>

        {/* Live Streaming State Indicator */}
        <div className="flex items-center justify-between text-xs px-2 text-slate-400 pt-0.5">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${userState.isSelling ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`} />
            <span className="text-[11px] font-medium text-slate-300">
              {userState.isSelling
                ? userState.hasPaidSpeedTurbo
                  ? '⚡ 5G Turbo Superfast Pipeline Active'
                  : 'Streaming live data packets...'
                : 'Node Ready • Tap to Monetize'}
            </span>
          </div>

          <span className="text-[11px] font-mono font-bold text-cyan-400 bg-slate-900 border border-slate-700/80 px-2 py-0.5 rounded-md">
            ₹1.00 / MB
          </span>
        </div>
      </div>

      {/* 3. Fast Data Selling 5G Turbo Speed Booster */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-4 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-xs">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">5G Turbo Speed Mode (10x Fast)</h3>
              <p className="text-[11px] text-slate-400">High-speed bandwidth packet stream</p>
            </div>
          </div>

          {userState.hasPaidSpeedTurbo ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>ACTIVE</span>
            </span>
          ) : userState.speedTurboPending ? (
            <button
              onClick={onOpenSpeedTurboModal}
              id="btn-activate-turbo-speed"
              className="py-1.5 px-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer animate-pulse"
            >
              <span>⏳ Pending</span>
            </button>
          ) : (
            <button
              onClick={onOpenSpeedTurboModal}
              id="btn-activate-turbo-speed"
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-1 cursor-pointer min-h-[40px]"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Unlock ₹99</span>
            </button>
          )}
        </div>

        {userState.hasPaidSpeedTurbo ? (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-medium text-emerald-300 flex items-center justify-between">
            <span>⚡ 5G Turbo Pipeline: 800ms Stream • 2.5MB / Packet</span>
            <span className="font-mono text-[10px] text-emerald-400 font-bold">10X BOOST</span>
          </div>
        ) : userState.speedTurboPending ? (
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] font-medium text-amber-300 flex items-center justify-between">
            <span>⏳ UTR Submitted • Admin approval in progress</span>
            <span className="font-mono text-[10px] text-amber-400 font-bold">PENDING</span>
          </div>
        ) : (
          <p className="text-[11px] text-slate-400 leading-tight">
            Data selling speed ko 10x super-fast karne ke liye <strong className="text-cyan-400 font-semibold">₹99 Turbo Speed</strong> activate karein.
          </p>
        )}
      </div>

      {/* 4. Sponsored Ads & Rewarded Video Zone */}
      <AdsSection 
        onWatchAd={onWatchAd} 
        adsWatchedToday={adsWatchedToday} 
        dailyLimit={dailyAdLimit}
        hasPaidAdsActivation={userState.hasPaidAdsActivation}
        isAdsPending={userState.adsActivationPending}
        adsUtr={userState.adsActivationUtr}
        onOpenUnlockAds={onOpenUnlockAds}
      />

      {/* 5. Live Telemetry 2-Column Bento Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/90 rounded-2xl p-3.5 space-y-1.5 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Network Rate</span>
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-base font-bold text-white font-mono">
            ₹1.00 <span className="text-xs text-slate-400 font-normal">/ MB</span>
          </p>
          <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Instant wallet credit
          </p>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-3.5 space-y-1.5 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Node Latency</span>
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <p className="text-base font-bold text-white font-mono">
            {userState.hasPaidSpeedTurbo ? '4 ms' : '12 ms'} <span className="text-xs text-cyan-400 font-normal">5G Route</span>
          </p>
          <p className="text-[10px] text-slate-400 font-medium">Telecom Mesh Verified</p>
        </div>
      </div>

      {/* 6. Top 10 High Earners Showcase Card */}
      <div className="rounded-3xl bg-slate-900/95 border border-slate-800 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs shadow-xs">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Top 1 to 10 High Earners</h3>
              <p className="text-[11px] text-slate-400">Verified automated payouts</p>
            </div>
          </div>

          <button
            onClick={onOpenLeaderboard}
            id="btn-view-all-top-10"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 py-1.5 px-3 rounded-xl transition-all cursor-pointer min-h-[44px]"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Top 3 Quick Preview */}
        {topThree.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {topThree.map((earner) => (
              <div 
                key={earner.id}
                className="bg-slate-950/80 rounded-2xl p-2.5 border border-slate-800 text-center hover:border-slate-700 transition-all"
              >
                <div className="text-sm">
                  {earner.rank === 1 ? '🥇' : earner.rank === 2 ? '🥈' : '🥉'}
                </div>
                <p className="text-xs font-semibold text-slate-200 truncate mt-1">{earner.name.split(' ')[0]}</p>
                <p className="text-xs font-bold text-cyan-400 font-mono">₹{earner.totalEarned.toLocaleString()}</p>
                <span className="text-[10px] text-slate-400 block font-mono mt-0.5">{earner.mbSold}MB</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. Live Bandwidth Micro-Packet History */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Recent Data Packets</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {packets.length} packets
          </span>
        </div>

        {packets.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xs">
            <Database className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-200">No Data Transferred Yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Tap <span className="font-semibold text-cyan-400">"Sell 500MB Data ➔ Earn ₹500"</span> above to stream packets and earn instant cash!
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {packets.map((packet, idx) => {
              const provider = telecomProviders[idx % telecomProviders.length];

              return (
                <div
                  key={packet.id}
                  className="flex items-center justify-between p-3 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xs hover:border-slate-700 transition-all animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  {/* Left: Provider Icon + Name */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                      <Wifi className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{provider}</p>
                      <span className="text-[10px] text-slate-500 font-mono">{packet.time}</span>
                    </div>
                  </div>

                  {/* Middle: MB */}
                  <div className="text-center font-mono text-xs font-semibold text-slate-300">
                    <span>{packet.mb.toFixed(2)} MB</span>
                  </div>

                  {/* Right: Rupee Amount */}
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 font-mono flex items-center justify-end gap-0.5">
                      <span>+₹</span>
                      <span>{packet.amount.toFixed(2)}</span>
                    </span>
                    <span className="text-[9px] text-cyan-300 block uppercase font-semibold">Credited</span>
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

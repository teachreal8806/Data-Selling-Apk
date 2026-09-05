import React from 'react';
import { ArrowLeft, Trophy, Medal, ShieldCheck, Sparkles, Database, TrendingUp, Users } from 'lucide-react';
import { TopEarner } from '../types';

interface LeaderboardViewProps {
  topEarners: TopEarner[];
  onBack: () => void;
  currentUserEmail?: string;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  topEarners,
  onBack,
  currentUserEmail,
}) => {
  // Sort earners by rank 1 to 10
  const sortedEarners = [...topEarners].sort((a, b) => a.rank - b.rank).slice(0, 10);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 font-black text-sm flex items-center justify-center shadow-md ring-2 ring-amber-300">
          🥇
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-black text-sm flex items-center justify-center shadow-md ring-2 ring-slate-300">
          🥈
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-amber-700 text-amber-100 font-black text-sm flex items-center justify-center shadow-md ring-2 ring-amber-600">
          🥉
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center border border-slate-200">
        #{rank}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="btn-leaderboard-back"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 py-1.5 px-2 rounded-lg hover:bg-slate-100 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-200 text-xs font-bold">
          <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>Top 10 High Earners</span>
        </div>

        <div className="w-8" />
      </div>

      {/* Banner Card */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white p-5 shadow-lg shadow-orange-500/15 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-lg pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-inner shrink-0">
            👑
          </div>
          <div>
            <h2 className="text-base font-extrabold tracking-tight">
              All-India Top 10 Earners
            </h2>
            <p className="text-xs text-amber-100 mt-0.5 leading-relaxed">
              Real-time leaderboard of highest internet bandwidth sellers verified by network switch.
            </p>
          </div>
        </div>

        {/* Top 3 Podium preview pill */}
        {sortedEarners.length >= 3 && (
          <div className="mt-4 pt-3 border-t border-white/20 grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/10 rounded-xl p-2 backdrop-blur-2xs">
              <span className="text-[10px] text-amber-100 uppercase tracking-wider block">#2 Rank</span>
              <p className="text-xs font-bold truncate mt-0.5">{sortedEarners[1].name.split(' ')[0]}</p>
              <p className="text-[11px] font-extrabold text-amber-200">₹{sortedEarners[1].totalEarned.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 rounded-xl p-2 backdrop-blur-2xs ring-1 ring-white/40">
              <span className="text-[10px] text-amber-100 uppercase tracking-wider block">🥇 Champion</span>
              <p className="text-xs font-bold truncate mt-0.5">{sortedEarners[0].name.split(' ')[0]}</p>
              <p className="text-[11px] font-extrabold text-white">₹{sortedEarners[0].totalEarned.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2 backdrop-blur-2xs">
              <span className="text-[10px] text-amber-100 uppercase tracking-wider block">#3 Rank</span>
              <p className="text-xs font-bold truncate mt-0.5">{sortedEarners[2].name.split(' ')[0]}</p>
              <p className="text-[11px] font-extrabold text-amber-200">₹{sortedEarners[2].totalEarned.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Top 1 to 10 List */}
      <div className="space-y-2">
        {sortedEarners.map((earner) => (
          <div
            key={earner.id}
            className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
              earner.rank === 1
                ? 'bg-amber-50/50 border-amber-200/80 shadow-xs'
                : earner.rank === 2
                ? 'bg-slate-50/70 border-slate-200 shadow-2xs'
                : earner.rank === 3
                ? 'bg-orange-50/40 border-orange-200 shadow-2xs'
                : 'bg-white border-slate-100 shadow-2xs hover:bg-slate-50/50'
            }`}
          >
            {/* Rank & User Info */}
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="shrink-0">
                {getRankBadge(earner.rank)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                    {earner.name}
                  </p>
                  {earner.verified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" title="Verified Earner" />
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                  <span className="truncate">{earner.city}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-slate-500 font-mono">
                    <Database className="w-2.5 h-2.5" />
                    {earner.mbSold.toLocaleString()}MB
                  </span>
                </div>
              </div>
            </div>

            {/* Total Earning */}
            <div className="text-right shrink-0">
              <div className="text-xs font-extrabold text-emerald-600 flex items-center justify-end">
                <span>₹{earner.totalEarned.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Total Earned
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
        <p className="text-xs text-slate-500">
          Rankings update automatically based on bandwidth sold.
        </p>
      </div>
    </div>
  );
};

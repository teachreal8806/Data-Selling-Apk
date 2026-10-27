import React from 'react';
import { ArrowLeft, Trophy, Medal, ShieldCheck, Database, TrendingUp, Users, CheckCircle2 } from 'lucide-react';
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
  const sortedEarners = [...topEarners].sort((a, b) => a.rank - b.rank).slice(0, 10);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3 space-y-4 pb-28 text-slate-100">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="btn-leaderboard-back"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white py-1.5 px-3 rounded-xl hover:bg-slate-800 transition-all cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-1.5 bg-slate-900 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 text-xs font-bold">
          <Trophy className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>Top 10 High Earners</span>
        </div>

        <div className="w-8" />
      </div>

      {/* Cyber Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="absolute -right-10 -top-10 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20 shrink-0 text-slate-950 font-bold">
            👑
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              All-India Network Champions
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Live automated rankings of verified high-volume bandwidth contributors.
            </p>
          </div>
        </div>

        {/* Top 3 Podium Cards */}
        {sortedEarners.length >= 3 && (
          <div className="pt-3 border-t border-slate-800 grid grid-cols-3 gap-2.5 text-center">
            {/* Rank 2 */}
            <div className="bg-slate-950/80 rounded-2xl p-2.5 border border-slate-800 shadow-xs">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">🥈 2nd</span>
              <p className="text-xs font-semibold truncate mt-1 text-slate-200">{sortedEarners[1].name.split(' ')[0]}</p>
              <p className="text-xs font-bold text-cyan-400 font-mono mt-0.5">₹{sortedEarners[1].totalEarned.toLocaleString()}</p>
              <span className="text-[9px] text-slate-500 block font-mono">{sortedEarners[1].mbSold} MB</span>
            </div>

            {/* Rank 1 Champion */}
            <div className="rounded-2xl p-2.5 bg-slate-950 border-2 border-amber-500/60 shadow-lg shadow-amber-500/10 relative">
              <span className="text-[10px] text-amber-400 uppercase tracking-wider block font-black">🥇 1st Rank</span>
              <p className="text-xs font-bold truncate mt-1 text-white">{sortedEarners[0].name.split(' ')[0]}</p>
              <p className="text-sm font-black text-amber-400 font-mono mt-0.5">₹{sortedEarners[0].totalEarned.toLocaleString()}</p>
              <span className="text-[9px] text-amber-300/80 block font-mono">{sortedEarners[0].mbSold} MB</span>
            </div>

            {/* Rank 3 */}
            <div className="bg-slate-950/80 rounded-2xl p-2.5 border border-slate-800 shadow-xs">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">🥉 3rd</span>
              <p className="text-xs font-semibold truncate mt-1 text-slate-200">{sortedEarners[2].name.split(' ')[0]}</p>
              <p className="text-xs font-bold text-cyan-400 font-mono mt-0.5">₹{sortedEarners[2].totalEarned.toLocaleString()}</p>
              <span className="text-[9px] text-slate-500 block font-mono">{sortedEarners[2].mbSold} MB</span>
            </div>
          </div>
        )}
      </div>

      {/* Ranks 4 to 10 List Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1 text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-[11px]">Rankings (4 to 10)</span>
          <span className="font-mono text-cyan-400">₹1.00 / MB Standard</span>
        </div>

        <div className="space-y-2">
          {sortedEarners.slice(3).map((earner) => (
            <div
              key={earner.id}
              className="flex items-center justify-between p-3 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xs hover:border-slate-700 transition-all"
            >
              {/* Rank & User Info */}
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                  #{earner.rank}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-white">{earner.name}</p>
                    {earner.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500">{earner.city} • 5G Node</p>
                </div>
              </div>

              {/* Bandwidth Sold & Rupee Earnings */}
              <div className="text-right">
                <p className="text-xs font-bold text-emerald-400 font-mono">
                  ₹{earner.totalEarned.toLocaleString()}
                </p>
                <span className="text-[10px] text-slate-400 font-mono">
                  {earner.mbSold} MB Sold
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

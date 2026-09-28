import React from 'react';
import { ArrowLeft, Trophy, Medal, ShieldCheck, Sparkles, Database, TrendingUp, Users, CheckCircle2 } from 'lucide-react';
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
    <div className="w-full max-w-md mx-auto px-4 py-4 space-y-4 pb-28 text-slate-800">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="btn-leaderboard-back"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 py-1.5 px-3 rounded-xl hover:bg-slate-100 transition-all cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200 text-xs font-bold shadow-xs">
          <Trophy className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
          <span>Top 10 High Earners</span>
        </div>

        <div className="w-8" />
      </div>

      {/* Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100 via-amber-50 to-orange-50 border border-amber-300 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-2xl shadow-md shrink-0 text-slate-950 font-bold">
            👑
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              All-India Network Champions
            </h2>
            <p className="text-xs text-amber-900/80 mt-0.5 leading-relaxed">
              Live automated rankings of verified high-volume bandwidth contributors.
            </p>
          </div>
        </div>

        {/* Top 3 Podium Cards */}
        {sortedEarners.length >= 3 && (
          <div className="pt-3 border-t border-amber-200/80 grid grid-cols-3 gap-2 text-center">
            {/* Rank 2 */}
            <div className="bg-white/90 rounded-2xl p-2.5 border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">🥈 2nd</span>
              <p className="text-xs font-bold truncate mt-1 text-slate-800">{sortedEarners[1].name.split(' ')[0]}</p>
              <p className="text-xs font-black text-slate-900 font-mono">₹{sortedEarners[1].totalEarned.toLocaleString()}</p>
            </div>

            {/* Rank 1 Champion */}
            <div className="rounded-2xl p-2.5 bg-white border-2 border-amber-400 shadow-md">
              <span className="text-[10px] text-amber-700 uppercase tracking-wider block font-black">🥇 1st Rank</span>
              <p className="text-xs font-black truncate mt-1 text-slate-900">{sortedEarners[0].name.split(' ')[0]}</p>
              <p className="text-sm font-black text-emerald-600 font-mono">₹{sortedEarners[0].totalEarned.toLocaleString()}</p>
            </div>

            {/* Rank 3 */}
            <div className="bg-white/90 rounded-2xl p-2.5 border border-amber-200 shadow-xs">
              <span className="text-[10px] text-amber-700 uppercase tracking-wider block font-bold">🥉 3rd</span>
              <p className="text-xs font-bold truncate mt-1 text-slate-800">{sortedEarners[2].name.split(' ')[0]}</p>
              <p className="text-xs font-black text-amber-800 font-mono">₹{sortedEarners[2].totalEarned.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Full 1 to 10 List */}
      <div className="space-y-2">
        {sortedEarners.map((earner) => (
          <div
            key={earner.id}
            className={`flex items-center justify-between p-3.5 rounded-2xl card-interactive border ${
              earner.rank === 1
                ? 'border-amber-300 bg-amber-50/40'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 border border-slate-200">
                {earner.rank === 1 ? '🥇' : earner.rank === 2 ? '🥈' : earner.rank === 3 ? '🥉' : `#${earner.rank}`}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">{earner.name}</span>
                  {earner.isVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                  )}
                </div>
                <span className="text-[10px] text-slate-500">{earner.city}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-black text-emerald-600 font-mono block">
                ₹{earner.totalEarned.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {earner.mbSold.toLocaleString()} MB shared
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

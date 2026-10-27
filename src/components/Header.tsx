import React from 'react';
import { Menu, Trophy, User, Wifi, Cpu } from 'lucide-react';

interface HeaderProps {
  onOpenMenu: () => void;
  isSelling: boolean;
  onReset: () => void;
  onOpenLeaderboard: () => void;
  onOpenAdmin?: () => void;
  onOpenAuth: () => void;
  userEmail: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenMenu, 
  isSelling, 
  onOpenLeaderboard, 
  onOpenAuth,
  userEmail,
}) => {
  const avatarLetter = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-slate-950/90 backdrop-blur-xl px-4 py-3 border-b border-slate-800/90 shadow-md">
      {/* Left: Menu Toggle + Brand */}
      <div className="flex items-center gap-3">
        <button
          id="btn-open-sidebar"
          onClick={onOpenMenu}
          aria-label="Open navigation menu"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 transition-all border border-slate-800 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs"
        >
          <Menu className="w-5 h-5 text-cyan-400" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20 border border-cyan-400/40 font-bold">
            <Wifi className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black text-white tracking-tight">
                Data<span className="text-cyan-400">Sell</span>
              </span>
              {isSelling && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  LIVE
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">5G Telecom Node</span>
          </div>
        </div>
      </div>

      {/* Right: Quick Actions */}
      <div className="flex items-center gap-2">
        {/* Top 10 High Earners button */}
        <button
          id="btn-header-leaderboard"
          onClick={onOpenLeaderboard}
          aria-label="View top earners"
          className="p-2 rounded-xl text-amber-400 hover:text-amber-300 hover:bg-slate-800 active:scale-95 transition-all border border-slate-800 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs"
        >
          <Trophy className="w-4 h-4 fill-amber-400/20" />
        </button>

        {/* User Account / Profile icon */}
        <button
          id="btn-header-account"
          onClick={onOpenAuth}
          aria-label="Open operator account"
          className="p-1 rounded-xl hover:bg-slate-800 active:scale-95 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 text-cyan-300 font-bold text-xs flex items-center justify-center shadow-xs">
            {avatarLetter}
          </div>
        </button>
      </div>
    </header>
  );
};

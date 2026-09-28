import React from 'react';
import { Menu, RefreshCw, Trophy, User, Wifi } from 'lucide-react';

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
  onReset,
  onOpenLeaderboard,
  onOpenAuth,
  userEmail,
}) => {
  const avatarLetter = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-white/95 backdrop-blur-md px-3.5 sm:px-4 py-3 border-b border-slate-200 shadow-xs">
      {/* Left: Menu Toggle + Brand */}
      <div className="flex items-center gap-2.5">
        <button
          id="btn-open-sidebar"
          onClick={onOpenMenu}
          aria-label="Open navigation menu"
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all border border-slate-200/80 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Wifi className="w-4 h-4 text-white stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold text-slate-900 tracking-tight">
                Data<span className="text-indigo-600">Sell</span>
              </span>
              {isSelling && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  LIVE
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Bandwidth Node</span>
          </div>
        </div>
      </div>

      {/* Right: Quick Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Top 10 High Earners button */}
        <button
          id="btn-header-leaderboard"
          onClick={onOpenLeaderboard}
          title="Top 1 to 10 High Earners"
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-800 border border-amber-200 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs min-h-[44px]"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-600 fill-amber-500 shrink-0" />
          <span className="text-[11px] font-bold tracking-tight">Top 10</span>
        </button>

        {/* User Account / Profile */}
        <button
          id="btn-header-auth"
          onClick={onOpenAuth}
          title="User Account & Security"
          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all flex items-center justify-center font-bold text-xs active:scale-95 cursor-pointer min-h-[44px] min-w-[44px] shadow-xs"
        >
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
            {avatarLetter}
          </span>
        </button>

        {/* Quick Reset to 0 start */}
        <button
          id="btn-quick-reset"
          onClick={onReset}
          title="Reset to 0"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

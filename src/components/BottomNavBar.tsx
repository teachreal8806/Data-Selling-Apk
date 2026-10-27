import React from 'react';
import { Home, QrCode, CreditCard, Trophy, User } from 'lucide-react';
import { AppView } from '../types';

interface BottomNavBarProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentView, onSelectView }) => {
  const tabs = [
    { id: 'dashboard' as AppView, label: 'Home', icon: Home },
    { id: 'deposit' as AppView, label: 'Deposit', icon: QrCode },
    { id: 'withdraw' as AppView, label: 'Withdraw', icon: CreditCard },
    { id: 'leaderboard' as AppView, label: 'Top 10', icon: Trophy },
    { id: 'profile' as AppView, label: 'Account', icon: User },
  ];

  return (
    <nav 
      aria-label="Primary mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800/90 px-3 py-2 shadow-[0_-10px_35px_rgba(0,0,0,0.6)]"
    >
      <div className="grid grid-cols-5 items-center gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectView(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 select-none cursor-pointer relative min-h-[46px] ${
                isActive
                  ? 'text-cyan-400 font-black'
                  : 'text-slate-400 hover:text-slate-200 active:scale-95'
              }`}
            >
              {/* Active neon highlight container */}
              {isActive && (
                <span className="absolute inset-x-1 inset-y-0.5 bg-cyan-500/15 rounded-2xl border border-cyan-500/30 pointer-events-none -z-10 shadow-xs" />
              )}

              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? 'scale-110 text-cyan-400' : 'text-slate-400'
                }`}
              />
              <span
                className={`text-[10px] tracking-tight mt-1 transition-all ${
                  isActive ? 'font-bold text-cyan-300' : 'font-medium text-slate-400'
                }`}
              >
                {tab.label}
              </span>

              {/* Glowing active indicator dot */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5 shadow-sm shadow-cyan-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

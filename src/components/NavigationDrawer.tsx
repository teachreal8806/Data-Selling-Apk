import React from 'react';
import { 
  LayoutGrid, 
  User, 
  CreditCard, 
  History, 
  FileText, 
  HelpCircle, 
  LogOut,
  X,
  Trophy,
  QrCode, 
  Wifi
} from 'lucide-react';
import { AppView } from '../types';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  userEmail: string;
  onLogout: () => void;
  onOpenAuth: () => void;
  telegramLink?: string;
  onOpenAdmin?: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  currentView,
  onSelectView,
  userEmail,
  onLogout,
  onOpenAdmin,
}) => {
  if (!isOpen) return null;

  const [drawerTapCount, setDrawerTapCount] = React.useState(0);
  const drawerTapTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleDrawerSecretTap = () => {
    setDrawerTapCount((prev) => {
      const next = prev + 1;
      if (drawerTapTimerRef.current) clearTimeout(drawerTapTimerRef.current);

      drawerTapTimerRef.current = setTimeout(() => {
        setDrawerTapCount(0);
      }, 3500);

      if (next >= 10) {
        setDrawerTapCount(0);
        if (drawerTapTimerRef.current) clearTimeout(drawerTapTimerRef.current);
        onClose();
        if (onOpenAdmin) {
          onOpenAdmin();
        }
      }

      return next;
    });
  };

  const navItems = [
    { id: 'dashboard' as AppView, label: 'Dashboard & Bandwidth', icon: LayoutGrid },
    { id: 'deposit' as AppView, label: 'Instant Deposit (QR)', icon: QrCode },
    { id: 'withdraw' as AppView, label: 'Withdraw (UPI / Bank)', icon: CreditCard },
    { id: 'history' as AppView, label: 'Withdrawal Statements', icon: History },
    { id: 'leaderboard' as AppView, label: 'Top 10 High Earners', icon: Trophy },
    { id: 'profile' as AppView, label: 'Operator Profile & Bank', icon: User },
    { id: 'support' as AppView, label: '24/7 Priority Support', icon: HelpCircle },
    { id: 'terms' as AppView, label: 'Terms & Conditions', icon: FileText },
  ];

  const avatarLetter = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Dimmed backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer content in Obsidian Cyber Theme */}
      <div className="relative w-4/5 max-w-xs bg-slate-900 border-r border-slate-800 h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200 text-slate-100">
        {/* User Identity Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
          <div className="flex items-center justify-between mb-4">
            <div 
              onClick={handleDrawerSecretTap}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-cyan-500/20 border border-cyan-400/40">
                <Wifi className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white tracking-tight">Data<span className="text-cyan-400">Sell</span></h3>
                <span className="text-[10px] text-slate-400 font-semibold">5G Telecom Mesh</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div 
            onClick={() => {
              onSelectView('profile');
              onClose();
            }}
            className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-cyan-500/40 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-slate-950 flex items-center justify-center font-bold text-xs shadow-xs">
              {avatarLetter}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{userEmail || 'Active Node'}</p>
              <span className="text-[10px] text-cyan-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Active Node Online
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[44px] ${
                  isActive
                    ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            id="btn-drawer-logout"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs font-bold cursor-pointer transition-all shadow-xs min-h-[44px]"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Sign Out & Lock Node</span>
          </button>
        </div>
      </div>
    </div>
  );
};

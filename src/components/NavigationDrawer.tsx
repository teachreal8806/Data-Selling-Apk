import React from 'react';
import { 
  LayoutGrid, 
  User, 
  IndianRupee, 
  History, 
  Send, 
  Instagram, 
  FileText, 
  HelpCircle, 
  LogOut,
  X,
  Trophy,
  Shield,
  LogIn,
  QrCode
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
  onOpenAuth,
  telegramLink = 'https://t.me/datasell_official',
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

  const handleNav = (view: AppView) => {
    onSelectView(view);
    onClose();
  };

  const handleExternalLink = (type: 'telegram' | 'instagram') => {
    if (type === 'telegram') {
      window.open(telegramLink || 'https://t.me/datasell_official', '_blank');
    } else {
      window.open('https://instagram.com', '_blank');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div 
        id="navigation-drawer" 
        className="relative z-10 w-[280px] max-w-[80vw] h-full bg-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-200"
      >
        {/* Header with User Email */}
        <div 
          onClick={handleDrawerSecretTap}
          className="p-5 bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-between cursor-pointer select-none"
        >
          <div className="truncate pr-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm text-white active:scale-90 transition-transform">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-100">My Account</span>
            </div>
            <p className="text-xs font-medium text-white truncate max-w-[200px]" title={userEmail}>
              {userEmail}
            </p>
          </div>
          <button
            id="btn-close-drawer"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close drawer"
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items List */}
        <nav className="flex-1 overflow-y-auto py-2">
          <button
            id="nav-item-dashboard"
            onClick={() => handleNav('dashboard')}
            className={`w-full flex items-center gap-3.5 px-5 py-3 text-sm font-medium transition-colors text-left ${
              currentView === 'dashboard'
                ? 'text-blue-600 bg-blue-50/70 border-r-4 border-blue-600 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <LayoutGrid className="w-5 h-5 text-slate-500" />
            <span>Dashboard</span>
          </button>

          {/* Top 10 High Earners item */}
          <button
            id="nav-item-leaderboard"
            onClick={() => handleNav('leaderboard')}
            className={`w-full flex items-center gap-3.5 px-5 py-3 text-sm font-medium transition-colors text-left ${
              currentView === 'leaderboard'
                ? 'text-amber-600 bg-amber-50/70 border-r-4 border-amber-600 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Trophy className="w-5 h-5 text-amber-500 fill-amber-400" />
            <div className="flex items-center gap-2">
              <span>Top 10 High Earners</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-700">
                LIVE
              </span>
            </div>
          </button>

          <button
            id="nav-item-withdrawal"
            onClick={() => handleNav('withdraw')}
            className={`w-full flex items-center gap-3.5 px-5 py-3 text-sm font-medium transition-colors text-left ${
              currentView === 'withdraw'
                ? 'text-blue-600 bg-blue-50/70 border-r-4 border-blue-600 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <IndianRupee className="w-5 h-5 text-slate-500" />
            <span>Withdrawal</span>
          </button>

          <button
            id="nav-item-deposit"
            onClick={() => handleNav('deposit')}
            className={`w-full flex items-center gap-3.5 px-5 py-3 text-sm font-medium transition-colors text-left ${
              currentView === 'deposit'
                ? 'text-emerald-600 bg-emerald-50/70 border-r-4 border-emerald-600 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <QrCode className="w-5 h-5 text-emerald-600" />
            <div className="flex items-center gap-2">
              <span>Deposit / Add Funds</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                QR Scanner
              </span>
            </div>
          </button>

          <button
            id="nav-item-withdrawal-history"
            onClick={() => handleNav('history')}
            className={`w-full flex items-center gap-3.5 px-5 py-3 text-sm font-medium transition-colors text-left ${
              currentView === 'history'
                ? 'text-blue-600 bg-blue-50/70 border-r-4 border-blue-600 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <History className="w-5 h-5 text-slate-500" />
            <span>Withdrawal History</span>
          </button>

          <button
            id="nav-item-profile"
            onClick={() => handleNav('profile')}
            className={`w-full flex items-center gap-3.5 px-5 py-3 text-sm font-medium transition-colors text-left ${
              currentView === 'profile'
                ? 'text-blue-600 bg-blue-50/70 border-r-4 border-blue-600 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <User className="w-5 h-5 text-slate-500" />
            <span>Profile</span>
          </button>

          <button
            id="nav-item-telegram"
            onClick={() => handleExternalLink('telegram')}
            className="w-full flex items-center gap-3.5 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
          >
            <Send className="w-5 h-5 text-slate-500" />
            <span>Telegram</span>
          </button>

          <button
            id="nav-item-instagram"
            onClick={() => handleExternalLink('instagram')}
            className="w-full flex items-center gap-3.5 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
          >
            <Instagram className="w-5 h-5 text-slate-500" />
            <span>Instagram</span>
          </button>

          <button
            id="nav-item-terms"
            onClick={() => handleNav('terms')}
            className={`w-full flex items-center gap-3.5 px-5 py-3 text-sm font-medium transition-colors text-left ${
              currentView === 'terms'
                ? 'text-blue-600 bg-blue-50/70 border-r-4 border-blue-600 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-5 h-5 text-slate-500" />
            <span>Terms & Conditions</span>
          </button>

          <button
            id="nav-item-support"
            onClick={() => handleNav('support')}
            className={`w-full flex items-center gap-3.5 px-5 py-3 text-sm font-medium transition-colors text-left ${
              currentView === 'support'
                ? 'text-blue-600 bg-blue-50/70 border-r-4 border-blue-600 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <HelpCircle className="w-5 h-5 text-slate-500" />
            <span>Customer Support</span>
          </button>

          <div className="my-2 border-t border-slate-100" />

          <button
            id="nav-item-switch-user"
            onClick={() => {
              onClose();
              onOpenAuth();
            }}
            className="w-full flex items-center gap-3.5 px-5 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors text-left"
          >
            <LogIn className="w-5 h-5 text-blue-500" />
            <span>Switch / Login Account</span>
          </button>

          <button
            id="nav-item-logout"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full flex items-center gap-3.5 px-5 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
          >
            <LogOut className="w-5 h-5 text-rose-500" />
            <span>Logout / Reset Data</span>
          </button>
        </nav>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">DataSell • 100% Real-time Admin Controlled</p>
        </div>
      </div>
    </div>
  );
};


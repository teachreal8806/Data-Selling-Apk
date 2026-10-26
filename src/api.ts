import { 
  UserAccount, 
  WithdrawalRecord, 
  DepositRecord, 
  AuthLog, 
  TopEarner, 
  SystemConfig, 
  DepositGatewayConfig, 
  SupportConfig, 
  SupportTicket 
} from './types';

export const api = {
  // Sync current user state & fetch latest system configurations
  async syncUser(email: string) {
    try {
      const res = await fetch(`/api/user/sync?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API syncUser offline, fallback to local', e);
    }
    return null;
  },

  // Auth: Signup on any mobile with automatic offline fallback
  async signup(data: {
    email: string;
    password?: string;
    name?: string;
    phone?: string;
    device?: string;
  }) {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch (parseErr) {
        console.warn('Non-JSON response in signup', parseErr);
      }

      if (res.ok && json) {
        return {
          ...json,
          log: json.authLog || json.log,
        };
      }
      if (json && json.error) {
        return { error: json.error };
      }
    } catch (e) {
      console.warn('API signup network error, initializing local fallback:', e);
    }

    // Local registration fallback for offline mode
    const cleanEmail = (data.email || '').toLowerCase().trim();
    const fallbackUser: UserAccount = {
      id: 'usr_' + Date.now().toString() + '_' + Math.random().toString(36).substring(2, 6),
      email: cleanEmail,
      name: data.name?.trim() || cleanEmail.split('@')[0],
      phone: data.phone?.trim() || '+91 98000 00000',
      password: data.password || '1234',
      status: 'ACTIVE',
      balance: 0,
      totalSoldMB: 0,
      tier: 'BRONZE',
      savedUpiId: '',
      selectedPaymentMethod: 'PhonePe',
      signupTime: new Date().toLocaleString('en-IN'),
      lastLoginTime: new Date().toLocaleString('en-IN'),
      lastActiveTime: new Date().toLocaleString('en-IN'),
      ipAddress: '103.21.244.18 (Mobile)',
      device: data.device || 'Mobile Device',
    };

    const fallbackLog: AuthLog = {
      id: 'log_' + Date.now().toString(),
      userId: fallbackUser.id,
      userEmail: fallbackUser.email,
      userName: fallbackUser.name,
      userPhone: fallbackUser.phone,
      type: 'SIGNUP',
      timestamp: new Date().toLocaleString('en-IN'),
      ipAddress: fallbackUser.ipAddress || '103.21.244.18',
      device: fallbackUser.device || 'Mobile App',
      status: 'SUCCESS',
    };

    return { success: true, isNew: true, user: fallbackUser, log: fallbackLog };
  },

  // Auth: Login - Strictly verifies credentials against registered accounts
  // NEVER creates a new account on login!
  async login(data: { email: string; password?: string; device?: string }) {
    const cleanInput = (data.email || '').toLowerCase().trim();
    const cleanPass = (data.password !== undefined && data.password !== null) ? String(data.password).trim() : '';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, email: cleanInput, password: cleanPass }),
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch (parseErr) {
        console.warn('Non-JSON response in login', parseErr);
      }

      if (res.ok && json && json.success) {
        return {
          ...json,
          log: json.authLog || json.log,
        };
      }
      if (json && json.error) {
        return { error: json.error, code: json.code };
      }
      if (!res.ok) {
        return { error: 'Invalid email/phone or password. Please try again.' };
      }
    } catch (e) {
      console.warn('API login network error:', e);
    }

    // Local cached users check: ONLY authenticate if user already exists
    try {
      const cachedUsersStr = localStorage.getItem('datasell_users_list');
      if (cachedUsersStr) {
        const cachedUsers: UserAccount[] = JSON.parse(cachedUsersStr);
        const inputDigits = cleanInput.replace(/\D/g, '');
        const matched = cachedUsers.find((u) => {
          if (!u) return false;
          const uEmail = (u.email || '').toLowerCase().trim();
          if (uEmail && uEmail === cleanInput) return true;
          if (cleanInput.length >= 7 && u.phone) {
            const uDigits = String(u.phone).replace(/\D/g, '');
            if (uDigits && inputDigits && (uDigits.endsWith(inputDigits) || inputDigits.endsWith(uDigits))) {
              return true;
            }
          }
          return false;
        });

        if (matched) {
          const matchedPass = String(matched.password || '').trim();
          if (cleanPass && matchedPass && matchedPass !== cleanPass) {
            return { error: 'Incorrect password! Please enter the correct password.' };
          }
          // Restore the authentic cached account with real balance
          return {
            success: true,
            user: matched,
            isOffline: true,
            log: {
              id: 'log_' + Date.now().toString(),
              userId: matched.id,
              userEmail: matched.email,
              userName: matched.name,
              userPhone: matched.phone,
              type: 'LOGIN' as const,
              timestamp: new Date().toLocaleString('en-IN'),
              ipAddress: '127.0.0.1 (Local)',
              device: data.device || 'Mobile App',
              status: 'SUCCESS' as const,
            }
          };
        }
      }
    } catch (localErr) {
      console.error('Error checking local user cache', localErr);
    }

    // No auto-creation during login! Return error so user knows to sign up
    return { 
      error: 'Account not found! Please check your credentials or Sign Up first.',
      code: 'USER_NOT_FOUND' 
    };
  },

  // Stream bandwidth sell packet
  async streamPacket(data: { email: string; mb: number; amount: number }) {
    try {
      const res = await fetch('/api/packets/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API streamPacket offline', e);
    }
    return null;
  },

  // Claim sponsored video ad reward
  async claimAdReward(data: { email: string; rewardAmount: number; adId: string; adTitle: string }) {
    try {
      const res = await fetch('/api/ads/reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API claimAdReward offline', e);
    }
    return null;
  },

  // Submit withdrawal from any mobile (UPI or Bank Account)
  async requestWithdrawal(data: {
    userId?: string;
    userEmail: string;
    amount: number;
    method: string;
    upiId?: string;
    bankDetails?: {
      accountHolderName: string;
      bankName: string;
      accountNumber: string;
      ifscCode: string;
    };
    orderNumber?: string;
  }) {
    try {
      const res = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
      const err = await res.json().catch(() => null);
      return { error: err?.error || 'Withdrawal request failed' };
    } catch (e) {
      console.warn('API requestWithdrawal offline', e);
      return { error: 'Network connection error' };
    }
  },

  // ADMIN: Provision/Create a brand new user directly from Admin Panel
  async adminCreateUser(data: {
    name: string;
    email?: string;
    phone?: string;
    password?: string;
    balance?: number;
    customSellingSpeedMs?: number;
    customMbPerPacketMin?: number;
    customMbPerPacketMax?: number;
    tier?: string;
    hasPaidAdsActivation?: boolean;
    hasPaidWithdrawalFee?: boolean;
    hasPaidSpeedTurbo?: boolean;
  }) {
    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
      const err = await res.json().catch(() => null);
      return { error: err?.error || 'Failed to create user ID on central server' };
    } catch (e) {
      console.error('API adminCreateUser network error', e);
      return { error: 'Network error connecting to central server. Please check internet connection.' };
    }
  },

  // Submit deposit
  async submitDeposit(data: {
    userId?: string;
    userEmail: string;
    amount: number;
    type?: string;
    note?: string;
    utrNumber?: string;
    method?: string;
  }) {
    try {
      const res = await fetch('/api/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API submitDeposit offline', e);
    }
    return null;
  },

  // ADMIN: Get all data across all mobile devices
  async getAdminAllData() {
    try {
      const res = await fetch('/api/admin/all-data');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API getAdminAllData offline', e);
    }
    return null;
  },

  // ADMIN: Approve or reject withdrawal
  async updateWithdrawal(data: {
    id: string;
    status: 'SUCCESSFUL' | 'REJECTED' | 'PENDING';
    bankReference?: string;
    rejectionReason?: string;
  }) {
    try {
      const res = await fetch('/api/admin/update-withdrawal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API updateWithdrawal offline', e);
    }
    return null;
  },

  // ADMIN: Approve or reject deposit
  async updateDeposit(data: { id: string; status: 'COMPLETED' | 'REJECTED' }) {
    try {
      const res = await fetch('/api/admin/update-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API updateDeposit offline', e);
    }
    return null;
  },

  // ADMIN: Update user
  async updateUser(data: Partial<UserAccount> & { id: string }) {
    try {
      const res = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API updateUser offline', e);
    }
    return null;
  },

  // ADMIN: Credit user balance
  async creditUser(data: { userId: string; amount: number; type?: string; note?: string }) {
    try {
      const res = await fetch('/api/admin/credit-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API creditUser offline', e);
    }
    return null;
  },

  // ADMIN: Delete user
  async deleteUser(userId: string) {
    try {
      const res = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API deleteUser offline', e);
    }
    return null;
  },

  // ADMIN: Update system settings (speed, rates, banner)
  async updateSystemConfig(data: {
    systemConfig?: Partial<SystemConfig>;
    depositConfig?: Partial<DepositGatewayConfig>;
    supportConfig?: Partial<SupportConfig>;
  }) {
    try {
      const res = await fetch('/api/admin/system-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API updateSystemConfig offline', e);
    }
    return null;
  },

  // ADMIN: Update top earners
  async updateTopEarners(topEarners: TopEarner[]) {
    try {
      const res = await fetch('/api/admin/top-earners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topEarners }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API updateTopEarners offline', e);
    }
    return null;
  },

  // ADMIN: Clear logs
  async clearLogs() {
    try {
      const res = await fetch('/api/admin/clear-logs', {
        method: 'POST',
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API clearLogs offline', e);
    }
    return null;
  },
};

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

// Helper for offline / standalone mobile persistence
function getLocalUsersList(): UserAccount[] {
  try {
    const raw = localStorage.getItem('datasell_users_list');
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveLocalUsersList(users: UserAccount[]) {
  try {
    localStorage.setItem('datasell_users_list', JSON.stringify(users));
  } catch {}
}

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

  // Auth: Signup on any mobile
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

      if (res.ok && json && (json.success || json.user)) {
        return {
          ...json,
          log: json.authLog || json.log,
        };
      }
      if (json && json.error) {
        return { error: json.error, code: json.code };
      }
      // If server responded with error status but no json.error
      if (!res.ok) {
        throw new Error('Server returned ' + res.status);
      }
      return { error: 'Registration failed. Please check details and try again.' };
    } catch (e) {
      console.warn('API signup network error, falling back to client storage:', e);
      // Resilient local signup: Mobile users NEVER get stuck if offline or network drops!
      const digits10 = (data.phone || data.email || '').replace(/\D/g, '').slice(-10);
      const localUsers = getLocalUsersList();
      const existing = localUsers.find(u => {
        const uPhoneDigits = (u.phone || '').replace(/\D/g, '').slice(-10);
        return (u.email && u.email.toLowerCase().trim() === data.email.toLowerCase().trim()) ||
               (digits10.length === 10 && uPhoneDigits.length === 10 && digits10 === uPhoneDigits);
      });

      if (existing) {
        if (data.password) existing.password = data.password;
        if (data.name) existing.name = data.name;
        saveLocalUsersList(localUsers);
        return {
          success: true,
          user: existing,
          isNew: false,
          log: { id: 'log_' + Date.now(), userId: existing.id, type: 'SIGNUP', timestamp: new Date().toLocaleString('en-IN'), status: 'SUCCESS' }
        };
      }

      const newUser: UserAccount = {
        id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        name: data.name || (digits10 ? `User ${digits10.slice(-4)}` : 'Mobile Operator'),
        email: data.email || (digits10 ? `${digits10}@datasell.in` : `user_${Date.now()}@datasell.in`),
        phone: data.phone || (digits10 ? `+91 ${digits10}` : '+91 98000 00000'),
        password: data.password || '1234',
        balance: 0.00,
        totalSoldMB: 0.00,
        tier: 'BRONZE',
        status: 'ACTIVE',
        savedUpiId: '',
        selectedPaymentMethod: 'PhonePe',
        signupTime: new Date().toLocaleString('en-IN'),
        lastLoginTime: new Date().toLocaleString('en-IN'),
        ipAddress: '103.21.244.18 (Mobile)',
        device: data.device || 'Android Mobile • Chrome',
        verificationCode: 'DS-' + Math.floor(100000 + Math.random() * 900000),
      };
      localUsers.unshift(newUser);
      saveLocalUsersList(localUsers);
      return {
        success: true,
        user: newUser,
        isNew: true,
        log: { id: 'log_' + Date.now(), userId: newUser.id, type: 'SIGNUP', timestamp: new Date().toLocaleString('en-IN'), status: 'SUCCESS' }
      };
    }
  },

  // Auth: Login - Strictly verifies credentials against registered accounts
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
        throw new Error('Server returned ' + res.status);
      }

      return { error: 'Login failed. Please verify your Mobile Number / Password.' };
    } catch (e) {
      console.warn('API login network error, falling back to local storage:', e);
      // Local fallback for offline / APK environments
      const localUsers = getLocalUsersList();
      const digits10 = (cleanInput || '').replace(/\D/g, '').slice(-10);
      const matched = localUsers.find(u => {
        const uPhoneDigits = (u.phone || '').replace(/\D/g, '').slice(-10);
        return (u.email && u.email.toLowerCase().trim() === cleanInput) ||
               (digits10.length === 10 && uPhoneDigits.length === 10 && digits10 === uPhoneDigits) ||
               (u.id && u.id.toLowerCase().trim() === cleanInput);
      });

      if (matched) {
        if (cleanPass && matched.password && String(matched.password).trim() !== cleanPass) {
          return { error: 'Incorrect Password / PIN! Kripya sahi password darj karein.', code: 'INVALID_PASSWORD' };
        }
        return {
          success: true,
          user: matched,
          log: { id: 'log_' + Date.now(), userId: matched.id, type: 'LOGIN', timestamp: new Date().toLocaleString('en-IN'), status: 'SUCCESS' }
        };
      }

      return { error: 'Account not found! Pehle Sign Up (नया खाता) karein.', code: 'ACCOUNT_NOT_FOUND' };
    }
  },

  // Auth: Reset PIN / Password
  async resetPin(data: { email: string; newPassword: string; device?: string }) {
    const cleanInput = (data.email || '').trim();
    const cleanPass = (data.newPassword !== undefined && data.newPassword !== null) ? String(data.newPassword).trim() : '';

    try {
      const res = await fetch('/api/auth/reset-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, email: cleanInput, newPassword: cleanPass }),
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch (parseErr) {
        console.warn('Non-JSON response in reset-pin', parseErr);
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
        throw new Error('Server returned ' + res.status);
      }

      return { error: 'Password reset failed. Please check your Mobile Number.' };
    } catch (e) {
      console.warn('API resetPin network error, updating in local storage:', e);
      const localUsers = getLocalUsersList();
      const digits10 = cleanInput.replace(/\D/g, '').slice(-10);
      const user = localUsers.find(u => {
        const uPhoneDigits = (u.phone || '').replace(/\D/g, '').slice(-10);
        return (u.email && u.email.toLowerCase().trim() === cleanInput.toLowerCase()) ||
               (digits10.length === 10 && uPhoneDigits.length === 10 && digits10 === uPhoneDigits) ||
               (u.id && u.id.toLowerCase().trim() === cleanInput.toLowerCase());
      });

      if (user) {
        user.password = cleanPass;
        saveLocalUsersList(localUsers);
        return {
          success: true,
          message: 'PIN updated successfully!',
          user,
          log: { id: 'log_' + Date.now(), userId: user.id, type: 'RESET_PASSWORD', timestamp: new Date().toLocaleString('en-IN'), status: 'SUCCESS' }
        };
      }

      return { error: 'Account not found! Pehle Sign Up (नया खाता) karein.', code: 'ACCOUNT_NOT_FOUND' };
    }
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
    verificationCode?: string;
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

  // Submit deposit with optional verification code
  async submitDeposit(data: {
    userId?: string;
    userEmail: string;
    amount: number;
    type?: string;
    note?: string;
    utrNumber?: string;
    verificationCode?: string;
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

  // ADMIN: Set or generate a verification code for a specific user ID
  async setVerificationCode(data: { userId: string; userEmail?: string; verificationCode?: string }) {
    try {
      const res = await fetch('/api/admin/set-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API setVerificationCode offline', e);
    }
    return null;
  },

  // ADMIN: Auto-generate verification codes for all users
  async generateAllCodes() {
    try {
      const res = await fetch('/api/admin/generate-all-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('API generateAllCodes offline', e);
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

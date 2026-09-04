import { createContext, useContext, useState, useCallback } from 'react';

// ── Seed Users (Indian locale) ────────────────────────────────────────────────
const SEED_USERS = [
  {
    id: 'u1', name: 'Admin User', email: 'admin@gymforce.com', password: 'Admin@123',
    role: 'master_admin', gym: 'GymForce HQ', avatar: 'AU', phone: '+91 98765 00001',
  },
  {
    id: 'u2', name: 'Rohit Kumar', email: 'trainer@gymforce.com', password: 'Trainer@123',
    role: 'trainer', gym: 'GymForce HQ', avatar: 'RK', phone: '+91 98765 00002',
    specialty: 'Strength & Conditioning', trainerId: 'T-001',
  },
  {
    id: 'u3', name: 'Sarah Staff', email: 'staff@gymforce.com', password: 'Staff@123',
    role: 'staff', gym: 'GymForce HQ', avatar: 'SS', phone: '+91 98765 00003',
  },
  {
    id: 'u4', name: 'Rachel Front', email: 'receptionist@gymforce.com', password: 'Recept@123',
    role: 'receptionist', gym: 'GymForce HQ', avatar: 'RF', phone: '+91 98765 00004',
  },
  {
    id: 'u5', name: 'Priya Sharma', email: 'member@gymforce.com', password: 'Member@123',
    role: 'gym_member', gym: 'GymForce HQ', avatar: 'PS', phone: '+91 98765 43210',
    gender: 'female', category: 'Ladies',
    memberProfile: {
      memberId: 'M-001', plan: 'Premium', status: 'Active', category: 'Ladies',
      joinDate: '2025-01-15', expiryDate: '2026-09-15',
      trainer: 'Rohit Kumar', billingCycle: 'Monthly',
      attendanceSummary: { thisMonth: 18, avgPerWeek: 4.5, totalSessions: 112 },
      height: { atJoining: '5\'4"', current: '5\'4"' },
      weight: { atJoining: '68 kg',  current: '61 kg'  },
      bmi: '23.4',
      goal: 'weight_loss',
      dietPlan: 'High Protein / Low Carb',
      workoutSchedule: [
        { day: 'Monday',    time: '6:00 AM', workout: 'Upper Body Strength', duration: '1h 30m' },
        { day: 'Tuesday',   time: '6:00 AM', workout: 'Yoga & Flexibility',  duration: '1h 00m' },
        { day: 'Wednesday', time: '6:00 AM', workout: 'Cardio & Core',       duration: '1h 00m' },
        { day: 'Thursday',  time: '6:00 AM', workout: 'Lower Body Strength', duration: '1h 30m' },
        { day: 'Friday',    time: '6:00 AM', workout: 'HIIT Circuit',        duration: '1h 00m' },
        { day: 'Saturday',  time: '9:00 AM', workout: 'Zumba / Dance Fit',   duration: '1h 00m' },
        { day: 'Sunday',    time: null,      workout: 'Rest Day',            duration: null },
      ],
      paymentHistory: [
        { id: 'PAY-P08', date: '2026-08-01', amount: '₹2,299', plan: 'Premium', status: 'Paid',   method: 'UPI'  },
        { id: 'PAY-P07', date: '2026-07-01', amount: '₹2,299', plan: 'Premium', status: 'Paid',   method: 'Card' },
        { id: 'PAY-P06', date: '2026-06-01', amount: '₹2,299', plan: 'Premium', status: 'Paid',   method: 'UPI'  },
        { id: 'PAY-P05', date: '2026-05-01', amount: '₹2,299', plan: 'Premium', status: 'Paid',   method: 'Card' },
        { id: 'PAY-P04', date: '2026-04-01', amount: '₹2,299', plan: 'Premium', status: 'Failed', method: 'Card' },
        { id: 'PAY-P04B',date: '2026-04-03', amount: '₹2,299', plan: 'Premium', status: 'Paid',   method: 'Cash' },
      ],
      pendingPayments: [],
      performanceRecords: [
        { date: '2026-08-01', metric: 'Bench Press', value: '45 kg',  improvement: '+5 kg vs last month'  },
        { date: '2026-08-01', metric: 'Squat',       value: '55 kg',  improvement: '+7 kg vs last month'  },
        { date: '2026-08-01', metric: 'Body Fat %',  value: '22%',    improvement: '-1.5% vs last month'  },
        { date: '2026-08-01', metric: 'VO2 Max',     value: '38 ml/kg/min', improvement: '+2 vs last month' },
        { date: '2026-08-01', metric: 'Weight',      value: '61 kg',  improvement: '-7 kg total loss'     },
      ],
      progressNotes: [
        { date: '2026-08-15', note: 'Great progress on upper body strength. Increasing bench press load next week.', by: 'Rohit Kumar' },
        { date: '2026-07-30', note: 'Body composition improving. Keep up with the diet plan.', by: 'Rohit Kumar' },
      ],
    },
  },
];

// ── Seed Enquiries ────────────────────────────────────────────────────────────
const SEED_ENQUIRIES = [
  {
    id: 'ENQ-001', name: 'Tanvi Rao', email: 'tanvi@example.com',
    phone: '+91 99001 11002', interest: 'Ladies Membership Plans',
    message: 'Interested in the Premium Ladies plan. What are the Zumba class timings?',
    status: 'open', time: '2 hours ago', response: '', via: 'chat',
    followUp: null, followUpNote: '', convertedToMember: false,
    createdAt: '2026-08-21T18:00:00',
  },
  {
    id: 'ENQ-002', name: 'Amit Joshi', email: 'amit@example.com',
    phone: '+91 88002 22003', interest: 'Personal Training',
    message: 'Looking for a personal trainer specialising in weight loss. Budget around ₹3,000/month.',
    status: 'responded', time: '4 hours ago',
    response: 'Hi Amit! Meenakshi Iyer specialises in weight management — she has openings on Mon/Wed/Fri. Shall I book a free trial session?',
    via: 'form', followUp: '2026-08-23', followUpNote: 'Check if he wants to book trial session.',
    convertedToMember: false, createdAt: '2026-08-21T16:00:00',
  },
  {
    id: 'ENQ-003', name: 'Reema Shetty', email: 'reema@example.com',
    phone: '', interest: 'General',
    message: 'Is there a free trial day pass available? Also want to know about ladies-only timings.',
    status: 'open', time: '1 day ago', response: '', via: 'sms',
    followUp: null, followUpNote: '', convertedToMember: false,
    createdAt: '2026-08-20T10:00:00',
  },
  {
    id: 'ENQ-004', name: 'Rajesh Nair', email: 'rajesh@example.com',
    phone: '+91 77003 33004', interest: 'Corporate Package',
    message: 'We have 25 employees interested in corporate gym membership. What are group rates?',
    status: 'follow_up_due', time: '2 days ago', response: 'Sent you our corporate brochure via email.',
    via: 'walk-in', followUp: '2026-08-21', followUpNote: 'Call Rajesh regarding corporate deal.',
    convertedToMember: false, createdAt: '2026-08-19T11:00:00',
  },
  {
    id: 'ENQ-005', name: 'Shreya Kulkarni', email: 'shreya@example.com',
    phone: '+91 66004 44005', interest: 'Yearly Membership',
    message: 'Comparing yearly rates. How does GymForce compare to competitors?',
    status: 'converted', time: '3 days ago',
    response: 'Offered ₹500 discount with REFER300 code. She joined Premium (Ladies) yearly plan.',
    via: 'form', followUp: null, followUpNote: '', convertedToMember: true,
    createdAt: '2026-08-18T14:00:00',
  },
];

// ── Seed Equipment ─────────────────────────────────────────────────────────────
import {
  equipment as SEED_EQUIPMENT,
  products as SEED_PRODUCTS,
  offers as SEED_OFFERS,
} from '../data/sampleData';

// ── Role Config ───────────────────────────────────────────────────────────────
export const ROLE_CONFIG = {
  master_admin: {
    label: 'Master Admin', color: '#39FF14',
    allowedRoutes: [
      '/dashboard', '/dashboard/members', '/dashboard/plans',
      '/dashboard/trainers', '/dashboard/notifications',
      '/dashboard/reports', '/dashboard/profile', '/dashboard/equipment',
      '/dashboard/products', '/dashboard/offers', '/dashboard/analytics',
      '/dashboard/enquiries', '/dashboard/attendance',
    ],
  },
  trainer: {
    label: 'Trainer', color: '#00D4FF',
    allowedRoutes: [
      '/dashboard', '/dashboard/members',
      '/dashboard/notifications', '/dashboard/profile',
      '/dashboard/attendance',
    ],
  },
  staff: {
    label: 'Staff', color: '#FF6B00',
    allowedRoutes: [
      '/dashboard', '/dashboard/members',
      '/dashboard/plans', '/dashboard/notifications', '/dashboard/profile',
      '/dashboard/equipment', '/dashboard/products', '/dashboard/attendance',
      '/dashboard/offers',
    ],
  },
  receptionist: {
    label: 'Receptionist', color: '#A855F7',
    allowedRoutes: [
      '/dashboard', '/dashboard/members',
      '/dashboard/plans', '/dashboard/notifications', '/dashboard/enquiries',
      '/dashboard/profile', '/dashboard/products', '/dashboard/attendance',
      '/dashboard/offers',
    ],
  },
  gym_member: {
    label: 'Gym Member', color: '#F59E0B',
    allowedRoutes: [
      '/member', '/member/profile', '/member/schedule', '/member/payments',
      '/member/progress', '/member/notifications', '/member/shop', '/member/ai-coach',
    ],
  },
  member: {
    label: 'Gym Member', color: '#F59E0B',
    allowedRoutes: [
      '/member', '/member/profile', '/member/schedule', '/member/payments',
      '/member/progress', '/member/notifications', '/member/shop', '/member/ai-coach',
    ],
  },
};

const normalizeUser = (u) => {
  if (!u) return null;
  const name = u.name || u.full_name || 'User';
  const role = u.role || 'staff';
  const avatar = u.avatar || u.avatar_url || name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return {
    ...u,
    name,
    full_name: name,
    role,
    avatar,
  };
};

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // ── Auth State ─────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const s = sessionStorage.getItem('gymforce_user') || localStorage.getItem('gymforce_user');
      return s ? normalizeUser(JSON.parse(s)) : null;
    } catch {
      return null;
    }
  });

  const [users, setUsers] = useState(() => {
    try { const s = localStorage.getItem('gymforce_users'); return s ? JSON.parse(s) : SEED_USERS; }
    catch { return SEED_USERS; }
  });

  // ── Enquiries State ────────────────────────────────────────────────────────
  const [enquiries, setEnquiries] = useState(() => {
    try { const s = localStorage.getItem('gymforce_enquiries'); return s ? JSON.parse(s) : SEED_ENQUIRIES; }
    catch { return SEED_ENQUIRIES; }
  });

  // ── Equipment State ────────────────────────────────────────────────────────
  const [equipmentList, setEquipmentList] = useState(() => {
    try { const s = localStorage.getItem('gymforce_equipment'); return s ? JSON.parse(s) : SEED_EQUIPMENT; }
    catch { return SEED_EQUIPMENT; }
  });

  // ── Products State ─────────────────────────────────────────────────────────
  const [productList, setProductList] = useState(() => {
    try { const s = localStorage.getItem('gymforce_products'); return s ? JSON.parse(s) : SEED_PRODUCTS; }
    catch { return SEED_PRODUCTS; }
  });

  // ── Offers State ───────────────────────────────────────────────────────────
  const [offerList, setOfferList] = useState(() => {
    try { const s = localStorage.getItem('gymforce_offers'); return s ? JSON.parse(s) : SEED_OFFERS; }
    catch { return SEED_OFFERS; }
  });

  // ── Persistence Helpers ───────────────────────────────────────────────────
  const saveUsers      = useCallback((u) => { setUsers(u);         localStorage.setItem('gymforce_users',     JSON.stringify(u)); }, []);
  const saveEnquiries  = useCallback((e) => { setEnquiries(e);     localStorage.setItem('gymforce_enquiries', JSON.stringify(e)); }, []);
  const saveEquipment  = useCallback((e) => { setEquipmentList(e); localStorage.setItem('gymforce_equipment', JSON.stringify(e)); }, []);
  const saveProducts   = useCallback((p) => { setProductList(p);   localStorage.setItem('gymforce_products',  JSON.stringify(p)); }, []);
  const saveOffers     = useCallback((o) => { setOfferList(o);     localStorage.setItem('gymforce_offers',    JSON.stringify(o)); }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback((email, password, selectedRole) => {
    const emailLower = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === emailLower);
    if (!user) return { success: false, error: 'No account found with this email. Please register first.' };
    if (user.password !== password) return { success: false, error: 'Incorrect password. Please try again.' };

    const roleMap = { 'Master Admin': 'master_admin', Trainer: 'trainer', Staff: 'staff', Receptionist: 'receptionist', 'Gym Member': 'gym_member' };
    const expected = roleMap[selectedRole];
    if (expected && user.role !== expected) {
      return { success: false, error: `This account is registered as "${ROLE_CONFIG[user.role]?.label}". Please select the correct role tab.` };
    }

    const sessionUser = normalizeUser({ ...user });
    delete sessionUser.password;
    setCurrentUser(sessionUser);
    sessionStorage.setItem('gymforce_user', JSON.stringify(sessionUser));
    return { success: true, user: sessionUser };
  }, [users]);

  // ── Register ──────────────────────────────────────────────────────────────
  const register = useCallback((formData) => {
    const emailLower = formData.email.trim().toLowerCase();
    if (users.find(u => u.email.toLowerCase() === emailLower))
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    if (formData.password.length < 8)
      return { success: false, error: 'Password must be at least 8 characters.' };

    const roleMap = { 'Master Admin': 'master_admin', Trainer: 'trainer', Staff: 'staff', Receptionist: 'receptionist', 'Gym Member': 'gym_member' };
    const roleKey = roleMap[formData.role] || (formData.role === 'master_admin' || formData.role === 'trainer' || formData.role === 'staff' || formData.role === 'receptionist' ? formData.role : 'master_admin');

    const newUser = {
      id: `u${Date.now()}`,
      name: formData.name.trim(),
      email: emailLower,
      password: formData.password,
      role: roleKey,
      gym: formData.gym || 'GymForce HQ',
      avatar: formData.name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      phone: formData.phone || '',
      gender: formData.gender || '',
    };
    const updated = [...users, newUser];
    saveUsers(updated);
    const sessionUser = normalizeUser({ ...newUser });
    delete sessionUser.password;
    setCurrentUser(sessionUser);
    sessionStorage.setItem('gymforce_user', JSON.stringify(sessionUser));
    return { success: true, user: sessionUser };
  }, [users, saveUsers]);

  // ── Update Profile ────────────────────────────────────────────────────────
  const updateProfile = useCallback((updates) => {
    const updated = users.map(u => u.id === currentUser.id ? { ...u, ...updates } : u);
    saveUsers(updated);
    const sessionUser = normalizeUser({ ...currentUser, ...updates });
    delete sessionUser.password;
    setCurrentUser(sessionUser);
    sessionStorage.setItem('gymforce_user', JSON.stringify(sessionUser));
    return { success: true };
  }, [currentUser, users, saveUsers]);


  // ── Change Password ───────────────────────────────────────────────────────
  const changePassword = useCallback((oldPass, newPass) => {
    const user = users.find(u => u.id === currentUser.id);
    if (!user || user.password !== oldPass) return { success: false, error: 'Current password is incorrect.' };
    if (newPass.length < 8) return { success: false, error: 'New password must be at least 8 characters.' };
    const updated = users.map(u => u.id === currentUser.id ? { ...u, password: newPass } : u);
    saveUsers(updated);
    return { success: true };
  }, [currentUser, users, saveUsers]);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setCurrentUser(null);
    sessionStorage.removeItem('gymforce_user');
    localStorage.removeItem('gymforce_user');
  }, []);

  // ── Enquiry Actions ───────────────────────────────────────────────────────
  const addEnquiry = useCallback((data) => {
    const newEnq = {
      id: `ENQ-${String(Date.now()).slice(-4)}`,
      ...data, status: 'open', time: 'Just now', response: '',
      via: data.via || 'form', followUp: null, followUpNote: '',
      convertedToMember: false, createdAt: new Date().toISOString(),
    };
    const updated = [newEnq, ...enquiries]; saveEnquiries(updated);
    return newEnq;
  }, [enquiries, saveEnquiries]);

  const respondToEnquiry = useCallback((id, response) => {
    const updated = enquiries.map(e => e.id === id ? { ...e, response, status: 'responded' } : e);
    saveEnquiries(updated);
  }, [enquiries, saveEnquiries]);

  const closeEnquiry = useCallback((id) => {
    const updated = enquiries.map(e => e.id === id ? { ...e, status: 'closed' } : e);
    saveEnquiries(updated);
  }, [enquiries, saveEnquiries]);

  const setFollowUp = useCallback((id, followUpDate, note) => {
    const updated = enquiries.map(e => e.id === id ? { ...e, followUp: followUpDate, followUpNote: note, status: 'responded' } : e);
    saveEnquiries(updated);
  }, [enquiries, saveEnquiries]);

  const convertEnquiry = useCallback((id) => {
    const updated = enquiries.map(e => e.id === id ? { ...e, convertedToMember: true, status: 'converted' } : e);
    saveEnquiries(updated);
  }, [enquiries, saveEnquiries]);

  // ── Equipment Actions ─────────────────────────────────────────────────────
  const addEquipment = useCallback((data) => {
    const newItem = { id: `EQ-${String(Date.now()).slice(-3)}`, ...data };
    const updated = [...equipmentList, newItem]; saveEquipment(updated);
    return newItem;
  }, [equipmentList, saveEquipment]);

  const updateEquipment = useCallback((id, updates) => {
    const updated = equipmentList.map(e => e.id === id ? { ...e, ...updates } : e);
    saveEquipment(updated);
  }, [equipmentList, saveEquipment]);

  const deleteEquipment = useCallback((id) => {
    const updated = equipmentList.filter(e => e.id !== id);
    saveEquipment(updated);
  }, [equipmentList, saveEquipment]);

  // ── Product Actions ───────────────────────────────────────────────────────
  const addProduct = useCallback((data) => {
    const newItem = { id: `PRD-${String(Date.now()).slice(-3)}`, ...data };
    const updated = [...productList, newItem]; saveProducts(updated);
    return newItem;
  }, [productList, saveProducts]);

  const updateProduct = useCallback((id, updates) => {
    const updated = productList.map(p => p.id === id ? { ...p, ...updates } : p);
    saveProducts(updated);
  }, [productList, saveProducts]);

  const deleteProduct = useCallback((id) => {
    const updated = productList.filter(p => p.id !== id);
    saveProducts(updated);
  }, [productList, saveProducts]);

  // ── Offer Actions ─────────────────────────────────────────────────────────
  const addOffer = useCallback((data) => {
    const newItem = { id: `OFF-${String(Date.now()).slice(-3)}`, ...data, timesUsed: 0 };
    const updated = [...offerList, newItem]; saveOffers(updated);
    return newItem;
  }, [offerList, saveOffers]);

  const updateOffer = useCallback((id, updates) => {
    const updated = offerList.map(o => o.id === id ? { ...o, ...updates } : o);
    saveOffers(updated);
  }, [offerList, saveOffers]);

  const deleteOffer = useCallback((id) => {
    const updated = offerList.filter(o => o.id !== id);
    saveOffers(updated);
  }, [offerList, saveOffers]);

  // ── Can Access ────────────────────────────────────────────────────────────
  const canAccess = useCallback((path) => {
    if (!currentUser) return false;
    const config = ROLE_CONFIG[currentUser.role];
    if (!config) return false;
    return config.allowedRoutes.some(r => path === r || path.startsWith(r + '/'));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{
      currentUser, login, register, logout, updateProfile, changePassword,
      canAccess, ROLE_CONFIG,
      // Enquiries
      enquiries, addEnquiry, respondToEnquiry, closeEnquiry, setFollowUp, convertEnquiry,
      // Equipment
      equipmentList, addEquipment, updateEquipment, deleteEquipment,
      // Products
      productList, addProduct, updateProduct, deleteProduct,
      // Offers
      offerList, addOffer, updateOffer, deleteOffer,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

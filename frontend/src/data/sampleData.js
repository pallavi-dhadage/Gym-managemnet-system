// ── Sample Data for GymForce Management System (INR Edition) ────────────────

// ── KPI Data ─────────────────────────────────────────────────────────────────
export const kpiData = {
  revenue:    { value: '₹4,83,200', change: '+12.5%', positive: true,  label: 'Monthly Revenue'       },
  members:    { value: '1,284',     change: '+8.2%',  positive: true,  label: 'Active Members'        },
  expiring:   { value: '47',        change: '+5',     positive: false, label: 'Expiring This Week'    },
  pendingDues:{ value: '₹68,400',   change: '+3',     positive: false, label: 'Pending Dues'          },
  newEnquiries:{ value: '18',       change: '+4',     positive: true,  label: 'New Enquiries'         },
  equipment:  { value: '42',        change: '3 due',  positive: false, label: 'Equipment Items'       },
  attendance: { value: '73%',       change: '+4.1%',  positive: true,  label: 'Avg Attendance'        },
};

// ── Revenue & Member Growth ───────────────────────────────────────────────────
export const revenueData = [
  { month: 'Jan', revenue: 320000, members: 980,  ladies: 380, mens: 600 },
  { month: 'Feb', revenue: 350000, members: 1020, ladies: 400, mens: 620 },
  { month: 'Mar', revenue: 380000, members: 1080, ladies: 430, mens: 650 },
  { month: 'Apr', revenue: 360000, members: 1100, ladies: 445, mens: 655 },
  { month: 'May', revenue: 410000, members: 1150, ladies: 470, mens: 680 },
  { month: 'Jun', revenue: 440000, members: 1200, ladies: 490, mens: 710 },
  { month: 'Jul', revenue: 420000, members: 1220, ladies: 500, mens: 720 },
  { month: 'Aug', revenue: 483200, members: 1284, ladies: 524, mens: 760 },
];

// ── Attendance Data ───────────────────────────────────────────────────────────
export const attendanceData = [
  { day: 'Mon', morning: 130, evening: 110, total: 240 },
  { day: 'Tue', morning: 140, evening: 120, total: 260 },
  { day: 'Wed', morning: 155, evening: 125, total: 280 },
  { day: 'Thu', morning: 135, evening: 115, total: 250 },
  { day: 'Fri', morning: 165, evening: 135, total: 300 },
  { day: 'Sat', morning: 130, evening: 90,  total: 220 },
  { day: 'Sun', morning: 110, evening: 70,  total: 180 },
];

// ── Attendance Log ────────────────────────────────────────────────────────────
export const attendanceLog = [
  { id: 1, member: 'Priya Sharma',   date: '2026-08-21', checkIn: '06:05', checkOut: '07:35', duration: '1h 30m', area: 'Weight Room' },
  { id: 2, member: 'Vikram Singh',   date: '2026-08-21', checkIn: '06:30', checkOut: '08:00', duration: '1h 30m', area: 'Weight Room' },
  { id: 3, member: 'Rahul Mehta',    date: '2026-08-21', checkIn: '07:00', checkOut: '08:00', duration: '1h 00m', area: 'Cardio Zone' },
  { id: 4, member: 'Deepa Krishnan', date: '2026-08-21', checkIn: '07:15', checkOut: '08:15', duration: '1h 00m', area: 'Yoga Studio' },
  { id: 5, member: 'Suresh Babu',    date: '2026-08-21', checkIn: '07:45', checkOut: '09:00', duration: '1h 15m', area: 'Cardio Zone' },
  { id: 6, member: 'Ravi Kumar',     date: '2026-08-21', checkIn: '08:00', checkOut: '09:30', duration: '1h 30m', area: 'Weight Room' },
  { id: 7, member: 'Arjun Kapoor',   date: '2026-08-20', checkIn: '18:00', checkOut: '19:15', duration: '1h 15m', area: 'Functional Area' },
  { id: 8, member: 'Anita Desai',    date: '2026-08-20', checkIn: '18:30', checkOut: '19:30', duration: '1h 00m', area: 'Yoga Studio' },
  { id: 9, member: 'Kiran Patel',    date: '2026-08-20', checkIn: '19:00', checkOut: '20:30', duration: '1h 30m', area: 'Weight Room' },
  { id: 10, member: 'Lakshmi Devi',  date: '2026-08-20', checkIn: '19:15', checkOut: '20:15', duration: '1h 00m', area: 'Cardio Zone' },
];

export const membershipDistribution = [
  { name: 'Basic',    value: 35, color: '#6B7280' },
  { name: 'Standard', value: 40, color: '#00D4FF' },
  { name: 'Premium',  value: 20, color: '#39FF14' },
  { name: 'VIP',      value: 5,  color: '#FF6B00' },
];

export const memberCategoryDistribution = [
  { name: 'Ladies', value: 41, color: '#EC4899' },
  { name: 'Mens',   value: 59, color: '#3B82F6' },
];

// ── Recent Payments ───────────────────────────────────────────────────────────
export const recentPayments = [
  { id: 'PAY-001', member: 'Priya Sharma',   plan: 'Premium',  amount: '₹2,299', date: '2026-08-18', status: 'Paid',    avatar: 'PS', cycle: 'Monthly',     method: 'UPI'  },
  { id: 'PAY-002', member: 'Rahul Mehta',    plan: 'Standard', amount: '₹1,499', date: '2026-08-17', status: 'Paid',    avatar: 'RM', cycle: 'Monthly',     method: 'Card' },
  { id: 'PAY-003', member: 'Anita Desai',    plan: 'Basic',    amount: '₹1,995', date: '2026-08-17', status: 'Pending', avatar: 'AD', cycle: 'Quarterly',   method: 'Cash' },
  { id: 'PAY-004', member: 'Vikram Singh',   plan: 'VIP',      amount: '₹3,999', date: '2026-08-16', status: 'Paid',    avatar: 'VS', cycle: 'Monthly',     method: 'Card' },
  { id: 'PAY-005', member: 'Kavya Reddy',    plan: 'Premium',  amount: '₹2,299', date: '2026-08-16', status: 'Failed',  avatar: 'KR', cycle: 'Monthly',     method: 'Card' },
  { id: 'PAY-006', member: 'Suresh Babu',    plan: 'Standard', amount: '₹7,748', date: '2026-08-15', status: 'Paid',    avatar: 'SB', cycle: 'Half-yearly', method: 'UPI'  },
  { id: 'PAY-007', member: 'Meera Nair',     plan: 'Basic',    amount: '₹6,710', date: '2026-08-15', status: 'Paid',    avatar: 'MN', cycle: 'Yearly',      method: 'Card' },
  { id: 'PAY-008', member: 'Arjun Kapoor',   plan: 'Premium',  amount: '₹2,299', date: '2026-08-14', status: 'Pending', avatar: 'AK', cycle: 'Monthly',     method: 'Cash' },
  { id: 'PAY-009', member: 'Deepa Krishnan', plan: 'Standard', amount: '₹4,197', date: '2026-08-13', status: 'Paid',    avatar: 'DK', cycle: 'Quarterly',   method: 'UPI'  },
  { id: 'PAY-010', member: 'Ravi Kumar',     plan: 'VIP',      amount: '₹38,390',date: '2026-08-12', status: 'Paid',    avatar: 'RK', cycle: 'Yearly',      method: 'Card' },
];

// ── Members ───────────────────────────────────────────────────────────────────
export const members = [
  { id: 'M-001', name: 'Priya Sharma',   email: 'priya@example.com',  plan: 'Premium',  status: 'Active',   joinDate: '2025-01-15', expiry: '2026-09-15', attendance: 28, trainer: 'Rohit Kumar',    avatar: 'PS', phone: '+91 98765 43210', gender: 'female', category: 'Ladies', age: 28 },
  { id: 'M-002', name: 'Rahul Mehta',    email: 'rahul@example.com',  plan: 'Standard', status: 'Active',   joinDate: '2025-03-20', expiry: '2026-09-20', attendance: 22, trainer: 'Anjali Singh',   avatar: 'RM', phone: '+91 87654 32109', gender: 'male',   category: 'Mens',   age: 32 },
  { id: 'M-003', name: 'Anita Desai',    email: 'anita@example.com',  plan: 'Basic',    status: 'Expiring', joinDate: '2025-05-10', expiry: '2026-08-25', attendance: 10, trainer: 'Unassigned',     avatar: 'AD', phone: '+91 76543 21098', gender: 'female', category: 'Ladies', age: 35 },
  { id: 'M-004', name: 'Vikram Singh',   email: 'vikram@example.com', plan: 'VIP',      status: 'Active',   joinDate: '2024-12-01', expiry: '2026-12-01', attendance: 35, trainer: 'Rohit Kumar',    avatar: 'VS', phone: '+91 65432 10987', gender: 'male',   category: 'Mens',   age: 41 },
  { id: 'M-005', name: 'Kavya Reddy',    email: 'kavya@example.com',  plan: 'Premium',  status: 'Inactive', joinDate: '2025-02-14', expiry: '2026-08-14', attendance: 5,  trainer: 'Suresh Pillai',  avatar: 'KR', phone: '+91 54321 09876', gender: 'female', category: 'Ladies', age: 26 },
  { id: 'M-006', name: 'Suresh Babu',    email: 'suresh@example.com', plan: 'Standard', status: 'Active',   joinDate: '2025-04-05', expiry: '2026-10-05', attendance: 18, trainer: 'Anjali Singh',   avatar: 'SB', phone: '+91 43210 98765', gender: 'male',   category: 'Mens',   age: 29 },
  { id: 'M-007', name: 'Meera Nair',     email: 'meera@example.com',  plan: 'Basic',    status: 'Active',   joinDate: '2025-06-18', expiry: '2026-09-18', attendance: 14, trainer: 'Unassigned',     avatar: 'MN', phone: '+91 32109 87654', gender: 'female', category: 'Mixed',  age: 38 },
  { id: 'M-008', name: 'Arjun Kapoor',   email: 'arjun@example.com',  plan: 'Premium',  status: 'Active',   joinDate: '2025-07-01', expiry: '2026-10-01', attendance: 20, trainer: 'Suresh Pillai',  avatar: 'AK', phone: '+91 21098 76543', gender: 'male',   category: 'Mens',   age: 31 },
  { id: 'M-009', name: 'Deepa Krishnan', email: 'deepa@example.com',  plan: 'Standard', status: 'Active',   joinDate: '2025-01-22', expiry: '2026-07-22', attendance: 25, trainer: 'Rohit Kumar',    avatar: 'DK', phone: '+91 10987 65432', gender: 'female', category: 'Ladies', age: 33 },
  { id: 'M-010', name: 'Ravi Kumar',     email: 'ravi@example.com',   plan: 'VIP',      status: 'Active',   joinDate: '2024-11-15', expiry: '2026-11-15', attendance: 40, trainer: 'Anjali Singh',   avatar: 'RK', phone: '+91 09876 54321', gender: 'male',   category: 'Mixed',  age: 44 },
  { id: 'M-011', name: 'Lakshmi Devi',   email: 'lakshmi@example.com',plan: 'Basic',    status: 'Active',   joinDate: '2025-08-01', expiry: '2026-11-01', attendance: 8,  trainer: 'Unassigned',     avatar: 'LD', phone: '+91 99887 76655', gender: 'female', category: 'Ladies', age: 22 },
  { id: 'M-012', name: 'Kiran Patel',    email: 'kiran@example.com',  plan: 'Standard', status: 'Active',   joinDate: '2025-03-10', expiry: '2026-09-10', attendance: 30, trainer: 'Suresh Pillai',  avatar: 'KP', phone: '+91 88776 65544', gender: 'male',   category: 'Mens',   age: 27 },
];

// ── Trainers ──────────────────────────────────────────────────────────────────
export const trainers = [
  {
    id: 'T-001', name: 'Rohit Kumar', specialty: 'Strength & Conditioning',
    experience: '8 years', clients: 24, rating: 4.9, status: 'Active',
    schedule: 'Mon–Fri  6 AM–2 PM', avatar: 'RK', gender: 'male',
    email: 'rohit@gymforce.com', phone: '+91 98765 11111',
    photo: 'https://ui-avatars.com/api/?name=Rohit+Kumar&background=39FF14&color=000&size=128',
    bio: 'Certified strength coach with 8 years of experience helping clients build functional strength and endurance. Specialises in powerlifting and sports conditioning.',
    certifications: [
      { name: 'NSCA-CSCS',      body: 'NSCA',              year: 2018 },
      { name: 'CrossFit Level 2',body: 'CrossFit Inc.',     year: 2019 },
      { name: 'CPR/AED',         body: 'Red Cross India',   year: 2025 },
    ],
    availability: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
    timeSlot: '6:00 AM – 2:00 PM',
    assignedMembers: ['M-001', 'M-004', 'M-009'],
    sessionsThisMonth: 48, avgClientRating: 4.9,
  },
  {
    id: 'T-002', name: 'Anjali Singh', specialty: 'Yoga & Flexibility',
    experience: '6 years', clients: 18, rating: 4.8, status: 'Active',
    schedule: 'Tue–Sat  8 AM–4 PM', avatar: 'AS', gender: 'female',
    email: 'anjali@gymforce.com', phone: '+91 87654 22222',
    photo: 'https://ui-avatars.com/api/?name=Anjali+Singh&background=EC4899&color=fff&size=128',
    bio: 'RYT-500 certified yoga instructor passionate about mindful movement. Conducts Hatha, Vinyasa, and prenatal yoga. Expert in posture correction and flexibility training.',
    certifications: [
      { name: 'RYT-500',         body: 'Yoga Alliance',     year: 2020 },
      { name: 'NASM-CPT',        body: 'NASM',              year: 2021 },
      { name: 'Pre/Post Natal',  body: 'YogaFit India',     year: 2022 },
    ],
    availability: ['Tuesday','Wednesday','Thursday','Friday','Saturday'],
    timeSlot: '8:00 AM – 4:00 PM',
    assignedMembers: ['M-002', 'M-006', 'M-010'],
    sessionsThisMonth: 36, avgClientRating: 4.8,
  },
  {
    id: 'T-003', name: 'Suresh Pillai', specialty: 'HIIT & Cardio',
    experience: '5 years', clients: 20, rating: 4.7, status: 'Active',
    schedule: 'Mon–Fri  2 PM–10 PM', avatar: 'SP', gender: 'male',
    email: 'suresh@gymforce.com', phone: '+91 76543 33333',
    photo: 'https://ui-avatars.com/api/?name=Suresh+Pillai&background=FF6B00&color=fff&size=128',
    bio: 'High-energy HIIT specialist who transforms clients through metabolic conditioning and functional training. Known for motivating workout sessions and rapid fat-loss results.',
    certifications: [
      { name: 'ACE-CPT',         body: 'ACE',               year: 2021 },
      { name: 'TRX Trainer',     body: 'TRX Training',      year: 2022 },
      { name: 'HIIT Specialist', body: 'ISSA India',        year: 2023 },
    ],
    availability: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
    timeSlot: '2:00 PM – 10:00 PM',
    assignedMembers: ['M-005', 'M-008', 'M-012'],
    sessionsThisMonth: 42, avgClientRating: 4.7,
  },
  {
    id: 'T-004', name: 'Meenakshi Iyer', specialty: 'Nutrition & Weight Loss',
    experience: '10 years', clients: 30, rating: 5.0, status: 'Active',
    schedule: 'Mon–Sat  7 AM–3 PM', avatar: 'MI', gender: 'female',
    email: 'meenakshi@gymforce.com', phone: '+91 65432 44444',
    photo: 'https://ui-avatars.com/api/?name=Meenakshi+Iyer&background=A855F7&color=fff&size=128',
    bio: 'Registered dietitian and certified personal trainer with 10 years of experience in weight management. Specialises in creating sustainable lifestyle changes through customised meal plans.',
    certifications: [
      { name: 'RD (Registered Dietitian)', body: 'Indian Dietetic Assoc.', year: 2016 },
      { name: 'NASM-CPT',                  body: 'NASM',                   year: 2017 },
      { name: 'Precision Nutrition L1',    body: 'Precision Nutrition',    year: 2020 },
    ],
    availability: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    timeSlot: '7:00 AM – 3:00 PM',
    assignedMembers: ['M-003', 'M-007', 'M-011'],
    sessionsThisMonth: 55, avgClientRating: 5.0,
  },
  {
    id: 'T-005', name: 'Deepak Verma', specialty: 'Bodybuilding',
    experience: '7 years', clients: 15, rating: 4.6, status: 'On Leave',
    schedule: 'Mon–Thu  12 PM–8 PM', avatar: 'DV', gender: 'male',
    email: 'deepak@gymforce.com', phone: '+91 54321 55555',
    photo: 'https://ui-avatars.com/api/?name=Deepak+Verma&background=00D4FF&color=000&size=128',
    bio: 'Competitive bodybuilder and certified coach with expertise in contest preparation, muscle hypertrophy, and periodisation. On leave until September 2026.',
    certifications: [
      { name: 'ISSA-CPT',        body: 'ISSA',              year: 2019 },
      { name: 'NSCA-CSCS',       body: 'NSCA',              year: 2021 },
      { name: 'Bodybuilding Coach', body: 'WBFF India',     year: 2022 },
    ],
    availability: ['Monday','Tuesday','Wednesday','Thursday'],
    timeSlot: '12:00 PM – 8:00 PM',
    assignedMembers: [],
    sessionsThisMonth: 0, avgClientRating: 4.6,
  },
];



// ── Membership Plans ──────────────────────────────────────────────────────────
// Price is the base MONTHLY price per category (Ladies / Mens / Mixed)
export const membershipPlans = [
  {
    id: 'basic', name: 'Basic', color: 'gray', popular: false,
    prices: { Ladies: 699, Mens: 799, Mixed: 899 },
    features: ['Access to main gym floor', 'Locker room access', 'Free Wi-Fi', '2 guest passes/month'],
    notIncluded: ['Group classes', 'Personal trainer', 'Nutrition consultation', 'Spa access'],
  },
  {
    id: 'standard', name: 'Standard', color: 'blue', popular: true,
    prices: { Ladies: 1299, Mens: 1499, Mixed: 1699 },
    features: ['Everything in Basic', 'Unlimited group classes', '1 PT session/month', 'Nutrition guide', '5 guest passes/month'],
    notIncluded: ['Dedicated personal trainer', 'Spa access'],
  },
  {
    id: 'premium', name: 'Premium', color: 'green', popular: false,
    prices: { Ladies: 1999, Mens: 2299, Mixed: 2599 },
    features: ['Everything in Standard', '4 PT sessions/month', 'Nutrition consultation', 'Spa & sauna access', 'Priority booking', 'Towel service'],
    notIncluded: [],
  },
  {
    id: 'vip', name: 'VIP', color: 'orange', popular: false,
    prices: { Ladies: 3499, Mens: 3999, Mixed: 4499 },
    features: ['Everything in Premium', 'Unlimited PT sessions', 'Dedicated locker', 'Unlimited guest passes', 'Priority 24/7 support', 'Personalised meal planning'],
    notIncluded: [],
  },
];

// ── Billing Cycles ────────────────────────────────────────────────────────────
export const billingCycles = [
  { id: 'monthly',    label: 'Monthly',     multiplier: 1,   savings: null,   months: 1  },
  { id: 'quarterly',  label: 'Quarterly',   multiplier: 2.8, savings: '7%',   months: 3  },
  { id: 'halfyearly', label: 'Half-Yearly', multiplier: 5.2, savings: '13%',  months: 6  },
  { id: 'yearly',     label: 'Yearly',      multiplier: 9.6, savings: '20%',  months: 12 },
  { id: 'custom',     label: 'Custom',      multiplier: null,savings: null,   months: null},
];

export const memberCategories = ['Ladies', 'Mens', 'Mixed'];

// ── Equipment ─────────────────────────────────────────────────────────────────
export const equipment = [
  { id: 'EQ-001', name: 'Treadmill Pro X9',       category: 'Cardio',        qty: 8,  condition: 'Good',         lastMaintenance: '2026-07-15', nextMaintenance: '2026-10-15', status: 'Available',          location: 'Cardio Zone'  },
  { id: 'EQ-002', name: 'Elliptical Trainer',      category: 'Cardio',        qty: 4,  condition: 'Good',         lastMaintenance: '2026-06-20', nextMaintenance: '2026-09-20', status: 'Available',          location: 'Cardio Zone'  },
  { id: 'EQ-003', name: 'Stationary Bike',         category: 'Cardio',        qty: 6,  condition: 'Fair',         lastMaintenance: '2026-05-10', nextMaintenance: '2026-08-10', status: 'Under Maintenance',  location: 'Cardio Zone'  },
  { id: 'EQ-004', name: 'Smith Machine',           category: 'Strength',      qty: 2,  condition: 'Good',         lastMaintenance: '2026-07-01', nextMaintenance: '2026-10-01', status: 'Available',          location: 'Weight Room'  },
  { id: 'EQ-005', name: 'Cable Crossover Machine', category: 'Strength',      qty: 2,  condition: 'Good',         lastMaintenance: '2026-07-01', nextMaintenance: '2026-10-01', status: 'Available',          location: 'Weight Room'  },
  { id: 'EQ-006', name: 'Leg Press Machine',       category: 'Strength',      qty: 2,  condition: 'Needs Repair', lastMaintenance: '2026-04-15', nextMaintenance: '2026-07-15', status: 'Out of Service',     location: 'Weight Room'  },
  { id: 'EQ-007', name: 'Dumbbells Set (2–50 kg)', category: 'Free Weights',  qty: 1,  condition: 'Good',         lastMaintenance: '2026-08-01', nextMaintenance: '2026-11-01', status: 'Available',          location: 'Weight Room'  },
  { id: 'EQ-008', name: 'Barbell & Plates Set',    category: 'Free Weights',  qty: 6,  condition: 'Good',         lastMaintenance: '2026-08-01', nextMaintenance: '2026-11-01', status: 'Available',          location: 'Weight Room'  },
  { id: 'EQ-009', name: 'Pull-up / Dip Station',   category: 'Free Weights',  qty: 3,  condition: 'Good',         lastMaintenance: '2026-06-15', nextMaintenance: '2026-09-15', status: 'Available',          location: 'Functional Area'},
  { id: 'EQ-010', name: 'Battle Ropes',            category: 'Functional',    qty: 4,  condition: 'Fair',         lastMaintenance: '2026-06-01', nextMaintenance: '2026-09-01', status: 'Available',          location: 'Functional Area'},
  { id: 'EQ-011', name: 'Yoga Mats',               category: 'Accessories',   qty: 30, condition: 'Good',         lastMaintenance: '2026-08-10', nextMaintenance: '2026-11-10', status: 'Available',          location: 'Yoga Studio'  },
  { id: 'EQ-012', name: 'TRX Suspension System',   category: 'Functional',    qty: 5,  condition: 'Good',         lastMaintenance: '2026-07-20', nextMaintenance: '2026-10-20', status: 'Available',          location: 'Functional Area'},
  { id: 'EQ-013', name: 'Rowing Machine',          category: 'Cardio',        qty: 3,  condition: 'Fair',         lastMaintenance: '2026-05-25', nextMaintenance: '2026-08-25', status: 'Available',          location: 'Cardio Zone'  },
  { id: 'EQ-014', name: 'Chest Press Machine',     category: 'Strength',      qty: 2,  condition: 'Good',         lastMaintenance: '2026-07-10', nextMaintenance: '2026-10-10', status: 'Available',          location: 'Weight Room'  },
];

// ── Products / Shop ───────────────────────────────────────────────────────────
export const products = [
  { id: 'PRD-001', name: 'Whey Protein Isolate (1 kg)', category: 'Supplements', price: 2499, stock: 24, sku: 'WPI-1KG', emoji: '🥛', description: 'High-quality whey isolate. 25g protein per serving. Chocolate & vanilla flavors.', status: 'In Stock' },
  { id: 'PRD-002', name: 'Creatine Monohydrate (300 g)', category: 'Supplements', price: 799,  stock: 18, sku: 'CRE-300', emoji: '💊', description: 'Pure micronised creatine monohydrate. Unflavored. 60 servings.', status: 'In Stock' },
  { id: 'PRD-003', name: 'BCAA Recovery Drink (400 g)', category: 'Supplements', price: 1099, stock: 4,  sku: 'BCAA-400', emoji: '🧃', description: '2:1:1 BCAA ratio with electrolytes. Watermelon flavor.', status: 'Low Stock' },
  { id: 'PRD-004', name: 'Pre-Workout Boost (250 g)',   category: 'Supplements', price: 1399, stock: 11, sku: 'PRE-250', emoji: '⚡', description: 'Caffeine + beta-alanine blend for energy and endurance. Fruit punch flavor.', status: 'In Stock' },
  { id: 'PRD-005', name: 'Yoga Mat Premium (6 mm)',     category: 'Equipment',   price: 999,  stock: 8,  sku: 'YM-6MM',  emoji: '🧘', description: 'Non-slip TPE yoga mat. 183 cm × 61 cm. Carry strap included. Multiple colors.', status: 'In Stock' },
  { id: 'PRD-006', name: 'Resistance Bands Set',        category: 'Equipment',   price: 599,  stock: 15, sku: 'RBD-SET', emoji: '🎀', description: '5 resistance levels (10–50 lbs). Latex-free. Includes carry bag.', status: 'In Stock' },
  { id: 'PRD-007', name: 'Gym Gloves (Pair)',           category: 'Accessories', price: 349,  stock: 22, sku: 'GGL-PR',  emoji: '🧤', description: 'Half-finger weightlifting gloves with wrist wrap. S/M/L sizes.', status: 'In Stock' },
  { id: 'PRD-008', name: 'Shaker Bottle (700 ml)',      category: 'Accessories', price: 249,  stock: 3,  sku: 'SHK-700', emoji: '🫙', description: 'BPA-free shaker with wire whisk ball. Leak-proof lid.', status: 'Low Stock' },
  { id: 'PRD-009', name: 'Gym Bag (25 L)',              category: 'Accessories', price: 1299, stock: 7,  sku: 'GBG-25L', emoji: '🎒', description: 'Durable polyester gym bag with shoe compartment and wet pocket.', status: 'In Stock' },
  { id: 'PRD-010', name: 'GymForce T-Shirt',           category: 'Apparel',     price: 499,  stock: 30, sku: 'GFT-TSH', emoji: '👕', description: 'Moisture-wicking dry-fit tee with GymForce logo. S/M/L/XL.', status: 'In Stock' },
  { id: 'PRD-011', name: 'Compression Shorts',          category: 'Apparel',     price: 699,  stock: 0,  sku: 'CMP-SHT', emoji: '🩳', description: 'Anti-chafe compression shorts. 4-way stretch. Black.', status: 'Out of Stock' },
  { id: 'PRD-012', name: 'Foam Roller (90 cm)',         category: 'Recovery',    price: 899,  stock: 6,  sku: 'FRM-90',  emoji: '🫧', description: 'High-density EVA foam roller for myofascial release and recovery.', status: 'In Stock' },
];

// ── Offers & Promotions ───────────────────────────────────────────────────────
export const offers = [
  {
    id: 'OFF-001', name: 'Independence Day Special', title: 'Independence Day Special',
    type: 'percentage', discountType: 'Percentage', value: 15, discountValue: 15,
    code: 'INDIA15', category: 'Seasonal',
    applicablePlans: ['standard', 'premium', 'vip'],
    applicableCategories: ['Ladies', 'Mens', 'Mixed'],
    validFrom: '2026-08-10', validTo: '2026-08-31',
    startDate: '2026-08-10', endDate: '2026-08-31',
    status: 'Active',
    usageLimit: 100, maxUses: 100, timesUsed: 43, usedCount: 43,
    description: 'Flat 15% off on Standard, Premium & VIP plans. Independence Day celebration offer.',
  },
  {
    id: 'OFF-002', name: "Ladies' Special — Pink October", title: "Ladies' Special — Pink October",
    type: 'flat', discountType: 'Fixed Amount', value: 500, discountValue: 500,
    code: 'LADIES500', category: 'Membership',
    applicablePlans: ['basic', 'standard', 'premium', 'vip'],
    applicableCategories: ['Ladies'],
    validFrom: '2026-10-01', validTo: '2026-10-31',
    startDate: '2026-10-01', endDate: '2026-10-31',
    status: 'Upcoming',
    usageLimit: 200, maxUses: 200, timesUsed: 0, usedCount: 0,
    description: '₹500 off on all Ladies membership plans during Pink October.',
  },
  {
    id: 'OFF-003', name: 'First Month Free (Yearly)', title: 'First Month Free (Yearly)',
    type: 'percentage', discountType: 'Percentage', value: 8, discountValue: 8,
    code: 'YEARLY8', category: 'Membership',
    applicablePlans: ['standard', 'premium'],
    applicableCategories: ['Ladies', 'Mens', 'Mixed'],
    validFrom: '2026-07-01', validTo: '2026-09-30',
    startDate: '2026-07-01', endDate: '2026-09-30',
    status: 'Active',
    usageLimit: 50, maxUses: 50, timesUsed: 22, usedCount: 22,
    description: 'Extra 8% off when you choose a yearly billing cycle on Standard or Premium plans.',
  },
  {
    id: 'OFF-004', name: 'Referral Bonus', title: 'Referral Bonus',
    type: 'flat', discountType: 'Fixed Amount', value: 300, discountValue: 300,
    code: 'REFER300', category: 'Referral',
    applicablePlans: ['basic', 'standard', 'premium', 'vip'],
    applicableCategories: ['Ladies', 'Mens', 'Mixed'],
    validFrom: '2026-01-01', validTo: '2026-12-31',
    startDate: '2026-01-01', endDate: '2026-12-31',
    status: 'Active',
    usageLimit: 500, maxUses: 500, timesUsed: 78, usedCount: 78,
    description: '₹300 off for members who were referred by an existing member.',
  },
  {
    id: 'OFF-005', name: 'New Year 2027 Launch Offer', title: 'New Year 2027 Launch Offer',
    type: 'percentage', discountType: 'Percentage', value: 20, discountValue: 20,
    code: 'NY2027', category: 'Seasonal',
    applicablePlans: ['premium', 'vip'],
    applicableCategories: ['Ladies', 'Mens', 'Mixed'],
    validFrom: '2026-12-25', validTo: '2027-01-07',
    startDate: '2026-12-25', endDate: '2027-01-07',
    status: 'Upcoming',
    usageLimit: 75, maxUses: 75, timesUsed: 0, usedCount: 0,
    description: '20% off on Premium & VIP plans for New Year sign-ups.',
  },
  {
    id: 'OFF-006', name: 'Student Discount', title: 'Student Discount',
    type: 'percentage', discountType: 'Percentage', value: 10, discountValue: 10,
    code: 'STUDENT10', category: 'Membership',
    applicablePlans: ['basic', 'standard'],
    applicableCategories: ['Ladies', 'Mens', 'Mixed'],
    validFrom: '2026-06-01', validTo: '2026-07-31',
    startDate: '2026-06-01', endDate: '2026-07-31',
    status: 'Expired',
    usageLimit: 100, maxUses: 100, timesUsed: 91, usedCount: 91,
    description: '10% student discount on Basic and Standard plans (ID required).',
  },
];

// ── Notifications ─────────────────────────────────────────────────────────────
export const notifications = [
  { id: 1, type: 'payment',   title: 'Payment Failed',         message: "Kavya Reddy's payment of ₹2,299 failed.",           time: '5 min ago',  read: false, severity: 'error'   },
  { id: 2, type: 'member',    title: 'New Member Joined',       message: 'Lakshmi Devi signed up for Basic (Ladies) plan.',    time: '1 hour ago', read: false, severity: 'success' },
  { id: 3, type: 'expiry',    title: 'Membership Expiring',     message: '12 memberships expire within 7 days.',               time: '2 hours ago',read: false, severity: 'warning' },
  { id: 4, type: 'attendance',title: 'Peak Attendance Alert',   message: 'Gym capacity at 95% — 6 PM slot.',                   time: '3 hours ago',read: true,  severity: 'info'    },
  { id: 5, type: 'equipment', title: 'Maintenance Due',         message: 'Stationary Bike maintenance is overdue.',            time: '1 day ago',  read: true,  severity: 'warning' },
  { id: 6, type: 'payment',   title: 'Revenue Milestone',       message: 'Monthly revenue crossed ₹4.8 L target!',             time: '2 days ago', read: true,  severity: 'success' },
  { id: 7, type: 'enquiry',   title: 'New Enquiry Received',    message: 'Tanvi Rao enquired about Ladies Premium plan.',       time: '30 min ago', read: false, severity: 'info'   },
  { id: 8, type: 'product',   title: 'Low Stock Alert',         message: 'Yoga Mat Premium stock below 5 units.',              time: '4 hours ago',read: true,  severity: 'warning' },
];

// ── Gym Timings ───────────────────────────────────────────────────────────────
export const gymTimings = [
  { day: 'Monday',    open: '5:00 AM', close: '11:00 PM', isOpen: true },
  { day: 'Tuesday',   open: '5:00 AM', close: '11:00 PM', isOpen: true },
  { day: 'Wednesday', open: '5:00 AM', close: '11:00 PM', isOpen: true },
  { day: 'Thursday',  open: '5:00 AM', close: '11:00 PM', isOpen: true },
  { day: 'Friday',    open: '5:00 AM', close: '11:00 PM', isOpen: true },
  { day: 'Saturday',  open: '6:00 AM', close: '10:00 PM', isOpen: true },
  { day: 'Sunday',    open: '7:00 AM', close: '9:00 PM',  isOpen: true },
];

// ── Testimonials ──────────────────────────────────────────────────────────────
export const testimonials = [
  { id: 1, name: 'Manish T.',  role: 'Gym Owner, FitLife Studios', rating: 5, text: 'GymForce completely transformed how we manage our 800+ members. The dashboard is intuitive and our staff loves the attendance tracking system.', avatar: 'MT' },
  { id: 2, name: 'Rekha K.',   role: 'Operations Manager, PowerZone', rating: 5, text: 'We cut admin time by 60% in the first month. The billing automation alone paid for itself within weeks. Highly recommend to any gym.', avatar: 'RK' },
  { id: 3, name: 'Deepak M.',  role: 'Personal Trainer & Studio Owner', rating: 5, text: 'Finally a gym software that understands trainers. Managing clients, schedules, and sessions has never been this seamless.', avatar: 'DM' },
  { id: 4, name: 'Priya S.',   role: 'Fitness Director, Apex Health', rating: 5, text: 'The analytics helped us identify peak hours and optimise staffing. Revenue is up 23% since switching to GymForce.', avatar: 'PS' },
  { id: 5, name: 'Tanya R.',   role: 'Owner, Iron Brotherhood Gym', rating: 5, text: "Best investment I've made for my gym. Members get automated reminders and the app makes everything frictionless.", avatar: 'TR' },
];

// ── Features (Landing Page) ───────────────────────────────────────────────────
export const features = [
  { icon: '👥', title: 'Member Management',   desc: 'Complete member profiles, Ladies/Mens/Mixed categories, and automated renewal reminders all in one place.' },
  { icon: '📊', title: 'Smart Analytics',     desc: 'Real-time dashboards with revenue trends in ₹, attendance patterns, and growth metrics at a glance.' },
  { icon: '💳', title: 'Billing & Payments',  desc: 'Automated invoicing in ₹, multiple billing cycles, payment tracking, and multi-plan support.' },
  { icon: '📅', title: 'Attendance Tracking', desc: 'QR-code or RFID check-ins with daily/weekly/monthly attendance reports.' },
  { icon: '🏋️', title: 'Trainer Management',  desc: 'Assign clients, track sessions, manage schedules, and monitor trainer performance.' },
  { icon: '🔔', title: 'Smart Notifications', desc: 'Automated alerts for renewals, class reminders, equipment maintenance, and promotional offers.' },
];

// ── Enquiry Source Breakdown (for analytics) ──────────────────────────────────
export const enquirySourceData = [
  { name: 'Walk-in', value: 38, color: '#39FF14' },
  { name: 'Form',    value: 30, color: '#00D4FF' },
  { name: 'SMS',     value: 18, color: '#FF6B00' },
  { name: 'Chat',    value: 14, color: '#A855F7' },
];

// ── Trainer Workload (for analytics) ─────────────────────────────────────────
export const trainerWorkload = [
  { name: 'Rohit Kumar',     clients: 24, sessions: 48, capacity: 30 },
  { name: 'Anjali Singh',    clients: 18, sessions: 36, capacity: 25 },
  { name: 'Suresh Pillai',   clients: 20, sessions: 42, capacity: 25 },
  { name: 'Meenakshi Iyer',  clients: 30, sessions: 55, capacity: 35 },
  { name: 'Deepak Verma',    clients: 0,  sessions: 0,  capacity: 20 },
];

// ── Top-Selling Products (for analytics) ─────────────────────────────────────
export const productSalesData = [
  { product: 'Whey Protein', sales: 48, revenue: 119952 },
  { product: 'Creatine Mono', sales: 34, revenue: 27166 },
  { product: 'Pre-Workout', sales: 26, revenue: 36374 },
  { product: 'Yoga Mats', sales: 22, revenue: 21978 },
  { product: 'BCAA Drink', sales: 18, revenue: 19782 },
];

export const productRevenue = productSalesData.reduce((s, p) => s + p.revenue, 0);


// ── Peak Hours Heatmap Data ───────────────────────────────────────────────────
export const peakHoursData = [
  { hour: '5 AM',  Mon: 30, Tue: 25, Wed: 35, Thu: 28, Fri: 40, Sat: 50, Sun: 20 },
  { hour: '6 AM',  Mon: 80, Tue: 70, Wed: 90, Thu: 75, Fri: 95, Sat: 120,Sun: 40 },
  { hour: '7 AM',  Mon: 110,Tue: 95, Wed: 120,Thu: 100,Fri: 130,Sat: 150,Sun: 60 },
  { hour: '8 AM',  Mon: 90, Tue: 80, Wed: 100,Thu: 85, Fri: 110,Sat: 130,Sun: 70 },
  { hour: '9 AM',  Mon: 60, Tue: 55, Wed: 65, Thu: 58, Fri: 70, Sat: 90, Sun: 80 },
  { hour: '10 AM', Mon: 40, Tue: 38, Wed: 45, Thu: 40, Fri: 50, Sat: 70, Sun: 90 },
  { hour: '5 PM',  Mon: 100,Tue: 90, Wed: 110,Thu: 95, Fri: 120,Sat: 80, Sun: 50 },
  { hour: '6 PM',  Mon: 150,Tue: 140,Wed: 160,Thu: 145,Fri: 180,Sat: 100,Sun: 60 },
  { hour: '7 PM',  Mon: 130,Tue: 120,Wed: 140,Thu: 125,Fri: 160,Sat: 85, Sun: 45 },
  { hour: '8 PM',  Mon: 90, Tue: 85, Wed: 95, Thu: 88, Fri: 110,Sat: 60, Sun: 30 },
  { hour: '9 PM',  Mon: 50, Tue: 45, Wed: 55, Thu: 48, Fri: 60, Sat: 40, Sun: 20 },
];

// ── Roadmap Phase 2 ───────────────────────────────────────────────────────────
export const roadmapPhase2 = [
  {
    title: 'Mobile App (iOS & Android)',
    desc: 'Native apps for members and trainers with QR check-in, push notifications, and offline support.',
    status: 'in-progress', eta: 'Q4 2026',
  },
  {
    title: 'AI Workout Recommendations',
    desc: 'Machine-learning model that auto-generates personalised workout plans based on member goals and progress history.',
    status: 'in-progress', eta: 'Q4 2026',
  },
  {
    title: 'Razorpay / Stripe Integration',
    desc: 'Fully automated online payment collection with auto-renewal, failed-payment retries, and instant receipts.',
    status: 'planned', eta: 'Q1 2027',
  },
  {
    title: 'Diet & Nutrition Planner',
    desc: 'Built-in meal planner with macro tracking, Indian recipe database, and sync with trainer diet plans.',
    status: 'planned', eta: 'Q1 2027',
  },
  {
    title: 'WhatsApp & SMS Automation',
    desc: 'Automated renewal reminders, booking confirmations, and promotional messages via WhatsApp Business API.',
    status: 'planned', eta: 'Q2 2027',
  },
  {
    title: 'Multi-Branch Management',
    desc: 'Manage multiple gym locations from a single dashboard with consolidated reports and cross-branch member transfers.',
    status: 'planned', eta: 'Q2 2027',
  },
];


// ── Analytics Data ────────────────────────────────────────────────────────────
export const peakHoursSimple = [
  { hour: '5 AM',  count: 45 },
  { hour: '6 AM',  count: 120 },
  { hour: '7 AM',  count: 180 },
  { hour: '8 AM',  count: 140 },
  { hour: '9 AM',  count: 90 },
  { hour: '10 AM', count: 60 },
  { hour: '5 PM',  count: 90 },
  { hour: '6 PM',  count: 160 },
  { hour: '7 PM',  count: 200 },
  { hour: '8 PM',  count: 150 },
  { hour: '9 PM',  count: 80 },
];

export const trainerWorkloadData = [
  { name: 'Rohit Kumar',      sessions: 48, clients: 24, utilization: 85 },
  { name: 'Anjali Singh',     sessions: 36, clients: 18, utilization: 72 },
  { name: 'Suresh Pillai',    sessions: 42, clients: 20, utilization: 78 },
  { name: 'Meenakshi Iyer',   sessions: 55, clients: 30, utilization: 92 },
];

export const enquirySourceBreakdown = [
  { source: 'Walk-in',      count: 32, color: '#39FF14' },
  { source: 'Website',      count: 28, color: '#00D4FF' },
  { source: 'Referral',     count: 22, color: '#A855F7' },
  { source: 'Social Media', count: 18, color: '#EC4899' },
  { source: 'Google Ads',   count: 12, color: '#FF6B00' },
];

export const memberRetentionData = [
  { month: 'Jan', retained: 92, churned: 8 },
  { month: 'Feb', retained: 90, churned: 10 },
  { month: 'Mar', retained: 94, churned: 6 },
  { month: 'Apr', retained: 93, churned: 7 },
  { month: 'May', retained: 91, churned: 9 },
  { month: 'Jun', retained: 95, churned: 5 },
  { month: 'Jul', retained: 94, churned: 6 },
  { month: 'Aug', retained: 96, churned: 4 },
];

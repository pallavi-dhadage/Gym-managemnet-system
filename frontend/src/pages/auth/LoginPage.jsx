import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Zap, Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// ── Background gym images slider ─────────────────────────────────────────────
const BG_IMAGES = [
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1400&auto=format&fit=crop&q=80',
];

const ROLES = ['Master Admin', 'Trainer', 'Staff', 'Receptionist', 'Gym Member'];

const DEMO_CREDS = {
  'Master Admin': { email: 'admin@gymforce.com',        password: 'Admin@123'  },
  'Trainer':      { email: 'trainer@gymforce.com',      password: 'Trainer@123'},
  'Staff':        { email: 'staff@gymforce.com',        password: 'Staff@123'  },
  'Receptionist': { email: 'receptionist@gymforce.com', password: 'Recept@123' },
  'Gym Member':   { email: 'member@gymforce.com',       password: 'Member@123' },
};

const ROLE_COLORS = {
  'Master Admin': '#39FF14', 'Trainer': '#00D4FF', 'Staff': '#FF6B00',
  'Receptionist': '#A855F7', 'Gym Member': '#F59E0B',
};

export default function LoginPage() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [bgIdx, setBgIdx] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState('Master Admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // If already logged in, redirect away
  useEffect(() => {
    if (currentUser) navigate(from, { replace: true });
  }, [currentUser]);

  // Background image auto-rotate
  useEffect(() => {
    const t = setInterval(() => setBgIdx(i => (i + 1) % BG_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Fill demo credentials when role changes
  const handleRoleSelect = (r) => {
    setRole(r);
    setError('');
    setFieldErrors({});
  };

  const fillDemo = () => {
    const creds = DEMO_CREDS[role];
    setEmail(creds.email);
    setPassword(creds.password);
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address.';
    if (!password) errs.password = 'Password is required.';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    setLoading(true);

    setTimeout(() => {
      const result = login(email.trim(), password, role);
      setLoading(false);
      if (result.success) {
        // Gym members go to member portal, others go to dashboard
        const dest = result.user.role === 'gym_member' ? '/member' : (from.startsWith('/member') ? '/dashboard' : from);
        navigate(dest, { replace: true });
      } else {
        setError(result.error);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* ── Left panel – animated background slider ─────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        {BG_IMAGES.map((src, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: i === bgIdx ? 1 : 0,
              backgroundImage: `url('${src}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        {/* Dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/90 via-gray-950/50 to-gray-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />

        {/* Decorative glow orbs */}
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-[#39FF14]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-[#00D4FF]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#39FF14] to-[#00D4FF] flex items-center justify-center shadow-lg">
              <Zap size={20} className="text-gray-950" />
            </div>
            <span className="text-2xl font-black tracking-tight">Gym<span className="text-[#39FF14]">Force</span></span>
          </Link>

          <div>
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
              <span className="text-sm text-[#39FF14] font-medium">Trusted by 500+ gyms worldwide</span>
            </div>
            <h2 className="text-5xl font-black text-white mb-4 leading-tight">
              Your Gym,<br />
              <span className="gradient-text">Fully Automated.</span>
            </h2>
            <p className="text-gray-400 text-base leading-relaxed max-w-sm mb-8">
              Sign in to access your complete gym management dashboard — members, billing, attendance, and more.
            </p>

            {/* Stats */}
            <div className="flex gap-8 pt-6 border-t border-gray-800/60">
              {[['1,284', 'Active Members'], ['₹4.8L+', 'Monthly Revenue'], ['73%', 'Avg Attendance']].map(([v, l]) => (
                <div key={l}>
                  <p className="text-2xl font-black text-white">{v}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Slider dots */}
          <div className="flex gap-2 pb-2">
            {BG_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setBgIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === bgIdx ? 'w-6 bg-[#39FF14]' : 'w-1.5 bg-gray-600'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel – login form ──────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-950 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#39FF14] to-[#00D4FF] flex items-center justify-center">
              <Zap size={16} className="text-gray-950" />
            </div>
            <span className="text-xl font-black">Gym<span className="text-[#39FF14]">Force</span></span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-1">Welcome back</h1>
            <p className="text-gray-400 text-sm">Sign in to your GymForce account</p>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Sign in as</p>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-900 rounded-xl border border-gray-800 mb-2">
              {ROLES.slice(0,3).map(r => (
                <button key={r} type="button" onClick={() => handleRoleSelect(r)}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${role === r ? 'text-gray-950' : 'text-gray-400 hover:text-white'}`}
                  style={role === r ? { background: ROLE_COLORS[r] } : {}}>
                  {r}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-900 rounded-xl border border-gray-800">
              {ROLES.slice(3).map(r => (
                <button key={r} type="button" onClick={() => handleRoleSelect(r)}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${role === r ? 'text-gray-950' : 'text-gray-400 hover:text-white'}`}
                  style={role === r ? { background: ROLE_COLORS[r] } : {}}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Demo fill button */}
          <button
            type="button"
            onClick={fillDemo}
            className="w-full flex items-center justify-center gap-2 mb-5 py-2 text-xs text-gray-500 border border-dashed border-gray-700 rounded-xl hover:border-gray-500 hover:text-gray-300 transition-all"
          >
            <ShieldCheck size={13} />
            Use demo credentials for {role}
          </button>

          {/* Global error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-5">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-300 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors(p => ({ ...p, email: '' }));
                    if (error) setError('');
                  }}
                  placeholder="you@gymforce.com"
                  className={`w-full bg-gray-900 border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                    fieldErrors.email ? 'border-red-500/60 focus:border-red-500' : 'border-gray-700 focus:border-[#39FF14]/60'
                  }`}
                />
              </div>
              {fieldErrors.email && <p className="text-xs text-red-400 mt-1">{fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  id="login-password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors(p => ({ ...p, password: '' }));
                    if (error) setError('');
                  }}
                  placeholder="••••••••"
                  className={`w-full bg-gray-900 border rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                    fieldErrors.password ? 'border-red-500/60 focus:border-red-500' : 'border-gray-700 focus:border-[#39FF14]/60'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-xs text-red-400 mt-1">{fieldErrors.password}</p>}
            </div>


            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer select-none">
                <input type="checkbox" className="rounded border-gray-600 bg-gray-900 accent-[#39FF14]" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-[#39FF14] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#39FF14] text-gray-950 font-bold py-3.5 rounded-xl hover:bg-[#39FF14]/90 transition-all neon-glow disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-950/30 border-t-gray-950 rounded-full animate-spin" />
              ) : (
                <>Sign in as {role} <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <div className="flex flex-col gap-3 mt-6">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-800" />
              <span className="text-xs text-gray-600">or</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>

            <p className="text-center text-sm text-gray-500">
              New team member?{' '}
              <Link to="/register" className="text-[#39FF14] font-semibold hover:underline">
                Create account
              </Link>
            </p>
            <p className="text-center text-sm text-gray-500">
              Interested in joining?{' '}
              <Link to="/enquiry" className="text-[#00D4FF] font-semibold hover:underline">
                Submit an enquiry
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

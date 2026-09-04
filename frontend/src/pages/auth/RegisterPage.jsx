import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, Zap, User, Mail, Lock, Building2,
  Phone, ArrowRight, Check, AlertCircle, ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ROLES = ['Master Admin', 'Trainer', 'Staff', 'Receptionist'];

const ROLE_PERKS = {
  'Master Admin':  ['Full platform access', 'Manage all staff & trainers', 'Revenue & analytics reports', 'Configure gym settings'],
  'Trainer':       ['View assigned members', 'Track attendance sessions', 'Manage your schedule', 'Client progress tracking'],
  'Staff':         ['Member check-in & lookup', 'Process payments', 'Attendance management', 'Notification access'],
  'Receptionist':  ['Handle member enquiries', 'Member check-in & registration', 'Manage walk-ins & leads', 'Billing & plan assignment'],
};

const BG_IMAGES = [
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1400&auto=format&fit=crop&q=80',
];

// ── Stable Top-Level Input Component (Prevents focus loss on re-render) ─────────
function InputField({ label, name, type = 'text', placeholder, icon: Icon, value, onChange, error }) {
  return (
    <div>
      <label htmlFor={`reg-${name}`} className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      <div className="relative">
        <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        <input
          id={`reg-${name}`}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-gray-900 border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
            error ? 'border-red-500/60' : 'border-gray-700 focus:border-[#39FF14]/60'
          }`}
        />
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const { register, currentUser } = useAuth();
  const navigate = useNavigate();

  const [bgIdx, setBgIdx] = useState(0);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', gym: '', password: '', confirmPassword: '', role: 'Master Admin',
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (currentUser) {
      const dest = (currentUser.role === 'gym_member' || currentUser.role === 'member') ? '/member' : '/dashboard';
      navigate(dest, { replace: true });
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const t = setInterval(() => setBgIdx(i => (i + 1) % BG_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const update = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    if (fieldErrors[k]) setFieldErrors(p => ({ ...p, [k]: '' }));
    if (error) setError('');
  };

  // ── Validation ─────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errs.name = 'Full name must be at least 2 characters.';
    if (!form.email.trim())
      errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Enter a valid email address.';
    if (!form.gym.trim())
      errs.gym = 'Gym / organisation name is required.';
    if (!form.password)
      errs.password = 'Password is required.';
    else if (form.password.length < 8)
      errs.password = 'Password must be at least 8 characters.';
    else if (!/[A-Z]/.test(form.password))
      errs.password = 'Include at least one uppercase letter.';
    else if (!/[0-9]/.test(form.password))
      errs.password = 'Include at least one number.';
    if (!form.confirmPassword)
      errs.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    if (!agreed) { setError('You must agree to the Terms of Service to continue.'); return; }
    setLoading(true);

    const result = register(form);
    setLoading(false);
    if (result.success) {
      const dest = (result.user?.role === 'gym_member' || result.user?.role === 'member') ? '/member' : '/dashboard';
      navigate(dest, { replace: true });
    } else {
      setError(result.error);
    }
  };

  // Password strength
  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-400', 'bg-[#39FF14]'][strength];


  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* ── Left panel ─────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden">
        {BG_IMAGES.map((src, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === bgIdx ? 1 : 0, backgroundImage: `url('${src}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/95 via-gray-950/70 to-gray-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
        <div className="absolute top-1/3 left-1/4 w-56 h-56 bg-[#39FF14]/8 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col p-12 h-full justify-between">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#39FF14] to-[#00D4FF] flex items-center justify-center shadow-lg">
              <Zap size={20} className="text-gray-950" />
            </div>
            <span className="text-2xl font-black">Gym<span className="text-[#39FF14]">Force</span></span>
          </Link>

          <div>
            <h2 className="text-4xl font-black text-white mb-3 leading-tight">
              Start Managing<br />
              <span className="gradient-text">Smarter Today.</span>
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Join 500+ gym owners who've streamlined operations with GymForce.
            </p>

            {/* Role perks */}
            <div className="bg-gray-800/40 rounded-2xl p-4 border border-gray-700/50">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">{form.role} can</p>
              <ul className="space-y-2">
                {(ROLE_PERKS[form.role] || []).map(p => (
                  <li key={p} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <div className="w-4 h-4 rounded-full bg-[#39FF14]/20 flex items-center justify-center flex-shrink-0">
                      <Check size={10} className="text-[#39FF14]" />
                    </div>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Slider dots */}
          <div className="flex gap-2">
            {BG_IMAGES.map((_, i) => (
              <button key={i} onClick={() => setBgIdx(i)}
                className={`h-1.5 rounded-full transition-all ${i === bgIdx ? 'w-6 bg-[#39FF14]' : 'w-1.5 bg-gray-600'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel – form ─────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-950 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#39FF14] to-[#00D4FF] flex items-center justify-center">
              <Zap size={16} className="text-gray-950" />
            </div>
            <span className="text-xl font-black">Gym<span className="text-[#39FF14]">Force</span></span>
          </Link>

          <div className="mb-6">
            <h1 className="text-3xl font-black text-white mb-1">Create your account</h1>
            <p className="text-gray-400 text-sm">Get started — it's free for 14 days</p>
          </div>

          {/* Role selector */}
          <div className="mb-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">I am registering as</p>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map(r => (
                <button key={r} type="button" onClick={() => update('role', r)}
                  className={`py-2.5 text-xs font-bold rounded-xl border transition-all ${
                    form.role === r
                      ? r === 'Master Admin' ? 'border-[#39FF14]/60 bg-[#39FF14]/10 text-[#39FF14]'
                        : r === 'Trainer'    ? 'border-[#00D4FF]/60 bg-[#00D4FF]/10 text-[#00D4FF]'
                        : r === 'Receptionist'? 'border-[#A855F7]/60 bg-[#A855F7]/10 text-[#A855F7]'
                        : 'border-[#FF6B00]/60 bg-[#FF6B00]/10 text-[#FF6B00]'
                      : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Global error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4">
              <AlertCircle size={15} className="text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <InputField
              label="Full Name"
              name="name"
              placeholder="John Smith"
              icon={User}
              value={form.name}
              onChange={e => update('name', e.target.value)}
              error={fieldErrors.name}
            />
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@gymforce.com"
              icon={Mail}
              value={form.email}
              onChange={e => update('email', e.target.value)}
              error={fieldErrors.email}
            />
            <InputField
              label="Phone Number (optional)"
              name="phone"
              type="tel"
              placeholder="+1 555-0000"
              icon={Phone}
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
              error={fieldErrors.phone}
            />
            <InputField
              label="Gym / Organisation Name"
              name="gym"
              placeholder="Iron Paradise Gym"
              icon={Building2}
              value={form.gym}
              onChange={e => update('gym', e.target.value)}
              error={fieldErrors.gym}
            />

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  id="reg-password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  className={`w-full bg-gray-900 border rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                    fieldErrors.password ? 'border-red-500/60' : 'border-gray-700 focus:border-[#39FF14]/60'
                  }`}
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : 'bg-gray-700'}`} />
                    ))}
                  </div>
                  {strengthLabel && <p className={`text-xs font-medium ${['','text-red-400','text-yellow-400','text-blue-400','text-[#39FF14]'][strength]}`}>{strengthLabel} password</p>}
                </div>
              )}
              {fieldErrors.password && <p className="text-xs text-red-400 mt-1">{fieldErrors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirmPassword" className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <input
                  id="reg-confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={e => update('confirmPassword', e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full bg-gray-900 border rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                    fieldErrors.confirmPassword ? 'border-red-500/60' : 'border-gray-700 focus:border-[#39FF14]/60'
                  }`}
                />
                <button type="button" onClick={() => setShowConfirm(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {fieldErrors.confirmPassword && <p className="text-xs text-red-400 mt-1">{fieldErrors.confirmPassword}</p>}
            </div>


            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 rounded border-gray-600 bg-gray-900 accent-[#39FF14]" />
              <span className="text-sm text-gray-400">
                I agree to the{' '}
                <a href="#" className="text-[#39FF14] hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-[#39FF14] hover:underline">Privacy Policy</a>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !agreed}
              className="w-full flex items-center justify-center gap-2 bg-[#39FF14] text-gray-950 font-bold py-3.5 rounded-xl hover:bg-[#39FF14]/90 transition-all neon-glow disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-gray-950/30 border-t-gray-950 rounded-full animate-spin" />
                : <>Create Account <ArrowRight size={15} /></>
              }
            </button>
          </form>

          <div className="mt-5 space-y-2 text-center text-sm text-gray-500">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-[#39FF14] font-semibold hover:underline">Sign in</Link>
            </p>
            <p>
              Member enquiry?{' '}
              <Link to="/enquiry" className="text-[#00D4FF] font-semibold hover:underline">Chat with us</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

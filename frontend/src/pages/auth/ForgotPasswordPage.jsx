import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, ArrowLeft, ArrowRight, Check } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#39FF14] to-[#00D4FF] flex items-center justify-center">
            <Zap size={16} className="text-gray-950" />
          </div>
          <span className="text-xl font-black">Gym<span className="text-[#39FF14]">Force</span></span>
        </Link>

        {!sent ? (
          <>
            <h1 className="text-3xl font-black text-white mb-2">Forgot password?</h1>
            <p className="text-gray-400 mb-8">Enter your email and we'll send you a reset link.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@gymforce.com"
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/60 transition-colors"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#39FF14] text-gray-950 font-bold py-3.5 rounded-xl hover:bg-[#39FF14]/90 transition-all neon-glow"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-gray-950/40 border-t-gray-950 rounded-full animate-spin" />
                ) : (
                  <>Send Reset Link <ArrowRight size={16} /></>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#39FF14]/20 border border-[#39FF14]/40 flex items-center justify-center mx-auto mb-6">
              <Check size={28} className="text-[#39FF14]" />
            </div>
            <h1 className="text-2xl font-black text-white mb-2">Check your email</h1>
            <p className="text-gray-400 mb-8">
              We sent a password reset link to <span className="text-white font-medium">{email}</span>.
              Check your inbox and click the link to reset your password.
            </p>
            <p className="text-sm text-gray-600">
              Didn't receive it?{' '}
              <button onClick={() => setSent(false)} className="text-[#39FF14] hover:underline">Try again</button>
            </p>
          </div>
        )}

        <Link to="/login" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors mt-8">
          <ArrowLeft size={16} />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, Menu, X, ChevronRight, Star, Check, ArrowRight,
  Users, BarChart3, CreditCard, CalendarCheck, Dumbbell, Bell,
  Play, ChevronLeft
} from 'lucide-react';
import { testimonials, membershipPlans, features, roadmapPhase2 } from '../data/sampleData';

// ── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = ['Features', 'How It Works', 'Pricing', 'Roadmap', 'Testimonials'];

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'glass-dark shadow-lg' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#39FF14] to-[#00D4FF] flex items-center justify-center">
            <Zap size={16} className="text-gray-950 fill-gray-950" />
          </div>
          <span className="text-xl font-bold tracking-tight">Gym<span className="text-[#39FF14]">Force</span></span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`} className="text-sm text-gray-400 hover:text-white transition-colors">
              {l}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors px-4 py-2">
            Sign In
          </Link>
          <Link to="/register" className="text-sm bg-[#39FF14] text-gray-950 font-semibold px-5 py-2 rounded-lg hover:bg-[#39FF14]/90 transition-all neon-glow">
            Get Started
          </Link>
        </div>

        <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass-dark border-t border-gray-800 px-4 py-4 space-y-3">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`}
              onClick={() => setOpen(false)}
              className="block text-gray-300 hover:text-white py-2 transition-colors">
              {l}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-3 border-t border-gray-800">
            <Link to="/login" className="text-center py-2.5 text-gray-300 border border-gray-700 rounded-lg">Sign In</Link>
            <Link to="/register" className="text-center py-2.5 bg-[#39FF14] text-gray-950 font-semibold rounded-lg">Get Started Free</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gray-950">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&auto=format&fit=crop&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-950/40 to-gray-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-transparent to-gray-950/40" />
      </div>

      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#39FF14]/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-[#00D4FF]/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 pt-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
            <span className="text-sm text-[#39FF14] font-medium">Now serving 500+ gyms worldwide</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6">
            Run Your Gym<br />
            <span className="gradient-text">Like a Pro</span>
          </h1>

          <p className="text-xl text-gray-300 max-w-xl mb-10 leading-relaxed">
            GymForce is the all-in-one management platform built for modern fitness businesses.
            Automate billing, track attendance, manage trainers, and grow your membership — all from one powerful dashboard.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-[#39FF14] text-gray-950 font-bold px-8 py-4 rounded-xl text-base hover:bg-[#39FF14]/90 transition-all neon-glow"
            >
              Start Free Trial
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 glass border border-gray-600 text-white font-semibold px-8 py-4 rounded-xl text-base hover:border-gray-400 transition-all"
            >
              <Play size={16} className="fill-current" />
              View Demo
            </Link>
            <Link
              to="/enquiry"
              className="inline-flex items-center gap-2 border border-[#00D4FF]/40 text-[#00D4FF] font-semibold px-8 py-4 rounded-xl text-base hover:bg-[#00D4FF]/10 transition-all"
            >
              Member Enquiry
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-14 pt-8 border-t border-gray-800/50">
            {[
              { value: '500+', label: 'Gyms Powered' },
              { value: '120K+', label: 'Members Managed' },
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '4.9★', label: 'Average Rating' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl font-black text-white">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 animate-bounce">
        <div className="w-5 h-8 border-2 border-gray-700 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-gray-600 rounded-full" />
        </div>
      </div>
    </section>
  );
}

// ── Features ─────────────────────────────────────────────────────────────────
function Features() {
  return (
    <section id="features" className="py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[#39FF14] text-sm font-semibold uppercase tracking-widest">Everything You Need</span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 mb-4">Built for Serious Gyms</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">Every tool your fitness business needs, designed to be fast, intuitive, and powerful.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="glass p-6 rounded-2xl card-hover group border border-gray-800 hover:border-[#39FF14]/20 transition-all">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#39FF14] transition-colors">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How it Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { step: '01', title: 'Set Up Your Gym', desc: 'Create your GymForce account, add your gym details, configure membership plans, and invite your staff in under 10 minutes.', color: '#39FF14' },
    { step: '02', title: 'Onboard Members', desc: 'Import existing members or have new members register themselves. Assign plans, trainers, and generate digital membership cards.', color: '#00D4FF' },
    { step: '03', title: 'Automate Operations', desc: 'Let GymForce handle billing, send renewal reminders, track attendance, and alert you to issues before they become problems.', color: '#FF6B00' },
    { step: '04', title: 'Grow with Insights', desc: 'Use real-time analytics to spot trends, optimize pricing, track trainer performance, and make data-driven decisions every day.', color: '#A855F7' },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#39FF14]/3 to-[#00D4FF]/3" />
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[#00D4FF] text-sm font-semibold uppercase tracking-widest">Simple Process</span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 mb-4">Up and Running in Minutes</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">No complicated setup. No IT team required. Just pure, gym management power.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-gray-700 to-transparent z-10" />
              )}
              <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 card-hover h-full">
                <div className="text-4xl font-black mb-4" style={{ color: s.color }}>{s.step}</div>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Pricing ───────────────────────────────────────────────────────────────────
function Pricing() {
  const [selectedCategory, setSelectedCategory] = useState('Mens');
  
  const colorMap = {
    gray: { border: 'border-gray-700', badge: 'bg-gray-700 text-gray-300', btn: 'bg-gray-700 hover:bg-gray-600 text-white' },
    blue: { border: 'border-[#00D4FF]/40', badge: 'bg-[#00D4FF]/20 text-[#00D4FF]', btn: 'bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-gray-950' },
    green: { border: 'border-[#39FF14]/40', badge: 'bg-[#39FF14]/20 text-[#39FF14]', btn: 'bg-[#39FF14] hover:bg-[#39FF14]/90 text-gray-950' },
    orange: { border: 'border-[#FF6B00]/40', badge: 'bg-[#FF6B00]/20 text-[#FF6B00]', btn: 'bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white' },
  };

  return (
    <section id="pricing" className="py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[#FF6B00] text-sm font-semibold uppercase tracking-widest">Member Pricing</span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 mb-4">Plans for Every Member</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">Flexible plans that grow with your gym. No hidden fees, no contracts.</p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {['Mens', 'Ladies', 'Mixed'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                selectedCategory === cat
                  ? 'bg-[#39FF14] text-gray-950'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {membershipPlans.map(plan => {
            const c = colorMap[plan.color];
            const price = plan.prices[selectedCategory];
            return (
              <div
                key={plan.id}
                className={`relative bg-gray-900 border-2 ${c.border} rounded-2xl p-6 card-hover flex flex-col ${plan.popular ? 'ring-2 ring-[#00D4FF]/50 scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00D4FF] text-gray-950 text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <div className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4 ${c.badge}`}>
                  {plan.name}
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">₹{price.toLocaleString('en-IN')}</span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check size={14} className="text-[#39FF14] mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                  {plan.notIncluded.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <X size={14} className="mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={`text-center py-3 rounded-xl text-sm font-bold transition-all ${c.btn}`}
                >
                  Choose {plan.name}
                </Link>
              </div>
            );
          })}
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Prices shown are for {selectedCategory} category. All plans include GST.{' '}
          <Link to="/register" className="text-[#39FF14] hover:underline">Get Started →</Link>
        </p>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
function Testimonials() {
  const [idx, setIdx] = useState(0);
  const len = testimonials.length;

  return (
    <section id="testimonials" className="py-24 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#39FF14]/4 to-transparent" />
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[#39FF14] text-sm font-semibold uppercase tracking-widest">Real Results</span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 mb-4">Loved by Gym Owners</h2>
        </div>

        {/* Mobile slider */}
        <div className="md:hidden">
          <div className="glass border border-gray-700 rounded-2xl p-6 mb-4">
            <div className="flex gap-1 mb-4">
              {[...Array(testimonials[idx].rating)].map((_, i) => (
                <Star key={i} size={16} className="fill-[#FF6B00] text-[#FF6B00]" />
              ))}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">"{testimonials[idx].text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#39FF14]/20 to-[#00D4FF]/20 border border-[#39FF14]/30 flex items-center justify-center text-sm font-bold text-[#39FF14]">
                {testimonials[idx].avatar}
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{testimonials[idx].name}</p>
                <p className="text-xs text-gray-500">{testimonials[idx].role}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => setIdx((idx - 1 + len) % len)} className="p-2 glass rounded-full border border-gray-700 hover:border-[#39FF14]/50 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-[#39FF14] w-4' : 'bg-gray-600'}`} />
              ))}
            </div>
            <button onClick={() => setIdx((idx + 1) % len)} className="p-2 glass rounded-full border border-gray-700 hover:border-[#39FF14]/50 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={t.id} className={`glass border border-gray-700 rounded-2xl p-6 card-hover ${i === 2 ? 'lg:row-span-1' : ''}`}>
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={14} className="fill-[#FF6B00] text-[#FF6B00]" />
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#39FF14]/20 to-[#00D4FF]/20 border border-[#39FF14]/30 flex items-center justify-center text-sm font-bold text-[#39FF14]">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Roadmap ────────────────────────────────────────────────────────────────────
function Roadmap() {
  const statusMap = {
    'in-progress': { color: '#00D4FF', label: 'In Progress', bg: 'bg-[#00D4FF]/10 border-[#00D4FF]/30 text-[#00D4FF]' },
    planned: { color: '#6B7280', label: 'Planned', bg: 'bg-gray-700/30 border-gray-600/30 text-gray-400' },
  };

  return (
    <section id="roadmap" className="py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[#00D4FF] text-sm font-semibold uppercase tracking-widest">What's Coming</span>
          <h2 className="text-4xl md:text-5xl font-black mt-2 mb-4">Phase 2 Roadmap</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">We're just getting started. Here's what's on the horizon for GymForce.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmapPhase2.map((item, i) => {
            const s = statusMap[item.status];
            return (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${s.bg}`}>{s.label}</span>
                  <span className="text-xs text-gray-500">{item.eta}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── CTA Banner ────────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#39FF14]/8 to-[#00D4FF]/8" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#39FF14]/40 to-transparent" />
      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-4">
          Ready to Transform<br />Your Gym Business?
        </h2>
        <p className="text-gray-400 text-lg mb-8">Start your 14-day free trial. No credit card required.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/register" className="inline-flex items-center gap-2 bg-[#39FF14] text-gray-950 font-bold px-10 py-4 rounded-xl hover:bg-[#39FF14]/90 transition-all neon-glow text-base">
            Get Started Free
            <ArrowRight size={18} />
          </Link>
          <Link to="/dashboard" className="inline-flex items-center gap-2 glass border border-gray-600 text-white font-semibold px-10 py-4 rounded-xl hover:border-gray-400 transition-all text-base">
            Live Demo
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer id="contact" className="bg-gray-950 border-t border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#39FF14] to-[#00D4FF] flex items-center justify-center">
                <Zap size={16} className="text-gray-950" />
              </div>
              <span className="text-lg font-bold">Gym<span className="text-[#39FF14]">Force</span></span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">The premium gym management platform for modern fitness businesses.</p>
            <div className="flex gap-3">
              {['Twitter', 'LinkedIn', 'Instagram'].map(s => (
                <a key={s} href="#" className="w-8 h-8 glass border border-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-400 hover:text-white hover:border-gray-500 transition-all">
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Roadmap', 'Changelog', 'API Docs'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press', 'Contact'] },
            { title: 'Support', links: ['Help Center', 'Community', 'Status', 'Privacy Policy', 'Terms of Service'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-semibold text-white mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">© 2026 GymForce Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
            <span className="text-sm text-gray-500">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Landing Page ───────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="bg-gray-950 text-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <Roadmap />
      <CTABanner />
      <Footer />
    </div>
  );
}

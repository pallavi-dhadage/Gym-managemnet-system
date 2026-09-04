import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, Send, User, Mail, Phone, MessageSquare,
  ArrowLeft, Check, ChevronDown, Dumbbell, Clock, MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// ── Bot reply logic ───────────────────────────────────────────────────────────
const BOT_RESPONSES = {
  price:    "Our plans start at ₹699/month (Basic) up to ₹3,499/month (VIP). We also offer annual plans with extra discounts! Would you like details on a specific plan?",
  plan:     "We have 4 plans:\n• Basic – ₹699/mo (gym access, lockers)\n• Standard – ₹1,299/mo (+ group classes)\n• Premium – ₹1,999/mo (+ PT sessions, spa)\n• VIP – ₹3,499/mo (unlimited everything)\n\nWhich sounds right for you?",
  class:    "We offer Yoga, HIIT, Spin, Zumba, and CrossFit classes daily. Group classes are included from Standard plan onwards. Want a full schedule?",
  hour:     "We're open Monday–Friday 5AM–11PM and weekends 6AM–10PM. We also have 24/7 key fob access for Premium and VIP members.",
  location: "Our main gym is at 42 Fitness Avenue, MG Road. We have 2 more locations — Indiranagar and Whitefield. All branches are accessible with one membership!",
  trainer:  "Absolutely! We have certified personal trainers specialising in Strength, HIIT, Yoga, Nutrition, and Bodybuilding. PT sessions start from ₹500/session or are included in Premium/VIP plans.",
  trial:    "Yes! We offer a free 1-day trial pass. Just come in with a valid ID, or fill the form below and we'll email your pass straight away.",
  default:  "Thanks for reaching out! One of our team members will respond within a few hours. In the meantime, feel free to ask anything about our plans, classes, trainers, or facilities.",
};

const getBotReply = (msg) => {
  const m = msg.toLowerCase();
  if (/price|cost|fee|how much|rate/.test(m)) return BOT_RESPONSES.price;
  if (/plan|membership|package|tier/.test(m)) return BOT_RESPONSES.plan;
  if (/class|yoga|hiit|spin|zumba|group/.test(m)) return BOT_RESPONSES.class;
  if (/hour|time|open|close|schedule/.test(m)) return BOT_RESPONSES.hour;
  if (/location|address|where|branch/.test(m)) return BOT_RESPONSES.location;
  if (/trainer|coach|pt|personal/.test(m)) return BOT_RESPONSES.trainer;
  if (/trial|free|demo|try/.test(m)) return BOT_RESPONSES.trial;
  return BOT_RESPONSES.default;
};

const QUICK_QUESTIONS = [
  'What are your membership plans?',
  'Do you offer a free trial?',
  'What classes do you have?',
  'How much does a trainer cost?',
  'What are your opening hours?',
];

// ── Enquiry Form ─────────────────────────────────────────────────────────────
function EnquiryForm({ onSubmit, submitted }) {
  const { addEnquiry } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', interest: 'General', message: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required.';
    if (!form.message.trim()) e.message = 'Please tell us your query.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    addEnquiry({ ...form, via: 'form' });
    onSubmit(form);
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-[#39FF14]/20 border border-[#39FF14]/40 flex items-center justify-center mx-auto mb-4">
          <Check size={28} className="text-[#39FF14]" />
        </div>
        <h3 className="text-xl font-black text-white mb-2">Enquiry Submitted!</h3>
        <p className="text-gray-400 text-sm">We'll reach out within 24 hours. Check your email for confirmation.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      {[
        { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your name', icon: User },
        { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@email.com', icon: Mail },
        { label: 'Phone (optional)', key: 'phone', type: 'tel', placeholder: '+91 98765 00000', icon: Phone },
      ].map(f => (
        <div key={f.key}>
          <label className="block text-xs font-medium text-gray-400 mb-1">{f.label}</label>
          <div className="relative">
            <f.icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              className={`w-full bg-gray-900 border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${errors[f.key] ? 'border-red-500/60' : 'border-gray-700 focus:border-[#39FF14]/50'}`} />
          </div>
          {errors[f.key] && <p className="text-xs text-red-400 mt-0.5">{errors[f.key]}</p>}
        </div>
      ))}

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">I'm interested in</label>
        <select value={form.interest} onChange={e => setForm(p => ({ ...p, interest: e.target.value }))}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#39FF14]/50">
          {['General', 'Membership Plans', 'Personal Training', 'Group Classes', 'Corporate Package', 'Other'].map(o => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">Message</label>
        <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
          placeholder="Tell us how we can help..."
          rows={3}
          className={`w-full bg-gray-900 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors resize-none ${errors.message ? 'border-red-500/60' : 'border-gray-700 focus:border-[#39FF14]/50'}`} />
        {errors.message && <p className="text-xs text-red-400 mt-0.5">{errors.message}</p>}
      </div>

      <button type="submit"
        className="w-full bg-[#39FF14] text-gray-950 font-bold py-3 rounded-xl hover:bg-[#39FF14]/90 transition-all neon-glow text-sm flex items-center justify-center gap-2">
        <Send size={14} /> Submit Enquiry
      </button>
    </form>
  );
}

// ── Live Chat ─────────────────────────────────────────────────────────────────
function LiveChat() {
  const [messages, setMessages] = useState([
    {
      id: 1, from: 'bot', text: "👋 Hi there! Welcome to GymForce. I'm your virtual assistant. Ask me anything about our plans, classes, trainers, or facilities — or simply submit an enquiry form!", time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text: text.trim(), time: 'Just now' };
    setMessages(p => [...p, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const reply = getBotReply(text);
      setTyping(false);
      setMessages(p => [...p, { id: Date.now() + 1, from: 'bot', text: reply, time: 'Just now' }]);
    }, 1000 + Math.random() * 500);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat history */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.map(m => (
          <div key={m.id} className={`flex items-end gap-2 ${m.from === 'user' ? 'flex-row-reverse' : ''}`}>
            {m.from === 'bot' && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#39FF14] to-[#00D4FF] flex items-center justify-center flex-shrink-0">
                <Zap size={12} className="text-gray-950" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
              m.from === 'user'
                ? 'bg-[#39FF14] text-gray-950 font-medium rounded-br-md'
                : 'bg-gray-800 text-gray-200 rounded-bl-md'
            }`}>
              {m.text}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#39FF14] to-[#00D4FF] flex items-center justify-center flex-shrink-0">
              <Zap size={12} className="text-gray-950" />
            </div>
            <div className="bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {QUICK_QUESTIONS.map(q => (
            <button key={q} onClick={() => sendMessage(q)}
              className="flex-shrink-0 text-xs bg-gray-800 text-gray-300 border border-gray-700 px-3 py-1.5 rounded-full hover:border-[#39FF14]/40 hover:text-white transition-all">
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-colors"
          />
          <button type="submit" disabled={!input.trim()}
            className="w-10 h-10 bg-[#39FF14] text-gray-950 rounded-xl flex items-center justify-center hover:bg-[#39FF14]/90 transition-all disabled:opacity-40">
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MemberEnquiryPage() {
  const [tab, setTab] = useState('chat');
  const [submitted, setSubmitted] = useState(false);

  const gymInfo = [
    { icon: MapPin, label: '42 Fitness Avenue, MG Road', color: '#39FF14' },
    { icon: Clock, label: 'Mon–Fri 5AM–11PM · Weekends 6AM–10PM', color: '#00D4FF' },
    { icon: Phone, label: '+91 98765 00001', color: '#FF6B00' },
    { icon: Dumbbell, label: '5 Expert Trainers · 6 Gym Zones', color: '#A855F7' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/login" className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#39FF14] to-[#00D4FF] flex items-center justify-center">
                <Zap size={15} className="text-gray-950" />
              </div>
              <span className="text-lg font-black">Gym<span className="text-[#39FF14]">Force</span></span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse" />
            <span className="text-xs text-[#39FF14] font-medium">Live Support</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4 border border-gray-700">
            <MessageSquare size={14} className="text-[#39FF14]" />
            <span className="text-sm text-[#39FF14] font-medium">Member Enquiry Centre</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            Interested in Joining?
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Chat with our virtual assistant instantly or submit an enquiry and we'll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — gym info */}
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-4">Visit Us</h3>
              <div className="space-y-3">
                {gymInfo.map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
                      <Icon size={14} style={{ color }} />
                    </div>
                    <p className="text-sm text-gray-300 leading-snug">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan preview cards */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-4">Quick Plan Overview</h3>
              <div className="space-y-2">
                {[
                  { name: 'Basic', price: '₹699', color: '#6B7280' },
                  { name: 'Standard', price: '₹1,299', color: '#00D4FF' },
                  { name: 'Premium', price: '₹1,999', color: '#39FF14' },
                  { name: 'VIP', price: '₹3,499', color: '#FF6B00' },
                ].map(p => (
                  <div key={p.name} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-800/50 border border-gray-700/50">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                      <span className="text-sm text-gray-300">{p.name}</span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: p.color }}>{p.price}<span className="text-gray-600 font-normal text-xs">/mo</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — chat + form */}
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: '600px' }}>
            {/* Tabs */}
            <div className="flex border-b border-gray-800">
              {[
                { key: 'chat', label: 'Live Chat', icon: MessageSquare },
                { key: 'form', label: 'Submit Enquiry', icon: Mail },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all ${
                    tab === t.key
                      ? 'text-[#39FF14] border-b-2 border-[#39FF14] bg-[#39FF14]/5'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <t.icon size={15} />
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              {tab === 'chat'
                ? <LiveChat />
                : <div className="p-5 overflow-y-auto flex-1">
                    <p className="text-sm text-gray-400 mb-4">Fill out this form and our team will contact you within 24 hours.</p>
                    <EnquiryForm onSubmit={() => setSubmitted(true)} submitted={submitted} />
                  </div>
              }
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Ready to sign up?{' '}
            <Link to="/register" className="text-[#39FF14] font-semibold hover:underline">Create an account</Link>
            {' '}·{' '}
            <Link to="/login" className="text-gray-400 hover:text-white">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { CalendarCheck, Search, Clock, MapPin, TrendingUp, Users, X, Check } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { attendanceLog as seedLog, attendanceData } from '../../data/sampleData';
import { members } from '../../data/sampleData';

const PER_PAGE = 6;

const areaStats = [
  { name: 'Weight Room', count: 142, pct: 40, color: '#39FF14' },
  { name: 'Cardio Zone', count: 98, pct: 28, color: '#00D4FF' },
  { name: 'Group Classes', count: 71, pct: 20, color: '#FF6B00' },
  { name: 'Yoga Studio', count: 43, pct: 12, color: '#A855F7' },
];

// ── Mark Attendance Modal ─────────────────────────────────────────────────────
function MarkModal({ onClose, onSave }) {
  const areas = ['Weight Room', 'Cardio Zone', 'Yoga Studio', 'Group Classes', 'Functional Area'];
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toTimeString().slice(0, 5);
  const [form, setForm] = useState({ member: '', area: areas[0], date: today, checkIn: now, checkOut: '' });
  const [errors, setErrors] = useState({});
  const update = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.member.trim()) e.member = 'Member name is required.';
    if (!form.checkIn)       e.checkIn = 'Check-in time is required.';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const duration = form.checkOut && form.checkIn
      ? (() => { const diff = (new Date(`2000-01-01T${form.checkOut}`) - new Date(`2000-01-01T${form.checkIn}`)) / 60000; return diff > 0 ? `${Math.floor(diff / 60)}h ${diff % 60}m` : '—'; })()
      : '—';
    onSave({ ...form, duration });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="font-bold text-white">Mark Attendance</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 hover:bg-gray-800 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Member Name *</label>
            <input list="member-list" value={form.member} onChange={e => update('member', e.target.value)}
              placeholder="Start typing a name..."
              className={`w-full bg-gray-800 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${errors.member ? 'border-red-500/60' : 'border-gray-700 focus:border-[#39FF14]/50'}`} />
            <datalist id="member-list">
              {members.map(m => <option key={m.id} value={m.name} />)}
            </datalist>
            {errors.member && <p className="text-xs text-red-400 mt-1">{errors.member}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Zone / Area</label>
            <select value={form.area} onChange={e => update('area', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none">
              {areas.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Check-In *</label>
              <input type="time" value={form.checkIn} onChange={e => update('checkIn', e.target.value)}
                className={`w-full bg-gray-800 border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none ${errors.checkIn ? 'border-red-500/60' : 'border-gray-700 focus:border-[#39FF14]/50'}`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Check-Out</label>
              <input type="time" value={form.checkOut} onChange={e => update('checkOut', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#39FF14]/50" />
            </div>
          </div>
          <button onClick={handleSave}
            className="w-full bg-[#39FF14] text-gray-950 font-bold py-3 rounded-xl hover:bg-[#39FF14]/90 transition-all">
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
}
export default function Attendance() {
  const [log, setLog] = useState(() => {
    try { const s = localStorage.getItem('gymforce_attendance'); return s ? JSON.parse(s) : seedLog; } catch { return seedLog; }
  });
  const saveLog = (l) => { setLog(l); localStorage.setItem('gymforce_attendance', JSON.stringify(l)); };

  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const [activeView, setActiveView] = useState('daily');
  const [markOpen, setMarkOpen] = useState(false);
  const [toast, setToast]       = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const filtered = log.filter(a =>
    a.member.toLowerCase().includes(search.toLowerCase()) || a.area.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTotal = log.filter(a => a.date === '2026-08-21' || a.date === todayStr).length;
  const weeklyAvg  = Math.round(attendanceData.reduce((s, d) => s + d.total, 0) / attendanceData.length);

  const handleMark = (data) => {
    const newEntry = { id: log.length + 1, ...data };
    saveLog([newEntry, ...log]);
    setMarkOpen(false);
    showToast(`Attendance marked for ${data.member}.`);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-800 border border-[#39FF14]/30 text-white text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-slide-up">
          <Check size={14} className="text-[#39FF14]" /> {toast}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Attendance Tracking</h1>
          <p className="text-gray-500 text-sm">Monitor daily check-ins and gym usage</p>
        </div>
        <button onClick={() => setMarkOpen(true)}
          className="inline-flex items-center gap-2 bg-[#39FF14] text-gray-950 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#39FF14]/90 transition-all">
          <CalendarCheck size={16} /> Mark Attendance
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Check-ins", value: todayTotal, icon: CalendarCheck, color: '#39FF14' },
          { label: 'Weekly Average', value: weeklyAvg, icon: TrendingUp, color: '#00D4FF' },
          { label: 'Currently In Gym', value: 47, icon: Users, color: '#FF6B00' },
          { label: 'Peak Hour', value: '6–7 PM', icon: Clock, color: '#A855F7' },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500">{s.label}</p>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18` }}>
                <s.icon size={15} style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-2xl font-black text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Bar chart */}
        <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-white">Weekly Attendance Pattern</h3>
              <p className="text-xs text-gray-500">This week's check-in breakdown</p>
            </div>
            <div className="flex gap-1 p-1 bg-gray-800 rounded-lg">
              {['daily', 'weekly'].map(v => (
                <button key={v} onClick={() => setActiveView(v)}
                  className={`px-3 py-1.5 text-xs rounded-md capitalize transition-all ${activeView === v ? 'bg-[#39FF14] text-gray-950 font-bold' : 'text-gray-400'}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="morning" name="Morning" fill="#00D4FF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="evening" name="Evening" fill="#FF6B00" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Area usage */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-5">Zone Usage</h3>
          <div className="space-y-4">
            {areaStats.map(a => (
              <div key={a.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <MapPin size={13} style={{ color: a.color }} />
                    <span className="text-sm text-gray-300">{a.name}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{a.count}</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${a.pct}%`, background: a.color }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-0.5 text-right">{a.pct}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance log table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-800">
          <h3 className="font-bold text-white">Attendance Log</h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search member or zone..."
              className="bg-gray-800 border border-gray-700 rounded-xl pl-8 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/40 w-56"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/30">
              <tr>
                {['Member', 'Date', 'Check In', 'Check Out', 'Duration', 'Zone'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-gray-500 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(a => (
                <tr key={a.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-white">{a.member}</td>
                  <td className="px-5 py-3 text-sm text-gray-400">{a.date}</td>
                  <td className="px-5 py-3">
                    <span className="text-sm text-[#39FF14] font-semibold">{a.checkIn}</span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-400">{a.checkOut}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs bg-gray-800 text-gray-300 px-2.5 py-1 rounded-full">{a.duration}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs text-[#00D4FF]">{a.area}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800">
          <p className="text-xs text-gray-500">Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 text-xs text-gray-400 bg-gray-800 rounded-lg disabled:opacity-40 hover:bg-gray-700">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-7 h-7 text-xs rounded-lg ${page === n ? 'bg-[#39FF14] text-gray-950 font-bold' : 'text-gray-400 hover:bg-gray-700'}`}>{n}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1.5 text-xs text-gray-400 bg-gray-800 rounded-lg disabled:opacity-40 hover:bg-gray-700">Next</button>
          </div>
        </div>
      </div>
      {markOpen && <MarkModal onClose={() => setMarkOpen(false)} onSave={handleMark} />}
    </div>
  );
}

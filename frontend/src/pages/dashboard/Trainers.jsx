import { useState } from 'react';
import {
  Dumbbell, Star, Users, Plus, X, Award, Mail, Calendar,
  ChevronLeft, ChevronRight, Phone, Clock, Check, AlertTriangle,
  Edit2, Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { trainers as seedTrainers } from '../../data/sampleData';

function StatusBadge({ status }) {
  const map = {
    Active:    'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20',
    'On Leave':'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  };
  return <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${map[status] || ''}`}>{status}</span>;
}

// Cert display helper — handles both string and {name,body,year} object
const certLabel = (c) => {
  if (typeof c === 'string') return c;
  if (c && typeof c === 'object') return c.name ? (c.year ? `${c.name} (${c.year})` : c.name) : JSON.stringify(c);
  return String(c);
};

// ── Trainer Modal (view) ──────────────────────────────────────────────────────
function TrainerModal({ trainer, onClose, onEdit }) {
  if (!trainer) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-800 flex-shrink-0">
          <h2 className="font-bold text-white text-lg">Trainer Profile</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => { onClose(); onEdit(trainer); }}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#00D4FF]/10 text-[#00D4FF] hover:bg-[#00D4FF]/20 transition-all">
              <Edit2 size={12} /> Edit
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="p-5 overflow-y-auto">
          <div className="flex items-center gap-4 mb-5">
            {trainer.photo ? (
              <img src={trainer.photo} alt={trainer.name}
                className="w-16 h-16 rounded-2xl object-cover border border-[#FF6B00]/30" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6B00]/20 to-[#FFB347]/20 border border-[#FF6B00]/30 flex items-center justify-center text-xl font-black text-[#FF6B00]">
                {trainer.avatar}
              </div>
            )}
            <div>
              <h3 className="text-xl font-black text-white">{trainer.name}</h3>
              <p className="text-[#00D4FF] text-sm font-medium">{trainer.specialty}</p>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={trainer.status} />
                <span className="flex items-center gap-1 text-xs text-yellow-400">
                  <Star size={11} className="fill-yellow-400" /> {trainer.rating}
                </span>
              </div>
            </div>
          </div>

          {trainer.bio && (
            <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
              <p className="text-xs text-gray-500 mb-1">Bio</p>
              <p className="text-sm text-gray-300 leading-relaxed">{trainer.bio}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: 'Experience', value: trainer.experience, icon: Award },
              { label: 'Active Clients', value: `${trainer.clients} / ${trainer.maxMembers || 30}`, icon: Users },
              { label: 'Email', value: trainer.email, icon: Mail },
              { label: 'Phone', value: trainer.phone, icon: Phone },
              { label: 'Schedule', value: trainer.schedule, icon: Calendar },
              { label: 'Time Slot', value: trainer.timeSlot, icon: Clock },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-gray-800/50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5"><Icon size={11} />{label}</p>
                <p className="text-sm text-white font-medium break-all">{value}</p>
              </div>
            ))}
          </div>

          {/* Availability */}
          {trainer.availability?.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Availability</p>
              <div className="flex flex-wrap gap-1.5">
                {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => (
                  <span key={day} className={`text-xs px-2.5 py-1 rounded-full font-medium ${trainer.availability.includes(day) ? 'bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/20' : 'bg-gray-800 text-gray-600'}`}>
                    {day.slice(0,3)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          <div className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5"><Award size={11} />Certifications</p>
            <div className="flex flex-wrap gap-2">
              {(trainer.certifications || []).map((c, i) => (
                <span key={i} className="text-xs bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20 px-2.5 py-1 rounded-full">
                  {certLabel(c)}
                </span>
              ))}
              {(!trainer.certifications || trainer.certifications.length === 0) && (
                <span className="text-xs text-gray-500">No certifications on file.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Add / Edit Trainer Drawer ─────────────────────────────────────────────────
function TrainerDrawer({ open, trainer, onClose, onSave }) {
  const blank = {
    name: '', specialty: '', email: '', phone: '', experience: '',
    bio: '', schedule: '', timeSlot: '', status: 'Active',
    certifications: '', availability: [],
  };
  const [form, setForm] = useState(trainer
    ? { ...trainer, certifications: (trainer.certifications || []).map(certLabel).join(', '), availability: trainer.availability || [] }
    : blank
  );
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const update = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const toggleDay = (day) => {
    setForm(p => ({
      ...p,
      availability: p.availability.includes(day) ? p.availability.filter(d => d !== day) : [...p.availability, day],
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())      e.name      = 'Name is required.';
    if (!form.specialty.trim()) e.specialty = 'Specialty is required.';
    if (!form.email.trim())     e.email     = 'Email is required.';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const certsArray = form.certifications.split(',').map(s => s.trim()).filter(Boolean);
    onSave({ ...form, certifications: certsArray });
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  if (!open) return null;
  const isEdit = !!trainer;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border-l border-gray-700 w-full max-w-md h-full overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-800 flex-shrink-0">
          <h2 className="font-bold text-white text-lg">{isEdit ? 'Edit Trainer' : 'Add New Trainer'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4 flex-1">
          {[
            { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'Rohit Kumar' },
            { label: 'Specialty *', key: 'specialty', type: 'text', placeholder: 'Strength & Conditioning' },
            { label: 'Email *', key: 'email', type: 'email', placeholder: 'rohit@gymforce.com' },
            { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+91 98765 11111' },
            { label: 'Experience', key: 'experience', type: 'text', placeholder: '8 years' },
            { label: 'Schedule', key: 'schedule', type: 'text', placeholder: 'Mon–Fri  6 AM–2 PM' },
            { label: 'Time Slot', key: 'timeSlot', type: 'text', placeholder: '6:00 AM – 2:00 PM' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={e => update(f.key, e.target.value)} placeholder={f.placeholder}
                className={`w-full bg-gray-800 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${errors[f.key] ? 'border-red-500/60' : 'border-gray-700 focus:border-[#00D4FF]/50'}`} />
              {errors[f.key] && <p className="text-xs text-red-400 mt-1">{errors[f.key]}</p>}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Status</label>
            <select value={form.status} onChange={e => update('status', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none">
              {['Active', 'On Leave', 'Inactive'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Certifications <span className="text-gray-500 font-normal">(comma-separated)</span></label>
            <input type="text" value={form.certifications} onChange={e => update('certifications', e.target.value)}
              placeholder="NSCA-CSCS, CPR/AED, CrossFit Level 2"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4FF]/50 transition-colors" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Availability</label>
            <div className="flex flex-wrap gap-2">
              {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => (
                <button key={day} type="button" onClick={() => toggleDay(day)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${form.availability.includes(day) ? 'bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/30' : 'bg-gray-800 text-gray-500 border border-gray-700 hover:border-gray-500'}`}>
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Bio</label>
            <textarea value={form.bio} onChange={e => update('bio', e.target.value)} rows={3}
              placeholder="Brief trainer description..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4FF]/50 transition-colors resize-none" />
          </div>

          <button onClick={handleSave}
            className="w-full bg-[#00D4FF] text-gray-950 font-bold py-3 rounded-xl hover:bg-[#00D4FF]/90 transition-all flex items-center justify-center gap-2">
            {saved ? <><Check size={16} /> {isEdit ? 'Updated!' : 'Trainer Added!'}</> : <><Check size={16} /> {isEdit ? 'Save Changes' : 'Add Trainer'}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm ────────────────────────────────────────────────────────────
function DeleteConfirm({ trainer, onConfirm, onCancel }) {
  if (!trainer) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-red-500/30 rounded-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <div>
            <p className="font-bold text-white">Remove Trainer?</p>
            <p className="text-xs text-gray-400">This cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-gray-300 mb-6">Remove <span className="font-semibold text-white">{trainer.name}</span> from the roster?</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 text-sm font-medium transition-all">Cancel</button>
          <button onClick={() => onConfirm(trainer.id)} className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 text-sm font-semibold transition-all">Remove</button>
        </div>
      </div>
    </div>
  );
}

// ── Trainer Card ──────────────────────────────────────────────────────────────
function TrainerCard({ trainer, onView, onEdit, onDelete, canEdit }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {trainer.photo ? (
            <img src={trainer.photo} alt={trainer.name} className="w-12 h-12 rounded-2xl object-cover border border-[#FF6B00]/30 flex-shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B00]/20 to-[#FFB347]/20 border border-[#FF6B00]/30 flex items-center justify-center text-base font-black text-[#FF6B00] flex-shrink-0">
              {trainer.avatar}
            </div>
          )}
          <div>
            <h3 className="font-bold text-white">{trainer.name}</h3>
            <p className="text-xs text-[#00D4FF]">{trainer.specialty}</p>
          </div>
        </div>
        <StatusBadge status={trainer.status} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className={i < Math.floor(trainer.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'} />
          ))}
          <span className="text-xs text-gray-400 ml-1">{trainer.rating}</span>
        </div>
        <span className="text-xs text-gray-500">{trainer.experience}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 text-center">
        <div className="bg-gray-800/50 rounded-xl p-2">
          <p className="text-lg font-black text-white">{trainer.clients}</p>
          <p className="text-xs text-gray-500">Clients</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-2">
          <p className="text-xs text-gray-300 font-medium">{trainer.sessionsThisMonth ?? '—'}</p>
          <p className="text-xs text-gray-500">Sessions / Mo</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {(trainer.certifications || []).slice(0, 2).map((c, i) => (
          <span key={i} className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">{certLabel(c)}</span>
        ))}
        {(trainer.certifications || []).length > 2 && (
          <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">+{trainer.certifications.length - 2}</span>
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={onView}
          className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl text-sm font-medium transition-all">
          View Profile
        </button>
        {canEdit && (
          <>
            <button onClick={() => onEdit(trainer)}
              className="p-2.5 bg-[#00D4FF]/10 text-[#00D4FF] hover:bg-[#00D4FF]/20 rounded-xl transition-all">
              <Edit2 size={14} />
            </button>
            <button onClick={() => onDelete(trainer)}
              className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-all">
              <Trash2 size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Trainers() {
  const { currentUser } = useAuth();
  const role = currentUser?.role;
  const canEdit = role === 'master_admin';

  const [trainerList, setTrainerList] = useState(() => {
    try {
      const s = localStorage.getItem('gymforce_trainers');
      return s ? JSON.parse(s) : seedTrainers;
    } catch { return seedTrainers; }
  });
  const saveTrainers = (list) => {
    setTrainerList(list);
    localStorage.setItem('gymforce_trainers', JSON.stringify(list));
  };

  const [viewTarget, setViewTarget]     = useState(null);
  const [editTarget, setEditTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [addOpen, setAddOpen]           = useState(false);
  const [slideIdx, setSlideIdx]         = useState(0);
  const [toast, setToast]               = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const VISIBLE = 3;
  const canPrev = slideIdx > 0;
  const canNext = slideIdx + 1 < trainerList.length;

  const handleSaveTrainer = (data) => {
    if (editTarget) {
      saveTrainers(trainerList.map(t => t.id === editTarget.id ? { ...t, ...data } : t));
      showToast(`${data.name}'s profile updated.`);
    } else {
      const initials = data.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
      const newT = { id: `T-${String(Date.now()).slice(-3)}`, ...data, avatar: initials, rating: 5.0, clients: 0, sessionsThisMonth: 0, assignedMembers: [] };
      saveTrainers([newT, ...trainerList]);
      showToast(`${data.name} added to the roster.`);
    }
    setEditTarget(null);
    setAddOpen(false);
  };

  const handleDelete = (id) => {
    const name = trainerList.find(t => t.id === id)?.name;
    saveTrainers(trainerList.filter(t => t.id !== id));
    setDeleteTarget(null);
    showToast(`${name} removed from roster.`);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-800 border border-[#00D4FF]/30 text-white text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-slide-up">
          <Check size={14} className="text-[#00D4FF]" /> {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Trainer Management</h1>
          <p className="text-gray-500 text-sm">{trainerList.length} trainers on roster</p>
        </div>
        {canEdit && (
          <button onClick={() => { setEditTarget(null); setAddOpen(true); }}
            className="inline-flex items-center gap-2 bg-[#00D4FF] text-gray-950 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#00D4FF]/90 transition-all">
            <Plus size={16} /> Add Trainer
          </button>
        )}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Trainers',  value: trainerList.length,                                                            color: '#39FF14' },
          { label: 'Active Trainers', value: trainerList.filter(t => t.status === 'Active').length,                        color: '#00D4FF' },
          { label: 'Total Clients',   value: trainerList.reduce((s, t) => s + t.clients, 0),                               color: '#FF6B00' },
          { label: 'Avg Rating',      value: (trainerList.reduce((s, t) => s + t.rating, 0) / trainerList.length).toFixed(1), color: '#A855F7' },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-2">{s.label}</p>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Trainer cards — desktop grid */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {trainerList.map(trainer => (
          <TrainerCard key={trainer.id} trainer={trainer}
            onView={() => setViewTarget(trainer)}
            onEdit={(t) => { setEditTarget(t); setAddOpen(true); }}
            onDelete={setDeleteTarget}
            canEdit={canEdit}
          />
        ))}
      </div>

      {/* Trainer cards — mobile slider */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-sm">All Trainers</h3>
          <div className="flex gap-2">
            <button onClick={() => setSlideIdx(i => Math.max(0, i - 1))} disabled={!canPrev}
              className="p-2 glass rounded-full border border-gray-700 disabled:opacity-30">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setSlideIdx(i => canNext ? i + 1 : i)} disabled={!canNext}
              className="p-2 glass rounded-full border border-gray-700 disabled:opacity-30">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        {trainerList.slice(slideIdx, slideIdx + 1).map(trainer => (
          <TrainerCard key={trainer.id} trainer={trainer}
            onView={() => setViewTarget(trainer)}
            onEdit={(t) => { setEditTarget(t); setAddOpen(true); }}
            onDelete={setDeleteTarget}
            canEdit={canEdit}
          />
        ))}
      </div>

      {/* Schedule table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="font-bold text-white mb-4">Trainer Schedule Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                {['Trainer', 'Specialty', 'Schedule', 'Clients', 'Sessions / Mo', 'Status'].map(h => (
                  <th key={h} className="text-left pb-3 text-xs text-gray-500 font-semibold px-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trainerList.map(t => (
                <tr key={t.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors cursor-pointer" onClick={() => setViewTarget(t)}>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      {t.photo ? (
                        <img src={t.photo} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B00]/20 to-[#FFB347]/20 flex items-center justify-center text-xs font-bold text-[#FF6B00]">
                          {t.avatar}
                        </div>
                      )}
                      <span className="text-sm font-semibold text-white">{t.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-sm text-[#00D4FF]">{t.specialty}</td>
                  <td className="py-3 px-3 text-xs text-gray-400">{t.schedule}</td>
                  <td className="py-3 px-3 text-sm font-bold text-white">{t.clients}</td>
                  <td className="py-3 px-3 text-sm text-gray-300">{t.sessionsThisMonth ?? 0}</td>
                  <td className="py-3 px-3"><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <TrainerModal trainer={viewTarget} onClose={() => setViewTarget(null)} onEdit={(t) => { setViewTarget(null); setEditTarget(t); setAddOpen(true); }} />
      <TrainerDrawer open={addOpen} trainer={editTarget} onClose={() => { setAddOpen(false); setEditTarget(null); }} onSave={handleSaveTrainer} />
      <DeleteConfirm trainer={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}

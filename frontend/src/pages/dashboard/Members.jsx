import { useState } from 'react';
import {
  Search, UserPlus, ChevronUp, ChevronDown,
  X, Mail, Phone, Calendar, User, Edit2, Trash2, Eye, Activity,
  AlertTriangle, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { members as seedMembers, trainers } from '../../data/sampleData';

const PER_PAGE = 6;

function StatusBadge({ status }) {
  const map = {
    Active:   'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20',
    Inactive: 'bg-gray-700/50 text-gray-400 border-gray-700',
    Expiring: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  };
  return <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${map[status] || ''}`}>{status}</span>;
}

function PlanBadge({ plan }) {
  const map = {
    Basic:    'text-gray-400',
    Standard: 'text-[#00D4FF]',
    Premium:  'text-[#39FF14]',
    VIP:      'text-[#FF6B00]',
  };
  return <span className={`text-xs font-bold ${map[plan] || 'text-gray-400'}`}>{plan}</span>;
}

// ── Delete Confirm Dialog ─────────────────────────────────────────────────────
function DeleteConfirm({ member, onConfirm, onCancel }) {
  if (!member) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-red-500/30 rounded-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <div>
            <p className="font-bold text-white">Remove Member?</p>
            <p className="text-xs text-gray-400">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-gray-300 mb-6">
          Are you sure you want to remove <span className="font-semibold text-white">{member.name}</span> from the system?
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 text-sm font-medium transition-all">
            Cancel
          </button>
          <button onClick={() => onConfirm(member.id)}
            className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 text-sm font-semibold transition-all">
            Remove Member
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Member Detail / Edit Modal ────────────────────────────────────────────────
function MemberModal({ member, onClose, onSave, mode = 'view' }) {
  const [editing, setEditing] = useState(mode === 'edit');
  const [form, setForm] = useState(member ? { ...member } : {});
  const [saved, setSaved] = useState(false);
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  if (!member) return null;

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => { setSaved(false); setEditing(false); }, 1500);
  };

  const field = (label, key, type = 'text') => (
    <div key={key} className="bg-gray-800/50 rounded-xl p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      {editing ? (
        <input type={type} value={form[key] || ''} onChange={e => update(key, e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-[#39FF14]/50" />
      ) : (
        <p className="text-sm text-white font-medium">{member[key] || '—'}</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-800 flex-shrink-0">
          <h2 className="font-bold text-white text-lg">{editing ? 'Edit Member' : 'Member Profile'}</h2>
          <div className="flex items-center gap-2">
            {!editing && (
              <button onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#39FF14]/10 text-[#39FF14] hover:bg-[#39FF14]/20 transition-all">
                <Edit2 size={12} /> Edit
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-5 overflow-y-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#39FF14]/20 to-[#00D4FF]/20 border border-[#39FF14]/30 flex items-center justify-center text-xl font-black text-[#39FF14]">
              {member.avatar}
            </div>
            <div>
              <h3 className="text-xl font-black text-white">{editing ? form.name : member.name}</h3>
              <p className="text-gray-400 text-sm">{member.id}</p>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={editing ? form.status : member.status} />
                <PlanBadge plan={editing ? form.plan : member.plan} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {field('Full Name', 'name')}
            {field('Email', 'email', 'email')}
            {field('Phone', 'phone', 'tel')}
            {field('Join Date', 'joinDate', 'date')}
            {field('Expiry Date', 'expiry', 'date')}

            <div className="bg-gray-800/50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Trainer</p>
              {editing ? (
                <select value={form.trainer || ''} onChange={e => update('trainer', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none">
                  <option value="Unassigned">Unassigned</option>
                  {trainers.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
              ) : (
                <p className="text-sm text-white font-medium">{member.trainer}</p>
              )}
            </div>

            <div className="bg-gray-800/50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Status</p>
              {editing ? (
                <select value={form.status || ''} onChange={e => update('status', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none">
                  {['Active', 'Inactive', 'Expiring'].map(s => <option key={s}>{s}</option>)}
                </select>
              ) : (
                <p className="text-sm text-white font-medium">{member.status}</p>
              )}
            </div>

            <div className="bg-gray-800/50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Plan</p>
              {editing ? (
                <select value={form.plan || ''} onChange={e => update('plan', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none">
                  {['Basic', 'Standard', 'Premium', 'VIP'].map(p => <option key={p}>{p}</option>)}
                </select>
              ) : (
                <p className="text-sm text-white font-medium">{member.plan}</p>
              )}
            </div>

            <div className="bg-gray-800/50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Category</p>
              {editing ? (
                <select value={form.category || ''} onChange={e => update('category', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none">
                  {['Ladies', 'Mens', 'Mixed'].map(c => <option key={c}>{c}</option>)}
                </select>
              ) : (
                <p className="text-sm text-white font-medium">{member.category}</p>
              )}
            </div>
          </div>

          {editing && (
            <button onClick={handleSave}
              className="w-full mt-5 flex items-center justify-center gap-2 bg-[#39FF14] text-gray-950 font-bold py-3 rounded-xl hover:bg-[#39FF14]/90 transition-all">
              {saved ? <><Check size={16} /> Saved!</> : <><Check size={16} /> Save Changes</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Add Member Drawer ─────────────────────────────────────────────────────────
function AddMemberDrawer({ open, onClose, onAdd }) {
  const blankForm = { name: '', email: '', phone: '', plan: 'Standard', trainer: 'Unassigned', category: 'Mixed', status: 'Active', gender: '', age: '' };
  const [form, setForm] = useState(blankForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const update = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = 'Full name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    return e;
  };

  const handleAdd = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const initials = form.name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const today = new Date();
    const expiry = new Date(today); expiry.setFullYear(expiry.getFullYear() + 1);
    onAdd({
      ...form,
      name: form.name.trim(),
      avatar: initials,
      joinDate: today.toISOString().split('T')[0],
      expiry: expiry.toISOString().split('T')[0],
      attendance: 0,
    });
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setForm(blankForm); onClose(); }, 1500);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border-l border-gray-700 w-full max-w-md h-full overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-800 flex-shrink-0">
          <h2 className="font-bold text-white text-lg">Add New Member</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-4 flex-1">
          {/* Text fields */}
          {[
            { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'Priya Sharma' },
            { label: 'Email *', key: 'email', type: 'email', placeholder: 'priya@example.com' },
            { label: 'Phone *', key: 'phone', type: 'tel', placeholder: '+91 98765 43210' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={e => update(f.key, e.target.value)}
                placeholder={f.placeholder}
                className={`w-full bg-gray-800 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${errors[f.key] ? 'border-red-500/60 focus:border-red-400' : 'border-gray-700 focus:border-[#39FF14]/50'}`} />
              {errors[f.key] && <p className="text-xs text-red-400 mt-1">{errors[f.key]}</p>}
            </div>
          ))}

          {/* Selects */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Plan', key: 'plan', opts: ['Basic', 'Standard', 'Premium', 'VIP'] },
              { label: 'Category', key: 'category', opts: ['Ladies', 'Mens', 'Mixed'] },
              { label: 'Status', key: 'status', opts: ['Active', 'Inactive'] },
              { label: 'Gender', key: 'gender', opts: ['male', 'female', 'other'] },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">{f.label}</label>
                <select value={form[f.key]} onChange={e => update(f.key, e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#39FF14]/50 transition-colors">
                  {f.opts.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Assign Trainer</label>
            <select value={form.trainer} onChange={e => update('trainer', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#39FF14]/50 transition-colors">
              <option value="Unassigned">Unassigned</option>
              {trainers.filter(t => t.status === 'Active').map(t => <option key={t.id} value={t.name}>{t.name} ({t.clients} clients)</option>)}
            </select>
          </div>

          <button onClick={handleAdd}
            className="w-full bg-[#39FF14] text-gray-950 font-bold py-3 rounded-xl hover:bg-[#39FF14]/90 transition-all mt-2 flex items-center justify-center gap-2">
            {success ? <><Check size={16} /> Member Added!</> : <><UserPlus size={16} /> Add Member</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Members() {
  const { currentUser, users, saveUsers } = useAuth();

  // We keep members in local state, seeded from static data (merged with any users of role gym_member)
  const [memberList, setMemberList] = useState(() => {
    try {
      const stored = localStorage.getItem('gymforce_members');
      return stored ? JSON.parse(stored) : seedMembers;
    } catch { return seedMembers; }
  });

  const saveMembers = (list) => {
    setMemberList(list);
    localStorage.setItem('gymforce_members', JSON.stringify(list));
  };

  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [planFilter, setPlanFilter]   = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortKey, setSortKey]         = useState('name');
  const [sortDir, setSortDir]         = useState('asc');
  const [page, setPage]               = useState(1);
  const [viewModal, setViewModal]     = useState(null);
  const [editModal, setEditModal]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [toast, setToast]             = useState('');

  const role = currentUser?.role;
  const canEdit = ['master_admin', 'staff', 'receptionist'].includes(role);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filtered = memberList.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.id?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || m.status === statusFilter;
    const matchPlan   = planFilter   === 'All' || m.plan   === planFilter;
    const matchCat    = categoryFilter === 'All' || m.category === categoryFilter;
    return matchSearch && matchStatus && matchPlan && matchCat;
  }).sort((a, b) => {
    const va = String(a[sortKey] ?? '');
    const vb = String(b[sortKey] ?? '');
    return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const handleAdd = (data) => {
    const newMember = { id: `M-${String(Date.now()).slice(-4)}`, ...data };
    saveMembers([newMember, ...memberList]);
    showToast(`${data.name} has been added successfully.`);
  };

  const handleSave = (updated) => {
    saveMembers(memberList.map(m => m.id === updated.id ? { ...m, ...updated } : m));
    setEditModal(null);
    showToast(`${updated.name}'s profile has been updated.`);
  };

  const handleDelete = (id) => {
    const name = memberList.find(m => m.id === id)?.name;
    saveMembers(memberList.filter(m => m.id !== id));
    setDeleteTarget(null);
    showToast(`${name} has been removed.`);
  };

  const SortIcon = ({ col }) => sortKey === col
    ? (sortDir === 'asc' ? <ChevronUp size={12} className="text-[#39FF14]" /> : <ChevronDown size={12} className="text-[#39FF14]" />)
    : <ChevronDown size={12} className="text-gray-600" />;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-800 border border-[#39FF14]/30 text-white text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-slide-up">
          <Check size={14} className="text-[#39FF14]" /> {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Member Management</h1>
          <p className="text-gray-500 text-sm">{memberList.length} total members</p>
        </div>
        {canEdit && (
          <button onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 bg-[#39FF14] text-gray-950 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#39FF14]/90 transition-all neon-glow">
            <UserPlus size={16} /> Add Member
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search name, email, or ID..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/40 transition-colors" />
          </div>
          {[
            { value: statusFilter, set: setStatusFilter, opts: ['All', 'Active', 'Inactive', 'Expiring'], label: 'Status' },
            { value: planFilter,   set: setPlanFilter,   opts: ['All', 'Basic', 'Standard', 'Premium', 'VIP'], label: 'Plan' },
            { value: categoryFilter, set: setCategoryFilter, opts: ['All', 'Ladies', 'Mens', 'Mixed'], label: 'Category' },
          ].map(f => (
            <select key={f.label} value={f.value} onChange={e => { f.set(e.target.value); setPage(1); }}
              className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none">
              {f.opts.map(o => <option key={o} value={o}>{o === 'All' ? `All ${f.label}s` : o}</option>)}
            </select>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-800">
              <tr>
                {[
                  { key: 'name', label: 'Member' },
                  { key: 'plan', label: 'Plan' },
                  { key: 'category', label: 'Category' },
                  { key: 'status', label: 'Status' },
                  { key: 'attendance', label: 'Sessions' },
                  { key: 'expiry', label: 'Expiry' },
                ].map(col => (
                  <th key={col.key} onClick={() => handleSort(col.key)}
                    className="text-left px-5 py-3 text-xs text-gray-500 font-semibold cursor-pointer hover:text-gray-300 transition-colors select-none">
                    <span className="flex items-center gap-1">{col.label} <SortIcon col={col.key} /></span>
                  </th>
                ))}
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold hidden md:table-cell">Trainer</th>
                <th className="px-5 py-3 text-xs text-gray-500 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-500">
                    <User size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No members found</p>
                    <p className="text-xs mt-1 text-gray-600">Try adjusting your filters or add a new member.</p>
                  </td>
                </tr>
              ) : paginated.map(m => (
                <tr key={m.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-xs font-bold text-gray-300 flex-shrink-0">
                        {m.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{m.name}</p>
                        <p className="text-xs text-gray-500">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><PlanBadge plan={m.plan} /></td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.category === 'Ladies' ? 'bg-pink-500/10 text-pink-400' : m.category === 'Mens' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-700/50 text-gray-400'}`}>
                      {m.category}
                    </span>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={m.status} /></td>
                  <td className="px-5 py-4 text-sm text-gray-300">{m.attendance}</td>
                  <td className="px-5 py-4 text-sm text-gray-400">{m.expiry}</td>
                  <td className="px-5 py-4 text-sm text-gray-400 hidden md:table-cell">{m.trainer}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewModal(m)} title="View"
                        className="p-1.5 text-gray-500 hover:text-[#39FF14] hover:bg-[#39FF14]/10 rounded-lg transition-colors">
                        <Eye size={15} />
                      </button>
                      {canEdit && (
                        <>
                          <button onClick={() => setEditModal(m)} title="Edit"
                            className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => setDeleteTarget(m)} title="Delete"
                            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800 bg-gray-900/50">
          <p className="text-xs text-gray-500">
            Showing {filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 text-xs text-gray-400 bg-gray-800 rounded-lg disabled:opacity-40 hover:bg-gray-700 transition-colors">
              Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-7 h-7 text-xs rounded-lg transition-colors ${page === n ? 'bg-[#39FF14] text-gray-950 font-bold' : 'text-gray-400 hover:bg-gray-700'}`}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1.5 text-xs text-gray-400 bg-gray-800 rounded-lg disabled:opacity-40 hover:bg-gray-700 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {viewModal && <MemberModal member={viewModal} onClose={() => setViewModal(null)} onSave={handleSave} mode="view" />}
      {editModal && <MemberModal member={editModal} onClose={() => setEditModal(null)} onSave={handleSave} mode="edit" />}
      <DeleteConfirm member={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      <AddMemberDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={handleAdd} />
    </div>
  );
}

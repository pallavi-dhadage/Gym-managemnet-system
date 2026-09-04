import { useState } from 'react';
import { Tag, Plus, Search, X, Edit2, Trash2, AlertTriangle, Check, Percent, Calendar, Target } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currency';

const CATEGORIES = ['All', 'Membership', 'Product', 'Seasonal', 'Referral'];
const STATUS = ['All', 'Active', 'Upcoming', 'Expired'];
const DISCOUNT_TYPES = ['Percentage', 'Fixed Amount'];

const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

function getOfferStatus(startDate, endDate) {
  const now = Date.now();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (now < start) return 'Upcoming';
  if (now > end) return 'Expired';
  return 'Active';
}

function StatusBadge({ status }) {
  const colors = {
    Active: 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20',
    Upcoming: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Expired: 'bg-gray-600/10 text-gray-500 border-gray-600/20',
  };
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${colors[status]}`}>{status}</span>;
}

function DeleteConfirm({ offer, onConfirm, onCancel }) {
  if (!offer) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-red-500/30 rounded-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center"><AlertTriangle size={18} className="text-red-400" /></div>
          <div><p className="font-bold text-white">Remove Offer?</p><p className="text-xs text-gray-400">This cannot be undone.</p></div>
        </div>
        <p className="text-sm text-gray-300 mb-6">Remove <span className="font-semibold text-white">{offer.title}</span>?</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 text-sm font-medium">Cancel</button>
          <button onClick={() => onConfirm(offer.id)} className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 text-sm font-semibold">Remove</button>
        </div>
      </div>
    </div>
  );
}

function OfferDrawer({ open, offer, onClose, onSave }) {
  const blank = { title: '', code: '', category: 'Membership', discountType: 'Percentage', discountValue: '', startDate: '', endDate: '', maxUses: '', usedCount: 0, description: '' };
  const [form, setForm] = useState(offer || blank);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const update = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Offer title required.';
    if (!form.code.trim()) e.code = 'Coupon code required.';
    if (!form.discountValue || isNaN(Number(form.discountValue)) || Number(form.discountValue) <= 0) e.discountValue = 'Valid discount required.';
    if (!form.startDate) e.startDate = 'Start date required.';
    if (!form.endDate) e.endDate = 'End date required.';
    if (form.startDate && form.endDate && new Date(form.startDate) >= new Date(form.endDate)) e.endDate = 'End date must be after start date.';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, discountValue: Number(form.discountValue), maxUses: form.maxUses ? Number(form.maxUses) : null });
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1200);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border-l border-gray-700 w-full max-w-md h-full overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="font-bold text-white text-lg">{offer ? 'Edit Offer' : 'Create Offer'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Offer Title *</label>
            <input value={form.title} onChange={e => update('title', e.target.value)} placeholder="New Year Mega Sale"
              className={`w-full bg-gray-800 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none ${errors.title ? 'border-red-500/60' : 'border-gray-700 focus:border-[#39FF14]/50'}`} />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Coupon Code *</label>
            <input value={form.code} onChange={e => update('code', e.target.value.toUpperCase())} placeholder="NEWYEAR50"
              className={`w-full bg-gray-800 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none font-mono ${errors.code ? 'border-red-500/60' : 'border-gray-700 focus:border-[#39FF14]/50'}`} />
            {errors.code && <p className="text-xs text-red-400 mt-1">{errors.code}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
            <select value={form.category} onChange={e => update('category', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none">
              {CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Discount Type</label>
              <select value={form.discountType} onChange={e => update('discountType', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none">
                {DISCOUNT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Value *</label>
              <input type="number" value={form.discountValue} onChange={e => update('discountValue', e.target.value)} placeholder={form.discountType === 'Percentage' ? '20' : '500'}
                className={`w-full bg-gray-800 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none ${errors.discountValue ? 'border-red-500/60' : 'border-gray-700 focus:border-[#39FF14]/50'}`} />
              {errors.discountValue && <p className="text-xs text-red-400 mt-1">{errors.discountValue}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Start Date *</label>
              <input type="date" value={form.startDate} onChange={e => update('startDate', e.target.value)}
                className={`w-full bg-gray-800 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none ${errors.startDate ? 'border-red-500/60' : 'border-gray-700 focus:border-[#39FF14]/50'}`} />
              {errors.startDate && <p className="text-xs text-red-400 mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">End Date *</label>
              <input type="date" value={form.endDate} onChange={e => update('endDate', e.target.value)}
                className={`w-full bg-gray-800 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none ${errors.endDate ? 'border-red-500/60' : 'border-gray-700 focus:border-[#39FF14]/50'}`} />
              {errors.endDate && <p className="text-xs text-red-400 mt-1">{errors.endDate}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Max Uses (optional)</label>
            <input type="number" value={form.maxUses} onChange={e => update('maxUses', e.target.value)} placeholder="Unlimited"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={2} placeholder="Terms & conditions..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/50 resize-none" />
          </div>
          <button onClick={handleSave}
            className="w-full bg-[#39FF14] text-gray-950 font-bold py-3 rounded-xl hover:bg-[#39FF14]/90 transition-all flex items-center justify-center gap-2">
            {saved ? <><Check size={16} /> {offer ? 'Updated!' : 'Created!'}</> : <><Check size={16} /> {offer ? 'Save Changes' : 'Create Offer'}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Offers() {
  const { currentUser, offerList, addOffer, updateOffer, deleteOffer } = useAuth();
  const role = currentUser?.role;
  const canEdit = ['master_admin', 'staff', 'receptionist'].includes(role);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filtered = (offerList || []).filter(o => {
    const q = search.toLowerCase();
    const matchSearch = o.title.toLowerCase().includes(q) || o.code.toLowerCase().includes(q);
    const matchCat = category === 'All' || o.category === category;
    const offerStatus = getOfferStatus(o.startDate, o.endDate);
    const matchStatus = status === 'All' || offerStatus === status;
    return matchSearch && matchCat && matchStatus;
  });

  const handleSave = (data) => {
    if (editTarget) {
      updateOffer(editTarget.id, data);
      showToast(`${data.title} updated.`);
    } else {
      addOffer(data);
      showToast(`${data.title} created.`);
    }
    setEditTarget(null);
    setDrawerOpen(false);
  };

  const handleDelete = (id) => {
    const name = offerList.find(o => o.id === id)?.title;
    deleteOffer(id);
    setDeleteTarget(null);
    showToast(`${name} removed.`);
  };

  const activeCount = (offerList || []).filter(o => getOfferStatus(o.startDate, o.endDate) === 'Active').length;
  const upcomingCount = (offerList || []).filter(o => getOfferStatus(o.startDate, o.endDate) === 'Upcoming').length;

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-800 border border-[#39FF14]/30 text-white text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-slide-up">
          <Check size={14} className="text-[#39FF14]" /> {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Offers & Coupons</h1>
          <p className="text-gray-500 text-sm">{offerList?.length || 0} offers available</p>
        </div>
        {canEdit && (
          <button onClick={() => { setEditTarget(null); setDrawerOpen(true); }}
            className="inline-flex items-center gap-2 bg-[#39FF14] text-gray-950 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#39FF14]/90 transition-all">
            <Plus size={16} /> Create Offer
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Offers', value: offerList?.length || 0, color: '#39FF14' },
          { label: 'Active Now', value: activeCount, color: '#00D4FF' },
          { label: 'Upcoming', value: upcomingCount, color: '#A855F7' },
          { label: 'Categories', value: CATEGORIES.length - 1, color: '#FF6B00' },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-2">{s.label}</p>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search offers or codes..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/40" />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none">
            {STATUS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Offers list */}
      <div className="space-y-3">
        {filtered.map(o => {
          const offerStatus = getOfferStatus(o.startDate, o.endDate);
          const usagePercent = o.maxUses ? Math.round((o.usedCount / o.maxUses) * 100) : 0;
          return (
            <div key={o.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 card-hover">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag size={18} className="text-[#39FF14]" />
                    <h3 className="font-bold text-white text-lg">{o.title}</h3>
                    <StatusBadge status={offerStatus} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="font-mono font-bold text-[#39FF14] bg-[#39FF14]/10 px-2 py-1 rounded">{o.code}</span>
                    <span>{o.category}</span>
                    <span>{fmtDate(o.startDate)} - {fmtDate(o.endDate)}</span>
                  </div>
                </div>
                {canEdit && (
                  <div className="flex gap-2">
                    <button onClick={() => { setEditTarget(o); setDrawerOpen(true); }}
                      className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-all">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => setDeleteTarget(o)}
                      className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center"><Percent size={16} className="text-purple-400" /></div>
                  <div>
                    <p className="text-xs text-gray-500">Discount</p>
                    <p className="text-sm font-bold text-white">{o.discountType === 'Percentage' ? `${o.discountValue}%` : formatCurrency(o.discountValue)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Target size={16} className="text-blue-400" /></div>
                  <div>
                    <p className="text-xs text-gray-500">Usage</p>
                    <p className="text-sm font-bold text-white">{o.usedCount} {o.maxUses ? `/ ${o.maxUses}` : ''}</p>
                  </div>
                </div>
                {o.maxUses && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-[#39FF14]" style={{ width: `${usagePercent}%` }} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{usagePercent}% used</p>
                    </div>
                  </div>
                )}
              </div>
              {o.description && <p className="text-xs text-gray-500 mt-3 border-t border-gray-800 pt-3">{o.description}</p>}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Tag size={48} className="mx-auto mb-4 text-gray-700" />
          <p className="text-gray-500 font-medium">No offers found.</p>
          <p className="text-gray-600 text-sm mt-1">Try adjusting your filters or create a new offer.</p>
        </div>
      )}

      <OfferDrawer open={drawerOpen} offer={editTarget} onClose={() => { setDrawerOpen(false); setEditTarget(null); }} onSave={handleSave} />
      <DeleteConfirm offer={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/ui/Modal';
import StatusBadge from '../../components/ui/StatusBadge';
import {
  Plus, Search, Filter, Wrench, AlertTriangle, CheckCircle,
  Edit3, Trash2, Calendar, MapPin, Package,
} from 'lucide-react';

const CATEGORIES  = ['All', 'Cardio', 'Strength', 'Free Weights', 'Functional', 'Accessories'];
const CONDITIONS  = ['Good', 'Fair', 'Needs Repair'];
const STATUSES    = ['Available', 'Under Maintenance', 'Out of Service'];
const COND_COLORS = { Good: '#39FF14', Fair: '#F59E0B', 'Needs Repair': '#EF4444' };
const CAT_ICONS   = { Cardio: '🏃', Strength: '💪', 'Free Weights': '🏋️', Functional: '🎯', Accessories: '🧰' };

function daysUntil(dateStr) {
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
}

const EMPTY_FORM = {
  name: '', category: 'Cardio', qty: '', condition: 'Good',
  lastMaintenance: '', nextMaintenance: '', status: 'Available', location: '',
};

export default function EquipmentManagement() {
  const { equipmentList, addEquipment, updateEquipment, deleteEquipment, currentUser } = useAuth();
  const canEdit = ['master_admin', 'staff'].includes(currentUser?.role);

  const [search,      setSearch]      = useState('');
  const [catFilter,   setCatFilter]   = useState('All');
  const [condFilter,  setCondFilter]  = useState('All');
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editItem,    setEditItem]    = useState(null);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [errors,      setErrors]      = useState({});
  const [deleteId,    setDeleteId]    = useState(null);

  // ── Summary counts ────────────────────────────────────────────────────────
  const total       = equipmentList.length;
  const maintenance = equipmentList.filter(e => e.status === 'Under Maintenance').length;
  const outOfService= equipmentList.filter(e => e.status === 'Out of Service').length;
  const dueSoon     = equipmentList.filter(e => {
    const d = daysUntil(e.nextMaintenance);
    return d >= 0 && d <= 14;
  }).length;

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = equipmentList.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
                        e.location?.toLowerCase().includes(search.toLowerCase());
    const matchCat    = catFilter  === 'All' || e.category  === catFilter;
    const matchCond   = condFilter === 'All' || e.condition === condFilter;
    return matchSearch && matchCat && matchCond;
  });

  // ── Form handlers ─────────────────────────────────────────────────────────
  const openAdd  = ()    => { setForm(EMPTY_FORM); setEditItem(null); setErrors({}); setModalOpen(true); };
  const openEdit = (item)=> { setForm({ ...item }); setEditItem(item.id); setErrors({}); setModalOpen(true); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())           e.name = 'Name is required';
    if (!form.qty || form.qty < 1)   e.qty  = 'Quantity must be ≥ 1';
    if (!form.lastMaintenance)       e.lastMaintenance = 'Required';
    if (!form.nextMaintenance)       e.nextMaintenance = 'Required';
    if (!form.location.trim())       e.location = 'Location is required';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (editItem) updateEquipment(editItem, form);
    else          addEquipment(form);
    setModalOpen(false);
  };

  const field = (key, label, type = 'text', opts = null) => (
    <div>
      <label className="block text-xs font-semibold text-gray-400 mb-1">{label}</label>
      {opts ? (
        <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-gray-500">
          {opts.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          className={`w-full bg-gray-800 border text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-gray-500 ${errors[key] ? 'border-red-500' : 'border-gray-700'}`} />
      )}
      {errors[key] && <p className="text-xs text-red-400 mt-0.5">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Equipment Management</h1>
          <p className="text-gray-400 text-sm mt-1">Track gym machines, tools, and maintenance schedules</p>
        </div>
        {canEdit && (
          <button onClick={openAdd} className="flex items-center gap-2 bg-[#39FF14] text-gray-950 font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-[#39FF14]/90 transition-all">
            <Plus size={16} /> Add Equipment
          </button>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Items',        value: total,        color: '#39FF14', icon: Package },
          { label: 'Under Maintenance',  value: maintenance,  color: '#F59E0B', icon: Wrench  },
          { label: 'Out of Service',     value: outOfService, color: '#EF4444', icon: AlertTriangle },
          { label: 'Maintenance Due (14d)', value: dueSoon,   color: '#A855F7', icon: Calendar},
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400">{label}</p>
              <Icon size={16} style={{ color }} />
            </div>
            <p className="text-3xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search equipment or location…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-gray-500" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-gray-500">
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={condFilter} onChange={e => setCondFilter(e.target.value)}
          className="bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-gray-500">
          <option value="All">All Conditions</option>
          {CONDITIONS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-800">
                <th className="text-left px-5 py-3 font-medium">Equipment</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-medium">Qty</th>
                <th className="text-left px-4 py-3 font-medium">Condition</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Next Maintenance</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden xl:table-cell">Location</th>
                {canEdit && <th className="text-left px-4 py-3 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const days  = daysUntil(item.nextMaintenance);
                const dueSoon = days >= 0 && days <= 14;
                return (
                  <tr key={item.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                    <td className="px-5 py-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-gray-300">{CAT_ICONS[item.category] || '⚙'} {item.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-white">{item.qty}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: COND_COLORS[item.condition] }} />
                        <span className="text-xs text-gray-300">{item.condition}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className={dueSoon ? 'text-yellow-400' : 'text-gray-400'}>
                        <p className="text-xs font-medium">{item.nextMaintenance}</p>
                        {dueSoon && <p className="text-xs">{days === 0 ? 'Today!' : `In ${days} days`}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin size={11} /> {item.location}
                      </div>
                    </td>
                    {canEdit && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(item)} className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg p-1.5 transition-colors"><Edit3 size={14} /></button>
                          <button onClick={() => setDeleteId(item.id)} className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg p-1.5 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Wrench size={32} className="mx-auto mb-3 opacity-40" />
              <p>No equipment found matching your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Equipment' : 'Add Equipment'} size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-xl transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 text-sm bg-[#39FF14] text-gray-950 font-bold rounded-xl hover:bg-[#39FF14]/90 transition-all">
              {editItem ? 'Update' : 'Add Equipment'}
            </button>
          </div>
        }>
        <div className="space-y-4">
          {field('name',            'Equipment Name')}
          <div className="grid grid-cols-2 gap-4">
            {field('category', 'Category', 'text', CATEGORIES.filter(c => c !== 'All'))}
            {field('qty',      'Quantity',  'number')}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {field('condition', 'Condition', 'text', CONDITIONS)}
            {field('status',    'Status',    'text', STATUSES)}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {field('lastMaintenance', 'Last Maintenance', 'date')}
            {field('nextMaintenance', 'Next Maintenance', 'date')}
          </div>
          {field('location', 'Location (e.g. Cardio Zone)')}
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete" size="sm"
        footer={
          <div className="flex gap-3 justify-end">
            <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-gray-400 border border-gray-700 rounded-xl">Cancel</button>
            <button onClick={() => { deleteEquipment(deleteId); setDeleteId(null); }} className="px-4 py-2 text-sm bg-red-500 text-white font-bold rounded-xl hover:bg-red-600">Delete</button>
          </div>
        }>
        <p className="text-gray-300 text-sm">Are you sure you want to delete this equipment record? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}

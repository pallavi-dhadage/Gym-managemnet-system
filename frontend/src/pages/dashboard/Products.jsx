import { useState } from 'react';
import {
  Package, Plus, Search, X, Edit2, Trash2, AlertTriangle,
  ShoppingBag, Tag, BarChart3, AlertCircle, Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currency';

const CATEGORIES = ['All', 'Supplements', 'Equipment', 'Accessories', 'Apparel', 'Recovery'];
const STOCK_FILTERS = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];
const EMOJIS = ['🥛','💊','🧃','⚡','🧘','🎀','🧤','🫙','🎒','👕','🩳','🫧','🏋️','💪','🍎','🥤'];

function stockStatus(stock) {
  if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-500/10 text-red-400 border-red-500/20' };
  if (stock <= 5)  return { label: 'Low Stock',    color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' };
  return               { label: 'In Stock',     color: 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20' };
}

function DeleteConfirm({ product, onConfirm, onCancel }) {
  if (!product) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-red-500/30 rounded-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <div>
            <p className="font-bold text-white">Delete Product?</p>
            <p className="text-xs text-gray-400">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-gray-300 mb-6">
          Delete <span className="font-semibold text-white">{product.name}</span>?
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 text-sm font-medium transition-colors">Cancel</button>
          <button onClick={() => onConfirm(product.id)} className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 text-sm font-semibold transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
}

const BLANK = { name: '', category: 'Supplements', price: '', stock: '', sku: '', emoji: '🥛', description: '' };

function ProductDrawer({ open, product, onClose, onSave }) {
  const [form, setForm] = useState(product || BLANK);
  const [errors, setErrors] = useState({});
  const [lastId, setLastId] = useState(null);

  if (open && product && product.id !== lastId) {
    setForm(product);
    setErrors({});
    setLastId(product.id);
  }
  if (open && !product && lastId !== 'new') {
    setForm(BLANK);
    setErrors({});
    setLastId('new');
  }

  const update = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())         e.name  = 'Product name is required.';
    if (!form.price || isNaN(+form.price) || +form.price <= 0) e.price = 'Enter a valid price.';
    if (form.stock === '' || isNaN(+form.stock) || +form.stock < 0) e.stock = 'Enter a valid stock quantity.';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, price: +form.price, stock: +form.stock });
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#39FF14]/10 flex items-center justify-center">
              <Package size={16} className="text-[#39FF14]" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{product ? 'Edit Product' : 'Add Product'}</p>
              <p className="text-xs text-gray-500">Fill in the product details</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map(em => (
                <button key={em} type="button" onClick={() => update('emoji', em)}
                  className={"w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all " + (form.emoji === em ? 'bg-[#39FF14]/20 ring-2 ring-[#39FF14]/40' : 'bg-gray-800 hover:bg-gray-700')}>
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Product Name *</label>
            <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Whey Protein Isolate"
              className={"w-full bg-gray-800 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors " + (errors.name ? 'border-red-500/60' : 'border-gray-700 focus:border-[#39FF14]/60')} />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Category</label>
              <select value={form.category} onChange={e => update('category', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#39FF14]/60">
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">SKU (optional)</label>
              <input value={form.sku} onChange={e => update('sku', e.target.value)} placeholder="e.g. WPI-1KG"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/60" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Price (₹) *</label>
              <input type="number" min="0" value={form.price} onChange={e => update('price', e.target.value)} placeholder="0"
                className={"w-full bg-gray-800 border rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors " + (errors.price ? 'border-red-500/60' : 'border-gray-700 focus:border-[#39FF14]/60')} />
              {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Stock Qty *</label>
              <input type="number" min="0" value={form.stock} onChange={e => update('stock', e.target.value)} placeholder="0"
                className={"w-full bg-gray-800 border rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors " + (errors.stock ? 'border-red-500/60' : 'border-gray-700 focus:border-[#39FF14]/60')} />
              {errors.stock && <p className="text-xs text-red-400 mt-1">{errors.stock}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Description (optional)</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)}
              placeholder="Short product description..." rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/60 resize-none" />
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-gray-800">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 text-sm font-medium transition-colors">Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-[#39FF14] text-gray-950 text-sm font-bold hover:bg-[#39FF14]/90 transition-colors flex items-center justify-center gap-2">
            <Check size={14} /> {product ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onEdit, onDelete }) {
  const { label, color } = stockStatus(product.stock);
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-2xl">
          {product.emoji || '📦'}
        </div>
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(product)} className="p-1.5 rounded-lg bg-gray-800 hover:bg-[#39FF14]/10 text-gray-400 hover:text-[#39FF14] transition-colors">
            <Edit2 size={13} />
          </button>
          <button onClick={() => onDelete(product)} className="p-1.5 rounded-lg bg-gray-800 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <h3 className="font-bold text-white text-sm leading-tight mb-1 line-clamp-2">{product.name}</h3>
      {product.sku && <p className="text-xs text-gray-500 mb-2 font-mono">SKU: {product.sku}</p>}
      <div className="flex items-center justify-between mt-3">
        <p className="text-lg font-black text-[#39FF14]">{formatCurrency(product.price)}</p>
        <span className={"text-xs font-semibold px-2 py-0.5 rounded-full border " + color}>{label}</span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-lg">{product.category}</span>
        <span className="text-xs text-gray-400">{product.stock} units</span>
      </div>
    </div>
  );
}

export default function Products() {
  const { productList, addProduct, updateProduct, deleteProduct } = useAuth();
  const [search, setSearch]         = useState('');
  const [catFilter, setCatFilter]   = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing]       = useState(null);
  const [toDelete, setToDelete]     = useState(null);
  const [toast, setToast]           = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleSave = (data) => {
    if (editing) {
      updateProduct(editing.id, data);
      showToast('Product updated successfully.');
    } else {
      addProduct(data);
      showToast('Product added successfully.');
    }
    setDrawerOpen(false);
    setEditing(null);
  };

  const handleEdit = (p) => { setEditing(p); setDrawerOpen(true); };
  const handleAddNew = () => { setEditing(null); setDrawerOpen(true); };
  const handleDeleteConfirm = (id) => { deleteProduct(id); setToDelete(null); showToast('Product deleted.'); };

  const filtered = productList.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || p.category === catFilter;
    const { label } = stockStatus(p.stock);
    const matchStock = stockFilter === 'All' || label === stockFilter;
    return matchSearch && matchCat && matchStock;
  });

  const lowStockCount   = productList.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = productList.filter(p => p.stock === 0).length;
  const totalValue      = productList.reduce((s, p) => s + p.price * p.stock, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Products</h1>
          <p className="text-sm text-gray-400">{productList.length} products in inventory</p>
        </div>
        <button onClick={handleAddNew}
          className="flex items-center gap-2 bg-[#39FF14] text-gray-950 font-bold px-4 py-2.5 rounded-xl hover:bg-[#39FF14]/90 transition-colors text-sm neon-glow">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: productList.length, icon: Package, color: '#39FF14' },
          { label: 'Inventory Value', value: formatCurrency(totalValue), icon: BarChart3, color: '#00D4FF' },
          { label: 'Low Stock', value: lowStockCount, icon: AlertCircle, color: '#F59E0B' },
          { label: 'Out of Stock', value: outOfStockCount, icon: AlertTriangle, color: '#EF4444' },
        ].map(k => (
          <div key={k.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">{k.label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: k.color + '18' }}>
                <k.icon size={14} style={{ color: k.color }} />
              </div>
            </div>
            <p className="text-2xl font-black text-white">{k.value}</p>
          </div>
        ))}
      </div>

      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3">
          <AlertCircle size={15} className="text-yellow-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-yellow-300">
            {outOfStockCount > 0 && <><strong>{outOfStockCount} product(s)</strong> are out of stock. </>}
            {lowStockCount > 0 && <><strong>{lowStockCount} product(s)</strong> are running low (5 units or fewer).</>}
            {' '}Consider restocking soon.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or SKU…"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/60" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={"px-3 py-2 text-xs font-semibold rounded-xl border transition-all " + (catFilter === c ? 'border-[#39FF14]/60 bg-[#39FF14]/10 text-[#39FF14]' : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white')}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {STOCK_FILTERS.map(s => (
            <button key={s} onClick={() => setStockFilter(s)}
              className={"px-3 py-2 text-xs font-semibold rounded-xl border transition-all " + (stockFilter === s ? 'border-[#00D4FF]/60 bg-[#00D4FF]/10 text-[#00D4FF]' : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white')}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-2xl">
          <ShoppingBag size={40} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No products found</p>
          <p className="text-sm text-gray-600 mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onEdit={handleEdit} onDelete={setToDelete} />
          ))}
        </div>
      )}

      <ProductDrawer open={drawerOpen} product={editing}
        onClose={() => { setDrawerOpen(false); setEditing(null); }} onSave={handleSave} />
      <DeleteConfirm product={toDelete} onConfirm={handleDeleteConfirm} onCancel={() => setToDelete(null)} />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 border border-[#39FF14]/30 text-[#39FF14] text-sm font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <Check size={14} /> {toast}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { ShoppingBag, Search, ShoppingCart, Plus, Minus, X, Package, Tag, Check, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currency';

const CATEGORIES = ['All', 'Supplements', 'Equipment', 'Accessories', 'Apparel', 'Recovery'];

function stockStatus(stock) {
  if (stock === 0) return { label: 'Out of Stock', color: 'text-red-400',    canBuy: false };
  if (stock <= 5)  return { label: 'Low Stock',    color: 'text-yellow-400', canBuy: true  };
  return               { label: 'In Stock',     color: 'text-[#39FF14]',  canBuy: true  };
}

function ProductCard({ product, onAddToCart, cartQty }) {
  const { label, color, canBuy } = stockStatus(product.stock);
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col gap-3 hover:border-gray-700 transition-all">
      <div className="w-full aspect-square max-h-28 rounded-xl bg-gray-800 flex items-center justify-center text-5xl">
        {product.emoji || '📦'}
      </div>
      <div className="flex-1">
        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-lg">{product.category}</span>
        <h3 className="font-bold text-white text-sm mt-2 leading-tight line-clamp-2">{product.name}</h3>
        {product.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-lg font-black text-[#39FF14]">{formatCurrency(product.price)}</p>
        <span className={"text-xs font-medium " + color}>{label}</span>
      </div>
      {canBuy ? (
        cartQty > 0 ? (
          <div className="flex items-center gap-2">
            <button onClick={() => onAddToCart(product, -1)}
              className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center transition-colors">
              <Minus size={12} />
            </button>
            <span className="flex-1 text-center text-sm font-bold text-white">{cartQty}</span>
            <button onClick={() => onAddToCart(product, 1)}
              className="w-8 h-8 rounded-lg bg-[#39FF14]/20 hover:bg-[#39FF14]/30 text-[#39FF14] flex items-center justify-center transition-colors">
              <Plus size={12} />
            </button>
          </div>
        ) : (
          <button onClick={() => onAddToCart(product, 1)}
            className="w-full py-2 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] text-sm font-semibold hover:bg-[#F59E0B]/20 transition-colors flex items-center justify-center gap-2">
            <ShoppingCart size={13} /> Add to Cart
          </button>
        )
      ) : (
        <button disabled className="w-full py-2 rounded-xl bg-gray-800 text-gray-600 text-sm font-semibold cursor-not-allowed">
          Out of Stock
        </button>
      )}
    </div>
  );
}

function CartDrawer({ cart, open, onClose, onUpdateQty, onClear }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const [inquired, setInquired] = useState(false);

  const handleInquire = () => {
    setInquired(true);
    setTimeout(() => { setInquired(false); onClear(); onClose(); }, 2500);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-gray-900 border-l border-gray-700 w-full max-w-sm flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-[#F59E0B]" />
            <p className="font-bold text-white">Your Cart</p>
            <span className="text-xs bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-0.5 rounded-full font-semibold">{cart.reduce((s, i) => s + i.qty, 0)}</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={36} className="text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Your cart is empty</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className="flex items-center gap-3 bg-gray-800 rounded-xl p-3">
              <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-xl flex-shrink-0">
                {item.emoji || '📦'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                <p className="text-xs text-[#39FF14]">{formatCurrency(item.price)} × {item.qty}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => onUpdateQty(item.id, -1)}
                  className="w-6 h-6 rounded bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center">
                  <Minus size={10} />
                </button>
                <span className="text-xs font-bold text-white w-5 text-center">{item.qty}</span>
                <button onClick={() => onUpdateQty(item.id, 1)}
                  className="w-6 h-6 rounded bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center">
                  <Plus size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t border-gray-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Total</span>
              <span className="text-lg font-black text-white">{formatCurrency(total)}</span>
            </div>
            {inquired ? (
              <div className="w-full py-3 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/30 text-[#39FF14] text-sm font-semibold flex items-center justify-center gap-2">
                <Check size={14} /> Inquiry sent! Staff will assist you.
              </div>
            ) : (
              <button onClick={handleInquire}
                className="w-full py-3 rounded-xl bg-[#F59E0B] text-gray-950 text-sm font-bold hover:bg-[#F59E0B]/90 transition-colors flex items-center justify-center gap-2">
                <MessageSquare size={14} /> Request Purchase at Counter
              </button>
            )}
            <p className="text-xs text-gray-600 text-center">
              Payments are processed at the front desk. Staff will confirm availability.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MemberShop() {
  const { productList } = useAuth();
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart]         = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const handleAddToCart = (product, delta) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (!existing && delta > 0) return [...prev, { ...product, qty: 1 }];
      if (existing) {
        const newQty = existing.qty + delta;
        if (newQty <= 0) return prev.filter(i => i.id !== product.id);
        return prev.map(i => i.id === product.id ? { ...i, qty: newQty } : i);
      }
      return prev;
    });
  };

  const availableProducts = productList.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const inStock = productList.filter(p => p.stock > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">GymForce Shop</h1>
          <p className="text-sm text-gray-400">{inStock} products available · Supplements, gear, and more</p>
        </div>
        <button onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] font-bold px-4 py-2.5 rounded-xl hover:bg-[#F59E0B]/20 transition-colors text-sm">
          <ShoppingCart size={16} /> Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#F59E0B] text-gray-950 text-xs font-black rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-5 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(circle at 80% 50%, #F59E0B, transparent)' }} />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#F59E0B]/20 flex items-center justify-center text-3xl">🛍️</div>
          <div>
            <p className="font-bold text-white">Member Exclusive Shop</p>
            <p className="text-sm text-gray-400">Browse and request products at the front desk. Members get priority service.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#F59E0B]/60" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={"px-3 py-2 text-xs font-semibold rounded-xl border transition-all " + (category === c ? 'border-[#F59E0B]/60 bg-[#F59E0B]/10 text-[#F59E0B]' : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white')}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {availableProducts.length === 0 ? (
        <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-2xl">
          <Package size={40} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No products found</p>
          <p className="text-sm text-gray-600 mt-1">Try adjusting your search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {availableProducts.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={handleAddToCart}
              cartQty={cart.find(i => i.id === p.id)?.qty || 0}
            />
          ))}
        </div>
      )}

      <CartDrawer
        cart={cart}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onUpdateQty={(id, delta) => handleAddToCart(productList.find(p => p.id === id), delta)}
        onClear={() => setCart([])}
      />
    </div>
  );
}

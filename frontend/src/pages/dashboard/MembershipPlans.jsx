import { useState } from 'react';
import { Check, X, Tag, ChevronDown } from 'lucide-react';
import { membershipPlans, billingCycles, memberCategories, offers } from '../../data/sampleData';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currency';

const PLAN_COLORS = {
  gray:   { accent: '#6B7280', glow: '#6B728030' },
  blue:   { accent: '#00D4FF', glow: '#00D4FF30' },
  green:  { accent: '#39FF14', glow: '#39FF1430' },
  orange: { accent: '#FF6B00', glow: '#FF6B0030' },
};

// Compute discounted price
function computePrice(baseMonthly, cycle, coupon, allOffers) {
  if (!cycle || cycle.id === 'custom') return null;
  let total = Math.round(baseMonthly * cycle.multiplier);
  let discount = 0;
  if (coupon && allOffers) {
    const offer = allOffers.find(o => o.code === coupon.toUpperCase() && (o.status === 'Active' || !o.status));
    if (offer) {
      const type = (offer.type || offer.discountType || '').toLowerCase();
      const val = offer.value ?? offer.discountValue ?? 0;
      discount = type === 'percentage' ? Math.round(total * val / 100) : val;
    }
  }
  return { total, discount, final: Math.max(0, total - discount) };
}


export default function MembershipPlans() {
  const { currentUser, offerList } = useAuth();
  const [activeCategory, setActiveCategory] = useState('Mens');
  const [activeCycle,    setActiveCycle]    = useState(billingCycles[0]);
  const [coupon,         setCoupon]         = useState('');
  const [appliedCoupon,  setAppliedCoupon]  = useState('');
  const [couponMsg,      setCouponMsg]      = useState('');
  const [couponOk,       setCouponOk]       = useState(false);

  const currentOffers = offerList || offers;
  const activeOffers = currentOffers.filter(o => o.status === 'Active' || !o.status);

  const handleApplyCoupon = () => {
    const found = activeOffers.find(o => o.code === coupon.trim().toUpperCase());
    if (found) {
      const type = (found.type || found.discountType || '').toLowerCase();
      const val = found.value ?? found.discountValue ?? 0;
      const name = found.name || found.title || found.code;
      setAppliedCoupon(coupon.trim().toUpperCase());
      setCouponMsg(`✓ "${name}" applied — ${type === 'percentage' ? `${val}% off` : `₹${val} off`}`);
      setCouponOk(true);
    } else {
      setAppliedCoupon('');
      setCouponMsg('✗ Invalid or expired coupon code');
      setCouponOk(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Membership Plans</h1>
        <p className="text-gray-400 text-sm mt-1">Manage plans, categories, billing cycles, and pricing (₹ INR)</p>
      </div>

      {/* Category + Cycle Selectors */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Category tabs */}
        <div className="flex gap-2 bg-gray-900 border border-gray-800 rounded-xl p-1">
          {memberCategories.map(cat => {
            const colors = { Ladies: '#EC4899', Mens: '#3B82F6', Mixed: '#39FF14' };
            const isActive = activeCategory === cat;
            return (
              <button key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                style={isActive ? { background: `${colors[cat]}20`, color: colors[cat] } : {}}>
                {cat === 'Ladies' ? '🏃‍♀️' : cat === 'Mens' ? '🏋️' : '🤝'} {cat}
              </button>
            );
          })}
        </div>

        {/* Billing cycle tabs */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 flex-wrap">
          {billingCycles.map(cycle => (
            <button key={cycle.id}
              onClick={() => setActiveCycle(cycle)}
              className={`relative px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeCycle.id === cycle.id ? 'bg-[#39FF14] text-gray-950' : 'text-gray-400 hover:text-white'}`}>
              {cycle.label}
              {cycle.savings && activeCycle.id === cycle.id && (
                <span className="absolute -top-2 -right-1 bg-orange-500 text-white text-[10px] px-1 rounded-full font-bold">-{cycle.savings}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Coupon code bar */}
      <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl p-4">
        <Tag size={16} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Enter coupon / promo code"
          value={coupon}
          onChange={e => setCoupon(e.target.value.toUpperCase())}
          className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
        />
        <button onClick={handleApplyCoupon}
          className="bg-[#39FF14] text-gray-950 font-bold text-xs px-4 py-2 rounded-lg hover:bg-[#39FF14]/90 transition-all">
          Apply
        </button>
        {couponMsg && <span className={`text-xs font-semibold ${couponOk ? 'text-[#39FF14]' : 'text-red-400'}`}>{couponMsg}</span>}
      </div>

      {/* Active offers strip */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {activeOffers.filter(o => o.applicableCategories.includes(activeCategory)).map(o => (
          <div key={o.id} className="flex-shrink-0 bg-gray-900 border border-[#A855F7]/30 rounded-xl px-4 py-2 flex items-center gap-2 cursor-pointer hover:border-[#A855F7]/60 transition-colors"
            onClick={() => { setCoupon(o.code); setCouponMsg(''); }}>
            <Tag size={12} className="text-[#A855F7]" />
            <div>
              <p className="text-xs font-bold text-white">{o.code}</p>
              <p className="text-xs text-gray-400">{o.type === 'percentage' ? `${o.value}% off` : `₹${o.value} off`}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {membershipPlans.map(plan => {
          const colors  = PLAN_COLORS[plan.color];
          const baseMonthly = plan.prices[activeCategory];
          const pricing = activeCycle.id !== 'custom'
            ? computePrice(baseMonthly, activeCycle, appliedCoupon, currentOffers)
            : null;

          return (
            <div key={plan.id}
              className={`relative bg-gray-900 border rounded-2xl p-5 flex flex-col ${plan.popular ? 'border-[#00D4FF]/50' : 'border-gray-800'}`}
              style={plan.popular ? { boxShadow: `0 0 20px ${colors.glow}` } : {}}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00D4FF] text-gray-950 text-xs font-black px-3 py-1 rounded-full">MOST POPULAR</div>
              )}

              <div className="mb-4">
                <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center font-black text-lg" style={{ background: colors.glow, color: colors.accent }}>
                  {plan.id === 'basic' ? '🥈' : plan.id === 'standard' ? '🥇' : plan.id === 'premium' ? '💎' : '👑'}
                </div>
                <h3 className="text-lg font-black text-white">{plan.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{activeCategory} membership</p>
              </div>

              {/* Pricing block */}
              <div className="mb-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">{formatCurrency(baseMonthly)}</span>
                  <span className="text-gray-400 text-sm">/month</span>
                </div>
                {activeCycle.id !== 'custom' && pricing && (
                  <div className="mt-2 p-2 rounded-lg bg-gray-800/60 border border-gray-700/40">
                    <p className="text-xs text-gray-400">{activeCycle.label} total:</p>
                    {pricing.discount > 0 ? (
                      <>
                        <p className="text-xs text-gray-500 line-through">{formatCurrency(pricing.total)}</p>
                        <p className="text-base font-black" style={{ color: colors.accent }}>{formatCurrency(pricing.final)}</p>
                        <p className="text-xs text-[#39FF14]">You save {formatCurrency(pricing.discount)}</p>
                      </>
                    ) : (
                      <p className="text-base font-black" style={{ color: colors.accent }}>{formatCurrency(pricing.total)}</p>
                    )}
                    {activeCycle.savings && <p className="text-xs text-orange-400 mt-0.5">Save {activeCycle.savings} with this cycle</p>}
                  </div>
                )}
                {activeCycle.id === 'custom' && (
                  <div className="mt-2 p-2 rounded-lg bg-gray-800/60 border border-gray-700/40">
                    <p className="text-xs text-gray-400">Custom plan — contact admin for pricing</p>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-2 flex-1">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <Check size={14} style={{ color: colors.accent }} className="mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{f}</span>
                  </div>
                ))}
                {plan.notIncluded.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <X size={14} className="text-gray-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{f}</span>
                  </div>
                ))}
              </div>

              <button className={`mt-5 w-full py-2.5 rounded-xl text-sm font-bold transition-all ${plan.popular ? 'text-gray-950' : 'border hover:opacity-90'}`}
                style={plan.popular
                  ? { background: colors.accent }
                  : { borderColor: `${colors.accent}50`, color: colors.accent, background: `${colors.accent}10` }}>
                {plan.popular ? 'Get Started' : 'Select Plan'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Billing cycle comparison table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="font-bold text-white mb-4">Billing Cycle Comparison — {activeCategory} Plans</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-800">
                <th className="text-left pb-3 font-medium">Plan</th>
                {billingCycles.filter(c => c.id !== 'custom').map(c => (
                  <th key={c.id} className="text-right pb-3 font-medium">
                    {c.label}{c.savings ? <span className="ml-1 text-[#39FF14]">(-{c.savings})</span> : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {membershipPlans.map(plan => {
                const base = plan.prices[activeCategory];
                const colors = PLAN_COLORS[plan.color];
                return (
                  <tr key={plan.id} className="border-b border-gray-800/50">
                    <td className="py-3 font-semibold" style={{ color: colors.accent }}>{plan.name}</td>
                    {billingCycles.filter(c => c.id !== 'custom').map(c => (
                      <td key={c.id} className="py-3 text-right text-gray-300">
                        {formatCurrency(Math.round(base * c.multiplier))}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

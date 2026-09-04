import { CreditCard, Check, X, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, parseCurrency } from '../../utils/currency';

const STATUS_MAP = {
  Paid:    { icon: Check,  color: '#39FF14', bg: 'bg-[#39FF14]/10 border-[#39FF14]/20 text-[#39FF14]' },
  Failed:  { icon: X,     color: '#EF4444', bg: 'bg-red-500/10 border-red-500/20 text-red-400' },
  Pending: { icon: Clock, color: '#F59E0B', bg: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_MAP[status] || STATUS_MAP.Pending;
  const Icon = cfg.icon;
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1 w-fit ${cfg.bg}`}>
      <Icon size={10} />{status}
    </span>
  );
}

export default function MemberPayments() {
  const { currentUser } = useAuth();
  const mp = currentUser?.memberProfile;
  const history = mp?.paymentHistory || [];
  const pending = mp?.pendingPayments || [];

  const totalPaid = history
    .filter(p => p.status === 'Paid')
    .reduce((s, p) => s + parseCurrency(p.amount), 0);

  const totalPending = pending.reduce((s, p) => s + parseCurrency(p.amount), 0);

  // Next billing month
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  // Price for the plan (look up from plan name)
  const planPriceMap = { Basic: 799, Standard: 1499, Premium: 2299, VIP: 3999 };
  const nextAmount = planPriceMap[mp?.plan] || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">My Payments</h1>
        <p className="text-gray-500 text-sm">Billing history and upcoming payments</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Paid (Lifetime)', value: formatCurrency(totalPaid), color: '#39FF14' },
          { label: 'Current Plan',           value: mp?.plan || '—',  color: '#F59E0B' },
          { label: 'Pending Amount',          value: totalPending > 0 ? formatCurrency(totalPending) : '₹0', color: totalPending > 0 ? '#EF4444' : '#6B7280' },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Pending payments alert */}
      {pending.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-red-400" />
            <h3 className="font-bold text-red-400">Pending Payments</h3>
          </div>
          <div className="space-y-2">
            {pending.map(p => (
              <div key={p.id} className="flex items-center justify-between bg-gray-900/50 rounded-xl p-3">
                <div>
                  <p className="text-sm font-bold text-white">{p.amount} — {p.plan}</p>
                  <p className="text-xs text-gray-500">{p.date}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment history */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <h3 className="font-bold text-white">Payment History</h3>
          <p className="text-xs text-gray-500">{history.length} transactions</p>
        </div>
        {history.length === 0 ? (
          <div className="py-12 text-center">
            <CreditCard size={32} className="mx-auto mb-3 text-gray-700" />
            <p className="text-gray-500 text-sm">No payment history yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/30">
                <tr>
                  {['ID', 'Date', 'Plan', 'Amount', 'Method', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map(p => (
                  <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono">{p.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{p.date}</td>
                    <td className="px-4 py-3 text-sm text-white font-medium">{p.plan}</td>
                    <td className="px-4 py-3 text-sm font-bold text-white">{p.amount}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{p.method}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Next payment */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 flex items-center justify-center">
            <CreditCard size={18} className="text-[#F59E0B]" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Next Payment Due</p>
            <p className="text-xs text-gray-400">{nextMonth} · {mp?.plan} Plan</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-black text-white text-xl">{formatCurrency(nextAmount)}</p>
          <p className="text-xs text-gray-500">Contact reception to renew</p>
        </div>
      </div>
    </div>
  );
}

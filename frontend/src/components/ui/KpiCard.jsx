// Shared reusable KpiCard component
export default function KpiCard({ title, value, change, positive, icon: Icon, color, subtitle }) {
  const isPositive = positive !== false && positive !== undefined
    ? positive
    : change?.startsWith('+');

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400">{title}</p>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-black text-white mb-2">{value}</p>
      {change && (
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-[#39FF14]' : 'text-red-400'}`}>
          <span>{isPositive ? '▲' : '▼'}</span>
          <span>{change}</span>
          <span className="text-gray-600 font-normal ml-1">{subtitle || 'vs last month'}</span>
        </div>
      )}
      {!change && subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
}

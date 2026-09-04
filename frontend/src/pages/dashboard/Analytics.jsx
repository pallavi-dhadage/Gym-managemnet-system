import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Activity, PieChart as PieChartIcon, Target } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import {
  revenueData, attendanceData, membershipDistribution, memberCategoryDistribution,
  peakHoursSimple, trainerWorkloadData, enquirySourceBreakdown as enquirySourceData, memberRetentionData,
  productSalesData, productRevenue,
} from '../../data/sampleData';

function SimpleBarChart({ data, dataKey, color, height = 200 }) {
  const maxVal = Math.max(...data.map(d => d[dataKey] || 0), 1);
  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full bg-gray-800 rounded-t-lg relative" style={{ height: `${((item[dataKey] || 0) / maxVal) * 100}%`, minHeight: '4px', backgroundColor: color, opacity: 0.8 }} />
          <span className="text-[10px] text-gray-500 font-medium">{item.month || item.day || item.hour || item.name}</span>
        </div>
      ))}
    </div>
  );
}

function PieChart({ data, size = 180 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let currentAngle = -90;
  
  const slices = data.map(d => {
    const percentage = (d.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const slice = { ...d, percentage: percentage.toFixed(1), startAngle: currentAngle, angle };
    currentAngle += angle;
    return slice;
  });

  const getCoordinates = (angle, radius) => {
    const rad = (angle * Math.PI) / 180;
    return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
  };

  const createArc = (start, end, radius) => {
    const startCoords = getCoordinates(start, radius);
    const endCoords = getCoordinates(end, radius);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M 0 0 L ${startCoords.x} ${startCoords.y} A ${radius} ${radius} 0 ${largeArc} 1 ${endCoords.x} ${endCoords.y} Z`;
  };

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`-${size/2} -${size/2} ${size} ${size}`} className="flex-shrink-0">
        {slices.map((s, i) => (
          <path key={i} d={createArc(s.startAngle, s.startAngle + s.angle, size / 2.2)} fill={s.color} opacity="0.9" />
        ))}
      </svg>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-gray-300">{d.name}</span>
            <span className="text-xs text-gray-500 ml-auto">{slices[i].percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeatMap({ data }) {
  const maxCount = Math.max(...data.map(d => d.count));
  return (
    <div className="grid grid-cols-11 gap-2">
      {data.map((item, i) => {
        const intensity = (item.count / maxCount);
        const color = `rgba(57, 255, 20, ${intensity * 0.8})`;
        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="w-full aspect-square rounded-lg border border-gray-800 flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: color }}>
              {item.count}
            </div>
            <span className="text-[9px] text-gray-500 font-medium">{item.hour}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Analytics() {
  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);
  const avgAttendance = Math.round(attendanceData.reduce((s, d) => s + d.total, 0) / attendanceData.length);
  const totalMembers = revenueData[revenueData.length - 1].members;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Analytics & Insights</h1>
        <p className="text-gray-500 text-sm">Comprehensive business intelligence dashboard</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue (8M)',    value: formatCurrency(totalRevenue), icon: DollarSign, color: '#39FF14' },
          { label: 'Active Members',         value: totalMembers,         icon: Users,       color: '#00D4FF' },
          { label: 'Avg Daily Attendance',   value: avgAttendance,        icon: Activity,    color: '#A855F7' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500">{kpi.label}</p>
              <kpi.icon size={16} style={{ color: kpi.color }} />
            </div>
            <p className="text-2xl font-black" style={{ color: kpi.color }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue & Member Growth */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-[#39FF14]" />
            <h2 className="font-bold text-white">Revenue Trend (8 Months)</h2>
          </div>
          <SimpleBarChart data={revenueData} dataKey="revenue" color="#39FF14" height={220} />
          <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-3 gap-3 text-center">
            <div><p className="text-xs text-gray-500">Total</p><p className="text-sm font-bold text-white">{formatCurrency(totalRevenue)}</p></div>
            <div><p className="text-xs text-gray-500">Avg/Month</p><p className="text-sm font-bold text-white">{formatCurrency(Math.round(totalRevenue / 8))}</p></div>
            <div><p className="text-xs text-gray-500">Peak</p><p className="text-sm font-bold text-white">{formatCurrency(Math.max(...revenueData.map(d => d.revenue)))}</p></div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} className="text-[#00D4FF]" />
            <h2 className="font-bold text-white">Member Growth</h2>
          </div>
          <SimpleBarChart data={revenueData} dataKey="members" color="#00D4FF" height={220} />
          <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-3 gap-3 text-center">
            <div><p className="text-xs text-gray-500">Current</p><p className="text-sm font-bold text-white">{totalMembers}</p></div>
            <div><p className="text-xs text-gray-500">Growth</p><p className="text-sm font-bold text-[#39FF14]">+{totalMembers - revenueData[0].members}</p></div>
            <div><p className="text-xs text-gray-500">Start</p><p className="text-sm font-bold text-white">{revenueData[0].members}</p></div>
          </div>
        </div>
      </div>

      {/* Attendance Analysis */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-[#A855F7]" />
            <h2 className="font-bold text-white">Weekly Attendance Pattern</h2>
          </div>
          <SimpleBarChart data={attendanceData} dataKey="total" color="#A855F7" height={200} />
          <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between text-xs">
            <div><span className="text-gray-500">Peak Day:</span> <span className="font-bold text-white">Friday ({Math.max(...attendanceData.map(d => d.total))})</span></div>
            <div><span className="text-gray-500">Avg:</span> <span className="font-bold text-white">{avgAttendance}</span></div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-[#39FF14]" />
            <h2 className="font-bold text-white">Peak Hours Heatmap</h2>
          </div>
          <HeatMap data={peakHoursSimple} />
          <p className="text-xs text-gray-500 mt-4">🔥 Peak: 7 PM (200 members) • 🌅 Morning: 7 AM (180 members)</p>
        </div>
      </div>

      {/* Membership & Category Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon size={18} className="text-[#39FF14]" />
            <h2 className="font-bold text-white">Membership Plan Distribution</h2>
          </div>
          <PieChart data={membershipDistribution} size={160} />
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} className="text-[#EC4899]" />
            <h2 className="font-bold text-white">Member Category Split</h2>
          </div>
          <PieChart data={memberCategoryDistribution} size={160} />
        </div>
      </div>

      {/* Trainer Workload */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target size={18} className="text-[#FF6B00]" />
          <h2 className="font-bold text-white">Trainer Workload & Utilization</h2>
        </div>
        <div className="space-y-3">
          {trainerWorkloadData.map(t => (
            <div key={t.name} className="flex items-center gap-4">
              <div className="w-32 flex-shrink-0"><p className="text-sm font-semibold text-white">{t.name}</p></div>
              <div className="flex-1">
                <div className="h-8 bg-gray-800 rounded-lg overflow-hidden relative">
                  <div className="h-full bg-gradient-to-r from-[#39FF14] to-[#00D4FF]" style={{ width: `${t.utilization}%` }} />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{t.utilization}% • {t.sessions} sessions</span>
                </div>
              </div>
              <div className="w-16 flex-shrink-0 text-right"><p className="text-xs text-gray-500">{t.clients} clients</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Sales & Enquiry Sources */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-[#00D4FF]" />
            <h2 className="font-bold text-white">Top Product Sales</h2>
          </div>
          <div className="space-y-3">
            {productSalesData.map(p => (
              <div key={p.product} className="flex items-center gap-3">
                <div className="w-28 flex-shrink-0"><p className="text-sm text-gray-300">{p.product}</p></div>
                <div className="flex-1 h-6 bg-gray-800 rounded-lg overflow-hidden relative">
                  <div className="h-full bg-[#00D4FF]" style={{ width: `${(p.sales / Math.max(...productSalesData.map(d => d.sales))) * 100}%` }} />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">{p.sales} sold</span>
                </div>
                <div className="w-20 flex-shrink-0 text-right"><p className="text-xs font-bold text-[#39FF14]">{formatCurrency(p.revenue)}</p></div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">Total Product Revenue</p>
            <p className="text-xl font-black text-[#39FF14]">{formatCurrency(productRevenue)}</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-[#A855F7]" />
            <h2 className="font-bold text-white">Enquiry Source Analysis</h2>
          </div>
          <div className="space-y-3">
            {enquirySourceData.map(e => {
              const total = enquirySourceData.reduce((s, d) => s + d.count, 0);
              const percent = Math.round((e.count / total) * 100);
              return (
                <div key={e.source} className="flex items-center gap-3">
                  <div className="w-24 flex-shrink-0"><p className="text-sm text-gray-300">{e.source}</p></div>
                  <div className="flex-1 h-6 bg-gray-800 rounded-lg overflow-hidden relative">
                    <div className="h-full" style={{ width: `${percent}%`, backgroundColor: e.color }} />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">{percent}%</span>
                  </div>
                  <div className="w-12 flex-shrink-0 text-right"><p className="text-sm font-bold text-white">{e.count}</p></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Member Retention */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-[#39FF14]" />
          <h2 className="font-bold text-white">Member Retention Rate (8 Months)</h2>
        </div>
        <div className="grid grid-cols-8 gap-2">
          {memberRetentionData.map(m => (
            <div key={m.month} className="text-center">
              <div className="bg-gray-800 rounded-lg p-3 mb-2">
                <p className="text-2xl font-black text-[#39FF14]">{m.retained}%</p>
                <p className="text-[10px] text-red-400 mt-1">-{m.churned}%</p>
              </div>
              <p className="text-xs text-gray-500">{m.month}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500">Avg Retention Rate</p>
          <p className="text-xl font-black text-[#39FF14]">{Math.round(memberRetentionData.reduce((s, d) => s + d.retained, 0) / memberRetentionData.length)}%</p>
        </div>
      </div>
    </div>
  );
}

import { TrendingUp, Target, Award, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from '../../context/AuthContext';

const attendanceTrend = [
  { month: 'Mar', sessions: 14 }, { month: 'Apr', sessions: 16 }, { month: 'May', sessions: 18 },
  { month: 'Jun', sessions: 20 }, { month: 'Jul', sessions: 18 }, { month: 'Aug', sessions: 22 },
];

const weightTrend = [
  { month: 'Jan', weight: 68 }, { month: 'Feb', weight: 67 }, { month: 'Mar', weight: 66 },
  { month: 'Apr', weight: 65 }, { month: 'May', weight: 64 }, { month: 'Jun', weight: 63 },
  { month: 'Jul', weight: 62 }, { month: 'Aug', weight: 61 },
];

export default function MemberProgress() {
  const { currentUser } = useAuth();
  const mp = currentUser?.memberProfile;
  const COLOR = '#F59E0B';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">My Progress</h1>
        <p className="text-gray-500 text-sm">Track your fitness journey and improvements</p>
      </div>

      {/* Performance records */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Target size={15} className="text-[#39FF14]" />Performance Records (This Month)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mp?.performanceRecords?.map((rec, i) => (
            <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">{rec.metric}</p>
              <p className="text-xl font-black text-white mb-1">{rec.value}</p>
              <p className="text-xs text-[#39FF14] font-semibold">{rec.improvement}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance trend chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="font-bold text-white mb-5 flex items-center gap-2"><BarChart3 size={15} style={{ color: COLOR }} />Monthly Attendance Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={attendanceTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '12px', fontSize: '12px' }} />
            <Bar dataKey="sessions" name="Sessions" fill={COLOR} radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Weight trend chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="font-bold text-white mb-5 flex items-center gap-2"><TrendingUp size={15} className="text-[#39FF14]" />Weight Trend (kg)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weightTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis domain={[55, 72]} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '12px', fontSize: '12px' }} />
            <Line type="monotone" dataKey="weight" stroke="#39FF14" strokeWidth={2.5} dot={{ fill: '#39FF14', r: 4 }} name="Weight (kg)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Body composition summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Starting Weight', value: mp?.weight?.atJoining, color: '#6B7280' },
          { label: 'Current Weight',  value: mp?.weight?.current,  color: '#39FF14' },
          { label: 'Weight Lost',     value: '7 kg',               color: '#F59E0B' },
          { label: 'BMI',             value: mp?.bmi,              color: '#00D4FF' },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-2">{s.label}</p>
            <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Achievement badges */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Award size={15} className="text-[#F59E0B]" />Achievements</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { emoji: '🏆', label: '6 Month Streak', color: '#F59E0B' },
            { emoji: '💪', label: '100+ Sessions', color: '#39FF14' },
            { emoji: '🔥', label: 'Consistent Aug', color: '#FF6B00' },
            { emoji: '⭐', label: 'Premium Member', color: '#A855F7' },
          ].map(a => (
            <div key={a.label} className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ background: `${a.color}10`, borderColor: `${a.color}20` }}>
              <span className="text-lg">{a.emoji}</span>
              <span className="text-xs font-bold" style={{ color: a.color }}>{a.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

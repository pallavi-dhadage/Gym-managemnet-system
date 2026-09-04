import { Link } from 'react-router-dom';
import { Calendar, CreditCard, TrendingUp, Dumbbell, Clock, User, ArrowRight, CheckCircle, AlertTriangle, ShoppingBag, Bot } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MemberHome() {
  const { currentUser } = useAuth();
  const mp = currentUser?.memberProfile;
  const COLOR = '#F59E0B';

  const daysLeft = mp?.expiryDate
    ? Math.max(0, Math.ceil((new Date(mp.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  const quickStats = [
    { label: 'Sessions This Month', value: mp?.attendanceSummary?.thisMonth ?? 18,  color: '#39FF14', icon: Dumbbell },
    { label: 'Weekly Average',       value: mp?.attendanceSummary?.avgPerWeek ?? 4.5, color: '#00D4FF', icon: TrendingUp },
    { label: 'Total Sessions',        value: mp?.attendanceSummary?.totalSessions ?? 112, color: '#F59E0B', icon: Clock },
    { label: 'Days Left',             value: daysLeft, color: '#A855F7', icon: Calendar },
  ];

  const today = mp?.workoutSchedule?.find(d => ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] === d.day);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at 70% 50%, ${COLOR}, transparent)` }} />
        <div className="relative z-10">
          <p className="text-sm font-medium mb-1" style={{ color: COLOR }}>Welcome back</p>
          <h1 className="text-3xl font-black text-white mb-1">{currentUser?.name?.split(' ')[0]} 💪</h1>
          <p className="text-gray-400 text-sm">Member ID: <span className="text-white font-mono font-bold">{mp?.memberId}</span> · Plan: <span style={{ color: COLOR }} className="font-semibold">{mp?.plan}</span></p>
          <div className="flex items-center gap-2 mt-3">
            <CheckCircle size={14} className="text-[#39FF14]" />
            <span className="text-sm text-[#39FF14]">Membership active until {mp?.expiryDate}</span>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">{s.label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}18` }}>
                <s.icon size={14} style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-2xl font-black text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Today's workout */}
      {today && (
        <div className="bg-gray-900 border border-[#F59E0B]/20 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-3 flex items-center gap-2">
            <Dumbbell size={16} style={{ color: COLOR }} /> Today's Workout
          </h3>
          {today.workout === 'Rest Day' ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-xl">😴</div>
              <div>
                <p className="font-bold text-white">Rest Day</p>
                <p className="text-xs text-gray-400">Recovery is part of training!</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${COLOR}18` }}>
                <Dumbbell size={20} style={{ color: COLOR }} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-white">{today.workout}</p>
                <p className="text-sm text-gray-400">{today.time} · {today.duration}</p>
              </div>
              <Link to="/member/schedule" className="text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all" style={{ color: COLOR, borderColor: `${COLOR}30`, background: `${COLOR}10` }}>
                View Schedule
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Quick links grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { to: '/member/profile',   label: 'My Profile',    icon: User,        desc: 'View & edit your info',  color: '#00D4FF' },
          { to: '/member/schedule',  label: 'Schedule',      icon: Calendar,    desc: 'Your workout plan',      color: '#39FF14' },
          { to: '/member/progress',  label: 'Progress',      icon: TrendingUp,  desc: 'Track improvements',     color: '#A855F7' },
          { to: '/member/payments',  label: 'Payments',      icon: CreditCard,  desc: 'Billing & history',      color: '#F59E0B' },
          { to: '/member/shop',      label: 'Gym Store',     icon: ShoppingBag, desc: 'Supplements & gear',    color: '#EC4899' },
          { to: '/member/ai-coach',  label: 'AI Coach',      icon: Bot,         desc: 'Workout suggestions',    color: '#39FF14' },
        ].map(item => (
          <Link key={item.to} to={item.to} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-600 card-hover group flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${item.color}18` }}>
              <item.icon size={18} style={{ color: item.color }} />
            </div>
            <div>
              <p className="font-bold text-white text-sm group-hover:text-[#F59E0B] transition-colors">{item.label}</p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
            <ArrowRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors self-end" />
          </Link>
        ))}
      </div>

      {/* Latest progress note */}
      {mp?.progressNotes?.[0] && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-3 flex items-center gap-2"><TrendingUp size={15} className="text-[#39FF14]" />Latest Trainer Note</h3>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-sm text-gray-200 leading-relaxed">"{mp.progressNotes[0].note}"</p>
            <p className="text-xs text-gray-500 mt-2">— {mp.progressNotes[0].by} · {mp.progressNotes[0].date}</p>
          </div>
        </div>
      )}
    </div>
  );
}

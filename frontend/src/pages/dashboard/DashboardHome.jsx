import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, Users, IndianRupee, Activity, AlertTriangle,
  UserPlus, CreditCard, CalendarCheck, Dumbbell, ArrowUpRight,
  Shield, Briefcase, HeadphonesIcon, MessageSquare, ShoppingBag,
  Wrench, ClipboardList, Star, Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  kpiData, revenueData, membershipDistribution,
  recentPayments, members, trainers, memberCategoryDistribution,
  attendanceData,
} from '../../data/sampleData';
import KpiCard from '../../components/ui/KpiCard';
import StatusBadge from '../../components/ui/StatusBadge';

// ── Custom Tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 text-xs shadow-xl">
        <p className="text-gray-400 mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="font-semibold">
            {entry.name}: {entry.name === 'revenue' ? `₹${(entry.value / 1000).toFixed(0)}K` : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// ── Quick Action Button ───────────────────────────────────────────────────────
function ActionBtn({ label, icon: Icon, color, to }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-700 hover:border-gray-500 hover:bg-gray-800/50 transition-all group">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors text-center">{label}</span>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MASTER ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function AdminDashboard({ roleConfig }) {
  const [payPage, setPayPage] = useState(1);
  const PER_PAGE = 5;
  const paymentList = recentPayments || [];
  const totalPages = Math.ceil(paymentList.length / PER_PAGE);
  const paginated = paymentList.slice((payPage - 1) * PER_PAGE, payPage * PER_PAGE);

  const kpis = [
    { title: kpiData?.revenue?.label || 'Monthly Revenue',       value: kpiData?.revenue?.value || '₹4,83,200', change: kpiData?.revenue?.change || '+12.5%', positive: true,  icon: IndianRupee,   color: '#39FF14' },
    { title: kpiData?.members?.label || 'Active Members',        value: kpiData?.members?.value || '1,284',     change: kpiData?.members?.change || '+8.2%',  positive: true,  icon: Users,         color: '#00D4FF' },
    { title: kpiData?.pendingDues?.label || 'Pending Dues',      value: kpiData?.pendingDues?.value || '₹68,400', change: '+3 members',                     positive: false, icon: AlertTriangle,  color: '#FF6B00' },
    { title: kpiData?.attendance?.label || 'Avg Attendance',     value: kpiData?.attendance?.value || '73%',   change: kpiData?.attendance?.change || '+4.1%', positive: true,  icon: Activity,      color: '#A855F7' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(k => <KpiCard key={k.title} {...k} />)}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-white">Revenue & Member Growth</h3>
              <p className="text-xs text-gray-500 mt-0.5">Monthly trend 2026 (₹)</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#39FF14" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#39FF14" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00D4FF" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#39FF14" strokeWidth={2} fill="url(#revGrad)" name="revenue" />
              <Area type="monotone" dataKey="members" stroke="#00D4FF" strokeWidth={2} fill="url(#memGrad)" name="members" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-1">Plan Distribution</h3>
          <p className="text-xs text-gray-500 mb-4">Active memberships by plan</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={membershipDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {membershipDistribution.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '12px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {membershipDistribution.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-gray-400">{d.name}</span>
                </div>
                <span className="text-gray-300 font-semibold">{d.value}%</span>
              </div>
            ))}
          </div>
          {/* Gender split */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 mb-3">Member Gender Split</p>
            {memberCategoryDistribution.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-gray-400">{d.name}</span>
                </div>
                <span className="text-gray-300 font-semibold">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance bar */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="font-bold text-white mb-1">Gym Overview</h3>
        <p className="text-xs text-gray-500 mb-6">Morning vs Evening check-ins</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: '12px', fontSize: '12px' }} />
            <Bar dataKey="morning" name="Morning" fill="#00D4FF" radius={[4,4,0,0]} />
            <Bar dataKey="evening" name="Evening" fill="#FF6B00" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Payments + quick actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white">Recent Payments</h3>
              <p className="text-xs text-gray-500 mt-0.5">{recentPayments.length} transactions</p>
            </div>
            <Link to="/dashboard/plans" className="text-xs text-[#39FF14] hover:underline flex items-center gap-1">View all <ArrowUpRight size={12} /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-800">
                  <th className="text-left pb-3 font-medium">Member</th>
                  <th className="text-left pb-3 font-medium hidden sm:table-cell">Plan</th>
                  <th className="text-left pb-3 font-medium hidden md:table-cell">Cycle</th>
                  <th className="text-left pb-3 font-medium">Amount</th>
                  <th className="text-left pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(p => (
                  <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-xs font-bold text-gray-300 flex-shrink-0">{p.avatar}</div>
                        <div>
                          <p className="text-sm font-medium text-white">{p.member}</p>
                          <p className="text-xs text-gray-500">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 hidden sm:table-cell"><span className="text-sm text-gray-300">{p.plan}</span></td>
                    <td className="py-3 pr-4 hidden md:table-cell"><span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">{p.cycle}</span></td>
                    <td className="py-3 pr-4"><span className="text-sm font-semibold text-white">{p.amount}</span></td>
                    <td className="py-3"><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
            <p className="text-xs text-gray-500">Showing {(payPage - 1) * PER_PAGE + 1}–{Math.min(payPage * PER_PAGE, recentPayments.length)} of {recentPayments.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPayPage(p => Math.max(1, p - 1))} disabled={payPage === 1} className="px-3 py-1.5 text-xs text-gray-400 bg-gray-800 rounded-lg disabled:opacity-40 hover:bg-gray-700">Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPayPage(n)} className={`w-7 h-7 text-xs rounded-lg transition-colors ${payPage === n ? 'bg-[#39FF14] text-gray-950 font-bold' : 'text-gray-400 hover:bg-gray-700'}`}>{n}</button>
              ))}
              <button onClick={() => setPayPage(p => Math.min(totalPages, p + 1))} disabled={payPage === totalPages} className="px-3 py-1.5 text-xs text-gray-400 bg-gray-800 rounded-lg disabled:opacity-40 hover:bg-gray-700">Next</button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-base font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <ActionBtn label="Add Member"      icon={UserPlus}    color="#39FF14" to="/dashboard/members" />
              <ActionBtn label="Record Payment"  icon={CreditCard}  color="#00D4FF" to="/dashboard/plans" />
              <ActionBtn label="Equipment"       icon={Wrench}      color="#FF6B00" to="/dashboard/equipment" />
              <ActionBtn label="Analytics"       icon={TrendingUp}  color="#A855F7" to="/dashboard/analytics" />
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-sm">Top Active Members</h3>
              <Link to="/dashboard/members" className="text-xs text-[#39FF14] hover:underline">All</Link>
            </div>
            <div className="space-y-3">
              {members.filter(m => m.status === 'Active').slice(0, 4).map(m => (
                <div key={m.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#39FF14]/20 to-[#00D4FF]/20 border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">{m.avatar}</div>
                    <div>
                      <p className="text-xs font-medium text-white">{m.name}</p>
                      <p className="text-xs text-gray-500">{m.plan} · {m.category}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#39FF14] font-semibold">{m.attendance} sessions</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TRAINER DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function TrainerDashboard({ currentUser, roleConfig }) {
  const trainerData = {
    clientCount: 24, sessionsToday: 4, avgRating: 4.9, nextSession: '10:00 AM',
    todaySchedule: [
      { time: '6:00 AM', member: 'Priya Sharma',   workout: 'Upper Body Strength', status: 'Done' },
      { time: '7:30 AM', member: 'Vikram Singh',    workout: 'Powerlifting',        status: 'Done' },
      { time: '10:00 AM',member: 'Deepa Krishnan',  workout: 'Strength Basics',     status: 'Upcoming' },
      { time: '4:00 PM', member: 'Ravi Kumar',      workout: 'Conditioning',        status: 'Upcoming' },
    ],
  };

  const myMembers = members.filter(m => m.trainer === currentUser?.name).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="My Clients"      value={trainerData.clientCount.toString()} icon={Users}          color="#00D4FF" subtitle="assigned members" />
        <KpiCard title="Sessions Today"  value={trainerData.sessionsToday.toString()} icon={CalendarCheck} color="#39FF14" subtitle="scheduled today" />
        <KpiCard title="Avg Client Rating" value={`${trainerData.avgRating}★`}      icon={Star}           color="#FF6B00" subtitle="out of 5.0" />
        <KpiCard title="Next Session"    value={trainerData.nextSession}            icon={Clock}          color="#A855F7" subtitle="Deepa Krishnan" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {trainerData.todaySchedule.map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/40 border border-gray-700/50">
                <div className="text-center w-14 flex-shrink-0">
                  <p className="text-xs font-bold text-gray-300">{s.time}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{s.member}</p>
                  <p className="text-xs text-gray-400">{s.workout}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.status === 'Done' ? 'bg-gray-700 text-gray-400' : 'bg-[#39FF14]/10 text-[#39FF14]'}`}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">My Members</h3>
            <Link to="/dashboard/members" className="text-xs text-[#00D4FF] hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {myMembers.length > 0 ? myMembers.map(m => (
              <div key={m.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00D4FF]/20 to-[#39FF14]/20 border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">{m.avatar}</div>
                  <div>
                    <p className="text-sm font-medium text-white">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.plan} · {m.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-[#00D4FF]">{m.attendance} sessions</p>
                  <StatusBadge status={m.status} />
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-500 text-center py-4">No members assigned yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="text-base font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          <ActionBtn label="Attendance"       icon={ClipboardList} color="#00D4FF" to="/dashboard/attendance" />
          <ActionBtn label="View Members"     icon={Users}         color="#39FF14" to="/dashboard/members" />
          <ActionBtn label="Notifications"    icon={MessageSquare} color="#A855F7" to="/dashboard/notifications" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAFF DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function StaffDashboard({ roleConfig }) {
  const recentMembers = members.slice(0, 5);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard title="New Registrations Today" value="4"       icon={UserPlus}   color="#FF6B00" subtitle="walk-ins + online" />
        <KpiCard title="Payments Today"         value="₹18,400" icon={IndianRupee} color="#39FF14" subtitle="7 transactions" />
        <KpiCard title="Check-ins Today"        value="128"      icon={CalendarCheck} color="#00D4FF" subtitle="morning + evening" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Recent Members</h3>
            <Link to="/dashboard/members" className="text-xs text-[#FF6B00] hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentMembers.map(m => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-800/30 border border-gray-700/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6B00]/20 to-[#39FF14]/20 border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">{m.avatar}</div>
                  <div>
                    <p className="text-sm font-medium text-white">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.plan} · {m.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={m.status} />
                  <p className="text-xs text-gray-500 mt-1">Expires {m.expiry}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-base font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <ActionBtn label="Add Member"    icon={UserPlus}   color="#FF6B00" to="/dashboard/members" />
              <ActionBtn label="Payment"       icon={CreditCard} color="#39FF14" to="/dashboard/plans" />
              <ActionBtn label="Attendance"    icon={CalendarCheck} color="#00D4FF" to="/dashboard/attendance" />
              <ActionBtn label="Products"      icon={ShoppingBag}   color="#A855F7" to="/dashboard/products" />
            </div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4">
            <p className="text-sm font-semibold text-orange-400 mb-1">⚠ Expiring Soon</p>
            <p className="text-2xl font-black text-white">47 members</p>
            <p className="text-xs text-gray-400 mt-1">memberships expire this week</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RECEPTIONIST DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function ReceptionistDashboard({ roleConfig }) {
  const { enquiries } = useAuth();
  const enqList = enquiries || [];
  const openEnqs  = enqList.filter(e => e.status === 'open');
  const followUps = enqList.filter(e => e.status === 'follow_up_due');

  // Kanban pipeline stages
  const pipeline = {
    open:      enqList.filter(e => e.status === 'open'),
    contacted: enqList.filter(e => e.status === 'contacted'),
    trial:     enqList.filter(e => e.status === 'scheduled_trial'),
    converted: enqList.filter(e => e.status === 'converted'),
  };

  // Renewal queue with days-to-expiry color coding
  const today = new Date();
  const renewalQueue = (members || [])
    .filter(m => m.status === 'Active' || m.status === 'Expiring')
    .map(m => {
      const expiry = new Date(m.expiry);
      const daysLeft = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
      let urgency = 'green';
      if (daysLeft < 3) urgency = 'red';
      else if (daysLeft < 7) urgency = 'amber';
      return { ...m, daysLeft, urgency };
    })
    .filter(m => m.daysLeft <= 14)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard title="Open Enquiries"       value={openEnqs.length.toString()}                icon={MessageSquare}  color="#A855F7" subtitle="need response" />
        <KpiCard title="Follow-ups Due"       value={followUps.length.toString()}               icon={AlertTriangle}  color="#FF6B00" subtitle="action needed" />
        <KpiCard title="Walk-ins Today"       value="6"                                         icon={UserPlus}       color="#39FF14" subtitle="checked in" />
        <KpiCard title="Expiring This Week"   value="47"                                        icon={CreditCard}     color="#00D4FF" subtitle="need renewal" />
      </div>

      {/* Enquiry Pipeline Kanban */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white">Enquiry Pipeline</h3>
          <Link to="/dashboard/enquiries" className="text-xs text-[#A855F7] hover:underline">Manage all</Link>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { key: 'open',      label: 'Open',      color: '#A855F7', count: pipeline.open.length },
            { key: 'contacted', label: 'Contacted', color: '#00D4FF', count: pipeline.contacted.length },
            { key: 'trial',     label: 'Trial',     color: '#FF6B00', count: pipeline.trial.length },
            { key: 'converted', label: 'Converted', color: '#39FF14', count: pipeline.converted.length },
          ].map(stage => (
            <div key={stage.key} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase">{stage.label}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${stage.color}20`, color: stage.color }}>{stage.count}</span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {pipeline[stage.key].slice(0, 4).map(enq => (
                  <div key={enq.id} className="bg-gray-900 border border-gray-700 rounded-lg p-2">
                    <p className="text-xs font-semibold text-white truncate">{enq.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{enq.via} · {enq.time}</p>
                  </div>
                ))}
                {pipeline[stage.key].length === 0 && (
                  <p className="text-[10px] text-gray-600 text-center py-4">No enquiries</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Renewal Queue */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-white">Renewal Queue</h3>
            <p className="text-xs text-gray-500 mt-0.5">Members expiring in next 14 days</p>
          </div>
          <Link to="/dashboard/members" className="text-xs text-[#00D4FF] hover:underline">View all</Link>
        </div>
        <div className="space-y-2">
          {renewalQueue.map(m => {
            const urgencyColors = {
              red:   { bg: 'bg-red-500/10',    border: 'border-red-500/30',    text: 'text-red-400',    badge: 'bg-red-500/20 text-red-400' },
              amber: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', badge: 'bg-yellow-500/20 text-yellow-400' },
              green: { bg: 'bg-green-500/10',  border: 'border-green-500/30',  text: 'text-green-400',  badge: 'bg-green-500/20 text-green-400' },
            };
            const colors = urgencyColors[m.urgency];
            return (
              <div key={m.id} className={`flex items-center justify-between p-3 rounded-xl border ${colors.bg} ${colors.border}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">{m.avatar}</div>
                  <div>
                    <p className="text-sm font-semibold text-white">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.plan} · {m.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`text-xs font-bold ${colors.text}`}>{m.daysLeft} {m.daysLeft === 1 ? 'day' : 'days'} left</p>
                    <p className="text-xs text-gray-600">Expires {new Date(m.expiry).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                  </div>
                  <Link to="/dashboard/plans" className="px-3 py-1.5 bg-[#00D4FF] text-gray-950 text-xs font-bold rounded-lg hover:bg-[#00D4FF]/90 transition-all">Renew</Link>
                </div>
              </div>
            );
          })}
          {renewalQueue.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-6">No urgent renewals ✓</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="font-bold text-white mb-3">Today's Gym Hours</h3>
          <div className="flex items-center gap-3 p-3 bg-[#39FF14]/5 border border-[#39FF14]/20 rounded-xl">
            <div className="w-3 h-3 rounded-full bg-[#39FF14] animate-pulse" />
            <div>
              <p className="text-sm font-semibold text-[#39FF14]">Open Today — Friday</p>
              <p className="text-xs text-gray-400">5:00 AM – 11:00 PM</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Saturday: 6 AM – 10 PM &nbsp;|&nbsp; Sunday: 7 AM – 9 PM</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-base font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <ActionBtn label="New Enquiry"    icon={MessageSquare} color="#A855F7" to="/dashboard/enquiries" />
            <ActionBtn label="Add Member"     icon={UserPlus}      color="#39FF14" to="/dashboard/members" />
            <ActionBtn label="Renew Plan"     icon={CreditCard}    color="#00D4FF" to="/dashboard/plans" />
            <ActionBtn label="Products"       icon={ShoppingBag}   color="#FF6B00" to="/dashboard/products" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT — role-aware routing
// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardHome() {
  const { currentUser, ROLE_CONFIG } = useAuth();
  const role = currentUser?.role || 'master_admin';
  const roleConfig = ROLE_CONFIG[role] || ROLE_CONFIG.master_admin;

  const displayName = (currentUser?.name || currentUser?.full_name || 'User').trim();
  const firstName = displayName.split(' ')[0] || 'User';

  const now  = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">
            Welcome back, {firstName} 👋
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-500 text-sm">{dateStr}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full border"
              style={{ background: `${roleConfig?.color}12`, borderColor: `${roleConfig?.color}30`, color: roleConfig?.color }}>
              {roleConfig?.label || 'Staff'}
            </span>
          </div>
        </div>
        {role === 'master_admin' && (
          <div className="flex items-center gap-2">
            <select className="bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-gray-500">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
            </select>
            <Link to="/dashboard/analytics" className="flex items-center gap-2 bg-[#39FF14] text-gray-950 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-[#39FF14]/90 transition-all">
              <ArrowUpRight size={15} /> Analytics
            </Link>
          </div>
        )}
      </div>

      {/* Role-specific dashboard */}
      {role === 'master_admin'  && <AdminDashboard        roleConfig={roleConfig} />}
      {role === 'trainer'       && <TrainerDashboard      currentUser={currentUser} roleConfig={roleConfig} />}
      {role === 'staff'         && <StaffDashboard        roleConfig={roleConfig} />}
      {role === 'receptionist'  && <ReceptionistDashboard roleConfig={roleConfig} />}
      {!['master_admin', 'trainer', 'staff', 'receptionist'].includes(role) && (
        <AdminDashboard roleConfig={ROLE_CONFIG.master_admin} />
      )}
    </div>
  );
}


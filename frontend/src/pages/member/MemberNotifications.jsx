import { useState } from 'react';
import { Bell, Check, CheckCheck, Trash2, Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

const MEMBER_NOTIFS = [
  { id: 1, title: 'Membership Renewal Reminder', message: 'Your Premium membership expires in 26 days on Sep 15, 2026.', time: '1 hour ago', read: false, type: 'warning' },
  { id: 2, title: 'Trainer Note Added', message: 'Rohit Kumar added a progress note to your profile. Check it out!', time: '3 hours ago', read: false, type: 'success' },
  { id: 3, title: 'Payment Confirmed', message: 'Your August payment of ₹2,299 was successfully processed.', time: '1 day ago', read: true, type: 'success' },
  { id: 4, title: 'Class Reminder', message: 'HIIT class starts in 1 hour. Don\'t forget your towel!', time: '2 days ago', read: true, type: 'info' },
  { id: 5, title: 'Achievement Unlocked!', message: 'Congrats! You completed 100+ total sessions. Keep it up!', time: '3 days ago', read: true, type: 'success' },
];

const ICON_MAP = { warning: AlertTriangle, success: CheckCircle, info: Info, error: AlertCircle };
const COLOR_MAP = {
  warning: { text: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', dot: 'bg-yellow-500' },
  success: { text: 'text-[#39FF14]', bg: 'bg-[#39FF14]/10 border-[#39FF14]/20', dot: 'bg-[#39FF14]' },
  info:    { text: 'text-[#00D4FF]', bg: 'bg-[#00D4FF]/10 border-[#00D4FF]/20', dot: 'bg-[#00D4FF]' },
  error:   { text: 'text-red-400',   bg: 'bg-red-500/10 border-red-500/20',      dot: 'bg-red-500' },
};

export default function MemberNotifications() {
  const [notifs, setNotifs] = useState(MEMBER_NOTIFS);

  const markAll = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const markRead = (id) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  const del = (id) => setNotifs(n => n.filter(x => x.id !== id));

  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Notifications</h1>
          <p className="text-gray-500 text-sm">{unread > 0 ? `${unread} unread` : 'All caught up!'}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAll} className="flex items-center gap-2 text-sm font-semibold text-[#F59E0B] border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-4 py-2 rounded-xl hover:bg-[#F59E0B]/20 transition-all">
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifs.map(n => {
          const cfg = COLOR_MAP[n.type] || COLOR_MAP.info;
          const Icon = ICON_MAP[n.type] || Info;
          return (
            <div key={n.id} className={`bg-gray-900 border rounded-2xl p-4 transition-all ${!n.read ? 'border-gray-700' : 'border-gray-800 opacity-70'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${cfg.bg}`}>
                  <Icon size={16} className={cfg.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{n.title}</h4>
                      <p className="text-sm text-gray-400 mt-0.5">{n.message}</p>
                    </div>
                    <span className="text-xs text-gray-600 flex-shrink-0">{n.time}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {!n.read && (
                    <button onClick={() => markRead(n.id)} className="p-1.5 text-gray-500 hover:text-[#39FF14] hover:bg-[#39FF14]/10 rounded-lg transition-colors">
                      <Check size={13} />
                    </button>
                  )}
                  <button onClick={() => del(n.id)} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {notifs.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <Bell size={32} className="mx-auto mb-3 text-gray-700" />
            <p className="text-gray-500">No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}

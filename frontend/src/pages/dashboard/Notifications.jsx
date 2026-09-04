import { useState } from 'react';
import { Bell, Check, CheckCheck, Trash2, Filter, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { notifications as initialNotifs } from '../../data/sampleData';

const severityConfig = {
  error: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-500' },
  success: { icon: CheckCircle, color: 'text-[#39FF14]', bg: 'bg-[#39FF14]/10 border-[#39FF14]/20', dot: 'bg-[#39FF14]' },
  warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', dot: 'bg-yellow-500' },
  info: { icon: Info, color: 'text-[#00D4FF]', bg: 'bg-[#00D4FF]/10 border-[#00D4FF]/20', dot: 'bg-[#00D4FF]' },
};

export default function Notifications() {
  const [notifs, setNotifs] = useState(initialNotifs);
  const [filter, setFilter] = useState('all');

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const markRead = (id) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  const deleteNotif = (id) => setNotifs(n => n.filter(x => x.id !== id));

  const filtered = notifs.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'error') return n.severity === 'error';
    if (filter === 'success') return n.severity === 'success';
    if (filter === 'warning') return n.severity === 'warning';
    return true;
  });

  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Notifications</h1>
          <p className="text-gray-500 text-sm">{unread > 0 ? `${unread} unread notifications` : 'All caught up!'}</p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 text-sm text-[#39FF14] border border-[#39FF14]/30 bg-[#39FF14]/10 px-4 py-2 rounded-xl hover:bg-[#39FF14]/20 transition-all"
          >
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'unread', label: `Unread (${unread})` },
          { key: 'error', label: 'Errors' },
          { key: 'warning', label: 'Warnings' },
          { key: 'success', label: 'Success' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f.key ? 'bg-[#39FF14] text-gray-950 font-bold' : 'glass border border-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <Bell size={32} className="mx-auto mb-3 text-gray-700" />
            <p className="text-gray-500">No notifications in this category</p>
          </div>
        ) : filtered.map(n => {
          const cfg = severityConfig[n.severity];
          const Icon = cfg.icon;
          return (
            <div
              key={n.id}
              className={`relative bg-gray-900 border rounded-2xl p-4 transition-all ${!n.read ? 'border-gray-700' : 'border-gray-800 opacity-70'}`}
            >
              {!n.read && (
                <div className={`absolute top-4 left-4 w-2 h-2 rounded-full ${cfg.dot}`} />
              )}

              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${cfg.bg}`}>
                  <Icon size={18} className={cfg.color} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{n.title}</h4>
                      <p className="text-sm text-gray-400 mt-0.5">{n.message}</p>
                    </div>
                    <span className="text-xs text-gray-600 flex-shrink-0 mt-0.5">{n.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {!n.read && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="p-1.5 text-gray-500 hover:text-[#39FF14] hover:bg-[#39FF14]/10 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotif(n.id)}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

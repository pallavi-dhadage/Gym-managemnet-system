import { useState } from 'react';
import { MessageSquare, Send, X, Check, Clock, AlertCircle, ChevronDown, Search, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const STATUS_CONFIG = {
  open:      { label: 'Open',      bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  responded: { label: 'Responded', bg: 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20'   },
  closed:    { label: 'Closed',    bg: 'bg-gray-700/50 text-gray-500 border-gray-700'          },
};

function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.open;
  return <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${c.bg}`}>{c.label}</span>;
}

function EnquiryCard({ enq, onRespond, onClose, isOpen }) {
  const [reply, setReply] = useState(enq.response || '');
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-gray-900 border rounded-2xl overflow-hidden transition-all ${enq.status === 'open' ? 'border-yellow-500/20' : enq.status === 'responded' ? 'border-[#39FF14]/10' : 'border-gray-800'}`}>
      {/* Header */}
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A855F7]/20 to-[#00D4FF]/20 border border-[#A855F7]/20 flex items-center justify-center text-sm font-black text-[#A855F7] flex-shrink-0">
            {enq.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-white text-sm">{enq.name}</h3>
              <StatusBadge status={enq.status} />
              <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">{enq.via === 'chat' ? '💬 Chat' : '📋 Form'}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{enq.email}{enq.phone ? ` · ${enq.phone}` : ''}</p>
            <p className="text-xs text-gray-500 mt-0.5">{enq.time}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {enq.status !== 'closed' && (
            <button onClick={() => onClose(enq.id)} className="p-1.5 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors text-xs" title="Close enquiry">
              <X size={14} />
            </button>
          )}
          <button onClick={() => setExpanded(e => !e)} className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <ChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-800 pt-3">
          {/* Interest */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Interest:</span>
            <span className="text-xs font-medium text-[#00D4FF] bg-[#00D4FF]/10 px-2 py-0.5 rounded-full">{enq.interest}</span>
          </div>

          {/* Message */}
          <div className="bg-gray-800/50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><MessageSquare size={11} /> Member's Message</p>
            <p className="text-sm text-gray-200 leading-relaxed">{enq.message}</p>
          </div>

          {/* Existing response */}
          {enq.response && (
            <div className="bg-[#39FF14]/5 border border-[#39FF14]/10 rounded-xl p-3">
              <p className="text-xs text-[#39FF14] mb-1 flex items-center gap-1"><Check size={11} /> Response Sent</p>
              <p className="text-sm text-gray-300 leading-relaxed">{enq.response}</p>
            </div>
          )}

          {/* Reply form */}
          {enq.status !== 'closed' && (
            <div className="space-y-2">
              <label className="text-xs text-gray-500">{enq.response ? 'Update response' : 'Write a response'}</label>
              <textarea
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Type your response here..."
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#A855F7]/50 transition-colors resize-none"
              />
              <button
                onClick={() => { if (reply.trim()) { onRespond(enq.id, reply.trim()); } }}
                disabled={!reply.trim()}
                className="flex items-center gap-2 bg-[#A855F7] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#A855F7]/90 transition-all disabled:opacity-40"
              >
                <Send size={13} /> Send Response
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Enquiries() {
  const { enquiries, respondToEnquiry, closeEnquiry } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = (enquiries || []).filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()) || e.message.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openCount = (enquiries || []).filter(e => e.status === 'open').length;
  const respondedCount = (enquiries || []).filter(e => e.status === 'responded').length;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Enquiries</h1>
          <p className="text-gray-500 text-sm">{openCount} open · {respondedCount} responded</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Open', value: openCount, color: '#F59E0B' },
          { label: 'Responded', value: respondedCount, color: '#39FF14' },
          { label: 'Total', value: (enquiries||[]).length, color: '#A855F7' },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or message..."
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-600" />
        </div>
        <div className="flex gap-1 p-1 bg-gray-900 border border-gray-800 rounded-xl">
          {['all','open','responded','closed'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${statusFilter === s ? 'bg-[#A855F7] text-white' : 'text-gray-400 hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <MessageSquare size={32} className="mx-auto mb-3 text-gray-700" />
            <p className="text-gray-500">No enquiries found</p>
          </div>
        ) : filtered.map(enq => (
          <EnquiryCard key={enq.id} enq={enq} onRespond={respondToEnquiry} onClose={closeEnquiry} />
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { User, Mail, Phone, Calendar, Dumbbell, Ruler, Salad, Save, Edit2, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MemberProfile() {
  const { currentUser, updateProfile } = useAuth();
  const mp = currentUser?.memberProfile;
  const COLOR = '#F59E0B';

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name:  currentUser?.name  || '',
    phone: currentUser?.phone || '',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateProfile({ name: form.name.trim(), phone: form.phone.trim() });
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const Section = ({ title, icon: Icon, children, color = COLOR }) => (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
        <Icon size={16} style={{ color }} /> {title}
      </h3>
      {children}
    </div>
  );

  const InfoRow = ({ label, value, highlight }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? '' : 'text-white'}`} style={highlight ? { color: highlight } : {}}>{value || '—'}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-800 border border-[#39FF14]/30 text-white text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-slide-up">
          <Check size={14} className="text-[#39FF14]" /> Profile updated successfully.
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">My Profile</h1>
          <p className="text-gray-500 text-sm">Member ID: <span className="font-mono text-white">{mp?.memberId}</span></p>
        </div>
        <button
          onClick={editMode ? handleSave : () => setEditMode(true)}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-all"
          style={editMode ? { background: '#39FF14', color: '#030712' } : { background: `${COLOR}15`, color: COLOR, border: `1px solid ${COLOR}30` }}
        >
          {editMode ? <><Save size={14} /> Save Changes</> : <><Edit2 size={14} /> Edit Profile</>}
        </button>
      </div>

      {/* Profile header */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0"
            style={{ background: `${COLOR}20`, border: `2px solid ${COLOR}40`, color: COLOR }}>
            {currentUser?.avatar}
          </div>
          <div className="flex-1">
            {editMode ? (
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="text-2xl font-black bg-gray-800 border border-gray-600 rounded-xl px-3 py-1.5 text-white w-full max-w-xs focus:outline-none focus:border-[#F59E0B]/50 mb-2"
              />
            ) : (
              <h2 className="text-2xl font-black text-white mb-2">{currentUser?.name}</h2>
            )}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: `${COLOR}20`, color: COLOR }}>{mp?.plan} Plan</span>
              <span className="text-xs px-3 py-1 rounded-full font-bold bg-[#39FF14]/10 text-[#39FF14]">{mp?.status}</span>
              <span className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-400">Trainer: {mp?.trainer}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Contact info */}
        <Section title="Contact Information" icon={User}>
          <InfoRow label="Full Name" value={currentUser?.name} />
          <InfoRow label="Email" value={currentUser?.email} />
          <div className="flex items-center justify-between py-2 border-b border-gray-800">
            <span className="text-sm text-gray-400">Phone</span>
            {editMode ? (
              <input
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                type="tel"
                placeholder="+91 98765 43210"
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-sm text-white w-48 focus:outline-none focus:border-[#F59E0B]/50"
              />
            ) : (
              <span className="text-sm font-semibold text-white">{currentUser?.phone || '—'}</span>
            )}
          </div>
          <InfoRow label="Gym" value={currentUser?.gym} />
        </Section>

        {/* Membership */}
        <Section title="Membership Details" icon={Calendar} color="#00D4FF">
          <InfoRow label="Member ID"        value={mp?.memberId}   highlight="#00D4FF" />
          <InfoRow label="Plan"             value={mp?.plan}       highlight={COLOR} />
          <InfoRow label="Status"           value={mp?.status}     highlight="#39FF14" />
          <InfoRow label="Join Date"        value={mp?.joinDate} />
          <InfoRow label="Expiry Date"      value={mp?.expiryDate} />
          <InfoRow label="Billing Cycle"    value={mp?.billingCycle} />
          <InfoRow label="Assigned Trainer" value={mp?.trainer} />
        </Section>

        {/* Body metrics */}
        <Section title="Body Metrics" icon={Ruler} color="#A855F7">
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[
              { label: 'Height at Joining', value: mp?.height?.atJoining, color: '#A855F7' },
              { label: 'Current Height',    value: mp?.height?.current,   color: '#A855F7' },
              { label: 'Weight at Joining', value: mp?.weight?.atJoining, color: '#FF6B00' },
              { label: 'Current Weight',    value: mp?.weight?.current,   color: '#39FF14' },
            ].map(m => (
              <div key={m.label} className="bg-gray-800/50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">{m.label}</p>
                <p className="font-black text-lg" style={{ color: m.color }}>{m.value || '—'}</p>
              </div>
            ))}
          </div>
          <InfoRow label="BMI" value={mp?.bmi} />
          <InfoRow label="Goal" value={mp?.goal?.replace('_', ' ') || '—'} />
        </Section>

        {/* Diet plan */}
        <Section title="Diet & Nutrition" icon={Salad} color="#39FF14">
          <div className="bg-gray-800/50 rounded-xl p-4 mb-3">
            <p className="text-xs text-gray-500 mb-1">Current Diet Plan</p>
            <p className="font-bold text-[#39FF14] text-base">{mp?.dietPlan || 'Not assigned'}</p>
          </div>
          <InfoRow label="Gym Member Since" value={mp?.joinDate} />
          <p className="text-xs text-gray-500 mt-3">Contact your trainer to update your nutrition plan.</p>
        </Section>
      </div>

      {/* Attendance summary */}
      <Section title="Attendance Summary" icon={Dumbbell} color="#00D4FF">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'This Month',    value: mp?.attendanceSummary?.thisMonth   || 0, color: '#39FF14' },
            { label: 'Last Month',    value: mp?.attendanceSummary?.lastMonth   || 0, color: '#00D4FF' },
            { label: 'Avg Per Week',  value: mp?.attendanceSummary?.avgPerWeek  || 0, color: '#F59E0B' },
            { label: 'Total Sessions',value: mp?.attendanceSummary?.totalSessions || 0, color: '#A855F7' },
          ].map(s => (
            <div key={s.label} className="bg-gray-800/50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Progress notes */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <Dumbbell size={15} style={{ color: COLOR }} /> Trainer Notes & Progress Updates
        </h3>
        <div className="space-y-3">
          {mp?.progressNotes?.map((note, i) => (
            <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-300">{note.by}</span>
                <span className="text-xs text-gray-500">{note.date}</span>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed">{note.note}</p>
            </div>
          ))}
          {(!mp?.progressNotes || mp.progressNotes.length === 0) && (
            <p className="text-gray-500 text-sm text-center py-6">No trainer notes yet. Your trainer will leave progress notes here after each session.</p>
          )}
        </div>
      </div>
    </div>
  );
}

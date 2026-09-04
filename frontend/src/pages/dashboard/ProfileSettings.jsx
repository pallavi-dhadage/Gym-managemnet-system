import { useState } from 'react';
import { User, Mail, Phone, Building2, Lock, Save, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProfileSettings() {
  const { currentUser, updateProfile, changePassword, ROLE_CONFIG } = useAuth();
  const roleConfig = ROLE_CONFIG[currentUser?.role];

  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    gym: currentUser?.gym || '',
  });

  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [showCurr, setShowCurr] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const [passMsg, setPassMsg] = useState(null);
  const [tab, setTab] = useState('profile');

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!profile.name.trim() || !profile.email.trim()) {
      setProfileMsg({ type: 'error', text: 'Name and email are required.' }); return;
    }
    const result = updateProfile({ name: profile.name.trim(), phone: profile.phone, gym: profile.gym });
    setProfileMsg(result.success ? { type: 'success', text: 'Profile updated successfully.' } : { type: 'error', text: 'Failed to update profile.' });
    setTimeout(() => setProfileMsg(null), 3000);
  };

  const handlePassChange = (e) => {
    e.preventDefault();
    if (passForm.newPass !== passForm.confirm) { setPassMsg({ type: 'error', text: 'New passwords do not match.' }); return; }
    const result = changePassword(passForm.current, passForm.newPass);
    if (result.success) {
      setPassMsg({ type: 'success', text: 'Password changed successfully.' });
      setPassForm({ current: '', newPass: '', confirm: '' });
    } else {
      setPassMsg({ type: 'error', text: result.error });
    }
    setTimeout(() => setPassMsg(null), 3000);
  };

  const initials = currentUser?.avatar || currentUser?.name?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() || '??';

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Profile Settings</h1>
        <p className="text-gray-500 text-sm">Manage your account information and security</p>
      </div>

      {/* Avatar + role card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black flex-shrink-0"
          style={{ background: `${roleConfig?.color}22`, border: `2px solid ${roleConfig?.color}40`, color: roleConfig?.color }}>
          {initials}
        </div>
        <div>
          <h2 className="text-lg font-black text-white">{currentUser?.name}</h2>
          <p className="text-sm" style={{ color: roleConfig?.color }}>{roleConfig?.label}</p>
          <p className="text-xs text-gray-500 mt-0.5">{currentUser?.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-900 border border-gray-800 rounded-xl w-fit">
        {['profile', 'security'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 text-sm font-semibold rounded-lg capitalize transition-all ${tab === t ? 'text-gray-950' : 'text-gray-400 hover:text-white'}`}
            style={tab === t ? { background: roleConfig?.color } : {}}>
            {t === 'profile' ? 'Personal Info' : 'Change Password'}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <form onSubmit={handleProfileSave} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
          {profileMsg && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm ${profileMsg.type === 'success' ? 'bg-[#39FF14]/10 border-[#39FF14]/20 text-[#39FF14]' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              {profileMsg.type === 'success' ? <Check size={15} /> : <AlertCircle size={15} />}
              {profileMsg.text}
            </div>
          )}

          {[
            { label: 'Full Name', key: 'name', icon: User, type: 'text' },
            { label: 'Email Address', key: 'email', icon: Mail, type: 'email', readOnly: true },
            { label: 'Phone Number', key: 'phone', icon: Phone, type: 'tel' },
            { label: 'Gym / Organisation', key: 'gym', icon: Building2, type: 'text' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">{f.label}</label>
              <div className="relative">
                <f.icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={f.type}
                  value={profile[f.key]}
                  onChange={e => !f.readOnly && setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                  readOnly={f.readOnly}
                  className={`w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${f.readOnly ? 'opacity-60 cursor-not-allowed' : 'focus:border-[#39FF14]/50'}`}
                />
              </div>
              {f.readOnly && <p className="text-xs text-gray-600 mt-0.5">Email cannot be changed</p>}
            </div>
          ))}

          <button type="submit" className="flex items-center gap-2 text-gray-950 font-bold px-6 py-2.5 rounded-xl transition-all text-sm"
            style={{ background: roleConfig?.color }}>
            <Save size={15} /> Save Changes
          </button>
        </form>
      )}

      {tab === 'security' && (
        <form onSubmit={handlePassChange} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
          {passMsg && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm ${passMsg.type === 'success' ? 'bg-[#39FF14]/10 border-[#39FF14]/20 text-[#39FF14]' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              {passMsg.type === 'success' ? <Check size={15} /> : <AlertCircle size={15} />}
              {passMsg.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Current Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type={showCurr ? 'text' : 'password'} value={passForm.current} onChange={e => setPassForm(p => ({ ...p, current: e.target.value }))}
                placeholder="Enter current password"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/50" />
              <button type="button" onClick={() => setShowCurr(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showCurr ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">New Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type={showNew ? 'text' : 'password'} value={passForm.newPass} onChange={e => setPassForm(p => ({ ...p, newPass: e.target.value }))}
                placeholder="Min 8 characters"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#39FF14]/50" />
              <button type="button" onClick={() => setShowNew(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm New Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="password" value={passForm.confirm} onChange={e => setPassForm(p => ({ ...p, confirm: e.target.value }))}
                placeholder="Re-enter new password"
                className={`w-full bg-gray-800 border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${passForm.confirm && passForm.confirm !== passForm.newPass ? 'border-red-500/60' : 'border-gray-700 focus:border-[#39FF14]/50'}`} />
            </div>
            {passForm.confirm && passForm.confirm !== passForm.newPass && <p className="text-xs text-red-400 mt-1">Passwords do not match</p>}
          </div>

          <button type="submit" className="flex items-center gap-2 bg-[#39FF14] text-gray-950 font-bold px-6 py-2.5 rounded-xl hover:bg-[#39FF14]/90 transition-all text-sm">
            <Lock size={15} /> Update Password
          </button>
        </form>
      )}
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Home, User, Calendar, CreditCard, TrendingUp, Bell, LogOut,
  Menu, X, Zap, ChevronDown, ShoppingBag, Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/member',               label: 'Dashboard',      icon: Home,        end: true },
  { to: '/member/profile',       label: 'My Profile',     icon: User },
  { to: '/member/schedule',      label: 'My Schedule',    icon: Calendar },
  { to: '/member/progress',      label: 'My Progress',    icon: TrendingUp },
  { to: '/member/payments',      label: 'Payments',       icon: CreditCard },
  { to: '/member/shop',          label: 'Gym Store',      icon: ShoppingBag },
  { to: '/member/notifications', label: 'Notifications',  icon: Bell },
  { to: '/member/ai-coach',      label: 'AI Coach',       icon: Bot },
];

export default function MemberLayout() {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const COLOR = '#F59E0B';
  const initials = currentUser?.avatar || currentUser?.name?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() || '??';

  const handleLogout = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setProfileOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {sidebarOpen && <div className="fixed inset-0 bg-black/70 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#FF6B00] flex items-center justify-center">
              <Zap size={16} className="text-gray-950" />
            </div>
            <span className="text-lg font-black">Gym<span className="text-[#F59E0B]">Force</span></span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white p-1"><X size={18} /></button>
        </div>

        {/* Member card */}
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
              style={{ background: `${COLOR}22`, border: `1px solid ${COLOR}40`, color: COLOR }}>
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{currentUser?.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${COLOR}20`, color: COLOR }}>
                  {currentUser?.memberProfile?.plan || 'Member'}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#39FF14]/10 text-[#39FF14] font-semibold">
                  {currentUser?.memberProfile?.status || 'Active'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p className="text-xs text-gray-600 uppercase tracking-widest px-3 py-2">Member Portal</p>
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${isActive ? '' : 'text-gray-400 hover:text-white hover:bg-gray-800/70'}`}
              style={({ isActive }) => isActive ? { background: `${COLOR}14`, border: `1px solid ${COLOR}22`, color: COLOR } : {}}>
              {({ isActive }) => (
                <>
                  <Icon size={17} style={isActive ? { color: COLOR } : {}} className={!isActive ? 'text-gray-500 group-hover:text-gray-300' : ''} />
                  <span className="flex-1">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-800 space-y-1">
          <div className="px-3 py-2">
            <p className="text-xs text-gray-600">Member ID: {currentUser?.memberProfile?.memberId || 'N/A'}</p>
            <p className="text-xs text-gray-600">Expires: {currentUser?.memberProfile?.expiryDate || 'N/A'}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer">
            <LogOut size={17} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg"><Menu size={20} /></button>
            <div>
              <p className="text-sm font-semibold text-white">{currentUser?.name}'s Portal</p>
              <p className="text-xs text-gray-500">{currentUser?.gym}</p>
            </div>
          </div>

          <div
            className="relative"
            ref={profileRef}
            onMouseEnter={() => setProfileOpen(true)}
            onMouseLeave={() => setProfileOpen(false)}
          >
            <button
              type="button"
              onClick={() => setProfileOpen(v => !v)}
              className="flex items-center gap-2 p-1.5 hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black" style={{ background: `${COLOR}25`, color: COLOR }}>{initials}</div>
              <ChevronDown size={13} className="text-gray-500 hidden sm:block" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full pt-1 w-48 z-50">
                <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="p-3 border-b border-gray-800">
                    <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
                    <p className="text-xs" style={{ color: COLOR }}>Gym Member</p>
                  </div>
                  <div className="p-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <LogOut size={13} /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-950 p-4 md:p-6"><Outlet /></main>
      </div>
    </div>
  );
}

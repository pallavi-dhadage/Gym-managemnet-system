import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, canAccess } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = currentUser.role || 'staff';
  const isMember = role === 'gym_member' || role === 'member';

  // Role-specific redirect — gym members go to /member portal
  if (isMember && !location.pathname.startsWith('/member')) {
    return <Navigate to="/member" replace />;
  }

  // Staff/admin trying to access /member — redirect to dashboard
  if (!isMember && location.pathname.startsWith('/member')) {
    return <Navigate to="/dashboard" replace />;
  }

  // allowedRoles whitelist
  if (allowedRoles) {
    const isAllowed =
      allowedRoles.includes(role) ||
      (isMember && (allowedRoles.includes('gym_member') || allowedRoles.includes('member')));
    if (!isAllowed) {
      const fallback = isMember ? '/member' : '/dashboard';
      return <Navigate to={fallback} replace />;
    }
  }

  // Path-level permission check
  if (canAccess && !canAccess(location.pathname)) {
    const fallback = isMember ? '/member' : '/dashboard';
    if (location.pathname !== fallback) {
      return <Navigate to={fallback} replace />;
    }
  }

  return children;
}


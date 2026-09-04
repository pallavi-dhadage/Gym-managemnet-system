import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// ── Public pages ──────────────────────────────────────────────────────────────
import LandingPage        from './pages/LandingPage';
import LoginPage          from './pages/auth/LoginPage';
import RegisterPage       from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import MemberEnquiryPage  from './pages/auth/MemberEnquiryPage';

// ── Staff / Admin dashboard ───────────────────────────────────────────────────
import DashboardLayout      from './layouts/DashboardLayout';
import DashboardHome        from './pages/dashboard/DashboardHome';
import Members              from './pages/dashboard/Members';
import MembershipPlans      from './pages/dashboard/MembershipPlans';
import Trainers             from './pages/dashboard/Trainers';
import Notifications        from './pages/dashboard/Notifications';
import Reports              from './pages/dashboard/Reports';
import Enquiries            from './pages/dashboard/Enquiries';
import ProfileSettings      from './pages/dashboard/ProfileSettings';
import Analytics            from './pages/dashboard/Analytics';
import EquipmentManagement  from './pages/dashboard/EquipmentManagement';
import Products             from './pages/dashboard/Products';
import Offers               from './pages/dashboard/Offers';
import Attendance           from './pages/dashboard/Attendance';

// ── Member portal ─────────────────────────────────────────────────────────────
import MemberLayout       from './layouts/MemberLayout';
import MemberHome         from './pages/member/MemberHome';
import MemberProfile      from './pages/member/MemberProfile';
import MemberSchedule     from './pages/member/MemberSchedule';
import MemberPayments     from './pages/member/MemberPayments';
import MemberNotifications from './pages/member/MemberNotifications';
import AICoach            from './pages/member/AICoach';
import MemberProgress     from './pages/member/MemberProgress';
import MemberShop         from './pages/member/MemberShop';

const STAFF_ROLES = ['master_admin', 'trainer', 'staff', 'receptionist'];

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ── Public ──────────────────────────────────────────────────── */}
            <Route path="/"                element={<LandingPage />} />
            <Route path="/login"           element={<LoginPage />} />
            <Route path="/register"        element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/enquiry"         element={<MemberEnquiryPage />} />

            {/* ── Staff / Admin Dashboard ──────────────────────────────────── */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={STAFF_ROLES}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index                   element={<DashboardHome />} />
              <Route path="members"          element={<Members />} />
              <Route path="plans"            element={<MembershipPlans />} />
              <Route path="trainers"         element={<Trainers />} />
              <Route path="attendance"       element={<Attendance />} />
              <Route path="equipment"        element={<EquipmentManagement />} />
              <Route path="products"         element={<Products />} />
              <Route path="offers"           element={<Offers />} />
              <Route path="notifications"    element={<Notifications />} />
              <Route path="reports"          element={<Reports />} />
              <Route path="enquiries"        element={<Enquiries />} />
              <Route path="profile"          element={<ProfileSettings />} />
              <Route path="analytics"        element={<Analytics />} />
            </Route>

            {/* ── Gym Member Portal ────────────────────────────────────────── */}
            <Route
              path="/member"
              element={
                <ProtectedRoute allowedRoles={['gym_member']}>
                  <MemberLayout />
                </ProtectedRoute>
              }
            >
              <Route index                  element={<MemberHome />} />
              <Route path="profile"         element={<MemberProfile />} />
              <Route path="schedule"        element={<MemberSchedule />} />
              <Route path="progress"        element={<MemberProgress />} />
              <Route path="payments"        element={<MemberPayments />} />
              <Route path="shop"            element={<MemberShop />} />
              <Route path="notifications"   element={<MemberNotifications />} />
              <Route path="ai-coach"        element={<AICoach />} />
            </Route>

            {/* ── Catch-all ────────────────────────────────────────────────── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/common/NotFound";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/common/Home";
import ChooseYourPath from "./pages/common/ChooseYourPath";
import PatientReg from "./pages/patient/PatientReg";
import PatientLogin from "./pages/patient/PatientLogin";
import PatientForgotPassword from "./pages/patient/forgot-password/ForgotPassword";
import PatientDashboard from "./pages/patient-dashboard/PatientDashboard";
import PatientUpdatePassword from "./pages/patient-dashboard/UpdatePassword";
import Verification from "./pages/common/Verification";
import PatientVerification from "./pages/patient/Verification";
import DoctorLogin from './pages/doctor/DoctorLogin';
import ForgotPassword from "./pages/doctor/forgot-password/ForgotPassword";
import DoctorDashboard from "./pages/doctor-dashboard/DoctorDashboard";
import DoctorCreatePassword from "./pages/doctor-dashboard/CreatePassword";
import DoctorUpdatePassword from "./pages/doctor-dashboard/UpdatePassword";
import PasswordSuccess from "./pages/doctor-dashboard/PasswordSuccess";
import DoctorSettings from "./pages/doctor-dashboard/Settings";
import PatientOnboarding from "./pages/patient/onboarding/PatientOnboarding";
import PatientAppointments from "./pages/patient-dashboard/PatientAppointments";
import BookAppointment from "./pages/patient-dashboard/BookAppointment";
import PatientChat from "./pages/patient-dashboard/PatientChat";
import AIChat from "./pages/patient-dashboard/AIChat";
import AIChatHistory from "./pages/patient-dashboard/AIChatHistory";
import PatientProfile from "./pages/patient-dashboard/PatientProfile";
import PatientSettings from "./pages/patient-dashboard/PatientSettings";
import { Toaster } from 'sonner';

import PatientNotifications from "./pages/patient-dashboard/PatientNotifications";

import DoctorProfile from "./pages/doctor-dashboard/DoctorProfile";
import MyPatients from "./pages/doctor-dashboard/MyPatients";
import PatientDetails from "./pages/doctor-dashboard/PatientDetails";
import DoctorSchedule from "./pages/doctor-dashboard/DoctorSchedule";
import DoctorBlockedBooking from "./pages/doctor-dashboard/DoctorBlockedBooking";
import DoctorNotifications from "./pages/doctor-dashboard/DoctorNotifications";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUpdatePassword from "./pages/admin/UpdatePassword";
import DoctorCredentials from "./pages/admin/DoctorCredentials";
import AppointmentDetails from "./pages/admin/AppointmentDetails";
import AdminSettings from "./pages/admin/AdminSettings";
import DoctorAvailability from "./pages/doctor-dashboard/DoctorAvailability";
import DoctorRegistration from "./pages/doctor/DoctorRegistration";
import DoctorRegistrationStep2 from "./pages/doctor/DoctorRegistrationStep2";
import DoctorRegistrationStep3 from "./pages/doctor/DoctorRegistrationStep3";
import DoctorRegistrationStep4 from "./pages/doctor/DoctorRegistrationStep4";
import AdminLogin from "./pages/admin/AdminLogin";
import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, userRole, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div></div>;
  if (!currentUser || userRole !== 'admin') return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

// In your Routes
  
function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      )}
      <Toaster position="top-center" richColors />
      <ErrorBoundary>
        <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/update-password" element={<AdminRoute><AdminUpdatePassword /></AdminRoute>} />
        <Route path="/admin/doctor-credentials" element={<AdminRoute><DoctorCredentials /></AdminRoute>} />
        <Route path="/admin/appointment-details" element={<AdminRoute><AppointmentDetails /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
        <Route path="/" element={<Home />} />
        <Route path="/choose-path" element={<ChooseYourPath />} />
        <Route path="/patient-reg" element={<PatientReg />} />
        <Route path="/patient/onboarding" element={<PatientOnboarding />} />
        <Route path="/patient/verification" element={<PatientVerification />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/patient/forgot-password" element={<PatientForgotPassword />} />
        <Route path="/patient/update-password" element={<PatientUpdatePassword />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/appointments" element={<PatientAppointments />} />
        <Route path="/patient/book-appointment" element={<BookAppointment />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/patient/book" element={<BookAppointment />} />
        <Route path="/patient/chat" element={<PatientChat />} />
        <Route path="/patient/ai-chat" element={<AIChat />} />
        <Route path="/patient/ai-chat/history" element={<AIChatHistory />} />
        <Route path="/patient/profile" element={<PatientProfile />} />
        <Route path="/patient/settings" element={<PatientSettings />} />
        <Route path="/patient/notifications" element={<PatientNotifications />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />
        <Route path="/doctor/settings" element={<DoctorSettings />} />
        <Route path="/doctor/notifications" element={<DoctorNotifications />} />
        <Route path="/doctor/schedule" element={<DoctorSchedule />} />
        <Route path="/doctor/blocked-booking" element={<DoctorBlockedBooking />} />
        <Route path="/doctor/availability" element={<DoctorAvailability />} />
        <Route path="/doctor/patients" element={<MyPatients />} />
        <Route path="/doctor/patients/:id" element={<PatientDetails />} />
        <Route path="/doctor/create-password" element={<DoctorCreatePassword />} />
        <Route path="/doctor/update-password" element={<DoctorUpdatePassword />} />
        <Route path="/doctor/password-success" element={<PasswordSuccess />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/forgot-password" element={<ForgotPassword />} />
        <Route path="/doctor/register" element={<DoctorRegistration />} />
        <Route path="/doctor/step-2" element={<DoctorRegistrationStep2 />} />
        <Route path="/doctor/step-3" element={<DoctorRegistrationStep3 />} />
        <Route path="/doctor/step-4" element={<DoctorRegistrationStep4 />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
}

export default App;
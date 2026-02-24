import { Routes, Route } from "react-router-dom";
import Home from "./pages/common/Home";
import ChooseYourPath from "./pages/common/ChooseYourPath";
import PatientReg from "./pages/patient/PatientReg";
import PatientLogin from "./pages/patient/PatientLogin";
import PatientForgotPassword from "./pages/patient/forgot-password/ForgotPassword";
import PatientDashboard from "./pages/patient-dashboard/PatientDashboard";
import Doctorreg from "./pages/doctor/DoctorRegistration";
import DoctorRegistrationStep2 from "./pages/doctor/DoctorRegistrationStep2";
import DoctorRegistrationStep3 from "./pages/doctor/DoctorRegistrationStep3";
import DoctorRegistrationStep4 from "./pages/doctor/DoctorRegistrationStep4";
import Verification from "./pages/common/Verification";
import DoctorLogin from './pages/doctor/DoctorLogin';
import ForgotPassword from "./pages/doctor/forgot-password/ForgotPassword";
import DoctorDashboard from "./pages/doctor-dashboard/DoctorDashboard";
import PatientOnboarding from "./pages/patient/onboarding/PatientOnboarding";
import PatientAppointments from "./pages/patient-dashboard/PatientAppointments";
import BookAppointment from "./pages/patient-dashboard/BookAppointment";
import PatientChat from "./pages/patient-dashboard/PatientChat";
import PatientProfile from "./pages/patient-dashboard/PatientProfile";
import PatientSettings from "./pages/patient-dashboard/PatientSettings";
import { Toaster } from 'sonner';

import PatientNotifications from "./pages/patient-dashboard/PatientNotifications";

import DoctorProfile from "./pages/doctor-dashboard/DoctorProfile";
import MyPatients from "./pages/doctor-dashboard/MyPatients";
import PatientDetails from "./pages/doctor-dashboard/PatientDetails";
import DoctorSettings from "./pages/doctor-dashboard/DoctorSettings";
import DoctorSchedule from "./pages/doctor-dashboard/DoctorSchedule";
import DoctorNotifications from "./pages/doctor-dashboard/DoctorNotifications";

// In your Routes

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/choose-path" element={<ChooseYourPath />} />
        <Route path="/patient-reg" element={<PatientReg />} />
        <Route path="/patient/onboarding" element={<PatientOnboarding />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/patient/forgot-password" element={<PatientForgotPassword />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/appointments" element={<PatientAppointments />} />
        <Route path="/patient/book-appointment" element={<BookAppointment />} />
        <Route path="/patient/chat" element={<PatientChat />} />
        <Route path="/patient/profile" element={<PatientProfile />} />
        <Route path="/patient/settings" element={<PatientSettings />} />
        <Route path="/patient/notifications" element={<PatientNotifications />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />
        <Route path="/doctor/notifications" element={<DoctorNotifications />} />
        <Route path="/doctor/schedule" element={<DoctorSchedule />} />
        <Route path="/doctor/patients" element={<MyPatients />} />
        <Route path="/doctor/patients/:id" element={<PatientDetails />} />
        <Route path="/doctor/settings" element={<DoctorSettings />} />
        <Route path="/doctor" element={<Doctorreg />} />
        <Route path="/doctor/step-2" element={<DoctorRegistrationStep2 />} />
        <Route path="/doctor/step-3" element={<DoctorRegistrationStep3 />} />
        <Route path="/doctor/step-4" element={<DoctorRegistrationStep4 />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
  );
}

export default App;
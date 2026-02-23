import { Routes, Route } from "react-router-dom";
import Home from "./pages/common/Home";
import ChooseYourPath from "./pages/common/ChooseYourPath";
import PatientReg from "./pages/patient/PatientReg";
import PatientLogin from "./pages/patient/PatientLogin";
import Doctorreg from "./pages/doctor/DoctorRegistration";
import DoctorRegistrationStep2 from "./pages/doctor/DoctorRegistrationStep2";
import DoctorRegistrationStep3 from "./pages/doctor/DoctorRegistrationStep3";
import Verification from "./pages/common/Verification";
import DoctorLogin from './pages/doctor/DoctorLogin';
import ForgotPassword from "./pages/doctor/forgot-password/ForgotPassword";
import GmailVerification from "./pages/doctor/forgot-password/GmailVerification";
import PasswordChange from "./pages/doctor/forgot-password/PasswordChange";
import DoctorDashboard from "./pages/doctor-dashboard/DoctorDashboard";
import { Toaster } from 'sonner';

// In your Routes

function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/choose-path" element={<ChooseYourPath />} />
        <Route path="/patient-reg" element={<PatientReg />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/doctor" element={<Doctorreg />} />
        <Route path="/doctor/step-2" element={<DoctorRegistrationStep2 />} />
        <Route path="/doctor/step-3" element={<DoctorRegistrationStep3 />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/forgot-password" element={<ForgotPassword />} />
        <Route path="/doctor/gmail-verification" element={<GmailVerification />} />
        <Route path="/doctor/password-change" element={<PasswordChange />} />
      </Routes>
    </>
  );
}

export default App;
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ChooseYourPath from "./pages/ChooseYourPath";
import PatientReg from "./pages/PatientReg";
import PatientLogin from "./pages/PatientLogin"; 
import Doctorreg from "./pages/DoctorRegistration";
import DoctorRegistrationStep2 from "./pages/DoctorRegistrationStep2";
import DoctorRegistrationStep3 from "./pages/DoctorRegistrationstep3";
import Verification from "./pages/Verification";
import DoctorLogin from './pages/DoctorLogin';

// In your Routes

function App() {
  return (
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
    </Routes>
  );
}

export default App;
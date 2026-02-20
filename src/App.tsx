import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ChooseYourPath from "./pages/ChooseYourPath";
import PatientReg from "./pages/PatientReg";
import PatientLogin from "./pages/PatientLogin"; 
import Doctorreg from "./pages/DoctorRegistration";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/choose-path" element={<ChooseYourPath />} />
      <Route path="/patient-reg" element={<PatientReg />} />
      <Route path="/patient-login" element={<PatientLogin />} />
      <Route path="/doctor" element={<Doctorreg />} />
      {/* Future routes */}
      {/* <Route path="/doctor-signup" element={<DoctorReg />} /> */}
    </Routes>
  );
}

export default App;

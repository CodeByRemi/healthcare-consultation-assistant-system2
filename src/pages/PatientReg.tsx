import AuthLayout from "../components/patientRegistration/AuthLayout";
import AuthSidebar from "../components/patientRegistration/AuthSidebar";
import AuthRegistration from "../components/patientRegistration/AuthRegistration";
import LoginNavbar from "../components/patientRegistration/LoginNavbar";

export default function PatientReg() {
  return (
    <>
      <LoginNavbar />
      <AuthLayout>
        <AuthSidebar />
        <AuthRegistration />
      </AuthLayout>
    </>
  );
}

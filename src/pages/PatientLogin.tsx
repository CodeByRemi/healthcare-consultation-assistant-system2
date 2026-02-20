import AuthLayout from "../components/patientRegistration/AuthLayout";
import AuthSidebar from "../components/patientRegistration/AuthSidebar";
import AuthLogin from "../components/patientRegistration/Loginform";
import LoginNavbar from "../components/patientRegistration/LoginNavbar";

export default function PatientLogin() {
  return (
    <>
      <LoginNavbar />
      <AuthLayout>
        <AuthSidebar />
        <AuthLogin />
      </AuthLayout>
    </>
  );
}

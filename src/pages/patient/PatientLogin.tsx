import AuthLayout from "../../features/patient-auth/components/AuthLayout";
import AuthSidebar from "../../features/patient-auth/components/AuthSidebar";
import AuthLogin from "../../features/patient-auth/components/Loginform";

export default function PatientLogin() {
  return (
    <AuthLayout>
      <AuthSidebar />
      <AuthLogin />
    </AuthLayout>
  );
}

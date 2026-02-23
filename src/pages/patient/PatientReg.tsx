import AuthLayout from "../../features/patient-auth/components/AuthLayout";
import AuthSidebar from "../../features/patient-auth/components/AuthSidebar";
import AuthRegistration from "../../features/patient-auth/components/AuthRegistration";

export default function PatientReg() {
  return (
    <AuthLayout>
      <AuthSidebar />
      <AuthRegistration />
    </AuthLayout>
  );
}

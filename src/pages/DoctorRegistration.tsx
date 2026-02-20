import PageLayout from "../components/DoctorRegistration/pageLayout";
import Header from "../components/DoctorRegistration/Header";
import Breadcrumbs from "../components/DoctorRegistration/Breadcrumbs";
import EnrollmentIntro from "../components/DoctorRegistration/enrollment";
import ProgressBar from "../components/DoctorRegistration/Progress";
import CredentialsForm from "../components/DoctorRegistration/Credentials";

export default function DoctorEnrollment() {
  return (
    <PageLayout>
      <Header />
      <Breadcrumbs />

      <div className="flex flex-col lg:flex-row gap-12">
        <EnrollmentIntro />
        <div className="flex-1">
          <ProgressBar />
          <CredentialsForm />
        </div>
      </div>
    </PageLayout>
  );
}

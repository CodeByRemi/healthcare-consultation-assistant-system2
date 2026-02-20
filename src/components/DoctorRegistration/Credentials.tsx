import Input from "../DoctorRegistration/Input";
import FileUpload from "../DoctorRegistration/Fileupload";

export default function CredentialsForm() {
  return (
    <div className="lg:w-2/3 bg-surface-dark border border-border-dark rounded-xl p-8">
      <Input
        label="Medical License Number"
        placeholder="Enter NPI or State License Number"
        icon="badge"
      />

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <Input label="Specialization" placeholder="Cardiology" />
        <Input
          label="Years in Practice"
          placeholder="e.g. 12"
          type="number"
        />
        <div></div>
      </div>

      <div className="mt-6">
        <Input
          label="Primary Hospital Affiliation"
          placeholder="Search for institution..."
          icon="local_hospital"
        />
      </div>

      <div className="mt-6">
        <label className="font-medium block mb-2">
          Board Certification Document
        </label>
        <FileUpload />
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-border-dark">
        <button type="button" className="text-text-muted hover:text-white flex items-center gap-1">
          ← Back to Personal Info
        </button>
        <button type="submit" className="bg-primary text-black px-8 py-3 rounded-lg font-bold">
          Submit Credentials →
        </button>
      </div>
    </div>
  );
}

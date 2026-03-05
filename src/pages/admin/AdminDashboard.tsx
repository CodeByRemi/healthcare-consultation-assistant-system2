import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Search, 
  Bell, 
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Stethoscope,
  X
} from "lucide-react";
import AdminSidebar from "./components/AdminSidebar";
import AdminMobileFooter from "./components/AdminMobileFooter";
import AdminSettings from "./AdminSettings";
import AdminProfilePage from "./AdminProfilePage";
import AdminNotifications from "./AdminNotifications";

export default function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showCreateDoctor, setShowCreateDoctor] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 relative overflow-hidden">
      <AdminSidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        isOpen={isSidebarOpen}
      />

      <main className="flex-1 overflow-y-auto w-full">
        
        {/* Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:inline-flex p-2 -ml-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <span className="sr-only">Toggle Sidebar</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-800 capitalize">{currentTab}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-800 focus:bg-white border border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all w-64 md:w-80"
              />
            </div>
            
            <button
              type="button"
              onClick={() => setCurrentTab("notifications")}
              className="relative p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            
            <button
              type="button"
              onClick={() => setCurrentTab("profile")}
              className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 hover:bg-blue-200 transition-colors"
            >
              A
            </button>
          </div>
        </motion.header>

        {/* Content */}
        <div className="p-6 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto">
          {currentTab === 'dashboard' && <DashboardOverview setShowCreateDoctor={setShowCreateDoctor} />}
          {currentTab === 'doctors' && <DoctorsListView setShowCreateDoctor={setShowCreateDoctor} />}
          {currentTab === 'patients' && <PatientsList />}
          {currentTab === 'appointments' && <AppointmentsList />}
          {currentTab === 'settings' && <AdminSettings />}
          {currentTab === 'notifications' && <AdminNotifications />}
          {currentTab === 'profile' && <AdminProfilePage />}
        </div>
      </main>

      <AdminMobileFooter currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Create Doctor Modal */}
      {showCreateDoctor && (
        <CreateDoctorModal onClose={() => setShowCreateDoctor(false)} />
      )}
    </div>
  );
}

const stats = [
  { label: "Total Doctors", value: "0", change: "0", trend: "neutral" },
  { label: "Total Patients", value: "0", change: "0", trend: "neutral" },
  { label: "Appointments", value: "0", change: "0", trend: "neutral" }
];

const doctorPlaceholders = [
  {
    id: "doctor-placeholder-1",
    name: "",
    specialization: "",
    email: "",
    phone: "",
    address: "",
    status: "",
    username: "",
    password: "",
    pastAppointments: "",
    presentAppointments: ""
  },
  {
    id: "doctor-placeholder-2",
    name: "",
    specialization: "",
    email: "",
    phone: "",
    address: "",
    status: "",
    username: "",
    password: "",
    pastAppointments: "",
    presentAppointments: ""
  }
];

const patientPlaceholders = [
  {
    id: "patient-placeholder-1",
    fullName: "",
    email: "",
    phoneNumber: "",
    patientId: "",
    address: "",
    bloodType: "",
    gender: "",
    dob: "",
    height: "",
    weight: "",
    allergies: "",
    conditions: "",
    medications: "",
    pastAppointments: "",
    presentAppointments: ""
  },
  {
    id: "patient-placeholder-2",
    fullName: "",
    email: "",
    phoneNumber: "",
    patientId: "",
    address: "",
    bloodType: "",
    gender: "",
    dob: "",
    height: "",
    weight: "",
    allergies: "",
    conditions: "",
    medications: "",
    pastAppointments: "",
    presentAppointments: ""
  }
];

const recentAppointments = [
  {
    id: "[Appointment ID]",
    date: "[Appointment Date]",
    time: "[Appointment Time]",
    patient: "[Patient Name]",
    doctor: "[Doctor Name]",
    status: "[Status]"
  },
  {
    id: "[Appointment ID]",
    date: "[Appointment Date]",
    time: "[Appointment Time]",
    patient: "[Patient Name]",
    doctor: "[Doctor Name]",
    status: "[Status]"
  },
  {
    id: "[Appointment ID]",
    date: "[Appointment Date]",
    time: "[Appointment Time]",
    patient: "[Patient Name]",
    doctor: "[Doctor Name]",
    status: "[Status]"
  }
];

function DashboardOverview({ setShowCreateDoctor }: { setShowCreateDoctor: (show: boolean) => void }) {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
              </div>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: `75%` }} 
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Recent Activity</h3>
            <button className="text-sm text-blue-600 hover:underline">View All</button>
          </div>
          <div className="divide-y divide-gray-100">
           <div className="p-8 text-center text-gray-400 text-sm">No recent activity</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
          <button 
            onClick={() => setShowCreateDoctor(true)}
            className="w-full py-3 px-4 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus size={18} />
            Create Doctor Account
          </button>
          <button className="w-full py-3 px-4 bg-gray-50 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
            <Search size={18} />
            View Appointments
          </button>
        </div>
      </div>
    </div>
  );
}

function DoctorsListView({ setShowCreateDoctor }: { setShowCreateDoctor: (show: boolean) => void }) {
  const [doctors, setDoctors] = useState(doctorPlaceholders);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);

  const selectedDoctor = doctors.find((doctor) => doctor.id === selectedDoctorId) ?? null;
  const editingDoctor = doctors.find((doctor) => doctor.id === editingDoctorId) ?? null;

  const handleSaveDoctorDetails = (updatedDoctor: (typeof doctorPlaceholders)[number]) => {
    setDoctors((prev) =>
      prev.map((doctor) => (doctor.id === updatedDoctor.id ? updatedDoctor : doctor))
    );
    setEditingDoctorId(null);
    toast.success("Doctor details saved successfully.");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Doctors Management</h2>
        <button 
          onClick={() => setShowCreateDoctor(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus size={18} />
          Add Doctor
        </button>
      </div>
      
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Platform Doctors</h3>
            <p className="text-sm text-gray-500 mt-1">Click a doctor card to view full information</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
            {doctors.length} Doctors
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {doctors.map((doctor) => (
            <button
              key={doctor.id}
              type="button"
              onClick={() => setSelectedDoctorId(doctor.id)}
              className="text-left rounded-xl border border-gray-200 bg-white p-4 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                  DR
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {doctor.status}
                </span>
              </div>
              <p className="mt-3 font-semibold text-gray-900">{doctor.name}</p>
              <p className="text-sm text-gray-500 mt-1">{doctor.specialization}</p>
              <p className="text-xs text-blue-600 font-medium mt-4">View details</p>
            </button>
          ))}
        </div>
      </div>

      {selectedDoctor && (
        <DoctorDetailsModal
          doctor={selectedDoctor}
          onEditDetails={() => setEditingDoctorId(selectedDoctor.id)}
          onClose={() => setSelectedDoctorId(null)}
        />
      )}

      {editingDoctor && (
        <EditDoctorDetailsModal
          doctor={editingDoctor}
          onClose={() => setEditingDoctorId(null)}
          onSave={handleSaveDoctorDetails}
        />
      )}
    </div>
  );
}

function DoctorDetailsModal({
  doctor,
  onEditDetails,
  onClose
}: {
  doctor: (typeof doctorPlaceholders)[number];
  onEditDetails: () => void;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Doctor Information</h3>
            <p className="text-sm text-gray-500 mt-1">Detailed profile and appointment history</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Close doctor details"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-gray-900">{doctor.name}</p>
              <p className="text-sm text-gray-600 mt-1">{doctor.specialization}</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-white text-gray-600 border border-gray-200">
              {doctor.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <InfoField label="Full Name" value={doctor.name} />
            <InfoField label="Specialization" value={doctor.specialization} />
            <InfoField label="Email" value={doctor.email} />
            <InfoField label="Phone" value={doctor.phone} />
            <InfoField label="Address" value={doctor.address} />
            <InfoField label="Status" value={doctor.status} />
            <InfoField label="Username" value={doctor.username} />
            <InfoField label="Password" value={doctor.password} />
            <InfoField label="Past Appointments" value={doctor.pastAppointments} />
            <InfoField label="Present Appointments" value={doctor.presentAppointments} />
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onEditDetails}
              className="w-full md:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Edit Details
            </button>
            <button
              type="button"
              onClick={() => navigate(`/admin/appointment-details?entity=doctor&id=${doctor.id}`)}
              className="w-full md:w-auto px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              View Appointment Details
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function EditDoctorDetailsModal({
  doctor,
  onSave,
  onClose
}: {
  doctor: (typeof doctorPlaceholders)[number];
  onSave: (doctor: (typeof doctorPlaceholders)[number]) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState(doctor);
  const [confirmPassword, setConfirmPassword] = useState(doctor.password);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full"
      >
        <div className="border-b border-gray-200 px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Edit Doctor Details</h3>
            <p className="text-sm text-gray-500 mt-1">{doctor.name || "Selected Doctor"}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Close edit credentials"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Past Appointments</label>
            <input
              type="text"
              name="pastAppointments"
              value={formData.pastAppointments}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Present Appointments</label>
            <input
              type="text"
              name="presentAppointments"
              value={formData.presentAppointments}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Save Details
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 font-medium text-gray-900">{value}</p>
    </div>
  );
}

function PatientsList() {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const selectedPatient =
    patientPlaceholders.find((patient) => patient.id === selectedPatientId) ?? null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Registered Patients</h3>
            <p className="text-sm text-gray-500 mt-1">Click a patient card to view profile information</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
            {patientPlaceholders.length} Patients
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {patientPlaceholders.map((patient) => (
            <button
              key={patient.id}
              type="button"
              onClick={() => setSelectedPatientId(patient.id)}
              className="text-left rounded-xl border border-gray-200 bg-white p-4 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                  PT
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {patient.patientId}
                </span>
              </div>
              <p className="mt-3 font-semibold text-gray-900">{patient.fullName}</p>
              <p className="text-sm text-gray-500 mt-1">{patient.email}</p>
              <p className="text-xs text-blue-600 font-medium mt-4">View details</p>
            </button>
          ))}
        </div>
      </div>

      {selectedPatient && (
        <PatientDetailsModal
          patient={selectedPatient}
          onClose={() => setSelectedPatientId(null)}
        />
      )}
    </div>
  );
}

function PatientDetailsModal({
  patient,
  onClose
}: {
  patient: (typeof patientPlaceholders)[number];
  onClose: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Patient Information</h3>
            <p className="text-sm text-gray-500 mt-1">Profile details based on patient profile fields</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="Close patient details"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <InfoField label="Full Name" value={patient.fullName} />
          <InfoField label="Email" value={patient.email} />
          <InfoField label="Phone Number" value={patient.phoneNumber} />
          <InfoField label="Patient ID" value={patient.patientId} />
          <InfoField label="Address" value={patient.address} />
          <InfoField label="Date of Birth" value={patient.dob} />
          <InfoField label="Blood Type" value={patient.bloodType} />
          <InfoField label="Gender" value={patient.gender} />
          <InfoField label="Height" value={patient.height} />
          <InfoField label="Weight" value={patient.weight} />
          <InfoField label="Known Allergies" value={patient.allergies} />
          <InfoField label="Conditions" value={patient.conditions} />
          <InfoField label="Medications" value={patient.medications} />
          <InfoField label="Past Appointments" value={patient.pastAppointments} />
          <InfoField label="Present Appointments" value={patient.presentAppointments} />
        </div>

        <div className="px-6 pb-6 pt-2">
          <button
            type="button"
            onClick={() => navigate(`/admin/appointment-details?entity=patient&id=${patient.id}`)}
            className="w-full md:w-auto px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View Appointment Details
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AppointmentsList() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-lg">Recent Appointments</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Appointment ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Appointment Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Time</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Doctor</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {recentAppointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-700">{appointment.id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{appointment.date}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{appointment.time}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{appointment.patient}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{appointment.doctor}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {appointment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CreateDoctorModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    specialization: "",
    password: "",
    confirmPassword: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateUsername = (firstName: string, lastName: string) => {
    const first = firstName.trim().toLowerCase().replace(/[^a-z0-9]/g, "") || "doctor";
    const last = lastName.trim().toLowerCase().replace(/[^a-z0-9]/g, "") || "user";
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    return `${first}.${last}${randomSuffix}`;
  };

  const generatePassword = () => {
    const randomPart = Math.random().toString(36).slice(-8);
    return `Dr@${randomPart}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedUsername = generateUsername(formData.firstName, formData.lastName);
    const generatedPassword = generatePassword();
    const doctorName = `${formData.firstName} ${formData.lastName}`.trim();

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      navigate("/admin/doctor-credentials", {
        state: {
          doctorEmail: formData.email,
          doctorName,
          username: generatedUsername,
          password: generatedPassword
        }
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Create Doctor Account</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address & Specialization */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main St, City"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select Specialization</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="neurology">Neurology</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="dermatology">Dermatology</option>
                  <option value="orthopedics">Orthopedics</option>
                </select>
              </div>
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 transition-colors"
            >
              {isSubmitting ? "Creating..." : "Create Doctor Account"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

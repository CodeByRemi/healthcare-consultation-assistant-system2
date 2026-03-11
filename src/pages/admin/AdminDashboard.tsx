import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Search, 
  Bell, 
  X,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Activity,
  AlertCircle,
  FileText
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../lib/firebase";
import AdminSidebar from "./components/AdminSidebar";
import AdminMobileFooter from "./components/AdminMobileFooter";
import AdminSettings from "./AdminSettings";
import AdminProfilePage from "./AdminProfilePage";
import AdminNotifications from "./AdminNotifications";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  username: string;
  password?: string;
  pastAppointments: string;
  presentAppointments: string;
  [key: string]: unknown;
}

interface Patient {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  patientId: string;
  address: string;
  bloodType: string;
  gender: string;
  dob: string;
  height: string;
  weight: string;
  allergies: string;
  conditions: string;
  medications: string;
  pastAppointments: string;
  presentAppointments: string;
  [key: string]: unknown;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  patientName: string;
  doctorName: string;
  status: string;
  type: string;
  notes: string;
  [key: string]: unknown; 
}

export default function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      if (!user) {
        toast.error("Please login to access the admin dashboard");
        navigate("/doctor/login"); // Redirect to login
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

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
          </div>
        </motion.header>

        {/* Content */}
        <div className="p-6 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto">
          {currentTab === 'dashboard' && <DashboardOverview />}
          {currentTab === 'doctors' && <DoctorsListView />}
          {currentTab === 'patients' && <PatientsList />}
          {currentTab === 'appointments' && <AppointmentsList />}
          {currentTab === 'settings' && <AdminSettings />}
          {currentTab === 'notifications' && <AdminNotifications />}
          {currentTab === 'profile' && <AdminProfilePage />}
        </div>
      </main>

      <AdminMobileFooter currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Create Doctor Modal */}
    </div>
  );
}









function DashboardOverview() {
  const [stats, setStats] = useState([
    { label: "Total Doctors", value: "0", change: "0", trend: "neutral" },
    { label: "Total Patients", value: "0", change: "0", trend: "neutral" },
    { label: "Appointments", value: "0", change: "0", trend: "neutral" }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const doctorsSnapshot = await getDocs(collection(db, "doctors"));
        const patientsSnapshot = await getDocs(collection(db, "patients"));
        const appointmentsSnapshot = await getDocs(collection(db, "appointments"));

        setStats([
          { label: "Total Doctors", value: doctorsSnapshot.size.toString(), change: "+0", trend: "neutral" },
          { label: "Total Patients", value: patientsSnapshot.size.toString(), change: "+0", trend: "neutral" },
          { label: "Appointments", value: appointmentsSnapshot.size.toString(), change: "+0", trend: "neutral" }
        ]);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

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
          <button className="w-full py-3 px-4 bg-gray-50 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
            <Search size={18} />
            View Appointments
          </button>
        </div>
      </div>
    </div>
  );
}

function DoctorsListView() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "doctors"));
        const doctorList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Ensure fields exist for display or provide defaults
          name: doc.data().fullName || "Unknown Doctor",
          specialization: doc.data().specialty || "General",
          status: doc.data().verificationStatus || "Pending",
          email: doc.data().email || "",
          phone: doc.data().phone || "",
          address: doc.data().address || "",
          username: doc.data().username || "",
          password: "", // Don't show password
          pastAppointments: "0", // Placeholder until connected
          presentAppointments: "0" // Placeholder until connected
        }));
        setDoctors(doctorList);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to load doctors");
      }
    };
    fetchDoctors();
  }, []);

  const selectedDoctor = doctors.find((doctor) => doctor.id === selectedDoctorId) ?? null;
  const editingDoctor = doctors.find((doctor) => doctor.id === editingDoctorId) ?? null;

  const handleSaveDoctorDetails = async (updatedDoctor: Doctor) => {
    // In a real app, update Firestore here
    setDoctors((prev) =>
      prev.map((doctor) => (doctor.id === updatedDoctor.id ? updatedDoctor : doctor))
    );
    setEditingDoctorId(null);
    toast.success("Doctor details saved successfully (UI only for now).");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Doctors Management</h2>
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
  doctor: Doctor;
  onEditDetails: () => void;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const [showSuspendConfirm, setShowSuspendConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <>
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
            <InfoField label="Password" value={doctor.password || "********"} />
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
            <button
              type="button"
              onClick={() => setShowSuspendConfirm(true)}
              className="w-full md:w-auto px-4 py-2 rounded-lg text-red-600 border border-red-200 bg-red-50 text-sm font-medium hover:bg-red-100 transition-colors"
            >
              Suspend Doctor
            </button>
          </div>
        </div>
      </motion.div>
    </div>

    {/* Confirmation Modal */}
    <AnimatePresence>
      {showSuspendConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full border border-gray-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Suspend Doctor?</h3>
              <p className="text-sm text-gray-500 mt-2">
                Are you sure you want to suspend <strong>{doctor.name}</strong>? They will no longer be able to access their account.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowSuspendConfirm(false)}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={isProcessing}
                onClick={() => {
                  setIsProcessing(true);
                  setTimeout(() => {
                    toast.success("Doctor suspended successfully", {
                      description: `${doctor.name} has been suspended.`
                    });
                    setIsProcessing(false);
                    setShowSuspendConfirm(false);
                    onClose(); 
                  }, 2000);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Suspending...
                  </>
                ) : (
                  "Yes, Suspend"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}

function EditDoctorDetailsModal({
  doctor,
  onSave,
  onClose
}: {
  doctor: Doctor;
  onSave: (doctor: Doctor) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<Doctor>(doctor);
  const [confirmPassword, setConfirmPassword] = useState(doctor.password || "");
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
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "patients"));
        const patientData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Ensure fields
          fullName: doc.data().fullName || "",
          email: doc.data().email || "",
          phoneNumber: doc.data().phone || "",
          patientId: doc.data().patientId || doc.id,
          address: doc.data().address || "",
          dob: doc.data().dob || "",
          gender: doc.data().gender || "",
          bloodType: doc.data().bloodType || "",
          height: doc.data().height || "",
          weight: doc.data().weight || "",
          allergies: doc.data().allergies || "",
          conditions: doc.data().conditions || "",
          medications: doc.data().medications || "",
          pastAppointments: "0", 
          presentAppointments: "0" 
        }));
        setPatients(patientData);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();
  }, []);

  const selectedPatient = patients.find((patient) => patient.id === selectedPatientId) ?? null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Registered Patients</h3>
            <p className="text-sm text-gray-500 mt-1">Click a patient card to view profile information</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
            {patients.length} Patients
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {patients.map((patient) => (
            <button
              key={patient.id}
              type="button"
              onClick={() => setSelectedPatientId(patient.id)}
              className="text-left rounded-xl b order border-gray-200 bg-white p-4 hover:border-blue-300 hover:shadow-md transition-all"
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
  patient: Patient;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <>
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

        <div className="px-6 pb-6 pt-2 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate(`/admin/appointment-details?entity=patient&id=${patient.id}`)}
            className="w-full md:w-auto px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View Appointment Details
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full md:w-auto px-4 py-2 rounded-lg text-red-600 border border-red-200 bg-red-50 text-sm font-medium hover:bg-red-100 transition-colors"
          >
            Delete User
          </button>
        </div>
      </motion.div>
    </div>

    {/* Confirmation Modal */}
    <AnimatePresence>
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full border border-gray-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete User?</h3>
              <p className="text-sm text-gray-500 mt-2">
                Are you sure you want to permanently delete <strong>{patient.fullName}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={isProcessing}
                onClick={() => {
                   setIsProcessing(true);
                   setTimeout(() => {
                    toast.success("User deleted successfully", {
                      description: `${patient.fullName} has been removed from the system.`
                    });
                    setIsProcessing(false);
                    setShowDeleteConfirm(false);
                    onClose(); 
                   }, 2000);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
              >
                 {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}

function AppointmentDetailsModal({
  appointment,
  onClose
}: {
  appointment: Appointment;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Appointment Details</h3>
            <p className="text-sm text-gray-500 mt-1">ID: {appointment.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Calendar size={16} />
                <span>Date</span>
              </div>
              <p className="font-medium text-gray-900">{appointment.date}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Clock size={16} />
                <span>Time</span>
              </div>
              <p className="font-medium text-gray-900">{appointment.time}</p>
            </div>
             <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <User size={16} />
                <span>Patient</span>
              </div>
              <p className="font-medium text-gray-900">{appointment.patientName}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Stethoscope size={16} />
                <span>Doctor</span>
              </div>
              <p className="font-medium text-gray-900">{appointment.doctorName}</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
             <div>
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <Activity size={16} className="text-blue-600" />
                Reason for Visit / Type
              </h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">
                {appointment.type}
              </p>
            </div>
            
            {appointment.notes && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <FileText size={16} className="text-blue-600" />
                  Additional Notes
                </h3>
                <p className="text-gray-600 text-sm italic">
                  "{appointment.notes}"
                </p>
              </div>
            )}
             
             <div>
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <AlertCircle size={16} className="text-blue-600" />
                  Status
                </h3>
                 <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium 
                    ${appointment.status === 'Completed' ? 'bg-green-50 text-green-700' : 
                      appointment.status === 'Cancelled' ? 'bg-red-50 text-red-700' : 
                      'bg-blue-50 text-blue-700'}`}>
                    {appointment.status}
                  </span>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "appointments"));
        const aptData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          date: doc.data().date || "N/A",
          time: doc.data().time || "N/A",
          patientName: doc.data().patientName || "Unknown",
          doctorName: doc.data().doctorName || "Unknown",
          status: doc.data().status || "Scheduled",
          type: doc.data().title || "Check-up",
          notes: doc.data().description || "",
          ...doc.data()
        })) as Appointment[];
        setAppointments(aptData);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <>
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-lg">Recent Appointments</h3>
         <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
            {appointments.length} Total
          </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Time</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Doctor</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
             {appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400 italic">
                    No appointments found
                  </td>
                </tr>
              ) : (
            appointments.map((appointment) => (
              <tr 
                key={appointment.id} 
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedAppointment(appointment)}
              >
                <td className="px-6 py-4 text-sm text-gray-700">{appointment.id.substring(0, 8)}...</td>
                <td className="px-6 py-4 text-sm text-gray-700">{appointment.date}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{appointment.time}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{appointment.patientName}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{appointment.doctorName}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium 
                    ${appointment.status === 'Completed' ? 'bg-green-50 text-green-700' : 
                      appointment.status === 'Cancelled' ? 'bg-red-50 text-red-700' : 
                      'bg-blue-50 text-blue-700'}`}>
                    {appointment.status}
                  </span>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    <AnimatePresence>
      {selectedAppointment && (
        <AppointmentDetailsModal 
          appointment={selectedAppointment} 
          onClose={() => setSelectedAppointment(null)} 
        />
      )}
    </AnimatePresence>
    </>
  );
}



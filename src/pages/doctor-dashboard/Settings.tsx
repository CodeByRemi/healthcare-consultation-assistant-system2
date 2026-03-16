import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Save,
  ArrowRight,
  Bell
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import DoctorMobileFooter from "./components/v2/DoctorMobileFooter";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { toast } from "sonner";

export default function DoctorSettings() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [doctorData, setDoctorData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    specialization: ""
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(doctorData);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      try {
        const docRef = doc(db, "doctors", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const loadedData = {
            fullName: data.fullName || data.name || "",
            email: data.email || currentUser.email || "",
            phone: data.phone || "",
            address: data.hospital || data.address || "", // Map hospital/address
            specialization: data.specialty || data.specialization || ""
          };
          setDoctorData(loadedData);
          setFormData(loadedData);
        }
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    try {
      const docRef = doc(db, "doctors", currentUser.uid);
      await updateDoc(docRef, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        hospital: formData.address, // Mapping address back to hospital depending on schema
        address: formData.address,
        specialty: formData.specialization,
        specialization: formData.specialization
      });
      setDoctorData(formData);
      setEditMode(false);
      toast.success("Profile saved successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save changes");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-['Manrope']">
      <DoctorSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <DoctorHeader 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
              <p className="text-slate-500">Manage your doctor profile and account settings</p>
            </header>

            <div className="space-y-8">
              {/* Profile Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-lg">Personal Information</h3>
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="p-6 space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    {editMode ? (
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0A6ED1]/20 focus:border-[#0A6ED1] transition-all"
                        />
                      </div>
                    ) : (
                      <p className={`font-medium py-2 ${doctorData.fullName ? 'text-slate-900' : 'text-slate-400 italic'}`}>
                        {doctorData.fullName || "Not specified"}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    {editMode ? (
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0A6ED1]/20 focus:border-[#0A6ED1] transition-all"
                        />
                      </div>
                    ) : (
                      <p className={`font-medium py-2 ${doctorData.email ? 'text-slate-900' : 'text-slate-400 italic'}`}>
                        {doctorData.email || "Not specified"}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                    {editMode ? (
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0A6ED1]/20 focus:border-[#0A6ED1] transition-all"
                        />
                      </div>
                    ) : (
                      <p className={`font-medium py-2 ${doctorData.phone ? 'text-slate-900' : 'text-slate-400 italic'}`}>
                        {doctorData.phone || "Not specified"}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                    {editMode ? (
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0A6ED1]/20 focus:border-[#0A6ED1] transition-all"
                        />
                      </div>
                    ) : (
                      <p className={`font-medium py-2 ${doctorData.address ? 'text-slate-900' : 'text-slate-400 italic'}`}>
                        {doctorData.address || "Not specified"}
                      </p>
                    )}
                  </div>

                  {/* Specialization */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Specialization</label>
                    {editMode ? (
                      <input 
                          type="text" 
                          name="specialization" 
                          value={formData.specialization} 
                          onChange={handleInputChange} 
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0A6ED1]/20 focus:border-[#0A6ED1] transition-all" 
                      />
                    ) : (
                      <p className={`font-medium py-2 ${doctorData.specialization ? 'text-slate-900' : 'text-slate-400 italic'}`}>
                        {doctorData.specialization || "Not specified"}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {editMode && (
                    <div className="flex gap-4 pt-6 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setEditMode(false);
                          setFormData(doctorData);
                        }}
                        className="flex-1 py-2 px-4 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="flex-1 py-2 px-4 bg-[#0A6ED1] text-white rounded-lg font-medium hover:bg-[#095bb0] transition-colors flex items-center justify-center gap-2"
                      >
                        <Save size={18} />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Security Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Lock size={20} className="text-[#0A6ED1]" />
                    Security
                  </h3>
                </div>

                <div className="p-6 space-y-5">
                  <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/50">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <p className="font-semibold text-slate-900">Password Management</p>
                        <p className="text-sm text-slate-500 mt-1">Create or update your doctor account password from one place.</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => navigate("/doctor/create-password")}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          <Lock size={16} />
                          Create Password
                        </button>
                        <button
                          onClick={() => navigate("/doctor/update-password")}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                        >
                          Update Password
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-slate-100">
                    <div>
                      <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-500">Add an extra layer of security</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium text-slate-900">Session Management</p>
                      <p className="text-sm text-slate-500">View and manage active sessions</p>
                    </div>
                    <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors">
                      Manage
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Notification Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Bell size={20} className="text-[#0A6ED1]" />
                    Notifications
                  </h3>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-slate-900">Appointment Reminders</p>
                      <p className="text-sm text-slate-500">Get notified before appointments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-slate-900">New Bookings</p>
                      <p className="text-sm text-slate-500">Notify when patients book appointments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <DoctorMobileFooter />
      </main>
    </div>
  );
}

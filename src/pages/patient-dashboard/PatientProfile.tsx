import { useState } from "react";
import PatientSidebar from "./components/PatientSidebar";
import PatientDashboardHeader from "./components/PatientDashboardHeader";
import { FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import PatientMobileFooter from "./components/PatientMobileFooter";

export default function PatientProfile() {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock data - would normally come from DB
  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    email: currentUser?.email || "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Health St, Medical City, NY 10001",
    bloodType: "O+",
    height: "180 cm",
    weight: "75 kg",
    dob: "1990-05-15",
    allergies: "Peanuts, Penicillin",
    chronicConditions: "None"
  });

  const handleSave = () => {
    // API call to save data would go here
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <PatientSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <PatientDashboardHeader 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">My Profile</h1>
              <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isEditing 
                    ? "bg-green-600 text-white hover:bg-green-700" 
                    : "bg-[#0A6ED1] text-white hover:bg-[#0860b8]"
                }`}
              >
                {isEditing ? <><FaSave /> Save Changes</> : <><FaEdit /> Edit Profile</>}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center mb-4 relative overflow-hidden group">
                  <FaUserCircle className="w-full h-full text-slate-300" />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <span>Change</span>
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-slate-800">{profileData.fullName}</h2>
                <p className="text-slate-500 mb-4">Patient ID: #PAT-2024-889</p>
                
                <div className="w-full space-y-3 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-3 text-slate-600">
                    <FaEnvelope className="text-[#0A6ED1]" />
                    <span className="text-sm truncate">{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <FaPhone className="text-[#0A6ED1]" />
                    <span className="text-sm">{profileData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <FaMapMarkerAlt className="text-[#0A6ED1]" />
                    <span className="text-sm">{profileData.address}</span>
                  </div>
                </div>
              </div>

              {/* Details Form */}
              <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-slate-100">Personal Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.fullName}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A6ED1]/20 disabled:text-slate-500 disabled:bg-slate-100"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Date of Birth</label>
                    <input 
                      type="date" 
                      value={profileData.dob}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({...profileData, dob: e.target.value})}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A6ED1]/20 disabled:text-slate-500 disabled:bg-slate-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Blood Type</label>
                    <select 
                      value={profileData.bloodType}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({...profileData, bloodType: e.target.value})}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A6ED1]/20 disabled:text-slate-500 disabled:bg-slate-100"
                    >
                      <option>A+</option><option>A-</option>
                      <option>B+</option><option>B-</option>
                      <option>AB+</option><option>AB-</option>
                      <option>O+</option><option>O-</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Height / Weight</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={profileData.height}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, height: e.target.value})}
                        className="w-1/2 p-3 bg-slate-50 border border-slate-200 rounded-xl disabled:bg-slate-100"
                      />
                      <input 
                        type="text" 
                        value={profileData.weight}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({...profileData, weight: e.target.value})}
                        className="w-1/2 p-3 bg-slate-50 border border-slate-200 rounded-xl disabled:bg-slate-100"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-slate-700">Known Allergies</label>
                    <textarea 
                      value={profileData.allergies}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({...profileData, allergies: e.target.value})}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A6ED1]/20 disabled:text-slate-500 disabled:bg-slate-100 resize-none h-24"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <PatientMobileFooter />
      </main>
    </div>
  );
}

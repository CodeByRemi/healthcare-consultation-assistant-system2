import { useState } from "react";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import { FaUserMd, FaMapMarkerAlt, FaEnvelope, FaPhone, FaGraduationCap } from "react-icons/fa";

export default function DoctorProfile() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "Dr. Sarah Smith",
    specialty: "Cardiologist",
    email: "dr.smith@medicare.com",
    phone: "+1 (555) 987-6543",
    location: "New York, NY",
    bio: "Dr. Smith is a board-certified cardiologist with over 15 years of experience treating complex heart conditions.",
    education: "MD from Harvard Medical School, Residency at Johns Hopkins",
    experience: "15 Years",
    languages: "English, Spanish"
  });

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
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Doctor Profile</h1>
                <p className="text-slate-500">Manage your professional information.</p>
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`px-6 py-2 rounded-xl font-semibold transition-colors ${
                  isEditing 
                  ? "bg-green-600 text-white hover:bg-green-700" 
                  : "bg-[#0A6ED1] text-white hover:bg-[#095bb0]"
                }`}
              >
                {isEditing ? "Save Changes" : "Edit Profile"}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Photo & Basic Info */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
                  <div className="w-32 h-32 mx-auto bg-blue-50 rounded-full flex items-center justify-center text-[#0A6ED1] mb-4 text-4xl border-4 border-blue-100">
                    <FaUserMd />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{profileData.name}</h2>
                  <p className="text-[#0A6ED1] font-medium mb-4">{profileData.specialty}</p>
                  
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                      <FaEnvelope className="text-slate-400 w-4 h-4" />
                      <span className="truncate">{profileData.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                      <FaPhone className="text-slate-400 w-4 h-4" />
                      <span>{profileData.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                      <FaMapMarkerAlt className="text-slate-400 w-4 h-4" />
                      <span>{profileData.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Detailed Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Professional Bio</h3>
                  {isEditing ? (
                    <textarea 
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A6ED1]/20 focus:border-[#0A6ED1] outline-none min-h-30"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    />
                  ) : (
                    <p className="text-slate-600 leading-relaxed">
                      {profileData.bio}
                    </p>
                  )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FaGraduationCap className="text-[#0A6ED1]" />
                    Education & Credentials
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Education</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          className="w-full p-2 border border-slate-200 rounded-lg outline-none"
                          value={profileData.education}
                          onChange={(e) => setProfileData({...profileData, education: e.target.value})}
                        />
                      ) : (
                        <div className="text-slate-900 font-medium">{profileData.education}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Experience</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          className="w-full p-2 border border-slate-200 rounded-lg outline-none"
                          value={profileData.experience}
                          onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                        />
                      ) : (
                        <div className="text-slate-900 font-medium">{profileData.experience}</div>
                      )}
                    </div>
                     <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Languages</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          className="w-full p-2 border border-slate-200 rounded-lg outline-none"
                          value={profileData.languages}
                          onChange={(e) => setProfileData({...profileData, languages: e.target.value})}
                        />
                      ) : (
                        <div className="text-slate-900 font-medium">{profileData.languages}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

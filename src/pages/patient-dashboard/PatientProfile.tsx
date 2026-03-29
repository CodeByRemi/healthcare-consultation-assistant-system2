import { useState, useEffect } from "react";
import PatientSidebar from "./components/PatientSidebar";
import PatientDashboardHeader from "./components/PatientDashboardHeader";
import { FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import PatientMobileFooter from "./components/PatientMobileFooter";
import { toast } from "sonner";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";


export default function PatientProfile() {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    patientId: "",
    address: "",
    bloodGroup: "",
    gender: "",
    dob: "",
    bloodType: "", // Added missing field
    height: "", // Added missing field
    weight: "", // Added missing field
    allergies: "",
    conditions: "",
    medications: ""
  });

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, "patients", currentUser.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            let pId = data.patientId;
            if (!pId) {
              pId = `PT-${Math.floor(10000 + Math.random() * 90000)}`;
              await updateDoc(docRef, { patientId: pId });
            }
            setProfileData(prev => ({
                ...prev,
                ...data,
                patientId: pId
            }));
          } else {
            // Fix: Create the document for legacy accounts so "ID Loading..." doesn't hang forever
            const newId = `PT-${Math.floor(10000 + Math.random() * 90000)}`;
            const newData = {
              patientId: newId,
              email: currentUser.email || "",
              createdAt: new Date().toISOString()
            };
            await setDoc(docRef, newData);
            setProfileData(prev => ({
              ...prev,
              ...newData
            }));
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    fetchData();
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!currentUser) return;
    try {
      const docRef = doc(db, "patients", currentUser.uid);
      await updateDoc(docRef, {
        ...profileData,
        updatedAt: new Date().toISOString()
      });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save changes.");
    }
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
                onClick={() => {
                   if(isEditing) {
                       handleSave();
                   } else {
                       setIsEditing(true);
                       toast.info("Edit mode enabled");
                   }
                }}
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
                <h2 className="text-xl font-bold text-slate-800">{profileData.fullName || "Your Name"}</h2>
                <p className="text-slate-500 mb-4 px-3 py-1 bg-slate-100 rounded-full text-xs font-medium">
                  {profileData.patientId || "ID Loading..."}
                </p>
                
                <div className="w-full space-y-3 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-3 text-slate-600">
                    <FaEnvelope className="text-[#0A6ED1]" />
                    <span className="text-sm truncate">{profileData.email || "email@example.com"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <FaPhone className="text-[#0A6ED1]" />
                    {isEditing ? (
                        <input className="border rounded p-1 text-sm w-full" name="phoneNumber" value={profileData.phoneNumber} onChange={handleChange} />
                    ) : (
                        <span className="text-sm">{profileData.phoneNumber || "Phone Number"}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <FaMapMarkerAlt className="text-[#0A6ED1]" />
                    {isEditing ? (
                        <input className="border rounded p-1 text-sm w-full" name="address" value={profileData.address} onChange={handleChange} />
                    ) : (
                        <span className="text-sm">{profileData.address || "Address"}</span>
                    )}
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
                      max="2026-12-31"
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

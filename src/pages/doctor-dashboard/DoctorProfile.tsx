import { useState, useEffect } from "react";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import { FaUserMd, FaMapMarkerAlt, FaEnvelope, FaPhone, FaGraduationCap, FaHospital, FaBriefcase, FaAward, FaEdit, FaSave } from "react-icons/fa";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function DoctorProfile() {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    fullName: "",
    specialty: "",
    email: "",
    phone: "",
    hospital: "",
    bio: "",
    school: "",
    experience: "",
    languages: "",
    certifications: "",
    profilePhotoUrl: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      try {
        const docRef = doc(db, "doctors", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData({
            fullName: data.fullName || "",
            specialty: data.specialty || "",
            email: data.email || currentUser.email || "",
            phone: data.phone || "",
            hospital: data.hospital || "",
            bio: data.bio || "",
            school: data.school || "",
            experience: data.experience || "",
            languages: data.languages || "",
            certifications: data.certifications || "",
            profilePhotoUrl: data.profilePhotoUrl || ""
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
     if (!currentUser) return;
     try {
       const docRef = doc(db, "doctors", currentUser.uid);
       await updateDoc(docRef, {
         fullName: profileData.fullName,
         specialty: profileData.specialty,
         phone: profileData.phone,
         hospital: profileData.hospital,
         bio: profileData.bio,
         school: profileData.school,
         experience: profileData.experience,
         languages: profileData.languages,
         certifications: profileData.certifications
       });
       setIsEditing(false);
       toast.success("Profile saved successfully!");
     } catch (error) {
       console.error("Error updating profile:", error);
       toast.error("Failed to save changes.");
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
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-['Newsreader']">Doctor Profile</h1>
                <p className="text-slate-500">Manage your professional information and public appearance.</p>
              </div>
              <button 
                onClick={() => {
                    if (isEditing) {
                        handleSave();
                    } else {
                        setIsEditing(true);
                    }
                }}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all shadow-sm flex items-center gap-2 ${
                  isEditing 
                  ? "bg-green-600 text-white hover:bg-green-700 hover:shadow-green-200" 
                  : "bg-[#0A6ED1] text-white hover:bg-[#095bb0] hover:shadow-blue-200"
                }`}
              >
                {isEditing ? <><FaSave /> Save Changes</> : <><FaEdit /> Edit Profile</>}
              </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A6ED1]"></div>
                </div>
            ) : (

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Photo & Basic Info */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center relative overflow-hidden group">
                  <div className="absolute top-0 w-full h-24 bg-blue-50 z-0"></div>
                  
                  <div className="relative z-10 w-32 h-32 mx-auto rounded-full p-1 bg-white shadow-md mb-4 mt-8">
                     {profileData.profilePhotoUrl ? (
                        <img src={profileData.profilePhotoUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
                     ) : (
                        <div className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center text-[#0A6ED1] text-4xl">
                           <FaUserMd />
                        </div>
                     )}
                  </div>
                  
                  {isEditing ? (
                      <div className="w-full space-y-3">
                          <input 
                            name="fullName"
                            value={profileData.fullName}
                            onChange={handleChange}
                            className="w-full text-center font-bold text-slate-900 border-b border-slate-200 focus:border-[#0A6ED1] outline-none py-1"
                            placeholder="Full Name"
                          />
                          <input 
                            name="specialty"
                            value={profileData.specialty}
                            onChange={handleChange}
                            className="w-full text-center text-[#0A6ED1] font-medium border-b border-slate-200 focus:border-[#0A6ED1] outline-none py-1"
                            placeholder="Specialty"
                          />
                      </div>
                  ) : (
                      <>
                        <h2 className="text-xl font-bold text-slate-900">{profileData.fullName || "Doctor Name"}</h2>
                        <p className="text-[#0A6ED1] font-medium mb-4">{profileData.specialty || "Specialty"}</p>
                      </>
                  )}
                  
                  <div className="w-full mt-6 space-y-4 text-left">
                    <div className="flex items-center gap-3 text-slate-600 text-sm p-3 bg-slate-50 rounded-xl">
                      <FaEnvelope className="text-[#0A6ED1] w-4 h-4 shrink-0" />
                      <span className="truncate">{profileData.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 text-sm p-3 bg-slate-50 rounded-xl">
                      <FaPhone className="text-[#0A6ED1] w-4 h-4 shrink-0" />
                       {isEditing ? (
                           <input 
                             name="phone"
                             value={profileData.phone}
                             onChange={handleChange}
                             className="bg-transparent w-full outline-none"
                             placeholder="Phone Number"
                           />
                       ) : (
                           <span>{profileData.phone || "No phone added"}</span>
                       )}
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 text-sm p-3 bg-slate-50 rounded-xl">
                      <FaHospital className="text-[#0A6ED1] w-4 h-4 shrink-0" />
                       {isEditing ? (
                           <input 
                             name="hospital"
                             value={profileData.hospital}
                             onChange={handleChange}
                             className="bg-transparent w-full outline-none"
                             placeholder="Hospital/Clinic"
                           />
                       ) : (
                           <span>{profileData.hospital || "No hospital added"}</span>
                       )}
                    </div>
                  </div>
                </div>

                <div className="bg-[#0A6ED1] rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
                    <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-2">Availability Status</h3>
                        {/* Placeholder for availability toggle - can be implemented later */}
                        <div className="flex items-center gap-2">
                             <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                             <span className="font-medium">Accepting Patients</span>
                        </div>
                    </div>
                    <FaMapMarkerAlt className="absolute -bottom-4 -right-4 text-white/10 w-32 h-32" />
                </div>
              </div>

              {/* Right Column - Detailed Info */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Bio Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-50 text-[#0A6ED1] rounded-lg">
                          <FaUserMd />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Professional Bio</h3>
                  </div>
                  
                  {isEditing ? (
                      <textarea 
                        name="bio"
                        value={profileData.bio}
                        onChange={handleChange}
                        className="w-full min-h-[150px] p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-slate-600 leading-relaxed"
                        placeholder="Tell patients about your background and approach..."
                      />
                  ) : (
                      <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {profileData.bio || "No biography provided yet. Click 'Edit Profile' to add details about yourself."}
                      </p>
                  )}
                </div>

                {/* Experience & Education */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <FaBriefcase />
                            </div>
                            <h3 className="font-bold text-slate-900">Experience</h3>
                        </div>
                        {isEditing ? (
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-400 uppercase">Years</label>
                                <input 
                                    name="experience"
                                    value={profileData.experience}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-slate-200 rounded-lg outline-none"
                                    placeholder="e.g. 10 years"
                                />
                            </div>
                        ) : (
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{profileData.experience || "0"} <span className="text-sm font-normal text-slate-500">Years</span></p>
                                <p className="text-sm text-slate-500 mt-1">Medical Practice</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                         <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                <FaGraduationCap />
                            </div>
                            <h3 className="font-bold text-slate-900">Education</h3>
                        </div>
                        {isEditing ? (
                             <input 
                                name="school"
                                value={profileData.school}
                                onChange={handleChange}
                                className="w-full p-2 border border-slate-200 rounded-lg outline-none"
                                placeholder="Medical School"
                            />
                        ) : (
                            <p className="text-slate-800 font-medium">{profileData.school || "Not specified"}</p>
                        )}
                    </div>
                </div>

                 {/* Certifications */}
                 <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                     <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                                <FaAward />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Certifications</h3>
                    </div>
                    {isEditing ? (
                        <textarea 
                            name="certifications"
                            value={profileData.certifications}
                            onChange={handleChange}
                            className="w-full p-4 border border-slate-200 rounded-xl outline-none"
                            placeholder="List your certifications..."
                        />
                    ) : (
                        <p className="text-slate-600 whitespace-pre-wrap">{profileData.certifications || "No certifications listed."}</p>
                    )}
                 </div>

              </div>
            </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

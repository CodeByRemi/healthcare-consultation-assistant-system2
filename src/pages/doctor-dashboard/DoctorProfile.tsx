import { useState, useEffect } from "react";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import DoctorMobileFooter from "./components/v2/DoctorMobileFooter";
import DoctorPageTransition from "./components/v2/DoctorPageTransition";
import { FaUserMd, FaMapMarkerAlt, FaEnvelope, FaPhone, FaGraduationCap, FaHospital, FaBriefcase, FaAward, FaEdit, FaSave, FaClock, FaCamera } from "react-icons/fa";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../lib/firebase";

export default function DoctorProfile() {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

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
    profilePhotoUrl: "",
    availability: "",
    availableDays: [] as string[]
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
            profilePhotoUrl: data.profilePhotoUrl || "",
            availability: data.availability || "",
            availableDays: data.availableDays || []
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

  const handleAvailableDaysChange = (day: string) => {
      const days = [...(profileData.availableDays || [])];
      if (days.includes(day)) {
          setProfileData({ ...profileData, availableDays: days.filter(d => d !== day) });
      } else {
          setProfileData({ ...profileData, availableDays: [...days, day] });
      }
  };

  const dayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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
         certifications: profileData.certifications,
         availability: profileData.availability,
         availableDays: profileData.availableDays
       });
       setIsEditing(false);
       toast.success("Profile saved successfully!");
     } catch (error) {
       console.error("Error updating profile:", error);
       toast.error("Failed to save changes.");
     }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `doctors/${currentUser.uid}/profile_${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        () => {
          // You can track progress here if needed
        },
        (error) => {
          console.error("Upload error:", error);
          toast.error("Failed to upload image");
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Update local state immediately
          setProfileData(prev => ({ ...prev, profilePhotoUrl: downloadURL }));
          
          // Update Firestore immediately as well (independent of Save button)
          const docRef = doc(db, "doctors", currentUser.uid);
          await updateDoc(docRef, { profilePhotoUrl: downloadURL });
          
          setIsUploading(false);
          toast.success("Profile photo updated!");
        }
      );
    } catch (error) {
      console.error("Error setting up upload:", error);
      setIsUploading(false);
      toast.error("Something went wrong with the upload");
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
          <DoctorPageTransition className="max-w-5xl mx-auto">
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
                     {(profileData.profilePhotoUrl || isUploading) ? (
                        <>
                            <img 
                                src={profileData.profilePhotoUrl || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
                                alt="Profile" 
                                className={`w-full h-full rounded-full object-cover ${isUploading ? 'opacity-50' : ''}`} 
                            />
                            {isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A6ED1]"></div>
                                </div>
                            )}
                        </>
                     ) : (
                        <div className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center text-[#0A6ED1] text-4xl">
                           <FaUserMd />
                        </div>
                     )}

                     {/* Upload Button Overlay */}
                     {isEditing && (
                         <label className="absolute bottom-0 right-0 p-2 bg-[#0A6ED1] text-white rounded-full cursor-pointer hover:bg-[#095bb0] shadow-md transition-all">
                             <FaCamera className="w-4 h-4" />
                             <input 
                                 type="file" 
                                 className="hidden" 
                                 accept="image/*"
                                 onChange={handleImageUpload}
                                 disabled={isUploading}
                             />
                         </label>
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
                        className="w-full min-h-37.5 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-slate-600 leading-relaxed"
                        placeholder="Tell patients about your background and approach..."
                      />
                  ) : (
                      <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {profileData.bio || "No biography provided yet. Click 'Edit Profile' to add details about yourself."}
                      </p>
                  )}
                </div>

                {/* Availability Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                          <FaClock />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Availability</h3>
                  </div>

                  {isEditing ? (
                      <div className="space-y-6">
                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-3">Available Days</label>
                              <div className="flex flex-wrap gap-2">
                                  {dayOptions.map(day => (
                                      <button
                                          key={day}
                                          onClick={() => handleAvailableDaysChange(day)}
                                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                                              (profileData.availableDays || []).includes(day)
                                              ? "bg-[#0A6ED1] text-white border-[#0A6ED1]"
                                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                          }`}
                                      >
                                          {day}
                                      </button>
                                  ))}
                              </div>
                          </div>

                          <div>
                              <label className="text-xs font-bold text-slate-500 uppercase block mb-3">Time Range (e.g., 09:00 AM - 05:00 PM)</label>
                              <input 
                                name="availability"
                                value={profileData.availability}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent outline-none text-slate-700"
                                placeholder="Enter time range..."
                              />
                          </div>
                      </div>
                  ) : (
                      <div className="space-y-4">
                          <div className="flex items-center gap-3">
                              <span className="text-slate-500 font-medium w-24">Days:</span>
                              <div className="flex flex-wrap gap-2">
                                  {profileData.availableDays && profileData.availableDays.length > 0 ? (
                                      profileData.availableDays.map(day => (
                                          <span key={day} className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100">
                                              {day}
                                          </span>
                                      ))
                                  ) : (
                                      <span className="text-slate-400 italic">No specific days set</span>
                                  )}
                              </div>
                          </div>
                          <div className="flex items-center gap-3">
                              <span className="text-slate-500 font-medium w-24">Hours:</span>
                              <span className="text-slate-800 font-bold">{profileData.availability || "Not specified"}</span>
                          </div>
                      </div>
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
          </DoctorPageTransition>
        </div>

        <DoctorMobileFooter />
      </main>
    </div>
  );
}

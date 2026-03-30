  import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import DoctorMobileFooter from "./components/v2/DoctorMobileFooter";
import DoctorPageTransition from "./components/v2/DoctorPageTransition";
import { FaUserMd, FaBell, FaCalendarAlt, FaToggleOn, FaToggleOff, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { db } from "../../lib/firebase";
import { toast } from "sonner";

export default function DoctorSettings() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("availability");

  const [settings, setSettings] = useState({
    acceptingPatients: true,
    telemedicine: true,
    emailAlerts: true,
    smsAlerts: false
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!currentUser) return;
      try {
        const docRef = doc(db, "doctors", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.settings) {
            setSettings(prev => ({ ...prev, ...data.settings }));
          }
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, [currentUser]);

  const toggleSetting = async (key: keyof typeof settings) => {
    const newValue = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newValue }));
    
    if (!currentUser) return;
    
    try {
      const docRef = doc(db, "doctors", currentUser.uid);
      await updateDoc(docRef, {
        [`settings.${key}`]: newValue
      });
      toast.success("Setting updated");
    } catch (error) {
      console.error("Error updating setting:", error);
      toast.error("Failed to update setting");
      // Revert on failure
      setSettings(prev => ({ ...prev, [key]: !newValue }));
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentUser.email) return;

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      
      toast.success("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error updating password:", error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        toast.error("Incorrect current password.");
      } else {
        toast.error(error.message || "Failed to update password.");
      }
    } finally {
      setIsUpdatingPassword(false);
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
          <DoctorPageTransition className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Settings</h1>

            <div className="flex gap-6 flex-col md:flex-row">

              <div className="w-full md:w-64 space-y-2">
                <button 
                  onClick={() => setActiveTab("availability")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-medium flex items-center gap-3 ${activeTab === "availability" ? "bg-[#0A6ED1] text-white shadow-lg shadow-blue-500/20" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                >
                  <FaCalendarAlt /> Availability
                </button>
                <button 
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-medium flex items-center gap-3 ${activeTab === "notifications" ? "bg-[#0A6ED1] text-white shadow-lg shadow-blue-500/20" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                >
                  <FaBell /> Notifications
                </button>
                 <button 
                  onClick={() => setActiveTab("account")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors font-medium flex items-center gap-3 ${activeTab === "account" ? "bg-[#0A6ED1] text-white shadow-lg shadow-blue-500/20" : "bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"}`}
                >
                  <FaUserMd /> Account
                </button>
                
                <div className="pt-4 mt-4 border-t border-slate-200">
                  <button 
                    onClick={async () => {
                      try {
                        const maybeLogout = (currentUser as unknown) as { logout?: () => Promise<void> };
                        if (maybeLogout?.logout) {
                            await maybeLogout.logout();
                        } else if (logout) {
                            await logout();
                        }
                        toast.success("Logged out successfully");
                        navigate("/doctor/login");
                      } catch (error) {
                        console.error(error);
                        toast.error("Failed to log out");
                      }
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl transition-colors font-medium flex items-center gap-3 text-rose-600 hover:bg-rose-50"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">
                {activeTab === "account" && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Account Settings</h2>
                        
                        <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600">
                             <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Profile Information</h3>
                             <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Manage your public profile, contact details, and professional information.</p>
                             <Link to="/doctor/profile" className="px-4 py-2 bg-[#0A6ED1] text-white border border-transparent rounded-lg text-sm font-medium hover:bg-[#0958a8] transition-colors inline-block mb-2">
                                Edit Profile
                             </Link>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600">
                             <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Password</h3>
                             <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Update your password to keep your account secure.</p>
                             <form onSubmit={handleUpdatePassword} className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                                  <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A6ED1]"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                                  <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A6ED1]"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                                  <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A6ED1]"
                                    required
                                  />
                                </div>
                                <button
                                  type="submit"
                                  disabled={isUpdatingPassword}
                                  className="px-4 py-2 bg-[#0A6ED1] text-white border border-transparent rounded-lg text-sm font-medium hover:bg-[#0958a8] transition-colors disabled:opacity-50"
                                >
                                  {isUpdatingPassword ? "Updating..." : "Update Password"}
                                </button>
                             </form>
                        </div>

                        <button 
                            onClick={async () => {
                                try {
                                    const maybeLogout = (currentUser as unknown) as { logout?: () => Promise<void> };
                                    if (maybeLogout?.logout) {
                                        await maybeLogout.logout();
                                    } else if (logout) {
                                        await logout();
                                    }
                                    toast.success("Logged out successfully");
                                    navigate("/doctor/login");
                                } catch (error) {
                                    console.error(error);
                                    toast.error("Failed to log out");
                                }
                            }}
                            className="md:hidden w-full p-4 bg-rose-50 border border-rose-200 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-colors shadow-sm flex items-center justify-center gap-2 mt-6"
                        >
                            <FaSignOutAlt /> Log Out
                        </button>
                    </div>
                )}

                {activeTab === "availability" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Availability Settings</h2>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <div className="font-semibold text-slate-900">Accepting New Patients</div>
                        <div className="text-sm text-slate-500">Allow patients to book new appointments with you.</div>
                      </div>
                      <button onClick={() => toggleSetting('acceptingPatients')} className={`text-2xl ${settings.acceptingPatients ? "text-[#0A6ED1]" : "text-slate-300"}`}>
                        {settings.acceptingPatients ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <div className="font-semibold text-slate-900">Enable Telemedicine</div>
                        <div className="text-sm text-slate-500">Offer remote video consultations.</div>
                      </div>
                      <button onClick={() => toggleSetting('telemedicine')} className={`text-2xl ${settings.telemedicine ? "text-[#0A6ED1]" : "text-slate-300"}`}>
                        {settings.telemedicine ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                   <div className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Notification Preferences</h2>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <div className="font-semibold text-slate-900">Email Alerts</div>
                        <div className="text-sm text-slate-500">Receive summaries of daily appointments.</div>
                      </div>
                      <button onClick={() => toggleSetting('emailAlerts')} className={`text-2xl ${settings.emailAlerts ? "text-[#0A6ED1]" : "text-slate-300"}`}>
                        {settings.emailAlerts ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </div>
                   </div>
                )}
              </div>
            </div>
          </DoctorPageTransition>
        </div>

        <DoctorMobileFooter />
      </main>
    </div>
  );
}

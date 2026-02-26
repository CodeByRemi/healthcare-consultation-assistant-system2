import { useState } from "react";
import { Link } from "react-router-dom";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import { FaUserMd, FaBell, FaCalendarAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

export default function DoctorSettings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("availability");

  const [settings, setSettings] = useState({
    acceptingPatients: true,
    telemedicine: true,
    emailAlerts: true,
    smsAlerts: false
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
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
              </div>

              <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">
                {activeTab === "account" && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Account Settings</h2>
                        <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600">
                             <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Password</h3>
                             <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Update your password to keep your account secure.</p>
                             <Link to="/update-password" className="px-4 py-2 bg-white dark:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-500 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-500 transition-colors">
                                Change Password
                             </Link>
                        </div>
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
          </div>
        </div>
      </main>
    </div>
  );
}

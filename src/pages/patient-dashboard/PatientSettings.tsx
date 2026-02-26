import { useState } from "react";
import { Link } from "react-router-dom";
import PatientSidebar from "./components/PatientSidebar";
import PatientDashboardHeader from "./components/PatientDashboardHeader";
import PatientMobileFooter from "./components/PatientMobileFooter";
import { 
  FaUserCog, 
  FaBell, 
  FaLock, 
  FaShieldAlt, 
  FaMoon, 
  FaGlobe, 
  FaChevronRight,
  FaToggleOn,
  FaToggleOff 
} from "react-icons/fa";

export default function PatientSettings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("account");

  // Mock Settings State
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false,
    twoFactorAuth: true,
    publicProfile: false,
    language: "English (US)"
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { id: "account", label: "Account", icon: FaUserCog },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "security", label: "Security", icon: FaLock },
    { id: "privacy", label: "Privacy", icon: FaShieldAlt },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <PatientSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <PatientDashboardHeader 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Settings</h1>
              <p className="text-slate-500">Manage your account preferences and security settings.</p>
            </header>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Settings Navigation */}
              <nav className="w-full md:w-64 shrink-0">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between p-4 text-left transition-colors border-l-4 ${
                        activeTab === tab.id 
                          ? "bg-slate-50 border-[#0A6ED1] text-[#0A6ED1]" 
                          : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-[#0A6ED1]" : "text-slate-400"}`} />
                        <span className="font-medium">{tab.label}</span>
                      </div>
                      <FaChevronRight className={`w-4 h-4 ${activeTab === tab.id ? "opacity-100" : "opacity-0"}`} />
                    </button>
                  ))}
                </div>
              </nav>

              {/* Settings Content */}
              <div className="flex-1">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  
                  {/* Account Settings */}
                  {activeTab === "account" && (
                    <div className="space-y-8">
                       <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Password</h3>
                          <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">Update your password to keep your account secure.</p>
                          <Link 
                            to="/update-password" 
                            className="inline-flex px-4 py-2 bg-white dark:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-500 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-500 transition-colors"
                          >
                            Change Password
                          </Link>
                       </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Account Preferences</h2>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0A6ED1]">
                                <FaGlobe />
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">Language</div>
                                <div className="text-sm text-slate-500">{settings.language}</div>
                              </div>
                            </div>
                            <button className="text-sm font-medium text-[#0A6ED1] hover:underline">Change</button>
                          </div>

                          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                <FaMoon />
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">Dark Mode</div>
                                <div className="text-sm text-slate-500">Adjust the appearance of the app</div>
                              </div>
                            </div>
                            <button 
                              onClick={() => toggleSetting('darkMode')}
                              className={`text-2xl transition-colors ${settings.darkMode ? "text-[#0A6ED1]" : "text-slate-300"}`}
                            >
                              {settings.darkMode ? <FaToggleOn /> : <FaToggleOff />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-100">
                        <h3 className="font-bold text-red-600 mb-4">Danger Zone</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-slate-900">Delete Account</div>
                            <div className="text-sm text-slate-500">Permanently remove your account and all data</div>
                          </div>
                          <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors">
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notification Settings */}
                  {activeTab === "notifications" && (
                    <div className="space-y-6">
                       <h2 className="text-xl font-bold text-slate-900 mb-4">Notification Preferences</h2>
                       
                       <div className="space-y-4">
                          <div className="flex items-center justify-between py-4 border-b border-slate-50">
                            <div>
                              <div className="font-semibold text-slate-900">Email Notifications</div>
                              <div className="text-sm text-slate-500">Receive updates about your appointments via email</div>
                            </div>
                            <button 
                              onClick={() => toggleSetting('emailNotifications')}
                              className={`text-2xl transition-colors ${settings.emailNotifications ? "text-[#0A6ED1]" : "text-slate-300"}`}
                            >
                              {settings.emailNotifications ? <FaToggleOn /> : <FaToggleOff />}
                            </button>
                          </div>

                          <div className="flex items-center justify-between py-4 border-b border-slate-50">
                            <div>
                              <div className="font-semibold text-slate-900">SMS Notifications</div>
                              <div className="text-sm text-slate-500">Receive text messages for upcoming appointments</div>
                            </div>
                            <button 
                              onClick={() => toggleSetting('smsNotifications')}
                              className={`text-2xl transition-colors ${settings.smsNotifications ? "text-[#0A6ED1]" : "text-slate-300"}`}
                            >
                              {settings.smsNotifications ? <FaToggleOn /> : <FaToggleOff />}
                            </button>
                          </div>
                       </div>
                    </div>
                  )}

                  {/* Security Settings */}
                  {activeTab === "security" && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-slate-900 mb-4">Security Settings</h2>
                      
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                           <div className="flex justify-between items-start mb-4">
                             <div>
                               <div className="font-semibold text-slate-900">Password</div>
                               <div className="text-sm text-slate-500">Last changed 3 months ago</div>
                             </div>
                             <button className="text-sm font-medium text-[#0A6ED1] hover:underline">Update</button>
                           </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <div>
                              <div className="font-semibold text-slate-900">Two-Factor Authentication</div>
                              <div className="text-sm text-slate-500">Add an extra layer of security to your account</div>
                            </div>
                            <button 
                              onClick={() => toggleSetting('twoFactorAuth')}
                              className={`text-2xl transition-colors ${settings.twoFactorAuth ? "text-[#0A6ED1]" : "text-slate-300"}`}
                            >
                              {settings.twoFactorAuth ? <FaToggleOn /> : <FaToggleOff />}
                            </button>
                          </div>
                      </div>
                    </div>
                  )}

                  {/* Privacy Settings */}
                  {activeTab === "privacy" && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-slate-900 mb-4">Privacy Options</h2>
                      
                      <div className="space-y-4">
                         <div className="flex items-center justify-between py-4 border-b border-slate-50">
                            <div>
                              <div className="font-semibold text-slate-900">Public Profile</div>
                              <div className="text-sm text-slate-500">Allow doctors to view your basic profile information</div>
                            </div>
                            <button 
                              onClick={() => toggleSetting('publicProfile')}
                              className={`text-2xl transition-colors ${settings.publicProfile ? "text-[#0A6ED1]" : "text-slate-300"}`}
                            >
                              {settings.publicProfile ? <FaToggleOn /> : <FaToggleOff />}
                            </button>
                          </div>

                          <div className="py-4">
                            <h4 className="font-medium text-slate-900 mb-2">Data Sharing</h4>
                            <p className="text-sm text-slate-500 mb-4">
                              Manage how your data is shared with third-party healthcare providers.
                            </p>
                            <button className="text-sm font-medium text-[#0A6ED1] border border-[#0A6ED1] px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                              Manage Data Permissions
                            </button>
                          </div>
                      </div>
                    </div>
                  )}

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

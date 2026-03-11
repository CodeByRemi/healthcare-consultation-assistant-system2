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
  FaGlobe, 
  FaToggleOn,
  FaToggleOff 
} from "react-icons/fa";

function ToggleRow({
  enabled,
  onClick,
  title,
  description
}: {
  enabled: boolean;
  onClick: () => void;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
      <div>
        <div className="font-semibold text-slate-900">{title}</div>
        <div className="text-sm text-slate-500">{description}</div>
      </div>
      <button
        onClick={onClick}
        className={`text-2xl transition-colors ${enabled ? "text-slate-700" : "text-slate-300"}`}
      >
        {enabled ? <FaToggleOn /> : <FaToggleOff />}
      </button>
    </div>
  );
}

const englishLanguageOptions = [
  "English (US)",
  "English (UK)",
  "English (Canada)",
  "English (Australia)",
  "English (Nigeria)",
  "English (India)"
];

export default function PatientSettings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("account");

  // Mock Settings State
  const [settings, setSettings] = useState({
    emailNotifications: true,
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
          <div className="max-w-5xl mx-auto">
            <header className="mb-6 md:mb-8 rounded-3xl bg-linear-to-r from-[#0A6ED1] to-blue-500 p-6 md:p-8 text-white shadow-lg shadow-blue-200">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Patient Settings</h1>
              <p className="text-blue-100 text-sm md:text-base">Update security, notifications, and privacy preferences.</p>
            </header>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-4 md:p-6">
              <nav className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center gap-2 rounded-xl py-3 px-3 text-sm font-semibold transition-colors ${
                      activeTab === tab.id
                        ? "bg-[#0A6ED1] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>

              {activeTab === "account" && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">Password</h2>
                    <p className="text-sm text-slate-500 mb-4">Keep your account secure with a strong password.</p>
                    <Link
                      to="/patient/update-password"
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Change Password
                    </Link>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0A6ED1] flex items-center justify-center">
                          <FaGlobe />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">Language</div>
                          <div className="text-sm text-slate-500">Choose your preferred English locale</div>
                        </div>
                      </div>
                      <select
                        value={settings.language}
                        onChange={(e) => setSettings((prev) => ({ ...prev, language: e.target.value }))}
                        className="text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A6ED1]/20"
                      >
                        {englishLanguageOptions.map((lang) => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-4">
                  <ToggleRow
                    enabled={settings.emailNotifications}
                    onClick={() => toggleSetting("emailNotifications")}
                    title="Email Notifications"
                    description="Receive updates about appointments by email"
                  />
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h2 className="font-semibold text-slate-900">Password Security</h2>
                    <p className="text-sm text-slate-500 mt-1 mb-3">Last changed 3 months ago.</p>
                    <Link to="/patient/update-password" className="text-sm font-medium text-[#0A6ED1] hover:underline">
                      Update password
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === "privacy" && (
                <div className="space-y-4">
                  <ToggleRow
                    enabled={settings.publicProfile}
                    onClick={() => toggleSetting("publicProfile")}
                    title="Public Profile"
                    description="Allow doctors to view basic profile information"
                  />
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <h2 className="font-semibold text-slate-900 mb-2">Data Sharing</h2>
                    <p className="text-sm text-slate-500 mb-2">Your data is only shared with doctors involved in your care and based on your consent.</p>
                    <p className="text-sm text-[#0A6ED1] font-medium">Privacy controls are currently enabled by default.</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
        
        <PatientMobileFooter />
      </main>
    </div>
  );
}

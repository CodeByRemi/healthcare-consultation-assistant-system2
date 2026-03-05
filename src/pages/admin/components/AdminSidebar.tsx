import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Settings, 
  LogOut, 
  LayoutDashboard, 
  UserPlus, 
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminSidebar({ 
  currentTab, 
  setCurrentTab, 
  isOpen
}: { 
  currentTab: string, 
  setCurrentTab: (tab: string) => void,
  isOpen: boolean
}) {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'doctors', label: 'Doctors', icon: UserPlus },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    // Add logout logic here
    navigate('/');
  };

  return (
    <aside
      className={`hidden md:block bg-white text-gray-900 transition-all duration-200 ease-in-out ${
        isOpen ? "w-64 border-r border-gray-200" : "w-20 border-r border-gray-200"
      } overflow-hidden`}
    >
      <div
        className={`flex flex-col h-full transition-all duration-200 ${isOpen ? "w-64" : "w-20"}`}
      >
          {/* Header */}
          <div className={`h-16 flex items-center border-b border-gray-200 ${isOpen ? "px-6" : "justify-center"}`}>
            <Activity className={`text-blue-600 ${isOpen ? "mr-3" : ""}`} />
            {isOpen && <h1 className="text-xl font-bold font-display tracking-tight text-gray-900">Admin</h1>}
          </div>

          {/* Navigation */}
          <nav className={`flex-1 py-6 space-y-2 overflow-y-auto ${isOpen ? "px-4" : "px-2"}`}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                  }}
                  className={`w-full flex items-center rounded-xl transition-all duration-200 group relative ${
                    isOpen ? "px-4 py-3" : "justify-center px-0 py-3"
                  } ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                  title={!isOpen ? item.label : undefined}
                >
                  <Icon size={20} className={`${isOpen ? "mr-3" : ""} transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                  {isOpen && <span className="font-medium">{item.label}</span>}
                  {isActive && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className={`w-1.5 h-1.5 rounded-full bg-blue-600 ${isOpen ? "absolute right-4" : "absolute top-2 right-2"}`}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className={`border-t border-gray-200 ${isOpen ? "p-4" : "p-2"}`}>
            <button 
              onClick={handleLogout}
              className={`w-full flex items-center rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors group ${
                isOpen ? "px-4 py-3" : "justify-center px-0 py-3"
              }`}
              title={!isOpen ? "Sign Out" : undefined}
            >
              <LogOut size={20} className={`${isOpen ? "mr-3" : ""} group-hover:-translate-x-1 transition-transform`} />
              {isOpen && <span className="font-medium">Sign Out</span>}
            </button>
          </div>
      </div>
    </aside>
  );
}

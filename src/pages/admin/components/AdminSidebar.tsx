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
  isOpen, 
  toggleSidebar 
}: { 
  currentTab: string, 
  setCurrentTab: (tab: string) => void,
  isOpen: boolean,
  toggleSidebar: () => void 
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
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-16 flex items-center px-6 border-b border-slate-800">
            <Activity className="text-emerald-500 mr-3" />
            <h1 className="text-xl font-bold font-display tracking-tight">Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    if (window.innerWidth < 768) toggleSidebar();
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} className={`mr-3 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-slate-800">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-colors group"
            >
              <LogOut size={20} className="mr-3 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

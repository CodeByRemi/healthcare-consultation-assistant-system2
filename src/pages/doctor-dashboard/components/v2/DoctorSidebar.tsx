import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaCalendarAlt, 
  FaUserInjured, 
  FaCog, 
  FaSignOutAlt,
  FaBars,
  FaClock
} from "react-icons/fa";
import logo from "../../../../assets/patientreg.png"; // reusing logo
import { useAuth } from "../../../../context/AuthContext";
import { toast } from "sonner";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function DoctorSidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/doctor/login");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Failed to log out");
    }
  };

  const menuItems = [
    { icon: FaHome, label: "Overview", path: "/doctor/dashboard" },
    { icon: FaCalendarAlt, label: "Schedule", path: "/doctor/schedule" },
    { icon: FaClock, label: "Availability", path: "/doctor/availability" },
    { icon: FaUserInjured, label: "My Patients", path: "/doctor/patients" },
    { icon: FaCog, label: "Settings", path: "/doctor/settings" },
  ];

  return (
    <aside 
      className={`
        hidden md:flex flex-col
        relative z-30
        h-screen bg-white border-r border-slate-100
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-64" : "w-20"}
        justify-between
        shadow-none
      `}
    >
      <div className="flex flex-col h-full"> 
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-slate-50 transition-all duration-300">
           <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isOpen ? "w-auto opacity-100" : "w-0 opacity-0 hidden"}`}>
            <div className="w-8 h-8 bg-[#0A6ED1] rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm shadow-blue-200">
               <img src={logo} alt="Logo" className="w-5 h-5 brightness-0 invert" />
            </div>
            <span className="font-['Newsreader'] font-bold text-xl text-slate-900 whitespace-nowrap">
              MediDoctor
            </span>
           </div>
           
           <button 
             onClick={onToggle} 
             className={`text-slate-500 hover:bg-slate-50 p-2 rounded-lg transition-colors ${!isOpen && "mx-auto"}`}
             title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
           >
             <FaBars className="w-5 h-5" />
           </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {menuItems.map((item) => {
             const isActive = location.pathname === item.path;
             return (
               <Link
                 key={item.path}
                 to={item.path}
                 className={`
                   flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                   ${isActive 
                     ? "bg-[#0A6ED1] text-white shadow-lg shadow-blue-500/20 font-semibold" 
                     : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium"
                   }
                 `}
               >
                 <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${!isOpen && "mx-auto"}`} />
                 
                 <span className={`whitespace-nowrap transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 w-0 hidden"}`}>
                   {item.label}
                 </span>
                 
                 {!isOpen && (
                   <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                     {item.label}
                   </div>
                 )}
               </Link>
             );
          })}
        </nav>
      </div>

      {/* Logout Area */}
      <div className="p-4 border-t border-slate-50">
        <button 
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 
            text-red-500 hover:bg-red-50 font-medium
            ${!isOpen && "justify-center"}
          `}
        >
          <FaSignOutAlt className="w-5 h-5" />
          <span className={`whitespace-nowrap transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 w-0 hidden"}`}>
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}

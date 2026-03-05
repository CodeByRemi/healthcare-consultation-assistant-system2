import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaCalendarAlt, 
  FaUserMd,
  FaRobot,
  
  FaCog,
  FaSignOutAlt,
  
  FaBars // Imported FaBars
} from "react-icons/fa";
// Reusing logo for consistency - might need to check path
import logo from "../../../assets/patientreg.png";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "sonner";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function PatientSidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/patient-login");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Failed to log out");
    }
  };

  const menuItems = [
    { icon: FaHome, label: "Overview", path: "/patient/dashboard" },
    { icon: FaCalendarAlt, label: "Appointments", path: "/patient/appointments" },
    { icon: FaUserMd, label: "Book Appointment", path: "/patient/book-appointment" },
    { icon: FaRobot, label: "AI Assistant", path: "/patient/ai-chat" },
    // { icon: FaFileMedical, label: "Medical Records", path: "/patient/records" },
    // { icon: FaPills, label: "Prescriptions", path: "/patient/prescriptions" },
    // { icon: FaCommentMedical, label: "Messages", path: "/patient/messages" },
    { icon: FaCog, label: "Settings", path: "/patient/settings" },
  ];

  return (
    <>
      {/* Mobile Overlay - Removed since we use footer now */}
      
      {/* Sidebar Container */}
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
             
             {/* Logo & Text */}
             <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isOpen ? "w-auto opacity-100" : "w-0 opacity-0 hidden"}`}>
              <div className="w-8 h-8 bg-[#0A6ED1] rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm shadow-blue-200">
                 <img src={logo} alt="Logo" className="w-5 h-5 brightness-0 invert" />
              </div>
              <span className="font-['Newsreader'] font-bold text-xl text-slate-900 whitespace-nowrap">
                Medicare
              </span>
             </div>
             
             {/* Toggle Button */}
             <button 
               onClick={onToggle} 
               className={`text-slate-500 hover:bg-slate-50 p-2 rounded-lg transition-colors ${!isOpen && "mx-auto"}`}
               title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
             >
               <FaBars className="w-5 h-5" />
             </button>
          </div>



















          {/* Navigation */}
          <nav className="p-4 space-y-2 flex-1">
            {menuItems.map((item, idx) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={idx}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
                    ${isActive 
                      ? "bg-[#0A6ED1]/10 text-[#0A6ED1] font-semibold" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
                    ${!isOpen && "justify-center px-0"}
                  `}
                >
                  <item.icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-[#0A6ED1]" : "text-slate-400 group-hover:text-[#0A6ED1]"}`} />
                  <span className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${!isOpen ? "w-0 opacity-0 hidden" : "w-auto opacity-100"}`}>
                    {item.label}
                  </span>
                  
                  {/* Tooltip for collapsed state */}
                  {!isOpen && (
                    <div className="hidden md:block absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                      {item.label}
                      <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-50 mt-auto">
            <button 
              onClick={handleLogout}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-colors group ${!isOpen && "justify-center px-0"}`}
            >
              <FaSignOutAlt className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
              <span className={`font-medium whitespace-nowrap transition-all duration-300 overflow-hidden ${!isOpen ? "w-0 opacity-0 hidden" : "w-auto opacity-100"}`}>
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

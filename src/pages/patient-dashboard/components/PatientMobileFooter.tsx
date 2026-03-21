import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaCalendarAlt, 
  FaUser,
  FaUserMd,
  FaRobot,
  FaSignOutAlt
} from "react-icons/fa";
import { toast } from "sonner";
import { useAuth } from "../../../context/AuthContext";

export default function PatientMobileFooter() {
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
    { icon: FaHome, path: "/patient/dashboard", label: "Home" },
    { icon: FaCalendarAlt, path: "/patient/appointments", label: "Visits" },
    { icon: FaUserMd, path: "/patient/book-appointment", label: "Book" },
    { icon: FaRobot, path: "/patient/ai-chat", label: "AI" },
    { icon: FaUser, path: "/patient/profile", label: "Profile" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-3 py-2 pb-safe z-50 flex justify-between items-center shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
              isActive 
                ? "text-[#0A6ED1]" 
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <item.icon className={`text-xl ${isActive ? "scale-110" : ""}`} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}

      <button
        type="button"
        onClick={handleLogout}
        className="flex flex-col items-center gap-1 p-2 rounded-lg text-rose-500 hover:text-rose-600 transition-all"
      >
        <FaSignOutAlt className="text-xl" />
        <span className="text-[10px] font-medium">Logout</span>
      </button>
    </div>
  );
}

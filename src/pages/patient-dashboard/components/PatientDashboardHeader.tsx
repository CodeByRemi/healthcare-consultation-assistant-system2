import { FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useNotifications } from "../../../context/NotificationContext";
import { User } from "lucide-react";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import logo from "../../../assets/patientreg.png";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function PatientDashboardHeader({ toggleSidebar: _toggleSidebar }: HeaderProps) {
  void _toggleSidebar;
  const { currentUser } = useAuth();
  const { unreadCount } = useNotifications();
  const [userName, setUserName] = useState("Patient");

  useEffect(() => {
    const fetchName = async () => {
      if (currentUser) {
        const docRef = doc(db, "patients", currentUser.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setUserName(snap.data().fullName || "Patient");
        }
      }
    };
    fetchName();
  }, [currentUser]);

  return (
    <header className="h-20 bg-white border-b border-slate-100 px-6 md:px-8 flex items-center justify-between sticky top-0 z-10 transition-all duration-200">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Medicare" className="h-9 w-9 rounded-lg object-contain" />
        <span className="hidden sm:block text-slate-800 font-semibold">Medicare</span>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Link to="/patient/notifications" className="p-2 text-slate-400 hover:text-[#0A6ED1] hover:bg-slate-50 rounded-full transition-colors relative">
          <FaBell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        <Link
          to="/patient/profile"
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-[#0A6ED1] hover:bg-blue-100 transition-colors"
          title="Profile"
        >
          <User className="w-4 h-4" />
        </Link>


        <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>

        <Link to="/patient/profile" className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-50 transition-colors">
          <span className="hidden md:block font-medium text-sm text-slate-700">{userName}</span>
        </Link>
      </div>
    </header>
  );
}

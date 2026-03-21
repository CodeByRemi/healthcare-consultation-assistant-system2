import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaClock,
  FaUserInjured,
  FaCog,
} from "react-icons/fa";
import type { IconType } from "react-icons";

type DoctorFooterItem = {
  icon: IconType;
  path: string;
  label: string;
  count?: number;
};

export default function DoctorMobileFooter() {
  const menuItems: DoctorFooterItem[] = [
    { icon: FaHome, path: "/doctor/dashboard", label: "Home" },
    { icon: FaCalendarAlt, path: "/doctor/schedule", label: "Schedule" },
    { icon: FaClock, path: "/doctor/availability", label: "Avail" },
    { icon: FaUserInjured, path: "/doctor/patients", label: "Patients" },
    { icon: FaCog, path: "/doctor/settings", label: "Settings" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 pb-safe z-50 flex justify-between items-center shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
      {menuItems.map((item) => {
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 min-w-0 px-2 py-1.5 rounded-xl transition-all duration-200 ${
                isActive ? "text-[#0A6ED1]" : "text-slate-400 hover:text-slate-600"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
                    isActive ? "bg-blue-50 shadow-sm shadow-blue-100 scale-110" : "bg-transparent"
                  }`}
                >
                  <item.icon className="text-lg" />
                </div>
                <span className={`text-[10px] font-semibold transition-all duration-200 ${isActive ? "opacity-100" : "opacity-80"}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </div>
  );
}

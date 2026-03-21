import {
  Bell,
  Calendar,
  LayoutDashboard,
  UserPlus,
  Users
} from "lucide-react";
import { type ComponentType } from "react";
import { useNotifications } from "../../../context/NotificationContext";

type MenuItem = {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  count?: number;
};

const baseMenuItems: MenuItem[] = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard },
  { id: "doctors", label: "Doctors", icon: UserPlus },
  { id: "patients", label: "Patients", icon: Users },
  { id: "appointments", label: "Appts", icon: Calendar },
  { id: "notifications", label: "Alerts", icon: Bell },
];

export default function AdminMobileFooter({
  currentTab,
  setCurrentTab,
}: {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}) {
  const { unreadCount } = useNotifications();

  const menuItems = baseMenuItems.map((item) =>
    item.id === "notifications"
      ? { ...item, count: unreadCount }
      : item
  );

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50 flex items-center justify-between gap-1 overflow-x-auto shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
      {menuItems.map((item) => {
        const isActive = currentTab === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setCurrentTab(item.id)}
            className={`flex-1 min-w-15 flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
              isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} />
            <span className="text-[10px] font-medium flex items-center gap-1">
              {item.label}
              {typeof item.count === "number" && item.count > 0 && <span className="text-[10px] text-red-500 font-bold">{item.count}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

import { useState } from "react";
import PatientSidebar from "./components/PatientSidebar";
import PatientDashboardHeader from "./components/PatientDashboardHeader";
import PatientMobileFooter from "./components/PatientMobileFooter";
import { FaBell, FaCalendarCheck, FaInfoCircle, FaCheckDouble, FaTrash } from "react-icons/fa";

interface Notification {
  id: number;
  type: "appointment" | "system" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function PatientNotifications() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "appointment",
      title: "Appointment Confirmed",
      message: "Your appointment with Dr. Sarah Smith has been confirmed for tomorrow at 10:00 AM.",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      type: "system",
      title: "Profile Update",
      message: "You successfully updated your medical history.",
      time: "Yesterday",
      read: true
    },
    {
      id: 3,
      type: "info",
      title: "New Feature Available",
      message: "You can now chat with our AI assistant for quick health queries.",
      time: "2 days ago",
      read: true
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "appointment": return <FaCalendarCheck className="text-[#0A6ED1]" />;
      case "system": return <FaCheckDouble className="text-green-500" />;
      default: return <FaInfoCircle className="text-orange-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <PatientSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <PatientDashboardHeader 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Notifications</h1>
                <p className="text-slate-500">Stay updated with your appointments and health alerts.</p>
              </div>
              <button 
                onClick={markAllAsRead}
                className="text-sm font-medium text-[#0A6ED1] hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
              >
                Mark all as read
              </button>
            </div>

            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <FaBell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`bg-white p-6 rounded-2xl shadow-sm border transition-all hover:shadow-md flex gap-4 ${
                      notification.read ? "border-slate-100 opacity-75" : "border-blue-100 bg-blue-50/10"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      notification.read ? "bg-slate-100" : "bg-white shadow-sm border border-slate-100"
                    }`}>
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className={`font-bold mb-1 ${notification.read ? "text-slate-700" : "text-slate-900"}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-slate-400 whitespace-nowrap ml-4">{notification.time}</span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed mb-3">
                        {notification.message}
                      </p>
                      <div className="flex justify-end">
                        <button 
                          onClick={() => deleteNotification(notification.id)}
                          className="text-slate-400 hover:text-red-500 text-sm flex items-center gap-1 transition-colors"
                        >
                          <FaTrash className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <PatientMobileFooter />
      </main>
    </div>
  );
}

import { useState } from "react";
import PatientSidebar from "./components/PatientSidebar";
import PatientDashboardHeader from "./components/PatientDashboardHeader";
import PatientMobileFooter from "./components/PatientMobileFooter";
import { FaBell, FaCalendarCheck, FaInfoCircle, FaCheckDouble, FaTrash, FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: number;
  type: "appointment" | "system" | "info";
  title: string;
  message: string;
  details?: string;
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
      message: "Your appointment with Dr. Sarah Smith has been confirmed.",
      details: "Your appointment is scheduled for March 15th, 2024 at 10:00 AM. Location: Main Clinic, Room 302. Please arrive 15 minutes early and bring your ID.",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      type: "system",
      title: "System Maintenance",
      message: "Scheduled maintenance tonight at 2:00 AM.",
      details: "The system will be undergoing scheduled maintenance from 2:00 AM to 4:00 AM. During this time, you may experience intermittent access issues. We apologize for any inconvenience.",
      time: "5 hours ago",
      read: true
    },
     {
      id: 3,
      type: "info",
      title: "New Health Tip",
      message: "Check out our latest article on maintaining a healthy lifestyle.",
      details: "We have published a new article titled '10 Tips for a Healthier You'. Read it in the Health Resources section to learn about balanced diets, regular exercise, and mental well-being.",
      time: "1 day ago",
      read: true
    }
  ]);

  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("Marked all as read");
  };

  const deleteNotification = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success("Notification dismissed");
    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    // Mark as read when opened
    if (!notification.read) {
       setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
    }
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
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
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
                    onClick={() => handleNotificationClick(notification)}
                    className={`bg-white p-6 rounded-2xl shadow-sm border transition-all hover:shadow-md flex gap-4 cursor-pointer group ${
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
                      <p className="text-slate-600 text-sm leading-relaxed mb-3 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                         <span className="text-xs text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            Click to view details
                         </span>
                        <button 
                          onClick={(e) => deleteNotification(e, notification.id)}
                          className="text-slate-400 hover:text-red-500 text-sm flex items-center gap-1 transition-colors z-10"
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

        {/* Details Modal */}
        <AnimatePresence>
          {selectedNotification && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedNotification(null)}
                className="absolute inset-0"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative z-10"
              >
                <div className={`h-2 w-full ${
                  selectedNotification.type === 'appointment' ? 'bg-blue-500' :
                  selectedNotification.type === 'system' ? 'bg-green-500' :
                  'bg-orange-500'
                }`} />
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        selectedNotification.read ? "bg-slate-100" : "bg-blue-50"
                      }`}>
                        {getIcon(selectedNotification.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{selectedNotification.title}</h3>
                        <p className="text-xs text-slate-500">{selectedNotification.time}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedNotification(null)}
                      className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                    >
                      <FaTimes className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="prose prose-sm text-slate-600 mb-6">
                    <p className="font-medium mb-2">{selectedNotification.message}</p>
                    {selectedNotification.details && (
                      <p className="text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                        {selectedNotification.details}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedNotification(null)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

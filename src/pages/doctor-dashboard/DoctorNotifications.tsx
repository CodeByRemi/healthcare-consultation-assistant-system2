import { useState } from "react";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import DoctorMobileFooter from "./components/v2/DoctorMobileFooter";
import DoctorPageTransition from "./components/v2/DoctorPageTransition";
import { FaBell, FaCalendarCheck, FaInfoCircle, FaCheckDouble, FaTrash, FaClipboardList, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useNotifications } from "../../context/NotificationContext";

export default function DoctorNotifications() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case "appointment": return <FaCalendarCheck className="w-5 h-5 text-blue-500" />;
      case "system": return <FaInfoCircle className="w-5 h-5 text-slate-500" />;
      case "patient": return <FaClipboardList className="w-5 h-5 text-green-500" />;
      case "warning": return <FaInfoCircle className="w-5 h-5 text-orange-500" />;
      default: return <FaBell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-['Manrope']">
      <DoctorSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <DoctorHeader 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <DoctorPageTransition className="max-w-4xl mx-auto">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                  <button onClick={() => navigate(-1)} className="md:hidden p-2 hover:bg-slate-100 rounded-lg">
                      <FaArrowLeft />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
                    <p className="text-slate-500">Stay updated with your practice activities.</p>
                  </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <FaCheckDouble /> Mark all read
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaBell className="w-6 h-6 text-slate-300" />
                  </div>
                  <h3 className="text-slate-900 font-bold mb-1">No notifications</h3>
                  <p className="text-slate-500">You're all caught up!</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`bg-white p-4 md:p-6 rounded-2xl shadow-sm border transition-all hover:shadow-md flex gap-4 ${
                      notification.read ? 'border-slate-100 opacity-80' : 'border-blue-100 bg-blue-50/10'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                      notification.read ? 'bg-slate-100' : 'bg-white shadow-sm border border-slate-100'
                    }`}>
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-1">
                        <h3 className={`font-semibold text-slate-900 ${!notification.read && 'font-bold'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-slate-400 whitespace-nowrap">{notification.time}</span>
                      </div>
                      <p className="text-slate-600 text-sm mb-3">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center gap-4">
                        {!notification.read && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs font-medium text-[#0A6ED1] hover:underline"
                          >
                            Mark as read
                          </button>
                        )}
                        <button 
                          onClick={() => deleteNotification(notification.id)}
                          className="text-xs font-medium text-red-500 hover:text-red-600 flex items-center gap-1 hover:underline"
                        >
                          <FaTrash className="w-3 h-3" /> Dismiss
                        </button>
                      </div>
                    </div>
                    
                    {!notification.read && (
                      <div className="shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    )}
                  </div>
                ))
              )}
            </div>

          </DoctorPageTransition>
        </div>

        <DoctorMobileFooter />
      </main>
    </div>
  );
}

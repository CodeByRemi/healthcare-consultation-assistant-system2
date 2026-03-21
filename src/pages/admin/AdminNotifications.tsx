import { useState } from "react";
import { Bell, Clock3, Info, CheckCircle, AlertTriangle, X, Calendar, FileText, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../../context/NotificationContext";
import type { Notification } from "../../context/NotificationContext";

export default function AdminNotifications() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const handleNotificationClick = async (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      await markAsRead(notification.id);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="text-green-500" size={20} />;
      case "warning": 
      case "system": return <AlertTriangle className="text-amber-500" size={20} />;
      case "appointment": return <Calendar className="text-purple-500" size={20} />;
      case "prescription": return <FileText className="text-indigo-500" size={20} />;
      case "message": return <MessageSquare className="text-emerald-500" size={20} />;
      default: return <Info className="text-blue-500" size={20} />;
    }
  };

  const getTypeStyle = (type: string, part: 'bar' | 'iconBg') => {
    if (type === 'success') return part === 'bar' ? 'bg-green-500' : 'bg-green-50 text-green-600';
    if (type === 'warning' || type === 'system') return part === 'bar' ? 'bg-amber-500' : 'bg-amber-50 text-amber-600';
    if (type === 'appointment') return part === 'bar' ? 'bg-purple-500' : 'bg-purple-50 text-purple-600';
    if (type === 'prescription') return part === 'bar' ? 'bg-indigo-500' : 'bg-indigo-50 text-indigo-600';
    if (type === 'message') return part === 'bar' ? 'bg-emerald-500' : 'bg-emerald-50 text-emerald-600';
    return part === 'bar' ? 'bg-blue-500' : 'bg-blue-50 text-blue-600';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
        </div>
        <span className="text-sm text-gray-500">
          {unreadCount} unread
        </span>
      </div>

      <div className="divide-y divide-gray-100">
        {notifications.map((item) => (
          <div 
            key={item.id} 
            onClick={() => handleNotificationClick(item)}
            className={`p-6 transition-all cursor-pointer hover:bg-gray-50 flex gap-4 ${
              !item.read ? "bg-blue-50/30" : ""
            }`}
          >
            <div className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
              !item.read ? "bg-white shadow-sm border border-blue-100" : "bg-gray-50 border border-gray-100"
            }`}>
              {getIcon(item.type)}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <p className={`font-semibold ${!item.read ? "text-gray-900" : "text-gray-700"}`}>
                  {item.title}
                </p>
                {!item.read && <span className="w-2 h-2 rounded-full bg-blue-600 mt-2"></span>}
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-1">{item.message}</p>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <Clock3 size={14} />
                <span>{item.time || new Date(item.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-200" />
            <p>No notifications yet</p>
          </div>
        )}
      </div>

      {/* Notification Details Modal */}
      <AnimatePresence>
        {selectedNotification && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
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
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative z-10"
            >
              {/* Header color bar based on type */}
              <div className={`h-2 w-full ${getTypeStyle(selectedNotification.type, 'bar')}`} />
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getTypeStyle(selectedNotification.type, 'iconBg')}`}>
                      {getIcon(selectedNotification.type)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedNotification.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Clock3 size={14} />
                        <span>{selectedNotification.time || new Date(selectedNotification.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedNotification(null)}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Summary</h4>
                    <p className="text-gray-600">{selectedNotification.message}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Full Details</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selectedNotification.details}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-6 mt-6 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

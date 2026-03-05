import { Bell, Clock3 } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "[Notification Title]",
    message: "[Notification Message]",
    time: "[Time Placeholder]"
  },
  {
    id: 2,
    title: "[Notification Title]",
    message: "[Notification Message]",
    time: "[Time Placeholder]"
  },
  {
    id: 3,
    title: "[Notification Title]",
    message: "[Notification Message]",
    time: "[Time Placeholder]"
  }
];

export default function AdminNotifications() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {notifications.map((item) => (
          <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
            <p className="font-semibold text-gray-900">{item.title}</p>
            <p className="text-sm text-gray-600 mt-1">{item.message}</p>
            <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
              <Clock3 size={14} />
              <span>{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const fs = require('fs');
const path = 'src/pages/patient-dashboard/PatientNotifications.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add import
if (!content.includes('useNotifications')) {
  content = content.replace(
    'import { useState } from "react";',
    'import { useState } from "react";\nimport { useNotifications } from "../../context/NotificationContext";'
  );
}

// 2. Remove Interface Notification
const interfaceStart = content.indexOf('interface Notification {\n');
if (interfaceStart !== -1) {
  const interfaceEnd = content.indexOf('export default function PatientNotifications', interfaceStart);
  content = content.substring(0, interfaceStart) + content.substring(interfaceEnd);
}

// 3. Replace inside PatientNotifications
const funcStart = content.indexOf('export default function PatientNotifications() {');
if (funcStart !== -1) {
    const useStateArrayStart = content.indexOf('const [notifications, setNotifications]', funcStart);
    const getIconStart = content.indexOf('const getIcon = (type: string) => {', useStateArrayStart);
    
    if (useStateArrayStart !== -1 && getIconStart !== -1) {
        const replacement = `const { notifications, markAsRead, markAllAsRead, deleteNotification: contextDeleteNotification } = useNotifications();
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);

  const deleteNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    contextDeleteNotification(id);
    toast.success("Notification dismissed");
    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }
  };

  const handleNotificationClick = (notification: any) => {
    setSelectedNotification(notification);
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  `;
        content = content.substring(0, useStateArrayStart) + replacement + content.substring(getIconStart);
    }
}

fs.writeFileSync(path, content, 'utf8');
console.log('Done replacing PatientNotifications');

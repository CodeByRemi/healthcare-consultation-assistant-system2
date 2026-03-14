const fs = require('fs');
let file = 'src/pages/doctor-dashboard/DoctorNotifications.tsx';
let content = fs.readFileSync(file, 'utf8');

// remove Notification interface
content = content.replace(/interface Notification \{[\s\S]*?\}\n/, "");
// clear toast import 
content = content.replace('import { toast } from "sonner";', "");
// fix click e string parsing
content = content.replace(/onClick=\{\(e\) => \{\n\s*e\.stopPropagation\(\);\n\s*deleteNotification\(notification\.id\);\n\s*\}\}/g, 'onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}');

// replace clearAll usage 
content = content.replace('const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();', 'const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();');


fs.writeFileSync(file, content);
console.log("cleaned");

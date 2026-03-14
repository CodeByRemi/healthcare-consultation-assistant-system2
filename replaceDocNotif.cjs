const fs = require('fs');
let file = 'src/pages/doctor-dashboard/DoctorNotifications.tsx';
let content = fs.readFileSync(file, 'utf8');

const importReplacement = `import { useNotifications } from "../../context/NotificationContext";`;

content = content.replace('import { toast } from "sonner";', `import { toast } from "sonner";\n${importReplacement}`);

const compRegex = /export default function DoctorNotifications\(\) \{[\s\S]*?const deleteNotification = \(id: number\) => \{[\s\S]*?toast\.success\("Notification dismissed"\);\n  \};\n\n  const markAsRead = \(id: number\) => \{[\s\S]*?\}\n  \};\n\n  const getIcon = \(type: string\) => \{/;

const newComp = `export default function DoctorNotifications() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();

  const getIcon = (type: string) => {`;

content = content.replace(compRegex, newComp);

// Change id: number to id: string
content = content.replace(/deleteNotification\(id\)/g, 'deleteNotification(id.toString())');
content = content.replace(/onClick=\{\(\) => markAsRead\(notification.id\)\}/g, 'onClick={() => markAsRead(notification.id)}');
content = content.replace(/onClick=\{\(e\) => \{\n\s+e\.stopPropagation\(\);\n\s+deleteNotification\(notification.id\);\n\s+\}\}/g, 'onClick={(e) => {\n                                                        e.stopPropagation();\n                                                        deleteNotification(notification.id);\n                                                    }}');


fs.writeFileSync(file, content);
console.log("Replaced DoctorNotifications");

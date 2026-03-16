const fs = require('fs');
let file = 'src/pages/doctor-dashboard/DoctorNotifications.tsx';
let content = fs.readFileSync(file, 'utf8');

const strat = `export default function DoctorNotifications() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("Marked all as read");
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success("Notification dismissed");
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    toast.success("Marked as read");
  };

  const getIcon = (type: string) => {`;

const end = `export default function DoctorNotifications() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();

  const getIcon = (type: string) => {`;

if (content.includes(strat)) {
    content = content.replace(strat, end);
    content = content.replace(/deleteNotification\(id\)/g, 'deleteNotification(id.toString())');
    content = content.replace(/onClick=\{\(\) => markAsRead\(notification\.id\)\}/g, 'onClick={() => markAsRead(notification.id.toString())}');
    content = content.replace(/onClick=\{\(e\) => \{\n\s+e\.stopPropagation\(\);\n\s+deleteNotification\(notification\.id\);\n\s+\}\}/g, 'onClick={(e) => {\n                                                        e.stopPropagation();\n                                                        deleteNotification(notification.id.toString());\n                                                    }}');
    
    // Also remove the old interface
    content = content.replace(/interface Notification \{[\s\S]*?\}\n/, "");

    // the mapping variables have to accommodate string vs number and the potential absence of .read vs something else
    // Wait, the new context provides string id for notifications: { id: string }
    fs.writeFileSync(file, content);
    console.log("Successfully tore out the mock hooks!");
} else {
    console.log("Failed to find exact block.");
}

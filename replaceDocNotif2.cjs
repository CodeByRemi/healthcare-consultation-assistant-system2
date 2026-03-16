const fs = require('fs');
let file = 'src/pages/doctor-dashboard/DoctorNotifications.tsx';
let content = fs.readFileSync(file, 'utf8');

const importReplacement = `import { useNotifications } from "../../context/NotificationContext";`;

content = content.replace('import { toast } from "sonner";', `import { toast } from "sonner";\n${importReplacement}`);

const compRegex = /interface Notification \{[\s\S]*?export default function DoctorNotifications\(\) \{[\s\S]*?const deleteNotification = \(id: number\) => \{[\s\S]*?toast\.success\("Notification dismissed"\);\n  \};\n\n  const markAsRead = \(id: number\) => \{[\s\S]*?\}\n  \};\n\n  const getIcon = \(type: string\) => \{/;

const newComp = `export default function DoctorNotifications() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();

  const getIcon = (type: string) => {`;

content = content.replace(compRegex, newComp);


fs.writeFileSync(file, content);
console.log("Replaced DoctorNotifications exactly");

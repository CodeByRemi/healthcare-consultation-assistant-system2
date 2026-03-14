const fs = require('fs');
let file = 'src/pages/doctor-dashboard/DoctorNotifications.tsx';
let content = fs.readFileSync(file, 'utf8');

const strat = "export default function DoctorNotifications() {";
const endToken = "const getIcon = (type: string) => {";

const index1 = content.indexOf(strat);
const index2 = content.indexOf(endToken);

if (index1 > -1 && index2 > -1) {
    const end = `export default function DoctorNotifications() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  
  const { notifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();

  `;

    content = content.substring(0, index1) + end + content.substring(index2);
    // remove the interface
    content = content.replace(/interface Notification \{[\s\S]*?\}\n/, "");
    
    // fix the id.toString()
    content = content.replace(/onClick=\{\(\) => markAsRead\(notification.id\)\}/g, 'onClick={() => markAsRead(notification.id)}');
    
    fs.writeFileSync(file, content);
    console.log("Replaced via index");
} else {
    console.log("Could not find tokens");
}

const fs = require('fs');
let file = 'src/pages/doctor-dashboard/DoctorNotifications.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('import { useNotifications } from "../../context/NotificationContext";\nimport { useNotifications } from "../../context/NotificationContext";', 'import { useNotifications } from "../../context/NotificationContext";');

fs.writeFileSync(file, content);
console.log("Removed duplicate.");

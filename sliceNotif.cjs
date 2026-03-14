const fs = require('fs');
let file = 'src/pages/doctor-dashboard/DoctorNotifications.tsx';
let content = fs.readFileSync(file, 'utf8');

const s1 = "interface Notification {";
const end1 = "export default function DoctorNotifications() {";

const idx1 = content.indexOf(s1);
const idx2 = content.indexOf(endToken);

if (idx1 > -1 && idx2 > -1) {
    console.log("Removing interface");
}
// easier just regex it properly:
content = content.replace(/interface Notification \{[^}]+\}/, "");
fs.writeFileSync(file, content);

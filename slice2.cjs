const fs = require('fs');
let file = 'src/pages/doctor-dashboard/DoctorNotifications.tsx';
let content = fs.readFileSync(file, 'utf8');

const strat = "interface Notification {";
const endToken = "export default function DoctorNotifications() {";

const idx1 = content.indexOf(strat);
const idx2 = content.indexOf(endToken);
if (idx1 !== -1 && idx2 !== -1) {
    content = content.substring(0, idx1) + content.substring(idx2);
    fs.writeFileSync(file, content);
}

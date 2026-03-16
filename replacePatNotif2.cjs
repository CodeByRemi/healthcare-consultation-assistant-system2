const fs = require('fs');
const path = 'src/pages/patient-dashboard/PatientNotifications.tsx';
let content = fs.readFileSync(path, 'utf8');

const interfaceStart = content.indexOf('interface Notification');
if (interfaceStart !== -1) {
  const interfaceEnd = content.indexOf('export default function PatientNotifications', interfaceStart);
  content = content.substring(0, interfaceStart) + content.substring(interfaceEnd);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Done replacing PatientNotifications');

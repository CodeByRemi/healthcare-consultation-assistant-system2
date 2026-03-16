const fs = require('fs');
let content = fs.readFileSync('src/pages/doctor-dashboard/PatientDetails.tsx', 'utf8');
let lines = content.split('\n');
let start = lines.findIndex(l => l.includes("{activeTab === 'ai-assistant' && ("));
let end = -1;
for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].includes('</AnimatePresence>')) {
        end = i;
    }
}
console.log(start, end);

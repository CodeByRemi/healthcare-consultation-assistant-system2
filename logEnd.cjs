const fs = require('fs');
let content = fs.readFileSync('src/pages/doctor-dashboard/PatientDetails.tsx', 'utf8');
let lines = content.split('\n');

for(let i=397; i<lines.length; i++) {
   if(lines[i].includes("</AnimatePresence>")) {
       console.log("AnimatePresence at", i, lines[i-2].trim(), lines[i-1].trim(), lines[i].trim());
   }
}

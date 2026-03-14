const fs = require('fs');
let content = fs.readFileSync('src/pages/doctor-dashboard/PatientDetails.tsx', 'utf8');
let lines = content.split('\n');

// start is the FIRST match that doesn't have <button> around it. Actually we can just find it:
let startIdx = lines.findIndex(l => l.includes("{activeTab === 'ai-assistant' && (") && l.includes("motion.div") === false); 
// Wait, the button underline might just be `{activeTab === 'ai-assistant' && (` with the NEXT line being `<motion.div`.
// Let's just find the index of "          {activeTab === 'ai-assistant' && (" 
// Let's print out all indices:
for(let i=0; i<lines.length; i++) {
   if(lines[i].includes("activeTab === 'ai-assistant' && (")) {
       console.log(i, lines[i].trim());
       console.log("-> ", lines[i+1].trim());
   }
}

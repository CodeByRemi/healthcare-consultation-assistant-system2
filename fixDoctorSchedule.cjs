const fs = require('fs');
let file = 'src/pages/doctor-dashboard/DoctorSchedule.tsx';
let content = fs.readFileSync(file, 'utf8');

// fix imports
content = content.replace(/import \{ collection, query, where, getDocs, updateDoc /g, "import { collection, query, where, getDocs, getDoc, doc, updateDoc ");

// fix duplicated data
content = content.replace(/const data = docSnap\.data\(\);\r?\n\s+const pData = patientDataMap\.get\(data\.patientId\) \|\| \{\};\r?\n\s+const data = doc\.data\(\);/s, "const data = docSnap.data();\n\t\tconst pData = patientDataMap.get(data.patientId) || {};");

fs.writeFileSync(file, content);
console.log("Fixed DoctorSchedule");

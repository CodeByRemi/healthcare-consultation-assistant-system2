const fs = require('fs');
let file = 'src/pages/doctor-dashboard/PatientDetails.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('import { db }\nimport toast from "react-hot-toast";', 'import toast from "react-hot-toast";');

fs.writeFileSync(file, content);
console.log("Fixed import.");

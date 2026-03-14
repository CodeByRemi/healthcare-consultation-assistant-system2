const fs = require('fs');
let file = 'src/pages/doctor-dashboard/PatientDetails.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('import toast from "react-hot-toast"; from "../../lib/firebase";', 'import toast from "react-hot-toast";\nimport { db } from "../../lib/firebase";');

fs.writeFileSync(file, content);
console.log("Fixed import.");

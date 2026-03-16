const fs = require('fs');
let file = 'src/pages/doctor-dashboard/DoctorSchedule.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('import { collection, query, where, getDocs } from "firebase/firestore";', 'import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";');

fs.writeFileSync(file, content);
console.log("Imports updated");

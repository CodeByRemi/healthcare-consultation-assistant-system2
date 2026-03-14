const fs = require('fs');
let file = 'src/pages/doctor-dashboard/PatientDetails.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("const sessionMessages = [];", "const sessionMessages: any[] = [];");

fs.writeFileSync(file, content);
console.log("Typescript implicit any fixed");

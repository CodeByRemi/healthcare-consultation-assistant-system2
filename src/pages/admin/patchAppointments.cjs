const fs = require('fs');

const path = 'AppointmentDetails.tsx';
let data = fs.readFileSync(path, 'utf8');

data = data.replace(
  'import { collection, getDocs, orderBy, query } from "firebase/firestore";',
  'import { collection, getDocs, orderBy, query, where } from "firebase/firestore";'
);

data = data.replace(
  'const entity = params.get("entity") === "doctor" ? "doctor" : "patient";',
  'const entity = params.get("entity") === "doctor" ? "doctor" : "patient";\n  const targetId = params.get("id");'
);

data = data.replace(
  'const q = query(collection(db, "appointments")); // Removed orderBy to avoid index requirement for now',
  'let q = query(collection(db, "appointments"));\n        if (targetId) {\n          const fieldName = entity === "doctor" ? "doctorId" : "patientId";\n          q = query(collection(db, "appointments"), where(fieldName, "==", targetId));\n        }'
);

fs.writeFileSync(path, data);
console.log("Successfully patched AppointmentDetails.tsx!");

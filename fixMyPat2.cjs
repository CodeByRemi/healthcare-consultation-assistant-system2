const fs = require('fs');

const path = 'src/pages/doctor-dashboard/MyPatients.tsx';
let txt = fs.readFileSync(path, 'utf8');

txt = txt.replace(
  'import { collection, query, where, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";',
  'import { collection, query, where, getDocs, doc, updateDoc, getDoc, orderBy, limit } from "firebase/firestore";'
);

txt = txt.replace(
  'generateAndSaveAISummary(accepted.patientId, accepted.id);',
  'if (accepted.patientId) { generateAndSaveAISummary(accepted.patientId, accepted.id); }'
);

fs.writeFileSync(path, txt, 'utf8');

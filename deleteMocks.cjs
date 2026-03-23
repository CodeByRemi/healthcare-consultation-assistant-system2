const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'src/pages/doctor-dashboard/PatientDetails.tsx');
let code = fs.readFileSync(p, 'utf8');

const regex = /\/\/ MOCK DATA FOR DEMO[\s\S]*?const MOCK_MESSAGES_DATA[^;]*\};/g;

code = code.replace(/\/\/ MOCK DATA FOR DEMO[\s\S]*?const MOCK_MESSAGES_DATA[^{]*\{[\s\S]*?\};/g, '// Unused mock arrays removed');

fs.writeFileSync(p, code);

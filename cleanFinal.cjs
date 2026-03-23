const fs = require('fs');
let code = fs.readFileSync('src/pages/doctor-dashboard/MyPatients.tsx', 'utf-8');

const fallbackIdx = code.lastIndexOf(') : (');
if (fallbackIdx !== -1) {
    let textBefore = code.substring(0, fallbackIdx);
    textBefore += '                </div>\n            </div>\n        </div>\n      )}\n    </div>\n  );\n}\n';
    fs.writeFileSync('src/pages/doctor-dashboard/MyPatients.tsx', textBefore);
    console.log('Successfully cleaned the remaining chat UI string');
} else {
    console.log('Could not find the target string');
}
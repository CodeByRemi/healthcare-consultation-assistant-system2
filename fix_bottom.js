const fs = require('fs');
let code = fs.readFileSync('src/pages/doctor-dashboard/MyPatients.tsx', 'utf-8');
const searchString = ') : (';
const startIdx = code.indexOf(searchString);

if (startIdx !== -1) {
    let replaced = code.substring(0, startIdx);
    replaced += '</div>\n                </div>\n            </div>\n        </div>\n      )}\n    </div>\n  );\n}';
    fs.writeFileSync('src/pages/doctor-dashboard/MyPatients.tsx', replaced);
    console.log('Fixed MyPatients.tsx successfully!');
} else {
    console.log('Could not find startIdx');
}

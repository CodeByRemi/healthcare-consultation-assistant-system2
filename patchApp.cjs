const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import ErrorBoundary')) {
  code = code.replace(/import React from ['"]react['"];/, `import React from "react";\nimport ErrorBoundary from "./components/ErrorBoundary";\nimport NotFound from "./pages/common/NotFound";`);
}

if (!code.includes('<ErrorBoundary>')) {
  code = code.replace('<Routes>', '<ErrorBoundary>\n        <Routes>');
  code = code.replace('</Routes>', '  <Route path="*" element={<NotFound />} />\n        </Routes>\n      </ErrorBoundary>');
}

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx updated');

const fs = require('fs');
let file = 'src/main.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('import { ThemeProvider } from "./context/ThemeContext";', 'import { ThemeProvider } from "./context/ThemeContext";\nimport { NotificationProvider } from "./context/NotificationContext";');

content = content.replace('<ThemeProvider>', '<ThemeProvider>\n          <NotificationProvider>');
content = content.replace('</ThemeProvider>', '</NotificationProvider>\n        </ThemeProvider>');

fs.writeFileSync(file, content);
console.log("main.tsx modified.");

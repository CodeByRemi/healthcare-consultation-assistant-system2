const fs = require('fs');
let file = 'src/pages/common/UpdatePassword.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/user\.email/g, 'currentUser.email');
content = content.replace(/\(user,/g, '(currentUser,');
content = content.replace(/!user \|\|/g, '!currentUser ||');

fs.writeFileSync(file, content);
console.log("Fixed UpdatePassword");

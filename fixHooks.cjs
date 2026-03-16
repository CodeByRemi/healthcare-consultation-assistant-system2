const fs = require('fs');
let file = 'src/pages/doctor-dashboard/PatientDetails.tsx';
let content = fs.readFileSync(file, 'utf8');

const earlyReturnStr = `  if (loadingPatient) {
    return <div className="flex h-screen items-center justify-center bg-slate-50"><div className="w-12 h-12 border-4 border-[#0A6ED1] border-t-transparent rounded-full animate-spin"></div></div>;
  }`;

content = content.replace(earlyReturnStr, '');

const mainReturnRegex = /  return \(\n    <div className="min-h-screen bg-slate-50/;

content = content.replace(mainReturnRegex, earlyReturnStr + '\n\n  return (\n    <div className="min-h-screen bg-slate-50');

fs.writeFileSync(file, content);
console.log("Hooks fixed.");

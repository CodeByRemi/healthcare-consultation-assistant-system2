const fs = require('fs');
let file = 'src/pages/doctor-dashboard/PatientDetails.tsx';
let content = fs.readFileSync(file, 'utf8');

const earlyReturnStr = `  if (loadingPatient) {
    return <div className="flex h-screen items-center justify-center bg-slate-50"><div className="w-12 h-12 border-4 border-[#0A6ED1] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (\n`;

content = content.replace("  return (\r\n", earlyReturnStr); // Catching \r\n just in case
content = content.replace("  return (\n", earlyReturnStr);

fs.writeFileSync(file, content);
console.log("Replaced cleanly.");

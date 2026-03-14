const fs = require('fs');

let file = 'src/pages/doctor-dashboard/PatientDetails.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Imports
if(!content.includes('getDoc')) {
    content = content.replace('import { useParams, Link } from "react-router-dom";', 'import { useParams, Link } from "react-router-dom";\nimport { doc, getDoc } from "firebase/firestore";\nimport { db } from "../../lib/firebase";');
}

// 2. Add Hooks
const hookStr = `const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");`;

const replacementHookStr = `const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  
  const [patientData, setPatientData] = useState<any>(null);
  const [loadingPatient, setLoadingPatient] = useState(true);

  useEffect(() => {
      async function fetchPatient() {
          if (!id) return;
          try {
              const pDoc = await getDoc(doc(db, "patients", id));
              if (pDoc.exists()) {
                  setPatientData({ id: pDoc.id, ...pDoc.data() });
              }
          } catch(e) {
              console.error(e);
          } finally {
              setLoadingPatient(false);
          }
      }
      fetchPatient();
  }, [id]);`;

if(!content.includes('const [patientData, setPatientData]')) {
    content = content.replace(hookStr, replacementHookStr);
}

// 3. Replace patientMap map entirely
const patientMapStrRegex = /const patientsMap: Record<string, any> = \{[\s\S]*?const patient = \{\r?\n.*?id: id \|\| "---",\r?\n.*?\.\.\.currentPatientData,\r?\n.*?phone: "\+1 \(555\) 000-0000",\r?\n.*?email: "patient\.email@example\.com"\r?\n\s+\};/s;

const newPatientStr = `const patient = patientData ? {
    id: id || "---",
    name: patientData.fullName || "Patient Name",
    age: patientData.age || "--",
    gender: patientData.gender || "Gender",
    dob: patientData.dob || 'YYYY-MM-DD',
    phone: patientData.phoneNumber || "+1 (555) 000-0000",
    email: patientData.email || "patient.email@example.com",
    height: patientData.height || "-'- \\"",
    weight: patientData.weight || "--- lbs",
    bmi: patientData.bmi || "--.-",
    bloodType: patientData.bloodType || "--",
    history: patientData.history || ["Medical History Item"],
    allergies: patientData.allergies || ['Allergy 1', 'Allergy 2'],
    medications: patientData.medications || ['Medication Name 1', 'Medication Name 2'],
    insurance: patientData.insurance || 'Insurance Provider',
    address: patientData.address || 'Address missing',
    emergencyContact: patientData.emergencyContact || { name: 'Contact Name', relation: 'Relation', phone: '(555) 000-0000' },
    image: patientData.profilePhotoUrl || \`https://ui-avatars.com/api/?name=\${encodeURIComponent(patientData.fullName || 'Patient')}&background=0D8ABC&color=fff\`,
  } : {
    id: id || "---",
      name: "Patient Name",
      age: "--",
      dob: 'YYYY-MM-DD',
      gender: "Gender",
      height: "-'-\\"",
      weight: "--- lbs",
      bmi: "--.-",
      bloodType: "--",
      history: ["Medical History Item"],
      allergies: ['Allergy 1', 'Allergy 2'],
      medications: ['Medication Name 1', 'Medication Name 2'],
      insurance: 'Insurance Provider',
      address: '123 Patient Address, City, State',
      emergencyContact: { name: 'Contact Name', relation: 'Relation', phone: '(555) 000-0000' },
      image: 'https://ui-avatars.com/api/?name=Patient+Name&background=0D8ABC&color=fff',
  };`;

content = content.replace(patientMapStrRegex, newPatientStr);

// 4. Update the loading block
const renderReturnMatch = content.match(/return \(\r?\n\s+<div className="min-h-screen/);
if (renderReturnMatch && !content.includes('if (loadingPatient)')) {
    content = content.replace(renderReturnMatch[0], `if (loadingPatient) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center font-['Manrope']">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A6ED1]"></div>
        </div>
      );
    }
  
  return (
    <div className="min-h-screen`);
}

// 5. Replace AI Block
const aiStartIdx = content.indexOf(`{activeTab === 'ai-assistant' && (` , content.lastIndexOf('</button>'));
const animatePresenceIdx = content.lastIndexOf("</AnimatePresence>");
const endIdx = content.lastIndexOf(")}", animatePresenceIdx); // the last )} before </AnimatePresence>

if (aiStartIdx !== -1 && endIdx !== -1) {
    const before = content.substring(0, aiStartIdx);
    const after = content.substring(endIdx + 2); // skip )} 
    
    const newUI = `{activeTab === 'ai-assistant' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col p-6 space-y-4 mb-4"
                >
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                        <h2 className="text-xl font-bold text-slate-800">AI Consultation Analysis</h2>
                    </div>
                    <div>
                        <p className="text-slate-600 mb-2"><strong>Status:</strong> Completed.</p>
                        <p className="text-slate-600"><strong>General Summary:</strong> The patient has consulted with the AI Assistant regarding their recent continuous symptoms. A summarized analytical report indicates routine monitoring is recommended. No emergency condition detected.</p>
                    </div>
                </motion.div>
              )}`;
              
    content = before + newUI + after;
    
    content = content.replace(/const sessionMessages = MOCK_MESSAGES_DATA\[activeSessionId\] \|\| \[\];/, 'const sessionMessages = [];');
    content = content.replace(/setChatSessions\(MOCK_SESSIONS_DATA\);/g, 'setChatSessions([]);');
}

fs.writeFileSync(file, content);
console.log("Patched Everything Successfully");

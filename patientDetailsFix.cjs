const fs = require('fs');

let content = fs.readFileSync('src/pages/doctor-dashboard/PatientDetails.tsx', 'utf8');

if(!content.includes('getDoc')) {
    content = content.replace('import { useParams, Link } from "react-router-dom";', 'import { useParams, Link } from "react-router-dom";\nimport { doc, getDoc } from "firebase/firestore";\nimport { db } from "../../lib/firebase";');
}

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

// Now replace patientsMap entirely
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

fs.writeFileSync('src/pages/doctor-dashboard/PatientDetails.tsx', content);
console.log("Replaced Firebase fetching block");

// Now fix the MOCK_MESSAGES_DATA and AI Tab to use General Summary.

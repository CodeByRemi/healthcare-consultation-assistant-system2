const fs = require('fs');

let file = 'src/pages/doctor-dashboard/PatientDetails.tsx';
let content = fs.readFileSync(file, 'utf8');

const hookRegex = /const \[activeTab,\s*setActiveTab\]\s*=\s*useState\("profile"\);/;
if (!content.includes('const [patientData, setPatientData]')) {
    content = content.replace(hookRegex, `const [activeTab, setActiveTab] = useState("profile");
  
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
  }, [id]);`);
}

fs.writeFileSync(file, content);
console.log("Hooks patched.");

const fs = require('fs');
let file = 'src/pages/doctor-dashboard/PatientDetails.tsx';
let content = fs.readFileSync(file, 'utf8');

// remove toast import if exists
content = content.replace('import toast from "react-hot-toast";', '');

const startIndex = content.indexOf('// Mock Patient Data - PLACEHOLDERS');
const endIndex = content.indexOf('const [chatSessions, setChatSessions]')

if (startIndex > -1 && endIndex > -1) {
    const replacement = `
  const [patientData, setPatientData] = useState<any>(null);
  const [loadingPatient, setLoadingPatient] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!id) return;
      try {
        setLoadingPatient(true);
        const pDoc = await getDoc(doc(db, "patients", id));
        if (pDoc.exists()) {
          setPatientData(pDoc.data());
        } else {
          console.error("Patient not found");
        }
      } catch (error) {
        console.error("Error fetching patient", error);
      } finally {
        setLoadingPatient(false);
      }
    };
    fetchPatientData();
  }, [id]);

  const patient = {
    id: id || "---",
    name: patientData?.name || patientData?.fullName || "Unknown Patient",
    age: patientData?.dob ? Math.floor((Date.now() - new Date(patientData.dob).getTime()) / 31557600000).toString() : "--",
    dob: patientData?.dob || 'YYYY-MM-DD',
    gender: patientData?.gender || "Unknown",
    height: patientData?.height || "-'-",
    weight: patientData?.weight || "--- lbs",
    bmi: patientData?.bmi || "--.-",
    bloodType: patientData?.bloodType || "--",
    history: patientData?.history || ["No medical history recorded"],
    allergies: patientData?.allergies || ['None declared'],
    medications: patientData?.medications || ['None declared'],
    insurance: patientData?.insurance || 'Not provided',
    address: patientData?.address || 'Address not provided',
    emergencyContact: patientData?.emergencyContact || { name: '-', relation: '-', phone: '-' },
    image: patientData?.photoURL || patientData?.image || \`https://ui-avatars.com/api/?name=\${encodeURIComponent(patientData?.name || patientData?.fullName || 'P')}&background=0D8ABC&color=fff\`,
    lastVitals: patientData?.lastVitals || { bp: "--/--", heartRate: "-- bpm", temp: "--.-F", oxygen: "--%" },
    phone: patientData?.phone || patientData?.phoneNumber || "---",
    email: patientData?.email || "---"
  };

  if (loadingPatient) {
    return <div className="flex h-screen items-center justify-center bg-slate-50"><div className="w-12 h-12 border-4 border-[#0A6ED1] border-t-transparent rounded-full animate-spin"></div></div>;
  }
  
  `;

  content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
  fs.writeFileSync(file, content);
  console.log("Successfully replaced patient data block!");
} else {
  console.log("Could not find bounds");
}


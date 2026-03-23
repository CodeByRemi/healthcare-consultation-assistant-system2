const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src/pages/doctor-dashboard/PatientDetails.tsx');
let code = fs.readFileSync(targetPath, 'utf8');

// 1. Add genotype to PatientFirestoreData
code = code.replace(
  /bloodType\?:\s*string;/,
  `bloodType?: string;
  genotype?: string;`
);

// 2. Adjust `const patient = { ... }` in PatientDetails component
const oldPatientObj = `  const patient = {
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
  };`;

const newPatientObj = `  const patient = {
    id: id || "---",
    name: patientData?.name || patientData?.fullName || "Unknown Patient",
    age: patientData?.dob ? Math.floor((Date.now() - new Date(patientData.dob).getTime()) / 31557600000).toString() : "--",
    dob: patientData?.dob || 'YYYY-MM-DD',
    gender: patientData?.gender || "Unknown",
    height: patientData?.height || "Not provided",
    weight: patientData?.weight || "Not provided",
    bloodType: patientData?.bloodType || "Not provided",
    genotype: patientData?.genotype || "Not provided",
    history: patientData?.history || ["No medical history recorded"],
    allergies: patientData?.allergies || ['None declared'],
    medications: patientData?.medications || ['None declared'],
    insurance: patientData?.insurance || 'Not provided',
    address: patientData?.address || "Not provided",
    image: patientData?.photoURL || patientData?.image || \`https://ui-avatars.com/api/?name=\${encodeURIComponent(patientData?.name || patientData?.fullName || 'P')}&background=0D8ABC&color=fff\`,
    lastVitals: patientData?.lastVitals || { bp: "--/--", heartRate: "-- bpm", temp: "--.-F", oxygen: "--%" },
    phone: patientData?.phone || patientData?.phoneNumber || "Not provided",
    email: patientData?.email || "Not provided"
  };`;

code = code.replace(oldPatientObj, newPatientObj);

// 3. Remove "Emergency Contact" JSX block
const emergencyContactRegex = /<div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 border-l-4 border-l-red-500">\s*<h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-600">[\s\S]*?<\/div>\s*<\/div>/;
const replacement1 = `</div>`; // Keeping the end tag of the wrapping column div
code = code.replace(emergencyContactRegex, replacement1);

// 4. Replace BMI with Genotype in Physical Attributes
const physicalAttributesMatch = `<div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                                <Activity size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-semibold uppercase">BMI</p>
                                <p className="font-bold text-slate-900">{patient.bmi}</p>
                            </div>
                        </div>`;

const genotypeReplacement = `<div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                                <Activity size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-semibold uppercase">Genotype</p>
                                <p className="font-bold text-slate-900">{patient.genotype}</p>
                            </div>
                        </div>`;

code = code.replace(physicalAttributesMatch, genotypeReplacement);

// Remove Mock Constants entirely
code = code.replace(/\/\/ MOCK DATA FOR DEMO[\s\S]*?export default function PatientDetails\(\) \{/g, 'export default function PatientDetails() {');

// 5. Update Imports for Firestore
code = code.replace(
  /from "firebase\/firestore";/,
  `orderBy } from "firebase/firestore";`
);

// Add imports for date formatting if needed, but we can just use native JS.
// Now replace the entire state & effects logic for Chat Sessions
const oldHooksRegex = /const \[chatSessions, setChatSessions\] = useState<ChatSession\[\]>\(\[\]\);.*?useEffect\(\(\) => \{[\s\S]*?\} else \{\s*setMessages\(\[\]\);\s*\}\s*\}, \[activeSessionId\]\);/ms;

const newHooksStr = `const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isSessionDropdownOpen, setIsSessionDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionDropdownRef = useRef<HTMLDivElement>(null);

  // Firestore DB Call logic
  useEffect(() => {
    const fetchAIChatSessions = async () => {
      if (!id || activeTab !== 'ai-assistant') return;
      try {
        setLoadingSessions(true);
        const convRef = collection(db, "patients", id, "aiConversations");
        const q = query(convRef, orderBy("lastUpdated", "desc"));
        const snap = await getDocs(q);
        const sessions: ChatSession[] = [];
        snap.forEach(docSnap => {
          const data = docSnap.data();
          const pDate = data.lastUpdated?.toDate();
          sessions.push({
            id: docSnap.id,
            title: data.title || "AI Consultation",
            date: pDate ? pDate.toLocaleDateString() : "Unknown Date",
            preview: data.summary || "Conversation details...",
            updatedAt: data.lastUpdated
          });
        });
        setChatSessions(sessions);
        if (sessions.length > 0 && !activeSessionId) {
          setActiveSessionId(sessions[0].id);
        }
      } catch (err) {
        console.error("Error fetching AI sessions:", err);
      } finally {
        setLoadingSessions(false);
      }
    };
    fetchAIChatSessions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, activeTab]);

  useEffect(() => {
    const fetchSessionMessages = async () => {
      if (!id || !activeSessionId) {
        setMessages([]);
        return;
      }
      try {
        setLoadingMessages(true);
        const msgRef = collection(db, "patients", id, "aiConversations", activeSessionId, "messages");
        const q = query(msgRef, orderBy("timestamp", "asc"));
        const snap = await getDocs(q);
        const msgs: Message[] = [];
        snap.forEach(docSnap => {
          const data = docSnap.data();
          // Normalize bot to ai
          let r = data.role === 'assistant' ? 'ai' : 'user';
          if (data.sender === 'ai' || data.sender === 'user') r = data.sender;
          msgs.push({
            id: docSnap.id,
            text: data.content || data.text || "",
            sender: r as "user" | "ai",
            timestamp: data.timestamp
          });
        });
        setMessages(msgs);
      } catch(err) {
        console.error("Error fetching messages", err);
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchSessionMessages();
  }, [id, activeSessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sessionDropdownRef.current && !sessionDropdownRef.current.contains(event.target as Node)) {
        setIsSessionDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeSessionId) {
        scrollToBottom();
    }
  }, [messages, activeSessionId]);`;

code = code.replace(oldHooksRegex, newHooksStr);

// To ensure I didn't break things, let's write it to disk.
fs.writeFileSync(targetPath, code, 'utf8');
console.log('Successfully patched PatientDetails.tsx!');

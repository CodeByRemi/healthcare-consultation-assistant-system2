import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import DoctorMobileFooter from "./components/v2/DoctorMobileFooter";
import DoctorPageTransition from "./components/v2/DoctorPageTransition";
import { 
  ArrowLeft, 
  Activity, 
  Droplets,
  Ruler,
  Weight,
  User,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Bot,
  Calendar,
  ChevronDown,
  Check
} from "lucide-react";

// Interfaces moved top-level for reuse
interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timestamp: any; 
}

interface ChatSession {
  id: string;
  title: string;
  date: string;
  preview: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updatedAt: any;
}

// MOCK DATA FOR DEMO (Defined outside to avoid re-renders)
const MOCK_SESSIONS_DATA: ChatSession[] = [
  {
    id: "session-1",
    title: "Initial Consultation check",
    date: "05/03/2026",
    preview: "Discussed symptoms of persistent headache and fatigue...",
    updatedAt: new Date()
  },
  {
    id: "session-2", 
    title: "Follow-up Check",
    date: "12/02/2026", 
    preview: "Reviewing medication outcomes...",
    updatedAt: new Date(Date.now() - 86400000)
  }
];

const MOCK_MESSAGES_DATA: Record<string, Message[]> = {
  "session-1": [
      { id: "m1", text: "I've been feeling a persistent headache for the past 3 days.", sender: "user", timestamp: new Date(Date.now() - 10000000) },
      { id: "m2", text: "I understand. Can you describe the pain? Is it throbbing or constant?", sender: "ai", timestamp: new Date(Date.now() - 9000000) },
      { id: "m3", text: "It's mostly throbbing, especially in the mornings.", sender: "user", timestamp: new Date(Date.now() - 8000000) },
      { id: "m4", text: "**Noted.** Based on your symptoms, I recommend monitoring your blood pressure. \n\n*   Drink plenty of water\n*   Rest in a dark room\n\nIf it persists, please consult a specialist.", sender: "ai", timestamp: new Date(Date.now() - 7000000) },
      { id: "m5", text: "Okay, I will try that. Thank you.", sender: "user", timestamp: new Date(Date.now() - 6000000) }
  ],
  "session-2": [
      { id: "m5", text: "The medication seems to be working.", sender: "user", timestamp: new Date() },
      { id: "m6", text: "That is great news! Have you experienced any side effects?", sender: "ai", timestamp: new Date() }
  ]
};

interface AppointmentRecord {
  id: string;
  status: string;
  doctorName?: string;
  consultationEndedByDoctor?: boolean;
  ratingSubmitted?: boolean;
}

interface PatientFirestoreData {
  name?: string;
  fullName?: string;
  dob?: string;
  gender?: string;
  height?: string;
  weight?: string;
  bmi?: string;
  bloodType?: string;
  history?: string[];
  allergies?: string;
  medications?: string;
  insurance?: string;
  address?: string;
  emergencyContact?: { name: string; relation: string; phone: string };
  photoURL?: string;
  image?: string;
  lastVitals?: { bp: string; heartRate: string; temp: string; oxygen: string };
  phone?: string;
  phoneNumber?: string;
  email?: string;
}

export default function PatientDetails() { // Dynamic route /doctor/patients/:id
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  const [patientData, setPatientData] = useState<PatientFirestoreData | null>(null);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [activeAppointment, setActiveAppointment] = useState<AppointmentRecord | null>(null);
  const [endingConsultation, setEndingConsultation] = useState(false);

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

  // Fetch the confirmed/active appointment between this doctor and this patient
  useEffect(() => {
    const fetchAppointment = async () => {
      if (!id || !currentUser) return;
      try {
        const q = query(
          collection(db, "appointments"),
          where("doctorId", "==", currentUser.uid),
          where("patientId", "==", id)
        );
        const snap = await getDocs(q);
        // Pick the most relevant: confirmed first, then pending, then completed
        const priority = ["confirmed", "pending", "completed"];
        let best: AppointmentRecord | null = null;
        snap.forEach((d) => {
          const data = d.data();
          const appt: AppointmentRecord = { id: d.id, status: String(data.status || ""), doctorName: String(data.doctorName || ""), consultationEndedByDoctor: Boolean(data.consultationEndedByDoctor), ratingSubmitted: Boolean(data.ratingSubmitted) };
          if (!best) { best = appt; return; }
          if (priority.indexOf(appt.status) < priority.indexOf(best.status)) best = appt;
        });
        setActiveAppointment(best);
      } catch (err) {
        console.error("Error fetching appointment", err);
      }
    };
    fetchAppointment();
  }, [id, currentUser]);

  const doEndConsultation = async () => {
    if (!activeAppointment || !id) return;
    try {
      setEndingConsultation(true);
      await updateDoc(doc(db, "appointments", activeAppointment.id), {
        status: "completed",
        consultationEndedByDoctor: true,
        consultationEndedAt: new Date().toISOString(),
        allowRating: true,
        ratingSubmitted: false,
        updatedAt: new Date().toISOString(),
      });

      const drName = activeAppointment.doctorName || "your doctor";
      await addDoc(collection(db, "notifications"), {
        userId: id,
        type: "appointment",
        title: "Rate Your Doctor",
        message: `Your consultation with ${drName} has ended. How was your experience?`,
        details: activeAppointment.id,
        read: false,
        createdAt: serverTimestamp(),
      });

      setActiveAppointment((prev) => prev ? { ...prev, status: "completed", consultationEndedByDoctor: true } : prev);
      toast.success("Consultation ended. Patient has been notified.");
    } catch (err) {
      console.error("Error ending consultation", err);
      toast.error("Failed to end consultation. Please try again.");
    } finally {
      setEndingConsultation(false);
    }
  };

  const handleEndConsultation = () => {
    toast("Are you sure you want to end this consultation?", {
      description: "The patient will be notified and can rate their experience.",
      action: {
        label: "End Consultation",
        onClick: () => { void doEndConsultation(); },
      },
    });
  };

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
    image: patientData?.photoURL || patientData?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(patientData?.name || patientData?.fullName || 'P')}&background=0D8ABC&color=fff`,
    lastVitals: patientData?.lastVitals || { bp: "--/--", heartRate: "-- bpm", temp: "--.-F", oxygen: "--%" },
    phone: patientData?.phone || patientData?.phoneNumber || "---",
    email: patientData?.email || "---"
  };
  
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isSessionDropdownOpen, setIsSessionDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionDropdownRef = useRef<HTMLDivElement>(null);

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
  }, [messages, activeSessionId]);

  // Load Chat Sessions (Mock + Firebase Fallback Logic)
  useEffect(() => {
    if (activeTab === 'ai-assistant') {
        // Use Mock data primarily for demo visualization if "nothing is showing"
        // In a real app, this would be the database success callback
        setLoadingSessions(true);
        setTimeout(() => {
            setChatSessions(MOCK_SESSIONS_DATA);
            if (MOCK_SESSIONS_DATA.length > 0 && !activeSessionId) {
                setActiveSessionId(MOCK_SESSIONS_DATA[0].id);
            }
            setLoadingSessions(false);
        }, 500);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]); // activeSessionId intentionally omitted to prevent session reset on selection

  // Load Messages when Session Changes
  useEffect(() => {
    if (activeSessionId) {
        setLoadingMessages(true);
        // Simulate fetch delay
        setTimeout(() => {
            const sessionMessages = MOCK_MESSAGES_DATA[activeSessionId] || [];
            setMessages(sessionMessages);
            setLoadingMessages(false);
        }, 300);
    } else {
        setMessages([]);
    }
  }, [activeSessionId]);






  if (loadingPatient) {
    return <div className="flex h-screen items-center justify-center bg-slate-50"><div className="w-12 h-12 border-4 border-[#0A6ED1] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (loadingPatient) {
    return <div className="flex h-screen items-center justify-center bg-slate-50"><div className="w-12 h-12 border-4 border-[#0A6ED1] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-['Manrope']">
      <DoctorSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <DoctorHeader 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <DoctorPageTransition className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Link to="/doctor/patients" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0A6ED1] mb-6 font-medium transition-colors">
              <ArrowLeft size={20} /> Back to Patient List
            </Link>

            {/* Patient Header Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
              <img src={patient.image} alt={patient.name} className="w-32 h-32 rounded-2xl object-cover shadow-lg border-4 border-slate-50" />
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">{patient.name}</h1>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-slate-500 text-sm">
                      <span className="bg-slate-100 px-3 py-1 rounded-full">{patient.age} yrs</span>
                      <span className="bg-slate-100 px-3 py-1 rounded-full">{patient.gender}</span>
                      <span>ID: #{patient.id}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mt-2 md:mt-0">
                    {activeAppointment && activeAppointment.status !== "completed" && (
                      <button
                        onClick={handleEndConsultation}
                        disabled={endingConsultation}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl font-bold hover:bg-red-100 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm w-full sm:w-auto"
                      >
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        {endingConsultation ? "Ending..." : "Stop Appointment"}
                      </button>
                    )}
                    {activeAppointment?.status === "completed" && (
                      <span className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl font-semibold text-sm w-full sm:w-auto">
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                        Consultation Ended
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>


            {/* Tabs for Navigation */}
            <div className="flex items-center gap-8 border-b border-slate-200 mb-6 bg-white px-2 rounded-t-lg">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`pb-4 px-2 text-sm font-bold transition-all relative ${
                    activeTab === 'profile' ? 'text-[#0A6ED1]' : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    Patient Details
                    {activeTab === 'profile' && (
                    <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0A6ED1]" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('ai-assistant')}
                    className={`pb-4 px-2 text-sm font-bold transition-all relative flex items-center gap-2 ${
                    activeTab === 'ai-assistant' ? 'text-[#0A6ED1]' : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    AI Chat History
                    {activeTab === 'ai-assistant' && (
                    <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0A6ED1]" />
                    )}
                </button>
            </div>

            {/* Content Tabs */}
            <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {/* Column 1: Personal Info & Contact */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                            <User className="text-[#0A6ED1]" />
                            Personal Information
                        </h3>
                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <Mail className="text-slate-400 mt-1" size={18} />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Email</p>
                                    <p className="text-slate-900">{patient.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Phone className="text-slate-400 mt-1" size={18} />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Phone</p>
                                    <p className="text-slate-900">{patient.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <MapPin className="text-slate-400 mt-1" size={18} />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Address</p>
                                    <p className="text-slate-900">{patient.address}</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <Activity className="text-slate-400 mt-1" size={18} />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-semibold">Date of Birth</p>
                                    <p className="text-slate-900">{patient.dob} ({patient.age} yrs)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 border-l-4 border-l-red-500">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-600">
                            <AlertCircle size={20} />
                            Emergency Contact
                        </h3>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 font-bold text-lg">
                                {patient.emergencyContact.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">{patient.emergencyContact.name}</p>
                                <p className="text-sm text-slate-500">{patient.emergencyContact.relation} • {patient.emergencyContact.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: Physical Attributes */}
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                      <Activity className="text-[#0A6ED1]" />
                      Physical Attributes
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 bg-blue-100 text-[#0A6ED1] rounded-full flex items-center justify-center">
                                <Ruler size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-semibold uppercase">Height</p>
                                <p className="font-bold text-slate-900">{patient.height}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                <Weight size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-semibold uppercase">Weight</p>
                                <p className="font-bold text-slate-900">{patient.weight}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                                <Activity size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-semibold uppercase">BMI</p>
                                <p className="font-bold text-slate-900">{patient.bmi}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                                <Droplets size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-semibold uppercase">Blood Type</p>
                                <p className="font-bold text-slate-900">{patient.bloodType}</p>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'ai-assistant' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-175 overflow-hidden relative"
              >
                  <div className="flex flex-1 h-full overflow-hidden flex-col items-center justify-start relative">
                        {/* Centered Date Header for Session with Dropdown */}
                        {chatSessions.length > 0 && (
                            <div className="absolute top-8 left-0 right-0 z-30 flex justify-center w-full pointer-events-none">
                                <div className="pointer-events-auto relative" ref={sessionDropdownRef}>
                                    <button 
                                        onClick={() => setIsSessionDropdownOpen(!isSessionDropdownOpen)}
                                        className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all rounded-full px-5 py-2 flex items-center gap-3 text-sm font-semibold text-slate-600 group active:scale-95"
                                    >
                                        <Calendar size={14} className="text-[#0A6ED1]" />
                                        <span>
                                            <span className="text-slate-400 font-medium mr-2">Consultation Session</span>
                                            <span className="text-slate-800">•</span>
                                            <span className="ml-2 text-slate-800">
                                                {chatSessions.find(s => s.id === activeSessionId)?.date || "Select Session"}
                                            </span>
                                        </span>
                                        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isSessionDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isSessionDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-72 max-h-80 overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 custom-scrollbar"
                                            >
                                                <div className="text-xs font-bold text-slate-400 px-3 py-2 uppercase tracking-wider">History</div>
                                                {chatSessions.map((session) => (
                                                    <button
                                                        key={session.id}
                                                        onClick={() => {
                                                            setActiveSessionId(session.id);
                                                            setIsSessionDropdownOpen(false);
                                                        }}
                                                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between group ${
                                                            activeSessionId === session.id 
                                                            ? 'bg-blue-50 text-[#0A6ED1]' 
                                                            : 'hover:bg-slate-50 text-slate-600'
                                                        }`}
                                                    >
                                                        <div className="flex flex-col overflow-hidden">
                                                            <span className="font-semibold truncate">{session.title || "Untitled"}</span>
                                                            <span className="text-[10px] opacity-70">{session.date}</span>
                                                        </div>
                                                        {activeSessionId === session.id && <Check size={14} />}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}
                    
                        {/* Messages Content */}
                        <div className="w-full max-w-4xl flex-1 overflow-y-auto px-4 md:px-8 pt-24 pb-12 space-y-10 scroll-smooth bg-white custom-scrollbar">
                            {loadingSessions ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                                    <div className="loading loading-spinner text-[#0A6ED1] loading-lg"></div>
                                    <p className="text-sm">Loading Chat History...</p>
                                </div>
                            ) : !activeSessionId ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 h-full">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                            <Bot size={40} className="text-slate-300" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-700 mb-2">No History Selected</h3>
                                        <p className="max-w-xs text-center text-sm">Please select a consultation session from the dropdown above to view the conversation.</p>
                                </div>
                            ) : loadingMessages ? (
                                <div className="flex justify-center p-12"><span className="loading loading-spinner text-[#0A6ED1] loading-md"></span></div>
                            ) : (
                                <AnimatePresence initial={false}>
                                    {messages.map((msg) => (
                                        <motion.div 
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`w-full flex ${msg.sender === "user" ? "justify-end" : "justify-start"} group/message`}
                                        >
                                            <div className={`flex gap-4 max-w-[85%] md:max-w-[80%] items-end ${msg.sender === "user" ? "flex-row" : "flex-row-reverse"}`}>
                                                
                                                {/* Content Bubble */}
                                                <div className="flex flex-col">
                                                    <div className={`px-6 py-4 text-[15px] leading-relaxed relative shadow-md ${
                                                        msg.sender === "user" 
                                                      ? "bg-[#0A6ED1] text-white rounded-3xl rounded-br-sm"
                                                      : "bg-white border border-slate-100 text-slate-700 rounded-3xl rounded-bl-sm shadow-slate-200/50"
                                                    }`}>
                                                        {msg.sender === "user" ? (
                                                            <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                                                        ) : (
                                                            <div className="prose prose-sm max-w-none dark:prose-invert">
                                                                <ReactMarkdown components={{
                                                                    ul: ({...props}) => <ul className="list-disc pl-4 my-2 text-slate-600" {...props} />,
                                                                    ol: ({...props}) => <ol className="list-decimal pl-4 my-2 text-slate-600" {...props} />,
                                                                    li: ({...props}) => <li className="my-1" {...props} />,
                                                                    p: ({...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                                                    strong: ({...props}) => <strong className="font-semibold text-slate-900" {...props} />,
                                                                }}>
                                                                    {msg.text}
                                                                </ReactMarkdown>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className={`text-[11px] text-slate-400 mt-2 font-medium flex items-center gap-1 ${
                                                        msg.sender === "user" ? "justify-end mr-1" : "justify-start ml-1"
                                                    }`}>
                                                        {msg.timestamp instanceof Date 
                                                            ? msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                            : "--:--"
                                                        }
                                                        {msg.sender === "user" && <span className="text-[#0A6ED1] font-bold text-[10px] ml-1">Sent</span>}
                                                    </span>
                                                </div>

                                                {/* Avatar - Outside Bubble */}
                                                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center border mb-8 shadow-sm ${
                                                    msg.sender === "user" 
                                                    ? "bg-blue-50 border-blue-100 text-[#0A6ED1]" 
                                                    : "bg-white border-slate-200 text-slate-500"
                                                }`}>
                                                    {msg.sender === "user" ? <User size={18} strokeWidth={2} /> : <Bot size={20} strokeWidth={1.5} />}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                  </div>
              </motion.div>
            )}
            </AnimatePresence>
          </DoctorPageTransition>
        </div>

        <DoctorMobileFooter />
      </main>
    </div>
  );
}

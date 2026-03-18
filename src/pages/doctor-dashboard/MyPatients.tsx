import { useState, useEffect } from "react";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaCheck, FaTimes, FaClock, FaEllipsisH, FaUserInjured, FaCommentMedical } from "react-icons/fa";
import { MessageCircle, User, Bot, Send, Calendar } from "lucide-react";
import { toast } from "sonner";
import { collection, query, where, getDocs, updateDoc, doc, getDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import DoctorMobileFooter from "./components/v2/DoctorMobileFooter";
import DoctorPageTransition from "./components/v2/DoctorPageTransition";

type PatientDetails = {
    age: string;
    gender: string;
    symptoms: string[];
    history: string[];
    lastVitals: {
        bp: string;
        heartRate: string;
        temp: string;
        weight: string;
    };
    email: string;
    phone: string;
    height: string;
    weight: string;
    bloodType: string;
    genotype: string;
    address: string;
    emergencyContact: {
        name: string;
        relation: string;
        phone: string;
    };
};

type PatientRow = {
    id: string;
    name: string;
    patientId?: string;
    image?: string | null;
    type?: string;
    date?: string;
    time?: string;
    reason?: string;
    condition?: string;
    lastVisit?: string;
    status?: string;
    shareAIChat?: boolean;
    [key: string]: unknown;
};

type ChatMessage = {
    role: string;
    content: string;
    timestamp: Date | { toDate: () => Date };
};

type SelectedPatient = PatientRow & PatientDetails;

const defaultPatientDetails: PatientDetails = {
    age: 'Age',
    gender: "Gender",
    symptoms: ['Symptom'],
    history: ['Medical History'],
    lastVitals: { bp: "Blood Pressure", heartRate: "Heart Rate", temp: "Temperature", weight: "Weight" },
    email: "Email",
    phone: "Phone",
    height: "Height",
    weight: "Weight",
    bloodType: "Blood Type",
    genotype: "Genotype",
    address: "Address",
    emergencyContact: {
        name: "Contact Name",
        relation: "Relationship",
        phone: "Contact Phone"
    }
};

export default function MyPatients() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("requests");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Real Data
    const [requests, setRequests] = useState<PatientRow[]>([]);
    const [patients, setPatients] = useState<PatientRow[]>([]);
  
  // Chat Modal State
    const [selectedPatient, setSelectedPatient] = useState<SelectedPatient | null>(null);
  const [modalTab, setModalTab] = useState<'details' | 'chat'>('details');
    const [endingAppointmentId, setEndingAppointmentId] = useState<string | null>(null);

    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);

    const fetchChatHistory = async () => {
      setLoadingChat(true);
      setChatMessages([]);

      // Simulate network delay for realistic feel
      await new Promise(resolve => setTimeout(resolve, 800));

      const placeholderChat = [
          { 
              role: 'system', 
              content: 'Session', 
              timestamp: new Date(Date.now() - 86400000) 
          },
          { 
              role: 'user', 
              content: "Patient Message", 
              timestamp: new Date(Date.now() - 86400000 + 1000 * 60 * 2) 
          },
          { 
              role: 'assistant', 
              content: "AI Response", 
              timestamp: new Date(Date.now() - 86400000 + 1000 * 60 * 3) 
          },
          { 
              role: 'user', 
              content: "Follow-up Message", 
              timestamp: new Date(Date.now() - 86400000 + 1000 * 60 * 5) 
          },
          { 
              role: 'assistant', 
              content: "Follow-up Response", 
              timestamp: new Date(Date.now() - 86400000 + 1000 * 60 * 6) 
          }
      ];

      setChatMessages(placeholderChat);
      setLoadingChat(false);
      
      /* 
      // REAL FIRESTORE IMPLEMENTATION (Commented out for now)
      try {
          // Get most recent AI Conversation
          const q = query(
              collection(db, "patients", patientId, "aiConversations"), 
              orderBy("lastUpdated", "desc"), 
              limit(1)
          );
          
          const snap = await getDocs(q);
          
          if (!snap.empty) {
              const conversationId = snap.docs[0].id;
              // Get messages
              const msgQ = query(
                  collection(db, "patients", patientId, "aiConversations", conversationId, "messages"),
                  orderBy("timestamp", "asc")
              );
              
              const msgSnap = await getDocs(msgQ);
              const msgs = msgSnap.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
              }));
              
              if (msgs.length > 0) {
                 setChatMessages(msgs);
                 return;
              }
          } 
          // If execution reaches here, it falls back to empty or demo above
      } catch (error) {
          console.error("Error fetching chat:", error);
          toast.error("Failed to load chat history.");
      } 
      */
  };

  const handlePatientClick = (patient: PatientRow) => {
    const details = defaultPatientDetails;
      const merged: SelectedPatient = { ...details, ...patient };
      setSelectedPatient(merged);
      setModalTab('details');
  };

    const toDateValue = (timestamp: ChatMessage["timestamp"] | undefined) => {
        if (!timestamp) return new Date();
        if (timestamp instanceof Date) return timestamp;
        if (typeof timestamp === "object" && "toDate" in timestamp && typeof timestamp.toDate === "function") {
            return timestamp.toDate();
        }
        return new Date();
    };


  useEffect(() => {
    const fetchData = async () => {
      // If no user, stop loading immediately
      if (!currentUser) {
          setIsLoading(false);
          return;
      }
      
      setIsLoading(true);
      try {
        const q = query(
             collection(db, "appointments"),
             where("doctorId", "==", currentUser.uid)
        );
        
        const snapshot = await getDocs(q);
        const pending: PatientRow[] = [];
        const uniquePatients = new Map<string, PatientRow>();

        // Pre-fetch actual patient docs to join on the fly
        const patientDataMap = new Map<string, Record<string, unknown>>();
        for (const docSnap of snapshot.docs) {
           const data = docSnap.data();
           if (data.patientId && !patientDataMap.has(data.patientId)) {
               try {
                   const pDoc = await getDoc(doc(db, "patients", data.patientId));
                   if (pDoc.exists()) {
                       patientDataMap.set(data.patientId, pDoc.data());
                   }
               } catch(e) { console.error("Error pre-fetching patient docs:", e); }
           }
        }

        const calculateAge = (dob: string) => {
            if (!dob) return "Age";
            const diff_ms = Date.now() - new Date(dob).getTime();
            const age_dt = new Date(diff_ms); 
            return Math.abs(age_dt.getUTCFullYear() - 1970) + " yrs";
        };

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const pData = patientDataMap.get(data.patientId) || {};
            
            const appointment = {
                id: docSnap.id,
                ...data,
                name: pData.fullName || data.patientName || "Unknown Patient",
                time: data.time || "Time",
                type: data.type || "Type",
                age: typeof pData.dob === 'string' ? calculateAge(pData.dob) : (data.patientAge || "Age"),
                reason: data.notes || data.reason || "Reason",
                image: pData.profilePhotoUrl || data.patientImage || null,
                date: data.date || "Date",
                
                // Inject deeper DB fields for the details modal
                bloodType: pData.bloodType || "--",
                genotype: pData.genotype || "--",
                height: pData.height || "--",
                weight: pData.weight || "--",
                phone: pData.phoneNumber || data.patientPhone || "--",
                email: pData.email || data.patientEmail || "--",
                address: pData.address || "--",
                gender: pData.gender || "--",
                emergencyContact: pData.emergencyContact || { name: "--", relation: "--", phone: "--" }
            };

            if (data.status === 'pending') {
                pending.push(appointment);
            } else if (data.status === 'confirmed' || data.status === 'completed') {
                if (!uniquePatients.has(data.patientId)) {
                    uniquePatients.set(data.patientId, {
                        ...appointment,
                        lastVisit: data.date,
                        condition: appointment.reason,
                        status: String(data.status || "active")
                    });
                } else {
                     // Update last visit if newer
                     const existing = uniquePatients.get(data.patientId);
                     if (existing && existing.lastVisit && new Date(data.date) > new Date(existing.lastVisit)) {
                         existing.lastVisit = data.date;
                         // Keep most recent appointment details
                         uniquePatients.set(data.patientId, {
                            ...existing,
                            lastVisit: data.date,
                            condition: appointment.reason,
                            status: String(data.status || existing.status || "active")
                         });
                     }
                }
            }
        });

        setRequests(pending);
        setPatients(Array.from(uniquePatients.values()));

      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Failed to load patient data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleAccept = async (id: string) => {
      try {
          await updateDoc(doc(db, "appointments", id), { status: 'confirmed' });
          toast.success("Appointment confirmed");
          // Update local state
          const accepted = requests.find(r => r.id === id);
          if (accepted) {
              setRequests(prev => prev.filter(r => r.id !== id));
              setPatients(prev => {
                  // Check if patient already exists
                  if (prev.some(p => p.patientId === accepted.patientId)) return prev;
                  return [...prev, { ...accepted, status: 'Active', lastVisit: accepted.date, condition: accepted.reason }];
              });
          }
      } catch (error) {
          console.error("Error accepting appointment:", error);
          toast.error("Failed to confirm appointment");
      }
  };

  const handleDecline = async (id: string) => {
      try {
          await updateDoc(doc(db, "appointments", id), { status: 'cancelled' });
          toast.success("Appointment declined");
          setRequests(prev => prev.filter(r => r.id !== id));
      } catch (error) {
          console.error("Error declining appointment:", error);
          toast.error("Failed to decline appointment");
      }
  };

  const endConsultation = async (appointmentId: string) => {
      try {
          setEndingAppointmentId(appointmentId);
          await updateDoc(doc(db, "appointments", appointmentId), {
              status: 'completed',
              consultationEndedByDoctor: true,
              consultationEndedAt: new Date().toISOString(),
              allowRating: true,
              ratingSubmitted: false,
              updatedAt: new Date().toISOString(),
          });

          const patientUid = selectedPatient?.patientId;
          const drName = (selectedPatient?.['doctorName'] as string) || "your doctor";
          if (patientUid) {
              await addDoc(collection(db, "notifications"), {
                  userId: patientUid,
                  type: "appointment",
                  title: "Rate Your Doctor",
                  message: `Your consultation with ${drName} has ended. How was your experience?`,
                  details: appointmentId,
                  read: false,
                  createdAt: serverTimestamp(),
              });
          }

          setRequests(prev => prev.filter(r => r.id !== appointmentId));
          setPatients(prev => prev.map((p) => (
              p.id === appointmentId ? { ...p, status: 'completed', lastVisit: new Date().toISOString().split('T')[0] } : p
          )));
          setSelectedPatient((prev) => (prev && prev.id === appointmentId ? { ...prev, status: 'completed' } : prev));

          toast.success("Consultation ended. Patient has been notified.");
      } catch (error) {
          console.error("Error ending consultation:", error);
          toast.error("Failed to end consultation. Please try again.");
      } finally {
          setEndingAppointmentId(null);
      }
  };

  const handleEndConsultation = (appointmentId: string) => {
      toast("Are you sure you want to end consultation?", {
          description: "This will notify the patient and unlock doctor rating.",
          action: {
              label: "End Consultation",
              onClick: () => {
                  void endConsultation(appointmentId);
              },
          },
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-['Manrope']">
      <DoctorSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <DoctorHeader 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
        />
        
                <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
                    <DoctorPageTransition className="max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">My Patients</h1>
                <p className="text-slate-500">Manage your patient list and appointment requests.</p>
              </div>
              
              <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                <button 
                  onClick={() => setActiveTab("requests")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'requests' ? 'bg-[#0A6ED1] text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Requests {requests.length > 0 && <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded text-xs">{requests.length}</span>}
                </button>
                <button 
                   onClick={() => setActiveTab("all")}
                   className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'all' ? 'bg-[#0A6ED1] text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  All Patients
                </button>
              </div>
            </header>

            {/* Search Bar */}
            <div className="relative mb-6">
               <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search by name, ID, or condition..." 
                 className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A6ED1]/20 focus:border-[#0A6ED1] outline-none transition-all shadow-sm"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A6ED1]"></div>
                </div>
            ) : activeTab === "requests" ? (
              <div className="grid gap-4">
                {requests.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                    No pending requests.
                  </div>
                ) : (
                  requests.map((req) => (
                    <div key={req.id} onClick={() => handlePatientClick(req)} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        {req.image ? (
                             <img src={req.image} alt={req.name} className="w-16 h-16 rounded-full object-cover bg-slate-100" />
                        ) : (
                             <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl">
                                 <FaUserInjured />
                             </div>
                        )}
                        <div>
                          <h3 className="lg:text-lg font-bold text-slate-900">{req.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                            <span className="bg-blue-50 text-[#0A6ED1] px-2 py-0.5 rounded text-xs font-semibold">{req.type}</span>
                            <span>• {req.date}</span>
                            <span>• {req.reason}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right hidden md:block">
                            <div className="text-sm font-bold text-slate-900 flex items-center justify-end gap-2">
                                <FaClock className="text-orange-500" /> {req.time}
                            </div>
                            <div className="text-xs text-slate-400">Requested Time</div>
                        </div>

                        <div className="flex items-center gap-3">
                            {req.shareAIChat && (
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePatientClick(req);
                                        setModalTab('chat');
                                        fetchChatHistory();
                                    }} 
                                    className="p-2 bg-blue-100 text-[#0A6ED1] rounded-lg hover:bg-blue-200 transition-colors" 
                                    title="View AI Chat History"
                                >
                                    <FaCommentMedical />
                                </button>
                            )}
                            <button onClick={(e) => { e.stopPropagation(); handleAccept(req.id); }} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors" title="Accept">
                                <FaCheck />
                            </button>
                             <button onClick={(e) => { e.stopPropagation(); handleDecline(req.id); }} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors" title="Decline">
                                <FaTimes />
                            </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : patients.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 text-3xl">
                      <FaUserInjured />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">No patients found</h3>
                  <p className="text-slate-500">Your patient list is currently empty.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Patient</th>
                      <th className="px-6 py-4">Condition</th>
                      <th className="px-6 py-4">Last Visit</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {patients
                      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((patient) => (
                        <tr key={patient.id} onClick={() => handlePatientClick(patient)} className="hover:bg-slate-50/50 transition-colors cursor-pointer text-slate-900 border-b border-slate-50">
                        <td className="px-6 py-4 flex items-center gap-3">
                             {patient.image ? (
                                  <img src={patient.image} alt={patient.name} className="w-10 h-10 rounded-full object-cover" />
                             ) : (
                                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                     <FaUserInjured />
                                  </div>
                             )}
                          <div>
                            <div className="font-bold text-slate-900">{patient.name}</div>
                            {/* <div className="text-xs text-slate-400">ID: #{patient.id}</div> */}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{patient.condition}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{patient.lastVisit}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {patient.shareAIChat && (
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePatientClick(patient);
                                        setModalTab('chat');
                                        fetchChatHistory();
                                    }}
                                    className="text-[#0A6ED1] hover:text-[#095bb0] p-1"
                                    title="View AI Chat"
                                >
                                    <FaCommentMedical />
                                </button>
                            )}
                            <button onClick={(e) => { e.stopPropagation(); /* Add action here */ }} className="text-slate-400 hover:text-[#0A6ED1] p-1">
                                <FaEllipsisH />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
                    </DoctorPageTransition>
        </div>

                <DoctorMobileFooter />
      </main>

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/50 z-100 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedPatient(null)}>
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                    <div className="flex gap-4">
                        {selectedPatient.image ? (
                             <img src={selectedPatient.image} alt={selectedPatient.name} className="w-20 h-20 rounded-2xl object-cover shadow-sm border border-slate-200" />
                        ) : (
                             <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-3xl">
                                 <FaUserInjured />
                             </div>
                        )}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{selectedPatient.name}</h2>
                            <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                                <span className="bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">{selectedPatient.age} yrs</span>
                                <span className="bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm capitalize">{selectedPatient.gender}</span>
                                <span className="text-slate-400">ID: #{selectedPatient.patientId}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setSelectedPatient(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 px-6">
                    <button 
                        onClick={() => setModalTab('details')}
                        className={`py-4 px-4 font-semibold text-sm border-b-2 transition-colors ${modalTab === 'details' ? 'border-[#0A6ED1] text-[#0A6ED1]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                        Patient Details
                    </button>
                    <button 
                        onClick={() => {
                            setModalTab('chat');
                            fetchChatHistory();
                        }}
                        className={`py-4 px-4 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 ${modalTab === 'chat' ? 'border-[#0A6ED1] text-[#0A6ED1]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                        AI Chat History
                        {loadingChat && <div className="w-3 h-3 rounded-full border-2 border-slate-300 border-t-[#0A6ED1] animate-spin"></div>}
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                    {modalTab === 'details' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <div className="w-1 h-5 bg-[#0A6ED1] rounded-full"></div>
                                        Reason for Visit
                                    </h3>
                                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-slate-700 italic">
                                        "{selectedPatient.condition || selectedPatient.reason}"
                                    </div>
                                </div>

                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
                                        Physical Profile
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-slate-50 rounded-xl">
                                            <div className="text-xs text-slate-400 font-bold uppercase">Height</div>
                                            <div className="text-lg font-bold text-slate-800">{selectedPatient.height || "--"}</div>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-xl">
                                            <div className="text-xs text-slate-400 font-bold uppercase">Weight</div>
                                            <div className="text-lg font-bold text-slate-800">{selectedPatient.weight || "--"}</div>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-xl">
                                            <div className="text-xs text-slate-400 font-bold uppercase">Blood Type</div>
                                            <div className="text-lg font-bold text-slate-800">{selectedPatient.bloodType || "--"}</div>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-xl">
                                            <div className="text-xs text-slate-400 font-bold uppercase">Genotype</div>
                                            <div className="text-lg font-bold text-slate-800">{selectedPatient.genotype || "--"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                             <div className="space-y-6">
                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
                                        Contact Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                            <div className="text-slate-400 text-sm font-semibold uppercase w-16">Phone</div>
                                            <div className="text-slate-900 font-medium">{selectedPatient.phone || "--"}</div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                            <div className="text-slate-400 text-sm font-semibold uppercase w-16">Email</div>
                                            <div className="text-slate-900 font-medium truncate">{selectedPatient.email || "--"}</div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                            <div className="text-slate-400 text-sm font-semibold uppercase w-16">Address</div>
                                            <div className="text-slate-900 font-medium">{selectedPatient.address || "--"}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                                     <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <div className="w-1 h-5 bg-red-500 rounded-full"></div>
                                        Emergency Contact
                                    </h3>
                                    <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                        <p className="font-bold text-slate-900">{selectedPatient.emergencyContact?.name || "Not provided"}</p>
                                        <p className="text-sm text-slate-600 mt-1">{selectedPatient.emergencyContact?.relation || "--"} • {selectedPatient.emergencyContact?.phone || "--"}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                     <button 
                                        onClick={() => {
                                            toast.success("Consultation accepted");
                                            navigate("/doctor/dashboard");
                                        }}
                                        className="w-full py-3 bg-[#0A6ED1] text-white rounded-xl font-bold hover:bg-[#095bb0] shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
                                     >
                                        Start Consultation
                                     </button>
                                                 <button
                                                     onClick={() => handleEndConsultation(selectedPatient.id)}
                                                     disabled={selectedPatient.status?.toLowerCase() === 'completed' || endingAppointmentId === selectedPatient.id}
                                                     className="w-full py-3 bg-red-50 text-red-700 border border-red-200 rounded-xl font-bold hover:bg-red-100 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                                 >
                                                     {endingAppointmentId === selectedPatient.id
                                                        ? 'Ending...'
                                                        : selectedPatient.status?.toLowerCase() === 'completed'
                                                          ? 'Consultation Ended'
                                                          : 'Stop Appointment'}
                                                 </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden relative">
                           {loadingChat ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A6ED1] mb-3"></div>
                                    <p className="text-slate-500 text-sm font-medium">Loading consultation history...</p>
                                </div>
                           ) : null}

                           {chatMessages.length === 0 && !loadingChat ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                        <MessageCircle size={24} className="opacity-40" />
                                    </div>
                                    <p>No chat history available.</p>
                                </div>
                           ) : (
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                     <div className="flex items-center justify-center">
                                        <div className="bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-2 text-xs font-semibold text-slate-500">
                                            <Calendar size={12} className="text-[#0A6ED1]" />
                                            <span>Consultation Session</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span>{toDateValue(chatMessages[0]?.timestamp).toLocaleDateString()}</span>
                                        </div>
                                     </div>

                                     {chatMessages.filter(m => m.role !== 'system').map((msg, idx) => (
                                        <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            {msg.role !== 'user' && (
                                                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm mt-1">
                                                    <Bot size={16} className="text-[#0A6ED1]" />
                                                </div>
                                            )}

                                            <div className={`flex flex-col max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                                <div className={`p-4 rounded-2xl text-[14px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                                                    msg.role === 'user' 
                                                    ? 'bg-[#0A6ED1] text-white rounded-tr-none shadow-blue-500/10' 
                                                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                                                }`}>
                                                    {msg.content}
                                                </div>
                                                <span className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1 px-1">
                                                    {toDateValue(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    {msg.role === 'user' && <span className="text-[#0A6ED1]">Sent</span>}
                                                </span>
                                            </div>

                                            {msg.role === 'user' && (
                                                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-1">
                                                    <User size={16} className="text-[#0A6ED1]" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    <div className="h-4"></div>
                                </div>
                           )}
                           
                           {/* Read Only Input Area Visualization */}
                            <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-3 opacity-60 pointer-events-none select-none grayscale-[0.5]">
                                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-400 italic">
                                    End of consultation history
                                </div>
                                <div className="p-3 bg-slate-100 rounded-xl text-slate-400">
                                    <Send size={18} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaCheck, FaTimes, FaClock, FaEllipsisH, FaUserInjured } from "react-icons/fa";

import { toast } from "sonner";
import { collection, query, where, getDocs, updateDoc, doc, getDoc, addDoc, serverTimestamp, orderBy, limit } from "firebase/firestore";
import { db, model } from "../../lib/firebase";
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
    address: "Address"
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
  const [modalTab, setModalTab] = useState("overview");

  const handlePatientClick = (patient: PatientRow) => {
    const details = defaultPatientDetails;
      const merged: SelectedPatient = { ...details, ...patient };
      setSelectedPatient(merged);
      setModalTab("overview");
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
                bloodType: pData.bloodType || pData.bloodGroup || "--",
                genotype: pData.genotype || "--",
                height: pData.height || "--",
                weight: pData.weight || "--",
                phone: pData.phoneNumber || pData.phone || data.patientPhone || "--",
                email: pData.email || data.patientEmail || "--",
                address: pData.address || "--",
                gender: pData.gender || "--"
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

  
  const generateAndSaveAISummary = async (patientId: string, appointmentId: string) => {
    try {
      // 1. Fetch patient's AI chats
      const convosRef = collection(db, "patients", patientId, "aiConversations");
      const q = query(convosRef, orderBy("lastUpdated", "desc"), limit(1));
      const qSnap = await getDocs(q);
      
      if (qSnap.empty) return; // No chat history
      const latestConvoId = qSnap.docs[0].id;
      
      const msgsRef = collection(db, "patients", patientId, "aiConversations", latestConvoId, "messages");
      const msgsSnap = await getDocs(query(msgsRef, orderBy("timestamp", "asc")));
      
      if (msgsSnap.empty) return;
      
      let chatText = '';
      msgsSnap.docs.forEach(doc => {
        const d = doc.data();
        chatText += `${d.role === 'user' ? 'Patient' : 'AI'}: ${d.content}\n`;
      });
      
      // 2. Generate summary
      const prompt = `Summarize the following AI consultation history for a doctor to review. Make it concise and highlight the main symptoms, duration, and any important medical context. Do NOT include the full chat.\n\nChat:\n${chatText}`;
      const result = await model.generateContent(prompt);
      const summary = result.response.text();
      
      // 3. Save to appointment
      await updateDoc(doc(db, "appointments", appointmentId), {
        aiChatSummary: summary,
        aiChatSummaryGeneratedAt: new Date().toISOString()
      });
      console.log('AI Chat Summary generated and saved.');
    } catch (e) {
      console.error("Error generating AI chat summary:", e);
    }
  };

  const handleAccept = async (id: string) => {
      try {
          await updateDoc(doc(db, "appointments", id), { status: 'confirmed' });
          toast.success("Appointment confirmed");
          // Update local state
          const accepted = requests.find(r => r.id === id);
          if (accepted) {
              const drName = (accepted['doctorName'] as string) || "your doctor";
              if (accepted.patientId) {
                  await addDoc(collection(db, "notifications"), {
                      userId: accepted.patientId,
                      type: "appointment",
                      title: "Appointment Confirmed",
                      message: `Your appointment with ${drName} has been confirmed.`,
                      details: id,
                      read: false,
                      createdAt: serverTimestamp(),
                  });
              }

              if (accepted.shareAIChat) {
                  if (accepted.patientId) { generateAndSaveAISummary(accepted.patientId, accepted.id); }
              }
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
          
          const declined = requests.find(r => r.id === id);
          if (declined && declined.patientId) {
              const drName = (declined['doctorName'] as string) || "your doctor";
              await addDoc(collection(db, "notifications"), {
                  userId: declined.patientId,
                  type: "appointment",
                  title: "Appointment Cancelled",
                  message: `Your appointment with ${drName} has been cancelled.`,
                  details: id,
                  read: false,
                  createdAt: serverTimestamp(),
              });
          }

          setRequests(prev => prev.filter(r => r.id !== id));
      } catch (error) {
          console.error("Error declining appointment:", error);
          toast.error("Failed to decline appointment");
      }
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

                {/* Modal Tabs */}
                <div className="px-6 flex gap-6 border-b border-slate-100 bg-slate-50/50">
                    <button 
                        onClick={() => setModalTab("overview")} 
                        className={`py-3 px-2 font-medium text-sm border-b-2 transition-colors ${modalTab === "overview" ? "border-[#0A6ED1] text-[#0A6ED1]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                    >
                        Patient Overview
                    </button>
                    {((selectedPatient as any).aiChatSummary || selectedPatient.shareAIChat) && (
                        <button 
                            onClick={() => setModalTab("ai-chat")} 
                            className={`py-3 px-2 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${modalTab === "ai-chat" ? "border-[#0A6ED1] text-[#0A6ED1]" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                        >
                            <span className="w-2 h-2 rounded-full bg-[#0A6ED1]"></span>
                            AI Chat
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                    {modalTab === "overview" ? (
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
                                </div>
                            </div>
                        </div>
                    ) : modalTab === "ai-chat" ? (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[300px]">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <div className="w-1 h-5 bg-[#0A6ED1] rounded-full"></div>
                                AI Consultation Summary
                            </h3>
                            <div className="prose prose-slate max-w-none">
                                {typeof window !== 'undefined' && (selectedPatient as any).aiChatSummary ? (
                                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                                        {(selectedPatient as any).aiChatSummary}
                                    </div>
                                ) : selectedPatient.shareAIChat ? (
                                    <div className="text-center py-8">
                                        <p className="text-slate-500 mb-4">Patient consented to share AI assistant history. The summary will be generated once you accept the appointment, or you can generate it now.</p>
                                        <button 
                                            onClick={async () => {
                                                if (selectedPatient.patientId) {
                                                    toast.info("Generating summary...");
                                                    await generateAndSaveAISummary(selectedPatient.patientId, selectedPatient.id);
                                                    setSelectedPatient({...selectedPatient, ...{aiChatSummary: "Summary is being generated in the background. Please accept or close and reopen to see it."}});
                                                }
                                            }}
                                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                                        >
                                            Generate Summary Now
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-slate-500 italic">No AI discussion summary available for this request.</p>
                                )}
                            </div>
                            {(selectedPatient as any).aiChatSummaryGeneratedAt && (
                                <div className="mt-6 text-xs text-slate-400 border-t border-slate-100 pt-4 flex items-center gap-2">
                                    <FaClock />
                                    Generated on {new Date((selectedPatient as any).aiChatSummaryGeneratedAt).toLocaleString()}
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

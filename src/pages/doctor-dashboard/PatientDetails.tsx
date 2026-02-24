import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import { FaUserInjured, FaArrowLeft, FaComments, FaFileMedical, FaRobot, FaPaperPlane } from "react-icons/fa";

export default function PatientDetails() { // Dynamic route /doctor/patients/:id
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock Patient Data
  const patient = {
    id: id || "201",
    name: "David Miller",
    age: 45,
    gender: "Male",
    phone: "+1 (555) 123-4567",
    email: "david.miller@example.com",
    reason: "Consistent chest pain and shortness of breath.",
    symptoms: ["Chest Pain", "Shortness of Breath", "Fatigue"],
    history: ["Hypertension (2018)", "Family history of heart disease"],
    image: "https://i.pravatar.cc/150?u=david",
    lastVitals: { bp: "145/90", heartRate: "88 bpm", temp: "98.6°F", weight: "190 lbs" }
  };

  // Mock AI Chat
  const [chatMessages, setChatMessages] = useState([
    { role: "system", content: `Analyzing patient data for ${patient.name}... Ready to assist.` },
    { role: "assistant", content: `Based on ${patient.name}'s reported symptoms (Chest Pain, Shortness of Breath) and history of Hypertension, there is a risk of Angina or CAD. Recommended next steps: EKG and Stress Test.` }
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMsg = { role: "user", content: chatInput };
    setChatMessages([...chatMessages, newMsg]);
    setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I've noted that. Is there anything specific about the medication history you'd like me to cross-reference with these symptoms?" 
      }]);
    }, 1000);
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
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <Link to="/doctor/patients" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0A6ED1] mb-6 font-medium transition-colors">
              <FaArrowLeft /> Back to Patient List
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
                  <div className="flex bg-slate-100 rounded-lg p-1">
                    <button 
                      onClick={() => setActiveTab('overview')} 
                      className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'overview' ? 'bg-white shadow text-[#0A6ED1]' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      Overview
                    </button>
                    <button 
                      onClick={() => setActiveTab('ai-assistant')} 
                      className={`px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-all ${activeTab === 'ai-assistant' ? 'bg-[#0A6ED1] text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      <FaRobot /> AI Assistant
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-100 pt-6">
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Condition</div>
                    <div className="font-bold text-slate-900 text-lg">Hypertension</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Blood Pressure</div>
                    <div className="font-bold text-slate-900 text-lg">{patient.lastVitals.bp}</div>
                  </div>
                   <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Heart Rate</div>
                    <div className="font-bold text-slate-900 text-lg">{patient.lastVitals.heartRate}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weight</div>
                    <div className="font-bold text-slate-900 text-lg">{patient.lastVitals.weight}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                      <FaComments className="text-[#0A6ED1]" />
                      Reason for Visit
                    </h3>
                    <p className="text-slate-700 leading-relaxed bg-blue-50 p-4 rounded-xl border border-blue-100">
                      "{patient.reason}"
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                       <FaFileMedical className="text-[#0A6ED1]" />
                       Reported Symptoms
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {patient.symptoms.map(s => (
                        <span key={s} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h3 className="font-bold text-lg text-slate-900 mb-4">Medical History</h3>
                  <ul className="space-y-3">
                    {patient.history.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="w-2 h-2 mt-2 rounded-full bg-orange-400 shrink-0"></div>
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-8 pt-6 border-t border-slate-100 flex gap-3">
                    <button className="flex-1 bg-[#0A6ED1] text-white py-3 rounded-xl font-bold hover:bg-[#095bb0] shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all">
                      Accept Appointment
                    </button>
                     <button className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-50 active:scale-[0.98] transition-all">
                      Message Patient
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai-assistant' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 h-[600px] flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0A6ED1] rounded-full flex items-center justify-center text-white shadow-md">
                      <FaRobot />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">MediAI Assistant</div>
                      <div className="text-xs text-[#0A6ED1] font-medium">Analyzing {patient.name}'s data</div>
                    </div>
                  </div>
                  <button className="text-xs text-slate-400 hover:text-slate-600 underline">Clear Chat</button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-[#0A6ED1] text-white rounded-br-none shadow-lg shadow-blue-500/10' 
                        : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none shadow-sm'
                      }`}>
                        {msg.role === 'system' && <span className="text-xs font-bold uppercase tracking-wider opacity-50 block mb-1">System</span>}
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-slate-100 bg-white">
                  <div className="flex gap-2 relative">
                    <input 
                      type="text" 
                      placeholder="Ask AI about this patient..." 
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A6ED1]/20 focus:border-[#0A6ED1] transition-all"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#0A6ED1] text-white rounded-lg hover:bg-[#095bb0] transition-colors"
                    >
                      <FaPaperPlane className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

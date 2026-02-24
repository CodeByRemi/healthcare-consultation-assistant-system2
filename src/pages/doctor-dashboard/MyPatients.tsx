import { useState } from "react";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import { Link } from "react-router-dom";
import { FaSearch, FaCheck, FaTimes, FaClock, FaEllipsisH } from "react-icons/fa";

export default function MyPatients() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("requests");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock Request Data
  const [requests, setRequests] = useState([
    { id: 201, name: "David Miller", age: 45, reason: "Chest Pain", time: "Today 2:00 PM", status: "Pending", type: "New Patient", image: "https://i.pravatar.cc/150?u=david" },
    { id: 202, name: "Emma Wilson", age: 29, reason: "Annual Physical", time: "Tomorrow 10:00 AM", status: "Pending", type: "Returning", image: "https://i.pravatar.cc/150?u=emma" },
  ]);

  const [patients] = useState([
    { id: 1, name: "Alice Johnson", age: 34, lastVisit: "Feb 12, 2026", condition: "Hypertension", image: "https://i.pravatar.cc/150?u=alice" },
    { id: 2, name: "Robert Smith", age: 52, lastVisit: "Jan 30, 2026", condition: "Type 2 Diabetes", image: "https://i.pravatar.cc/150?u=robert" },
  ]);

  const handleAccept = (id: number) => {
    const patient = requests.find(r => r.id === id);
    if (patient) {
      setRequests(requests.filter(r => r.id !== id));
      // In a real app, this would verify and move to patients list
      // setPatients([...patients, { ...patient, lastVisit: "Today", condition: "Pending" }]);
    }
  };

  const handleReject = (id: number) => {
    setRequests(requests.filter(r => r.id !== id));
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
          <div className="max-w-7xl mx-auto">
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
                  Requests <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded text-xs">{requests.length}</span>
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

            {activeTab === "requests" ? (
              <div className="grid gap-4">
                {requests.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                    No pending requests.
                  </div>
                ) : (
                  requests.map((req) => (
                    <div key={req.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <img src={req.image} alt={req.name} className="w-16 h-16 rounded-full object-cover bg-slate-100" />
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{req.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                            <span className="bg-blue-50 text-[#0A6ED1] px-2 py-0.5 rounded text-xs font-semibold">{req.type}</span>
                            <span>• {req.age} yrs</span>
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
                            <Link to={`/doctor/patients/${req.id}`} className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-semibold text-sm hover:bg-slate-50">
                                Review Details
                            </Link>
                            <button onClick={() => handleAccept(req.id)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors" title="Accept">
                                <FaCheck />
                            </button>
                             <button onClick={() => handleReject(req.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors" title="Decline">
                                <FaTimes />
                            </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
                      <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img src={patient.image} alt={patient.name} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <div className="font-bold text-slate-900">{patient.name}</div>
                            <div className="text-xs text-slate-400">ID: #{patient.id + 2000}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{patient.condition}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{patient.lastVisit}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-[#0A6ED1]">
                            <FaEllipsisH />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
}

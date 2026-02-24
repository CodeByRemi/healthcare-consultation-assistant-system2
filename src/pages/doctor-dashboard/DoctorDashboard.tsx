import { useState } from "react";
import { Link } from "react-router-dom";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import { 
  FaUserInjured, 
  FaCalendarCheck, 
  FaClock, 
  FaEllipsisH,
  FaCheckCircle,
  FaArrowRight,
  FaChartLine
} from "react-icons/fa";

export default function DoctorDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Mock Data
  const stats = [
    { label: "Total Patients", value: "1,294", change: "+12%", icon: FaUserInjured, color: "bg-blue-500" },
    { label: "Appointments Today", value: "12", change: "4 pending", icon: FaCalendarCheck, color: "bg-green-500" },
    { label: "Pending Requests", value: "5", change: "-2 from yesterday", icon: FaClock, color: "bg-orange-500" },
  ];

  const upcomingAppointments = [
    { id: 1, patient: "Alice Johnson", time: "09:00 AM", type: "General Consultation", status: "Confirmed", image: "https://i.pravatar.cc/150?u=a042581f4e29026024d" },
    { id: 2, patient: "Robert Smith", time: "10:30 AM", type: "Follow-up", status: "Pending", image: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
    { id: 3, patient: "Emily Davis", time: "02:00 PM", type: "Health Checkup", status: "Confirmed", image: "https://i.pravatar.cc/150?u=a04258114e29026302d" },
  ];

  const patientQueue = [
    { id: 101, name: "Michael Brown", waitingTime: "15 mins", reason: "Headache" },
    { id: 102, name: "Sarah Wilson", waitingTime: "5 mins", reason: "Fever" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-['Manrope']">
      <DoctorSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <DoctorHeader 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Intro */}
            <header className="flex justify-between items-end">
                <div>
                   <h1 className="text-3xl md:text-4xl font-['Newsreader'] font-medium mb-1 text-slate-900">
                     Good morning, Dr. Smith
                   </h1>
                   <p className="text-slate-500">Here's what's happening in your clinic today.</p>
                </div>
                <div className="hidden md:block">
                  <span className="text-sm font-medium text-slate-500">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                            <span className={`text-xs font-semibold ${stat.change.includes('+') ? 'text-green-600' : 'text-slate-400'}`}>
                              {stat.change}
                            </span>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10 text-${stat.color.split('-')[1]}-600`}>
                            <stat.icon className="w-5 h-5 text-current" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upcoming Appointments */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <FaCalendarCheck className="text-[#0A6ED1]" />
                            Today's Schedule
                        </h2>
                        <Link to="/doctor/schedule" className="text-sm text-[#0A6ED1] font-medium hover:underline">View Calendar</Link>
                    </div>
                    
                     <div className="divide-y divide-slate-50">
                        {upcomingAppointments.map((appt) => (
                            <div key={appt.id} className="p-4 md:p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <img src={appt.image} alt={appt.patient} className="w-12 h-12 rounded-full object-cover border border-slate-100" />
                                    <div>
                                        <h3 className="font-bold text-slate-900">{appt.patient}</h3>
                                        <p className="text-sm text-slate-500">{appt.type}</p>
                                    </div>
                                </div>
                                <div className="flex md:items-center gap-4 text-sm w-full md:w-auto justify-between md:justify-start">
                                    <div className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap">
                                        <FaClock className="text-slate-400" />
                                        {appt.time}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                                        appt.status === 'Confirmed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                    }`}>
                                        {appt.status}
                                    </span>
                                
                                <div className="flex gap-2">
                                   <Link to={`/doctor/patients/${appt.id}`} className="p-2 text-slate-400 hover:text-[#0A6ED1] hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                                     <FaEllipsisH />
                                   </Link>
                                </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 text-center mt-auto">
                        <button className="text-sm font-semibold text-slate-600 hover:text-[#0A6ED1] inline-flex items-center gap-1">
                            Show all appointments <FaArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* Right Column: Queue & Actions */}
                <div className="space-y-8">
                    
                    {/* Live Queue */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-50">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <FaUserInjured className="text-orange-500" />
                                Waiting Room
                            </h2>
                        </div>
                        <div className="p-4 space-y-3">
                            {patientQueue.length > 0 ? (
                                patientQueue.map(p => (
                                    <div key={p.id} className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-slate-900">{p.name}</div>
                                            <div className="text-xs text-slate-500">Reason: {p.reason}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-orange-600 font-bold text-sm">{p.waitingTime}</div>
                                            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Waiting</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-slate-400 text-sm">No patients waiting.</div>
                            )}
                        </div>
                         <div className="p-4 bg-slate-50 border-t border-slate-100">
                           <button className="w-full py-2 bg-[#0A6ED1] hover:bg-[#095bb0] text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 text-sm transition-all">
                             Call Next Patient
                           </button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-linear-to-br from-[#0A6ED1] to-cyan-600 rounded-3xl shadow-lg shadow-blue-500/20 p-6 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-xl text-left transition-colors border border-white/10">
                                    <FaCalendarCheck className="mb-2 text-white/80" />
                                    <span className="text-sm font-medium">Add Appt</span>
                                </button>
                                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-xl text-left transition-colors border border-white/10">
                                    <FaUserInjured className="mb-2 text-white/80" />
                                    <span className="text-sm font-medium">New Patient</span>
                                </button>
                                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-xl text-left transition-colors border border-white/10">
                                    <FaCheckCircle className="mb-2 text-white/80" />
                                    <span className="text-sm font-medium">Verify Lab</span>
                                </button>
                                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-xl text-left transition-colors border border-white/10">
                                    <FaEllipsisH className="mb-2 text-white/80" />
                                    <span className="text-sm font-medium">More</span>
                                </button>
                            </div>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
                    </div>

                </div>
            </div>

          </div>
        </div>
        
        {/* Mobile footer for doctors if needed, can reuse or create specific */}
      </main>
    </div>
  );
}

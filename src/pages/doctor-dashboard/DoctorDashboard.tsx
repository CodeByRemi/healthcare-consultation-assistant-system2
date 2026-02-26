import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import { 
  FaCalendarCheck, 
  FaClock, 
  FaEllipsisH,
  FaArrowRight
} from "react-icons/fa";
import { toast } from "sonner";

export default function DoctorDashboard() {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [doctorName, setDoctorName] = useState("Doctor");

  // Mock data placeholders
  const upcomingAppointments : any[] = [];
  const stats: any[] = [];

  useEffect(() => {
     const fetchDoctorData = async () => {
       if (currentUser) {
         try {
           const docRef = doc(db, "doctors", currentUser.uid);
           const docSnap = await getDoc(docRef);
           if (docSnap.exists()) {
             setDoctorName(docSnap.data().fullName || "Doctor");
           }
         } catch (error) {
           console.error("Error fetching doctor data:", error);
         }
       }
     };
     fetchDoctorData();
  }, [currentUser]);

  const handleShowAllAppointments = () => {
    toast.info("Loading all appointments...");
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
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Intro */}
            <header className="flex justify-between items-end">
                <div>
                   <h1 className="text-3xl md:text-4xl font-['Newsreader'] font-medium mb-1 text-slate-900">
                     Good morning, <span className="text-[#0A6ED1]">Dr. {doctorName.split(' ').pop()}</span>
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

            <div className="w-full">
                {/* Upcoming Appointments */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <FaCalendarCheck className="text-[#0A6ED1]" />
                            Today's Schedule
                        </h2>
                        <Link to="/doctor/schedule" onClick={() => toast.info("Opening calendar...")} className="text-sm text-[#0A6ED1] font-medium hover:underline">View Calendar</Link>
                    </div>
                    
                     <div className="divide-y divide-slate-50">
                        {upcomingAppointments.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">No appointments scheduled for today</div>
                        ) : (
                        upcomingAppointments.map((appt) => (
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
                                   <Link to={`/doctor/patients/${appt.id}`} onClick={() => toast.info(`Viewing details for patient ${appt.id}`)} className="p-2 text-slate-400 hover:text-[#0A6ED1] hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                                     <FaEllipsisH />
                                   </Link>
                                </div>
                                </div>
                            </div>
                        )))}
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 text-center mt-auto">
                        <button onClick={handleShowAllAppointments} className="text-sm font-semibold text-slate-600 hover:text-[#0A6ED1] inline-flex items-center gap-1">
                            Show all appointments <FaArrowRight className="w-3 h-3" />
                        </button>
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

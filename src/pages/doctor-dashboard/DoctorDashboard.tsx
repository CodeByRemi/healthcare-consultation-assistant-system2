import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, collection, query, where, orderBy, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import { 
  FaCalendarCheck, 
  FaClock, 
  FaEllipsisH,
  FaArrowRight,
  FaUserInjured,
  FaClipboardList,
  FaStar,
  FaVideo
} from "react-icons/fa";
import { toast } from "sonner";

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
  videoLink?: string;
}

export default function DoctorDashboard() {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [doctorName, setDoctorName] = useState("Doctor");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState([
    { label: "Total Patients", value: "0", change: "+0%", icon: FaUserInjured, color: "bg-blue-50 text-blue-600" },
    { label: "Appointments", value: "0", change: "+0%", icon: FaCalendarCheck, color: "bg-purple-50 text-purple-600" },
    { label: "Consultations", value: "0", change: "+0%", icon: FaVideo, color: "bg-emerald-50 text-emerald-600" },
    { label: "Rating", value: "0.0", change: "+0.0", icon: FaStar, color: "bg-yellow-50 text-yellow-600" },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
     const fetchDoctorData = async () => {
       if (currentUser) {
         try {
           // 1. Fetch Doctor Profile
           const docRef = doc(db, "doctors", currentUser.uid);
           const docSnap = await getDoc(docRef);
           if (docSnap.exists()) {
             const data = docSnap.data();
             setDoctorName(data.fullName || "Doctor");
           }

           // 2. Fetch Appointments (Real-time listener)
           // Get today's date in YYYY-MM-DD format for comparison if needed, 
           // but for now let's just get all upcoming or recent ones.
           // Ideally we filter by date >= today.
           const today = new Date().toISOString().split('T')[0];
           
           const q = query(
             collection(db, "appointments"),
             where("doctorId", "==", currentUser.uid),
             // where("date", ">=", today), // Uncomment when date format is standardized
             orderBy("date", "asc"),
             orderBy("time", "asc")
             // limit(5) // Limit to 5 for dashboard
           );

           const unsubscribe = onSnapshot(q, (snapshot) => {
             const appts: Appointment[] = [];
             let totalAppts = 0;
             let completedAppts = 0;
             const uniquePatients = new Set();
             
             snapshot.forEach((doc) => {
                const data = doc.data();
                // Basic filtering for "upcoming" logic if not done in query
                if (data.date >= today && (data.status === 'confirmed' || data.status === 'pending')) {
                    appts.push({ id: doc.id, ...data } as Appointment);
                }
                
                totalAppts++;
                if (data.status === 'completed') completedAppts++;
                if (data.patientId) uniquePatients.add(data.patientId);
             });

             // Update Stats
             setStats([
                { label: "Total Patients", value: uniquePatients.size.toString(), change: "+5%", icon: FaUserInjured, color: "bg-blue-50 text-blue-600" },
                { label: "Today's Appts", value: appts.filter(a => a.date === today).length.toString(), change: "Active", icon: FaCalendarCheck, color: "bg-purple-50 text-purple-600" },
                { label: "Completed", value: completedAppts.toString(), change: "Total", icon: FaClipboardList, color: "bg-emerald-50 text-emerald-600" },
                { label: "Rating", value: "4.9", change: "+0.2", icon: FaStar, color: "bg-yellow-50 text-yellow-600" }, // Mock rating for now
             ]);

             setAppointments(appts.slice(0, 5)); // Show next 5 upcoming
             setIsLoading(false);
           }, (error) => {
             console.error("Error listening to appointments:", error);
             setIsLoading(false);
           });

           return () => unsubscribe();

         } catch (error) {
           console.error("Error fetching doctor data:", error);
           setIsLoading(false);
         }
       }
     };
     fetchDoctorData();
  }, [currentUser]);

  const handleShowAllAppointments = () => {
    // Navigate to schedule or show modal
    // navigate('/doctor/schedule'); 
    toast.info("Navigate to Schedule page to see full calendar.");
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
                         <div className={`p-3 rounded-xl ${stat.color}`}>
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
                        {isLoading ? (
                            <div className="p-8 text-center text-slate-400">Loading schedule...</div>
                        ) : appointments.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center justify-center text-slate-500">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <FaCalendarCheck className="text-slate-300 text-2xl" />
                                </div>
                                <p className="font-medium">No appointments scheduled active right now.</p>
                                <p className="text-sm mt-1">Check back later or view your full calendar.</p>
                            </div>
                        ) : (
                        appointments.map((appt) => (
                            <div key={appt.id} className="p-4 md:p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-slate-100">
                                        {appt.patientName?.charAt(0) || 'P'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{appt.patientName || "Unknown Patient"}</h3>
                                        <p className="text-sm text-slate-500">{appt.type || "Consultation"}</p>
                                    </div>
                                </div>
                                <div className="flex md:items-center gap-4 text-sm w-full md:w-auto justify-between md:justify-end flex-wrap">
                                    <div className="flex items-center gap-2 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg whitespace-nowrap">
                                        <FaCalendarCheck className="text-slate-400 w-3 h-3" />
                                        {new Date(appt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg whitespace-nowrap">
                                        <FaClock className="text-slate-400 w-3 h-3" />
                                        {appt.time}
                                    </div>
                                    <span className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap capitalize text-xs ${
                                        appt.status === 'confirmed' ? 'bg-green-50 text-green-600 border border-green-100' : 
                                        appt.status === 'pending' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                        'bg-slate-50 text-slate-600'
                                    }`}>
                                        {appt.status}
                                    </span>
                                
                                <div className="flex gap-2">
                                   <Link to={`/doctor/patients/${appt.patientId}`} className="p-2 text-slate-400 hover:text-[#0A6ED1] hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
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

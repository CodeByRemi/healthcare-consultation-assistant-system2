import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import { 
  FaCalendarCheck, 
  FaEllipsisH,
  FaUserInjured,
  FaClipboardList,
  FaStar,
  FaPlus
} from "react-icons/fa";

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
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [doctorName, setDoctorName] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState([
    { label: "Total Patients", value: "0", change: "0%", icon: FaUserInjured, color: "bg-blue-50 text-blue-600" },
    { label: "Today's Appts", value: "0", change: "Active", icon: FaCalendarCheck, color: "bg-purple-50 text-purple-600" },
    { label: "Completed", value: "0", change: "Total", icon: FaClipboardList, color: "bg-emerald-50 text-emerald-600" },
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
             let completedAppts = 0;
             const uniquePatients = new Set();
             
             snapshot.forEach((doc) => {
                const data = doc.data();
                // Basic filtering for "upcoming" logic if not done in query
                if (data.date >= today && (data.status === 'confirmed' || data.status === 'pending')) {
                    appts.push({ id: doc.id, ...data } as Appointment);
                }
                
                if (data.status === 'completed') completedAppts++;
                if (data.patientId) uniquePatients.add(data.patientId);
             });

             // --- DUMMY DATA INJECTION (If no real data found) ---
             if (appts.length === 0 && completedAppts === 0) {
                 const dummyAppts: Appointment[] = [
                     { id: 'd1', patientName: 'Sarah Johnson', patientId: 'p1', date: today, time: '09:00 AM', type: 'General Consultation', status: 'confirmed', notes: 'Persistent headaches' },
                     { id: 'd2', patientName: 'Michael Chen', patientId: 'p2', date: today, time: '10:30 AM', type: 'Follow-up', status: 'confirmed', notes: 'Blood pressure check' },
                     { id: 'd3', patientName: 'Emily Davis', patientId: 'p3', date: today, time: '02:00 PM', type: 'Specialist Referral', status: 'pending', notes: 'Dermatology consultation' },
                 ];
                 // Inject logic
                 appts.push(...dummyAppts);
                 setStats([
                    { label: "Total Patients", value: "128", change: "+12%", icon: FaUserInjured, color: "bg-blue-50 text-blue-600" },
                    { label: "Today's Appts", value: "3", change: "Active", icon: FaCalendarCheck, color: "bg-purple-50 text-purple-600" },
                    { label: "Completed", value: "452", change: "Total", icon: FaClipboardList, color: "bg-emerald-50 text-emerald-600" },
                    { label: "Rating", value: "4.9", change: "+0.2", icon: FaStar, color: "bg-yellow-50 text-yellow-600" },
                 ]);
             } else {
                 // Real Stats
                 setStats([
                    { label: "Total Patients", value: uniquePatients.size.toString(), change: "+5%", icon: FaUserInjured, color: "bg-blue-50 text-blue-600" },
                    { label: "Today's Appts", value: appts.filter(a => a.date === today).length.toString(), change: "Active", icon: FaCalendarCheck, color: "bg-purple-50 text-purple-600" },
                    { label: "Completed", value: completedAppts.toString(), change: "Total", icon: FaClipboardList, color: "bg-emerald-50 text-emerald-600" },
                    { label: "Rating", value: "4.9", change: "+0.2", icon: FaStar, color: "bg-yellow-50 text-yellow-600" },
                 ]);
             }
             // -----------------------------------------------------

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
                     Good morning, <span className="text-[#0A6ED1]">
                       {isLoading ? (
                         <span className="animate-pulse">Loading...</span>
                       ) : (
                         `Dr. ${doctorName.split(' ').pop()}`
                       )}
                     </span>
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
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col p-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-1">Today's Schedule</h2>
                            <p className="text-sm text-slate-500">
                                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • You have {appointments.length} remaining appointments
                            </p>
                        </div>
                        <Link to="/doctor/patients" className="bg-[#0A6ED1] hover:bg-[#0958a8] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2">
                            <FaPlus className="text-sm" /> New Appointment
                        </Link>
                    </div>

                    {/* Table Header */}
                    <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_0.5fr] px-4 py-3 bg-slate-50/50 rounded-xl mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <div>Time</div>
                        <div>Patient</div>
                        <div>Status</div>
                        <div className="text-right">Actions</div>
                    </div>

                    {/* List */}
                    <div className="space-y-2">
                        {isLoading ? (
                            <div className="py-12 text-center text-slate-400">Loading schedule...</div>
                        ) : (
                            // Render real data OR placeholders if empty, to ensure layout is visible
                            (appointments.length > 0 ? appointments : [
                                {
                                    id: 'ph-1',
                                    patientName: 'Patient Name',
                                    patientId: 'demo-patient',
                                    date: new Date().toISOString(),
                                    time: '09:00 AM',
                                    type: 'Consultation Type',
                                    status: 'completed' as const
                                },
                                {
                                    id: 'ph-2',
                                    patientName: 'Patient Name',
                                    patientId: 'demo-patient',
                                    date: new Date().toISOString(),
                                    time: '10:00 AM',
                                    type: 'Consultation Type',
                                    status: 'confirmed' as const // This will trigger "Active" look
                                },
                                {
                                    id: 'ph-3',
                                    patientName: 'Patient Name',
                                    patientId: 'demo-patient',
                                    date: new Date().toISOString(),
                                    time: '11:00 AM',
                                    type: 'Consultation Type',
                                    status: 'pending' as const
                                }
                            ]).map((appt, index) => {
                                // Simulate one being "In Progress" or active for the visual demo
                                // If using placeholders, make the second one active to match the design request
                                const isPlaceholder = appt.id.startsWith('ph-');
                                const isActive = isPlaceholder ? (index === 1) : (index === 0 && appt.status === 'confirmed');
                                
                                return (
                                    <div 
                                        key={appt.id} 
                                        onClick={() => {
                                            // Navigate to patient details on row click
                                            navigate(`/doctor/patients/${appt.patientId}`);
                                        }}
                                        className={`cursor-pointer grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr_0.5fr] items-center p-4 rounded-2xl transition-all gap-4 md:gap-0 ${
                                            isActive ? 'bg-[#10B981]/5 border border-[#10B981]/10' : 'hover:bg-slate-50 border border-transparent'
                                        }`}
                                    >
                                        {/* Time */}
                                        <div className="flex justify-between md:block">
                                            <span className="md:hidden text-xs font-bold text-slate-400 uppercase tracking-wider">Time</span>
                                            <div>
                                                <div className={`font-bold ${isActive ? 'text-[#10B981]' : 'text-slate-900'}`}>{appt.time}</div>
                                                <div className="text-xs text-slate-500 font-medium">{index === 0 ? '45 mins' : isActive ? 'In Progress' : '30 mins'}</div>
                                            </div>
                                        </div>

                                        {/* Patient */}
                                        <div className="flex justify-between md:justify-start items-center gap-3">
                                            <span className="md:hidden text-xs font-bold text-slate-400 uppercase tracking-wider">Patient</span>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                                    isActive ? 'bg-[#10B981] text-white' : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                    {appt.patientName?.charAt(0) || 'P'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{appt.patientName}</div>
                                                    <div className="text-xs text-slate-500">ID: #{appt.patientId ? appt.patientId.replace('p', 'MS-') : 'UNKNOWN'}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="flex justify-between md:block">
                                            <span className="md:hidden text-xs font-bold text-slate-400 uppercase tracking-wider">Status</span>
                                            <div>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide inline-block ${
                                                    isActive ? 'bg-[#10B981] text-white' :
                                                    appt.status === 'confirmed' ? 'bg-[#10B981]/10 text-[#10B981]' : 
                                                    appt.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                                                    appt.status === 'completed' ? 'bg-slate-100 text-slate-500' :
                                                    'bg-slate-50 text-slate-600'
                                                }`}>
                                                    {isActive ? 'Active' : appt.status === 'pending' ? 'Scheduled' : appt.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex justify-end gap-2 mt-2 md:mt-0" onClick={(e) => e.stopPropagation()}>
                                            {isActive && (
                                                <button className="p-2 bg-[#10B981]/10 text-[#10B981] rounded-lg hover:bg-[#10B981]/20 transition-colors" title="Start Consultation">
                                                    <FaCalendarCheck />
                                                </button>
                                            )}
                                            <Link 
                                                to={`/doctor/patients/${appt.patientId}`} 
                                                className="p-2 text-slate-400 hover:text-[#0A6ED1] hover:bg-slate-50 rounded-lg transition-colors"
                                            >
                                                <FaEllipsisH />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* View Full Calendar */}
                    <div className="mt-8 text-center border-t border-slate-50 pt-6">
                        <Link 
                            to="/doctor/schedule" 
                            className="text-xs font-bold text-slate-400 hover:text-[#0A6ED1] uppercase tracking-widest transition-colors"
                        >
                            View Full Calendar
                        </Link>
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

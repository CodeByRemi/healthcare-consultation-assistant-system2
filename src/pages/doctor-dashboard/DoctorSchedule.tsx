import { useState, useEffect } from "react";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import { FaCalendarAlt, FaPlus, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { toast } from "sonner";
import DoctorAvailabilityModal from "./components/DoctorAvailabilityModal";

import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

interface Appointment {
  id: string;
  time: string;
  patient: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  type: string;
  duration: string;
  notes?: string;
}

export default function DoctorSchedule() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser: user } = useAuth();
  const [scheduleData, setScheduleData] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Helper to get days of current week
  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay()); // Start on Sunday
    const days = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDates(selectedDate);

  const isSelected = (date: Date) => {
      return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date: Date) => {
      return date.toDateString() === new Date().toDateString();
  };

  useEffect(() => {
    const fetchSchedule = async () => {
        if (!user) return;
        try {
            const dateId = selectedDate.toISOString().split('T')[0];
            
            // 1. Get Availability
            const availabilityRef = doc(db, "doctors", user.uid, "availability", dateId);
            const availabilitySnap = await getDoc(availabilityRef);
            
            if (availabilitySnap.exists()) {
                setScheduleData(availabilitySnap.data().slots || []);
            } else {
                setScheduleData([]);
            }

            // 2. Get Appointments for this date
            const q = query(
                collection(db, "appointments"),
                where("doctorId", "==", user.uid),
                where("date", "==", dateId)
            );
            
            const querySnapshot = await getDocs(q);
            const appts: Appointment[] = [];
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                appts.push({
                    id: doc.id,
                    time: data.time || "00:00",
                    patient: data.patientName || "Unknown Patient",
                    status: (data.status === 'confirmed' ? 'Confirmed' : data.status === 'pending' ? 'Pending' : 'Cancelled') as 'Confirmed' | 'Pending' | 'Cancelled',
                    type: data.type || "General Consultation",
                    duration: "30 min",
                    notes: data.notes
                });
            });
            
            setAppointments(appts); 

        } catch (error) {
            console.error("Error loading schedule:", error);
            toast.error("Failed to load schedule");
        }
    };
    
    fetchSchedule();
  }, [user, selectedDate, isModalOpen]);

  const handleAddAvailability = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-['Manrope'] dark:bg-slate-900 transition-colors duration-300">
      <DoctorSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <DoctorHeader 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">My Schedule</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your appointments and availability.</p>
              </div>
              <button onClick={handleAddAvailability} className="bg-[#0A6ED1] hover:bg-[#095bb0] text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95">
                  <FaPlus /> Add Availability
              </button>
            </header>

            <div className="w-full">
                {/* Calendar / Week View */}
                <div className="space-y-6">
                    {/* Week Picker */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h2>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => {
                                        const d = new Date(selectedDate);
                                        d.setDate(d.getDate() - 7);
                                        setSelectedDate(d);
                                    }}
                                    className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 transition-colors"
                                >
                                    <FaAngleLeft />
                                </button>
                                <button 
                                    onClick={() => setSelectedDate(new Date())}
                                    className="px-3 py-1 text-sm font-medium text-[#0A6ED1] bg-blue-50 dark:bg-blue-500/10 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                                >
                                    Today
                                </button>
                                <button 
                                    onClick={() => {
                                        const d = new Date(selectedDate);
                                        d.setDate(d.getDate() + 7);
                                        setSelectedDate(d);
                                    }}
                                    className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400 transition-colors"
                                >
                                    <FaAngleRight />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {weekDays.map((date, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setSelectedDate(date)}
                                    className={`flex flex-col items-center p-3 rounded-xl transition-all border ${
                                        isSelected(date) 
                                        ? "bg-[#0A6ED1] text-white border-[#0A6ED1] shadow-md shadow-blue-500/20" 
                                        : isToday(date)
                                            ? "bg-blue-50 text-[#0A6ED1] border-blue-100 dark:bg-blue-900/20 dark:border-blue-800"
                                            : "bg-white text-slate-600 border-transparent hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                                    }`}
                                >
                                    <span className="text-xs font-semibold uppercase mb-1 opacity-80">
                                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </span>
                                    <span className="text-lg font-bold">
                                        {date.getDate()}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Schedule List */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden min-h-[400px]">
                        <div className="p-6 border-b border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="font-bold text-slate-800 dark:text-white">
                                Appointments for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </h3>
                        </div>
                        
                        <div className="divide-y divide-slate-50 dark:divide-slate-700">
                            {scheduleData.length === 0 ? (
                                <div className="p-12 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center h-full">
                                    <FaCalendarAlt className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p className="mb-4">No available slots found for this day.</p>
                                    <button onClick={() => setIsModalOpen(true)} className="text-[#0A6ED1] font-medium hover:underline text-sm">
                                        Create Availability
                                    </button>
                                </div>
                            ) : (
                                scheduleData.map((slot) => {
                                    // Use explicit any for appointments as requested/implicit in previous structure
                                    // or fix type if possible. userRequest asked to remove problems.
                                    const appointment = appointments.find((a) => a.time === slot);
                                    
                                    return (
                                        <div key={slot} className="flex group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <div className="w-24 p-4 border-r border-slate-50 dark:border-slate-700 text-right text-sm font-medium text-slate-500 dark:text-slate-400 pt-6">
                                                {slot}
                                            </div>
                                            <div className="flex-1 p-2">
                                                {appointment ? (
                                                  // Existing appointment logic
                                                    <div className={`p-4 rounded-xl border-l-4 ${
                                                        appointment.status === 'Confirmed' ? 'bg-blue-50 border-[#0A6ED1] dark:bg-blue-900/20' : 'bg-orange-50 border-orange-400 dark:bg-orange-900/20'
                                                    } hover:shadow-sm transition-shadow`}>
                                                        <div className="flex justify-between items-start mb-1">
                                                            <h4 className="font-bold text-slate-900 dark:text-white">{appointment.patient}</h4>
                                                            <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                                                                appointment.status === 'Confirmed' ? 'bg-blue-100 text-[#0A6ED1] dark:bg-blue-500/20 dark:text-blue-300' : 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300'
                                                            }`}>
                                                                {appointment.status}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">{appointment.type} • {appointment.duration}</div>
                                                        {appointment.notes && (
                                                            <div className="text-xs text-slate-500 italic">Note: {appointment.notes}</div>
                                                        )}
                                                    </div>
                                                ) : (
                                                     <div className="h-full min-h-[60px] rounded-xl border-2 border-dashed border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-600 flex items-center justify-start px-4 transition-colors">
                                                        <span className="text-slate-400 dark:text-slate-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                                            <FaPlus className="text-xs" /> Add Manual Booking
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
        
        <DoctorAvailabilityModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            selectedDate={selectedDate} 
        />
      </main>
    </div>
  );
}

import { useState, useEffect } from "react";
import { FaCalendarPlus, FaVideo, FaMapMarkerAlt, FaClock, FaCalendarCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import PatientSidebar from "./components/PatientSidebar";
import PatientDashboardHeader from "./components/PatientDashboardHeader";
import PatientMobileFooter from "./components/PatientMobileFooter";
import AppointmentDetailsModal from "./components/AppointmentDetailsModal";
import RescheduleModal from "./components/RescheduleModal";
import RateDoctorModal from "./components/RateDoctorModal";
import { toast } from "sonner";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
  status: string;
}

const formatDateLabel = (dateValue: string) => {
  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return {
      day: "--",
      full: "Date not available"
    };
  }

  return {
    day: parsedDate.toLocaleDateString("en-US", { day: "2-digit" }),
    full: parsedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
  };
};

export default function PatientAppointments() {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isRateOpen, setIsRateOpen] = useState(false);

  const handleOpenDetails = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setIsDetailsOpen(true);
  };

  const handleOpenReschedule = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setIsRescheduleOpen(true);
  };
   
  const handleOpenRate = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setIsRateOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedAppointment(null);
  };

  const handleCloseReschedule = () => {
    setIsRescheduleOpen(false);
    setSelectedAppointment(null);
  };

  const handleCloseRate = () => {
    setIsRateOpen(false);
    setSelectedAppointment(null);
  };

  const handleRescheduleConfirm = () => {
    // Implement actual reschedule logic here later
    toast.success("Reschedule request submitted.");
    handleCloseReschedule();
  };

  const handleRescheduleFromDetails = (apt: Appointment) => {
    handleCloseDetails();
    setTimeout(() => handleOpenReschedule(apt), 200); // Small delay for smoother transition
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!currentUser) {
        setAppointments([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const q = query(collection(db, "appointments"), where("patientId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);

        const fetchedAppointments = querySnapshot.docs
          .map((doc) => {
            const docData = doc.data();
            return {
              id: doc.id,
              doctorName: (docData.doctorName as string) || "Doctor",
              specialty: (docData.specialty as string) || "Specialist",
              date: (docData.date as string) || "",
              time: (docData.time as string) || "Time not set",
              type: (docData.type as string) || "In-Person Consultation",
              status: (docData.status as string) || "pending"
            };
          })
          .sort((a, b) => {
            const dateA = new Date(`${a.date} ${a.time}`);
            const dateB = new Date(`${b.date} ${b.time}`);
            return dateA.getTime() - dateB.getTime();
          });

        setAppointments(fetchedAppointments);

        if (fetchedAppointments.length === 0) {
          toast.info("No upcoming appointments found.");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Failed to load appointments.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [currentUser]);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <PatientSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <PatientDashboardHeader 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-7xl mx-auto w-full">
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-['Newsreader'] font-medium mb-2 text-slate-900">
                          My Appointments
                        </h1>
                        <p className="text-slate-500">
                          Manage your upcoming and past consultations.
                        </p>
                    </div>
                    <Link to="/patient/book-appointment" className="flex items-center gap-2 bg-[#0A6ED1] text-white px-6 py-3 rounded-xl hover:bg-[#095bb0] transition-colors font-medium w-fit">
                        <FaCalendarPlus />
                        Book New Appointment
                    </Link>
                </header>

                {isLoading ? (
                  <div className="flex items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-slate-500">Loading appointments...</p>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                      <FaCalendarCheck className="text-4xl text-[#0A6ED1] opacity-50" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Appointments Yet</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">
                      You don't have any upcoming consultations scheduled. Book an appointment with a specialist today.
                    </p>
                    <Link to="/patient/book-appointment" className="px-8 py-3 bg-[#0A6ED1] text-white rounded-xl font-semibold hover:bg-[#095bb0] transition-colors shadow-lg shadow-blue-500/20">
                      Find a Doctor
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {appointments.map((apt) => (
                      <div key={apt.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex gap-4">
                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-[#0A6ED1] text-2xl font-bold">
                            {formatDateLabel(apt.date).day}
                                </div>
                                <div>
                            <h3 className="text-lg font-bold text-slate-900">{apt.doctorName}</h3>
                                    <p className="text-slate-500 text-sm mb-2">{apt.specialty}</p>
                            <p className="text-slate-500 text-sm mb-2">{formatDateLabel(apt.date).full}</p>
                                    <div className="flex items-center gap-4 text-sm text-slate-600">
                                        <span className="flex items-center gap-1.5">
                                            <FaClock className="text-[#0A6ED1]" /> {apt.time}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            {apt.type === "Video Consultation" ? <FaVideo className="text-[#0A6ED1]" /> : <FaMapMarkerAlt className="text-[#0A6ED1]" />}
                                            {apt.type}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <span className={`px-4 py-2 rounded-lg font-medium text-sm capitalize ${
                                  apt.status.toLowerCase() === "pending"
                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                    : apt.status.toLowerCase() === "confirmed"
                                      ? "bg-green-50 text-green-700 border border-green-200"
                                      : "bg-slate-100 text-slate-600 border border-slate-200"
                                }`}>
                                  {apt.status}
                                </span>
                                {apt.status.toLowerCase() === "completed" ? (
                                    <button 
                                      onClick={() => handleOpenRate(apt)}
                                      className="px-4 py-2 bg-yellow-400 text-yellow-900 border border-yellow-500 hover:bg-yellow-300 rounded-lg font-bold transition-colors shadow-sm"
                                    >
                                        Rate Doctor
                                    </button>
                                ) : (
                                    <button 
                                      onClick={() => handleOpenReschedule(apt)}
                                      className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
                                    >
                                        Reschedule
                                    </button>
                                )}
                                <button 
                                  onClick={() => handleOpenDetails(apt)}
                                  className="px-4 py-2 border border-[#0A6ED1] text-[#0A6ED1] hover:bg-blue-50 rounded-lg font-medium transition-colors"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                  </div>
                )}
            </div>
        </div>
        <PatientMobileFooter />
      </main>

      <AppointmentDetailsModal 
        isOpen={isDetailsOpen} 
        onClose={handleCloseDetails} 
        appointment={selectedAppointment} 
        onReschedule={handleRescheduleFromDetails} 
      />

      <RescheduleModal 
        isOpen={isRescheduleOpen} 
        onClose={handleCloseReschedule} 
        appointment={selectedAppointment} 
        onConfirm={handleRescheduleConfirm} 
      />

      <RateDoctorModal
        isOpen={isRateOpen}
        onClose={handleCloseRate}
        appointment={selectedAppointment}
        onSuccess={() => {/* Ideally refresh appointments here */}}
      />
    </div>
  );
}

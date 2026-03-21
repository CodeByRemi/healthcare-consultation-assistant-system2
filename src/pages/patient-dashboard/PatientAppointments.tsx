import { useState, useEffect } from "react";
import { FaCalendarPlus, FaVideo, FaMapMarkerAlt, FaClock, FaCalendarCheck, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import PatientSidebar from "./components/PatientSidebar";
import PatientDashboardHeader from "./components/PatientDashboardHeader";
import PatientMobileFooter from "./components/PatientMobileFooter";
import AppointmentDetailsModal from "./components/AppointmentDetailsModal";
import RescheduleModal from "./components/RescheduleModal";
import RateDoctorModal from "./components/RateDoctorModal";
import { toast } from "sonner";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";

interface Appointment {
  id: string;
  doctorName: string;
  doctorId?: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
  status: string;
  consultationEndedByDoctor?: boolean;
  ratingSubmitted?: boolean;
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

  const placeholderAppointments: Appointment[] = [
    {
      id: "placeholder-appointment-1",
      doctorName: "Doctor Name",
      specialty: "Specialty",
      date: "Date",
      time: "Time",
      type: "Type",
      status: "Status"
    },
    {
      id: "placeholder-appointment-2",
      doctorName: "Doctor Name",
      specialty: "Specialty",
      date: "Date",
      time: "Time",
      type: "Type",
      status: "Status"
    }
  ];

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
    if (!currentUser) {
      setAppointments([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const q = query(collection(db, "appointments"), where("patientId", "==", currentUser.uid));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const fetchedAppointments = querySnapshot.docs
          .map((doc) => {
            const docData = doc.data();
            return {
              id: doc.id,
              doctorName: (docData.doctorName as string) || "Doctor",
              doctorId: (docData.doctorId as string) || "",
              specialty: (docData.specialty as string) || "Specialist",
              date: (docData.date as string) || "",
              time: (docData.time as string) || "Time not set",
              type: (docData.type as string) || "In-Person Consultation",
              status: (docData.status as string) || "pending",
              consultationEndedByDoctor: Boolean(docData.consultationEndedByDoctor),
              ratingSubmitted: Boolean(docData.ratingSubmitted),
            };
          })
          .sort((a, b) => {
            const dateA = new Date(`${a.date} ${a.time}`);
            const dateB = new Date(`${b.date} ${b.time}`);
            return dateA.getTime() - dateB.getTime();
          });

        setAppointments(fetchedAppointments);
        setIsLoading(false);

        if (fetchedAppointments.length === 0) {
          toast.info("No upcoming appointments found.");
        }
      },
      (error) => {
        console.error("Error fetching appointments:", error);
        toast.error("Failed to load appointments.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <PatientSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <PatientDashboardHeader 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8 pb-24 md:pb-8">
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
                  <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
                      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                        <FaCalendarCheck className="text-4xl text-[#0A6ED1] opacity-50" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Appointments</h3>
                      <p className="text-slate-500 max-w-md mx-auto mb-6">
                        This section will show your upcoming consultations.
                      </p>
                      <Link to="/patient/book-appointment" className="px-8 py-3 bg-[#0A6ED1] text-white rounded-xl font-semibold hover:bg-[#095bb0] transition-colors shadow-lg shadow-blue-500/20">
                        Find a Doctor
                      </Link>
                    </div>

                    <div className="grid gap-4">
                      {placeholderAppointments.map((apt) => (
                        <div key={apt.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex gap-4">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-[#0A6ED1] text-sm font-bold">
                              Date
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-slate-900">{apt.doctorName}</h3>
                              <p className="text-slate-500 text-sm mb-2">{apt.specialty}</p>
                              <p className="text-slate-500 text-sm mb-2">Date</p>
                              <div className="flex items-center gap-4 text-sm text-slate-600">
                                <span className="flex items-center gap-1.5">
                                  <FaClock className="text-[#0A6ED1]" /> Time
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <FaMapMarkerAlt className="text-[#0A6ED1]" /> Type
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <span className="px-4 py-2 rounded-lg font-medium text-sm bg-slate-100 text-slate-600 border border-slate-200">
                              Status
                            </span>
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
                            
                            {/* Status badge + action buttons — wraps properly on mobile */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-3 py-1.5 rounded-lg font-medium text-sm capitalize whitespace-nowrap ${
                                  apt.status.toLowerCase() === "pending"
                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                    : apt.status.toLowerCase() === "confirmed"
                                      ? "bg-green-50 text-green-700 border border-green-200"
                                      : apt.status.toLowerCase() === "completed"
                                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                                      : "bg-slate-100 text-slate-600 border border-slate-200"
                                }`}>
                                  {apt.status}
                                </span>
                                {apt.status.toLowerCase() === "completed" && !apt.ratingSubmitted ? (
                                    <button
                                      onClick={() => handleOpenRate(apt)}
                                      className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 text-amber-900 hover:bg-amber-300 rounded-lg font-bold transition-colors shadow-sm text-sm whitespace-nowrap"
                                    >
                                        <FaStar className="w-3.5 h-3.5" />
                                        Rate Doctor
                                    </button>
                                ) : apt.status.toLowerCase() === "completed" && apt.ratingSubmitted ? (
                                    <button
                                      disabled
                                      className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-400 border border-slate-200 rounded-lg font-semibold cursor-not-allowed text-sm whitespace-nowrap"
                                    >
                                      <FaStar className="w-3.5 h-3.5 text-amber-300" />
                                      Rated
                                    </button>
                                ) : (
                                    <button
                                      onClick={() => handleOpenReschedule(apt)}
                                      className="px-4 py-2 text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg font-medium transition-colors text-sm whitespace-nowrap"
                                    >
                                        Reschedule
                                    </button>
                                )}
                                <button
                                  onClick={() => handleOpenDetails(apt)}
                                  className="px-4 py-2 border border-[#0A6ED1] text-[#0A6ED1] hover:bg-blue-50 rounded-lg font-medium transition-colors text-sm whitespace-nowrap"
                                >
                                    View Details
                                </button>
                            </div>

                            {/* Consultation-ended prompt — prominent card on mobile */}
                            {apt.consultationEndedByDoctor && apt.status.toLowerCase() === "completed" && !apt.ratingSubmitted && (
                              <div className="flex items-start sm:items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                                <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                                  <FaStar className="w-3.5 h-3.5 text-amber-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-amber-800 leading-snug">Consultation ended</p>
                                  <p className="text-xs text-amber-700 leading-snug">How was your experience? Your feedback helps other patients.</p>
                                </div>
                                <button
                                  onClick={() => handleOpenRate(apt)}
                                  className="shrink-0 text-xs font-bold text-amber-800 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                                >
                                  Rate Now
                                </button>
                              </div>
                            )}
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

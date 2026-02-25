import { useState, useEffect } from "react";
import { FaCalendarPlus, FaVideo, FaMapMarkerAlt, FaClock, FaCalendarCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import PatientSidebar from "./components/PatientSidebar";
import PatientDashboardHeader from "./components/PatientDashboardHeader";
import PatientMobileFooter from "./components/PatientMobileFooter";
import { toast } from "sonner";

export default function PatientAppointments() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Appointments state initialized to empty
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    toast.info("No upcoming appointments found.");
    // Simulate fetch
    // setAppointments([...]);
  }, []);

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

                {appointments.length === 0 ? (
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
                                    {apt.date.split(' ')[1].replace(',', '')}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{apt.doctor}</h3>
                                    <p className="text-slate-500 text-sm mb-2">{apt.specialty}</p>
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
                                <button className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
                                    Reschedule
                                </button>
                                <button className="px-4 py-2 border border-[#0A6ED1] text-[#0A6ED1] hover:bg-blue-50 rounded-lg font-medium transition-colors">
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
    </div>
  );
}

import { useState } from "react";
import { FaCalendarPlus, FaVideo, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import PatientSidebar from "./components/PatientSidebar";
import PatientDashboardHeader from "./components/PatientDashboardHeader";
import PatientMobileFooter from "./components/PatientMobileFooter";

export default function PatientAppointments() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Mock appointments for now
  const appointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Smith",
      specialty: "Cardiologist",
      date: "March 15, 2026",
      time: "10:00 AM",
      type: "Video Consultation",
      status: "Upcoming"
    },
    {
       id: 2,
       doctor: "Dr. James Wilson",
       specialty: "Dermatologist",
       date: "March 20, 2026",
       time: "2:30 PM",
       type: "In-Person",
       status: "Upcoming"
    }
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      <PatientSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <PatientDashboardHeader 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
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
                    <button className="flex items-center gap-2 bg-[#0A6ED1] text-white px-6 py-3 rounded-xl hover:bg-[#095bb0] transition-colors font-medium">
                        <FaCalendarPlus />
                        Book New Appointment
                    </button>
                </header>

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
            </div>
        </div>
        <PatientMobileFooter />
      </main>
    </div>
  );
}

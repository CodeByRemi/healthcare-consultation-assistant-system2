import { useState } from "react";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import { FaCalendarAlt, FaPlus, FaAngleLeft, FaAngleRight } from "react-icons/fa";

export default function DoctorSchedule() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  // Mock Appointments Data
  const [appointments] = useState([
    { id: 1, patient: "Alice Johnson", time: "09:00 AM", duration: "30 min", type: "General Consultation", status: "Confirmed", notes: "Regular checkup" },
    { id: 2, patient: "Robert Smith", time: "10:30 AM", duration: "45 min", type: "Follow-up", status: "Pending", notes: "Review lab results" },
    { id: 3, patient: "Emily Davis", time: "02:00 PM", duration: "30 min", type: "Health Checkup", status: "Confirmed", notes: "" },
  ]);

  const [availableSlots] = useState([
      "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-['Manrope']">
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
                <h1 className="text-3xl font-bold text-slate-800 mb-2">My Schedule</h1>
                <p className="text-slate-500">Manage your appointments and availability.</p>
              </div>
              <button className="bg-[#0A6ED1] hover:bg-[#095bb0] text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all">
                  <FaPlus /> Add Availability
              </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar / Week View */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Week Picker */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-800">
                                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h2>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => {
                                        const d = new Date(selectedDate);
                                        d.setDate(d.getDate() - 7);
                                        setSelectedDate(d);
                                    }}
                                    className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors"
                                >
                                    <FaAngleLeft />
                                </button>
                                <button 
                                    onClick={() => setSelectedDate(new Date())}
                                    className="px-3 py-1 text-sm font-medium text-[#0A6ED1] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    Today
                                </button>
                                <button 
                                    onClick={() => {
                                        const d = new Date(selectedDate);
                                        d.setDate(d.getDate() + 7);
                                        setSelectedDate(d);
                                    }}
                                    className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors"
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
                                            ? "bg-blue-50 text-[#0A6ED1] border-blue-100"
                                            : "bg-white text-slate-600 border-transparent hover:bg-slate-50"
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
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                            <h3 className="font-bold text-slate-800">
                                Appointments for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </h3>
                        </div>
                        
                        <div className="divide-y divide-slate-50">
                            {/* Empty State */}
                            {/* {appointments.length === 0 && (
                                <div className="p-12 text-center text-slate-400">
                                    <FaCalendarAlt className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p>No appointments scheduled for this day.</p>
                                </div>
                            )} */}
                            
                            {/* Time Slots */}
                            {availableSlots.map((slot) => {
                                const appointment = appointments.find(a => a.time === slot);
                                
                                return (
                                    <div key={slot} className="flex group hover:bg-slate-50 transition-colors">
                                        <div className="w-24 p-4 border-r border-slate-50 text-right text-sm font-medium text-slate-500 pt-6">
                                            {slot}
                                        </div>
                                        <div className="flex-1 p-2">
                                            {appointment ? (
                                                <div className={`p-4 rounded-xl border-l-4 ${
                                                    appointment.status === 'Confirmed' ? 'bg-blue-50 border-[#0A6ED1]' : 'bg-orange-50 border-orange-400'
                                                } hover:shadow-sm transition-shadow`}>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="font-bold text-slate-900">{appointment.patient}</h4>
                                                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                                                            appointment.status === 'Confirmed' ? 'bg-blue-100 text-[#0A6ED1]' : 'bg-orange-100 text-orange-600'
                                                        }`}>
                                                            {appointment.status}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-slate-600 mb-2">{appointment.type} • {appointment.duration}</div>
                                                    {appointment.notes && (
                                                        <div className="text-xs text-slate-500 italic">Note: {appointment.notes}</div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="h-full min-h-15 rounded-xl border-2 border-dashed border-transparent group-hover:border-slate-200 flex items-center justify-center">
                                                    <button className="opacity-0 group-hover:opacity-100 text-slate-400 font-medium text-sm flex items-center gap-2 hover:text-[#0A6ED1] transition-all">
                                                        <FaPlus /> Add Booking
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column - Stats / Requests */}
                <div className="space-y-6">
                    <div className="bg-[#0A6ED1] text-white p-6 rounded-2xl shadow-lg shadow-blue-500/20">
                        <h3 className="font-bold text-lg mb-4">Today's Summary</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="opacity-80">Total Appointments</span>
                                <span className="font-bold text-2xl">8</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="opacity-80">Pending Requests</span>
                                <span className="font-bold text-2xl">3</span>
                            </div>
                            <div className="w-full bg-white/20 h-px my-4"></div>
                            <div className="flex items-center justify-between">
                                <span className="opacity-80">Remaining Slots</span>
                                <span className="font-bold text-2xl">4</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-4">Upcoming Time Off</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                <div className="bg-white p-2 rounded-lg text-slate-400 shadow-sm">
                                    <FaCalendarAlt />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800">Mar 15, 2026</div>
                                    <div className="text-xs text-slate-500">Personal Leave</div>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors">
                            Request Time Off
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

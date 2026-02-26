import { useState, useEffect } from "react";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import { FaCalendarAlt, FaPlus, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { toast } from "sonner";

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

  // Mock Appointments Data - initialized to empty
  const appointments : any[] = [];
  const availableSlots : string[] = [];

  useEffect(() => {
    // Simulate fetching schedule
    toast.info("Loading schedule...");
  }, []);

  const handleAddAvailability = () => {
    toast.success("Opening availability settings...");
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
          <div className="max-w-6xl mx-auto">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">My Schedule</h1>
                <p className="text-slate-500">Manage your appointments and availability.</p>
              </div>
              <button onClick={handleAddAvailability} className="bg-[#0A6ED1] hover:bg-[#095bb0] text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all">
                  <FaPlus /> Add Availability
              </button>
            </header>

            <div className="w-full">
                {/* Calendar / Week View */}
                <div className="space-y-6">
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
                            {availableSlots.length === 0 ? (
                                <div className="p-12 text-center text-slate-400">
                                    <FaCalendarAlt className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p>No available slots found for this day.</p>
                                    <button onClick={() => toast.info("Simulating slot creation...")} className="mt-4 text-[#0A6ED1] font-medium hover:underline text-sm">
                                        Generate Slots
                                    </button>
                                </div>
                            ) : (
                                availableSlots.map((slot) => {
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
                                                    <button onClick={() => toast.success(`Opening booking form for ${slot}`)} className="opacity-0 group-hover:opacity-100 text-slate-400 font-medium text-sm flex items-center gap-2 hover:text-[#0A6ED1] transition-all">
                                                        <FaPlus /> Add Booking
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            }))}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { useState } from "react";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import { 
  FaClock, 
  FaInfoCircle, 
  FaMagic,
  FaSync
} from "react-icons/fa";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

export default function DoctorAvailability() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { currentUser: user } = useAuth();
  
  // State for configuration
  const [viewMode, setViewMode] = useState<'standard' | 'custom'>('standard');
  const [allowRecurring, setAllowRecurring] = useState(true);
  const [slotDuration, setSlotDuration] = useState(30);
  
  // Weekly grid state (Mon-Sun)
  // Store start/end times for each day, or array of specific slots?
  // For "Standard Weekly Hours", usually it's start/end per day.
  // The UI shows a grid, suggesting block selection.
  // Let's model it as a set of active blocks per day.
  // Simple structure: { "Mon": ["09:00", "09:30", ...], ... }
  const [weeklySlots, setWeeklySlots] = useState<Record<string, string[]>>({
    "Mon": [], "Tue": [], "Wed": [], "Thu": [], "Fri": [], "Sat": [], "Sun": []
  });

  const timeSlots = [
    "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayDates = [12, 13, 14, 15, 16, 17, 18]; // Demo dates matching image

  // Toggle a slot
  const toggleSlot = (day: string, time: string) => {
    setWeeklySlots(prev => {
        const currentSlots = prev[day] || [];
        if (currentSlots.includes(time)) {
            return { ...prev, [day]: currentSlots.filter(t => t !== time) };
        } else {
            return { ...prev, [day]: [...currentSlots, time] };
        }
    });
  };

  // Apply Preset
  const applyPreset = (type: 'morning' | 'general' | 'evening') => {
      // Clear current or merge? usually replace or merge. Let's replace for demo.
      const newSlots: Record<string, string[]> = { ...weeklySlots };
      
      const monFri = ["Mon", "Tue", "Wed", "Thu", "Fri"];
      
      monFri.forEach(day => {
          let times: string[] = [];
          if (type === 'morning') times = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM"];
          if (type === 'general') times = ["01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
          if (type === 'evening') times = ["06:00 PM", "07:00 PM", "08:00 PM"];
          
          newSlots[day] = times; // Apply to weekdays
      });

      setWeeklySlots(newSlots);
      toast.success(`Applied ${type} preset to Mon-Fri`);
  };

  const handleSaveChanges = async () => {
      if (!user) return;
      // Here you would save to Firebase
      // For now just toast
      toast.success("Availability updated successfully");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      <DoctorSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Helper Header - reusing existing or creating simple one matching design */}
        <DoctorHeader 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen} 
        />

        <div className="bg-white border-b border-slate-100 px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 z-20">
             <div>
                 <h1 className="text-3xl font-serif font-bold text-slate-900">Manage Availability</h1>
                 <p className="text-slate-500 mt-1">Configure your clinical hours and consultation slots.</p>
             </div>
             
             <div className="flex items-center gap-4">
                 <button 
                    onClick={handleSaveChanges}
                    className="bg-[#0A6ED1] hover:bg-[#0958a8] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
                 >
                     Save Changes
                 </button>
             </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Controls Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button 
                            onClick={() => setViewMode('standard')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'standard' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Standard Weekly Hours
                        </button>
                        <button 
                            onClick={() => setViewMode('custom')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'custom' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Custom Exceptions
                        </button>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setAllowRecurring(!allowRecurring)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${allowRecurring ? 'bg-[#0A6ED1]' : 'bg-slate-300'}`}
                            >
                                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${allowRecurring ? 'translate-x-6' : ''}`}></span>
                            </button>
                            <span className="text-sm font-semibold text-slate-700">Allow Recurring Slots</span>
                        </div>

                        <div className="h-8 w-px bg-slate-200"></div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500">Slot Duration:</span>
                            <select 
                                value={slotDuration}
                                onChange={(e) => setSlotDuration(Number(e.target.value))}
                                className="font-bold text-[#0A6ED1] bg-transparent border-none focus:ring-0 cursor-pointer"
                            >
                                <option value={15}>15 mins</option>
                                <option value={30}>30 mins</option>
                                <option value={45}>45 mins</option>
                                <option value={60}>60 mins</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Presets */}
                    <div className="w-full lg:w-80 space-y-6 shrink-0">
                        {/* Quick Presets */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                            <h3 className="font-serif font-bold text-xl mb-6 text-slate-900">Quick Presets</h3>
                            <div className="space-y-3">
                                <button onClick={() => applyPreset('morning')} className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-[#0A6ED1] hover:bg-[#0A6ED1]/5 transition-all group">
                                    <div className="font-bold text-slate-800 group-hover:text-[#0A6ED1]">Morning Rounds</div>
                                    <div className="text-xs text-slate-500 mt-1">08:00 AM - 11:30 AM</div>
                                </button>
                                <button onClick={() => applyPreset('general')} className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-[#0A6ED1] hover:bg-[#0A6ED1]/5 transition-all group">
                                    <div className="font-bold text-slate-800 group-hover:text-[#0A6ED1]">General Consults</div>
                                    <div className="text-xs text-slate-500 mt-1">01:00 PM - 05:00 PM</div>
                                </button>
                                <button onClick={() => applyPreset('evening')} className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-[#0A6ED1] hover:bg-[#0A6ED1]/5 transition-all group">
                                    <div className="font-bold text-slate-800 group-hover:text-[#0A6ED1]">Evening Review</div>
                                    <div className="text-xs text-slate-500 mt-1">06:00 PM - 08:00 PM</div>
                                </button>
                            </div>
                        </div>

                        {/* Pro Tip */}
                        <div className="bg-[#0A6ED1]/5 p-6 rounded-3xl border border-[#0A6ED1]/10">
                            <div className="flex items-center gap-2 text-[#0A6ED1] font-bold mb-3">
                                <FaInfoCircle /> Pro Tip
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Click and drag on the calendar grid to select multiple slots simultaneously. Active availability slots are shown in blue.
                            </p>
                        </div>
                    </div>

                    {/* Main Grid Grid */}
                    <div className="flex-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 min-h-150 flex flex-col">
                        
                        {/* Days Header */}
                        <div className="grid grid-cols-[60px_repeat(7,1fr)] mb-4">
                            <div className="flex items-center justify-center text-slate-400">
                                <FaClock />
                            </div>
                            {days.map((day, i) => (
                                <div key={day} className="text-center p-2">
                                    <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${day === 'Thu' ? 'text-[#0A6ED1]' : 'text-slate-400'}`}>
                                        {day}
                                    </div>
                                    <div className="text-xl font-serif text-slate-800">{dayDates[i]}</div>
                                </div>
                            ))}
                        </div>

                        {/* Schedule Grid */}
                        <div className="flex-1 overflow-auto">
                            <div className="grid grid-cols-[60px_repeat(7,1fr)] divide-y divide-slate-50">
                                {timeSlots.map(time => (
                                    <>
                                        {/* Time Label */}
                                        <div key={time} className="py-4 pr-4 text-right text-xs font-semibold text-slate-400">
                                            {time}
                                        </div>

                                        {/* Days */}
                                        {days.map(day => {
                                            const isSelected = weeklySlots[day]?.includes(time);
                                            
                                            // Render regular togglable slot
                                            return (
                                                <div 
                                                    key={`${day}-${time}`} 
                                                    className="p-1 h-14 border-l border-slate-50 relative group"
                                                >
                                                    <button 
                                                        onClick={() => toggleSlot(day, time)} 
                                                        className={`w-full h-full rounded-lg transition-all flex items-center justify-center ${
                                                            isSelected 
                                                            ? 'bg-[#0A6ED1]/10 border border-[#0A6ED1]/20 shadow-sm' 
                                                            : 'hover:bg-slate-50 border border-transparent'
                                                        }`}
                                                    >
                                                        {isSelected && <div className="hidden lg:block text-[10px] font-bold text-[#0A6ED1]">Available</div>}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </>
                                ))}
                            </div>
                        </div>

                        {/* Footer Controls */}
                        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                    <div className="w-4 h-4 rounded border border-[#0A6ED1]/20 bg-[#0A6ED1]/10"></div>
                                    Available
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                    <div className="w-4 h-4 rounded border border-slate-200 bg-white"></div>
                                    Unavailable
                                </label>
                            </div>

                            <div className="text-sm text-slate-500 font-medium">
                                Total weekly capacity: <span className="font-bold text-slate-900">38.5 Hours</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                     <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#10B981] flex items-center justify-center shrink-0">
                            <FaSync size={24} />
                        </div>
                        <div>
                            <h3 className="font-serif font-bold text-lg text-slate-900 mb-2">Sync with External Calendar</h3>
                            <p className="text-sm text-slate-500 leading-relaxed mb-4">
                                Connect Google Calendar or Outlook to automatically mark slots as unavailable when you have personal events.
                            </p>
                            <button className="text-sm font-bold text-[#10B981] hover:underline">Connect Account &rarr;</button>
                        </div>
                     </div>

                     <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0A6ED1] flex items-center justify-center shrink-0">
                            <FaMagic size={24} />
                        </div>
                        <div>
                            <h3 className="font-serif font-bold text-lg text-slate-900 mb-2">AI Optimization</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Let our AI analyze your patient demand and suggest optimal time slots for different consultation types.
                            </p>
                        </div>
                     </div>
                </div>

            </div>
        </div>
      </main>
    </div>
  );
}

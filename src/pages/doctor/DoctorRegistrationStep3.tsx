import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
    FaArrowRight, 
    FaArrowLeft,
    FaCheckCircle as CheckCircle2
} from "react-icons/fa";
import logo from "../../assets/patientreg.png";
import { toast } from "sonner";

export default function DoctorRegistrationStep3() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Default availability: Mon-Fri, 9am-5pm
  const [availability, setAvailability] = useState([
    { day: "Monday", active: true, startTime: "09:00", endTime: "17:00" },
    { day: "Tuesday", active: true, startTime: "09:00", endTime: "17:00" },
    { day: "Wednesday", active: true, startTime: "09:00", endTime: "17:00" },
    { day: "Thursday", active: true, startTime: "09:00", endTime: "17:00" },
    { day: "Friday", active: true, startTime: "09:00", endTime: "17:00" },
    { day: "Saturday", active: false, startTime: "10:00", endTime: "14:00" },
    { day: "Sunday", active: false, startTime: "10:00", endTime: "14:00" },
  ]);

  const toggleDay = (index: number) => {
    const newAvailability = [...availability];
    newAvailability[index].active = !newAvailability[index].active;
    setAvailability(newAvailability);
  };

  const updateTime = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const newAvailability = [...availability];
    newAvailability[index] = { ...newAvailability[index], [field]: value };
    setAvailability(newAvailability);
  };

  const handleNextStep = () => {
    // Check if at least one day is active
    const activeSchedule = availability.filter(day => day.active);
    
    if (activeSchedule.length === 0) {
      toast.error("Please select at least one available day.");
      return;
    }

    // Include the availability data in the 'prevData' passed to the next step
    const prevData = location.state?.prevData || {};
    const updatedData = { ...prevData, availability: availability };
    
    // Navigate to Step 4 (Verification)
    navigate('/doctor/step-4', { state: { prevData: updatedData } });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-['Manrope'] bg-slate-50">
      {/* Left Panel - Branding & Info */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-[#0da540] p-8 lg:p-16 flex-col justify-between relative overflow-hidden"
      >
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=2091&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-12 group transition-all duration-300 ease-in-out hover:translate-x-1">
            <div className="w-10 h-10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-inner group-hover:bg-white/20 transition-all">
              <img src={logo} alt="Logo" className="w-6 h-6 object-contain hue-rotate-0 brightness-0 invert" />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">Medicare</span>
          </Link>
          
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#0A6ED1] animate-pulse"></span>
              Step 3 of 4
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-['Newsreader'] font-medium text-white mb-6 leading-tight">
              Set your <span className="italic text-[#8fcfa7]">availability</span>.
            </h1>
            
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Define your weekly schedule so patients can book appointments at times that work for you.
            </p>

            <div className="space-y-4">
              {[
                "Flexible scheduling",
                "Automated time slot management",
                "Break time customization"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-white/90 group">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 pt-8 border-t border-white/10 flex items-center justify-between text-white/60 text-sm">
          <p>© {new Date().getFullYear()} Medicare Inc.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
      </motion.div>

      {/* Right Panel - Schedule Form */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto"
      >
        <div className="w-full max-w-lg bg-white p-8 lg:p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-3xl font-bold text-slate-900 font-['Newsreader']">Schedule</h2>
              <Link to="/doctor/register" className="text-sm text-slate-400 hover:text-[#0da540] transition-colors">
                Cancel
              </Link>
            </div>
            <p className="text-slate-500">
               Configure your typical weekly availability. You can adjust this later in your dashboard.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {availability.map((slot, index) => (
              <div key={slot.day} className={`p-4 rounded-xl border transition-all ${slot.active ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-transparent opacity-60'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={slot.active}
                      onChange={() => toggleDay(index)}
                      className="w-5 h-5 rounded border-slate-300 text-[#0da540] focus:ring-[#0da540] transition-colors cursor-pointer"
                    />
                    <span className={`font-semibold ${slot.active ? 'text-slate-900' : 'text-slate-500'}`}>{slot.day}</span>
                  </div>
                  {slot.active ? (
                    <span className="text-xs font-semibold text-[#0A6ED1] bg-blue-50 px-2 py-1 rounded">Active</span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">Off</span>
                  )}
                </div>

                {slot.active && (
                  <div className="flex items-center gap-4 pl-8">
                    <div className="flex-1">
                      <label className="text-xs text-slate-500 mb-1 block">Start Time</label>
                      <input 
                        type="time" 
                        value={slot.startTime}
                        onChange={(e) => updateTime(index, 'startTime', e.target.value)}
                        className="w-full text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0da540]"
                      />
                    </div>
                    <span className="text-slate-300 pt-5">-</span>
                    <div className="flex-1">
                      <label className="text-xs text-slate-500 mb-1 block">End Time</label>
                      <input 
                        type="time" 
                        value={slot.endTime}
                        onChange={(e) => updateTime(index, 'endTime', e.target.value)}
                        className="w-full text-sm p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0da540]"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => navigate(-1)}
                className="w-1/3 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group text-base"
              >
                <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
              
              <button 
                type="button"
                onClick={handleNextStep}
                className="w-2/3 py-4 bg-[#0A6ED1] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 flex items-center justify-center gap-2 group text-base hover:bg-[#095bb0] active:scale-[0.98]"
              >
                Next Step
                <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

        </div>
      </motion.div>
    </div>
  );
}

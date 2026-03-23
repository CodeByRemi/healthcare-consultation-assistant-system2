import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCalendarAlt, FaClock } from "react-icons/fa";

interface Appointment {
  id: string;
  doctorName: string;
  // ... other fields
  status: string;
}

interface RescheduleModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newDate: string, newTime: string) => void;
}

export default function RescheduleModal({ appointment, isOpen, onClose, onConfirm }: RescheduleModalProps) {
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  if (!appointment) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
           onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
          >
            <div className="bg-amber-400 px-6 py-4 flex items-center justify-between text-amber-900">
               <h3 className="font-bold text-lg">Reschedule Needed?</h3>
               <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-full">
                  <FaTimes />
               </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-slate-600 text-sm leading-relaxed">
                You are about to reschedule your appointment with <span className="font-bold text-slate-900">{appointment.doctorName}</span>. 
                Please select a new date and time or confirm to proceed.
              </p>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-3">
                 <label className="text-xs font-bold text-slate-400 uppercase">New Date</label>
                 <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
                    <FaCalendarAlt className="text-slate-400" />
                    <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="bg-transparent w-full text-slate-700 outline-none text-sm" min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]} />
                 </div>
                 
                 <label className="text-xs font-bold text-slate-400 uppercase">New Time</label>
                 <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
                    <FaClock className="text-slate-400" />
                    <select value={newTime} onChange={(e) => setNewTime(e.target.value)} className="bg-transparent w-full text-slate-700 outline-none text-sm">
                        <option value="">Select a time</option>
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                    </select>
                 </div>
              </div>

              <div className="flex gap-3 pt-2">
                 <button 
                   onClick={onClose} 
                   className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={() => onConfirm(newDate, newTime)}
                   disabled={!newDate || !newTime}
                   className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   Confirm
                 </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

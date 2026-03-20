import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../context/AuthContext";

interface DoctorAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
}

export default function DoctorAvailabilityModal({ isOpen, onClose, selectedDate }: DoctorAvailabilityModalProps) {
  const { currentUser: user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [slots, setSlots] = useState<string[]>([]);

  const generateSlots = () => {
    // Generate 30 min slots
    const generated: string[] = [];
    // Date object for time calculation (date part doesn't matter)
    const current = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    while (current < end) {
      const timeStr = current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      generated.push(timeStr);
      current.setMinutes(current.getMinutes() + 30);
    }
    setSlots(generated);
  };

  const handleSave = async () => {
    if (!user) return;
    if (slots.length === 0) {
        toast.error("Please generate slots first");
        return;
    }

    setLoading(true);
    try {
        // Format date as YYYY-MM-DD for document ID
        const dateId = selectedDate.toISOString().split('T')[0];
        
        // Save to doctors collection -> availability subcollection
        // structure: doctors/{doctorId}/availability/{dateId} -> { slots: [...] }
        const availabilityRef = doc(db, "doctors", user.uid, "availability", dateId);
        
        await setDoc(availabilityRef, {
            date: dateId,
            slots: slots,
            updatedAt: new Date().toISOString()
        });
        
        toast.success("Availability saved successfully!");
        onClose();
    } catch (error) {
        console.error("Error saving availability:", error);
        toast.error("Failed to update availability");
    } finally {
        setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add Availability</h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date</label>
                <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-200 font-medium">
                  {selectedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Start Time</label>
                  <input 
                    type="time" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">End Time</label>
                  <input 
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <button 
                onClick={generateSlots}
                className="w-full py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
              >
                Generate Slots
              </button>

              {slots.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl max-h-40 overflow-y-auto custom-scrollbar">
                  <div className="flex flex-wrap gap-2">
                    {slots.map((slot) => (
                      <span key={slot} className="px-3 py-1 bg-white dark:bg-slate-600 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-200 border border-slate-100 dark:border-slate-500 shadow-sm">
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 bg-[#0A6ED1] hover:bg-[#095bb0] text-white font-medium rounded-lg shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? "Saving..." : "Save Schedule"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

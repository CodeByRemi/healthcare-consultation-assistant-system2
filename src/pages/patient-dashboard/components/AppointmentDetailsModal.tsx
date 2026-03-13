import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaUserMd, FaCalendarAlt, FaClock, FaNotesMedical, FaMapMarkerAlt, FaVideo } from "react-icons/fa";

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
  status: string;
  notes?: string;
  meetingLink?: string;
  location?: string;
}

interface AppointmentDetailsModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (appointment: Appointment) => void;
}

export default function AppointmentDetailsModal({ appointment, isOpen, onClose, onReschedule }: AppointmentDetailsModalProps) {
  if (!appointment) return null;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#0A6ED1] px-8 py-6 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close modal"
              >
                <FaTimes className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
                  <FaUserMd className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white max-w-50 truncate">{appointment.doctorName}</h2>
                  <p className="text-blue-100 font-medium">{appointment.specialty}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              
              {/* Status Badge */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Status</span>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize ${
                  appointment.status?.toLowerCase() === 'confirmed' ? 'bg-green-100 text-green-700' :
                  appointment.status?.toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {appointment.status}
                </span>
              </div>

              {/* Date & Time */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                <div className="flex items-center gap-3 text-slate-700">
                  <FaCalendarAlt className="text-[#0A6ED1]" />
                  <span className="font-medium">{formatDate(appointment.date)}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <FaClock className="text-[#0A6ED1]" />
                  <span className="font-medium">{appointment.time}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  {appointment.type === 'Video Consultation' ? (
                     <FaVideo className="text-[#0A6ED1]" />
                  ) : (
                     <FaMapMarkerAlt className="text-[#0A6ED1]" />
                  )}
                  <span className="font-medium">{appointment.type}</span>
                </div>
              </div>

              {/* Location or Link */}
              {appointment.type === 'Video Consultation' && appointment.meetingLink && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <p className="text-sm text-blue-800 font-medium mb-2">Video Meeting Link:</p>
                      <a href={appointment.meetingLink} target="_blank" rel="noreferrer" className="text-[#0A6ED1] underline break-all text-sm">
                          {appointment.meetingLink}
                      </a>
                  </div>
              )}
              
              {appointment.type !== 'Video Consultation' && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Location</p>
                      <p className="text-slate-700 text-sm font-medium">
                        {appointment.location || "Location"}
                      </p>
                  </div>
              )}

              {/* Notes */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
                  <FaNotesMedical className="text-slate-400" />
                  Appointment Notes
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed bg-white p-3 rounded-xl border border-slate-100 min-h-20">
                  {appointment.notes || "Notes"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => onReschedule(appointment)}
                  className="flex-1 py-3 px-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
                >
                  Reschedule
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-[#0A6ED1] text-white font-bold rounded-xl hover:bg-[#095bb0] shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                  Close
                </button>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

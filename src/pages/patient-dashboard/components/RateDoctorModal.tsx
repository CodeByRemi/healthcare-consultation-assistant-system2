import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaStar } from "react-icons/fa";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { toast } from "sonner";

interface Appointment {
  id: string;
  doctorName: string;
  doctorId?: string; // Should ideally be present
}

interface RateDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onSuccess: () => void;
}

export default function RateDoctorModal({ isOpen, onClose, appointment, onSuccess }: RateDoctorModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!appointment) return;
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    try {
      setIsSubmitting(true);
      const appointmentRef = doc(db, "appointments", appointment.id);
      
      await updateDoc(appointmentRef, {
        rating,
        review: comment,
        reviewDate: new Date().toISOString(),
        status: "completed" // Ensure it's marked completed if not already, or just add review data
      });

      // Optional: Logic to update doctor's average rating in 'doctors' collection could go here via Cloud Function or client-side calculation (omitted for simplicity as requested)
      
      toast.success("Thank you for your feedback!");
      onSuccess();
      onClose();
      // Reset form
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-yellow-400 px-6 py-4 flex items-center justify-between">
               <h3 className="font-bold text-lg text-yellow-900">Rate Your Experience</h3>
               <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-full text-yellow-900 transition-colors">
                  <FaTimes />
               </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <p className="text-slate-500 text-sm">How was your appointment with</p>
                <h4 className="text-xl font-bold text-slate-900">{appointment.doctorName}</h4>
              </div>

              {/* Star Rating */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <FaStar 
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoverRating || rating) ? "text-yellow-400" : "text-slate-200"
                      }`} 
                    />
                  </button>
                ))}
              </div>
              
              {/* Comment Box */}
              <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-400 uppercase">Write a Review (Optional)</label>
                 <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about your experience..."
                    className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none resize-none text-slate-700"
                 />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                 <button 
                   onClick={onClose} 
                   disabled={isSubmitting}
                   className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
                 >
                   Skip
                 </button>
                 <button 
                   onClick={handleSubmit}
                   disabled={isSubmitting || rating === 0}
                   className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-yellow-400 hover:bg-yellow-500 shadow-lg shadow-yellow-400/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {isSubmitting ? "Submitting..." : "Submit Review"}
                 </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaStar } from "react-icons/fa";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { toast } from "sonner";

const STAR_LABELS = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

interface Appointment {
  id: string;
  doctorName: string;
  doctorId?: string;
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

  const activeRating = hoverRating || rating;

  const handleSubmit = async () => {
    if (!appointment) return;
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }
    try {
      setIsSubmitting(true);
      await updateDoc(doc(db, "appointments", appointment.id), {
        rating,
        review: comment,
        reviewDate: new Date().toISOString(),
        status: "completed",
        ratingSubmitted: true,
          ratingSubmittedAt: new Date().toISOString(),
        });

        if (appointment.doctorId) {
          try {
            const doctorRef = doc(db, 'doctors', appointment.doctorId);
            const doctorSnap = await getDoc(doctorRef);
            if (doctorSnap.exists()) {
              const data = doctorSnap.data();
              const currentReviews = data.reviews || 0;
              const currentRating = data.rating || 0;
              
              const newReviews = currentReviews + 1;
              const newRating = ((currentRating * currentReviews) + rating) / newReviews;
              
              await updateDoc(doctorRef, {
                reviews: newReviews,
                rating: Number(newRating.toFixed(1))
              });
            }
          } catch(e) { console.error('Error updating doctor avg rating:', e); }
        }

        toast.success("Thank you for your feedback!");
      onSuccess();
      onClose();
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

  const initials = appointment.doctorName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <AnimatePresence>
      {isOpen && (
        /* Backdrop — aligns to bottom on mobile, centre on sm+ */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4"
          onClick={onClose}
        >
          {/* Sheet — slides up on mobile, scales in on sm+ */}
          <motion.div
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Drag handle (mobile only) */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1.5 rounded-full bg-slate-200" />
            </div>

            {/* Amber header */}
            <div className="bg-amber-400 px-5 py-4 flex items-center gap-3">
              {/* Doctor avatar */}
              <div className="w-10 h-10 rounded-full bg-amber-300/50 flex items-center justify-center text-amber-900 font-bold text-sm shrink-0 border-2 border-amber-300">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-amber-800 leading-tight">Rate your consultation with</p>
                <p className="font-bold text-amber-900 leading-tight truncate">{appointment.doctorName}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-black/10 rounded-full text-amber-900 transition-colors shrink-0"
              >
                <FaTimes size={14} />
              </button>
            </div>

            <div className="px-5 pt-6 pb-6 space-y-5">
              {/* Stars + animated label */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1.5 transition-transform active:scale-90 hover:scale-110 focus:outline-none"
                    >
                      <FaStar
                        className={`w-10 h-10 sm:w-8 sm:h-8 transition-colors ${
                          star <= activeRating ? "text-amber-400" : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="h-5 flex items-center">
                  <AnimatePresence mode="wait">
                    {activeRating > 0 && (
                      <motion.span
                        key={activeRating}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="text-sm font-bold text-amber-500"
                      >
                        {STAR_LABELS[activeRating - 1]}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* Review textarea */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Write a Review{" "}
                  <span className="normal-case font-normal text-slate-300">(optional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={3}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none resize-none text-slate-700 text-sm"
                />
              </div>

              {/* Action buttons — stacked full-width on mobile, side-by-side on sm+ */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="sm:flex-1 py-3.5 px-4 rounded-2xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all disabled:opacity-50 text-sm"
                >
                  Skip
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || rating === 0}
                  className="sm:flex-2 py-3.5 px-4 rounded-2xl font-bold text-white bg-amber-400 hover:bg-amber-500 shadow-lg shadow-amber-400/25 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "sonner";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import DoctorMobileFooter from "./components/v2/DoctorMobileFooter";
import DoctorPageTransition from "./components/v2/DoctorPageTransition";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";

function to12HourFormat(value: string) {
  const [hourStr, minuteStr] = value.split(":");
  const hour = Number(hourStr);
  const minutes = minuteStr || "00";

  if (Number.isNaN(hour)) return value;
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalized = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(normalized).padStart(2, "0")}:${minutes} ${suffix}`;
}

function getDurationMinutes(start: string, end: string) {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  const startTotal = startHour * 60 + startMinute;
  const endTotal = endHour * 60 + endMinute;
  return Math.max(0, endTotal - startTotal);
}

export default function DoctorBlockedBooking() {
  const navigate = useNavigate();
  const { currentUser: user } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = () => {
    if (!date || !startTime || !endTime || !reason.trim()) return false;
    return getDurationMinutes(startTime, endTime) > 0;
  };

  const openConfirmation = () => {
    if (!user) {
      toast.error("You must be logged in to block booking.");
      return;
    }

    if (!isValid()) {
      toast.error("Please complete required fields and ensure end time is after start time.");
      return;
    }

    setIsConfirmOpen(true);
  };

  const confirmBlockedBooking = async () => {
    if (!user || !isValid()) return;

    const durationMins = getDurationMinutes(startTime, endTime);
    const timeLabel = to12HourFormat(startTime);

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "appointments"), {
        doctorId: user.uid,
        doctorName: user.displayName || "Doctor",
        patientName: "Blocked Placeholder",
        patientId: "system-block",
        date,
        time: timeLabel,
        status: "blocked",
        type: "Blocked Booking",
        duration: `${durationMins} min`,
        notes: `Reason: ${reason.trim()}\nBlocked Range: ${to12HourFormat(startTime)} - ${to12HourFormat(endTime)}${notes.trim() ? `\nNotes: ${notes.trim()}` : ""}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setIsConfirmOpen(false);
      toast.success("Blocked booking confirmed.");
      navigate("/doctor/schedule");
    } catch (error) {
      console.error("Failed to block booking:", error);
      toast.error("Failed to confirm blocked booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      <DoctorSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <DoctorHeader
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
          <DoctorPageTransition className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Blocked Booking</h1>
                <p className="text-slate-500 mt-1">Reserve a time range so patients cannot book in that slot.</p>
              </div>
              <button
                onClick={() => navigate("/doctor/schedule")}
                className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
              >
                Back
              </button>
            </div>

            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Reason</label>
                  <input
                    type="text"
                    placeholder="Reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Notes (optional)</label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm resize-y"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => navigate("/doctor/schedule")}
                  className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={openConfirmation}
                  className="px-4 py-2.5 bg-[#0A6ED1] hover:bg-[#0958a8] text-white font-semibold rounded-lg"
                >
                  Confirm Blocked Booking
                </button>
              </div>
            </section>
          </DoctorPageTransition>
        </div>

        <DoctorMobileFooter />

        {isConfirmOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/35" onClick={() => !isSubmitting && setIsConfirmOpen(false)}></div>
            <div className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl p-5">
              <h2 className="text-lg font-bold text-slate-900">Confirm blocked booking?</h2>
              <p className="text-sm text-slate-600 mt-2">
                Are you sure you want to block <span className="font-semibold">{to12HourFormat(startTime)} - {to12HourFormat(endTime)}</span> on <span className="font-semibold">{date}</span>?
              </p>
              <p className="text-sm text-slate-500 mt-1">Reason: {reason}</p>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsConfirmOpen(false)}
                  disabled={isSubmitting}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 disabled:opacity-60"
                >
                  No, Go Back
                </button>
                <button
                  onClick={confirmBlockedBooking}
                  disabled={isSubmitting}
                  className="px-3 py-2 rounded-lg bg-[#0A6ED1] text-white font-semibold hover:bg-[#0958a8] disabled:opacity-60"
                >
                  {isSubmitting ? "Confirming..." : "Yes, Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

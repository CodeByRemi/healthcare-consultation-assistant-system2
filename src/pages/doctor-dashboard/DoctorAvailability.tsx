import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

export default function DoctorAvailability() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { currentUser: user } = useAuth();
  const navigate = useNavigate();

  // Simple form state
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState<number>(30);
  const [mode, setMode] = useState("In-person");
  const [notes, setNotes] = useState("");
  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isValid = () => {
    if (!date || !startTime || !endTime || !duration) return false;
    // Basic time comparison on HH:MM format
    const toMinutes = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    try {
      return toMinutes(endTime) > toMinutes(startTime);
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("You must be logged in to save availability");
      return;
    }
    if (!isValid()) {
      toast.error("Please complete required fields and ensure end time is after start time.");
      return;
    }

    try {
      setIsSaving(true);
      // Placeholder: integrate with Firestore here if needed
      // await addDoc(collection(db, 'availability'), { ...payload })
      toast.success("Availability saved");
      navigate(-1);
    } catch (e) {
      toast.error("Failed to save availability");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => navigate(-1);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      <DoctorSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <DoctorHeader
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Page Header */}
        <div className="bg-white border-b border-slate-100 px-6 md:px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 z-20">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900">Add Availability</h1>
            <p className="text-slate-500 mt-1">Create available time slots for patients to book.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-5 py-2.5 bg-[#0A6ED1] hover:bg-[#0958a8] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 ${
                isSaving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? 'Saving...' : 'Save Availability'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="date" className="text-sm font-semibold text-slate-700">Date<span className="text-red-500">*</span></label>
                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent"
                  />
                </div>

                {/* Duration */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="duration" className="text-sm font-semibold text-slate-700">Slot duration<span className="text-red-500">*</span></label>
                  <select
                    id="duration"
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent bg-white"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>

                {/* Start time */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="startTime" className="text-sm font-semibold text-slate-700">Start time<span className="text-red-500">*</span></label>
                  <input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent"
                  />
                </div>

                {/* End time */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="endTime" className="text-sm font-semibold text-slate-700">End time<span className="text-red-500">*</span></label>
                  <input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent"
                  />
                </div>

                {/* Mode */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="mode" className="text-sm font-semibold text-slate-700">Mode</label>
                  <select
                    id="mode"
                    value={mode}
                    onChange={e => setMode(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent bg-white"
                  >
                    <option>In-person</option>
                    <option>Virtual</option>
                    <option>Either</option>
                  </select>
                </div>

                {/* Repeat weekly */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">Repeat</label>
                  <label className="inline-flex items-center gap-3 text-sm text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={repeatWeekly}
                      onChange={e => setRepeatWeekly(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#0A6ED1] focus:ring-[#0A6ED1]"
                    />
                    Repeat weekly
                  </label>
                </div>

                {/* Notes - full width */}
                <div className="md:col-span-2 flex flex-col gap-2">
                  <label htmlFor="notes" className="text-sm font-semibold text-slate-700">Notes</label>
                  <textarea
                    id="notes"
                    rows={4}
                    placeholder="Optional notes visible to staff only"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent resize-y"
                  />
                </div>
              </div>

              {/* Inline validation hint */}
              {!isValid() && (
                <div className="mt-6 text-sm text-slate-500">
                  Fill in all required fields. End time must be later than start time.
                </div>
              )}

              {/* Footer actions (duplicate for mobile ergonomics) */}
              <div className="mt-8 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !isValid()}
                  className={`w-full sm:w-auto px-5 py-2.5 bg-[#0A6ED1] hover:bg-[#0958a8] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 ${
                    isSaving || !isValid() ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSaving ? 'Saving...' : 'Save Availability'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

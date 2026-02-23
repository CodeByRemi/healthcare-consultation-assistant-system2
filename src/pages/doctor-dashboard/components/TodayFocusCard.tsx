export default function TodayFocusCard() {
  return (
    <div className="lg:col-span-1 space-y-6">
      <style>{`
        @keyframes focus-enter {
          0% { opacity: 0; transform: translateY(18px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes focus-glow {
          0%, 100% { box-shadow: 0 0 0 rgba(17, 212, 82, 0); }
          50% { box-shadow: 0 0 26px rgba(17, 212, 82, 0.22); }
        }
        @keyframes float-soft {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        .focus-enter { animation: focus-enter 0.55s ease-out both; }
        .focus-glow { animation: focus-glow 3.2s ease-in-out infinite; }
        .float-soft { animation: float-soft 4s ease-in-out infinite; }
      `}</style>

      <h2 className="font-display text-4xl font-semibold text-slate-900 dark:text-slate-100">Today&apos;s Focus</h2>
      <div className="focus-enter focus-glow bg-white dark:bg-[#1a2e21]/35 border border-slate-200 dark:border-[#2a3d31] p-6 rounded-xl shadow-sm flex flex-col justify-between min-h-[400px] transition-all duration-300 hover:-translate-y-1">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-[#8ea194] font-black">Next Appointment</span>
          <div className="mt-4 flex flex-col gap-1">
            <h3 className="font-display text-3xl font-bold text-slate-900 dark:text-slate-100 leading-tight">Mrs. Eleanor Vance</h3>
            <p className="text-slate-600 dark:text-[#9eb0a4] font-medium">Routine Cardiac Checkup</p>
          </div>
        </div>
        <div className="space-y-4 mt-6">
          <div className="float-soft bg-primary/10 p-4 rounded-lg backdrop-blur-sm border border-primary/20">
            <div className="flex items-center gap-3 text-slate-800 dark:text-slate-100 mb-2">
              <span className="material-symbols-outlined text-lg">schedule</span>
              <span className="text-sm font-bold uppercase tracking-tight">10:30 AM — 11:15 AM</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700 dark:text-[#9eb0a4]">
              <span className="material-symbols-outlined text-lg">location_on</span>
              <span className="text-sm font-medium">Main Clinic, Room 302</span>
            </div>
          </div>
          <button className="w-full bg-primary hover:bg-primary/90 text-[#102216] py-4 rounded-lg font-bold uppercase tracking-widest text-xs transition-all duration-200 hover:scale-[1.01]" type="button">
            View Medical History
          </button>
        </div>
      </div>
    </div>
  );
}

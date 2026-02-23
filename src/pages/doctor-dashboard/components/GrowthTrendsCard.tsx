export default function GrowthTrendsCard() {
  return (
    <div className="bg-white dark:bg-[#1a2e21]/35 rounded-xl border border-slate-200 dark:border-[#2a3d31] p-8 overflow-hidden relative">
      <div className="flex justify-between items-end relative z-10">
        <div>
          <h4 className="font-display text-3xl font-semibold mb-1 text-slate-900 dark:text-slate-100">Patient Growth Trends</h4>
          <p className="text-sm text-slate-600 dark:text-[#9eb0a4]">Quarterly overview of new patient registrations.</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 uppercase font-bold">This Quarter</p>
          <p className="text-2xl font-bold text-primary">+24.8%</p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-24 overflow-hidden pointer-events-none opacity-30">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80 Q 150 20 300 80 T 600 50 T 900 70 L 1000 100 L 0 100 Z" fill="url(#dashboardGradient)" />
          <defs>
            <linearGradient id="dashboardGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="1" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

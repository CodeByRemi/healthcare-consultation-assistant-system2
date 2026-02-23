type DashboardHeaderProps = {
  isDark: boolean;
  onToggleTheme: () => void;
};

export default function DashboardHeader({ isDark, onToggleTheme }: DashboardHeaderProps) {
  return (
    <header className="h-16 border-b border-slate-200 dark:border-[#2a3d31] bg-white/70 dark:bg-[#102216]/80 backdrop-blur-xl flex items-center justify-between px-6 md:px-8 sticky top-0 z-10">
      <div className="relative w-full max-w-[28rem]">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 text-lg">search</span>
        <input
          className="w-full bg-slate-100 dark:bg-[#1a2e21]/70 border border-slate-200 dark:border-[#2a3d31] rounded-lg pl-10 pr-4 py-2 text-sm text-slate-700 dark:text-slate-100 focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-400 dark:placeholder:text-[#7f9487]"
          placeholder="Search patients, records, or files..."
          type="text"
        />
      </div>
      <div className="hidden sm:flex items-center gap-3 ml-4">
        <button
          className="size-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-[#1a2e21]/70 border border-slate-200 dark:border-[#2a3d31] text-slate-500 dark:text-[#b0c0b6] hover:text-primary transition-colors"
          type="button"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span className="material-symbols-outlined">{isDark ? "light_mode" : "dark_mode"}</span>
        </button>
        <button className="size-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-[#1a2e21]/70 border border-slate-200 dark:border-[#2a3d31] text-slate-500 dark:text-[#b0c0b6] hover:text-primary transition-colors" type="button">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="size-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-[#1a2e21]/70 border border-slate-200 dark:border-[#2a3d31] text-slate-500 dark:text-[#b0c0b6] hover:text-primary transition-colors" type="button">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>
    </header>
  );
}

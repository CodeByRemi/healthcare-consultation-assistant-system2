import { useState } from "react";

type DashboardSidebarProps = {
  isOpen: boolean;
  onToggleSidebar: () => void;
};

export default function DashboardSidebar({ isOpen, onToggleSidebar }: DashboardSidebarProps) {
  const [activeItem, setActiveItem] = useState("Overview");

  const navItems = [
    { icon: "dashboard", label: "Overview" },
    { icon: "group", label: "Patients" },
    { icon: "calendar_today", label: "Appointments" },
    { icon: "description", label: "Medical Records" },
    { icon: "account_circle", label: "Profile" },
  ];

  return (
    <>
    <style>{`
      @keyframes sidebarItemEnter {
        0% { opacity: 0; transform: translateX(-8px); }
        100% { opacity: 1; transform: translateX(0); }
      }
      @keyframes activeNeonPulse {
        0%, 100% { box-shadow: 0 0 0 rgba(17, 212, 82, 0.0); }
        50% { box-shadow: 0 0 14px rgba(17, 212, 82, 0.35); }
      }
      @keyframes activePop {
        0% { transform: scale(0.98); }
        70% { transform: scale(1.01); }
        100% { transform: scale(1); }
      }
      .sidebar-item {
        animation: sidebarItemEnter .35s ease-out both;
      }
      .sidebar-active {
        animation: activePop .22s ease-out both, activeNeonPulse 2.4s ease-in-out infinite;
      }
    `}</style>

    <aside
      className={`border-r border-slate-200 dark:border-[#2a3d31] bg-white/80 dark:bg-[#102216]/80 backdrop-blur-md hidden lg:flex lg:flex-col transition-all duration-300 overflow-hidden ${
        isOpen ? "w-64" : "w-16"
      }`}
      aria-hidden={!isOpen}
    >
      <div className={`${isOpen ? "p-6" : "p-3"} flex items-center ${isOpen ? "justify-between" : "justify-center"}`}>
        {isOpen ? (
          <>
            <div className="flex items-center gap-3">
              <div className="bg-primary size-8 rounded-md flex items-center justify-center text-[#102216]">
                <span className="material-symbols-outlined text-lg font-semibold">medical_services</span>
              </div>
              <span className="font-display font-bold text-lg tracking-tight uppercase text-slate-900 dark:text-slate-100">Medicare</span>
            </div>
            <button
              type="button"
              onClick={onToggleSidebar}
              className="size-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-[#1a2e21]/70 border border-slate-200 dark:border-[#2a3d31] text-slate-500 dark:text-[#b0c0b6] hover:text-primary transition-colors"
              aria-label="Close sidebar"
              title="Close sidebar"
            >
              <span className="material-symbols-outlined">left_panel_close</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="size-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-[#1a2e21]/70 border border-slate-200 dark:border-[#2a3d31] text-slate-500 dark:text-[#b0c0b6] hover:text-primary transition-colors"
            aria-label="Open sidebar"
            title="Open sidebar"
          >
            <span className="material-symbols-outlined">left_panel_open</span>
          </button>
        )}
      </div>

      <nav className={`flex-1 px-4 space-y-1 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-[#7f9487] font-bold px-3 mb-2 mt-4">Menu</div>
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setActiveItem(item.label)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
              activeItem === item.label
                ? "sidebar-active bg-primary/10 text-slate-900 dark:text-primary border-2 border-primary/20 dark:border-[#11d452] dark:shadow-[0_0_0_1px_rgba(17,212,82,0.35)]"
                : "sidebar-item text-slate-600 dark:text-[#b0c0b6] hover:bg-slate-100 dark:hover:bg-[#1a2e21] hover:text-slate-900 dark:hover:text-slate-100 hover:translate-x-1"
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className={`p-4 border-t border-slate-200 dark:border-[#2a3d31] ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="bg-slate-100 dark:bg-[#1a2e21]/70 p-3 rounded-xl flex items-center gap-3 mb-4 border border-slate-200 dark:border-[#2a3d31]">
          <div className="size-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-semibold">DM</div>
          <div className="flex flex-col">
            <span className="text-xs font-bold leading-none mb-1 text-slate-900 dark:text-slate-100">Dr. Moore</span>
            <span className="text-[10px] text-slate-500 dark:text-[#7f9487] uppercase font-medium">Cardiologist</span>
          </div>
        </div>
        <button className="w-full bg-primary hover:bg-primary/90 text-[#102216] font-bold text-sm py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-all" type="button">
          <span className="material-symbols-outlined text-sm">video_call</span>
          Start Consultation
        </button>
      </div>
    </aside>
    </>
  );
}

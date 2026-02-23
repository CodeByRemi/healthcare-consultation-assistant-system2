import { useEffect, useState } from "react";
import DashboardHeader from "./components/DashboardHeader";
import DashboardSidebar from "./components/DashboardSidebar";
import GrowthTrendsCard from "./components/GrowthTrendsCard";
import PatientQueueTable from "./components/PatientQueueTable";
import StatsGrid from "./components/StatsGrid";
import TodayFocusCard from "./components/TodayFocusCard";

export default function DoctorDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("doctor-dashboard-theme");
    return stored ? stored === "dark" : true;
  });

  useEffect(() => {
    localStorage.setItem("doctor-dashboard-theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen`}>
      <div className="min-h-screen bg-slate-50 dark:bg-[#102216] text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      <DashboardSidebar isOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      <main className="flex-1 overflow-y-auto">
        <DashboardHeader
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
        />

        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-slate-900 dark:text-slate-100">Good morning, Dr. Moore</h1>
            <p className="text-slate-600 dark:text-[#9eb0a4]">You have 12 appointments scheduled for today across all locations.</p>
          </div>

          <StatsGrid />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <TodayFocusCard />
            <PatientQueueTable />
          </div>

          <GrowthTrendsCard />
        </div>
      </main>
      </div>
    </div>
  );
}

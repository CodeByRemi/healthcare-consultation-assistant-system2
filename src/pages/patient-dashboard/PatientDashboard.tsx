import { useState } from "react";
import PatientSidebar from "./components/PatientSidebar";
import PatientDashboardHeader from "./components/PatientDashboardHeader";
import PatientMobileFooter from "./components/PatientMobileFooter";

export default function PatientDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen">
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200">
        <PatientSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          <PatientDashboardHeader 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          />
          
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
            <div className="max-w-7xl mx-auto w-full">
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-['Newsreader'] font-medium mb-2">
                  Welcome back, <span className="italic text-[#0A6ED1]">John</span>
                </h1>
                <p className="text-slate-500">
                  Here's what's happening with your health today.
                </p>
              </header>

              {/* Dashboard Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder Cards */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-semibold text-lg mb-4">Upcoming Appointments</h3>
                  <div className="text-slate-500 text-sm">
                    No upcoming appointments.
                  </div>
                  <button className="mt-4 text-[#0A6ED1] font-medium text-sm hover:underline">
                    Schedule New
                  </button>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-semibold text-lg mb-4">Recent Vitals</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Blood Pressure</span>
                      <span className="font-medium">120/80</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Heart Rate</span>
                      <span className="font-medium">72 bpm</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-3 bg-slate-50 rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors text-left">
                      Find Doctor
                    </button>
                    <button className="p-3 bg-slate-50 rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors text-left">
                      Refill RX
                    </button>
                    <button className="p-3 bg-slate-50 rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors text-left">
                      Messages
                    </button>
                    <button className="p-3 bg-slate-50 rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors text-left">
                      Lab Results
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <PatientMobileFooter />
        </main>
      </div>
    </div>
  );
}

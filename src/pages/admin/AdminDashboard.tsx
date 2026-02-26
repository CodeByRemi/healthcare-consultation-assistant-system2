import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Bell, 
  UserPlus
} from "lucide-react";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden transition-colors duration-300">
      <AdminSidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      <main className="flex-1 overflow-y-auto w-full transition-all duration-300">
        
        {/* Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors duration-300"
        >
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            >
              <span className="sr-only">Toggle Sidebar</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white capitalize transition-colors duration-300">{currentTab}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 bg-slate-100/50 dark:bg-slate-800 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-700 border border-transparent focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all w-64 md:w-80"
              />
            </div>
            
            <button className="relative p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
            </button>
            
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
              A
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {currentTab === 'dashboard' && <DashboardOverview />}
          {currentTab === 'doctors' && <DoctorsList />}
          {currentTab === 'patients' && <PatientsList />}
          {currentTab === 'appointments' && <AppointmentsList />}
          {/* Add other tabs */}
        </div>
      </main>
    </div>
  );
}

const stats = [
  { label: "Total Doctors", value: "0", change: "+0%", trend: "up" },
  { label: "Total Patients", value: "0", change: "+0%", trend: "up" },
  { label: "Appointments", value: "0", change: "+0%", trend: "up" },
  { label: "Revenue", value: "$0", change: "+0%", trend: "up" }
];

function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{stat.value}</h3>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full" 
                style={{ width: `75%` }} 
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
          <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-white">Recent Activity</h3>
            <button className="text-sm text-emerald-600 hover:underline dark:text-emerald-400">View All</button>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-700">
           {/* Recent activity will go here */}
           <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm">No recent activity</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 space-y-4 transition-colors">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Quick Actions</h3>
          <button className="w-full py-3 px-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-xl font-medium hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2">
            <UserPlus size={18} />
            Add New Doctor
          </button>
          <button className="w-full py-3 px-4 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2">
            <Search size={18} />
            Find Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

function DoctorsList() {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
           <div className="p-6 border-b border-slate-50 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Platform Doctors</h3>
            </div>
            <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm">
                No doctors found.
            </div>
        </div>
    );
}

function PatientsList() {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
           <div className="p-6 border-b border-slate-50 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Registered Patients</h3>
            </div>
            <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm">
                No patients found.
            </div>
        </div>
    );
}

function AppointmentsList() {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
           <div className="p-6 border-b border-slate-50 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Recent Appointments</h3>
            </div>
            <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm">
                No appointments found.
            </div>
        </div>
    );
}

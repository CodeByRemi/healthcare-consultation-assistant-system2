import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  MessageSquare, 
  ArrowRight, 
  Stethoscope,
  Activity,
  User 
} from "lucide-react";
import { Link } from "react-router-dom";
import PatientSidebar from "./components/PatientSidebar";
import PatientDashboardHeader from "./components/PatientDashboardHeader";
import PatientMobileFooter from "./components/PatientMobileFooter";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function PatientDashboard() {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [personalInfo, setPersonalInfo] = useState({
    weight: "—", 
    height: "—",
    bloodType: "—"
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 } as const
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "patients", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const fullName = userData.fullName || "Patient";
            setFirstName(fullName.split(" ")[0]);
            // Use actual data if available
            if (userData.weight) setPersonalInfo(prev => ({ ...prev, weight: userData.weight }));
            if (userData.height) setPersonalInfo(prev => ({ ...prev, height: userData.height }));
            if (userData.bloodType) setPersonalInfo(prev => ({ ...prev, bloodType: userData.bloodType }));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="flex flex-col md:flex-row min-h-screen transition-colors duration-200">
        <PatientSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          <PatientDashboardHeader 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          />
          
          <div className="flex-1 overflow-y-auto bg-slate-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
              
              {/* Welcome Section */}
              <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h1 className="text-3xl md:text-4xl font-display font-medium text-slate-900">
                  Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}, <span className="text-primary italic">
                    {isLoading ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      firstName || "Patient"
                    )}
                  </span>
                </h1>
                <p className="text-slate-500 mt-2 text-lg">
                  Here's your personal health overview.
                </p>
              </motion.header>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {[
                        { label: "Upcoming Appointments", value: "0", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
                        { label: "Unread Messages", value: "0", icon: MessageSquare, color: "text-amber-600", bg: "bg-amber-50" }
                    ].map((stat, idx) => (
                        <motion.div 
                            key={idx}
                            variants={itemVariants}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all cursor-pointer"
                        >
                            <div>
                                <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column (2 cols wide) */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Redesigned Featured Action Card */}
                        <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-500"></div>
                            
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="space-y-3 max-w-lg">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                                        <Activity size={14} />
                                        <span>Health Check</span>
                                    </div>
                                    <h2 className="text-2xl font-display font-bold text-slate-900">Time for a checkup?</h2>
                                    <p className="text-slate-500 leading-relaxed">
                                        Regular checkups are key to maintaining good health. Schedule a consultation with a specialist today.
                                    </p>
                                </div>
                                <Link to="/patient/book-appointment" className="bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:bg-primary/90 transition-all flex items-center gap-2 group-hover:gap-3">
                                    Book Appointment
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </motion.div>

                        {/* Recent Activity */}
                        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                                <h3 className="font-semibold text-lg text-slate-800">Recent Activity</h3>
                                <button className="text-primary text-sm font-medium hover:underline">View All</button>
                            </div>
                            <div className="divide-y divide-slate-50">
                                <div className="p-8 text-center text-slate-400 text-sm">
                                    No activity yet.
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column (1 col wide) */}
                    <div className="space-y-8">
                        
                        {/* Personal Info Summary (replacing Vitals) */}
                        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-semibold text-lg text-slate-800">Your Profile</h3>
                                <Link to="/patient/profile" className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                                    <User size={18} className="text-slate-400 hover:text-primary" />
                                </Link>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Name</p>
                                        <p className="font-semibold text-slate-800">{firstName}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Weight</p>
                                        <p className="font-semibold text-slate-800">{personalInfo.weight}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Height</p>
                                        <p className="font-semibold text-slate-800">{personalInfo.height}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl">
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Blood Type</p>
                                        <p className="font-semibold text-slate-800">{personalInfo.bloodType}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Actions Grid - Modified */}
                        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <h3 className="font-semibold text-lg text-slate-800 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => toast.info("Finding nearby doctors...")} className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex flex-col items-center gap-2 text-center group">
                                    <Stethoscope className="text-blue-600 group-hover:scale-110 transition-transform" size={24} />
                                    <span className="text-xs font-medium text-blue-800">Find Doctor</span>
                                </button>
                                <button onClick={() => toast.info("Opening AI Assistant...")} className="p-4 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors flex flex-col items-center gap-2 text-center group">
                                    <MessageSquare className="text-amber-600 group-hover:scale-110 transition-transform" size={24} />
                                    <span className="text-xs font-medium text-amber-800">Chat AI</span>
                                </button>
                            </div>
                        </motion.div>

                    </div>
                </div>

              </motion.div>
            </div>
          </div>
          <PatientMobileFooter />
        </main>
      </div>
    </div>
  );
}

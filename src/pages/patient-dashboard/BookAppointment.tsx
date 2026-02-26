import { useState, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt, FaStar, FaUserMd, FaClock, FaCalendarAlt, FaTimes, FaGraduationCap } from "react-icons/fa";
import PatientSidebar from "./components/PatientSidebar";
import PatientDashboardHeader from "./components/PatientDashboardHeader";
import PatientMobileFooter from "./components/PatientMobileFooter";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { collection, getDocs, addDoc, query } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../lib/firebase";

const timePreferences = ["Any Time", "Morning", "Afternoon", "Evening"];
const dayPreferences = ["Any Day", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const specialties = [
  { value: "All", label: "All Specialists", description: "View all available doctors" },
  { value: "General", label: "General Doctor", description: "Primary care physicians" },
  { value: "Cardiology", label: "Cardiologist", description: "Heart specialists" },
  { value: "Dermatology", label: "Dermatologist", description: "Skin specialists" },
  { value: "Neurology", label: "Neurologist", description: "Brain & nerve specialists" },
  { value: "Pediatrics", label: "Pediatrician", description: "Child specialists" }
];

export default function BookAppointment() {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  // Doctor List State
  const [doctorList, setDoctorList] = useState<any[]>([]);

  // Booking State
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");

  const [selectedDay, setSelectedDay] = useState("Any Day");
  const [selectedTime, setSelectedTime] = useState("Any Time"); // Filter preference
  
  // Selected Doctor for Modal
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [hoveredSpecialty, setHoveredSpecialty] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const q = query(collection(db, "doctors")); 
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as any)
        }));
        setDoctorList(docs);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to load doctors.");
      }
    };

    fetchDoctors();
  }, []);

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !bookingDate || !bookingTime) {
      toast.error("Please select a doctor, date, and time.");
      return;
    }

    if (!currentUser) {
      toast.error("You must be logged in to book.");
      return;
    }

    try {
      await addDoc(collection(db, "appointments"), {
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.fullName,
        patientId: currentUser.uid,
        date: bookingDate,
        time: bookingTime,
        status: "pending",
        createdAt: new Date().toISOString(),
        specialty: selectedDoctor.specialty
      });

      toast.success("Appointment request sent!");
      setSelectedDoctor(null);
      setBookingDate("");
      setBookingTime("");
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Failed to book appointment.");
    }
  };

  const filteredDoctors = doctorList.filter(doc => {
    const name = doc.fullName || "";
    const specialty = doc.specialty || "";
    
    // Search
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Specialty Filter
    const matchesSpecialty = selectedSpecialty === "All" || specialty === selectedSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen flex bg-slate-50">
      <PatientSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <PatientDashboardHeader 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto w-full">
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-['Newsreader'] font-medium mb-2 text-slate-900">
                      Find a Doctor
                    </h1>
                    <p className="text-slate-500">
                      Book an appointment with top specialists in your area.
                    </p>
                </header>

                {/* Search and Filter */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1 w-full">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search by doctor name or specialty..." 
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A6ED1]/20 focus:border-[#0A6ED1] transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="relative min-w-50">
                            <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A6ED1]/20 focus:border-[#0A6ED1] appearance-none"
                            >
                                {timePreferences.map(time => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>

                         <div className="relative min-w-50">
                            <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A6ED1]/20 focus:border-[#0A6ED1] appearance-none"
                            >
                                {dayPreferences.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-hide">
                        {specialties.map((spec) => (
                            <div key={spec.value} className="relative group">
                                <button
                                    onClick={() => setSelectedSpecialty(spec.value)}
                                    onMouseEnter={() => setHoveredSpecialty(spec.value)}
                                    onMouseLeave={() => setHoveredSpecialty(null)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                                        selectedSpecialty === spec.value 
                                        ? "bg-[#0A6ED1] text-white" 
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                >
                                    {spec.label}
                                </button>
                                
                                {/* Hover Tooltip */}
                                <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 text-white text-xs p-2 rounded-lg shadow-lg pointer-events-none transition-opacity z-10 ${
                                    hoveredSpecialty === spec.value ? "opacity-100" : "opacity-0"
                                }`}>
                                    {spec.description}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Doctors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.map((doc, idx) => (
                        <motion.div 
                            key={doc.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            onClick={() => setSelectedDoctor(doc)}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={doc.image} 
                                        alt={doc.name} 
                                        className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 group-hover:border-[#0A6ED1] transition-colors"
                                    />
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#0A6ED1] transition-colors">{doc.name}</h3>
                                        <p className="text-[#0A6ED1] font-medium text-sm">{doc.specialty}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                                    <FaStar className="text-yellow-400 w-3 h-3" />
                                    <span className="text-xs font-bold text-slate-700">{doc.rating}</span>
                                    <span className="text-slate-400 text-xs">({doc.reviews})</span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <FaMapMarkerAlt className="text-slate-400 min-w-4" />
                                    <span className="truncate">{doc.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <FaUserMd className="text-slate-400 min-w-4" />
                                    {doc.experience} Experience
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <FaCalendarAlt className="text-slate-400 min-w-4" />
                                    <span className="truncate">
                                        {doc.availableDays ? doc.availableDays.slice(0, 3).join(", ") + (doc.availableDays.length > 3 ? "..." : "") : "Mon-Fri"}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-end">
                                <button className="text-[#0A6ED1] font-medium hover:underline text-sm">
                                    View Details
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    
                    {filteredDoctors.length === 0 && (
                        <div className="col-span-full text-center py-20 text-slate-400">
                            <FaUserMd className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p>No doctors found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
            
            <PatientMobileFooter />

            {/* Doctor Details Modal */}
            <AnimatePresence>
                {selectedDoctor && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedDoctor(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="relative h-40 bg-linear-to-r from-[#0A6ED1] to-cyan-500">
                                <button 
                                    onClick={() => setSelectedDoctor(null)}
                                    className="absolute top-4 right-4 bg-black/20 hover:bg-black/30 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            
                            <div className="px-6 md:px-10 pb-10 -mt-16 relative">
                                <div className="bg-white rounded-2xl p-2 inline-block shadow-lg mb-4">
                                    <img 
                                        src={selectedDoctor.image} 
                                        alt={selectedDoctor.name} 
                                        className="w-32 h-32 rounded-xl object-cover"
                                    />
                                </div>
                                
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                    <div>
                                        <h2 className="text-3xl font-bold text-slate-900 mb-1">{selectedDoctor.name}</h2>
                                        <p className="text-[#0A6ED1] font-semibold text-lg flex items-center gap-2">
                                            {selectedDoctor.specialty}
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                            <span className="text-slate-500 font-normal text-sm">{selectedDoctor.experience} Exp.</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-100">
                                        <FaStar className="text-yellow-400 w-5 h-5" />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800 leading-none">{selectedDoctor.rating}</span>
                                            <span className="text-xs text-slate-500">{selectedDoctor.reviews} reviews</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                                <FaUserMd className="text-[#0A6ED1]" />
                                                About Doctor
                                            </h3>
                                            <p className="text-slate-600 leading-relaxed text-sm">
                                                {selectedDoctor.about || `${selectedDoctor.name} is a dedicated ${selectedDoctor.specialty} with over ${selectedDoctor.experience} of experience in providing top-quality healthcare. They are committed to patient well-being and use the latest medical advancements.`}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                <div className="text-slate-400 text-xs uppercase font-bold mb-1">Availability</div>
                                                <div className="text-green-600 font-bold text-sm">{selectedDoctor.availability || "Available Today"}</div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                                <FaGraduationCap className="text-[#0A6ED1]" />
                                                Education
                                            </h3>
                                            <p className="text-slate-600 text-sm">
                                                {selectedDoctor.education || "MD - Top Medical University"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                                <FaCalendarAlt className="text-[#0A6ED1]" />
                                                Select Appointment Time
                                            </h3>
                                            
                                            <div className="mb-4">
                                                <label className="text-xs font-semibold text-slate-500 mb-2 uppercase block">Date</label>
                                                <input 
                                                    type="date" 
                                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg mb-4 cursor-pointer focus:ring-2 focus:ring-[#0A6ED1]"
                                                    value={bookingDate}
                                                    onChange={(e) => setBookingDate(e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>

                                            <div>
                                                <div className="text-xs font-semibold text-slate-500 mb-2 uppercase">Available Times</div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {(selectedDoctor.timeSlots || ["09:00 AM", "10:00 AM", "11:00 AM"]).map((time: string) => (
                                                        <button 
                                                            key={time} 
                                                            onClick={() => setBookingTime(time)}
                                                            className={`px-2 py-2 rounded-lg text-sm font-medium border transition-colors text-center ${
                                                                bookingTime === time 
                                                                ? "bg-[#0A6ED1] text-white border-[#0A6ED1]" 
                                                                : "bg-white text-slate-600 border-slate-200 hover:border-[#0A6ED1]"
                                                            }`}
                                                        >
                                                            {time}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-slate-100">
                                            <button 
                                                onClick={handleBookAppointment} 
                                                disabled={!bookingDate || !bookingTime}
                                                className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                                                    (!bookingDate || !bookingTime) 
                                                    ? "bg-slate-300 text-slate-500 cursor-not-allowed" 
                                                    : "bg-[#0A6ED1] hover:bg-[#095bb0] text-white shadow-blue-500/20 active:scale-[0.98]"
                                                }`}
                                            >
                                                {(!bookingDate || !bookingTime) ? "Select Date & Time" : "Confirm Booking"}
                                            </button>
                                            <p className="text-center text-xs text-slate-400 mt-3">
                                                Book your consultation now.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

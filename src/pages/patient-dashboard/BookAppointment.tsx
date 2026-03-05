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

const timePreferences = [
  "All Times", 
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
];

const dayPreferences = ["Any Day", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Helper to convert time string (e.g. "09:00 AM") to minutes from midnight
const convertToMinutes = (timeStr: string): number => {
  if (!timeStr) return -1;
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*([AaPp][Mm])/);
  if (!match) return -1;
  
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const ampm = match[3].toUpperCase();
  
  if (ampm === "PM" && hours !== 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;
  
  return hours * 60 + minutes;
};

// Helper to extract start and end times from availability string
const extractTimeRange = (availStr: string): [number, number] => {
  // Matches times like "09:00 AM" or "5:00 PM"
  const timeRegex = /((1[0-2]|0?[1-9]):([0-5][0-9])\s*([AaPp][Mm]))/g;
  const matches = availStr.match(timeRegex);
  
  if (!matches || matches.length < 2) {
      // Default to full work day if not parsable but exists
      return [540, 1020]; // 09:00 AM to 05:00 PM
  }
  
  const start = convertToMinutes(matches[0]);
  const end = convertToMinutes(matches[1]);
  return [start, end];
};

const specialties = [
  { value: "All", label: "All Specialists", description: "View all available doctors" },
  { value: "General", label: "General Doctor", description: "Primary care physicians" },
  { value: "Cardiology", label: "Cardiologist", description: "Heart specialists" },
  { value: "Dermatology", label: "Dermatologist", description: "Skin specialists" },
  { value: "Neurology", label: "Neurologist", description: "Brain & nerve specialists" },
  { value: "Pediatrics", label: "Pediatrician", description: "Child specialists" }
];

interface Doctor {
  id: string;
  name: string;
  fullName?: string;
  specialty: string;
  image: string;
  rating?: number;
  reviews?: number;
  experience?: string;
  location?: string;
  about?: string;
  education?: string;
  certification?: string;
  specialization?: string;
  availability?: string;
  devices?: string;
  fee?: number;
  patients?: string;
  successRate?: string;
  availableDays?: string[];
}

const DOCTOR_IMAGE_PLACEHOLDER = "https://placehold.co/160x160?text=Doctor";

const toText = (value: unknown) => (typeof value === "string" ? value : "");

const toArrayOfText = (value: unknown): string[] => {
    if (Array.isArray(value)) {
        return value.filter((item) => typeof item === "string") as string[];
    }
    if (typeof value === "string" && value.trim()) {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }
    return [];
};

const getDoctorDisplayName = (doctor: {
    name?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
}) => {
    const composedName = `${doctor.firstName || ""} ${doctor.lastName || ""}`.trim();
    return doctor.fullName || doctor.name || composedName || "Doctor";
};

interface BookedAppointmentData {
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  date: string;
  time: string;
    status: string;
}

export default function BookAppointment() {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  // Doctor List State
  const [doctorList, setDoctorList] = useState<Doctor[]>([]);

  // Booking State
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");

  const [selectedDay, setSelectedDay] = useState("Any Day");
  const [selectedTime, setSelectedTime] = useState("All Times"); // Filter preference
  
  // Selected Doctor for Modal
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [hoveredSpecialty, setHoveredSpecialty] = useState<string | null>(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<BookedAppointmentData | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const q = query(collection(db, "doctors")); 
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map((doc) => {
                    const docData = doc.data() as Record<string, unknown>;
                    const doctorName = getDoctorDisplayName({
                        name: toText(docData.name),
                        fullName: toText(docData.fullName),
                        firstName: toText(docData.firstName),
                        lastName: toText(docData.lastName)
                    });

                    const specialty =
                        toText(docData.specialty) ||
                        toText(docData.specialization) ||
                        "General";

                    const image =
                        toText(docData.image) ||
                        toText(docData.photoURL) ||
                        toText(docData.profileImage) ||
                        DOCTOR_IMAGE_PLACEHOLDER;

          return {
            id: doc.id,
                        ...(docData as Omit<Doctor, 'id'>),
                        name: doctorName,
                        fullName: doctorName,
                        specialty,
                        image,
                        about: toText(docData.about),
                        education: toText(docData.education),
                        certification: toText(docData.certification),
                        specialization: toText(docData.specialization),
                        location: toText(docData.location),
                        experience: toText(docData.experience),
                        availability: toText(docData.availability) || "Mon - Fri, 09:00 AM - 05:00 PM",
                        availableDays: toArrayOfText(docData.availableDays).length > 0 ? toArrayOfText(docData.availableDays) : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
          } as Doctor;
        });
        setDoctorList(docs);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to load doctors.");
      }
    };

    fetchDoctors();
  }, []);

  const handleBookClick = () => {
    if (!selectedDoctor || !bookingDate || !bookingTime) {
        toast.error("Please select a doctor, date, and time.");
        return;
    }
    if (!currentUser) {
        toast.error("You must be logged in to book.");
        return;
    }
    setShowConsentModal(true);
  };

  const handleConsentAgree = async () => {
    setShowConsentModal(false);
    await executeBooking();
  };

  const executeBooking = async () => {
    if (!selectedDoctor || !bookingDate || !bookingTime || !currentUser) {
      return;
    }

    try {
      await addDoc(collection(db, "appointments"), {
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.fullName || selectedDoctor.name,
        patientId: currentUser.uid,
        date: bookingDate,
        time: bookingTime,
        status: "pending",
        createdAt: new Date().toISOString(),
        specialty: selectedDoctor.specialty,
        shareAIChat: true // User consented to share AI chat history
      });

      // Set booking details for confirmation modal
      setBookedAppointment({
        doctorName: selectedDoctor.fullName || selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
        doctorImage: selectedDoctor.image,
        date: bookingDate,
                time: bookingTime,
                status: "pending"
      });
      setSelectedDoctor(null);       setConfirmationModal(true);
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Failed to book appointment.");
    }
  };

  const handleConfirmationClose = () => {
    setConfirmationModal(false);
    setSelectedDoctor(null);
    setBookingDate("");
    setBookingTime("");
    setBookedAppointment(null);
    toast.success("Appointment booked successfully!");
  };

    const filteredDoctors = doctorList.filter(doc => {
        const name = (doc.fullName || doc.name || "").toLowerCase();
        const specialty = (doc.specialty || "").toLowerCase();
    
    // Search
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || 
                          specialty.includes(searchTerm.toLowerCase());
    
    // Specialty Filter
    const matchesSpecialty = selectedSpecialty === "All" || specialty === selectedSpecialty.toLowerCase();

    // Time/Day Filter
    const matchesDay = selectedDay === "Any Day" || (doc.availableDays && doc.availableDays.includes(selectedDay));

    const matchesTime = selectedTime === "All Times" || (() => {
        const avail = (doc.availability || "").toLowerCase();
        
        // Try to parse range
        const [startMin, endMin] = extractTimeRange(avail);
        const selectedMin = convertToMinutes(selectedTime);
        
        if (selectedMin === -1) return true; // Can't parse selected time
        
        // Simple range check: is selected time within doctor's availability
        return selectedMin >= startMin && selectedMin <= endMin;
    })();
    
    return matchesSearch && matchesSpecialty && matchesDay && matchesTime;
  });

  // Generate simulated time slots based on selected date
  const getAvailableTimeSlots = (dateString: string) => {
    if (!dateString) return [];
    // Mock simulation: different slots for different days/dates
    const date = new Date(dateString);
    const day = date.getDay();
    
    // Weekend logic (just for variety)
    if (day === 0 || day === 6) {
        return ["10:00 AM", "11:00 AM", "02:00 PM"];
    }
    
    return [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
        "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", 
        "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
    ];
  };

  const currentSlots = getAvailableTimeSlots(bookingDate);

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
                            onClick={() => setSelectedDoctor({ ...doc })}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={doc.image || DOCTOR_IMAGE_PLACEHOLDER} 
                                        alt={doc.fullName || doc.name || "Doctor"} 
                                        className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 group-hover:border-[#0A6ED1] transition-colors"
                                    />
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#0A6ED1] transition-colors">{doc.fullName || doc.name || "Doctor"}</h3>
                                        <p className="text-[#0A6ED1] font-medium text-sm">{doc.specialty || "General"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                                    <FaStar className="text-yellow-400 w-3 h-3" />
                                    <span className="text-xs font-bold text-slate-700">{doc.rating ?? "Placeholder"}</span>
                                    <span className="text-slate-400 text-xs">({doc.reviews ?? "Placeholder"})</span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <FaMapMarkerAlt className="text-slate-400 min-w-4" />
                                    <span className="truncate">{doc.location || "Placeholder"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <FaUserMd className="text-slate-400 min-w-4" />
                                    {doc.experience ? `${doc.experience} Experience` : "Placeholder"}
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <FaCalendarAlt className="text-slate-400 min-w-4" />
                                    <span className="truncate">
                                        {doc.availableDays && doc.availableDays.length > 0 ? doc.availableDays.slice(0, 3).join(", ") + (doc.availableDays.length > 3 ? "..." : "") : "Placeholder"}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-end">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedDoctor({ ...doc });
                                    }}
                                    className="text-[#0A6ED1] font-medium hover:underline text-sm hover:text-[#095bb0] transition-colors"
                                >
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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 flex items-center justify-center p-4"
                        onClick={() => setSelectedDoctor(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
                        >
                            {/* Header with Gradient Background */}
                            <div className="relative h-48 bg-linear-to-r from-[#0A6ED1] to-cyan-500">
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48"></div>
                                </div>
                                <button 
                                    onClick={() => setSelectedDoctor(null)}
                                    className="absolute top-4 right-4 bg-black/20 hover:bg-black/30 text-white p-3 rounded-full transition-colors backdrop-blur-sm z-10"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="px-6 md:px-12 pb-12 -mt-24 relative">
                                {/* Doctor Card with Image */}
                                <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-10">
                                    <div className="shrink-0">
                                        <div className="bg-white rounded-3xl p-3 shadow-xl inline-block border-4 border-white">
                                            <img 
                                                src={selectedDoctor.image || DOCTOR_IMAGE_PLACEHOLDER} 
                                                alt={selectedDoctor.fullName || selectedDoctor.name || "Doctor"} 
                                                className="w-40 h-40 rounded-2xl object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Doctor Info */}
                                    <div className="flex-1 pt-4">
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                            <div>
                                                <h2 className="text-4xl font-bold text-slate-900 mb-2">{selectedDoctor.fullName || selectedDoctor.name || "Doctor"}</h2>
                                                <p className="text-[#0A6ED1] font-bold text-lg mb-3">{selectedDoctor.specialty || "General"}</p>
                                                <div className="flex items-center gap-4 flex-wrap">
                                                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                                                        <FaStar className="text-yellow-400 w-4 h-4" />
                                                        <span className="font-bold text-slate-800">{selectedDoctor.rating ?? "Placeholder"}</span>
                                                        <span className="text-slate-500 text-sm">({selectedDoctor.reviews ?? "Placeholder"} reviews)</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <FaClock className="text-slate-400" />
                                                        <span className="text-sm">{selectedDoctor.experience ? `${selectedDoctor.experience} Years Experience` : "Placeholder"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Stats */}
                                        <div className="grid grid-cols-2 gap-3 mt-6">
                                            <div className="bg-green-50 p-4 rounded-2xl border border-green-200">
                                                <div className="text-xs text-green-600 font-bold uppercase mb-1">Patients Helped</div>
                                                <div className="text-2xl font-bold text-slate-900">{selectedDoctor.patients || "Placeholder"}</div>
                                            </div>
                                            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                                                <div className="text-xs text-[#0A6ED1] font-bold uppercase mb-1">Success Rate</div>
                                                <div className="text-2xl font-bold text-slate-900">{selectedDoctor.successRate || "Placeholder"}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Left Column - Doctor Info */}
                                    <div className="lg:col-span-2 space-y-8">
                                        {/* About Doctor */}
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                                                <FaUserMd className="text-[#0A6ED1] w-5 h-5" />
                                                About Doctor
                                            </h3>
                                            <p className="text-slate-600 leading-relaxed">
                                                {selectedDoctor.about || "Placeholder"}
                                            </p>
                                        </div>

                                        {/* Education & Certifications */}
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                                                <FaGraduationCap className="text-[#0A6ED1] w-5 h-5" />
                                                Education & Certifications
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-[#0A6ED1] mt-2 shrink-0"></div>
                                                    <p className="text-slate-600">{selectedDoctor.education || "Placeholder"}</p>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-[#0A6ED1] mt-2 shrink-0"></div>
                                                    <p className="text-slate-600">{selectedDoctor.certification || "Placeholder"}</p>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-[#0A6ED1] mt-2 shrink-0"></div>
                                                    <p className="text-slate-600">{selectedDoctor.specialization || "Placeholder"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Location & Availability */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                                    <FaMapMarkerAlt className="text-[#0A6ED1]" />
                                                    Location
                                                </h4>
                                                <p className="text-slate-600 text-sm">{selectedDoctor.location || "Placeholder"}</p>
                                            </div>
                                            <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
                                                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                                    <FaClock className="text-green-600" />
                                                    Availability
                                                </h4>
                                                <p className="text-green-600 font-bold text-sm">{selectedDoctor.availability || "Placeholder"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Booking Section */}
                                    <div className="lg:col-span-1">
                                        <div className="sticky top-6 bg-white rounded-3xl border border-slate-200 p-8 shadow-lg">
                                            <h3 className="font-bold text-slate-900 text-xl mb-6 flex items-center gap-2">
                                                <FaCalendarAlt className="text-[#0A6ED1]" />
                                                Book Appointment
                                            </h3>

                                            {/* Date Selection */}
                                            <div className="mb-6">
                                                <label className="text-xs font-bold text-slate-500 mb-3 uppercase block">Select Date</label>
                                                <input 
                                                    type="date" 
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent outline-none transition-all cursor-pointer"
                                                    value={bookingDate}
                                                    onChange={(e) => setBookingDate(e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>

                                            {/* Time Selection */}
                                            <div className="mb-8">
                                                <label className="text-xs font-bold text-slate-500 mb-3 uppercase block">Select Time</label>
                                                
                                                {!bookingDate ? (
                                                    <div className="text-sm text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                                                        Please select a date first
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {currentSlots.length > 0 ? (
                                                            currentSlots.map((time: string) => (
                                                                <button 
                                                                    key={time} 
                                                                    onClick={() => setBookingTime(time)}
                                                                    className={`w-full px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                                                                        bookingTime === time 
                                                                        ? "bg-[#0A6ED1] text-white border-[#0A6ED1] shadow-lg shadow-blue-500/30" 
                                                                        : "bg-white text-slate-600 border-slate-200 hover:border-[#0A6ED1] hover:bg-blue-50"
                                                                    }`}
                                                                >
                                                                    {time}
                                                                </button>
                                                            ))
                                                        ) : (
                                                            <div className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-xl border border-slate-200">
                                                                No slots available
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Summary */}
                                            {bookingDate && bookingTime && (
                                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-6">
                                                    <div className="text-xs text-blue-600 font-bold uppercase mb-2">Booking Summary</div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm text-slate-700"><span className="font-semibold">Date:</span> {new Date(bookingDate).toLocaleDateString()}</p>
                                                        <p className="text-sm text-slate-700"><span className="font-semibold">Time:</span> {bookingTime}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Book Button */}
                                            <button 
                                                onClick={handleBookClick} 
                                                disabled={!bookingDate || !bookingTime}
                                                className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all ${
                                                    (!bookingDate || !bookingTime) 
                                                    ? "bg-slate-300 text-slate-500 cursor-not-allowed" 
                                                    : "bg-[#0A6ED1] hover:bg-[#095bb0] text-white shadow-blue-500/30 active:scale-95 hover:shadow-xl"
                                                }`}
                                            >
                                                {(!bookingDate || !bookingTime) ? "Select Date & Time" : "Confirm Booking"}
                                            </button>
                                            <p className="text-center text-xs text-slate-400 mt-4">
                                                A confirmation email will be sent to your registered email.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Consent Modal */}
            <AnimatePresence>
                {showConsentModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                        onClick={() => setShowConsentModal(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8"
                        >
                             <div className="flex items-center gap-3 mb-4 text-[#0A6ED1]">
                                 <FaUserMd className="w-8 h-8" />
                                 <h2 className="text-xl font-bold text-slate-900">Health Data Consent</h2>
                             </div>
                             
                             <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                                 To provide the best possible care, your doctor needs access to your recent health interactions.
                             </p>
                             
                             <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                                 <p className="text-sm text-slate-800 font-medium">
                                     By proceeding, you agree to share your <span className="text-[#0A6ED1]">AI Health Assistant conversation history</span> with {selectedDoctor?.fullName || getDoctorDisplayName(selectedDoctor || {})}.
                                 </p>
                             </div>

                             <div className="flex gap-3">
                                 <button
                                     onClick={() => setShowConsentModal(false)}
                                     className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                                 >
                                     Cancel
                                 </button>
                                 <button
                                     onClick={handleConsentAgree}
                                     className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-[#0A6ED1] hover:bg-[#095bb0] shadow-blue-500/30 shadow-lg transition-all"
                                 >
                                     I Agree & Book
                                 </button>
                             </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Booking Confirmation Modal */}
            <AnimatePresence>
                {confirmationModal && bookedAppointment && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={handleConfirmationClose}
                    >
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col relative"
                        >
                            {/* Fixed Close Button - Always Visible */}
                            <button 
                                onClick={handleConfirmationClose}
                                className="absolute top-4 right-4 bg-black/20 hover:bg-black/30 text-white p-2 rounded-full transition-colors z-50 backdrop-blur-sm"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>

                            {/* Scrollable Content */}
                            <div className="overflow-y-auto flex-1">
                                {/* Success Header */}
                                <div className="bg-linear-to-r from-green-400 to-emerald-500 px-6 py-10 md:px-8 md:py-12 text-center relative">
                                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
                                    </div>
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="relative z-10"
                                    >
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                            <div className="text-3xl md:text-4xl">✓</div>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-white">Success!</h2>
                                        <p className="text-green-50 mt-2 text-sm md:text-base">Your appointment request is pending</p>
                                    </motion.div>
                                </div>

                                {/* Confirmation Details */}
                                <div className="p-6 md:p-8 space-y-6">
                                    {/* Doctor Card */}
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                        <div className="flex items-center gap-4">
                                            <img 
                                                src={bookedAppointment.doctorImage} 
                                                alt={bookedAppointment.doctorName} 
                                                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                                            />
                                            <div>
                                                <h3 className="font-bold text-slate-900">{bookedAppointment.doctorName}</h3>
                                                <p className="text-sm text-[#0A6ED1] font-semibold">{bookedAppointment.doctorSpecialty}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Appointment Details */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200">
                                            <span className="text-slate-600 font-medium flex items-center gap-2 text-sm">
                                                <FaCalendarAlt className="text-[#0A6ED1]" />
                                                Date
                                            </span>
                                            <span className="font-bold text-slate-900 text-sm">{new Date(bookedAppointment.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-200">
                                            <span className="text-slate-600 font-medium flex items-center gap-2 text-sm">
                                                <FaClock className="text-purple-600" />
                                                Time
                                            </span>
                                            <span className="font-bold text-slate-900 text-sm">{bookedAppointment.time}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200">
                                            <span className="text-slate-600 font-medium text-sm">Status</span>
                                            <span className="font-bold text-amber-700 capitalize text-sm">{bookedAppointment.status}</span>
                                        </div>
                                    </div>

                                    {/* Confirmation Info */}
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                                        <p className="text-xs md:text-sm text-slate-700 text-center">
                                            <span className="font-semibold">Request Pending.</span> You'll receive a notification once confirmed.
                                        </p>
                                    </div>

                                    {/* Close Button */}
                                    <button 
                                        onClick={handleConfirmationClose}
                                        className="w-full py-3 md:py-4 bg-[#0A6ED1] hover:bg-[#095bb0] text-white font-bold rounded-xl transition-colors active:scale-95 text-sm md:text-base"
                                    >
                                        Done
                                    </button>
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

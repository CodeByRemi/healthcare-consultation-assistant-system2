import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import { 
  FaPlus, 
  FaAngleLeft, 
  FaAngleRight, 
  FaBan, 
  FaCheckCircle, 
  FaChartLine,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD
  time: string;
  patient: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Blocked';
  type: string;
  duration: string;
  notes?: string;
  isNewPatient?: boolean;
  doctorId?: string;
  doctorName?: string;
  patientId?: string;
  patientPhone?: string;
  patientEmail?: string;
  specialty?: string;
  shareAIChat?: boolean;
  mode?: string;
  location?: string;
  meetingLink?: string;
  reason?: string;
  symptoms?: string[];
  createdAt?: string;
  updatedAt?: string;
  additionalDetails?: Record<string, string>;
}

// Time slots for the grid rows (8 AM to 5 PM)
const timeSlots = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

export default function DoctorSchedule() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'day' | 'week' | 'month'>('week');
  const { currentUser: user } = useAuth();
  
  // State for appointments across the week
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    newPatients: 0,
    capacityUsed: 0,
    blockedHours: 0
  });
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [expandedAppointmentId, setExpandedAppointmentId] = useState<string | null>(null);

  // Helper to get days to display based on view type
  const displayDays = useMemo(() => {
    if (viewType === 'day') {
        return [currentDate];
    }
    
    if (viewType === 'week') {
        const start = new Date(currentDate);
        const day = start.getDay(); // 0 is Sunday, 1 is Monday...
        // Start week on Monday
        const daysToSubtract = day === 0 ? 6 : day - 1;
        start.setDate(start.getDate() - daysToSubtract);
        
        const days = [];
        for (let i = 0; i < 5; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            days.push(d);
        }
        return days;
    }

    // Month View Logic
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    // Adjust start to beginning of week (Monday) for grid
    const startDay = start.getDay(); // 0-6
    const daysToSubtract = startDay === 0 ? 6 : startDay - 1;
    start.setDate(start.getDate() - daysToSubtract);

    // Generate 42 days (6 weeks) to fill standard calendar grid
    const days = [];
    for (let i = 0; i < 42; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        days.push(d);
    }
    return days;
  }, [currentDate, viewType]);



  const formatDateId = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const stringifyFieldValue = useCallback((value: unknown): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    if (Array.isArray(value)) {
      return value.map((item) => stringifyFieldValue(item)).filter(Boolean).join(", ");
    }
    if (typeof value === "object") {
      if ("toDate" in (value as Record<string, unknown>) && typeof (value as { toDate?: unknown }).toDate === "function") {
        try {
          const asDate = (value as { toDate: () => Date }).toDate();
          return asDate.toLocaleString();
        } catch {
          return "";
        }
      }
      return JSON.stringify(value);
    }
    return "";
  }, []);

  useEffect(() => {
    const fetchWeekSchedule = async () => {
        if (!user) return;
        try {
            const startDay = displayDays[0];
            const endDay = displayDays[displayDays.length - 1];
            
            const startStr = formatDateId(startDay);
            const endStr = formatDateId(endDay);

            // Fetch appointments for the range
            const q = query(
                collection(db, "appointments"),
                where("doctorId", "==", user.uid),
                where("date", ">=", startStr),
                where("date", "<=", endStr)
            );
            
            const querySnapshot = await getDocs(q);
            const appts: Appointment[] = [];
            let blockedCount = 0;
            let newPatientsCount = 0;

            // Pre-fetch patient info matching my patients logic
            const patientDataMap = new Map<string, any>();
            for (const docSnap of querySnapshot.docs) {
               const data = docSnap.data();
               if (data.patientId && !patientDataMap.has(data.patientId)) {
                   try {
                       const pDoc = await getDoc(doc(db, "patients", data.patientId));
                       if (pDoc.exists()) {
                           patientDataMap.set(data.patientId, pDoc.data());
                       }
                   } catch(e) { console.error(e); }
               }
            }

            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
		const pData = patientDataMap.get(data.patientId) || {};
                let status: Appointment['status'] = 'Pending';
                
                if (data.status) {
                    const normalizedStatus = data.status.charAt(0).toUpperCase() + data.status.slice(1);
                    if (['Confirmed', 'Pending', 'Cancelled', 'Blocked'].includes(normalizedStatus)) {
                         status = normalizedStatus as Appointment['status'];
                    }
                }
                
                if (status === 'Blocked') blockedCount++;
                if (data.isNewPatient) newPatientsCount++;

                const additionalDetails: Record<string, string> = {};
                const handledKeys = new Set([
                  'date',
                  'time',
                  'status',
                  'patientName',
                  'type',
                  'duration',
                  'notes',
                  'isNewPatient',
                  'doctorId',
                  'doctorName',
                  'patientId',
                  'patientPhone',
                  'patientEmail',
                  'specialty',
                  'shareAIChat',
                  'mode',
                  'location',
                  'meetingLink',
                  'reason',
                  'symptoms',
                  'createdAt',
                  'updatedAt'
                ]);

                Object.entries(data).forEach(([key, value]) => {
                  if (handledKeys.has(key)) return;
                  const text = stringifyFieldValue(value);
                  if (text) {
                    additionalDetails[key] = text;
                  }
                });

                appts.push({
                    id: docSnap.id,
                    date: data.date,
                    time: data.time || "00:00",
                    patient: pData.fullName || data.patientName || "Unknown Patient",
                    status: status,
                    type: data.type || "General Consultation",
                    duration: data.duration || "60 min", // Default to hour slots for grid simplicity unless specified
                    notes: data.notes,
                    isNewPatient: data.isNewPatient,
                    doctorId: data.doctorId,
                    doctorName: data.doctorName,
                    patientId: data.patientId,
                    patientPhone: pData.phoneNumber || data.patientPhone || "Phone not available",
                    patientEmail: pData.email || data.patientEmail || "Email not available",
                    specialty: data.specialty,
                    shareAIChat: data.shareAIChat,
                    mode: data.mode,
                    location: data.location,
                    meetingLink: data.meetingLink,
                    reason: data.reason,
                    symptoms: Array.isArray(data.symptoms) ? data.symptoms : undefined,
                    createdAt: stringifyFieldValue(data.createdAt),
                    updatedAt: stringifyFieldValue(data.updatedAt),
                    additionalDetails
                });
            });

            if (appts.length === 0) {
                 // No appointments found
            }

            setAppointments(appts);
            
            // Calculate Stats
            const totalSlots = displayDays.length * timeSlots.length; // Total grid cells
            const filledSlots = appts.length;
            setStats({
                totalAppointments: filledSlots,
                newPatients: newPatientsCount,
                capacityUsed: totalSlots > 0 ? Math.round((filledSlots / totalSlots) * 100) : 0,
                blockedHours: blockedCount
            });

        } catch (error) {
            console.error("Error loading schedule:", error);
        }
    };
    
    fetchWeekSchedule();
  }, [user, displayDays, viewType, currentDate, stringifyFieldValue]); // Added viewType and currentDate dependency


  const handlePrev = () => {
    const d = new Date(currentDate);
    if (viewType === 'day') d.setDate(d.getDate() - 1);
    else if (viewType === 'week') d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (viewType === 'day') d.setDate(d.getDate() + 1);
    else if (viewType === 'week') d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleNewAvailability = () => {
    navigate('/doctor/availability');
  };

  const handleBlockedBooking = () => {
    navigate('/doctor/blocked-booking');
  };

  const handleCellClick = () => {
      // Navigate to availability page for that specific date if needed
      // Or open modal for quick add?
      // Since we implemented a full page, let's keep it consistent
      navigate('/doctor/availability');
  };

  // Helper to find appointment for a cell
  const getAppointment = (dateStr: string, time: string) => {
      return appointments.find(a => a.date === dateStr && a.time === time);
  };

  // Helpers for time formatting and ranges
  const to24h = (t: string) => {
    const [time, period] = t.split(' ');
    const [hhStr, mmStr] = time.split(':');
    let hh = Number(hhStr);
    const mm = Number(mmStr);
    if (period?.toUpperCase() === 'PM' && hh < 12) hh += 12;
    if (period?.toUpperCase() === 'AM' && hh === 12) hh = 0;
    return { hh, mm };
  };
  const format12h = (hh: number, mm: number) => {
    const period = hh >= 12 ? 'PM' : 'AM';
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    const mmStr = String(mm).padStart(2, '0');
    return `${String(h12).padStart(2, '0')}:${mmStr} ${period}`;
  };
  const addMinutesToTime = (t: string, minutes: number) => {
    try {
      const { hh, mm } = to24h(t);
      const total = hh * 60 + mm + minutes;
      const endH = Math.floor(((total % (24 * 60)) + (24 * 60)) % (24 * 60) / 60);
      const endM = ((total % 60) + 60) % 60;
      return format12h(endH, endM);
    } catch {
      return t;
    }
  };
  const parseDurationMinutes = (d?: string) => {
    if (!d) return null;
    const m = d.match(/(\d+)/);
    return m ? Number(m[1]) : null;
  };
  const timeRange = (start: string, duration?: string) => {
    const mins = parseDurationMinutes(duration);
    if (!mins) return start;
    return `${start} – ${addMinutesToTime(start, mins)}`;
  };

  const openDetails = (appt: Appointment) => {
    setSelectedAppointment(appt);
    setIsDetailsOpen(true);
  };

  const getPatientInitials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "PT";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  const isPreviewAppointment = (appt: Appointment | null | undefined) => Boolean(appt?.id.startsWith("preview-"));

  const extractNotesField = (notesValue: string | undefined, fieldLabel: string) => {
    if (!notesValue) return undefined;
    const result = new RegExp(`${fieldLabel}\\s*:\\s*([^\\n]+)`, "i").exec(notesValue);
    return result?.[1]?.trim();
  };


  const sortedAppointments = useMemo(() => {
    const toMinutes = (timeValue: string) => {
      const parsed = to24h(timeValue);
      return parsed.hh * 60 + parsed.mm;
    };

    return [...appointments].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return toMinutes(a.time) - toMinutes(b.time);
    });
  }, [appointments]);

  const formatDisplayDate = (dateStr: string) => {
    const parsed = new Date(`${dateStr}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return dateStr;
    return parsed.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const recentAppointments = useMemo(() => {
    return [...sortedAppointments].slice(-4).reverse();
  }, [sortedAppointments]);

  const statusPillClass = (status: Appointment['status']) => {
    if (status === 'Confirmed') return 'bg-green-50 text-green-700 border-green-100';
    if (status === 'Pending') return 'bg-amber-50 text-amber-700 border-amber-100';
    if (status === 'Cancelled') return 'bg-rose-50 text-rose-700 border-rose-100';
    return 'bg-slate-100 text-slate-600 border-slate-200';
  };

  const toggleExpandedAppointment = (appointmentId: string) => {
    setExpandedAppointmentId((current) => (current === appointmentId ? null : appointmentId));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row font-sans text-slate-900">
      <DoctorSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <DoctorHeader 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Schedule</h1>
                <p className="text-slate-500 mt-1">Manage your clinical availability and appointments.</p>
              </div>
              <div className="flex items-center gap-3">
                 <button onClick={handleBlockedBooking} className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 focus:ring-2 focus:ring-slate-200 focus:outline-none transition-all flex items-center gap-2 shadow-sm text-sm">
                    <FaBan className="text-slate-400" /> 
                    <span>Block Time</span>
                </button>
                <button 
                  onClick={handleNewAvailability}
                  className="px-4 py-2.5 bg-[#0A6ED1] hover:bg-[#0958a8] text-white font-semibold rounded-lg shadow-md shadow-blue-500/20 active:scale-95 focus:ring-2 focus:ring-offset-2 focus:ring-[#0A6ED1] focus:outline-none transition-all flex items-center gap-2 text-sm"
                >
                    <FaPlus /> 
                    <span>New Availability</span>
                </button>
              </div>
            </div>

            {/* Calendar Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-100">
                    <button 
                        onClick={() => setViewType('day')}
                        className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-colors ${
                            viewType === 'day' ? 'text-white bg-[#1e293b] shadow-sm' : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        Day
                    </button>
                    <button 
                        onClick={() => setViewType('week')}
                        className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-colors ${
                            viewType === 'week' ? 'text-white bg-[#1e293b] shadow-sm' : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        Week
                    </button>
                    <button 
                        onClick={() => setViewType('month')}
                        className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-colors ${
                            viewType === 'month' ? 'text-white bg-[#1e293b] shadow-sm' : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        Month
                    </button>
                </div>

                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                    <button onClick={handlePrev} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                        <FaAngleLeft />
                    </button>
                    <span className="text-lg font-bold text-slate-800 min-w-62.5 text-center">
                        {viewType === 'day' ? (
                            displayDays[0].toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                        ) : viewType === 'week' ? (
                            `${displayDays[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} – ${displayDays[displayDays.length - 1].toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}`
                        ) : (
                            currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        )}
                    </span>
                    <button onClick={handleNext} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                        <FaAngleRight />
                    </button>
                </div>

                <button 
                    onClick={handleToday}
                    className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                >
                    Today
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                {viewType === 'month' ? (
                    // Month View
                    <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 border-b border-slate-100">
                        {/* Days Header */}
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <div key={day} className="p-4 text-center bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                        
                        {/* Calendar Days */}
                        {displayDays.map((day, i) => {
                            const dateStr = formatDateId(day);
                            // Find appointments for this day
                            const dayAppts = appointments.filter(a => a.date === dateStr);
                            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                            const isToday = day.toDateString() === new Date().toDateString();
                            
                            return (
                                <div 
                                    key={i} 
                                    className={`min-h-30 p-2 transition-colors hover:bg-slate-50 relative group ${!isCurrentMonth ? 'bg-slate-50/30' : ''}`}
                                    onClick={() => {
                                        setCurrentDate(day);
                                        setViewType('day');
                                    }}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${
                                            isToday 
                                            ? 'bg-[#10B981] text-white shadow-sm' 
                                            : isCurrentMonth ? 'text-slate-700' : 'text-slate-300'
                                        }`}>
                                            {day.getDate()}
                                        </span>
                                        {dayAppts.length > 0 && (
                                            <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">
                                                {dayAppts.length}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-1">
                                        {dayAppts.length === 0 ? (
                                            <div className="text-[10px] text-slate-400 pl-1 font-medium">
                                                No availability set
                                            </div>
                                        ) : (
                                            <>
                                                {dayAppts.slice(0, 3).map(appt => (
                                                    <button onClick={(e) => { e.stopPropagation(); openDetails(appt); }} key={appt.id} className={`w-full text-left text-[10px] truncate px-1.5 py-0.5 rounded border transition-colors hover:opacity-90 ${
                                                        appt.status === 'Confirmed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                        appt.status === 'Blocked' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                                        'bg-orange-50 text-orange-700 border-orange-100'
                                                    }`}>
                                                        {appt.time} • {appt.patient}
                                                    </button>
                                                ))}
                                                {dayAppts.length > 3 && (
                                                    <div className="text-[10px] text-slate-400 pl-1 font-medium">
                                                        + {dayAppts.length - 3} more
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Add button on hover */}
                                    <button 
                                        className="absolute bottom-2 right-2 w-6 h-6 bg-[#0A6ED1] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 hover:scale-110"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCellClick();
                                        }}
                                    >
                                        <FaPlus size={10} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    // Week/Day View
                    <div 
                        className="grid divide-x divide-slate-100" 
                        style={{ gridTemplateColumns: `100px repeat(${displayDays.length}, 1fr)` }}
                    >
                    {/* Header Row */}
                    <div className="p-4 bg-slate-50/50"></div> {/* Top-left empty corner */}
                    {displayDays.map((day, i) => (
                        <div key={i} className="p-4 text-center bg-slate-50/50 border-b border-slate-100">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                {day.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className={`text-3xl font-serif ${
                                day.toDateString() === new Date().toDateString() ? 'text-[#10B981]' : 'text-slate-800'
                            }`}>
                                {day.getDate()}
                            </div>
                        </div>
                    ))}

                    {/* Time Rows */}
                    {timeSlots.map((time, timeIndex) => (
                        <>
                            {/* Time Label Column */}
                            <div key={`time-${timeIndex}`} className="p-4 text-xs font-semibold text-slate-400 text-right border-t border-slate-100 relative">
                                <span className="relative -top-2.5">{time}</span>
                            </div>

                            {/* Day Cells */}
                            {displayDays.map((day) => {
                                const dateStr = formatDateId(day);
                                const appt = getAppointment(dateStr, time);
                                const isBlocked = appt?.status === 'Blocked';
                                const isConference = appt?.patient === 'Conference';

                                return (
                                    <div 
                                        key={`${dateStr}-${time}`} 
                                        className={`relative border-t border-slate-100 min-h-35 p-2 transition-colors ${
                                            !appt ? 'hover:bg-slate-50' : ''
                                        }`}
                                    >
                                        {!appt ? (
                                            
                                                <div 
                                                    onClick={() => handleCellClick()}
                                                    className="w-full h-full border-2 border-dashed border-transparent hover:border-slate-200 rounded-xl flex items-center justify-center cursor-pointer group"
                                                >
                                                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                                                        <FaPlus /> Add availability
                                                    </span>
                                                </div>
                                        ) : (
                                            <div onClick={() => openDetails(appt)} role="button" className={`w-full h-full rounded-xl p-3 flex flex-col justify-between shadow-sm border ${
                                                isBlocked || isConference
                                                    ? 'bg-slate-100 border-slate-200 text-slate-500' // Blocked/Conference style
                                              : 'bg-linear-to-br from-white via-blue-50/25 to-white border-slate-200 hover:shadow-md cursor-pointer' // Regular Appt style
                                            } ${!isBlocked && !isConference ? 'border-l-4 border-l-[#0A6ED1]' : ''}`}>
                                                
                                                {/* Card Content */}
                                                <div>
                                                    <div className="flex justify-between items-start mb-1">
                                                <div className="flex items-center gap-2 min-w-0">
                                                  <span className={`w-7 h-7 shrink-0 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                                                    isBlocked ? 'bg-slate-200 border-slate-300 text-slate-500' : 'bg-blue-50 border-blue-100 text-blue-700'
                                                  }`}>
                                                    {getPatientInitials(appt.patient)}
                                                  </span>
                                                  <span className={`text-sm font-bold truncate ${isBlocked ? 'text-slate-500' : 'text-slate-900'}`}>{appt.patient}</span>
                                                            {appt.isNewPatient && (
                                                                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">NEW</span>
                                                            )}
                                                            {(appt.notes?.includes('INITIAL') || appt.notes?.includes('Initial')) && (
                                                                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase">INIT</span>
                                                            )}
                                                        </div>
                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                                            appt.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-100' :
                                                            appt.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                            appt.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                            'bg-slate-100 text-slate-600 border-slate-200'
                                                        }`}>{appt.status}</span>
                                                    </div>
                                                    <div className={`text-xs ${isBlocked ? 'text-slate-400' : 'text-slate-600'} mb-0.5`}>{timeRange(appt.time, appt.duration)}</div>
                                                    <div className={`text-xs ${isBlocked ? 'text-slate-400' : 'text-slate-500'} flex items-center gap-2`}>
                                                        <span>{appt.type}</span>
                                                        {appt.notes && <span className="w-1.5 h-1.5 rounded-full bg-slate-300" title="Has notes"></span>}
                                                    </div>
                                                    {!isBlocked && !isConference && (
                                                      <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-blue-600">Patient details in modal</div>
                                                    )}
                                                </div>

                                                {/* Special Icon/Label for Conference */}
                                                {isConference && (
                                                     <div className="flex items-center gap-2 mt-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                                                        <FaChartLine />
                                                        <span>Conference</span>
                                                     </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </>
                    ))}
                </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-8">
                 {/* Total Appointments */}
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Total Appointments</div>
                    <div className="text-4xl font-serif text-slate-900 mb-2">{stats.totalAppointments}</div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#10B981]">
                        <FaChartLine /> +12% from last week
                    </div>
                 </div>

                 {/* New Patients */}
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">New Patients</div>
                    <div className="text-4xl font-serif text-slate-900 mb-2">{stats.newPatients}</div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#0A6ED1] cursor-pointer hover:underline">
                        <FaCheckCircle /> Verify documents
                    </div>
                 </div>

                 {/* Capacity Used */}
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Capacity Used</div>
                    <div className="text-4xl font-serif text-slate-900 mb-4">{stats.capacityUsed}%</div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className="bg-[#10B981] h-1.5 rounded-full transition-all duration-1000" 
                            style={{ width: `${stats.capacityUsed}%` }}
                        ></div>
                    </div>
                 </div>

                 {/* Blocked Hours */}
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Blocked Hours</div>
                    <div className="text-4xl font-serif text-slate-900 mb-2">{stats.blockedHours}</div>
                    <div className="text-sm font-medium text-slate-500 leading-snug">
                        Mostly administrative & clinical prep.
                    </div>
                 </div>
            </div>

            {/* Appointments Overview */}
            <section className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden mb-8">
              <div className="px-5 md:px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg md:text-xl font-bold text-slate-900">Recent Appointments</h2>
                <p className="text-sm text-slate-500 mt-1">Latest bookings appear first. Expand any record to see full collected details.</p>
              </div>

              <div className="p-4 md:p-6 space-y-5">
                {sortedAppointments.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                    No appointments in this range yet.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {recentAppointments.map((appt) => (
                        <article key={`recent-${appt.id}`} className="rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-base font-bold text-slate-900 truncate">{appt.patient}</h3>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusPillClass(appt.status)}`}>{appt.status}</span>
                              </div>
                              <p className="text-sm text-slate-600 mt-1">{formatDisplayDate(appt.date)} • {timeRange(appt.time, appt.duration)}</p>
                              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                <span className="px-2 py-0.5 rounded-full bg-white border border-blue-100 text-blue-700">{isPreviewAppointment(appt) ? 'Type' : appt.type}</span>
                                {(appt.reason || isPreviewAppointment(appt)) && <span className="px-2 py-0.5 rounded-full bg-white border border-amber-100 text-amber-700">{isPreviewAppointment(appt) ? 'Reason' : appt.reason}</span>}
                              </div>
                            </div>
                            <button
                              onClick={() => openDetails(appt)}
                              className="shrink-0 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                            >
                              Open
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>

                    <div className="pt-1">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">All Appointment Records</h3>
                    </div>

                    {sortedAppointments.map((appt) => {
                    const isExpanded = expandedAppointmentId === appt.id;
                    return (
                      <article key={appt.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                        <div className="p-4 md:p-5">
                          <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4 justify-between">
                            <div className="min-w-0 space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-base md:text-lg font-bold text-slate-900 truncate">{appt.patient}</h3>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusPillClass(appt.status)}`}>{appt.status}</span>
                                {appt.isNewPatient && (
                                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">NEW</span>
                                )}
                              </div>
                              <div className="text-sm text-slate-600">
                                {formatDisplayDate(appt.date)}
                                <span className="mx-2">•</span>
                                {isPreviewAppointment(appt) ? 'Time' : timeRange(appt.time, appt.duration)}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{isPreviewAppointment(appt) ? 'Type' : appt.type}</span>
                                {appt.specialty && (
                                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">{appt.specialty}</span>
                                )}
                                {(appt.reason || isPreviewAppointment(appt)) && (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">Reason: {isPreviewAppointment(appt) ? 'Reason' : appt.reason}</span>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => toggleExpandedAppointment(appt.id)}
                              className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                              aria-expanded={isExpanded}
                            >
                              {isExpanded ? 'Hide details' : 'More details'}
                              {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="px-4 md:px-5 pb-5 border-t border-slate-100 bg-slate-50/60">
                            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-start justify-between gap-3"><span className="text-slate-500">Appointment ID</span><span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">{appt.id}</span></div>
                              <div className="flex items-start justify-between gap-3"><span className="text-slate-500">Patient ID</span><span className="font-medium text-slate-800 text-right">{appt.patientId || 'N/A'}</span></div>
                              <div className="flex items-start justify-between gap-3"><span className="text-slate-500">Patient Email</span><span className="font-medium text-slate-800 text-right break-all">{appt.patientEmail || 'N/A'}</span></div>
                              <div className="flex items-start justify-between gap-3"><span className="text-slate-500">Patient Phone</span><span className="font-medium text-slate-800 text-right">{appt.patientPhone || 'N/A'}</span></div>
                              <div className="flex items-start justify-between gap-3"><span className="text-slate-500">Mode</span><span className="font-medium text-slate-800 text-right">{appt.mode || 'N/A'}</span></div>
                              <div className="flex items-start justify-between gap-3"><span className="text-slate-500">Location</span><span className="font-medium text-slate-800 text-right">{appt.location || 'N/A'}</span></div>
                              <div className="flex items-start justify-between gap-3"><span className="text-slate-500">Meeting Link</span><span className="font-medium text-slate-800 text-right break-all">{appt.meetingLink || 'N/A'}</span></div>
                              <div className="flex items-start justify-between gap-3"><span className="text-slate-500">Share AI Chat</span><span className="font-medium text-slate-800 text-right">{appt.shareAIChat === undefined ? 'N/A' : appt.shareAIChat ? 'Yes' : 'No'}</span></div>
                              <div className="flex items-start justify-between gap-3"><span className="text-slate-500">Created At</span><span className="font-medium text-slate-800 text-right">{appt.createdAt || 'N/A'}</span></div>
                              <div className="flex items-start justify-between gap-3"><span className="text-slate-500">Updated At</span><span className="font-medium text-slate-800 text-right">{appt.updatedAt || 'N/A'}</span></div>
                            </div>

                            {appt.symptoms && appt.symptoms.length > 0 && (
                              <div className="mt-4">
                                <div className="text-sm font-semibold text-slate-700 mb-2">Symptoms</div>
                                <div className="flex flex-wrap gap-2">
                                  {appt.symptoms.map((symptom) => (
                                    <span key={`${appt.id}-${symptom}`} className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                                      {symptom}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {appt.notes && (
                              <div className="mt-4">
                                <div className="text-sm font-semibold text-slate-700 mb-2">Notes</div>
                                <div className="text-sm text-slate-800 bg-white border border-slate-200 rounded-xl p-3 whitespace-pre-wrap">
                                  {appt.notes}
                                </div>
                              </div>
                            )}

                            {appt.additionalDetails && Object.keys(appt.additionalDetails).length > 0 && (
                              <div className="mt-4">
                                <div className="text-sm font-semibold text-slate-700 mb-2">Additional Collected Data</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                  {Object.entries(appt.additionalDetails).map(([key, value]) => (
                                    <div key={`${appt.id}-${key}`} className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
                                      <span className="text-slate-500">{key}</span>
                                      <span className="font-medium text-slate-800 text-right break-all">{value}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </article>
                    );
                    })}
                  </>
                )}
              </div>
            </section>

          </div>
        </div>

        {/* Appointment Details Modal */}
        {isDetailsOpen && selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
            <div className="absolute inset-0 bg-black/30" onClick={() => setIsDetailsOpen(false)}></div>
            <div className="relative bg-white w-full md:max-w-xl rounded-t-2xl md:rounded-2xl shadow-xl border border-slate-200 p-0 overflow-hidden">
              {/* Header Bar */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-serif font-bold text-slate-900 truncate">{selectedAppointment.patient}</h3>
                    {selectedAppointment.isNewPatient && (
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">NEW</span>
                    )}
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                      selectedAppointment.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-100' :
                      selectedAppointment.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      selectedAppointment.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>{selectedAppointment.status}</span>
                  </div>
                  <div className="text-sm text-slate-600 truncate">
                    <span>{isPreviewAppointment(selectedAppointment) ? 'Date' : selectedAppointment.date}</span>
                    <span className="mx-2">•</span>
                    <span>{isPreviewAppointment(selectedAppointment) ? 'Time' : timeRange(selectedAppointment.time, selectedAppointment.duration)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailsOpen(false)}
                  aria-label="Close"
                  className="shrink-0 h-9 px-3 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-5">
                {selectedAppointment.status === 'Blocked' && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-2">
                    <div className="text-sm font-semibold text-amber-800">Blocked Date Information</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-start justify-between gap-2"><span className="text-amber-700">Date</span><span className="font-medium text-slate-800">{selectedAppointment.date || 'Date'}</span></div>
                      <div className="flex items-start justify-between gap-2"><span className="text-amber-700">Time</span><span className="font-medium text-slate-800">{timeRange(selectedAppointment.time, selectedAppointment.duration)}</span></div>
                      <div className="flex items-start justify-between gap-2 sm:col-span-2"><span className="text-amber-700">Reason</span><span className="font-medium text-slate-800 text-right">{selectedAppointment.reason || extractNotesField(selectedAppointment.notes, 'Reason') || 'Reason'}</span></div>
                      <div className="flex items-start justify-between gap-2 sm:col-span-2"><span className="text-amber-700">Blocked Range</span><span className="font-medium text-slate-800 text-right">{extractNotesField(selectedAppointment.notes, 'Blocked Range') || 'Time Range'}</span></div>
                    </div>
                  </div>
                )}

                {/* Patient Profile */}
                {selectedAppointment.status !== 'Blocked' && (
                <div className="rounded-2xl border border-slate-200 bg-linear-to-r from-blue-50/50 via-white to-white p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full bg-white border border-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      {getPatientInitials(selectedAppointment.patient)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-500">Patient Details</div>
                      <div className="text-lg font-bold text-slate-900 truncate">{selectedAppointment.patient}</div>
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-700"><FaUser className="text-slate-400" /><span>{selectedAppointment.patientId || 'Patient ID not available'}</span></div>
                        <div className="flex items-center gap-2 text-slate-700"><FaPhone className="text-slate-400" /><span>{selectedAppointment.patientPhone || 'Phone not available'}</span></div>
                        <div className="flex items-center gap-2 text-slate-700 sm:col-span-2"><FaEnvelope className="text-slate-400" /><span className="truncate">{selectedAppointment.patientEmail || 'Email not available'}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                )}

                {/* Quick badges parsed from notes (Reason/Prep) */}
                {selectedAppointment.notes && (
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    {(/Reason\s*:\s*([^\n]+)/i.exec(selectedAppointment.notes)?.[1]) && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">Reason: {(/Reason\s*:\s*([^\n]+)/i.exec(selectedAppointment.notes) as RegExpExecArray)[1]}</span>
                    )}
                    {(/Prep\s*:\s*([^\n]+)/i.exec(selectedAppointment.notes)?.[1]) && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">Prep: {(/Prep\s*:\s*([^\n]+)/i.exec(selectedAppointment.notes) as RegExpExecArray)[1]}</span>
                    )}
                    {(/Instructions?\s*:\s*([^\n]+)/i.exec(selectedAppointment.notes)?.[1]) && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">Instructions: {(/Instructions?\s*:\s*([^\n]+)/i.exec(selectedAppointment.notes) as RegExpExecArray)[1]}</span>
                    )}
                  </div>
                )}

                {/* Metadata grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-500">Type</span>
                    <span className="font-medium text-slate-800 text-right">{isPreviewAppointment(selectedAppointment) ? 'Type' : selectedAppointment.type}</span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-500">Status</span>
                    <span className="font-medium text-slate-800 text-right">{selectedAppointment.status}</span>
                  </div>

                  {/* Optional Mode/Location if present */}
                  {selectedAppointment.mode !== undefined && (
                    <div className="flex items-start justify-between gap-3 sm:col-span-2">
                      <span className="text-slate-500">Mode</span>
                      <span className="font-medium text-slate-800 text-right">{selectedAppointment.mode || '—'}</span>
                    </div>
                  )}

                  {/* Optional patient contact if present */}
                  {selectedAppointment.patientPhone !== undefined && (
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-slate-500">Patient Phone</span>
                      <span className="font-medium text-slate-800 text-right">{selectedAppointment.patientPhone || '—'}</span>
                    </div>
                  )}
                  {selectedAppointment.patientEmail !== undefined && (
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-slate-500">Patient Email</span>
                      <span className="font-medium text-slate-800 text-right truncate max-w-55">{selectedAppointment.patientEmail || '—'}</span>
                    </div>
                  )}

                  {/* Optional timestamps if present */}
                  {selectedAppointment.createdAt !== undefined && (
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-slate-500">Created</span>
                      <span className="font-medium text-slate-800 text-right">{String(selectedAppointment.createdAt)}</span>
                    </div>
                  )}
                  {selectedAppointment.updatedAt !== undefined && (
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-slate-500">Updated</span>
                      <span className="font-medium text-slate-800 text-right">{String(selectedAppointment.updatedAt)}</span>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {selectedAppointment.notes && (
                  <div>
                    <div className="text-sm font-semibold text-slate-700 mb-2">Notes</div>
                    <div className="text-sm text-slate-800 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-3 whitespace-pre-wrap">
                      {selectedAppointment.notes}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row gap-3 items-stretch sm:items-center">
                <button onClick={() => setIsDetailsOpen(false)} className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors">Close</button>
                <div className="flex-1" />
              </div>
            </div>
          </div>
        )}
        
      </main>
    </div>
  );
}


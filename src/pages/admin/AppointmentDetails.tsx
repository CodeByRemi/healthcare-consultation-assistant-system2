import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  FileText, 
  Activity, 
  Video, 
  MapPin, 
  AlertCircle 
} from "lucide-react";

type AppointmentRow = {
  id: string;
  date: string;
  time: string;
  patient: string;
  doctor: string;
  status: "Present" | "Past" | "Upcoming" | "Cancelled";
  type: "Virtual" | "In-Person";
  reason: string;
  symptoms: string[];
  notes?: string;
  location?: string;
  meetingLink?: string;
};

const SAMPLE_APPOINTMENTS: AppointmentRow[] = [
  {
    id: "APT-2024-001",
    date: "2024-03-20",
    time: "09:00 AM",
    patient: "Sarah Johnson",
    doctor: "Dr. Emily Chen",
    status: "Present",
    type: "In-Person",
    reason: "Annual Checkup",
    symptoms: ["None"],
    notes: "Patient requests blood work results discussion.",
    location: "Room 302, Main Building"
  },
  {
    id: "APT-2024-002",
    date: "2024-03-20",
    time: "10:30 AM",
    patient: "Michael Brown",
    doctor: "Dr. Sarah Wilson",
    status: "Present",
    type: "Virtual",
    reason: "Skin Rash Consultation",
    symptoms: ["Redness", "Itching", "Mild swelling"],
    meetingLink: "https://med-connect.com/meet/apt-002"
  },
  {
    id: "APT-2024-003",
    date: "2024-03-19",
    time: "02:00 PM",
    patient: "Emily Davis",
    doctor: "Dr. James Wilson",
    status: "Past",
    type: "In-Person",
    reason: "Post-surgery Follow-up",
    symptoms: ["Mild pain at incision site"],
    location: "Room 105, Surgery Wing"
  },
  {
    id: "APT-2024-004",
    date: "2024-03-21",
    time: "11:00 AM",
    patient: "Robert Wilson",
    doctor: "Dr. Emily Chen",
    status: "Upcoming",
    type: "Virtual",
    reason: "Anxiety Consultation",
    symptoms: ["Insomnia", "Restlessness"],
    meetingLink: "https://med-connect.com/meet/apt-004"
  }
];

function AppointmentModal({ 
  appointment, 
  onClose 
}: { 
  appointment: AppointmentRow; 
  onClose: () => void; 
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Appointment Details</h2>
            <p className="text-sm text-gray-500 mt-1">ID: {appointment.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              appointment.status === 'Present' ? 'bg-green-100 text-green-700' :
              appointment.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' :
              appointment.status === 'Past' ? 'bg-gray-100 text-gray-700' :
              'bg-red-100 text-red-700'
            }`}>
              {appointment.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${
              appointment.type === 'Virtual' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {appointment.type === 'Virtual' ? <Video size={14} /> : <MapPin size={14} />}
              {appointment.type}
            </span>
          </div>

          {/* Key Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Calendar size={16} />
                <span>Date</span>
              </div>
              <p className="font-medium text-gray-900">{appointment.date}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Clock size={16} />
                <span>Time</span>
              </div>
              <p className="font-medium text-gray-900">{appointment.time}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <User size={16} />
                <span>Patient</span>
              </div>
              <p className="font-medium text-gray-900">{appointment.patient}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Stethoscope size={16} />
                <span>Doctor</span>
              </div>
              <p className="font-medium text-gray-900">{appointment.doctor}</p>
            </div>
          </div>

          {/* Clinical Info */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <Activity size={16} className="text-blue-600" />
                Reason for Visit
              </h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">
                {appointment.reason}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-2">
                <AlertCircle size={16} className="text-blue-600" />
                Reported Symptoms
              </h3>
              <div className="flex flex-wrap gap-2">
                {appointment.symptoms.map((symptom, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">
                    {symptom}
                  </span>
                ))}
              </div>
            </div>

            {appointment.notes && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <FileText size={16} className="text-blue-600" />
                  Additional Notes
                </h3>
                <p className="text-gray-600 text-sm italic">
                  "{appointment.notes}"
                </p>
              </div>
            )}

            {appointment.type === 'In-Person' && appointment.location && (
              <div className="flex items-start gap-2 text-sm text-gray-600 bg-orange-50 p-3 rounded-lg">
                <MapPin size={16} className="mt-0.5 text-orange-600 shrink-0" />
                <span>Location: {appointment.location}</span>
              </div>
            )}
            
            {appointment.type === 'Virtual' && appointment.meetingLink && (
              <div className="flex items-start gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                <Video size={16} className="mt-0.5 shrink-0" />
                <a href={appointment.meetingLink} target="_blank" rel="noreferrer" className="underline hover:text-blue-800 break-all">
                  Join Meeting: {appointment.meetingLink}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            Edit Details
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AppointmentTable({ 
  rows, 
  onSelect 
}: { 
  rows: AppointmentRow[]; 
  onSelect: (apt: AppointmentRow) => void; 
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Date & Time</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Patient</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Doctor</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Type</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.map((row) => (
            <tr 
              key={row.id} 
              onClick={() => onSelect(row)}
              className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
            >
              <td className="px-4 py-3 text-sm font-medium text-gray-900 group-hover:text-blue-600">{row.id}</td>
              <td className="px-4 py-3 text-sm text-gray-700">
                <div className="flex flex-col">
                  <span>{row.date}</span>
                  <span className="text-xs text-gray-500">{row.time}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{row.patient}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{row.doctor}</td>
              <td className="px-4 py-3 text-sm">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  row.type === 'Virtual' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {row.type === 'Virtual' ? <Video size={12} /> : <MapPin size={12} />}
                  {row.type}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  row.status === 'Present' ? 'bg-green-100 text-green-700' :
                  row.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' :
                  row.status === 'Past' ? 'bg-gray-100 text-gray-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AppointmentDetails() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const entity = params.get("entity") === "doctor" ? "doctor" : "patient";
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentRow | null>(null);

  // Filter sample data based on status for demonstration
  const recentAppointments = SAMPLE_APPOINTMENTS.filter(a => a.status === 'Upcoming' || a.status === 'Present');
  const pastAppointments = SAMPLE_APPOINTMENTS.filter(a => a.status === 'Past');

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointment Details</h1>
            <p className="text-sm text-gray-500 mt-1 capitalize">
              Viewing {entity} appointment history with both patient and doctor information
            </p>
          </div>
          <Link
            to="/admin"
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Back to Admin Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent & Upcoming Appointments</h2>
          <AppointmentTable 
            rows={recentAppointments} 
            onSelect={setSelectedAppointment}
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Past Appointments</h2>
          <AppointmentTable 
            rows={pastAppointments} 
            onSelect={setSelectedAppointment}
          />
        </div>
      </div>

      <AnimatePresence>
        {selectedAppointment && (
          <AppointmentModal 
            appointment={selectedAppointment} 
            onClose={() => setSelectedAppointment(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

import { Link, useLocation } from "react-router-dom";

const presentAppointments = [
  {
    id: "[Appointment ID]",
    date: "[Date]",
    time: "[Time]",
    patient: "[Patient Name]",
    doctor: "[Doctor Name]",
    status: "Present"
  },
  {
    id: "[Appointment ID]",
    date: "[Date]",
    time: "[Time]",
    patient: "[Patient Name]",
    doctor: "[Doctor Name]",
    status: "Present"
  }
];

const pastAppointments = [
  {
    id: "[Appointment ID]",
    date: "[Date]",
    time: "[Time]",
    patient: "[Patient Name]",
    doctor: "[Doctor Name]",
    status: "Past"
  },
  {
    id: "[Appointment ID]",
    date: "[Date]",
    time: "[Time]",
    patient: "[Patient Name]",
    doctor: "[Doctor Name]",
    status: "Past"
  }
];

const recentAppointments = [
  {
    id: "[Appointment ID]",
    date: "[Date]",
    time: "[Time]",
    patient: "[Patient Name]",
    doctor: "[Doctor Name]",
    status: "[Status]"
  },
  {
    id: "[Appointment ID]",
    date: "[Date]",
    time: "[Time]",
    patient: "[Patient Name]",
    doctor: "[Doctor Name]",
    status: "[Status]"
  },
  {
    id: "[Appointment ID]",
    date: "[Date]",
    time: "[Time]",
    patient: "[Patient Name]",
    doctor: "[Doctor Name]",
    status: "[Status]"
  }
];

type AppointmentRow = {
  id: string;
  date: string;
  time: string;
  patient: string;
  doctor: string;
  status: string;
};

function AppointmentTable({ rows }: { rows: AppointmentRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Appointment ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Time</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Patient</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Doctor</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.map((row, index) => (
            <tr key={`${row.id}-${index}`} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-700">{row.id}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{row.date}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{row.time}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{row.patient}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{row.doctor}</td>
              <td className="px-4 py-3 text-sm">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
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
          <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
          <AppointmentTable rows={recentAppointments} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Present Appointments</h2>
          <AppointmentTable rows={presentAppointments} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Past Appointments</h2>
          <AppointmentTable rows={pastAppointments} />
        </div>
      </div>
    </div>
  );
}

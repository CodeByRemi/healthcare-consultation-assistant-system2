const queue = [
  { name: "Jameson Miller", initials: "JM", time: "09:00 AM", type: "Telehealth", status: "Completed" },
  { name: "Eleanor Vance", initials: "EV", time: "10:30 AM", type: "In-person", status: "Waiting" },
  { name: "David Chen", initials: "DC", time: "11:30 AM", type: "Follow-up", status: "Confirmed" },
  { name: "Sarah Jenkins", initials: "SJ", time: "12:15 PM", type: "Consultation", status: "Confirmed" },
  { name: "Robert Wilson", initials: "RW", time: "01:45 PM", type: "In-person", status: "Confirmed" },
];

const statusClass = (status: string) => {
  if (status === "Waiting") return "bg-amber-500/10 text-amber-400";
  if (status === "Confirmed") return "bg-primary/10 text-primary";
  return "bg-slate-100 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400";
};

export default function PatientQueueTable() {
  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-4xl font-semibold text-slate-900 dark:text-slate-100">Patient Queue</h2>
        <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1" type="button">
          Full Calendar
          <span className="material-symbols-outlined text-sm">arrow_outward</span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#1a2e21]/35 rounded-xl border border-slate-200 dark:border-[#2a3d31] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100 dark:bg-[#1a2e21]/70 text-slate-500 dark:text-[#8ea194] text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Patient</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-[#2a3d31]">
            {queue.map((person) => (
              <tr key={person.name} className={`hover:bg-slate-100 dark:hover:bg-[#1f3527]/40 transition-colors ${person.status === "Waiting" ? "bg-primary/5" : ""}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                      {person.initials}
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{person.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-[#9eb0a4]">{person.time}</td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-[#9eb0a4]">{person.type}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${statusClass(person.status)}`}>
                    {person.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className={`text-xs font-bold tracking-wider uppercase ${person.status === "Waiting" ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-primary"}`} type="button">
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

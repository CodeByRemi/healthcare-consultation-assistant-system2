const stats = [
  {
    icon: "person_add",
    iconStyle: "text-primary bg-primary/10",
    badge: "+2%",
    badgeStyle: "text-primary bg-primary/10",
    label: "Total Patients",
    value: "1,284",
  },
  {
    icon: "event_available",
    iconStyle: "text-blue-400 bg-blue-500/10",
    badge: "Today",
    badgeStyle: "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50",
    label: "Appointments Today",
    value: "12",
  },
  {
    icon: "report",
    iconStyle: "text-amber-400 bg-amber-500/10",
    badge: "Urgent",
    badgeStyle: "text-amber-400 bg-amber-500/10",
    label: "Pending Reports",
    value: "5",
  },
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((item) => (
        <div key={item.label} className="bg-white dark:bg-[#1a2e21]/35 p-6 rounded-xl border border-slate-200 dark:border-[#2a3d31] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${item.iconStyle}`}>
              <span className="material-symbols-outlined">{item.icon}</span>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.badgeStyle}`}>{item.badge}</span>
          </div>
          <p className="text-slate-600 dark:text-[#9eb0a4] text-sm font-medium mb-1">{item.label}</p>
          <h3 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{item.value}</h3>
        </div>
      ))}
    </div>
  );
}

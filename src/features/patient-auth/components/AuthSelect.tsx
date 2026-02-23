interface AuthSelectProps {
  label: string;
}

export default function AuthSelect({ label }: AuthSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-primary mb-2">
        {label}
      </label>
      <select className="w-full px-4 py-3 rounded-lg border border-black/15 bg-white text-primary focus:border-accent focus:outline-none transition-colors cursor-pointer">
        <option>Select...</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
    </div>
  );
}

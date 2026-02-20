interface AuthSelectProps {
  label: string;
}

export default function AuthSelect({ label }: AuthSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <select className="w-full px-4 py-2.5 rounded-lg border-2 border-blue-300 bg-white text-gray-900 focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-blue-400 cursor-pointer shadow-sm">
        <option>Select...</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
    </div>
  );
}

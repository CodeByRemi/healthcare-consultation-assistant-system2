interface AuthInputProps {
  label: string;
  type?: string;
  placeholder: string;
}

export default function AuthInput({ label, type = "text", placeholder }: AuthInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg border-2 border-blue-300 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-300 hover:border-blue-400 shadow-sm"
      />
    </div>
  );
}

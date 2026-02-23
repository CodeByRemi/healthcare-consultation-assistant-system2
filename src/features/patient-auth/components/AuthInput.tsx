interface AuthInputProps {
  label: string;
  type?: string;
  placeholder: string;
}

export default function AuthInput({ label, type = "text", placeholder }: AuthInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-primary mb-2">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg border border-black/15 bg-white text-primary placeholder:text-gray-400 focus:border-accent focus:outline-none transition-colors"
      />
    </div>
  );
}

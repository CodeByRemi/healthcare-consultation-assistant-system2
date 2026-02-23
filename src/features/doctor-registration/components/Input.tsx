interface InputProps {
  label: string;
  placeholder: string;
  icon?: string;
  type?: string;
}

export default function Input({ label, placeholder, icon, type = "text" }: InputProps) {
  return (
    <div className="space-y-2">
      <label className="font-medium">{label}</label>
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-[#141811] border border-border-dark rounded-lg py-3.5 pl-12 pr-4 focus:border-primary focus:ring-primary"
        />
      </div>
    </div>
  );
}

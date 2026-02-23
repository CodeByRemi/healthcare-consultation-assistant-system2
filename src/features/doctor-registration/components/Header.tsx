export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border-dark py-4 mb-8">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">
          medical_services
        </span>
        <h2 className="text-xl font-bold">MedCare</h2>
      </div>

      {/* Simplified navbar per request: remove extra links and buttons */}
      <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
        {/* Intentionally left minimal */}
      </nav>
    </header>
  );
}

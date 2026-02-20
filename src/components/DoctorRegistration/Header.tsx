export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border-dark py-4 mb-8">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">
          medical_services
        </span>
        <h2 className="text-xl font-bold">MedElite</h2>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        {["Benefits", "Network", "Support"].map(link => (
          <a key={link} href="#" className="text-sm hover:text-primary">
            {link}
          </a>
        ))}
        <button className="bg-primary text-black px-4 py-2 rounded-lg font-bold">
          Login
        </button>
        <button className="border border-border-dark px-4 py-2 rounded-lg">
          Contact Us
        </button>
      </nav>
    </header>
  );
}

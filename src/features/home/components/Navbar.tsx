export default function Navbar() {
  return (
    <nav className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-sm bg-[#2D8CFF]"
            aria-hidden="true"
          />
          <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-gray-900">
            Medicare
          </span>
        </div>

        <button
          className="md:hidden min-h-11 px-4 py-2 rounded-md bg-primary text-white text-xs font-semibold uppercase tracking-wide hover:bg-black transition-colors"
          onClick={() => window.location.href = "/patient-login"}
        >
          Join Now
        </button>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase text-gray-700">
          <button className="hover:text-gray-900 transition-colors">
            Services
          </button>

          {/* <button className="hover:text-gray-900 transition-colors">
            Doctors
          </button> */}

          <button className="hover:text-gray-900 transition-colors">
            About Us
          </button>

          <button className="hover:text-gray-900 transition-colors">
            Cases
          </button>

          {/* Login – Correct Navigation */}
         
            <button
              className="text-gray-800 bg-red-800 hover:text-gray-900 transition-colors"
              onClick={() => window.location.href = "/choose-path"}
            >
               Login
            </button>
           
          

          <button className="px-3 py-1.5 rounded border border-gray-300 text-gray-800 hover:bg-gray-50 transition-colors">
            Contact Us
          </button>
        </div>
      </div>
    </nav>
  );
}
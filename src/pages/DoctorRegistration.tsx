import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/patientreg.png";;

const SPECIALIZATIONS = [
  "Cardiology",
  "Neurology",
  "Oncology",
  "Pediatrics",
  "General Surgery",
  "Orthopedics",
  "Gastroenterology",
  "Dermatology",
  "Psychiatry",
  "Ophthalmology",
  "Otolaryngology",
  "Urology",
  "Nephrology",
  "Pulmonology",
  "Rheumatology"
];

export default function DoctorRegistration() {
  const [progress, setProgress] = useState(0);
  const [specialization, setSpecialization] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredSpecializations, setFilteredSpecializations] = useState(SPECIALIZATIONS);

  useEffect(() => {
    const t = setTimeout(() => setProgress(33), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const specContainer = document.getElementById("specialization-container");
      if (specContainer && !specContainer.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isDropdownOpen]);

  const navigate = useNavigate();

  const handleSpecializationChange = (value) => {
    setSpecialization(value);
    const filtered = SPECIALIZATIONS.filter(spec =>
      spec.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSpecializations(filtered);
    setIsDropdownOpen(true);
  };

  const handleSelectSpecialization = (spec) => {
    setSpecialization(spec);
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#182111] text-white antialiased">
      {/* Page-scoped animations */}
      <style>{`
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes float-slow {
          0% { transform: translateY(0) }
          50% { transform: translateY(-6px) }
          100% { transform: translateY(0) }
        }
        @keyframes shine {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-fade-up { animation: fade-up .6s ease-out both; }
        .animate-fade-in { animation: fade-in .6s ease-out both; }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .delay-1 { animation-delay: .08s; }
        .delay-2 { animation-delay: .16s; }
        .delay-3 { animation-delay: .24s; }
        .delay-4 { animation-delay: .32s; }
        .shimmer {
          background-image: linear-gradient(90deg, transparent, rgba(255,255,255,.06), transparent);
          background-size: 200% 100%;
          animation: shine 2.2s linear infinite;
        }
      `}</style>

      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#2f3829] px-4 md:px-10 py-3 mb-8 animate-fade-up">
        {/* Logo */}
        <div className="flex items-center gap-4 text-white">
          <div className="size-6 text-[#58b814] animate-float-slow">
            <img src={logo}  className="w-20 h-8" alt="MedCare logo" />
          </div>
          <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">MedCare</h2>
        </div>

        {/* Right side message */}
        <div className="hidden md:flex flex-1 justify-end gap-8">
          <p className="text-white text-sm font-medium">
            Do you have an account?{" "}
            <span
              className="text-[#58b814] font-bold cursor-pointer hover:underline"
              onClick={() => navigate("/doctor/login")}
            >
              Login
            </span>
          </p>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden text-white">
          <span className="material-symbols-outlined">menu</span>
        </div>
      </header>

      {/* Breadcrumbs and Main Content */}
      <div className="flex flex-col px-4 md:px-10 lg:px-40 mt-6 flex-1">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 mb-4 animate-fade-up delay-1">
          <a href="#" className="text-[#a9b89d] text-base font-medium leading-normal hover:text-white transition-colors">Home</a>
          <span className="text-[#a9b89d] text-base font-medium leading-normal">/</span>
          <a href="#" className="text-[#a9b89d] text-base font-medium leading-normal hover:text-white transition-colors">Professionals</a>
          <span className="text-[#a9b89d] text-base font-medium leading-normal">/</span>
          <span className="text-white text-base font-medium leading-normal">Registration</span>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-12 mt-4">
          {/* Left Column */}
          <div className="lg:w-1/3 flex flex-col gap-6 animate-fade-up delay-2">
            <div className="flex flex-col gap-3">
              <h1 className="text-white text-4xl lg:text-5xl font-black leading-[1.1] tracking-[-0.033em]">Medical Practitioner Enrollment</h1>
              <p className="text-[#a9b89d] text-lg font-light leading-relaxed">
                Join an exclusive network of world-class medical professionals. Our vetting process ensures the highest standards of care.
              </p>
            </div>

            {/* Trust Indicators */}
            {/* <div className="flex flex-col gap-4 mt-4 border-t border-[#2f3829] pt-6">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#58b814] mt-1">verified_user</span>
                <div>
                  <h4 className="text-white font-medium">HIPAA Compliant</h4>
                  <p className="text-sm text-[#a9b89d]">Your data is encrypted and secure.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[#58b814] mt-1">workspace_premium</span>
                <div>
                  <h4 className="text-white font-medium">Exclusive Benefits</h4>
                  <p className="text-sm text-[#a9b89d]">Access premium insurance rates.</p>
                </div>
              </div>
            </div> */}

            {/* Decorative block */}
            {/* <div className="mt-8 rounded-xl overflow-hidden h-48 w-full relative bg-[#20261c] border border-[#2f3829] hidden lg:block animate-fade-up delay-3">
              <div className="absolute inset-0 bg-linear-to-br from-[#20261c] to-[#141811] opacity-90" />
              <div className="absolute inset-0 opacity-10 shimmer" style={{ backgroundImage: 'radial-gradient(#58b814 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#a9b89d] font-mono">
                <span>SECURE_ENCLAVE_V.2.0</span>
                <span className="material-symbols-outlined text-sm">lock</span>
              </div>
            </div> */}
          </div>

          {/* Right Column - Form */}
          <div className="lg:w-2/3 flex flex-col flex-1 animate-fade-up delay-3">
            {/* Progress */}
            <div className="flex flex-col gap-3 mb-8">
              <div className="flex justify-between items-end">
                <p className="text-[#58b814] text-sm font-bold uppercase tracking-widest">Step 1 of 3</p>
                <p className="text-white text-base font-medium leading-normal">Professional Credentials</p>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#20261c] border border-[#2f3829] overflow-hidden">
                <div
                  className="h-full bg-[#58b814] rounded-full"
                  style={{ width: `${progress}%`, transition: 'width 900ms cubic-bezier(.22,1,.36,1)' }}
                />
              </div>
            </div>

            {/* Card */}
            <div className="bg-[#20261c] border border-[#2f3829] rounded-xl p-6 md:p-8 shadow-2xl shadow-black/40 animate-fade-up delay-4">
              <form className="flex flex-col gap-6">
                {/* License & Identification */}
                <div className="flex flex-col gap-8">
                  <div className="border-b border-[#2f3829]/50 pb-2">
                    <h3 className="text-white text-lg italic tracking-wide">License & Identification</h3>
                  </div>
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-[#a9b89d] text-xs uppercase tracking-[0.15em] font-semibold">Full Name</label>
                      <input type="text" placeholder="Enter your full name" className="w-full bg-[#1E1E1E]/50 text-white border border-[#2f3829] rounded-lg py-3 px-4 focus:outline-none focus:border-[#58b814] focus:ring-1 focus:ring-[#58b814]/30 transition-all placeholder:text-[#a9b89d]/50 text-base backdrop-blur-sm" />
                    </div>
                    {/* <div className="flex flex-col gap-2">
                      <label className="text-[#a9b89d] text-xs uppercase tracking-[0.15em] font-semibold">Years in Practice</label>
                      <input type="number" placeholder="e.g. 12" className="w-full bg-transparent text-white border-0 border-b border-[#2f3829] py-2 px-0 focus:outline-none focus:border-[#58b814] transition-all placeholder:text-[#a9b89d]/30 text-lg" />
                    </div> */}
                  </div>
                </div>

                {/* Expertise & Affiliation */}
                <div className="flex flex-col gap-8 mt-4">
                  <div className="border-b border-[#2f3829]/50 pb-2">
                    <h3 className="text-white text-lg italic tracking-wide">Expertise & Affiliation</h3>
                  </div>
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-3 relative" id="specialization-container">
                      <label className="text-[#a9b89d] text-xs uppercase tracking-[0.15em] font-semibold">Area of Specialization</label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-linear-to-r from-[#58b814]/10 to-[#2ECC71]/10 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        <input 
                          type="text" 
                          value={specialization}
                          onChange={(e) => handleSpecializationChange(e.target.value)}
                          onFocus={() => setIsDropdownOpen(true)}
                          placeholder="Search or type specialization..." 
                          className="relative w-full bg-[#1E1E1E]/50 text-white border border-[#2f3829] rounded-lg py-3 px-4 focus:outline-none focus:border-[#58b814] focus:ring-1 focus:ring-[#58b814]/30 transition-all placeholder:text-[#a9b89d]/50 text-base backdrop-blur-sm z-10"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#58b814] opacity-60 group-focus-within:opacity-100 transition-opacity pointer-events-none">
                          <span className="material-symbols-outlined text-lg">medical_services</span>
                        </div>
                      </div>
                      
                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1E1E1E] border border-[#2f3829] rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                          {filteredSpecializations.length > 0 ? (
                            <>
                              {filteredSpecializations.map((spec) => (
                                <div
                                  key={spec}
                                  onClick={() => handleSelectSpecialization(spec)}
                                  className="px-4 py-3 hover:bg-[#58b814]/20 cursor-pointer border-b border-[#2f3829]/50 last:border-b-0 transition-colors flex items-center gap-2 hover:text-[#58b814] text-white"
                                >
                                  <span className="material-symbols-outlined text-sm">check_circle</span>
                                  {spec}
                                </div>
                              ))}
                              {!SPECIALIZATIONS.includes(specialization) && specialization && (
                                <div className="px-4 py-3 border-t border-[#58b814]/30 bg-[#58b814]/10">
                                  <div
                                    onClick={() => handleSelectSpecialization(specialization)}
                                    className="cursor-pointer text-[#58b814] font-medium flex items-center gap-2 hover:opacity-80 transition-opacity"
                                  >
                                    <span className="material-symbols-outlined text-sm">add_circle</span>
                                    Use "{specialization}"
                                  </div>
                                </div>
                              )}
                            </>
                          ) : specialization ? (
                            <div className="px-4 py-3">
                              <div
                                onClick={() => handleSelectSpecialization(specialization)}
                                className="cursor-pointer text-[#58b814] font-medium flex items-center gap-2 hover:opacity-80 transition-opacity"
                              >
                                <span className="material-symbols-outlined text-sm">add_circle</span>
                                Use "{specialization}"
                              </div>
                            </div>
                          ) : (
                            <div className="px-4 py-3 text-[#a9b89d]/60 text-sm">No specializations found</div>
                          )}
                        </div>
                      )}
                      
                      <p className="text-[#a9b89d]/60 text-xs">Select from suggestions or type your own</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[#a9b89d] text-xs uppercase tracking-[0.15em] font-semibold">Primary Hospital Affiliation</label>
                      <div className="relative">
                        <input type="text" placeholder="Enter institution name" className="w-full bg-transparent text-white border-0 border-b border-[#2f3829] py-2 px-0 focus:outline-none focus:border-[#58b814] transition-all placeholder:text-[#a9b89d]/30 text-lg" />
                        <div className="absolute inset-y-0 right-0 flex items-center text-[#a9b89d]">
                          <span className="material-symbols-outlined text-lg">search</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification */}
                {/* <div className="flex flex-col gap-6 mt-4">
                  <div className="border-b border-[#2f3829]/50 pb-2">
                    <h3 className="text-white text-lg italic tracking-wide">Verification</h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[#a9b89d] text-xs uppercase tracking-[0.15em] font-semibold">Board Certification Document</label>
                    <div className="group border border-[#2f3829] hover:border-[#58b814]/50 bg-[#141811]/30 rounded-lg p-6 transition-all cursor-pointer flex items-center gap-4">
                      <div className="p-2 bg-[#20261c] rounded border border-[#2f3829] group-hover:border-[#58b814]/30 transition-colors">
                        <span className="material-symbols-outlined text-[#a9b89d] group-hover:text-[#58b814] transition-colors text-xl">add_circle</span>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-white font-medium text-sm">Upload certification</p>
                        <p className="text-[#a9b89d] text-[10px] uppercase tracking-wider mt-0.5">PDF, DOCX, JPG (Max 5MB)</p>
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* Actions */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-[#2f3829]/30">
                  <a href="#" className="text-[#a9b89d] text-xs uppercase tracking-widest font-semibold hover:text-white transition-colors flex items-center gap-2 order-2 md:order-1">
                    <span className="material-symbols-outlined text-sm">west</span>
                    Back
                  </a>
                  <button
                    type="button"
                    onClick={() => navigate('/doctor/step-2')}
                    className="relative w-full md:w-auto order-1 md:order-2 flex min-w-55 cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-10 bg-[#58b814] text-[#141811] transition-all duration-300 text-sm font-bold uppercase tracking-[0.2em] shadow-xl shadow-[#58b814]/10 hover:shadow-[#58b814]/30"
                  >
                    <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity shimmer rounded-full" />
                    <span className="relative z-10 flex items-center">Next Step
                      <span className="material-symbols-outlined text-base ml-2">east</span>
                    </span>
                  </button>
                </div>
              </form>
            </div>

            {/* Footer Links under card */}
            <div className="mt-8 flex justify-center md:justify-end gap-6 text-xs text-[#a9b89d] animate-fade-up">
              <a href="#" className="hover:text-[#58b814] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#58b814] transition-colors">Terms of Service</a>
              <span className="flex items-center gap-1 cursor-default">
                <span className="material-symbols-outlined text-sm">lock</span>
                256-bit SSL Encrypted
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
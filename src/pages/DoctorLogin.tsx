import { useState } from "react";
import { useNavigate } from "react-router-dom";
import patientimg from "../assets/patientreg.png";

export default function DoctorLogin() {
  const [npi, setNpi] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleNpiChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");
    setNpi(numericValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!npi || !password) {
      alert("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Navigate to dashboard after successful login
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen flex flex-col bg-linear-to-br from-[#182111] to-[#0f1409] text-white antialiased font-display overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#58b814]/5 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-[#58b814]/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: "-2s" }}></div>
      </div>

      {/* Main Content Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-115">
          {/* Logo/Brand Header */}
          <div className="flex flex-col items-center mb-8 text-center animate-fade-up">
            <img
              src={patientimg}
              alt="Secure & Trusted"
              className="w-20 h-20 object-contain mb-4 animate-bounce-slow"
            />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 animate-fade-in delay-1">
              Medical Practitioner
              <br />
              <span className="text-[#58b814] inline-block animate-slide-in-right delay-2">Login Portal</span>
            </h1>
            <p className="text-[#a9b89d] text-sm delay-3 animate-fade-in">Secure access for healthcare professionals</p>
          </div>

          {/* Login Card */}
          <div className="bg-[#20261c]/40 backdrop-blur-md border border-[#2f3829] rounded-2xl shadow-2xl shadow-[#58b814]/10 p-7 md:p-9 animate-fade-up delay-3 hover:shadow-[#58b814]/20 transition-shadow duration-500 shimmer" style={{ animationDelay: "0.24s" }}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Provider ID Field */}
              <div className="space-y-2 animate-slide-in-up delay-4" style={{ animationDelay: "0.32s" }}>
                <label className="block text-xs font-semibold text-[#a9b89d] uppercase tracking-wider ml-1" htmlFor="npi">
                  Provider ID 
                </label>
                <div className="relative group">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#58b814] material-symbols-outlined text-xl group-focus-within:text-[#6cc924] group-focus-within:scale-110 transition-all duration-200 font-bold">badge</span>
                  <input
                    id="npi"
                    type="text"
                    value={npi}
                    onChange={(e) => handleNpiChange(e.target.value)}
                    placeholder="Enter 10-digit NPI"
                    className="w-full pl-11 pr-3.5 py-3 bg-[#0f1409]/60 border border-[#2f3829] rounded-lg focus:ring-2 focus:ring-[#58b814]/50 focus:border-[#58b814] transition-all duration-200 text-[#a8e6a1] caret-[#58b814] placeholder:text-[#6d7f6d] hover:border-[#58b814]/30 hover:bg-[#0f1409]/80 focus:bg-[#0f1409]/80 backdrop-blur-sm"
                    inputMode="numeric"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2 animate-slide-in-up delay-5" style={{ animationDelay: "0.4s" }}>
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-xs font-semibold text-[#a9b89d] uppercase tracking-wider" htmlFor="password">
                    Password
                  </label>
                  <a href="#" className="text-xs text-[#58b814] hover:text-[#6cc924] font-medium transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#58b814] material-symbols-outlined text-xl group-focus-within:text-[#6cc924] group-focus-within:scale-110 transition-all duration-200 font-bold">lock</span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 bg-[#0f1409]/60 border border-[#2f3829] rounded-lg focus:ring-2 focus:ring-[#58b814]/50 focus:border-[#58b814] transition-all duration-200 text-[#a8e6a1] caret-[#58b814] placeholder:text-[#6d7f6d] hover:border-[#58b814]/30 hover:bg-[#0f1409]/80 focus:bg-[#0f1409]/80 backdrop-blur-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#58b814] hover:text-[#6cc924] transition-all duration-200 hover:scale-110 font-bold"
                  >
                    <span className="material-symbols-outlined text-xl font-bold">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#58b814] hover:bg-[#6cc924] disabled:bg-[#58b814]/50 text-[#182111] font-bold py-3 rounded-lg shadow-lg shadow-[#58b814]/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:cursor-not-allowed hover:shadow-[#58b814]/40 hover:shadow-xl animate-slide-in-up mt-2 delay-1"
                style={{ animationDelay: "0.48s" }}
              >
                <span className={`material-symbols-outlined text-xl transition-transform font-bold ${isLoading ? "animate-spin" : ""}`}>
                  {isLoading ? "schedule" : "verified_user"}
                </span>
                <span>{isLoading ? "Verifying..." : "Secure Login"}</span>
              </button>
            </form>

            {/* Support & Registration */}
            <div className="mt-5 pt-5 border-t border-[#2f3829]/50 space-y-3 animate-fade-in delay-2" style={{ animationDelay: "0.56s" }}>
              <p className="text-xs text-[#a9b89d] text-center">
                Need help?{" "}
                <a href="#" className="text-[#58b814] hover:text-[#6cc924] font-medium transition-colors">
                  Contact Support
                </a>
              </p>
              <p className="text-xs text-[#a9b89d] text-center">
                New practitioner?{" "}
                <button
                  onClick={() => navigate("/doctor")}
                  className="text-[#58b814] hover:text-[#6cc924] font-medium transition-colors"
                  type="button"
                >
                  Register here
                </button>
              </p>
            </div>
          </div>

          {/* Security Badges */}
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-[#a9b89d]/70 animate-fade-in delay-3" style={{ animationDelay: "0.64s" }}>
            {/* <div className="flex items-center gap-1 hover:text-[#a9b89d] transition-colors group">
              <span className="material-symbols-outlined text-sm text-[#58b814] group-hover:scale-110 transition-transform font-bold">gpp_good</span>
              <span>HIPAA Compliant</span>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <span className="w-1 h-1 bg-[#2f3829] rounded-full"></span>
            </div>
            <div className="flex items-center gap-1 hover:text-[#a9b89d] transition-colors group">
              <span className="material-symbols-outlined text-sm text-[#58b814] group-hover:scale-110 transition-transform font-bold">encrypted</span>
              <span>256-bit Encrypted</span>
            </div> */}
          </div>
        </div>
      </main>

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-right {
          0% { opacity: 0; transform: translateX(-10px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-left {
          0% { opacity: 0; transform: translateX(10px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes shine {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out both;
        }
        .animate-fade-up {
          animation: fade-up 0.6s ease-out both;
        }
        .animate-slide-in-up {
          animation: slide-in-up 0.5s ease-out both;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out both;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out both;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .delay-1 { animation-delay: 0.08s; }
        .delay-2 { animation-delay: 0.16s; }
        .delay-3 { animation-delay: 0.24s; }
        .delay-4 { animation-delay: 0.32s; }
        .delay-5 { animation-delay: 0.4s; }
        .shimmer {
          background-image: linear-gradient(90deg, transparent, rgba(88,184,20,.1), transparent);
          background-size: 200% 100%;
          animation: shine 2.2s linear infinite;
        }
        /* Override browser autofill styling */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px #0f1409 inset !important;
          box-shadow: 0 0 0 30px #0f1409 inset !important;
          -webkit-text-fill-color: #a8e6a1 !important;
          caret-color: #58b814 !important;
        }
        input:-webkit-autofill::first-line {
          font-size: 16px;
        }
      `}</style>
    </div>
  );
}

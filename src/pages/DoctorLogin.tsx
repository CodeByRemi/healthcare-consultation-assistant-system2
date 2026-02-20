import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DoctorLogin() {
  const [npi, setNpi] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to dashboard or next page
      navigate("/doctor/dashboard");
    }, 1500);
  };

  return (
    <div className="dark min-h-screen flex flex-col bg-gradient-to-br from-[#182111] to-[#0f1409] text-white antialiased font-display overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#58b814]/5 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-[#58b814]/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: "-2s" }}></div>
      </div>

      {/* Main Content Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[460px]">
          {/* Logo/Brand Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="mb-5 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#58b814]/10 border border-[#58b814]/20 text-[#58b814] animate-bounce-slow">
              <span className="material-symbols-outlined text-3xl">shield_with_heart</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 animate-fade-in">
              Medical Practitioner
              <br />
              <span className="text-[#58b814] inline-block animate-slide-in-right">Login</span>
            </h1>
          </div>

          {/* Login Card */}
          <div className="bg-[#20261c]/40 backdrop-blur-md border border-[#2f3829] rounded-2xl shadow-2xl shadow-[#58b814]/10 p-7 md:p-9 animate-fade-up hover:shadow-[#58b814]/20 transition-shadow duration-500">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Provider ID Field */}
              <div className="space-y-2 animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
                <label className="block text-xs font-semibold text-[#a9b89d] uppercase tracking-wider ml-1" htmlFor="npi">
                  Provider ID / NPI
                </label>
                <div className="relative group">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a9b89d] material-symbols-outlined text-xl group-focus-within:text-[#58b814] transition-colors">badge</span>
                  <input
                    id="npi"
                    type="text"
                    value={npi}
                    onChange={(e) => setNpi(e.target.value)}
                    placeholder="Enter 10-digit NPI"
                    className="w-full pl-11 pr-3.5 py-3 bg-[#0f1409]/60 border border-[#2f3829] rounded-lg focus:ring-2 focus:ring-[#58b814]/50 focus:border-[#58b814] transition-all duration-200 text-[#a8e6a1] caret-[#58b814] placeholder:text-[#6d7f6d] hover:border-[#58b814]/30 hover:bg-[#0f1409]/80 focus:bg-[#0f1409]/80 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2 animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-xs font-semibold text-[#a9b89d] uppercase tracking-wider" htmlFor="password">
                    Password
                  </label>
                  <a href="#" className="text-xs text-[#58b814] hover:text-[#6cc924] font-medium transition-colors">
                    Forgot?
                  </a>
                </div>
                <div className="relative group">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a9b89d] material-symbols-outlined text-xl group-focus-within:text-[#58b814] transition-colors">lock</span>
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a9b89d] hover:text-[#58b814] transition-all duration-200 hover:scale-110"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#58b814] hover:bg-[#6cc924] disabled:bg-[#58b814]/50 text-[#182111] font-bold py-3 rounded-lg shadow-lg shadow-[#58b814]/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:cursor-not-allowed hover:shadow-[#58b814]/40 hover:shadow-xl animate-slide-in-up mt-2"
                style={{ animationDelay: "0.3s" }}
              >
                <span className={`material-symbols-outlined text-xl transition-transform ${isLoading ? "animate-spin" : ""}`}>
                  {isLoading ? "schedule" : "verified_user"}
                </span>
                <span>{isLoading ? "Verifying..." : "Secure Login"}</span>
              </button>
            </form>

            {/* Support & Registration */}
            <div className="mt-5 pt-5 border-t border-[#2f3829]/50 space-y-3 animate-fade-in" style={{ animationDelay: "0.4s" }}>
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
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-[#a9b89d]/70 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-center gap-1 hover:text-[#a9b89d] transition-colors">
              <span className="material-symbols-outlined text-sm text-[#58b814]">gpp_good</span>
              <span>HIPAA Compliant</span>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <span className="w-1 h-1 bg-[#2f3829] rounded-full"></span>
            </div>
            <div className="flex items-center gap-1 hover:text-[#a9b89d] transition-colors">
              <span className="material-symbols-outlined text-sm text-[#58b814]">encrypted</span>
              <span>256-bit Encrypted</span>
            </div>
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
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
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

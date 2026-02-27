import { useNavigate } from "react-router-dom"; // <-- import

export default function VerificationStatus() {
  const navigate = useNavigate(); // <-- hook to navigate

  return (
    <div className="min-h-screen bg-[#0b1a0b] flex flex-col items-center justify-center px-6 py-12 font-sans text-white">
      {/* Central Card */}
      <div className="max-w-2xl w-full bg-[#142514] rounded-2xl p-10 flex flex-col items-center text-center shadow-2xl border border-green-900">
        
        {/* Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-xl bg-green-700 flex items-center justify-center text-black text-4xl shadow-lg animate-pulse">
            <span className="material-symbols-outlined">check</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold mb-4">Credentials Under Review</h1>
        <p className="text-green-100 text-center mb-8 max-w-md">
          Your professional credentials have been successfully submitted. Our team is currently verifying your medical license and history to ensure the highest standards of care. This process typically takes <span className="text-green-400 font-semibold">24-48 business hours</span>.
        </p>

        {/* Progress Bar */}
        <div className="w-full mb-8">
          <div className="flex justify-between mb-2 text-xs uppercase tracking-widest text-green-400">
            <span>Current Progress</span>
            <span>75% Complete</span>
          </div>
          <div className="relative w-full h-2 bg-green-900 rounded-full overflow-hidden mb-6">
            <div className="absolute top-0 left-0 h-full bg-green-500 rounded-full" style={{ width: "75%" }}></div>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-black">
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <span>Submitted</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-black">
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <span>Validation</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-green-500 bg-green-800 flex items-center justify-center text-green-400 animate-pulse">
                <span className="material-symbols-outlined text-sm">hourglass_top</span>
              </div>
              <span className="text-green-400 font-semibold">Admin Review</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-6">
          <button
            onClick={() => navigate("/")} 
            className="w-full sm:w-auto px-8 py-3 bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg transition-shadow shadow-lg"
          >
            Go Home
          </button>
          
          <button 
            onClick={() => navigate("/doctor/dashboard")}
            className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-shadow shadow-lg animate-pulse"
          >
            Bypass Verification (Dev)
          </button>
        </div>
      </div>

      {/* Footer Text */}
      <p className="mt-12 text-green-200 text-sm flex items-center gap-2">
        <span className="material-symbols-outlined text-sm">lock</span>
        Secure encrypted verification environment
      </p>

      {/* Footer Badges */}
      <footer className="mt-6 flex gap-8 text-green-200 text-xs">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined">shield</span>
          HIPAA Compliant
        </div>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined">verified</span>
          Board Certified
        </div>
      </footer>
    </div>
  );
}
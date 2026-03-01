import { useNavigate } from "react-router-dom";
import { FaUserInjured, FaUserMd, FaArrowRight } from "react-icons/fa";
import patientimg from "../../assets/patientreg.png";

export default function ChooseYourPath() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-['Manrope'] flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-linear-to-br from-[#0A6ED1] to-[#0da540] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <img
                src={patientimg}
                alt="Medicare Logo"
                className="w-6 h-6 object-contain brightness-0 invert"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 font-['Newsreader']">
              Medicare
            </span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 pt-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-['Newsreader'] font-medium text-slate-900 mb-4">
            Choose your <span className="italic text-[#0A6ED1]">portal</span>
          </h1>
          <p className="text-lg text-slate-600">
            Select your role to access your personalized healthcare dashboard
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Patient Card */}
          <button
            onClick={() => navigate("/patient-login")}
            className="group relative bg-white border border-slate-200 rounded-3xl p-8 hover:border-[#0A6ED1] hover:shadow-2xl hover:shadow-[#0A6ED1]/10 transition-all duration-300 text-left flex flex-col h-full overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0A6ED1]/5 rounded-bl-full group-hover:scale-110 transition-transform duration-500"></div>
            
            <div className="w-14 h-14 bg-[#0A6ED1]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0A6ED1] transition-colors duration-300">
              <FaUserInjured className="w-7 h-7 text-[#0A6ED1] group-hover:text-white transition-colors" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-2 font-['Newsreader']">Patient Portal</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Book appointments, view medical history, and consult with specialists securely from home.
            </p>
            
            <div className="mt-auto flex items-center text-[#0A6ED1] font-semibold gap-2 group-hover:gap-3 transition-all">
              Continue as Patient
              <FaArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Doctor Card */}
          <button
            onClick={() => navigate("/doctor/login")}
            className="group relative bg-white border border-slate-200 rounded-3xl p-8 hover:border-[#0da540] hover:shadow-2xl hover:shadow-[#0da540]/10 transition-all duration-300 text-left flex flex-col h-full overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0da540]/5 rounded-bl-full group-hover:scale-110 transition-transform duration-500"></div>
            
            <div className="w-14 h-14 bg-[#0da540]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#0da540] transition-colors duration-300">
              <FaUserMd className="w-7 h-7 text-[#0da540] group-hover:text-white transition-colors" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-2 font-['Newsreader']">Doctor Portal</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Manage appointments, access patient records, and provide consultations efficiently.
            </p>
            
            <div className="mt-auto flex items-center text-[#0da540] font-semibold gap-2 group-hover:gap-3 transition-all">
              Continue as Doctor
              <FaArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}


import patientimg from "../../../assets/patientreg.png";
import { FaHeartbeat, FaUserShield, FaNotesMedical } from "react-icons/fa";

export default function AuthSidebar() {
  return (
    <div className="md:w-1/2 bg-[#0A6ED1] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden font-['Manrope']">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
      </div>

      {/* Top Branding */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
            <img src={patientimg} alt="Medicare Logo" className="w-6 h-6 object-contain brightness-0 invert" />
          </div>
          <span className="text-2xl font-bold tracking-tight font-['Newsreader']">Medicare</span>
        </div>
      </div>

      {/* Center Content */}
      <div className="relative z-10 mb-8">
        <h2 className="text-4xl md:text-5xl font-['Newsreader'] font-medium mb-6 leading-tight">
          Your health journey, <br />
          <span className="italic text-[#8fcfa7]">simplified.</span>
        </h2>
        <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-md">
          Experience healthcare that revolves around you. Connect with top specialists and manage your wellness with ease.
        </p>

        <div className="space-y-5">
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
              <FaHeartbeat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Advanced Monitoring</h3>
              <p className="text-sm text-white/70">Track vitals and health trends</p>
            </div>
          </div>

          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
              <FaUserShield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Secure & Private</h3>
              <p className="text-sm text-white/70">HIPAA compliant data protection</p>
            </div>
          </div>

          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
              <FaNotesMedical className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Digital Prescriptions</h3>
              <p className="text-sm text-white/70">Manage medications effortlessly</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-xs text-white/50 flex gap-4">
        <span>© 2026 Medicare Inc.</span>
        <a href="#" className="hover:text-white transition-colors">Privacy</a>
        <a href="#" className="hover:text-white transition-colors">Terms</a>
      </div>
    </div>
  );
}

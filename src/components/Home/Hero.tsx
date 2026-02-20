import { motion } from "framer-motion";
import { FaCalendarCheck, FaRobot } from "react-icons/fa";

export default function Hero() {
  return (
    <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden gradient-bg">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[60%] w-125 h-125 bg-[#0A6ED1]/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[10%] left-[10%] w-100 h-100 bg-[#2ECC71]/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "-5s" }} />
        <div className="absolute top-[40%] right-[10%] w-75 h-75 bg-[#0A6ED1]/5 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: "-2s" }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Hero Text */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">
              Est. 2024 / Smart Healthcare
            </p>
            <h1 className="text-7xl lg:text-8xl font-serif text-[#1A1A1A] leading-tight mb-8 drop-shadow-sm">
              Book <br />
              <span className="italic text-[#0A6ED1]">Appointments</span> <br />
              Easily
            </h1>
            <div className="w-24 h-px bg-gray-200 mb-8" />
            <p className="text-lg text-gray-500 max-w-lg mb-12 leading-relaxed">
              Schedule clinic visits online and interact with our AI assistant for guidance and answers to your health-related questions—all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="px-10 py-5 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#0A6ED1] transition-all shadow-xl">
                Get Started
              </button>
              <button className="px-10 py-5 glass-effect border border-gray-200 text-xs font-bold uppercase tracking-widest hover:bg-white transition-all">
                Book Appointment
              </button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square flex items-center justify-center">
              {/* Organic Shapes */}
              <div className="absolute w-112.5 h-112.5 organic-shape glass-effect animate-float bg-linear-to-br from-[#0A6ED1]/10 to-transparent flex items-center justify-center">
                <div className="w-3/4 h-3/4 bg-[#0A6ED1]/20 rounded-full blur-3xl opacity-50" />
              </div>
              <div className="absolute w-87.5 h-87.5 organic-shape glass-effect animate-float bg-linear-to-tr from-[#2ECC71]/10 to-transparent translate-x-12 -translate-y-12" style={{ animationDelay: "-2s", borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%" } as React.CSSProperties}>
                <div className="w-1/2 h-1/2 bg-[#2ECC71]/20 rounded-full blur-3xl opacity-40 absolute top-1/4 right-1/4" />
              </div>

              {/* Top Box: AI Assistance */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: [-20, 0, -20], opacity: [0,1,0.9] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-4 w-64 h-80 glass-effect rounded-3xl shadow-2xl z-20 p-6 flex flex-col justify-between"
                style={{ background: "rgba(255,255,255,0.75)" }}
              >
                <div className="w-12 h-12 bg-[#0A6ED1] rounded-2xl flex items-center justify-center shadow-lg shadow-[#0A6ED1]/20">
                  <FaRobot className="text-white w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl mb-2 text-[#1A1A1A]">
                    AI Guidance
                  </h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">
                    Ask questions and get directions to your appointments
                  </p>
                </div>
              </motion.div>

              {/* Bottom Box: Booking Appointments */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: [20, 0, 20], opacity: [0,1,0.9] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-12 left-0 w-60 h-40 glass-effect rounded-3xl shadow-2xl z-30 p-6 flex flex-col justify-center"
                style={{ background: "rgba(255,255,255,0.75)" }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <FaCalendarCheck className="w-6 h-6 text-[#0A6ED1] animate-bounce" />
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Appointments</p>
                </div>
                <p className="text-[12px] font-semibold text-[#1A1A1A]">
                  Schedule your visits online quickly and easily
                </p>
              </motion.div>

              {/* Rotating Dashed Ring */}
              <div className="absolute w-137.5 h-137.5 border border-dashed border-gray-200/50 rounded-full animate-spin" style={{ animationDuration: "40s" }} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
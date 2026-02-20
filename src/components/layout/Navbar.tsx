import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import patientimg from "../../assets/patientreg.png";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/30 border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
    

<motion.div
  initial={{ scale: 0.9 }}
  animate={{ scale: [0.9, 1, 0.95, 1] }}
  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
  className="flex items-center space-x-2 cursor-pointer"
>
  {/* Replace div with image */}
  <img
    src={patientimg}
    alt="Medicare Logo"
    className="w-10 h-10 object-contain"
  />

  <span className="text-2xl font-bold uppercase text-[#1A1A1A] tracking-wider">
    Medicare
  </span>
</motion.div>

        {/* Right side: Sign In */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Link
            to="/choose-path"
            className="relative inline-block px-6 py-2 font-semibold uppercase tracking-widest text-[#1A1A1A] transition-all duration-300 group"
          >
            <span className="absolute inset-0 bg-linear-to-r from-[#0A6ED1] to-[#2ECC71] opacity-0 group-hover:opacity-20 rounded-md transition-opacity duration-300"></span>
            <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">
              Sign In
            </span>
            {/* Animated underline */}
            <motion.span
              layoutId="underline"
              className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#0A6ED1] rounded"
              animate={{ width: ["0%", "100%", "0%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </Link>
        </motion.div>
      </div>

      {/* Floating background shapes for aesthetic */}
      <div className="absolute top-0 left-0 w-full h-20 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-[#0A6ED1]/20 rounded-full animate-float" />
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-[#2ECC71]/20 rounded-full animate-float" />
      </div>
    </motion.nav>
  );
}
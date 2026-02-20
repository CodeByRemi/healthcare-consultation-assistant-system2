import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaUserInjured } from "react-icons/fa";   // medical patient
import { FaUserMd } from "react-icons/fa";
import patientimg from "../assets/patientreg.png";
export default function ChooseYourPath() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col">
      {/* Navbar */}
      <nav className="w-full py-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
          <motion.button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            whileHover={{ scale: 1.05 }}
          >
             <div className="w-8 h-8 bg-linear-to-br from-[#0A6ED1] to-[#9C8C74] rounded-lg flex items-center justify-center text-white font-bold overflow-hidden">
              
              <img
                src={patientimg}
                alt="Medicare Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold tracking-widest uppercase text-[#3B3835]">
              Medicare
            </span>
          </motion.button>
          <motion.button
            onClick={() => navigate("/")}
            className="text-sm font-medium text-[#3B3835] hover:text-[#0A6ED1] transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            ← Back to Home
          </motion.button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-20 px-6">
        <motion.div
          className="max-w-4xl w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            variants={cardVariants}
          >
           
          </motion.div>

          {/* Cards Grid */}
          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={containerVariants}
          >
            {/* Patient Sign Up Card */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-12 flex flex-col items-center text-center h-full relative overflow-hidden">
                {/* Background gradient on hover */}
                <motion.div
                  className="absolute inset-0 bg-linear-to-br from-[#0A6ED1]/5 to-[#9C8C74]/5 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ opacity: 0 }}
                />

                {/* Icon */}
               <motion.div
  className="relative z-10 w-20 h-20 rounded-full 
             bg-gradient-to-br from-[#0A6ED1] via-[#17A2B8] to-[#2ECC71]
             flex items-center justify-center text-white mb-8 shadow-xl"
  initial={{ scale: 0, rotate: -30, opacity: 0 }}
  animate={{ scale: 1, rotate: 0, opacity: 1 }}
  whileHover={{ scale: 1.15, rotate: 8 }}
  transition={{ type: "spring", stiffness: 120, damping: 10 }}
>
  <FaUserInjured className="text-4xl text-white drop-shadow-md" />
</motion.div>

{/* Text Content */}
<motion.h2
  className="relative z-10 text-3xl font-serif text-[#0A6ED1] mb-4"
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.2, duration: 0.6 }}
>
  Patient Sign Up
</motion.h2>

<motion.p
  className="relative z-10 text-gray-600 mb-8 leading-relaxed max-w-md"
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.35, duration: 0.6 }}
>
  Begin your journey towards personalized, premium care with our intuitive
  health management suite.
</motion.p>

                {/* Register Button */}
                <motion.button
                  onClick={() => navigate("/patient-reg")}
                  className="relative z-10 mt-auto px-8 py-3 border-2 border-[#3B3835] text-[#3B3835] rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-[#3B3835] hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.05, letterSpacing: "0.05em" }}
                  whileTap={{ scale: 0.95 }}
                >
                  REGISTER
                </motion.button>
              </div>
            </motion.div>

            {/* Doctor Sign Up Card */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-12 flex flex-col items-center text-center h-full relative overflow-hidden">
                {/* Background gradient on hover */}
                <motion.div
                  className="absolute inset-0 bg-linear-to-br from-[#9C8C74]/5 to-[#0A6ED1]/5 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ opacity: 0 }}
                />

<motion.div
  className="relative z-10 w-20 h-20 rounded-full 
             bg-gradient-to-br from-[#1B4F72] via-[#0A6ED1] to-[#17A2B8]
             flex items-center justify-center text-white mb-8 shadow-xl"
  initial={{ scale: 0, rotate: 30, opacity: 0 }}
  animate={{ scale: 1, rotate: 0, opacity: 1 }}
  whileHover={{ scale: 1.15, rotate: -8 }}
  transition={{ type: "spring", stiffness: 120, damping: 10 }}
>
  <FaUserMd className="text-4xl text-white drop-shadow-md" />
</motion.div>

{/* Text Content */}
<motion.h2
  className="relative z-10 text-3xl font-serif text-[#1B4F72] mb-4"
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.2, duration: 0.6 }}
>
  Doctor Sign Up
</motion.h2>

<motion.p
  className="relative z-10 text-gray-600 mb-8 leading-relaxed max-w-md"
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.35, duration: 0.6 }}
>
  Join our trusted network of certified healthcare professionals and deliver
  premium care through a secure, intelligent platform.
</motion.p>
                {/* Join Network Button */}
                <motion.button
                  onClick={() => navigate("/doctor")}
                  className="relative z-10 mt-auto px-8 py-3 border-2 border-[#3B3835] text-[#3B3835] rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-[#3B3835] hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.05, letterSpacing: "0.05em" }}
                  whileTap={{ scale: 0.95 }}
                >
                  JOIN NETWORK
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>© 2026 Medicare Premium. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#0A6ED1] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-[#0A6ED1] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-[#0A6ED1] transition-colors">
                Need Help?
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

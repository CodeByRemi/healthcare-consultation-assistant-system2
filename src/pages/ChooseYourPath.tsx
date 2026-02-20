import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
            <div className="w-8 h-8 bg-linear-to-br from-[#0A6ED1] to-[#9C8C74] rounded-lg flex items-center justify-center text-white font-bold">
              M
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
                  className="relative z-10 w-16 h-16 rounded-full bg-linear-to-br from-[#0A6ED1] to-[#3B3835] flex items-center justify-center text-white mb-8 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="material-icons-round text-3xl">person</span>
                </motion.div>

                {/* Text Content */}
                <h2 className="relative z-10 text-3xl font-serif text-[#3B3835] mb-4">
                  Patient Sign Up
                </h2>

                <p className="relative z-10 text-gray-600 mb-8 leading-relaxed">
                  Begin your journey towards personalized, premium care with our intuitive health management suite.
                </p>

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

                {/* Icon */}
                <motion.div
                  className="relative z-10 w-16 h-16 rounded-full bg-linear-to-br from-[#9C8C74] to-[#0A6ED1] flex items-center justify-center text-white mb-8 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="material-icons-round text-3xl">business_center</span>
                </motion.div>

                {/* Text Content */}
                <h2 className="relative z-10 text-3xl font-serif text-[#3B3835] mb-4">
                  Doctor Sign Up
                </h2>

                <p className="relative z-10 text-gray-600 mb-8 leading-relaxed">
                  Join an elite network of providers and streamline your practice with our advanced clinical tools.
                </p>

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

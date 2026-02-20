import { motion } from "framer-motion";

const steps = [
  {
    number: 1,
    title: "Create Your Profile",
    desc: "Set up your account with your email or phone number and complete your basic health profile.",
  },
  {
    number: 2,
    title: "Search Specialist",
    desc: "Filter doctors by specialty, location, or consultation fee to find the right match.",
  },
  {
    number: 3,
    title: "Consult & Recover",
    desc: "Have a video consultation, get your digital prescription, and start your recovery journey.",
  },
];

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

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function StreamlinedExperience() {
  return (
    <section className="relative py-32 bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-96 h-96 bg-primary/5 rounded-full mix-blend-screen filter blur-3xl" />
        <div className="absolute bottom-0 right-1/2 w-96 h-96 bg-tertiary/5 rounded-full mix-blend-screen filter blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - App Mockup */}
          <motion.div
            className="hidden lg:flex justify-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative w-64 h-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {/* Phone frame */}
              <div className="relative bg-white rounded-[3rem] p-3 shadow-2xl">
                {/* Phone notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-black rounded-b-3xl z-20" />

                {/* Screen content */}
                <div className="bg-linear-to-b from-primary to-tertiary rounded-[2.5rem] aspect-9/19 flex items-center justify-center relative overflow-hidden">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-center text-white"
                  >
                    <div className="text-4xl font-bold mb-4">Healthcare</div>
                    <div className="text-lg font-light opacity-80">Smart Solutions</div>
                  </motion.div>
                </div>
              </div>

              {/* Floating cards */}
              <motion.div
                className="absolute -left-8 -bottom-8 bg-white rounded-2xl p-6 shadow-xl w-48"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <div className="text-sm font-medium text-gray-600 mb-3">App Onboard</div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <div className="w-3 h-3 rounded-full bg-primary/30" />
                  <div className="w-3 h-3 rounded-full bg-primary/30" />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right - Steps */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Header */}
            <motion.div className="mb-16" variants={itemVariants}>
              <h2 className="text-5xl lg:text-6xl font-serif text-white mb-6">
                Streamlined
                <br />
                <span className="italic text-tertiary">Experience</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our intuitive platform makes healthcare accessible in just a few simple steps.
              </p>
            </motion.div>

            {/* Steps */}
            <div className="space-y-8">
              {steps.map((step) => (
                <motion.div
                  key={step.number}
                  variants={itemVariants}
                  className="flex gap-6 group cursor-pointer"
                  whileHover={{ x: 10 }}
                >
                  {/* Number Circle */}
                  <motion.div
                    className="relative shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-primary to-tertiary flex items-center justify-center text-white font-bold text-lg shadow-lg"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span>{step.number}</span>
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-full bg-linear-to-br from-primary to-tertiary opacity-20 group-hover:opacity-40 blur-lg transition-opacity" />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-serif text-white mb-2 group-hover:text-tertiary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                      {step.desc}
                    </p>
                  </div>

                  {/* Arrow icon */}
                  <motion.div
                    className="self-center text-tertiary opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="material-icons-round">arrow_forward</span>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

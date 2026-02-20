import { motion } from "framer-motion";

export default function HowItWorks() {
  return (
    <section className="py-24 bg-[#F9FAFB] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT – PROCESS VISUAL */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Floating phone */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-full aspect-4/3 bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05),0_5px_15px_rgba(0,0,0,0.02)] flex items-center justify-center p-12 relative z-10"
            >
              <div className="w-64 h-96 border-8 border-[#1A1A1A] rounded-[2.5rem] p-4 bg-gray-50 flex flex-col items-center">
                <div className="w-1/3 h-1.5 bg-gray-300 rounded-full mt-2 mb-10" />
                <div className="w-full h-32 bg-[#0A6ED1]/5 rounded-xl mb-4" />
                <div className="w-full h-4 bg-gray-200 rounded mb-2" />
                <div className="w-2/3 h-4 bg-gray-200 rounded mb-8" />
                <div className="w-full h-12 bg-[#1A1A1A] rounded-lg" />
              </div>

              {/* Floating glass bubble */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute -top-10 -right-10 w-40 h-40 glass-effect rounded-full -z-10 border border-white/50"
              />
            </motion.div>

            {/* Glow */}
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#0A6ED1]/10 rounded-full blur-3xl"
            />
          </motion.div>

          {/* RIGHT – CONTENT */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.25 },
              },
            }}
          >
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              className="text-5xl font-serif mb-12"
            >
              Streamlined <br />
              <span className="italic text-gray-400">Experience</span>
            </motion.h2>

            <div className="space-y-12">
              {[ 
                {
                  step: "1",
                  title: "Create Your Profile",
                  text: "Sign up quickly using your email or phone number and complete your basic health profile.",
                  active: true,
                },
                {
                  step: "2",
                  title: "Search Specialist",
                  text: "Filter doctors by specialty, location, or consultation fee to find the right match for your needs.",
                },
                {
                  step: "3",
                  title: "Consult & Recover",
                  text: "Have a video consultation, get your digital prescription, and start your recovery journey immediately.",
                },
              ].map((item) => (
                <motion.div
                  key={item.step}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="flex items-start space-x-6"
                >
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors
                      ${
                        item.active
                          ? "bg-[#1A1A1A] text-white"
                          : "border border-gray-200 text-gray-400"
                      }`}
                  >
                    {item.step}
                  </motion.span>

                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      {item.title}
                    </h4>
                    <p className="text-gray-500 text-sm">
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
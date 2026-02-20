import { motion } from "framer-motion";

export default function CallToAction() {
  return (
    <section className="relative py-24 bg-linear-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-tertiary/10 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <motion.span
              className="inline-block text-xs font-bold uppercase tracking-widest text-tertiary mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              / START YOUR JOURNEY /
            </motion.span>

            <h2 className="text-5xl lg:text-6xl font-serif text-white mb-6 leading-tight">
              Ready to prioritize your <span className="text-tertiary italic">health</span>?
            </h2>

            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-md">
              Join thousands of users who trust Medicare for their healthcare needs. Sign up today for free.
            </p>

            {/* Trust indicators */}
            <motion.div
              className="flex items-center gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex -space-x-3">
                <img
                  className="w-10 h-10 rounded-full border-2 border-gray-800 object-cover"
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="User"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-gray-800 object-cover"
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
                  alt="User"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-gray-800 object-cover"
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jasmine"
                  alt="User"
                />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">10K+ Happy Patients</p>
                <p className="text-gray-400 text-xs">Trusted worldwide</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 lg:justify-end lg:gap-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.a
              href="#"
              className="px-10 py-4 bg-white text-primary rounded-lg font-bold uppercase tracking-wide text-sm hover:shadow-xl transition-all duration-300 text-center"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.a>

            <motion.a
              href="#"
              className="px-10 py-4 border-2 border-white text-white rounded-lg font-bold uppercase tracking-wide text-sm hover:bg-white hover:text-primary transition-all duration-300 text-center"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              Download App
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";

const services = [
  {
    title: "AI Health Consultation",
    desc: "Preliminary diagnosis powered by advanced algorithms.",
    icon: "psychology",
    link: "LEARN MORE",
  },
  {
    title: "Online Booking",
    desc: "Real-time availability without the wait.",
    icon: "calendar_month",
    link: "BOOK NOW",
  },
  {
    title: "Secure Medical Records",
    desc: "Encrypted, HIPAA-compliant vault for your medical data.",
    icon: "lock_person",
    link: "ACCESS VAULT",
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

export default function Services() {
  return (
    <section className="py-32 bg-[#F0F7FF]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl lg:text-6xl font-serif text-primary mb-4">
            Complete Healthcare
            <br />
            <span className="italic text-tertiary">Solutions</span>
          </h2>
          <p className="text-text-muted text-lg max-w-xl">
            Everything you need to manage your health in one secure, architecturally sound platform.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="relative bg-white rounded-3xl p-8 lg:p-10 shadow-sm hover:shadow-2xl transition-all duration-300 h-full flex flex-col overflow-hidden">
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-linear-to-br from-primary to-tertiary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-primary/10 group-hover:bg-white/20 flex items-center justify-center mb-6 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <span className="material-icons-round text-3xl text-primary group-hover:text-white transition-colors duration-300">
                      {service.icon}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl font-serif text-primary group-hover:text-white mb-3 transition-colors duration-300">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-text-muted group-hover:text-white/80 text-sm leading-relaxed mb-8 grow transition-colors duration-300">
                    {service.desc}
                  </p>

                  {/* Link */}
                  <motion.a
                    href="#"
                    className="inline-flex items-center gap-2 text-primary group-hover:text-white text-xs font-bold uppercase tracking-wider transition-colors duration-300"
                    whileHover={{ x: 5 }}
                  >
                    {service.link}
                    <span className="material-icons-round text-sm">arrow_forward</span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Services Link */}
        <motion.div
          className="text-right mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 text-primary hover:text-tertiary text-sm font-bold uppercase tracking-wider transition-colors"
          >
            VIEW ALL SERVICES
            <span className="material-icons-round">arrow_forward</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

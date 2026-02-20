import { motion } from "framer-motion";

export default function Footer() {
  const footerLinks = {
    company: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
    services: [
      { label: "Find a Doctor", href: "#" },
      { label: "Book Appointment", href: "#" },
      { label: "Consultation", href: "#" },
      { label: "Lab Tests", href: "#" },
    ],
    support: [
      { label: "Help Center", href: "#" },
      { label: "Teams", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "FAQs", href: "#" },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <footer className="relative bg-linear-to-b from-gray-900 to-black text-white overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full mix-blend-screen filter blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-tertiary/10 rounded-full mix-blend-screen filter blur-3xl opacity-20" />
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-linear-to-br from-primary to-tertiary rounded-lg flex items-center justify-center text-white font-bold">
                  M
                </div>
                <span className="text-xl font-bold tracking-widest uppercase">Medicare</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Providing accessible, affordable, and high-quality healthcare services through innovative digital solutions.
              </p>
              {/* Social Links */}
              <div className="flex gap-4 mt-6">
                <motion.a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-xs">f</span>
                </motion.a>
                <motion.a
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-xs">𝕏</span>
                </motion.a>
              </div>
            </motion.div>

            {/* Company Links */}
            <motion.div variants={itemVariants}>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-primary text-xs transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Services Links */}
            <motion.div variants={itemVariants}>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
                Services
              </h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-primary text-xs transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support Links */}
            <motion.div variants={itemVariants}>
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
                Support
              </h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-primary text-xs transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* CTA Box */}
          <motion.div
            className="bg-linear-to-r from-primary/10 to-tertiary/10 border border-white/10 rounded-2xl p-8 mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-xl font-serif mb-2">Need Help?</h3>
                <p className="text-gray-400 text-sm">
                  Our support team is available 24/7 to assist you.
                </p>
              </div>
              <motion.a
                href="#"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-tertiary rounded-lg font-medium text-sm transition-all whitespace-nowrap"
                whileHover={{ scale: 1.05, x: 5 }}
              >
                CONTACT SUPPORT
                <span className="material-icons-round text-sm">arrow_forward</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Bottom Divider */}
          <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />

          {/* Bottom Section */}
          <motion.div
            className="flex flex-col md:flex-row md:justify-between md:items-center gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs text-gray-500">
              © 2026 Medicare Healthcare System. All rights reserved.
            </p>
            <div className="flex gap-8">
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Cookie Settings
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

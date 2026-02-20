import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7 },
  },
};

const slideInFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8 },
  },
};

const slideInFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8 },
  },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-[#F0F7FF]">
      {/* Background with pattern and gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center opacity-40 mix-blend-multiply filter grayscale-30" />
        <div className="absolute inset-0 bg-linear-to-r from-[#F0F7FF] via-[#F0F7FF]/80 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-[#F0F7FF] via-transparent to-transparent" />
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full grid lg:grid-cols-12 gap-12 items-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Left Content */}
        <motion.div
          className="lg:col-span-5 flex flex-col items-start text-left"
          variants={slideInFromLeft}
        >
          {/* Main Heading */}
          <motion.h1
            className="text-5xl lg:text-6xl font-serif text-primary leading-tight mb-6 tracking-tight"
            variants={itemVariants}
          >
            Smart
            <br />
            <span className="font-normal italic text-secondary">Healthcare</span>
            <br />
            Made Simple<span className="text-lg align-top text-secondary">®</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-sm font-medium tracking-[0.2em] text-text-muted mb-10 uppercase border-l-2 border-primary pl-4"
            variants={itemVariants}
          >
            /Consult top-rated specialists 
          </motion.p>

          {/* CTA Buttons and User Avatars */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 items-center"
            variants={itemVariants}
          >
            {/* Get Started Button with Enhanced Design */}
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.02 }}
            >
              {/* Glowing background effect */}
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-primary to-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Button */}
              <motion.a
                href="#"
                className="relative px-8 py-4 bg-linear-to-r from-primary to-secondary text-white rounded-full font-bold tracking-wider text-sm uppercase shadow-xl flex items-center gap-2 overflow-hidden"
                whileHover={{ y: -6, boxShadow: "0 25px 50px -12px rgba(10, 110, 209, 0.4)" }}
                whileTap={{ scale: 0.95, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Shine effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-full"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                  style={{ width: "30%" }}
                />

                {/* Button content */}
                <span className="relative z-10">Get Started</span>
                <motion.span
                  className="material-icons-round relative z-10 text-sm"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  arrow_forward
                </motion.span>
              </motion.a>
            </motion.div>

            {/* User Avatars */}
            <motion.div
              className="flex items-center gap-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex -space-x-3">
                <img
                  className="w-10 h-10 rounded-full border-2 border-background-base object-cover grayscale"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJE1HWB8HIOr7w-8gTVlKbketwECauGX81cu7sPKRt0ftKnSomS9C0nH8DVXusJ15_5EDQYSqOeLYILequ-TV6CPeKoQnpKXi1m6uD81LW8y6oioZDjrWuz_7zEFYxRWxdrQpZII-5_-fNVUKs8RWyM72ZVOHnjJRdbysOs3EcgKO80CbYxNV4ulC7CB5pJeDUtEhoolBSksE2OFuxZkbUGQQpdo0pGpANHbyBb2liTRJIWc-qZobzgY_3QAvw68OsHoNd6D99DNg"
                  alt="User 1"
                />
                <img
                  className="w-10 h-10 rounded-full border-2 border-background-base object-cover grayscale"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuADBIKS-uarJze-NP1RgJCvDmuMKRiGVGt1JVBUl9e6LrZtXtNR-Vmw59V_hput2rZklcz_x8qcb60E9YzmtoZjNlQ4tJmZmdFug6XzsGbUk1iXwntIHVhVXjfC_dO6QLNmVZow8zGRS8ligBzSZxlfCBgaZBx_uLlgKWok3rvnnrb4f6vkKVFc_iVeG778sbJpiA_0mb0molGKE44yGfoBHl6istHQtIMQiXxlx5GAZ5ZdVq69FXqVIjo0sE5mtFmulLDHfMgHogM"
                  alt="User 2"
                />
              </div>
              <div className="text-xs font-semibold text-primary">
                <span className="font-serif text-2xl italic block">10k+</span>
                Patients
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right - Consultation Card */}
        <motion.div
          className="lg:col-span-7 relative lg:pl-10"
          variants={slideInFromRight}
        >
          <motion.div
            className="relative bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-8 lg:p-12 max-w-2xl ml-auto border border-white/50"
            whileHover={{ y: -10, boxShadow: "0 30px 60px -12px rgba(0,0,0,0.15)" }}
            transition={{ duration: 0.3 }}
          >
            {/* Tabs */}
            <motion.div
              className="flex gap-3 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="px-4 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telehealth
              </span>
              <span className="px-4 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Records
              </span>
              <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold font-serif ml-auto">
                3D
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              className="font-serif text-4xl text-primary mb-4 leading-tight"
              variants={itemVariants}
            >
              Verified Specialists &<br />
              Smart Records
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-text-muted mb-8 text-lg font-light"
              variants={itemVariants}
            >
              From preliminary diagnosis to recovery plans.
            </motion.p>

            {/* Image Card */}
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-sm aspect-4/3 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all z-10"
                initial={{ opacity: 0.1 }}
              />
              <motion.img
                className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfFmKIz0iRGAp4hscYzKM9kVhSNL_UN0HuSaTgED_buyLoVFKFRiG0HBdLKrmpXBF1COzVz5ulOdTJo9pGeLaP2z7icgPLihjgGZxBvdL2zzwjPCSigtxuoKlhyvrAm1YmPJVqPX7LyElBgJiz8EyDYiBTYbSxUwsarBE-BMEMKBYNvzgM0voSTM02WyDUWradKaCa2nmT3Oq9gCKcs8xDTGfcK10YGdXo12RUHBhXhN8ERxKX_0O2GDZf0VIUHVrIfSfTV5zPxEU"
                alt="Doctor Consultation"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
              />

              {/* Play Button */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 hover:bg-white/40 transition-all"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                whileHover={{ scale: 1.2 }}
              >
                <motion.div
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="material-icons-round text-primary ml-1">play_arrow</span>
                </motion.div>
              </motion.div>

              {/* Status Badge */}
              <motion.div
                className="absolute bottom-6 right-6 bg-white/95 backdrop-blur shadow-lg p-4 rounded-xl z-20 flex gap-3 items-center max-w-48"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="material-icons-round text-lg">verified</span>
                </motion.div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                    Status
                  </p>
                  <p className="text-sm font-serif font-bold text-primary">
                    Verified Specialists
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Vertical Line with Dots */}
            <motion.div
              className="absolute -left-4 top-1/2 h-24 w-px bg-gray-300 hidden lg:block"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              style={{ originY: 0.5 }}
            >
              <motion.div
                className="absolute top-0 -left-0.75 w-1.75 h-1.75 bg-white border border-gray-300 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-0 -left-0.75 w-1.75 h-1.75 bg-primary rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}


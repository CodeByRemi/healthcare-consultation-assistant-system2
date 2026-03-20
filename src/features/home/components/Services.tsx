import { FaUserMd, FaStethoscope, FaHeartbeat, FaCalendarCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

const services = [
    {
        icon: <FaUserMd size={20} />,
        title: "Doctor Matching",
        description: "Find and connect with verified doctors based on specialty, availability, and consultation needs."
    },
    {
        icon: <FaStethoscope size={20} />,
        title: "In-Person Consultation",
        description: "Schedule and manage clinic visits with doctors for physical checkups, diagnosis, and treatment."
    },
    {
        icon: <FaHeartbeat size={20} />,
        title: "AI Health Assistant",
        description: "Use AI-powered guidance to understand symptoms, get smart recommendations, and prepare for doctor visits."
    },
    {
        icon: <FaCalendarCheck size={20} />,
        title: "Appointment Booking",
        description: "Book, reschedule, and track appointments in just a few taps with real-time confirmation."
    }
];

const Services = () => {
    return (
        <section id="services" className="py-24 bg-white relative overflow-hidden">
            <div className="absolute -top-24 -left-20 w-64 h-64 rounded-full bg-accent/5 blur-3xl"></div>
            <div className="const-container">
                <motion.div 
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 text-left"
                >
                    <div className="max-w-2xl">
                        <motion.span initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/8 text-accent font-bold tracking-wider text-xs uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                            Our Services
                        </motion.span>
                        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.52, delay: 0.06 }} className="text-4xl md:text-5xl lg:text-6xl font-display text-primary leading-tight">
                            Designed for
                            <span className="block mt-1 text-[#3b82f6] md:text-accent italic font-serif">Real Healthcare Journeys</span>
                        </motion.h2>
                        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.12 }} className="mt-4 text-gray-600 max-w-xl text-sm md:text-base">
                            From finding the right doctor to booking visits and preparing with AI guidance, every step is built around practical care.
                        </motion.p>
                    </div>
                    
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                    {services.map((service, index) => (
                        <motion.div 
                            key={index} 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group p-4 md:p-8 border border-gray-100 bg-surface hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 rounded-sm"
                        >
                            <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center text-accent mb-3 md:mb-6 group-hover:bg-accent group-hover:text-white transition-colors shadow-sm border border-gray-50">
                                {service.icon}
                            </div>
                            <h3 className="text-sm md:text-xl font-display font-bold mb-1 md:mb-3 text-primary group-hover:text-accent transition-colors">{service.title}</h3>
                            <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                                {service.description}
                            </p>
                            <div className="mt-3 md:mt-6 w-8 h-px bg-gray-200 group-hover:w-full group-hover:bg-accent transition-all duration-500"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;

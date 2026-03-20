import { motion } from 'framer-motion';

const steps = [
    {
        number: "01",
        title: "Create Your Account",
        description: "Sign up and complete your health profile with your personal details, medical history, and insurance information."
    },
    {
        number: "02",
        title: "Browse & Choose a Doctor",
        description: "Filter specialists by specialty, availability, language, and ratings — then view full profiles before deciding."
    },
    {
        number: "03",
        title: "Pick a Date & Time",
        description: "Select an available slot from the doctor's live calendar. Choose in-person or video consultation."
    },
    {
        number: "04",
        title: "Confirm Your Booking",
        description: "Review your appointment details and submit. You'll receive an instant confirmation with a calendar reminder."
    }
];

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 bg-surface relative overflow-hidden">
             {/* Decorative Elements */}
             <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-gray-200 to-transparent"></div>
             
             <div className="const-container">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* iPhone 14 Pro Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: -30, scale: 0.96 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="order-2 lg:order-1 flex justify-center py-8"
                    >
                        <motion.div className="relative" style={{ width: '260px' }} animate={{ y: [0, -7, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
                            {/* Phone frame */}
                            <div className="relative rounded-[50px] bg-[#1c1c1e] shadow-2xl" style={{ padding: '12px', border: '2px solid #3a3a3c' }}>
                                {/* Side buttons */}
                                <div className="absolute -right-0.75 top-20 w-0.75 h-10 bg-[#3a3a3c] rounded-r-sm"></div>
                                <div className="absolute -left-0.75 top-16 w-0.75 h-6 bg-[#3a3a3c] rounded-l-sm"></div>
                                <div className="absolute -left-0.75 top-28 w-0.75 h-10 bg-[#3a3a3c] rounded-l-sm"></div>
                                <div className="absolute -left-0.75 top-40 w-0.75 h-10 bg-[#3a3a3c] rounded-l-sm"></div>
                                {/* Screen */}
                                <div className="relative rounded-[40px] overflow-hidden bg-black" style={{ aspectRatio: '9/19.5' }}>
                                    {/* Dynamic Island */}
                                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20"></div>
                                    {/* Demo video — place your video at /public/demo.mp4 */}
                                    <video className="absolute inset-0 w-full h-full object-cover z-10" autoPlay muted loop playsInline>
                                        <source src="/demo.mp4" type="video/mp4" />
                                    </video>
                                    {/* Booking UI placeholder (visible until video loads) */}
                                    <div className="absolute inset-0 flex flex-col bg-white z-0">
                                        <div className="px-4 pt-10 pb-2 flex justify-between items-center">
                                            <span className="text-[9px] font-bold text-accent">MediCare</span>
                                            <span className="text-[8px] text-gray-400">9:41 AM</span>
                                        </div>
                                        <div className="px-4 pb-2 border-b border-gray-100">
                                            <p className="text-[10px] font-bold text-gray-800">Book Appointment</p>
                                        </div>
                                        <div className="mx-3 mt-2 p-2 bg-[#f0f6ff] rounded-xl flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-[8px] font-bold shrink-0">Dr</div>
                                            <div>
                                                <p className="text-[8px] font-bold text-gray-800">Dr. Sarah A.</p>
                                                <p className="text-[7px] text-gray-500">Cardiologist · ⭐ 4.9</p>
                                            </div>
                                        </div>
                                        <div className="px-3 mt-3">
                                            <p className="text-[8px] font-semibold text-gray-700 mb-1">Select Date</p>
                                            <div className="flex gap-1">
                                                {[['Mon','18'],['Tue','19'],['Wed','20'],['Thu','21'],['Fri','22']].map(([d,n], i) => (
                                                    <div key={d} className={`flex-1 text-center py-1 rounded-lg text-[7px] ${ i === 2 ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                        <div>{d}</div>
                                                        <div className="font-bold">{n}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="px-3 mt-3">
                                            <p className="text-[8px] font-semibold text-gray-700 mb-1">Available Times</p>
                                            <div className="grid grid-cols-3 gap-1">
                                                {['9:00 AM','10:30 AM','2:00 PM','3:30 PM','4:00 PM','5:30 PM'].map((t, i) => (
                                                    <div key={t} className={`text-center py-1 rounded-lg text-[7px] ${ i === 1 ? 'bg-accent text-white' : 'border border-gray-200 text-gray-600'}`}>{t}</div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mt-auto px-3 pb-5">
                                            <div className="bg-accent text-white text-center text-[8px] font-bold py-2 rounded-xl">Confirm Appointment</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Glow */}
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-40 h-6 bg-accent/20 rounded-full blur-xl"></div>
                        </motion.div>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="order-1 lg:order-2"
                    >
                         <motion.span whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 10 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="text-accent font-bold tracking-wider text-sm uppercase mb-2 block">How It Works</motion.span>
                         <motion.h2 whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 12 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.08 }} className="text-4xl md:text-5xl font-display text-primary leading-tight mb-8">
                            Book an Appointment <br/><span className="italic text-gray-400">in Minutes</span>
                        </motion.h2>
                        
                        <div className="hidden md:block space-y-8">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    className="flex gap-6 group"
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.45, delay: index * 0.12 }}
                                >
                                    <div className="shrink-0 w-12 h-12 flex items-center justify-center border border-gray-200 text-primary font-display font-bold text-lg rounded-full group-hover:border-accent group-hover:text-accent transition-colors">
                                        {step.number}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-display font-bold text-primary mb-2">{step.title}</h4>
                                        <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                                            {step.description}
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
};

export default HowItWorks;

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CTA = () => {
    return (
        <section className="bg-[#2C2926] py-24 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <motion.div
                className="absolute -top-24 right-12 w-72 h-72 rounded-full bg-accent/20 blur-3xl"
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="flex flex-col lg:flex-row items-center justify-between gap-12 bg-white/5 p-12 rounded-3xl backdrop-blur-sm border border-white/10"
                >
                    <motion.div className="max-w-2xl" initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.12 }}>
                        {/* <p className="text-accent uppercase tracking-widest text-sm font-semibold mb-4">Start your journey</p> */}
                        <h2 className="text-4xl lg:text-5xl font-display text-white! mb-6">Ready to prioritize your health?</h2>
                        <p className="text-white/60 text-lg font-light">Join thousands of users who trust Medicare for their healthcare needs. Sign up today for free.</p>
                    </motion.div>
                    <motion.div className="flex flex-col sm:flex-row gap-4 shrink-0" initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.18 }}>
                        <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Link to="/choose-path" className="px-8 py-4 bg-white text-[#2C2926] font-medium uppercase tracking-wider text-sm rounded-xl hover:bg-accent hover:text-white transition-colors shadow-lg text-center inline-block">
                            Get Started
                            </Link>
                        </motion.div>
                        
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;



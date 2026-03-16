import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import landingpage from "../../../../public/landingpage.png"

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-surface">
            {/* Background Image for Mobile */}
            <div className="absolute inset-0 md:hidden z-0">
                <img 
                    src={landingpage} 
                    alt="Background" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Background Image / Texture for Desktop */}
            <div className="absolute inset-0 z-0 opacity-10 hidden md:block">
                 {/* Placeholder for pattern or subtle image if needed */}
                 <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-gray-200 to-transparent"></div>
            </div>

            <div className="const-container w-full grid md:grid-cols-2 gap-12 items-center relative z-10 px-6 md:px-0">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6 md:space-y-8 flex flex-col items-start md:items-start text-left"
                >
                    <span className="hidden md:inline-block py-1 px-3 border border-primary/20 rounded-full text-xs font-medium tracking-wider text-primary uppercase bg-white/90 md:bg-white backdrop-blur-sm">
                        Premium Healthcare
                    </span>
                    <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl leading-[1.1] font-display text-white md:text-primary tracking-tight">
                        Your Health, <br/>
                        <span className="text-[#3b82f6] md:text-accent italic font-serif">Elevated.</span>
                    </h1>
                    <p className="text-gray-300 md:text-gray-600 text-base md:text-xl max-w-lg leading-relaxed font-light md:font-normal">
                        Experience a new standard of medical consultation. Personalized care from world-class specialists.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 w-full sm:w-auto">
                        <Link to="/choose-path" className="btn-primary text-center shadow-lg shadow-blue-500/20 w-full sm:w-auto py-3.5 bg-blue-600 text-white border-0">
                            Start Your Journey
                        </Link>
                        <a href="#how-it-works" className="px-8 py-3.5 border border-white/20 md:border-primary text-white md:text-primary hover:bg-white/10 md:hover:bg-primary md:hover:text-white transition-colors text-center font-medium font-sans rounded-xl backdrop-blur-sm md:backdrop-blur-none bg-white/5 md:bg-transparent w-full sm:w-auto">
                            Learn More
                        </a>
                    </div>
                </motion.div>

                <motion.div  
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative h-[600px] hidden md:block"
                >
                    <div className="absolute inset-0 overflow-hidden rounded-2xl">
                        {/* Replace with actual high-quality doctor image */}
                        <img 
                            src={landingpage} 
                            alt="Premium Doctor" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;

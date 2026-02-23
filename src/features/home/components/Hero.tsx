import React from 'react';
import { Link } from 'react-router-dom';
import landingpage from "../../../../public/landingpage.png"

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-surface">
            {/* Background Image / Texture */}
            <div className="absolute inset-0 z-0 opacity-10">
                 {/* Placeholder for pattern or subtle image if needed */}
                 <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-gray-200 to-transparent"></div>
            </div>

            <div className="const-container w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
                <div className="space-y-8 animate-fade-in">
                    <span className="inline-block py-1 px-3 border border-primary/20 rounded-full text-xs font-medium tracking-wider text-primary uppercase bg-white">
                        Premium Healthcare
                    </span>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight font-display text-primary">
                        Your Health, <br/>
                        <span className="text-accent italic">Elevated.</span>
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl max-w-lg leading-relaxed">
                        Experience a new standard of medical consultation. Personalized care from world-class specialists, available at your convenience.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Link to="/register" className="btn-primary text-center">
                            Start Your Journey
                        </Link>
                        <a href="#how-it-works" className="px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-colors text-center font-medium font-sans">
                            Learn More
                        </a>
                    </div>
                    

                </div>

                <div className="relative h-[600px] hidden md:block animate-slide-up">
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Replace with actual high-quality doctor image */}
                        <img 
                            src={landingpage} 
                            alt="Premium Doctor" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                   
                </div>
            </div>
        </section>
    );
};

export default Hero;

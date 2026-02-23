import React from 'react';
import { Link } from 'react-router-dom';

const CTA = () => {
    return (
        <section className="bg-[#2C2926] py-24 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 bg-white/5 p-12 rounded-3xl backdrop-blur-sm border border-white/10">
                    <div className="max-w-2xl">
                        {/* <p className="text-accent uppercase tracking-widest text-sm font-semibold mb-4">Start your journey</p> */}
                        <h2 className="text-4xl lg:text-5xl font-display !text-white mb-6">Ready to prioritize your health?</h2>
                        <p className="text-white/60 text-lg font-light">Join thousands of users who trust Medicare for their healthcare needs. Sign up today for free.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                        <Link to="/register" className="px-8 py-4 bg-white text-[#2C2926] font-medium uppercase tracking-wider text-sm rounded-lg hover:bg-accent hover:text-white transition-colors shadow-lg text-center">
                            Get Started
                        </Link>
                        
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;



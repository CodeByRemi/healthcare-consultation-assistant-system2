const steps = [
    {
        number: "01",
        title: "Create Profile",
        description: "Register in minutes and build your comprehensive health history."
    },
    {
        number: "02",
        title: "Select Specialist",
        description: "Browse our directory of elite medical professionals and choose your expert."
    },
    {
        number: "03",
        title: "Consultation",
        description: "Connect via high-definition video for a thorough medical assessment."
    },
    {
        number: "04",
        title: "Care Plan",
        description: "Receive a personalized treatment plan and follow-up schedule."
    }
];

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 bg-surface relative overflow-hidden">
             {/* Decorative Elements */}
             <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
             
             <div className="const-container">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1">
                        <div className="relative">
                            <div className="absolute -left-4 -top-4 w-24 h-24 border-t-2 border-l-2 border-primary/20"></div>
                            <img 
                                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1470&auto=format&fit=crop" 
                                alt="Mobile Healthcare App" 
                                className="w-full h-auto shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 ease-in-out rounded-xl"
                            />
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 border-b-2 border-r-2 border-primary/20"></div>
                        </div>
                    </div>
                    
                    <div className="order-1 lg:order-2">
                         <span className="text-accent font-bold tracking-wider text-sm uppercase mb-2 block">Process</span>
                         <h2 className="text-4xl md:text-5xl font-display text-primary leading-tight mb-8">
                            Seamless Path to <br/><span className="italic text-gray-400">Recovery</span>
                        </h2>
                        
                        <div className="space-y-8">
                            {steps.map((step, index) => (
                                <div key={index} className="flex gap-6 group">
                                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-gray-200 text-primary font-display font-bold text-lg rounded-full group-hover:border-accent group-hover:text-accent transition-colors">
                                        {step.number}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-display font-bold text-primary mb-2">{step.title}</h4>
                                        <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
             </div>
        </section>
    );
};

export default HowItWorks;

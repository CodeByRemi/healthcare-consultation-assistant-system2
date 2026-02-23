import React from 'react';
import { FaUserMd, FaStethoscope, FaHeartbeat, FaCalendarCheck } from 'react-icons/fa';

const services = [
    {
        icon: <FaUserMd size={28} />,
        title: "Top Specialists",
        description: "Connect with world-renowned doctors across various disciplines for expert opinions."
    },
    {
        icon: <FaStethoscope size={28} />,
        title: "Holistic Care",
        description: "Comprehensive diagnostics and treatment plans that consider your whole well-being."
    },
    {
        icon: <FaHeartbeat size={28} />,
        title: "24/7 Monitoring",
        description: "Advanced remote health monitoring systems to keep track of your vitals anytime."
    },
    {
        icon: <FaCalendarCheck size={28} />,
        title: "Priority Booking",
        description: "Skip the waiting room with our exclusive priority appointment scheduling system."
    }
];

const Services = () => {
    return (
        <section id="services" className="py-24 bg-white">
            <div className="const-container">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <div className="max-w-xl">
                        <span className="text-accent font-bold tracking-wider text-sm uppercase mb-2 block">Our Expertise</span>
                        <h2 className="text-4xl md:text-5xl font-display text-primary leading-tight">
                            Excellence in <br/><span className="italic text-gray-400">Medical Care</span>
                        </h2>
                    </div>
                    <p className="text-gray-500 max-w-sm mt-6 md:mt-0 text-right md:text-left">
                        We combine cutting-edge technology with compassionate care to deliver a healthcare experience like no other.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="group p-8 border border-gray-100 bg-surface hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 rounded-sm">
                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-primary mb-6 group-hover:bg-accent group-hover:text-white transition-colors shadow-sm border border-gray-50">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-display font-bold mb-3 text-primary group-hover:text-accent transition-colors">{service.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {service.description}
                            </p>
                            <div className="mt-6 w-8 h-px bg-gray-200 group-hover:w-full group-hover:bg-accent transition-all duration-500"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;

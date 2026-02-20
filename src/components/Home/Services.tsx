export default function Services() {
  return (
   <section className="py-24 bg-white" id="services">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div className="max-w-xl">
              <h2 className="text-5xl font-serif mb-6">Complete Healthcare <br /><span className="italic text-gray-400">Solutions</span></h2>
              <p className="text-gray-500">Everything you need to manage your health in one secure, architecturally sound platform.</p>
            </div>
            <a className="text-xs font-bold uppercase tracking-widest border-b-2 border-[#1A1A1A] pb-1 mt-8 md:mt-0" href="#">View All Services</a>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="p-10 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.05),0_5px_15px_rgba(0,0,0,0.02)] transition-all group">
              <div className="w-12 h-12 glass-effect rounded-xl flex items-center justify-center mb-10 shadow-sm">
                <svg className="w-5 h-5 text-[#0A6ED1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </div>
              <h3 className="text-2xl font-serif mb-4">AI Health Consultation</h3>
              <p className="text-gray-500 text-sm mb-10 leading-relaxed">Preliminary diagnosis powered by advanced medical algorithms and neural networks.</p>
              <a className="text-xs font-bold uppercase tracking-widest group-hover:text-[#0A6ED1] transition-colors flex items-center" href="#">
                Learn More <span className="ml-2">→</span>
              </a>
            </div>

            {/* Service 2 */}
            <div className="p-10 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.05),0_5px_15px_rgba(0,0,0,0.02)] transition-all group">
              <div className="w-12 h-12 glass-effect rounded-xl flex items-center justify-center mb-10 shadow-sm">
                <svg className="w-5 h-5 text-[#2ECC71]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </div>
              <h3 className="text-2xl font-serif mb-4">Online Booking</h3>
              <p className="text-gray-500 text-sm mb-10 leading-relaxed">Real-time availability without the wait. Seamless architectural scheduling for your life.</p>
              <a className="text-xs font-bold uppercase tracking-widest group-hover:text-[#0A6ED1] transition-colors flex items-center" href="#">
                Book Now <span className="ml-2">→</span>
              </a>
            </div>

            {/* Service 3 */}
            <div className="p-10 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.05),0_5px_15px_rgba(0,0,0,0.02)] transition-all group">
              <div className="w-12 h-12 glass-effect rounded-xl flex items-center justify-center mb-10 shadow-sm">
                <svg className="w-5 h-5 text-[#1A1A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
              </div>
              <h3 className="text-2xl font-serif mb-4">Secure Records</h3>
              <p className="text-gray-500 text-sm mb-10 leading-relaxed">Encrypted, HIPAA-compliant vault designed with architectural-grade security layers.</p>
              <a className="text-xs font-bold uppercase tracking-widest group-hover:text-[#0A6ED1] transition-colors flex items-center" href="#">
                Access Vault <span className="ml-2">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
  );
}
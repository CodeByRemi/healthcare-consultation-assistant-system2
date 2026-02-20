export default function CTA() {
  return (
    <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#1A1A1A] rounded-4xl p-12 lg:p-24 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between">
              <div className="max-w-2xl mb-12 lg:mb-0">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#0A6ED1] mb-4">Start Your Journey</p>
                <h2 className="text-4xl lg:text-6xl font-serif text-white mb-8">Ready to prioritize your health?</h2>
                <p className="text-gray-400 text-lg">Join thousands of users who trust Medicare for their healthcare needs. Sign up today for free.</p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="px-10 py-5 bg-white text-[#1A1A1A] text-xs font-bold uppercase tracking-widest hover:bg-[#0A6ED1] hover:text-white transition-all">Get Started</button>
                <button className="px-10 py-5 border border-gray-600 text-white text-xs font-bold uppercase tracking-widest hover:border-white transition-all">Download App</button>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
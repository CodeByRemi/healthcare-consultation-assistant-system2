import { useNavigate } from "react-router-dom";

export default function DoctorRegistrationStep2() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#121212] text-slate-100 min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-[#2f3829] bg-[#121212]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#58b814] p-1.5 rounded-lg">
              <span className="material-symbols-outlined text-[#121212] text-xl font-bold">medical_services</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">Practitioner Enrollment</h2>
          </div>
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors" onClick={() => navigate(-1)} aria-label="Close">
            <span className="material-symbols-outlined text-slate-400">close</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="grow flex flex-col items-center py-10 px-6">
        <div className="w-full max-w-2xl flex flex-col gap-10">
          {/* Progress */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[#58b814] font-medium text-sm tracking-wide uppercase">Enrollment Progress</p>
                <h3 className="text-2xl font-semibold">Step 2 of 3</h3>
              </div>
              <span className="text-slate-400 text-sm font-medium">66% Complete</span>
            </div>
            <div className="h-1.5 w-full bg-[#2f3829] rounded-full overflow-hidden">
              <div className="h-full bg-[#58b814] transition-all duration-500" style={{ width: "66%" }} />
            </div>
          </div>

          {/* Content Header */}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-100 italic">Professional Experience</h1>
            <p className="text-slate-400 text-lg">Provide details regarding your clinical history, education, and scholarly achievements.</p>
          </div>

          {/* Form */}
          <form className="space-y-8">
            {/* Hospital Affiliations */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-slate-200">Previous Hospital Affiliations</label>
              <div className="relative">
                <div className="min-h-14 p-2 flex flex-wrap gap-2 rounded-lg border border-[#2f3829] bg-[#1E1E1E] focus-within:border-[#58b814] transition-colors">
                  {/* Tags */}
                  <div className="flex items-center gap-1.5 bg-[#58b814]/20 text-[#58b814] px-3 py-1.5 rounded-md border border-[#58b814]/30 text-sm font-medium">
                    <span className="material-symbols-outlined text-base">domain</span>
                    Mayo Clinic
                    <button type="button" className="material-symbols-outlined text-xs hover:text-white transition-colors">close</button>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#58b814]/20 text-[#58b814] px-3 py-1.5 rounded-md border border-[#58b814]/30 text-sm font-medium">
                    <span className="material-symbols-outlined text-base">domain</span>
                    Johns Hopkins
                    <button type="button" className="material-symbols-outlined text-xs hover:text-white transition-colors">close</button>
                  </div>
                  {/* Input */}
                  <input type="text" placeholder="Add more institutions..." className="grow bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 text-sm min-w-50" />
                </div>
              </div>
              <p className="text-slate-500 text-xs italic">Start typing to search and select institutions where you have held privileges.</p>
            </div>

            {/* Split Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-lg font-medium text-slate-200">Years of Specialized Practice</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500">schedule</span>
                  <input type="number" defaultValue={12} className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-[#2f3829] bg-[#1E1E1E] focus:border-[#58b814] focus:ring-1 focus:ring-[#58b814] text-slate-100" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-lg font-medium text-slate-200">Medical School / University</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500">school</span>
                  <input type="text" placeholder="e.g. Stanford University" className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-[#2f3829] bg-[#1E1E1E] focus:border-[#58b814] focus:ring-1 focus:ring-[#58b814] text-slate-100" />
                </div>
              </div>
            </div>

            {/* Scholarly Work */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-lg font-medium text-slate-200">Key Publications & Certifications</label>
                <button type="button" className="flex items-center gap-1 text-[#58b814] hover:text-[#58b814]/80 text-sm font-semibold transition-colors">
                  <span className="material-symbols-outlined text-lg">add_circle</span> Add Entry
                </button>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-[#2f3829] bg-[#1E1E1E]/50 flex items-start gap-4">
                  <div className="mt-1 bg-[#2f3829] p-2 rounded">
                    <span className="material-symbols-outlined text-slate-400">article</span>
                  </div>
                  <div className="grow">
                    <h4 className="font-bold text-slate-200">American Board of Internal Medicine (ABIM)</h4>
                    <p className="text-sm text-slate-500">Board Certification • Issued 2018</p>
                  </div>
                  <button type="button" className="material-symbols-outlined text-slate-500 hover:text-red-400 transition-colors">delete</button>
                </div>
                <div className="p-4 rounded-lg border border-[#2f3829] bg-[#1E1E1E]/50 flex items-start gap-4">
                  <div className="mt-1 bg-[#2f3829] p-2 rounded">
                    <span className="material-symbols-outlined text-slate-400">history_edu</span>
                  </div>
                  <div className="grow">
                    <h4 className="font-bold text-slate-200">Advances in Neurological Treatment Protocols</h4>
                    <p className="text-sm text-slate-500">Journal Publication • New England Journal of Medicine (2022)</p>
                  </div>
                  <button type="button" className="material-symbols-outlined text-slate-500 hover:text-red-400 transition-colors">delete</button>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-slate-200">Additional Professional Honors (Optional)</label>
              <textarea rows={4} placeholder="Describe any additional awards or recognitions..." className="w-full p-4 rounded-lg border border-[#2f3829] bg-[#1E1E1E] focus:border-[#58b814] focus:ring-1 focus:ring-[#58b814] text-slate-100 resize-none" />
            </div>
          </form>
        </div>
      </main>

      {/* Footer nav */}
      <footer className="border-t border-[#2f3829] bg-[#1E1E1E]/95 backdrop-blur-sm mt-auto sticky bottom-0">
        <div className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-6 py-3 rounded-lg border border-[#2f3829] text-slate-300 font-semibold hover:bg-white/5 transition-all">
            <span className="material-symbols-outlined">arrow_back</span>
            Back
          </button>
          <div className="flex gap-4">
            <button className="hidden md:block px-6 py-3 text-slate-400 font-semibold hover:text-white transition-colors">
              Save Progress
            </button>
            <button onClick={() => navigate('/doctor/step-3')} className="flex items-center gap-2 px-8 py-3 rounded-lg bg-[#58b814] text-[#121212] font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#58b814]/10">
              Next Step
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

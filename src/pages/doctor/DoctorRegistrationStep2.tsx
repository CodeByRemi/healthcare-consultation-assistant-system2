import { useState } from 'react';
import { 
  FaHospital as Hospital, 
  FaUniversity as University, 
  FaAward as Award, 
  FaArrowRight as ArrowRight, 
  FaArrowLeft as ArrowLeft,
  FaCheckCircle as CheckCircle2,
  FaBriefcaseMedical as Briefcase
} from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from "../../assets/patientreg.png";
import { toast } from 'sonner';

export default function DoctorRegistrationStep2() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    hospital: '',
    experience: '',
    school: '',
    certifications: '',
    honors: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.hospital.trim()) newErrors.hospital = 'Hospital/Clinic name is required';
    if (!formData.experience) {
      newErrors.experience = 'Years of experience is required';
    } else if (parseInt(formData.experience) < 0) {
      newErrors.experience = 'Experience cannot be negative';
    }
    if (!formData.school.trim()) newErrors.school = 'Medical School is required';
    if (!formData.certifications.trim()) newErrors.certifications = 'Certifications & Publications are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateForm()) {
      navigate('/doctor/step-3', { state: { prevData: { ...location.state?.prevData, ...formData } } });
    } else {
      toast.error("Please fill in all required fields correctly.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-['Manrope'] bg-slate-50">
      {/* Left Panel - Branding & Info */}
      <div className="lg:w-1/2 bg-[#0da540] p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-12 group transition-all duration-300 ease-in-out hover:translate-x-1">
            <div className="w-10 h-10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-inner group-hover:bg-white/20 transition-all">
              <img src={logo} alt="Logo" className="w-6 h-6 object-contain hue-rotate-0 brightness-0 invert" />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">Medicare</span>
          </Link>
          
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#0A6ED1] animate-pulse"></span>
              Step 2 of 4
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-['Newsreader'] font-medium text-white mb-6 leading-tight">
              Build your <span className="italic text-[#8fcfa7]">professional profile</span>.
            </h1>
            
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Showcase your expertise, experience, and certifications to build trust with new patients.
            </p>

            <div className="space-y-4">
              {[
                "Verified credential badge",
                "Detailed practice history",
                "Specialty highlighting"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-white/90 group">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 pt-8 border-t border-white/10 flex items-center justify-between text-white/60 text-sm">
          <p>© {new Date().getFullYear()} Medicare Inc.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Help Center</a>
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-lg bg-white p-8 lg:p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-3xl font-bold text-slate-900 font-['Newsreader']">Professional Details</h2>
              <Link to="/doctor" className="text-sm text-slate-400 hover:text-[#0da540] transition-colors">
                Back to Step 1
              </Link>
            </div>
            <p className="text-slate-500">
               Please provide your medical background and experience.
            </p>
          </div>

          <form className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Hospital className="w-4 h-4 text-[#0da540]" />
                Current Hospital / Clinic
              </label>
              <input 
                type="text"
                name="hospital"
                placeholder="e.g. Mayo Clinic, Johns Hopkins..."
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:bg-white focus:border-[#0da540] focus:ring-4 focus:ring-[#0da540]/10 transition-all outline-none text-slate-800 placeholder:text-slate-400 ${errors.hospital ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                onChange={handleChange}
                value={formData.hospital}
              />
              {errors.hospital && <p className="text-red-500 text-xs mt-1 ml-1">{errors.hospital}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#0da540]" />
                  Years of Experience
                </label>
                <input 
                  type="number"
                  name="experience"
                  placeholder="e.g. 12"
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:bg-white focus:border-[#0da540] focus:ring-4 focus:ring-[#0da540]/10 transition-all outline-none text-slate-800 placeholder:text-slate-400 ${errors.experience ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                  onChange={handleChange}
                  value={formData.experience}
                />
                {errors.experience && <p className="text-red-500 text-xs mt-1 ml-1">{errors.experience}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <University className="w-4 h-4 text-[#0da540]" />
                  Medical School
                </label>
                <input 
                  type="text"
                  name="school"
                  placeholder="e.g. Stanford University"
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:bg-white focus:border-[#0da540] focus:ring-4 focus:ring-[#0da540]/10 transition-all outline-none text-slate-800 placeholder:text-slate-400 ${errors.school ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                  onChange={handleChange}
                  value={formData.school}
                />
                {errors.school && <p className="text-red-500 text-xs mt-1 ml-1">{errors.school}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#0da540]" />
                Certifications & Publications
              </label>
              <textarea 
                name="certifications"
                rows={3}
                placeholder="List board certifications, fellowships, and key publications..."
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:bg-white focus:border-[#0da540] focus:ring-4 focus:ring-[#0da540]/10 transition-all outline-none text-slate-800 placeholder:text-slate-400 resize-none ${errors.certifications ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                onChange={handleChange}
                value={formData.certifications}
              />
              {errors.certifications && <p className="text-red-500 text-xs mt-1 ml-1">{errors.certifications}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#0da540]" />
                Honors & Awards (Optional)
              </label>
              <textarea 
                name="honors"
                rows={2}
                placeholder="Recent awards or recognitions..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0da540] focus:ring-4 focus:ring-[#0da540]/10 transition-all outline-none text-slate-800 placeholder:text-slate-400 resize-none"
                onChange={handleChange}
                value={formData.honors}
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button 
                type="button"
                onClick={() => navigate(-1)}
                className="w-1/3 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group text-base"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
              
              <button 
                type="button"
                onClick={handleNextStep}
                className="w-2/3 py-4 bg-[#0da540] hover:bg-[#098734] active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-[#0da540]/20 transition-all duration-200 flex items-center justify-center gap-2 group text-base"
              >
                Next Step
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Information provided helps us verify your credentials faster.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

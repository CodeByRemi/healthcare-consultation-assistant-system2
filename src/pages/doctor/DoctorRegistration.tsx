import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser as User, 
  FaEnvelope as Mail, 
  FaLock as Lock, 
  FaStethoscope as Stethoscope, 
  FaBuilding as Building2, 
  FaArrowRight as ArrowRight, 
  FaShieldAlt as ShieldCheck,
  FaCheckCircle as CheckCircle2
} from 'react-icons/fa';
import { Link,useNavigate } from 'react-router-dom';
import logo from "../../assets/patientreg.png";
import { toast } from 'sonner';

export default function DoctorRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    specialty: '',
    licenseNumber: '',
    terms: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Handle checkbox differently
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData({
      ...formData,
      [name]: val
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
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.specialty) newErrors.specialty = 'Specialty is required';
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'Medical License Number is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.terms) newErrors.terms = 'You must agree to the Terms and Privacy Policy';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateForm()) {
      navigate('/doctor/step-2', { state: { prevData: formData } });
    } else {
      toast.error("Please fill in all required fields correctly.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-['Manrope'] bg-slate-50">
      {/* Left Panel - Branding & Info */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-[#0da540] p-8 lg:p-16 flex-col justify-between relative overflow-hidden"
      >
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2864&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-12 group transition-all duration-300 ease-in-out hover:translate-x-1">
            <div className="w-10 h-10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-inner group-hover:bg-white/20 transition-all">
              <img src={logo} alt="Logo" className="w-6 h-6 object-contain " />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">Medicare</span>
          </Link>
          
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#0A6ED1] animate-pulse"></span>
              Join Practitioner Network
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-['Newsreader'] font-medium text-white mb-6 leading-tight">
              Elevate your <span className="italic text-[#8fcfa7]">clinical practice</span> with modern tools.
            </h1>
            
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Join thousands of healthcare professionals using our platform to streamline consultations and improve patient outcomes.
            </p>

            <div className="space-y-4">
              {[
                "Priority listing in patient searches",
                "Advanced scheduling & tele-health tools",
                "Secure HD video consultations"
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
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </motion.div>

      {/* Right Panel - Registration Form */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto"
      >
        <div className="w-full max-w-lg bg-white p-8 lg:p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 font-['Newsreader']">Create Doctor Account</h2>
            <p className="text-slate-500">
              Already have an account?{' '}
              <Link to="/doctor/login" className="text-[#0da540] font-semibold hover:text-[#087a2f] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-[#0da540] after:scale-x-0 hover:after:scale-x-100 after:transition-transform">
                Sign in
              </Link>
            </p>
          </div>

          <form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#0da540]" />
                  Full Name
                </label>
                <input 
                  type="text"
                  name="fullName"
                  placeholder="Dr. John Doe"
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:bg-white focus:border-[#0da540] focus:ring-4 focus:ring-[#0da540]/10 transition-all outline-none text-slate-800 placeholder:text-slate-400 ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setFormData({ ...formData, [name]: value });
                    if (errors[name]) setErrors({ ...errors, [name]: '' });
                  }}
                  value={formData.fullName}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.fullName}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-[#0da540]" />
                  Specialty
                </label>
                <select 
                  name="specialty"
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:bg-white focus:border-[#0da540] focus:ring-4 focus:ring-[#0da540]/10 transition-all outline-none text-slate-800 ${errors.specialty ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setFormData({ ...formData, [name]: value });
                    if (errors[name]) setErrors({ ...errors, [name]: '' });
                  }}
                  value={formData.specialty}
                >
                  <option value="">Select Specialty</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="dermatology">Dermatology</option>
                  <option value="neurology">Neurology</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="psychiatry">Psychiatry</option>
                  <option value="general">General Practice</option>
                </select>
                {errors.specialty && <p className="text-red-500 text-xs mt-1 ml-1">{errors.specialty}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#0da540]" />
                Medical License Number
              </label>
              <div className="relative">
                <input 
                  type="text"
                  name="licenseNumber"
                  placeholder="e.g. MED-12345-KY"
                  className={`w-full pl-4 pr-10 py-3 bg-slate-50 border rounded-xl focus:bg-white focus:border-[#0da540] focus:ring-4 focus:ring-[#0da540]/10 transition-all outline-none text-slate-800 placeholder:text-slate-400 ${errors.licenseNumber ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                  onChange={handleChange}
                  value={formData.licenseNumber}
                />
                <ShieldCheck className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.licenseNumber && <p className="text-red-500 text-xs mt-1 ml-1">{errors.licenseNumber}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0da540]" />
                Email Address
              </label>
              <input 
                type="email"
                name="email"
                placeholder="doctor@hospital.com"
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:bg-white focus:border-[#0da540] focus:ring-4 focus:ring-[#0da540]/10 transition-all outline-none text-slate-800 placeholder:text-slate-400 ${errors.email ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                onChange={handleChange}
                value={formData.email}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#0da540]" />
                Password
              </label>
              <input 
                type="password"
                name="password"
                placeholder="••••••••"
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:bg-white focus:border-[#0da540] focus:ring-4 focus:ring-[#0da540]/10 transition-all outline-none text-slate-800 placeholder:text-slate-400 ${errors.password ? 'border-red-500 bg-red-50' : 'border-slate-200'}`}
                onChange={handleChange}
                value={formData.password}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  name="terms"
                  id="terms" 
                  checked={formData.terms}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-slate-300 text-[#0da540] focus:ring-[#0da540] transition-colors cursor-pointer"
                />
                <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer select-none">
                  I agree to the <a href="#" className="text-[#0da540] hover:underline font-medium">Terms of Service</a> & <a href="#" className="text-[#0da540] hover:underline font-medium">Privacy Policy</a>
                </label>
              </div>
              {errors.terms && <p className="text-red-500 text-xs ml-1">{errors.terms}</p>}
            </div>

            <button 
              type="button"
              onClick={handleNextStep}
              className="w-full py-4 bg-[#0da540] hover:bg-[#098734] active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-[#0da540]/20 transition-all duration-200 flex items-center justify-center gap-2 group mt-4 text-base cursor-pointer"
            >
              Continue to Professional Details
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Secure specialized enrollment for verified medical practitioners only.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUserMd, 
  FaLock, 
  FaArrowRight, 
  FaCheckCircle 
} from 'react-icons/fa';
import logo from "../../assets/patientreg.png";
import { toast } from 'sonner';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function DoctorLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Check if suspended
      const doctorDocRef = doc(db, "doctors", user.uid);
      const doctorDoc = await getDoc(doctorDocRef);

      if (doctorDoc.exists()) {
        const doctorData = doctorDoc.data();
        if (doctorData.verificationStatus === "Suspended") {
          await signOut(auth);
          toast.error("Account Suspended", {
            description: "Your account effectively has been suspended by the administrator. Please contact support."
          });
          setIsLoading(false);
          return;
        }
      }

      toast.success('Welcome back, Doctor!');
      navigate('/doctor/dashboard');
    } catch (error: unknown) {
      console.error("Login error:", error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorCode = (error as any).code;
      let errorMessage = "Invalid credentials.";
      
      if (errorCode === 'auth/user-not-found') errorMessage = "No account found with this email.";
      if (errorCode === 'auth/wrong-password') errorMessage = "Incorrect password.";
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-['Manrope'] bg-slate-50">
      {/* Left Panel - Branding & Info */}
      <div className="lg:w-1/2 bg-[#0da540] p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2864&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-12 group transition-all duration-300 ease-in-out hover:translate-x-1">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-inner group-hover:bg-white/20 transition-all">
              <img src={logo} alt="Logo" className="w-6 h-6 object-contain " />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">Medicare</span>
          </Link>
          
          <div className="max-w-md">            
            <h1 className="text-4xl lg:text-5xl font-['Newsreader'] font-medium text-white mb-6 leading-tight">
              Welcome back, <br/>
              <span className="italic text-[#8fcfa7]">Doctor.</span>
            </h1>
            
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Access your practice dashboard to manage appointments, review patient records, and conduct consultations.
            </p>

            <div className="space-y-4">
              {[
                "Secure HIPAA-compliant access",
                "Real-time appointment updates",
                "Integrated patient records"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-white/90 group">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                    <FaCheckCircle className="w-3.5 h-3.5" />
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
            <a href="#" className="hover:text-white transition-colors">Only for Providers</a>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto w-full">
        <div className="w-full max-w-md bg-white p-8 lg:p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 font-['Newsreader']">Practitioner Login</h2>
            <p className="text-slate-500">
              New here?{' '}
              <Link to="/doctor" className="text-[#0da540] font-semibold hover:text-[#087a2f] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-[#0da540] after:scale-x-0 hover:after:scale-x-100 after:transition-transform">
                Apply to join network
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FaUserMd className="w-4 h-4 text-[#0da540]" />
                Email Address
              </label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="doctor@hospital.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0da540] focus:ring-4 focus:ring-[#0da540]/10 transition-all outline-none text-slate-800 placeholder:text-slate-400"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <FaLock className="w-4 h-4 text-[#0da540]" />
                  Password
                </label>
                <Link to="/doctor/forgot-password" className="text-xs font-medium text-[#0da540] hover:underline">Forgot?</Link>
              </div>
              <input 
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0da540] focus:ring-4 focus:ring-[#0da540]/10 transition-all outline-none text-slate-800 placeholder:text-slate-400"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-[#0da540] hover:bg-[#098734] active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-[#0da540]/20 transition-all duration-200 flex items-center justify-center gap-2 group mt-4 text-base disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying Credentials...' : 'Access Dashboard'}
              {!isLoading && <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <button onClick={() => navigate('/choose-path')} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
              Not a provider? <span className="underline">Switch portal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

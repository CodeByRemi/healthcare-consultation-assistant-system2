import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaLock, 
  FaArrowRight, 
  FaCheckCircle,
  FaUserShield
} from 'react-icons/fa';
import { toast } from 'sonner';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import logo from "../../assets/patientreg.png";

export default function AdminLogin() {
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
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast.success('Welcome back, Admin!');
      navigate('/admin'); // Redirect to Admin Dashboard
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
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 p-8 lg:p-16 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=2864&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-12 group transition-all duration-300 ease-in-out hover:translate-x-1">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-inner group-hover:bg-white/20 transition-all">
              <img src={logo} alt="Medicare" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">Medicare Admin</span>
          </Link>
          
          <div className="max-w-md">            
            <h1 className="text-4xl lg:text-5xl font-['Newsreader'] font-medium text-white mb-6 leading-tight">
              System Administration <br/>
              <span className="italic text-blue-200">Portal.</span>
            </h1>
            
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Secure console for managing healthcare providers, patient records, and platform configurations.
            </p>

            <div className="space-y-4">
              {[
                "Manage Doctor Credentials & Verification",
                "Oversee Patient Records",
                "System-wide Settings & Configuration"
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
            <span className="hover:text-white transition-colors cursor-pointer">Admin Access Only</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="min-h-screen lg:min-h-0 w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-16">
        <div className="max-w-md w-full bg-transparent lg:bg-white p-0 lg:p-8 rounded-none lg:rounded-2xl shadow-none lg:shadow-xl border-0 lg:border lg:border-slate-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
              <img src={logo} alt="Medicare" className="w-8 h-8 object-contain" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Admin Login</h2>
            <p className="text-slate-500 mt-2">Please sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <FaUserShield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-slate-700">Password</label>
              </div>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-xl shadow-lg shadow-blue-100 hover:shadow-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Unauthorized access is strictly prohibited. <br/>
            <Link to="/" className="text-slate-900 font-semibold hover:underline mt-2 inline-block">
              Return to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

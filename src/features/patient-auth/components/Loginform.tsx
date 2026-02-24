import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import { toast } from "sonner";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebase";

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Attempting sign in with:", formData.email);
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("Sign in successful!");
      toast.success("Welcome back!");
      
      // Delay navigation slightly to ensure state updates
      setTimeout(() => {
        console.log("Navigating to dashboard...");
        navigate("/patient/dashboard", { replace: true }); 
      }, 100);
      
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center font-['Manrope'] bg-white">
      <div className="max-w-md mx-auto w-full">
        <h1 className="text-4xl font-['Newsreader'] font-medium text-slate-900 mb-2">
          Welcome back
        </h1>
        <p className="text-slate-500 mb-8 text-lg">
          Sign in to access your patient dashboard
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FaEnvelope className="w-4 h-4 text-[#0A6ED1]" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0A6ED1] focus:ring-4 focus:ring-[#0A6ED1]/10 transition-all outline-none text-slate-800 placeholder:text-slate-400"
              required
            />
          </div>

          <div className="space-y-1.5">
             <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FaLock className="w-4 h-4 text-[#0A6ED1]" />
                Password
              </label>
              <Link to="/patient/forgot-password" className="text-xs font-medium text-[#0A6ED1] hover:underline">Forgot password?</Link>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0A6ED1] focus:ring-4 focus:ring-[#0A6ED1]/10 transition-all outline-none text-slate-800 placeholder:text-slate-400"
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 text-[#0A6ED1] border-slate-300 rounded focus:ring-[#0A6ED1] cursor-pointer"
            />
            <label htmlFor="remember" className="bg-transparent text-sm font-medium text-slate-600 cursor-pointer select-none">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#0A6ED1] hover:bg-[#0860b8] active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-[#0A6ED1]/20 transition-all duration-200 flex items-center justify-center gap-2 group mt-4 text-base disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing In..." : "Access Account"}
            {!isSubmitting && <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-500">
            Don't have an account?{" "}
            <Link to="/patient-reg" className="text-[#0A6ED1] font-bold hover:underline">
              Create free account
            </Link>
          </p>
          <div className="mt-4">
            <button 
              onClick={() => navigate('/choose-path')} 
              className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors"
            >
              ← Back to role selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

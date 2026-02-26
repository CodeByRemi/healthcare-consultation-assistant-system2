import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaEnvelope, FaUserMd } from "react-icons/fa";
import { toast } from "sonner";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import logo from "../../../assets/patientreg.png";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    setIsSubmitting(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setIsEmailSent(true);
      toast.success("Reset email sent successfully.");
    } catch (error: unknown) {
      console.error("Forgot password error:", error);
      const errorMessage = (error as { code?: string }).code === 'auth/user-not-found'
        ? "No account found with this email."
        : "Unable to send reset email. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row font-['Manrope'] bg-slate-50">
        <div className="lg:w-1/2 bg-[#0da540] p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2864&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-12 group transition-all duration-300 ease-in-out hover:translate-x-1">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-inner group-hover:bg-white/20 transition-all">
                <img src={logo} alt="Logo" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-white font-bold text-2xl tracking-tight">Medicare</span>
            </Link>
            <div className="max-w-md">
              <h1 className="text-4xl lg:text-5xl font-['Newsreader'] font-medium text-white mb-6 leading-tight">
                Recover access, <br />
                <span className="italic text-[#8fcfa7]">Doctor.</span>
              </h1>
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                Check your inbox for the password reset instructions.
              </p>
            </div>
          </div>
          <div className="relative z-10 mt-12 pt-8 border-t border-white/10 text-white/60 text-sm">
            <p>© {new Date().getFullYear()} Medicare Inc.</p>
          </div>
        </div>

        <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto w-full">
          <main className="w-full max-w-md bg-white p-8 lg:p-10 rounded-3xl shadow-xl border border-slate-100 text-center">
            <div className="w-20 h-20 bg-[#0da540]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaEnvelope className="w-10 h-10 text-[#0da540]" />
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-4 font-['Newsreader']">Check your email</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              We've sent password reset instructions to <span className="font-semibold text-slate-800">{email}</span>
            </p>

            <button 
              onClick={() => navigate("/doctor/login")}
              className="w-full py-4 bg-[#0da540] hover:bg-[#098734] active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-[#0da540]/20 transition-all duration-200 mb-6"
            >
              Back to Login
            </button>
            
            <button 
              onClick={() => setIsEmailSent(false)}
              className="text-[#0da540] font-semibold hover:underline text-sm"
            >
              Try another email address
            </button>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-['Manrope'] bg-slate-50">
      <div className="lg:w-1/2 bg-[#0da540] p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2864&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-12 group transition-all duration-300 ease-in-out hover:translate-x-1">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-inner group-hover:bg-white/20 transition-all">
              <img src={logo} alt="Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">Medicare</span>
          </Link>

          <div className="max-w-md">
            <h1 className="text-4xl lg:text-5xl font-['Newsreader'] font-medium text-white mb-6 leading-tight">
              Recover access, <br />
              <span className="italic text-[#8fcfa7]">Doctor.</span>
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Enter your account email to receive a secure password reset link.
            </p>

            <div className="space-y-4 text-white/90">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <FaUserMd className="w-3.5 h-3.5" />
                </div>
                <span>Provider account recovery</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <FaEnvelope className="w-3.5 h-3.5" />
                </div>
                <span>Reset link sent to verified email</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 pt-8 border-t border-white/10 text-white/60 text-sm">
          <p>© {new Date().getFullYear()} Medicare Inc.</p>
        </div>
      </div>

      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto w-full">
        <main className="w-full max-w-md bg-white p-8 lg:p-10 rounded-3xl shadow-xl border border-slate-100">
          <h2 className="text-3xl font-bold text-slate-900 mb-2 font-['Newsreader']">Forgot Password</h2>
          <p className="text-slate-500 mb-8">We’ll email you a link to reset your doctor account password.</p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2" htmlFor="doctor-reset-email">
                <FaEnvelope className="w-4 h-4 text-[#0da540]" />
                Email Address
              </label>
              <input
                id="doctor-reset-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="doctor@hospital.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0da540] focus:ring-4 focus:ring-[#0da540]/10 transition-all outline-none text-slate-800 placeholder:text-slate-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#0da540] hover:bg-[#098734] active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-[#0da540]/20 transition-all duration-200 flex items-center justify-center gap-2 group text-base disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending Reset Link..." : "Send Reset Link"}
              {!isSubmitting && <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => navigate("/doctor/login")}
              className="inline-flex items-center gap-2 text-sm text-[#0da540] font-semibold hover:underline"
            >
              <FaArrowLeft className="w-3 h-3" />
              Back to Login
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

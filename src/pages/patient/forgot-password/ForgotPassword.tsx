import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaEnvelope } from "react-icons/fa";
import { toast } from "sonner";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import AuthLayout from "../../../features/patient-auth/components/AuthLayout";
import AuthSidebar from "../../../features/patient-auth/components/AuthSidebar";

export default function PatientForgotPassword() {
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
      const errorMessage = (error as any).code === 'auth/user-not-found' 
        ? "No account found with this email." 
        : "Unable to send reset email. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEmailSent) {
    return (
      <AuthLayout>
        <AuthSidebar />
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center font-['Manrope'] bg-white">
          <div className="max-w-md mx-auto w-full text-center">
            <div className="w-16 h-16 bg-[#0A6ED1]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaEnvelope className="w-8 h-8 text-[#0A6ED1]" />
            </div>
            <h1 className="text-3xl font-['Newsreader'] font-medium text-slate-900 mb-3">
              Check your email
            </h1>
            <p className="text-slate-500 mb-8 text-lg">
              We've sent a password reset link to <span className="font-semibold text-slate-700">{email}</span>.
            </p>
            
            <button
              onClick={() => navigate("/patient-login")}
              className="w-full py-4 bg-[#0A6ED1] hover:bg-[#0860b8] active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-[#0A6ED1]/20 transition-all duration-200 mb-4"
            >
              Return to Login
            </button>
            
            <button 
              onClick={() => setIsEmailSent(false)}
              className="text-[#0A6ED1] font-semibold hover:underline text-sm"
            >
              Click here to try another email
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthSidebar />

      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center font-['Manrope'] bg-white">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-4xl font-['Newsreader'] font-medium text-slate-900 mb-2">
            Forgot your password?
          </h1>
          <p className="text-slate-500 mb-8 text-lg">
            Enter your account email and we’ll send you a reset link.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2" htmlFor="patient-reset-email">
                <FaEnvelope className="w-4 h-4 text-[#0A6ED1]" />
                Email Address
              </label>
              <input
                id="patient-reset-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0A6ED1] focus:ring-4 focus:ring-[#0A6ED1]/10 transition-all outline-none text-slate-800 placeholder:text-slate-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#0A6ED1] hover:bg-[#0860b8] active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-[#0A6ED1]/20 transition-all duration-200 flex items-center justify-center gap-2 group text-base disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending Reset Link..." : "Send Reset Link"}
              {!isSubmitting && <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <Link
              to="/patient-login"
              className="inline-flex items-center gap-2 text-sm text-[#0A6ED1] font-semibold hover:underline"
            >
              <FaArrowLeft className="w-3 h-3" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
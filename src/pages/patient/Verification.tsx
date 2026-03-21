import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, ArrowRight, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";





export default function PatientVerification() {
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);

  const handleResendEmail = async () => {
    setResending(true);
    // Simulate email resend
    setTimeout(() => setResending(false), 2000);
  };

  const handleGoToLogin = () => {
    navigate("/patient/login");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-linear-to-r from-[#0A6ED1] to-blue-600 px-6 py-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full -ml-16 -mb-16"></div>
            </div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative z-10 flex justify-center mb-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
                <Mail className="w-16 h-16 text-white relative" />
              </div>
            </motion.div>

            <h1 className="text-2xl font-bold text-white mb-2 relative z-10">Check Your Email</h1>
            <p className="text-blue-100 relative z-10">Verify your account to get started</p>
          </div>

          {/* Content */}
          <div className="px-6 py-8 space-y-6">
            {/* Verification Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
                <p className="text-slate-700">
                  We've sent a verification email to your registered email address. Please check your inbox and click the verification link to activate your account.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-slate-900">What happens next?</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex gap-3">
                    <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
                    <span>Check your inbox for the verification email</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
                    <span>Click the verification link in the email</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
                    <span>Return to sign in with your credentials</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Important Notes */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-amber-50 border border-amber-200 rounded-xl p-4"
            >
              <p className="text-sm text-amber-800">
                <strong>Tip:</strong> If you don't see the email, please check your spam or junk folder.
              </p>
            </motion.div>

            {/* Resend Email Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={handleResendEmail}
              disabled={resending}
              className="w-full py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {resending ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail size={18} />
                  Resend Verification Email
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-slate-500">or</span>
              </div>
            </div>

            {/* Go to Login Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={handleGoToLogin}
              className="w-full py-3 px-4 bg-[#0A6ED1] text-white font-semibold rounded-xl hover:bg-[#095bb0] transition-colors flex items-center justify-center gap-2"
            >
              Go to Login
              <ArrowRight size={18} />
            </motion.button>

            {/* FAQ Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <p className="text-xs text-slate-500">
                Already verified?{" "}
                <button
                  onClick={handleGoToLogin}
                  className="text-[#0A6ED1] font-semibold hover:underline"
                >
                  Sign in here
                </button>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-slate-600">
            Need help?{" "}
            <a href="#" className="text-[#0A6ED1] font-semibold hover:underline">
              Contact our support team
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

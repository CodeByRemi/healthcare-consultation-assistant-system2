import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PatientSidebar from "./components/PatientSidebar";
import PatientDashboardHeader from "./components/PatientDashboardHeader";
import PatientMobileFooter from "./components/PatientMobileFooter";

export default function PatientUpdatePassword() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: ""
  });

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const messages = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    return { score: Math.min(score, 5), message: messages[Math.min(score, 5)] };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "newPassword") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const getStrengthColor = () => {
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"];
    return colors[passwordStrength.score] || "bg-gray-300";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (passwordStrength.score < 2) {
      toast.error("Password is too weak. Please use a stronger password");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate password update
      setTimeout(() => {
        toast.success("Password updated successfully!");
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setPasswordStrength({ score: 0, message: "" });
        setIsLoading(false);
        navigate("/patient/dashboard");
      }, 1500);
    } catch {
      toast.error("Failed to update password");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex flex-col md:flex-row min-h-screen">
        <PatientSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          <PatientDashboardHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          
          <div className="flex-1 overflow-y-auto bg-slate-50/50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Back Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => navigate("/patient/dashboard")}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 font-medium transition-colors group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </motion.button>

              {/* Main Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
              >
                {/* Header Section */}
                <div className="bg-linear-to-r from-[#0A6ED1] to-blue-600 px-8 py-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-4">
                      <Lock className="text-white" size={28} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Update Password</h1>
                    <p className="text-blue-100">Keep your account secure by changing your password regularly</p>
                  </div>
                </div>

                {/* Form Section */}
                <div className="p-8 md:p-10">
                  <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                    {/* Current Password */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-semibold text-slate-900 mb-3">
                        Current Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type={showPassword.current ? "text" : "password"}
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          placeholder="Enter your current password"
                          className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A6ED1]/20 focus:border-[#0A6ED1] transition-all bg-slate-50/50 hover:bg-slate-50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </motion.div>

                    {/* New Password with Strength Indicator */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-semibold text-slate-900 mb-3">
                        New Password
                      </label>
                      <div className="relative group mb-3">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type={showPassword.new ? "text" : "password"}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          placeholder="Create a strong new password"
                          className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A6ED1]/20 focus:border-[#0A6ED1] transition-all bg-slate-50/50 hover:bg-slate-50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {formData.newPassword && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate-600">Strength:</span>
                            <span className={`text-xs font-semibold ${
                              passwordStrength.score === 0 ? "text-red-600" :
                              passwordStrength.score === 1 ? "text-orange-600" :
                              passwordStrength.score === 2 ? "text-yellow-600" :
                              passwordStrength.score === 3 ? "text-lime-600" :
                              "text-green-600"
                            }`}>
                              {passwordStrength.message}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <motion.div
                              className={`h-full transition-all ${getStrengthColor()}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${(passwordStrength.score + 1) * 20}%` }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Confirm Password */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm font-semibold text-slate-900 mb-3">
                        Confirm New Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type={showPassword.confirm ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Re-enter your new password"
                          className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A6ED1]/20 focus:border-[#0A6ED1] transition-all bg-slate-50/50 hover:bg-slate-50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                        <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                          <AlertCircle size={14} />
                          Passwords do not match
                        </p>
                      )}
                      {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                        <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                          <CheckCircle size={14} />
                          Passwords match
                        </p>
                      )}
                    </motion.div>

                    {/* Submit Button */}
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 bg-[#0A6ED1] text-white rounded-xl font-semibold hover:bg-[#095bb0] disabled:opacity-70 transition-all active:scale-95 flex items-center justify-center gap-2 mt-8"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Lock size={18} />
                          Update Password
                        </>
                      )}
                    </motion.button>
                  </form>

                  {/* Requirements Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-10 p-6 bg-blue-50 rounded-2xl border border-blue-100"
                  >
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <AlertCircle size={18} className="text-blue-600" />
                      Password Security Tips
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li className="flex items-start gap-3">
                        <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                        <span>Use at least 8 characters with a mix of uppercase, lowercase, numbers, and symbols</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                        <span>Avoid using personal information like your name or birthdate</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                        <span>Never reuse passwords from other accounts</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
                        <span>Change your password every 3-6 months for optimal security</span>
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
          <PatientMobileFooter />
        </main>
      </div>
    </div>
  );
}

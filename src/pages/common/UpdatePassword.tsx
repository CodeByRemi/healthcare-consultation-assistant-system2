import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash, FaLock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

export default function UpdatePassword() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [validation, setValidation] = useState({
    length: false,
    number: false,
    special: false
  });

  const checkValidation = (pass: string) => {
    setValidation({
      length: pass.length >= 8,
      number: /\d/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass)
    });
  };

  const handleChangeNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewPassword(val);
    checkValidation(val);
  };

  const handleUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user ||!user.email) return;
      if (newPassword !== confirmPassword) {
          toast.error("New passwords do not match");
          return;
      }
      if (!validation.length || !validation.number || !validation.special) {
          toast.error("Password does not meet requirements");
          return;
      }

      setLoading(true);
      try {
          // Re-authenticate first
          const credential = EmailAuthProvider.credential(user.email, currentPassword);
          await reauthenticateWithCredential(user, credential);
          
          // Update Password
          await updatePassword(user, newPassword);
          toast.success("Password updated successfully");
          navigate(-1); // Go back
      } catch (error: any) {
          console.error(error);
          if (error.code === 'auth/wrong-password') {
            toast.error("Current password is incorrect");
          } else {
            toast.error("Failed to update password. Please try again.");
          }
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0A6ED1] rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg shadow-blue-500/30">
                <FaLock />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Update Password</h1>
            <p className="text-slate-500 dark:text-slate-400">Ensure your account stays secure.</p>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700"
        >
            <form onSubmit={handleUpdate} className="space-y-6">
                
                {/* Current Password */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                    <div className="relative">
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0A6ED1]/20 focus:border-[#0A6ED1] transition-all text-slate-900 dark:text-white"
                            placeholder="Enter current password"
                            required
                        />
                        <button 
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={handleChangeNewPassword}
                            className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0A6ED1]/20 transition-all text-slate-900 dark:text-white ${
                                newPassword && (!validation.length || !validation.number || !validation.special) 
                                ? "border-red-300 focus:border-red-500" 
                                : "border-slate-200 dark:border-slate-600 focus:border-[#0A6ED1]"
                            }`}
                            placeholder="Enter new password"
                            required
                        />
                        <button 
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {/* Validation Indicators */}
                    <div className="mt-3 grid grid-cols-1 gap-2 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className={`flex items-center gap-2 text-xs font-medium ${validation.length ? "text-green-600 dark:text-green-400" : "text-slate-400"}`}>
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${validation.length ? "bg-green-100 dark:bg-green-900/30" : "bg-slate-200 dark:bg-slate-600"}`}>
                                {validation.length && <FaCheckCircle className="w-3 h-3" />}
                            </div>
                            At least 8 characters
                        </div>
                         <div className={`flex items-center gap-2 text-xs font-medium ${validation.number ? "text-green-600 dark:text-green-400" : "text-slate-400"}`}>
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${validation.number ? "bg-green-100 dark:bg-green-900/30" : "bg-slate-200 dark:bg-slate-600"}`}>
                                {validation.number && <FaCheckCircle className="w-3 h-3" />}
                            </div>
                            Include at least one number
                        </div>
                         <div className={`flex items-center gap-2 text-xs font-medium ${validation.special ? "text-green-600 dark:text-green-400" : "text-slate-400"}`}>
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${validation.special ? "bg-green-100 dark:bg-green-900/30" : "bg-slate-200 dark:bg-slate-600"}`}>
                                {validation.special && <FaCheckCircle className="w-3 h-3" />}
                            </div>
                            Include at least one special character
                        </div>
                    </div>
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0A6ED1]/20 transition-all text-slate-900 dark:text-white ${
                                confirmPassword && newPassword !== confirmPassword 
                                ? "border-red-300 focus:border-red-500" 
                                : "border-slate-200 dark:border-slate-600 focus:border-[#0A6ED1]"
                            }`}
                            placeholder="Confirm new password"
                            required
                        />
                         <button 
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                            <FaExclamationCircle /> Passwords do not match
                        </p>
                    )}
                </div>

                <div className="pt-2">
                    <button 
                        type="submit"
                        disabled={loading || !validation.length || !validation.number || !validation.special || newPassword !== confirmPassword}
                        className="w-full bg-[#0A6ED1] hover:bg-[#095bb0] text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                    <button 
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-full mt-3 text-slate-500 dark:text-slate-400 py-2 font-medium hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                </div>

            </form>
        </motion.div>
      </div>
    </div>
  );
}

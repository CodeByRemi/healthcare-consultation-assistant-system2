import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DoctorSidebar from "./components/v2/DoctorSidebar";
import DoctorHeader from "./components/v2/DoctorHeader";
import DoctorMobileFooter from "./components/v2/DoctorMobileFooter";
import DoctorPageTransition from "./components/v2/DoctorPageTransition";

export default function DoctorCreatePassword() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  });

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/doctor/password-success?mode=create", { replace: true });
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-['Manrope']">
      <DoctorSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <DoctorHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <DoctorPageTransition className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate("/doctor/settings")}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 font-medium transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Settings
            </button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8"
            >
              <div className="mb-8">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Lock className="text-blue-600" size={24} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Create Password</h1>
                <p className="text-slate-500 mt-2">Create a secure password for your doctor account.</p>
              </div>

              <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Create your password"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0A6ED1]/20 focus:border-[#0A6ED1] transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0A6ED1]/20 focus:border-[#0A6ED1] transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-[#0A6ED1] text-white rounded-lg font-semibold hover:bg-[#095bb0] disabled:opacity-70 transition-colors mt-8"
                >
                  {isLoading ? "Creating..." : "Create Password"}
                </button>
              </form>
            </motion.div>
          </DoctorPageTransition>
        </div>

        <DoctorMobileFooter />
      </main>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaArrowRight } from "react-icons/fa";
import { toast } from "sonner";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "patients", user.uid), {
        uid: user.uid,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        createdAt: new Date().toISOString(),
        role: "patient"
      });

      toast.success("Account created successfully!");
      navigate("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "Failed to create account.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Email is already in use.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters.";
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center font-['Manrope'] bg-white h-full overflow-y-auto">
      <div className="max-w-md mx-auto w-full">
        <h1 className="text-3xl font-['Newsreader'] font-medium text-slate-900 mb-2">
          Create Patient Account
        </h1>
        <p className="text-slate-500 mb-8">
          Join Medicare for a seamless healthcare experience
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FaUser className="w-3.5 h-3.5 text-[#0A6ED1]" />
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0A6ED1] focus:ring-4 focus:ring-[#0A6ED1]/10 transition-all outline-none text-slate-800 placeholder:text-slate-400"
              required
            />
          </div>

          <div className="space-y-1.5">
             <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FaEnvelope className="w-3.5 h-3.5 text-[#0A6ED1]" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FaPhone className="w-3.5 h-3.5 text-[#0A6ED1]" />
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0A6ED1] focus:ring-4 focus:ring-[#0A6ED1]/10 transition-all outline-none text-slate-800 placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                Gender
              </label>
              <select 
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0A6ED1] focus:ring-4 focus:ring-[#0A6ED1]/10 transition-all outline-none text-slate-800"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <FaLock className="w-3.5 h-3.5 text-[#0A6ED1]" />
                Password
              </label>
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
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                Confirm
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0A6ED1] focus:ring-4 focus:ring-[#0A6ED1]/10 transition-all outline-none text-slate-800 placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#0A6ED1] hover:bg-[#0860b8] active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-[#0A6ED1]/20 transition-all duration-200 flex items-center justify-center gap-2 group mt-6 text-base disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
            {!isLoading && <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-500">
            Already have an account?{" "}
            <Link to="/patient-login" className="text-[#0A6ED1] font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

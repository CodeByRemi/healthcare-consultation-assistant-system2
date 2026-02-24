import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "sonner";
import { FaUser, FaFileMedical, FaPhone, FaCheck, FaArrowRight, FaArrowLeft } from "react-icons/fa";

interface OnboardingData {
  dob: string;
  gender: string;
  address: string;
  bloodGroup: string;
  allergies: string;
  conditions: string;
  medications: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
}

const steps = [
  { id: 1, title: "Personal Info", icon: FaUser },
  { id: 2, title: "Medical History", icon: FaFileMedical },
  { id: 3, title: "Emergency Contact", icon: FaPhone },
];

export default function PatientOnboarding() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    dob: "",
    gender: "",
    address: "",
    bloodGroup: "",
    allergies: "",
    conditions: "",
    medications: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const userRef = doc(db, "patients", currentUser.uid);
      await updateDoc(userRef, {
        ...formData,
        onboardingCompleted: true,
        updatedAt: new Date().toISOString()
      });
      
      toast.success("Profile setup complete!");
      navigate("/patient/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row min-h-150">
        
        {/* Sidebar / Progress */}
        <div className="bg-[#0A6ED1] p-8 text-white md:w-1/3 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-['Newsreader'] font-bold mb-2">Welcome!</h1>
            <p className="text-blue-100 mb-12">Let's set up your profile to give you the best care.</p>
            
            <div className="space-y-6">
              {steps.map((s) => (
                <div key={s.id} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    step >= s.id ? "bg-white text-[#0A6ED1] border-white" : "border-blue-400 text-blue-200"
                  }`}>
                    {step > s.id ? <FaCheck /> : <s.icon />}
                  </div>
                  <div>
                    <h3 className={`font-medium ${step >= s.id ? "text-white" : "text-blue-200"}`}>{s.title}</h3>
                    <p className="text-xs text-blue-200">Step {s.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-sm text-blue-200 mt-8">
            Step {step} of 3
          </div>
        </div>

        {/* Form Area */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto">
          <form onSubmit={handleSubmit} className="h-full flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-slate-700">Gender</label>
                       <select
                         name="gender"
                         value={formData.gender}
                         onChange={handleChange}
                         className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent"
                         required
                       >
                         <option value="">Select Gender</option>
                         <option value="male">Male</option>
                         <option value="female">Female</option>
                         <option value="other">Other</option>
                       </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent resize-none"
                      placeholder="Full residential address"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Medical History</h2>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Known Allergies</label>
                    <textarea
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent resize-none"
                      placeholder="e.g. Peanuts, Penicillin (Leave empty if none)"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Chronic Conditions</label>
                    <textarea
                      name="conditions"
                      value={formData.conditions}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent resize-none"
                      placeholder="e.g. Diabetes, Hypertension (Leave empty if none)"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Current Medications</label>
                    <textarea
                      name="medications"
                      value={formData.medications}
                      onChange={handleChange}
                      rows={3}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent resize-none"
                      placeholder="List any medications you currently take"
                    />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Emergency Contact</h2>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Contact Name</label>
                    <input
                      type="text"
                      name="emergencyName"
                      value={formData.emergencyName}
                      onChange={handleChange}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Phone Number</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent"
                      required
                    />
                  </div>

                   <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Relationship</label>
                    <select
                      name="emergencyRelation"
                      value={formData.emergencyRelation}
                      onChange={handleChange}
                      className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6ED1] focus:border-transparent"
                      required
                    >
                      <option value="">Select Relationship</option>
                      <option value="Parent">Parent</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Child">Child</option>
                      <option value="Friend">Friend</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex justify-between pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${
                  step === 1 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <FaArrowLeft /> Back
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#0A6ED1] text-white rounded-lg font-medium hover:bg-[#095bb0] transition-colors"
                >
                  Next <FaArrowRight />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#0A6ED1] text-white rounded-lg font-medium hover:bg-[#095bb0] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Saving..." : "Complete Setup"}
                  {!isLoading && <FaCheck />}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FaShieldAlt as Shield, 
  FaIdCard as IdCard, 
  FaFileUpload as Upload, 
  FaCheckCircle as CheckCircle2,
  FaArrowLeft as ArrowLeft,
  FaFileMedical as MedicalFile
} from "react-icons/fa";
import logo from "../../assets/patientreg.png";
import { toast } from "sonner";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../lib/firebase";

export default function DoctorRegistrationStep4() {
  const navigate = useNavigate();
  const location = useLocation();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFile: (f: File | null) => void, fieldName: string) => {
    if (event.target.files?.length) {
      setFile(event.target.files[0]);
      if (errors[fieldName]) {
        setErrors({ ...errors, [fieldName]: '' });
      }
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!idFile) newErrors.idFile = 'Government-issued ID is required';
    if (!licenseFile) newErrors.licenseFile = 'Medical License Certificate is required';
    if (!termsAccepted) newErrors.terms = 'You must confirm the information provided';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleComplete = async () => {
    if (!validateForm()) {
      toast.error("Please complete all requirements.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const prevData = location.state?.prevData;
      if (!prevData) {
        throw new Error("Missing previous registration data. Please start over.");
      }

      // 1. Create Authentication User
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        prevData.email, 
        prevData.password
      );
      const user = userCredential.user;

      // 2. Upload Files
      // We use simple names but could use extensive unique names
      const idRef = ref(storage, `doctors/${user.uid}/id_document`);
      const licenseRef = ref(storage, `doctors/${user.uid}/medical_license`);

      // Upload simultaneously
      const uploadTasks = [
        uploadBytes(idRef, idFile!).then(() => getDownloadURL(idRef)),
        uploadBytes(licenseRef, licenseFile!).then(() => getDownloadURL(licenseRef))
      ];

      const [idUrl, licenseUrl] = await Promise.all(uploadTasks);

      // 3. Create Doctor Document in Firestore
      // We exclude password from Firestore
      const { password, ...doctorProfileData } = prevData;

      await setDoc(doc(db, "doctors", user.uid), {
        uid: user.uid,
        ...doctorProfileData,
        idDocumentUrl: idUrl,
        licenseDocumentUrl: licenseUrl,
        verificationStatus: 'pending',
        createdAt: new Date().toISOString(),
        role: "doctor"
      });

      toast.success("Registration submitted successfully!");
      navigate('/verification');
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMessage = "Failed to submit registration.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Email is already in use.";
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-['Manrope'] bg-slate-50">
      {/* Left Panel - Branding & Info */}
      <div className="lg:w-1/2 bg-[#0da540] p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-12 group transition-all duration-300 ease-in-out hover:translate-x-1">
            <div className="w-10 h-10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-inner group-hover:bg-white/20 transition-all">
              <img src={logo} alt="Logo" className="w-6 h-6 object-contain hue-rotate-0 brightness-0 invert" />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">Medicare</span>
          </Link>
          
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#0A6ED1] animate-pulse"></span>
              Step 4 of 4
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-['Newsreader'] font-medium text-white mb-6 leading-tight">
              Finalize your <span className="italic text-[#8fcfa7]">verification</span>.
            </h1>
            
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              We take security seriously. Please provide your official documents to complete your practitioner verification.
            </p>

            <div className="space-y-4">
              {[
                "Government ID verification",
                "Medical license validation",
                "Secure data encryption"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-white/90 group">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5" />
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
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-lg bg-white p-8 lg:p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-3xl font-bold text-slate-900 font-['Newsreader']">Verification</h2>
              {/* Note: In a real flow, you might want to prevent cancelling entirely or confirm it */}
              <Link to="/doctor/register" className="text-sm text-slate-400 hover:text-[#0da540] transition-colors">
                Cancel
              </Link>
            </div>
            <p className="text-slate-500">
               Upload your documents to verify your identity and medical credentials.
            </p>
          </div>

          <form className="space-y-6">
            
            {/* ID Upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <IdCard className="w-4 h-4 text-[#0da540]" />
                Government-issued ID
              </label>
              <div className="relative group">
                <input 
                  type="file" 
                  id="id-upload" 
                  className="hidden" 
                  onChange={(e) => handleFileChange(e, setIdFile, 'idFile')}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label 
                  htmlFor="id-upload" 
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${idFile ? 'border-[#0da540] bg-[#0da540]/5' : errors.idFile ? 'border-red-500 bg-red-50' : 'border-slate-300 hover:border-[#0da540] hover:bg-slate-50'}`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {idFile ? (
                      <>
                        <CheckCircle2 className="w-8 h-8 text-[#0da540] mb-2" />
                        <p className="text-sm text-slate-900 font-medium">{idFile.name}</p>
                        <p className="text-xs text-slate-500 mt-1">Click to change</p>
                      </>
                    ) : (
                      <>
                        <Upload className={`w-8 h-8 mb-2 transition-colors ${errors.idFile ? 'text-red-400' : 'text-slate-400 group-hover:text-[#0da540]'}`} />
                        <p className="text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-slate-400 mt-1">PDF, JPG or PNG (MAX. 10MB)</p>
                      </>
                    )}
                  </div>
                </label>
              </div>
              {errors.idFile && <p className="text-red-500 text-xs ml-1">{errors.idFile}</p>}
            </div>

            {/* License Upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <MedicalFile className="w-4 h-4 text-[#0da540]" />
                Medical License Certificate
              </label>
              <div className="relative group">
                <input 
                  type="file" 
                  id="license-upload" 
                  className="hidden" 
                  onChange={(e) => handleFileChange(e, setLicenseFile, 'licenseFile')}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label 
                  htmlFor="license-upload" 
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${licenseFile ? 'border-[#0da540] bg-[#0da540]/5' : errors.licenseFile ? 'border-red-500 bg-red-50' : 'border-slate-300 hover:border-[#0da540] hover:bg-slate-50'}`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {licenseFile ? (
                      <>
                        <CheckCircle2 className="w-8 h-8 text-[#0da540] mb-2" />
                        <p className="text-sm text-slate-900 font-medium">{licenseFile.name}</p>
                        <p className="text-xs text-slate-500 mt-1">Click to change</p>
                      </>
                    ) : (
                      <>
                        <Upload className={`w-8 h-8 mb-2 transition-colors ${errors.licenseFile ? 'text-red-400' : 'text-slate-400 group-hover:text-[#0da540]'}`} />
                        <p className="text-sm text-slate-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-slate-400 mt-1">PDF, JPG or PNG (MAX. 10MB)</p>
                      </>
                    )}
                  </div>
                </label>
              </div>
              {errors.licenseFile && <p className="text-red-500 text-xs ml-1">{errors.licenseFile}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-3 pt-2">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    className="w-5 h-5 rounded border-slate-300 text-[#0da540] focus:ring-[#0da540] transition-colors cursor-pointer"
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      if (errors.terms) setErrors({ ...errors, terms: '' });
                    }}
                  />
                </div>
                <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer select-none">
                  I confirm that the information provided is accurate and I agree to the <a href="#" className="text-[#0da540] hover:underline font-medium">Terms of Service</a> & <a href="#" className="text-[#0da540] hover:underline font-medium">Privacy Policy</a>.
                </label>
              </div>
              {errors.terms && <p className="text-red-500 text-xs ml-1">{errors.terms}</p>}
            </div>

            <div className="flex gap-4 mt-6">
              <button 
                type="button"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                className="w-1/3 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group text-base disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
              
              <button 
                type="button"
                onClick={handleComplete}
                disabled={isSubmitting}
                className={`w-2/3 py-4 bg-[#0da540] text-white font-bold rounded-xl shadow-lg shadow-[#0da540]/20 transition-all duration-200 flex items-center justify-center gap-2 group text-base hover:bg-[#098734] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? "Submitting..." : "Complete Registration"}
                {!isSubmitting && <CheckCircle2 className="w-5 h-5" />}
              </button>
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
              <Shield className="w-3 h-3" />
              Your data is encrypted and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

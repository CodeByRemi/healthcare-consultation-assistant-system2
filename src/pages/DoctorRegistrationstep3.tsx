import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DoctorRegistrationStep3() {
  const navigate = useNavigate();

  const [pinValues, setPinValues] = useState<string[]>(Array(6).fill(''));
  const [mfaMethod, setMfaMethod] = useState('sms');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Only digits
    const newValues = [...pinValues];
    newValues[index] = value;
    setPinValues(newValues);
    if (value && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center px-6 py-10">
      {/* Header */}
      <header className="w-full max-w-3xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-600 flex items-center justify-center rounded">
            <span className="material-symbols-outlined text-black">medical_services</span>
          </div>
          <span className="text-white font-semibold text-lg">Practitioner Portal</span>
        </div>
        <div className="flex items-center gap-2 bg-green-700 px-3 py-1.5 rounded-full text-xs font-semibold">
          <span className="material-symbols-outlined text-black text-sm">lock</span>
          SECURE ENROLLMENT
        </div>
      </header>

      {/* Page Title & Progress */}
      <div className="w-full max-w-3xl mb-10">
        <p className="text-green-600 uppercase text-xs tracking-widest mb-1">Final Phase</p>
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">Security & Final Verification</h1>
          <span className="text-gray-400 italic text-sm">Step 3 of 3</span>
        </div>
        <div className="h-1 bg-green-600 rounded-full"></div>
      </div>

      {/* Identity Verification */}
      <div className="w-full max-w-3xl bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-green-600">badge</span>
          <h2 className="text-lg font-semibold">Identity Verification</h2>
        </div>
        <p className="text-gray-400 mb-4">
          Please upload a high-resolution scan of your Government Issued ID (Passport or Driver's License) to verify your credentials.
        </p>

        {/* File Upload Area */}
        <label className="relative border-2 border-dashed border-gray-600 rounded-lg py-10 flex flex-col items-center justify-center cursor-pointer hover:border-green-600 transition w-full text-center">
          <span className="material-symbols-outlined text-green-600 text-3xl mb-2">cloud_upload</span>
          <p className="text-gray-200">Click or drag file to upload</p>
          <p className="text-gray-500 text-sm mt-1">PDF, JPG, or PNG (Max 10MB)</p>
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
        </label>
        {selectedFile && (
          <p className="mt-2 text-sm text-green-500">Selected file: {selectedFile.name}</p>
        )}
      </div>

      {/* Set Secure PIN */}
      <div className="w-full max-w-3xl bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-green-600">dialpad</span>
          <h2 className="text-lg font-semibold">Set Secure PIN</h2>
        </div>
        <p className="text-gray-400 mb-4">
          Create a 6-digit PIN for quick clinical sign-offs and sensitive data access within the platform.
        </p>
        <div className="flex gap-3">
          {pinValues.map((value, index) => (
            <input
              key={index}
              id={`pin-${index}`}
              type="text"
              maxLength={1}
              className="w-12 h-12 text-center bg-[#0a0a0a] border border-gray-700 rounded-lg text-xl focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none"
              value={value}
              onChange={(e) => handlePinChange(index, e.target.value)}
            />
          ))}
        </div>
      </div>

      {/* Multi-factor Authentication */}
      <div className="w-full max-w-3xl bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-green-600">security</span>
          <h2 className="text-lg font-semibold">Multi-factor Authentication</h2>
        </div>
        <p className="text-gray-400 mb-4">Select your preferred method for secondary authentication to ensure patient privacy.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {['sms', 'authenticator', 'email'].map((method) => {
            const icons: Record<string, string> = { sms: 'sms', authenticator: 'lock', email: 'mail' };
            const labels: Record<string, string> = { sms: 'SMS Code', authenticator: 'Authenticator', email: 'Email' };
            const sublabels: Record<string, string> = { sms: 'Verified Mobile', authenticator: 'Google/Authy App', email: 'Secure Inbox' };
            return (
              <label
                key={method}
                className={`relative flex flex-col p-4 border rounded-lg cursor-pointer transition ${
                  mfaMethod === method ? 'border-green-600 bg-green-900' : 'border-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="mfa"
                  className="hidden"
                  checked={mfaMethod === method}
                  onChange={() => setMfaMethod(method)}
                />
                <span className="material-symbols-outlined text-green-600 mb-2">{icons[method]}</span>
                <span className="font-semibold">{labels[method]}</span>
                <span className="text-gray-400 text-sm">{sublabels[method]}</span>
                {mfaMethod === method && <span className="material-symbols-outlined absolute top-2 right-2 text-green-500">check_circle</span>}
              </label>
            );
          })}
        </div>
      </div>

      {/* Terms & Button */}
      <div className="w-full max-w-3xl mb-8">
        <label className="flex items-start gap-3 mb-4 text-gray-400 text-sm">
          <input
            type="checkbox"
            className="mt-1 w-4 h-4"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          <span>
            I confirm that the information provided is accurate. I agree to the{' '}
            <a href="#" className="text-green-500 underline">Terms and Conditions</a>,{' '}
            <a href="#" className="text-green-500 underline">Privacy Policy</a>, and{' '}
            <a href="#" className="text-green-500 underline">Practitioner Code of Conduct</a>.
          </span>
        </label>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span className="material-symbols-outlined text-gray-400 text-base">verified_user</span>
            256-bit End-to-End Encryption Active
          </div>
          <button
            onClick={() => navigate('/verification')}
            className="px-6 py-3 font-bold text-black bg-green-500 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
            disabled={!termsAccepted}
          >
            Complete Enrollment
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-3xl flex justify-center gap-6 text-gray-500 uppercase text-xs tracking-widest mt-6">
        <a href="#" className="hover:text-green-500 transition">Support Center</a>
        <a href="#" className="hover:text-green-500 transition">HIPAA Compliance</a>
        <a href="#" className="hover:text-green-500 transition">Legal Framework</a>
      </footer>
    </div>
  );
}
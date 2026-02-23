import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GmailVerification() {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const isCodeComplete = useMemo(() => code.every((digit) => digit !== ""), [code]);

  const updateDigit = (index: number, value: string) => {
    const singleValue = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = singleValue;
    setCode(next);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isCodeComplete) return;
    navigate("/doctor/password-change");
  };

  useEffect(() => {
    if (isCodeComplete) {
      navigate("/doctor/password-change");
    }
  }, [isCodeComplete, navigate]);

  return (
    <div className="min-h-screen bg-surface px-6 py-10">
      <main className="max-w-xl mx-auto bg-white border border-black/10 rounded-2xl shadow-lg p-7">
        <h1 className="text-4xl font-display text-primary mb-2">Verify Your Email</h1>
        <p className="text-gray-600 mb-6">Enter the 6-digit code sent to your email.</p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">Verification Code</label>
            <div className="grid grid-cols-6 gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  className="w-full border border-black/15 rounded-lg h-12 text-center text-lg text-primary focus:outline-none focus:border-accent"
                  inputMode="numeric"
                  maxLength={1}
                  placeholder="•"
                  value={digit}
                  onChange={(event) => {
                    updateDigit(index, event.target.value);
                    const value = event.target.value.replace(/\D/g, "").slice(-1);
                    if (value && index < code.length - 1) {
                      const nextInput = event.currentTarget.nextElementSibling as HTMLInputElement | null;
                      nextInput?.focus();
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace" && !digit && index > 0) {
                      const prevInput = event.currentTarget.previousElementSibling as HTMLInputElement | null;
                      prevInput?.focus();
                    }
                  }}
                />
              ))}
            </div>
          </div>

          <button
            className="w-full bg-primary hover:bg-black text-white font-semibold h-12 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            type="submit"
            disabled={!isCodeComplete}
          >
            Verify Code
          </button>
        </form>

        <div className="text-center mt-5">
          <button type="button" onClick={() => navigate("/doctor/forgot-password")} className="text-sm text-accent font-medium hover:opacity-80">
            Back to Forgot Password
          </button>
        </div>
      </main>
    </div>
  );
}

import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate("/doctor/gmail-verification");
  };

  return (
    <div className="min-h-screen bg-surface px-6 py-10">
      <main className="max-w-xl mx-auto bg-white border border-black/10 rounded-2xl shadow-lg p-7">
        <h1 className="text-4xl font-display text-primary mb-2">Recover Your Account</h1>
        <p className="text-gray-600 mb-6">Enter your email address or provider ID to continue.</p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary" htmlFor="recovery-id">
              Email Address or Provider ID
            </label>
            <input
              className="w-full border border-black/15 rounded-lg py-3 px-4 focus:outline-none focus:border-accent"
              id="recovery-id"
              name="recovery-id"
              placeholder="e.g. dr.smith@hospital.com"
              type="text"
            />
          </div>

          <button className="w-full bg-primary hover:bg-black text-white font-semibold py-3 rounded-lg transition-colors" type="submit">
            Continue
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-black/10 text-center">
          <button type="button" onClick={() => navigate("/doctor/login")} className="text-sm text-accent font-medium hover:opacity-80">
            Back to Login
          </button>
        </div>
      </main>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PasswordChange() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen bg-surface px-6 py-10">
      <main className="max-w-xl mx-auto bg-white border border-black/10 rounded-2xl shadow-lg p-7">
        <h1 className="text-4xl font-display text-primary mb-2">Create New Password</h1>
        <p className="text-gray-600 mb-6">Choose a strong password for your account.</p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">New Password</label>
            <div className="relative">
              <input
                className="w-full border border-black/15 rounded-lg h-12 px-4 pr-12 text-primary focus:outline-none focus:border-accent"
                placeholder="••••••••"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                <span className="material-symbols-outlined text-xl">{showNewPassword ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">Confirm New Password</label>
            <div className="relative">
              <input
                className="w-full border border-black/15 rounded-lg h-12 px-4 pr-12 text-primary focus:outline-none focus:border-accent"
                placeholder="••••••••"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                <span className="material-symbols-outlined text-xl">{showConfirmPassword ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
          </div>

          <button className="w-full bg-primary hover:bg-black text-white font-semibold h-12 rounded-lg transition-colors" type="submit">
            Reset Password
          </button>
        </form>

        <div className="text-center mt-5">
          <button
            type="button"
            onClick={() => navigate("/doctor/login")}
            className="text-sm text-accent font-medium hover:opacity-80"
          >
            Back to Login
          </button>
        </div>
      </main>
    </div>
  );
}

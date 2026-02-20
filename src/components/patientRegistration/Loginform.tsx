import AuthInput from "./AuthInput";
import { useState } from "react";

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1500);
  };
  return (
    <div className="md:w-1/2 p-8 md:p-12">
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .heading {
          animation: slideInUp 0.6s ease-out;
        }

        .subtitle {
          animation: fadeIn 0.7s ease-out 0.15s both;
        }

        .form-group {
          animation: slideInUp 0.6s ease-out both;
        }

        .form-group:nth-child(1) { animation-delay: 0.2s; }
        .form-group:nth-child(2) { animation-delay: 0.28s; }
        .form-group:nth-child(3) { animation-delay: 0.36s; }
        .form-group:nth-child(4) { animation-delay: 0.44s; }

        .sign-in-btn {
          animation: slideInUp 0.6s ease-out 0.52s both;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .sign-in-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }

        .sign-in-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .sign-in-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .sign-in-btn:hover:not(:disabled)::before {
          left: 100%;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .footer-text {
          animation: fadeIn 0.7s ease-out 0.6s both;
        }

        .link-underline {
          position: relative;
          transition: color 0.3s ease;
        }

        .link-underline::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: #3b82f6;
          transition: width 0.3s ease;
        }

        .link-underline:hover::after {
          width: 100%;
        }

        .remember-checkbox {
          animation: slideInUp 0.6s ease-out 0.36s both;
        }
      `}</style>

      <h1 className="heading text-4xl font-bold text-gray-900 dark:text-white">
        Welcome Back
      </h1>
      <p className="subtitle text-gray-600 dark:text-gray-300 mb-10 text-lg">
        Sign in to your healthcare account
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="form-group">
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="john@example.com"
          />
        </div>

        <div className="form-group">
          <AuthInput
            label="Password"
            type="password"
            placeholder="••••••••"
          />
        </div>

        {/* Remember + Forgot */}
        <div className="form-group flex items-center justify-between">
          <label className="remember-checkbox flex items-center cursor-pointer group">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 transition-colors group-hover:border-blue-400"
            />
            <span className="ml-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-200">
              Remember me
            </span>
          </label>

          <a
            href="#"
            className="link-underline text-sm font-semibold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="sign-in-btn w-full py-3 rounded-lg text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-70 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2 text-lg"
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p className="footer-text text-center mt-8 text-gray-600 dark:text-gray-400">
        Don't have an account?{" "}
        <a
          href="/patient-reg"
          className="link-underline font-semibold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
        >
          Create one
        </a>
      </p>
    </div>
  );
}

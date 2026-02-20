import { useState, useEffect } from 'react';
import './PatientRegistration.css';

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

export default function PatientRegistration() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setIsSubmitted(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field when user starts typing
        if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validateForm()) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        console.log('Form submitted:', formData);
        setIsLoading(false);
        setShowSuccess(true);
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phoneNumber: '',
          gender: '',
          password: '',
          confirmPassword: '',
          agreeToTerms: false,
        });
      }, 1500);
    }
  };

  return (
    <div className="registration-container">
      <div className={`registration-wrapper ${isSubmitted ? 'submitted' : ''}`}>
        {/* Left Section */}
        <div className="registration-left">
          <div className="medical-icon-wrapper">
            <span className="medical-icon">🏥</span>
          </div>
          <h1 className="fade-in-text">Welcome to Medicare</h1>
          <p className="fade-in-text delayed">Your health, our priority. Join our secure healthcare system today for better medical management.</p>
        </div>

        {/* Right Section */}
        <div className="registration-right">
          {showSuccess && (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>Registration Successful!</h3>
              <p>Welcome to Medicare. Your account has been created.</p>
            </div>
          )}

          <div className={`form-content ${showSuccess ? 'hidden' : 'visible'}`}>
            <div className="form-header">
              <h2>Create Account</h2>
              <p>Please fill in your details to register.</p>
            </div>

            <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-group slide-in" style={{ animationDelay: '0.1s' }}>
              <label htmlFor="fullName" className={focusedField === 'fullName' ? 'active' : ''}>Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                onFocus={() => handleFocus('fullName')}
                onBlur={handleBlur}
                className={`${focusedField === 'fullName' ? 'input-focused' : ''} ${errors.fullName ? 'input-error' : ''}`}
              />
              {errors.fullName && <span className="error-text shake">{errors.fullName}</span>}
            </div>

            {/* Email Address */}
            <div className="form-group slide-in" style={{ animationDelay: '0.2s' }}>
              <label htmlFor="email" className={focusedField === 'email' ? 'active' : ''}>Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus('email')}
                onBlur={handleBlur}
                className={`${focusedField === 'email' ? 'input-focused' : ''} ${errors.email ? 'input-error' : ''}`}
              />
              {errors.email && <span className="error-text shake">{errors.email}</span>}
            </div>

            {/* Phone Number and Gender */}
            <div className="form-row">
              <div className="form-group slide-in" style={{ animationDelay: '0.3s' }}>
                <label htmlFor="phoneNumber" className={focusedField === 'phoneNumber' ? 'active' : ''}>Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onFocus={() => handleFocus('phoneNumber')}
                  onBlur={handleBlur}
                  className={`${focusedField === 'phoneNumber' ? 'input-focused' : ''} ${errors.phoneNumber ? 'input-error' : ''}`}
                />
                {errors.phoneNumber && <span className="error-text shake">{errors.phoneNumber}</span>}
              </div>

              <div className="form-group slide-in" style={{ animationDelay: '0.4s' }}>
                <label htmlFor="gender" className={focusedField === 'gender' ? 'active' : ''}>Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  onFocus={() => handleFocus('gender')}
                  onBlur={handleBlur}
                  className={`${focusedField === 'gender' ? 'select-focused' : ''} ${errors.gender ? 'select-error' : ''}`}
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <span className="error-text shake">{errors.gender}</span>}
              </div>
            </div>

            {/* Password and Confirm Password */}
            <div className="form-row">
              <div className="form-group slide-in" style={{ animationDelay: '0.5s' }}>
                <label htmlFor="password" className={focusedField === 'password' ? 'active' : ''}>Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleFocus('password')}
                  onBlur={handleBlur}
                  className={`${focusedField === 'password' ? 'input-focused' : ''} ${errors.password ? 'input-error' : ''}`}
                />
                {errors.password && <span className="error-text shake">{errors.password}</span>}
              </div>

              <div className="form-group slide-in" style={{ animationDelay: '0.6s' }}>
                <label htmlFor="confirmPassword" className={focusedField === 'confirmPassword' ? 'active' : ''}>Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => handleFocus('confirmPassword')}
                  onBlur={handleBlur}
                  className={`${focusedField === 'confirmPassword' ? 'input-focused' : ''} ${errors.confirmPassword ? 'input-error' : ''}`}
                />
                {errors.confirmPassword && <span className="error-text shake">{errors.confirmPassword}</span>}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="form-group checkbox slide-in" style={{ animationDelay: '0.7s' }}>
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
              </div>
              <label htmlFor="agreeToTerms">
                I agree to the{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </label>
              {errors.agreeToTerms && <span className="error-text shake">{errors.agreeToTerms}</span>}
            </div>

            {/* Submit Button */}
            <button type="submit" className={`submit-button slide-in ${isLoading ? 'loading' : ''}`} style={{ animationDelay: '0.8s' }} disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                'Register'
              )}
            </button>

            {/* Sign In Link */}
            <div className="signin-link slide-in" style={{ animationDelay: '0.9s' }}>
              Already have an account? <a href="/signin">Sign in</a>
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

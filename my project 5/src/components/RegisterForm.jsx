import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import { validateRegistrationForm, evaluatePasswordStrength } from '../utils/validation';
import { findUserByEmail, saveNewUser } from '../utils/storage';
import { generateSalt, hashPassword } from '../utils/crypto';

export default function RegisterForm({ onRegisterSuccess, onSwitchToLogin, initialEmail = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: initialEmail,
    password: '',
    confirmPassword: '',
    acceptTerms: true,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const passwordStrength = evaluatePasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const { errors: currentErrors } = validateRegistrationForm(formData);
    if (currentErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: currentErrors[field] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      acceptTerms: true,
    });

    const { isValid, errors: validationErrors } = validateRegistrationForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setGeneralError('');

    try {
      // Check if email already registered in browser storage
      const existingUser = findUserByEmail(formData.email);
      if (existingUser) {
        setGeneralError('An account with this email address already exists. Please sign in instead.');
        setIsLoading(false);
        return;
      }

      // Generate random cryptographic salt
      const salt = generateSalt();

      // Hash password using Web Crypto API SHA-256
      const passwordHash = await hashPassword(formData.password, salt);

      // Brief pause to simulate processing and display subtle animation
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Save user record
      const newUser = saveNewUser({
        name: formData.name,
        email: formData.email,
        salt,
        passwordHash,
      });

      setIsLoading(false);
      onRegisterSuccess(newUser);
    } catch (err) {
      console.error('Registration hashing error:', err);
      setGeneralError('Failed to complete Web Crypto hashing. Please check your browser support.');
      setIsLoading(false);
    }
  };

  const doPasswordsMatch =
    formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-warm-900 mb-2">
          Create an account
        </h2>
        <p className="text-sm text-warm-600">
          Join Morrow and begin creating your focused, warm workspace.
        </p>
      </div>

      {/* Global Error Banner */}
      {generalError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-rose-900">{generalError}</p>
            {generalError.includes('already exists') && (
              <button
                type="button"
                onClick={() => onSwitchToLogin(formData.email)}
                className="mt-1.5 text-xs font-semibold text-terracotta-700 hover:text-terracotta-800 flex items-center gap-1 underline underline-offset-2"
              >
                Sign in with this account <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full Name */}
        <div>
          <label
            htmlFor="reg-name"
            className="block text-xs font-semibold tracking-wide uppercase text-warm-700 mb-1.5"
          >
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-warm-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="reg-name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Eleanor Vance"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur('name')}
              className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 transition-all ${
                touched.name && errors.name
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-warm-200 focus:border-terracotta-500 focus:ring-terracotta-500/20'
              }`}
            />
          </div>
          {touched.name && errors.name && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 inline" /> {errors.name}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor="reg-email"
            className="block text-xs font-semibold tracking-wide uppercase text-warm-700 mb-1.5"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-warm-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="reg-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="eleanor@example.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 transition-all ${
                touched.email && errors.email
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-warm-200 focus:border-terracotta-500 focus:ring-terracotta-500/20'
              }`}
            />
          </div>
          {touched.email && errors.email && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 inline" /> {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="reg-password"
            className="block text-xs font-semibold tracking-wide uppercase text-warm-700 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-warm-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="new-password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              className={`w-full pl-10 pr-11 py-2.5 bg-white border rounded-xl text-sm text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 transition-all ${
                touched.password && errors.password
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                  : 'border-warm-200 focus:border-terracotta-500 focus:ring-terracotta-500/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-warm-400 hover:text-warm-600 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Interactive Password Strength Indicator */}
          {formData.password.length > 0 && (
            <div className="mt-2.5 p-3 rounded-xl bg-warm-100/60 border border-warm-200 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-warm-600 font-medium">Password Strength:</span>
                <span className={`font-semibold ${passwordStrength.textColor}`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 h-1.5 mb-2">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-full rounded-full transition-all duration-300 ${
                      passwordStrength.score >= step ? passwordStrength.color : 'bg-warm-200'
                    }`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-warm-600 mt-2">
                <span className={`flex items-center gap-1 ${passwordStrength.rules.length ? 'text-emerald-700 font-medium' : 'text-warm-500'}`}>
                  {passwordStrength.rules.length ? '✓' : '•'} 8+ characters
                </span>
                <span className={`flex items-center gap-1 ${passwordStrength.rules.uppercase && passwordStrength.rules.lowercase ? 'text-emerald-700 font-medium' : 'text-warm-500'}`}>
                  {passwordStrength.rules.uppercase && passwordStrength.rules.lowercase ? '✓' : '•'} Upper & lower case
                </span>
                <span className={`flex items-center gap-1 ${passwordStrength.rules.number ? 'text-emerald-700 font-medium' : 'text-warm-500'}`}>
                  {passwordStrength.rules.number ? '✓' : '•'} At least 1 number
                </span>
                <span className={`flex items-center gap-1 ${passwordStrength.rules.symbol ? 'text-emerald-700 font-medium' : 'text-warm-500'}`}>
                  {passwordStrength.rules.symbol ? '✓' : '•'} At least 1 symbol
                </span>
              </div>
            </div>
          )}

          {touched.password && errors.password && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 inline" /> {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="reg-confirm-password"
            className="block text-xs font-semibold tracking-wide uppercase text-warm-700 mb-1.5"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-warm-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="reg-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur('confirmPassword')}
              className={`w-full pl-10 pr-11 py-2.5 bg-white border rounded-xl text-sm text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 transition-all ${
                touched.confirmPassword && errors.confirmPassword
                  ? 'border-rose-300 focus:ring-rose-200 bg-rose-50/20'
                  : doPasswordsMatch
                  ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20'
                  : 'border-warm-200 focus:border-terracotta-500 focus:ring-terracotta-500/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-warm-400 hover:text-warm-600 transition-colors"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {doPasswordsMatch && (
            <p className="mt-1 text-xs text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 inline" /> Passwords match!
            </p>
          )}
          {touched.confirmPassword && errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 inline" /> {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Demo Agreement & Privacy Disclaimer */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-warm-700">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="mt-0.5 w-4 h-4 rounded border-warm-300 text-terracotta-600 focus:ring-terracotta-500/30 accent-terracotta-600"
            />
            <span className="leading-snug">
              I understand this is a front-end educational demo. Credentials are encrypted via Web Crypto SHA-256 and stored only in this browser.
            </span>
          </label>
          {touched.acceptTerms && errors.acceptTerms && (
            <p className="mt-1 text-xs text-rose-600 font-medium">
              {errors.acceptTerms}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-medium text-sm shadow-md shadow-terracotta-600/20 hover:shadow-lg hover:shadow-terracotta-600/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Hashing & creating account...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Create Morrow Account</span>
            </>
          )}
        </button>
      </form>

      {/* Switch to Login link */}
      <div className="mt-6 text-center text-xs text-warm-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => onSwitchToLogin(formData.email)}
          className="font-semibold text-terracotta-700 hover:text-terracotta-800 hover:underline inline-flex items-center gap-1"
        >
          Sign in here <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

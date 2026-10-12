import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { validateLoginForm } from '../utils/validation';
import { findUserByEmail } from '../utils/storage';
import { verifyPassword } from '../utils/crypto';

export default function LoginForm({ onLoginSuccess, onSwitchToRegister, storedUsers }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (authError) {
      setAuthError('');
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const { errors: currentErrors } = validateLoginForm(formData);
    if (currentErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: currentErrors[field] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    const { isValid, errors: validationErrors } = validateLoginForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setAuthError('');

    try {
      // Simulate slight cryptographic processing delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 350));

      const existingUser = findUserByEmail(formData.email);
      if (!existingUser) {
        setAuthError('No account found with this email. Please create an account first.');
        setIsLoading(false);
        return;
      }

      // Verify password with Web Crypto SHA-256
      const isValidPassword = await verifyPassword(
        formData.password,
        existingUser.salt,
        existingUser.passwordHash
      );

      if (!isValidPassword) {
        setAuthError('Incorrect password. Please verify and try again.');
        setIsLoading(false);
        return;
      }

      // Successfully authenticated
      setIsLoading(false);
      onLoginSuccess(existingUser);
    } catch (err) {
      console.error('Authentication error:', err);
      setAuthError('An unexpected error occurred during encryption check.');
      setIsLoading(false);
    }
  };

  const handleQuickFill = (user) => {
    setFormData((prev) => ({
      ...prev,
      email: user.email,
    }));
    setAuthError('');
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-warm-900 mb-2">
          Welcome back
        </h2>
        <p className="text-sm text-warm-600">
          Enter your details below to sign in to your Morrow workspace.
        </p>
      </div>

      {/* Global Error Banner */}
      {authError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-rose-900">{authError}</p>
            {authError.includes('create an account') && (
              <button
                type="button"
                onClick={() => onSwitchToRegister(formData.email)}
                className="mt-1.5 text-xs font-semibold text-terracotta-700 hover:text-terracotta-800 flex items-center gap-1 underline underline-offset-2"
              >
                Go to Registration with this email <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email Field */}
        <div>
          <label
            htmlFor="login-email"
            className="block text-xs font-semibold tracking-wide uppercase text-warm-700 mb-1.5"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-warm-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="login-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
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

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold tracking-wide uppercase text-warm-700"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-xs text-terracotta-700 hover:text-terracotta-800 font-medium hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-warm-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
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
          {touched.password && errors.password && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 inline" /> {errors.password}
            </p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-warm-700">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded border-warm-300 text-terracotta-600 focus:ring-terracotta-500/30 accent-terracotta-600"
            />
            <span>Remember this device</span>
          </label>
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
              <span>Verifying credentials...</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      {/* Demo helper pill: Show existing accounts in localStorage if any */}
      {storedUsers && storedUsers.length > 0 && (
        <div className="mt-6 pt-5 border-t border-warm-200">
          <p className="text-xs text-warm-500 mb-2 font-medium">
            Saved demo accounts in this browser:
          </p>
          <div className="flex flex-wrap gap-2">
            {storedUsers.slice(0, 3).map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickFill(u)}
                className="text-xs px-2.5 py-1 rounded-lg bg-warm-100 hover:bg-warm-200/80 text-warm-700 border border-warm-200 flex items-center gap-1.5 transition-colors"
                title={`Click to fill ${u.email}`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: u.avatarColor || '#D56D52' }} />
                <span>{u.name}</span>
                <span className="text-warm-400">({u.email})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Switch to Register link */}
      <div className="mt-6 text-center text-xs text-warm-600">
        Don&apos;t have an account yet?{' '}
        <button
          type="button"
          onClick={() => onSwitchToRegister()}
          className="font-semibold text-terracotta-700 hover:text-terracotta-800 hover:underline inline-flex items-center gap-1"
        >
          Create demo account <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Forgot Password Modal Dialog */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-warm-lg border border-warm-200">
            <h3 className="font-serif text-lg font-semibold text-warm-900 mb-2">
              Password Reset Notice
            </h3>
            <p className="text-xs sm:text-sm text-warm-600 leading-relaxed mb-4">
              Because Morrow is a purely client-side front-end demonstration, there is no email server or database to send password reset links.
            </p>
            <p className="text-xs text-warm-600 leading-relaxed mb-5 p-3 rounded-lg bg-warm-50 border border-warm-200">
              💡 <strong>Tip:</strong> You can create a new demo account at any time, or clear local storage using the reset button in the footer.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-warm-100 hover:bg-warm-200 text-warm-800 transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

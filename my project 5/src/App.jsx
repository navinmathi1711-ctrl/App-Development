import React, { useState, useEffect } from 'react';
import BrandHero from './components/BrandHero';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import {
  getCurrentSession,
  setCurrentSession,
  clearCurrentSession,
  getStoredUsers,
  clearAllDemoData,
} from './utils/storage';
import { ShieldAlert, Sun, Info, Trash2, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUserState] = useState(null);
  const [activeTab, setActiveTab] = useState('register'); // Default to 'register' since instructions say: "Create an account first, then use the same email and password to sign in"
  const [emailTransfer, setEmailTransfer] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [storedUsersList, setStoredUsersList] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Load existing session and users on initial mount
  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setCurrentUserState(session);
    }
    const users = getStoredUsers();
    setStoredUsersList(users);
    // If users already exist in localStorage and not logged in, suggest sign in tab
    if (users.length > 0 && !session) {
      setActiveTab('login');
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentSession(user);
    setCurrentUserState(user);
    showToast(`Welcome back, ${user.name}!`);
  };

  const handleRegisterSuccess = (newUser) => {
    // Automatically log user into dashboard
    setCurrentSession(newUser);
    setCurrentUserState(newUser);
    setStoredUsersList(getStoredUsers());
    showToast(`Account created successfully! Welcome to Morrow, ${newUser.name}.`);
  };

  const handleSignOut = () => {
    clearCurrentSession();
    setCurrentUserState(null);
    setStoredUsersList(getStoredUsers());
    setActiveTab('login');
    showToast('Signed out successfully.');
  };

  const handleConfirmClearData = () => {
    clearAllDemoData();
    setCurrentUserState(null);
    setStoredUsersList([]);
    setShowClearConfirm(false);
    setActiveTab('register');
    showToast('All demo accounts and local data have been cleared.');
  };

  // If user is logged in, show Dashboard
  if (currentUser) {
    return (
      <Dashboard
        user={currentUser}
        onSignOut={handleSignOut}
        onClearData={() => setShowClearConfirm(true)}
      />
    );
  }

  // Otherwise, render split-screen authentication view
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between selection:bg-terracotta-200 selection:text-terracotta-900">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 py-3 px-4 rounded-xl bg-warm-900 text-cream-50 text-xs sm:text-sm font-medium shadow-warm-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-10">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-warm-lg border border-warm-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* Split Left: Warm Editorial Brand & Hero (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col">
            <BrandHero currentTab={activeTab} onSwitchTab={setActiveTab} />
          </div>

          {/* Split Right: Form Card (5 cols on desktop) */}
          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-white relative">
            <div>
              {/* Tab Navigation Pill */}
              <div className="flex rounded-xl bg-warm-100/80 p-1 mb-8 border border-warm-200/60">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'login'
                      ? 'bg-white text-warm-900 shadow-sm'
                      : 'text-warm-600 hover:text-warm-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'register'
                      ? 'bg-white text-warm-900 shadow-sm'
                      : 'text-warm-600 hover:text-warm-900'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Form Views */}
              {activeTab === 'login' ? (
                <LoginForm
                  onLoginSuccess={handleLoginSuccess}
                  onSwitchToRegister={(email) => {
                    if (email) setEmailTransfer(email);
                    setActiveTab('register');
                  }}
                  storedUsers={storedUsersList}
                />
              ) : (
                <RegisterForm
                  onRegisterSuccess={handleRegisterSuccess}
                  onSwitchToLogin={(email) => {
                    if (email) setEmailTransfer(email);
                    setActiveTab('login');
                  }}
                  initialEmail={emailTransfer}
                />
              )}
            </div>

            {/* Subtle Footer inside Form Card */}
            <div className="mt-8 pt-4 border-t border-warm-100 text-center">
              <p className="text-[11px] text-warm-500 leading-relaxed">
                Demo data is saved only in this browser&apos;s <code className="bg-warm-100 px-1 py-0.5 rounded text-warm-700">localStorage</code>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Global Learning Demo Notice Banner & Controls in page footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 pb-6">
        <div className="p-4 rounded-2xl bg-warm-100/90 border border-warm-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-warm-700">
          <div className="flex items-start gap-2.5">
            <Info className="w-4 h-4 text-terracotta-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Learning Demo Notice:</strong> Passwords are hashed with the browser&apos;s Web Crypto API before saving. Do not use real or sensitive personal passwords.
            </p>
          </div>
          {storedUsersList.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="flex-shrink-0 py-1.5 px-3 rounded-lg bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-800 border border-warm-200 hover:border-rose-200 font-medium transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Local Data ({storedUsersList.length})</span>
            </button>
          )}
        </div>
      </footer>

      {/* Confirmation Modal for Clearing Data */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-warm-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-warm-lg border border-warm-200">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-warm-900 mb-2">
              Clear all demo storage?
            </h3>
            <p className="text-xs sm:text-sm text-warm-600 leading-relaxed mb-5">
              This will remove all saved accounts and sessions from this browser&apos;s localStorage. You will need to create a new account to test again.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-warm-100 hover:bg-warm-200 text-warm-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClearData}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors"
              >
                Yes, Clear Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

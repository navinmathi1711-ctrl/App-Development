import React, { useState } from 'react';
import {
  Sun,
  LogOut,
  ShieldCheck,
  Key,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Info,
  Clock,
  User,
  Database,
  ExternalLink,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { updateUser, getStoredUsers, clearAllDemoData } from '../utils/storage';

export default function Dashboard({ user, onSignOut, onClearData }) {
  const [currentUser, setCurrentUser] = useState(user);
  const [newTodoText, setNewTodoText] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user.name);
  const [profileBio, setProfileBio] = useState(user.bio || 'Productive creator focusing on calm mornings.');
  const [showSecurityDetails, setShowSecurityDetails] = useState(false);
  const [notification, setNotification] = useState('');

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleToggleTodo = (todoId) => {
    const updatedTodos = (currentUser.todos || []).map((t) =>
      t.id === todoId ? { ...t, completed: !t.completed } : t
    );
    const updated = updateUser(currentUser.id, { todos: updatedTodos });
    if (updated) {
      setCurrentUser(updated);
    }
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    const newTodo = {
      id: 'td_' + Date.now(),
      text: newTodoText.trim(),
      completed: false,
    };

    const updatedTodos = [...(currentUser.todos || []), newTodo];
    const updated = updateUser(currentUser.id, { todos: updatedTodos });
    if (updated) {
      setCurrentUser(updated);
      setNewTodoText('');
      showToast('Daily intention added!');
    }
  };

  const handleDeleteTodo = (todoId) => {
    const updatedTodos = (currentUser.todos || []).filter((t) => t.id !== todoId);
    const updated = updateUser(currentUser.id, { todos: updatedTodos });
    if (updated) {
      setCurrentUser(updated);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileName.trim()) return;

    const updated = updateUser(currentUser.id, {
      name: profileName.trim(),
      bio: profileBio.trim(),
    });

    if (updated) {
      setCurrentUser(updated);
      setIsEditingProfile(false);
      showToast('Profile updated successfully!');
    }
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const storedUsers = getStoredUsers();
  const completedTodosCount = (currentUser.todos || []).filter((t) => t.completed).length;
  const totalTodosCount = (currentUser.todos || []).length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-warm-900 font-sans flex flex-col selection:bg-terracotta-200">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 py-2.5 px-4 rounded-xl bg-warm-900 text-cream-50 text-xs sm:text-sm font-medium shadow-warm-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navigation */}
      <header className="border-b border-warm-200 bg-white/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-terracotta-600 to-terracotta-400 flex items-center justify-center text-white shadow-sm">
              <Sun className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-warm-900">
                Morrow
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] uppercase tracking-wider font-semibold text-terracotta-700 bg-terracotta-50 px-2 py-0.5 rounded-full border border-terracotta-200">
                Workspace
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* User badge */}
            <div className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-full bg-warm-100/80 border border-warm-200 text-xs">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold text-[11px]"
                style={{ backgroundColor: currentUser.avatarColor || '#D56D52' }}
              >
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </span>
              <span className="font-medium text-warm-800 hidden sm:inline max-w-[120px] truncate">
                {currentUser.name}
              </span>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={onSignOut}
              className="py-1.5 px-3 rounded-lg border border-warm-200 hover:border-warm-300 bg-white hover:bg-warm-50 text-warm-700 hover:text-warm-900 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
              title="Sign out of current demo session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Welcome Banner */}
        <section className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#F5EDE3] via-[#FAF5EE] to-[#EFE2D3] border border-warm-200/80 overflow-hidden shadow-warm">
          <div className="absolute top-0 right-0 w-80 h-80 bg-terracotta-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-terracotta-700 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-warm-900">
                Good morning, {currentUser.name.split(' ')[0]}
              </h1>
              <p className="text-sm sm:text-base text-warm-700 max-w-xl font-normal leading-relaxed">
                Welcome to your dashboard. All account details are saved in this browser&apos;s local storage, hashed natively with the Web Crypto API.
              </p>
            </div>

            {/* Quick stats capsule */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-white/60 shadow-sm flex-1 min-w-[130px]">
                <div className="flex items-center gap-1.5 text-xs text-warm-500 font-medium mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Security</span>
                </div>
                <div className="text-sm font-semibold text-warm-900">SHA-256</div>
                <div className="text-[11px] text-warm-500">Salted hash</div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-white/60 shadow-sm flex-1 min-w-[130px]">
                <div className="flex items-center gap-1.5 text-xs text-warm-500 font-medium mb-1">
                  <Database className="w-4 h-4 text-terracotta-600" />
                  <span>Storage</span>
                </div>
                <div className="text-sm font-semibold text-warm-900">
                  {storedUsers.length} {storedUsers.length === 1 ? 'Account' : 'Accounts'}
                </div>
                <div className="text-[11px] text-warm-500">Local storage</div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Grid: Tasks & Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Daily Tasks / Intentions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-warm-200 shadow-warm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-serif text-xl font-semibold text-warm-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-terracotta-600" />
                    Today&apos;s Intentions
                  </h2>
                  <p className="text-xs text-warm-500 mt-0.5">
                    Your focus checklist for today. Saved directly to your profile.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-warm-100 text-warm-700 border border-warm-200">
                  {completedTodosCount} of {totalTodosCount} completed
                </span>
              </div>

              {/* Add Todo Input */}
              <form onSubmit={handleAddTodo} className="flex gap-2 mb-5">
                <input
                  type="text"
                  placeholder="Add a new intention or task..."
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-warm-50/60 border border-warm-200 rounded-xl text-sm placeholder-warm-400 focus:outline-none focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20 transition-all"
                />
                <button
                  type="submit"
                  className="py-2.5 px-4 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-medium text-sm flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </form>

              {/* Todo List */}
              <div className="space-y-2.5">
                {(!currentUser.todos || currentUser.todos.length === 0) && (
                  <p className="text-xs text-warm-400 italic text-center py-6">
                    No intentions set yet. Add one above to begin your day.
                  </p>
                )}
                {(currentUser.todos || []).map((todo) => (
                  <div
                    key={todo.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                      todo.completed
                        ? 'bg-warm-50/80 border-warm-200/70 text-warm-400'
                        : 'bg-white border-warm-200 hover:border-warm-300 text-warm-800'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleTodo(todo.id)}
                      className="flex items-center gap-3 flex-1 text-left select-none"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-warm-300 hover:text-terracotta-500 transition-colors flex-shrink-0" />
                      )}
                      <span className={`text-sm ${todo.completed ? 'line-through text-warm-400' : 'text-warm-800 font-medium'}`}>
                        {todo.text}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="text-warm-300 hover:text-rose-500 p-1 rounded-lg transition-colors"
                      title="Delete intention"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Web Crypto & Storage Deep Dive / Inspector Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-warm-200 shadow-warm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-terracotta-50 text-terracotta-700">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-warm-900">
                      Web Crypto & Storage Inspector
                    </h3>
                    <p className="text-xs text-warm-500">
                      View how your credentials are stored securely in the browser.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSecurityDetails(!showSecurityDetails)}
                  className="text-xs font-semibold text-terracotta-700 hover:text-terracotta-800 px-3 py-1.5 rounded-lg bg-terracotta-50 hover:bg-terracotta-100 transition-colors"
                >
                  {showSecurityDetails ? 'Hide Raw Details' : 'Inspect Credentials'}
                </button>
              </div>

              {showSecurityDetails ? (
                <div className="space-y-4 pt-2 animate-fadeIn">
                  <div className="p-4 rounded-xl bg-warm-50 border border-warm-200 font-mono text-xs space-y-2.5 overflow-x-auto">
                    <div>
                      <span className="text-warm-500 select-none">// Account ID:</span>
                      <p className="text-warm-900">{currentUser.id}</p>
                    </div>
                    <div>
                      <span className="text-warm-500 select-none">// Email Address:</span>
                      <p className="text-warm-900">{currentUser.email}</p>
                    </div>
                    <div>
                      <span className="text-warm-500 select-none">// Random Cryptographic Salt (16 bytes):</span>
                      <p className="text-terracotta-700 break-all">{currentUser.salt || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-warm-500 select-none">// SHA-256 Password Hash (Web Crypto API):</span>
                      <p className="text-emerald-700 break-all">{currentUser.passwordHash || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-warm-500 select-none">// Registered Timestamp:</span>
                      <p className="text-warm-700">{currentUser.createdAt || 'N/A'}</p>
                    </div>
                  </div>

                  <p className="text-xs text-warm-600 leading-relaxed">
                    Notice how the plaintext password was never recorded. Even in this browser storage demo, the password was combined with a random cryptographic salt and hashed using <code className="bg-warm-100 px-1 py-0.5 rounded text-warm-800">window.crypto.subtle.digest(&apos;SHA-256&apos;, ...)</code> before writing to <code className="bg-warm-100 px-1 py-0.5 rounded text-warm-800">localStorage</code>.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-warm-600 leading-relaxed">
                  Your password was hashed with a unique 16-byte salt via the browser&apos;s native Web Crypto API before saving to local storage. Click <strong>Inspect Credentials</strong> to view the resulting SHA-256 hash representation.
                </p>
              )}
            </div>
          </div>

          {/* Right Col: Profile & Account Controls */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-6 border border-warm-200 shadow-warm">
              <div className="text-center pb-5 border-b border-warm-100">
                <div
                  className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-serif font-bold shadow-md mb-3"
                  style={{ backgroundColor: currentUser.avatarColor || '#D56D52' }}
                >
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <h3 className="font-serif text-lg font-semibold text-warm-900">
                  {currentUser.name}
                </h3>
                <p className="text-xs text-warm-500 mt-0.5">{currentUser.email}</p>
                <p className="text-xs text-warm-600 mt-2 italic px-4">
                  “{currentUser.bio || 'Productive creator focusing on calm mornings.'}”
                </p>
              </div>

              {/* Profile Details or Edit Form */}
              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="mt-4 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-warm-600 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-warm-50 border border-warm-200 rounded-lg focus:outline-none focus:border-terracotta-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-warm-600 mb-1">
                      Bio
                    </label>
                    <textarea
                      rows={2}
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-warm-50 border border-warm-200 rounded-lg focus:outline-none focus:border-terracotta-500"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-terracotta-600 hover:bg-terracotta-700 text-white transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-warm-100 hover:bg-warm-200 text-warm-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-xs py-1 border-b border-warm-50">
                    <span className="text-warm-500">Member ID</span>
                    <span className="font-mono text-warm-700">{currentUser.id.substring(0, 10)}...</span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-warm-50">
                    <span className="text-warm-500">Registered</span>
                    <span className="text-warm-700">
                      {currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Today'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs py-1">
                    <span className="text-warm-500">Storage Scope</span>
                    <span className="text-warm-700">Browser localStorage</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileName(currentUser.name);
                      setProfileBio(currentUser.bio || '');
                      setIsEditingProfile(true);
                    }}
                    className="w-full mt-2 py-2 text-xs font-semibold rounded-lg border border-warm-200 hover:bg-warm-50 text-warm-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            {/* Important Learning Demo Disclaimer Card */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-amber-950">
                <Info className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>Learning Demo Architecture</span>
              </div>
              <p className="leading-relaxed text-amber-800">
                This is a front-end learning demo, not production authentication. Browser storage can be viewed or cleared by anyone on this device; there is no server, database, password reset, or real session security.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClearData}
                  className="w-full py-2 px-3 rounded-lg bg-white/80 hover:bg-white text-rose-700 border border-rose-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset & Clear All Demo Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-warm-200 py-6 text-center text-xs text-warm-500 bg-white/50">
        <p>Morrow Demo Application • Built with React, Vite & Web Crypto API</p>
      </footer>
    </div>
  );
}

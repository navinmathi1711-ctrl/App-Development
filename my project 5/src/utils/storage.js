/**
 * Morrow LocalStorage Database Layer
 * Simulates persistence for demo authentication and user workspace items.
 */

const STORAGE_KEYS = {
  USERS: 'morrow_demo_users',
  SESSION: 'morrow_demo_session',
  SETTINGS: 'morrow_demo_settings',
};

// Retrieve all registered accounts from browser storage
export function getStoredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed reading users from localStorage', err);
    return [];
  }
}

// Find a user by their email address (case-insensitive)
export function findUserByEmail(email) {
  if (!email) return null;
  const users = getStoredUsers();
  return users.find((u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()) || null;
}

// Save a newly registered user
export function saveNewUser(user) {
  const users = getStoredUsers();
  const avatarColors = ['#D56D52', '#81B29A', '#E07A5F', '#3D405B', '#C05338', '#6C8E70'];
  const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

  const newUser = {
    id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    name: user.name.trim(),
    email: user.email.trim().toLowerCase(),
    salt: user.salt,
    passwordHash: user.passwordHash,
    createdAt: new Date().toISOString(),
    avatarColor: randomColor,
    bio: 'Productive creator focusing on thoughtful, calm mornings.',
    role: 'Member',
    todos: [
      { id: 'td_1', text: 'Complete onboarding walkthrough', completed: true },
      { id: 'td_2', text: 'Customize my daily workspace focus', completed: false },
      { id: 'td_3', text: 'Inspect browser Web Crypto SHA-256 storage', completed: false },
    ],
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return newUser;
}

// Update an existing user's profile details
export function updateUser(userId, updates) {
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return null;

  users[index] = { ...users[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

  // If the active session is for this user, update session copy too
  const currentSession = getCurrentSession();
  if (currentSession && currentSession.id === userId) {
    const updatedSession = { ...currentSession, ...updates };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(updatedSession));
  }

  return users[index];
}

// Active session helpers
export function getCurrentSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!raw) return null;
    const session = JSON.parse(raw);
    // Refresh against latest stored user data
    const users = getStoredUsers();
    const freshUser = users.find((u) => u.id === session.id);
    return freshUser || session;
  } catch (err) {
    console.error('Failed reading session', err);
    return null;
  }
}

export function setCurrentSession(user) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    return;
  }
  // Store session without exposing raw hash if possible, though local storage is client-visible
  const sessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarColor: user.avatarColor,
    bio: user.bio,
    createdAt: user.createdAt,
    todos: user.todos || [],
  };
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
}

export function clearCurrentSession() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

// Clear all demo data completely
export function clearAllDemoData() {
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

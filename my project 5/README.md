# Morrow — Login & Registration App

**Morrow** is a warm, thoughtfully designed React application featuring account registration, sign-in, live form validation, and an interactive signed-in dashboard. Its warm, split-screen interface adapts fluidly across all screen sizes.

---

## Features

- **Warm Split-Screen Aesthetic**: Editorial typography (Playfair Display & Plus Jakarta Sans), earthy terracotta & warm sand palette, and responsive single-column layout on smaller screens.
- **Account Registration & Sign-In**: Seamless switching between Sign Up and Sign In views with prefilled input support.
- **Client-Side Cryptography**: Passwords are hashed with browser-native **Web Crypto API** (`SubtleCrypto` SHA-256 with 16-byte random cryptographic salts) before saving. Plaintext passwords are never stored.
- **Real-Time Form Validation**:
  - Email RFC regex validation.
  - Interactive 4-step password strength meter with checklist rules (length, uppercase, lowercase, numbers, symbols).
  - Password match verification.
  - Informative inline errors and error alerts.
- **Signed-In Workspace & Dashboard**:
  - Personalized welcome greeting with date.
  - **Today's Intentions checklist**: Add, complete, and delete daily focus items, persisted to your local profile.
  - **Web Crypto & Storage Inspector**: Inspect the exact cryptographic salt, SHA-256 hash, and account record stored in `localStorage`.
  - Profile customization (editable display name and bio).
  - One-click sign out and demo data reset.

---

## Run Locally

1. Open a terminal in this directory:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open the local URL printed in the terminal (typically `http://localhost:5173`).

4. Create an account first on the **Create Account** tab, then sign in with the same email and password.

---

## Important Notice

> **Educational Front-End Demo**: This application is a front-end learning demo, not production authentication. Browser storage (`localStorage`) can be inspected or cleared by the user. There is no server, database, password reset email, or session token encryption. **Do not use a real password or sensitive personal information.**

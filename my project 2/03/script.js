/* ══════════════════════════════════════════════
   NEXUS REGISTRATION — script.js
   ══════════════════════════════════════════════ */

'use strict';

// ── Regex constants ─────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/;          // Indian 10-digit mobile
const PIN_RE   = /^\d{6}$/;               // 6-digit PIN / ZIP

// ── Utility: get element by id ──────────────────
const $ = id => document.getElementById(id);

// ══════════════════════════════════════════════════
//  TAB SWITCHING
// ══════════════════════════════════════════════════
const tabSignup    = $('tab-signup');
const tabLogin     = $('tab-login');
const formSignup   = $('form-signup');
const formLogin    = $('form-login');
const tabUnderline = $('tab-underline');
const statusBanner = $('status-banner');

/**
 * Activate a tab.
 * @param {'signup'|'login'} which
 */
function activateTab(which) {
  const isSignup = which === 'signup';

  // Buttons
  tabSignup.classList.toggle('active', isSignup);
  tabLogin.classList.toggle('active', !isSignup);
  tabSignup.setAttribute('aria-selected', isSignup ? 'true' : 'false');
  tabLogin.setAttribute('aria-selected',  isSignup ? 'false' : 'true');

  // Forms
  formSignup.classList.toggle('hidden', !isSignup);
  formLogin.classList.toggle('hidden',   isSignup);

  // Sliding underline: sign-up is left (0%), login is right (100%)
  tabUnderline.style.transform = isSignup ? 'translateX(0%)' : 'translateX(100%)';

  // Hide any leftover status banner
  hideBanner();
}

tabSignup.addEventListener('click', () => activateTab('signup'));
tabLogin.addEventListener('click',  () => activateTab('login'));

// Cross-links inside the forms
$('goto-login').addEventListener('click',  () => activateTab('login'));
$('goto-signup').addEventListener('click', () => activateTab('signup'));
$('go-login-link').addEventListener('click', e => { e.preventDefault(); activateTab('login'); });

// ══════════════════════════════════════════════════
//  STATUS BANNER HELPERS
// ══════════════════════════════════════════════════
function showBanner(type, msg) {
  statusBanner.textContent = '';
  const icon = document.createElement('span');
  icon.textContent = type === 'success' ? '✓ ' : '✕ ';
  icon.setAttribute('aria-hidden', 'true');
  statusBanner.appendChild(icon);
  statusBanner.appendChild(document.createTextNode(msg));

  statusBanner.className = `status-banner ${type}`;
  statusBanner.hidden = false;
  statusBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideBanner() {
  statusBanner.hidden = true;
  statusBanner.className = 'status-banner';
}

// ══════════════════════════════════════════════════
//  FIELD VALIDATION HELPER
// ══════════════════════════════════════════════════
/**
 * Set or clear an error on a text/select input.
 * @param {string}  inputId  – id of the <input> or <select>
 * @param {string}  errorId  – id of the <span class="error">
 * @param {string}  message  – empty string means "valid"
 * @returns {boolean} true if valid, false if invalid
 */
function setError(inputId, errorId, message) {
  const input = $(inputId);
  const span  = $(errorId);
  if (message) {
    input.classList.add('invalid');
    span.textContent = message;
    return false;
  } else {
    input.classList.remove('invalid');
    span.textContent = '';
    return true;
  }
}

/**
 * Validate a fieldset (gender / terms) without an <input> ID.
 * @param {HTMLElement} fieldsetEl
 * @param {string}      errorId
 * @param {string}      message
 * @returns {boolean}
 */
function setFieldsetError(fieldsetEl, errorId, message) {
  const span = $(errorId);
  if (message) {
    fieldsetEl.classList.add('invalid');
    span.textContent = message;
    return false;
  } else {
    fieldsetEl.classList.remove('invalid');
    span.textContent = '';
    return true;
  }
}

/**
 * Set or clear an error for a checkbox.
 * @param {string}  checkId  – id of the <input type="checkbox">
 * @param {string}  errorId
 * @param {string}  message
 * @returns {boolean}
 */
function setCheckboxError(checkId, errorId, message) {
  const box  = $(checkId);
  const span = $(errorId);
  const custom = box.nextElementSibling;          // .checkbox-custom span
  if (message) {
    custom && custom.classList.add('invalid-check');
    span.textContent = message;
    return false;
  } else {
    custom && custom.classList.remove('invalid-check');
    span.textContent = '';
    return true;
  }
}

// ══════════════════════════════════════════════════
//  PASSWORD TOGGLE (Show / Hide)
// ══════════════════════════════════════════════════
document.querySelectorAll('.pw-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = $(btn.dataset.target);
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.textContent = isPassword ? 'Hide' : 'Show';
    btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
  });
});

// ══════════════════════════════════════════════════
//  PASSWORD STRENGTH METER
// ══════════════════════════════════════════════════
const bars        = [1,2,3,4].map(n => $(`bar-${n}`));
const strengthTxt = $('strength-text');

const STRENGTH_LEVELS = ['None', 'Weak', 'Fair', 'Good', 'Strong'];
const BAR_CLASSES     = ['',     'weak', 'fair', 'good', 'strong'];

/**
 * Score a password 0–4.
 * +1 for: length ≥ 8, mixed case, contains digit, contains symbol
 */
function passwordStrength(pw) {
  let score = 0;
  if (pw.length >= 8)            score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw))             score++;
  if (/[^a-zA-Z0-9]/.test(pw))  score++;
  return score;
}

function updateStrengthMeter(pw) {
  const score = pw ? passwordStrength(pw) : 0;
  bars.forEach((bar, i) => {
    bar.className = 'bar'; // reset
    if (i < score) bar.classList.add(BAR_CLASSES[score]);
  });
  strengthTxt.textContent = STRENGTH_LEVELS[score];
}

$('su-password').addEventListener('input', e => updateStrengthMeter(e.target.value));

// ══════════════════════════════════════════════════
//  SIGN-UP FORM VALIDATION
// ══════════════════════════════════════════════════
formSignup.addEventListener('submit', function (e) {
  e.preventDefault();
  let valid = true;    // accumulator — every rule is always evaluated

  // --- Full Name ---
  const name = $('su-name').value.trim();
  valid = setError('su-name', 'su-name-error',
    !name                       ? 'Full name is required.' :
    name.length < 2             ? 'Name must be at least 2 characters.' :
    !/^[a-zA-Z\s'-]+$/.test(name) ? 'Name may only contain letters, spaces, hyphens and apostrophes.' :
    ''
  ) && valid;

  // --- Email ---
  const email = $('su-email').value.trim();
  valid = setError('su-email', 'su-email-error',
    !email                      ? 'Email address is required.' :
    !EMAIL_RE.test(email)       ? 'Please enter a valid email (e.g. user@example.com).' :
    ''
  ) && valid;

  // --- Phone ---
  const phone = $('su-phone').value.trim();
  valid = setError('su-phone', 'su-phone-error',
    !phone                      ? 'Phone number is required.' :
    !PHONE_RE.test(phone)       ? 'Enter a valid 10-digit Indian mobile number starting with 6–9.' :
    ''
  ) && valid;

  // --- Date of Birth ---
  const dob = $('su-dob').value;
  let dobError = '';
  if (!dob) {
    dobError = 'Date of birth is required.';
  } else {
    const today   = new Date();
    const birth   = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    if (birth > today)  dobError = 'Date of birth cannot be in the future.';
    else if (age < 13)  dobError = 'You must be at least 13 years old to register.';
    else if (age > 120) dobError = 'Please enter a valid date of birth.';
  }
  valid = setError('su-dob', 'su-dob-error', dobError) && valid;

  // --- Gender ---
  const genderFieldset  = formSignup.querySelector('.gender-fieldset');
  const selectedGender  = formSignup.querySelector('input[name="gender"]:checked');
  valid = setFieldsetError(genderFieldset, 'su-gender-error',
    !selectedGender ? 'Please select your gender.' : ''
  ) && valid;

  // --- Country ---
  const country = $('su-country').value;
  valid = setError('su-country', 'su-country-error',
    !country ? 'Please select your country.' : ''
  ) && valid;

  // --- Password ---
  const pw    = $('su-password').value;
  const score = passwordStrength(pw);
  valid = setError('su-password', 'su-password-error',
    !pw                         ? 'Password is required.' :
    pw.length < 8               ? 'Password must be at least 8 characters.' :
    score < 2                   ? 'Password is too weak. Add uppercase letters, numbers or symbols.' :
    ''
  ) && valid;

  // --- Confirm Password ---
  const confirm = $('su-confirm').value;
  valid = setError('su-confirm', 'su-confirm-error',
    !confirm                    ? 'Please confirm your password.' :
    confirm !== pw              ? 'Passwords do not match.' :
    ''
  ) && valid;

  // --- PIN Code ---
  const pin = $('su-pin').value.trim();
  valid = setError('su-pin', 'su-pin-error',
    !pin                        ? 'PIN code is required.' :
    !PIN_RE.test(pin)           ? 'PIN code must be exactly 6 digits.' :
    ''
  ) && valid;

  // --- Terms ---
  const terms = $('su-terms').checked;
  valid = setCheckboxError('su-terms', 'su-terms-error',
    !terms ? 'You must agree to the Terms and Conditions.' : ''
  ) && valid;

  // ── Result ───────────────────────────────────
  if (!valid) {
    showBanner('error', 'Please fix the errors below before submitting.');
    // Focus first invalid field
    const firstInvalid = formSignup.querySelector('.invalid, .invalid-check');
    firstInvalid && firstInvalid.focus();
    return;
  }

  // ── Success ──────────────────────────────────
  showBanner('success', `Welcome, ${name.split(' ')[0]}! Your account has been created successfully.`);
  formSignup.reset();
  updateStrengthMeter('');
  // Clear all error messages
  formSignup.querySelectorAll('.error').forEach(s => s.textContent = '');
  formSignup.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
  formSignup.querySelectorAll('.invalid-check').forEach(el => el.classList.remove('invalid-check'));
  formSignup.querySelector('.gender-fieldset').classList.remove('invalid');
});

// ══════════════════════════════════════════════════
//  LOG-IN FORM VALIDATION
// ══════════════════════════════════════════════════
formLogin.addEventListener('submit', function (e) {
  e.preventDefault();
  let valid = true;

  // --- Email ---
  const email = $('li-email').value.trim();
  valid = setError('li-email', 'li-email-error',
    !email                ? 'Email address is required.' :
    !EMAIL_RE.test(email) ? 'Please enter a valid email address.' :
    ''
  ) && valid;

  // --- Password ---
  const pw = $('li-password').value;
  valid = setError('li-password', 'li-password-error',
    !pw ? 'Password is required.' : ''
  ) && valid;

  // ── Result ───────────────────────────────────
  if (!valid) {
    showBanner('error', 'Please fix the errors below before logging in.');
    const firstInvalid = formLogin.querySelector('.invalid');
    firstInvalid && firstInvalid.focus();
    return;
  }

  // ── Success (demo — no real auth) ────────────
  showBanner('success', `Logged in as ${email}. Redirecting…`);
  formLogin.reset();
  formLogin.querySelectorAll('.error').forEach(s => s.textContent = '');
  formLogin.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
});

// ══════════════════════════════════════════════════
//  LIVE VALIDATION ON BLUR (UX polish)
//  Clear the error as soon as the user starts correcting
// ══════════════════════════════════════════════════
function clearOnInput(inputId, errorId) {
  const input = $(inputId);
  if (!input) return;
  input.addEventListener('input', () => {
    if (input.classList.contains('invalid') && input.value) {
      input.classList.remove('invalid');
      $(errorId).textContent = '';
    }
  });
}

// Sign-up fields
clearOnInput('su-name',     'su-name-error');
clearOnInput('su-email',    'su-email-error');
clearOnInput('su-phone',    'su-phone-error');
clearOnInput('su-dob',      'su-dob-error');
clearOnInput('su-country',  'su-country-error');
clearOnInput('su-password', 'su-password-error');
clearOnInput('su-confirm',  'su-confirm-error');
clearOnInput('su-pin',      'su-pin-error');

// Log-in fields
clearOnInput('li-email',    'li-email-error');
clearOnInput('li-password', 'li-password-error');

// Gender radio — clear error on any radio selection
document.querySelectorAll('input[name="gender"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const fs = formSignup.querySelector('.gender-fieldset');
    fs.classList.remove('invalid');
    $('su-gender-error').textContent = '';
  });
});

// Terms checkbox — clear error when ticked
$('su-terms').addEventListener('change', function () {
  if (this.checked) {
    this.nextElementSibling.classList.remove('invalid-check');
    $('su-terms-error').textContent = '';
  }
});

// ══════════════════════════════════════════════════
//  PHONE INPUT: allow only digits
// ══════════════════════════════════════════════════
$('su-phone').addEventListener('keypress', e => {
  if (!/\d/.test(e.key)) e.preventDefault();
});

// ══════════════════════════════════════════════════
//  PIN INPUT: allow only digits
// ══════════════════════════════════════════════════
$('su-pin').addEventListener('keypress', e => {
  if (!/\d/.test(e.key)) e.preventDefault();
});

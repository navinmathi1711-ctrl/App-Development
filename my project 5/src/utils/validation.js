/**
 * Morrow Form Validation & Password Security Checks
 */

export function isValidEmail(email) {
  if (!email) return false;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email.trim());
}

export function evaluatePasswordStrength(password) {
  if (!password) {
    return {
      score: 0,
      label: 'Too short',
      color: 'bg-warm-300',
      textColor: 'text-warm-500',
      feedback: ['At least 8 characters'],
      rules: {
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        symbol: false,
      },
    };
  }

  const rules = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^a-zA-Z0-9]/.test(password),
  };

  let score = 0;
  if (rules.length) score += 1;
  if (rules.lowercase && rules.uppercase) score += 1;
  if (rules.number) score += 1;
  if (rules.symbol) score += 1;

  let label = 'Weak';
  let color = 'bg-rose-500';
  let textColor = 'text-rose-600';

  if (password.length < 8) {
    score = Math.min(score, 1);
    label = 'Too short';
    color = 'bg-rose-500';
    textColor = 'text-rose-600';
  } else if (score === 2) {
    label = 'Fair';
    color = 'bg-amber-500';
    textColor = 'text-amber-600';
  } else if (score === 3) {
    label = 'Good';
    color = 'bg-emerald-500';
    textColor = 'text-emerald-600';
  } else if (score >= 4) {
    label = 'Strong';
    color = 'bg-teal-600';
    textColor = 'text-teal-700';
  }

  return {
    score,
    label,
    color,
    textColor,
    rules,
  };
}

export function validateRegistrationForm(formData) {
  const errors = {};

  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'Please enter your full name (at least 2 characters).';
  }

  if (!formData.email) {
    errors.email = 'Email address is required.';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address (e.g., name@domain.com).';
  }

  if (!formData.password) {
    errors.password = 'Password is required.';
  } else if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (!formData.acceptTerms) {
    errors.acceptTerms = 'You must accept the demo terms to continue.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateLoginForm(formData) {
  const errors = {};

  if (!formData.email) {
    errors.email = 'Email address is required.';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email format.';
  }

  if (!formData.password) {
    errors.password = 'Password is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

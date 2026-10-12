/**
 * Morrow Web Crypto Utilities
 * Securely hashes passwords using browser-native Web Crypto API (SubtleCrypto SHA-256)
 * Note: Front-end demo application utility.
 */

// Generate a cryptographic random salt (16 bytes, hex encoded)
export function generateSalt() {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Convert ArrayBuffer to Hex string
function bufferToHex(buffer) {
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hashes a plaintext password combined with a salt using SHA-256
 * @param {string} password - Raw user password
 * @param {string} salt - Hex salt string
 * @returns {Promise<string>} Hex encoded SHA-256 hash
 */
export async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  // Salt-prefix scheme to resist rainbow table attacks
  const data = encoder.encode(`${salt}:${password}`);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return bufferToHex(hashBuffer);
}

/**
 * Verifies if entered password matches the stored hash
 * @param {string} password - Input plaintext password
 * @param {string} salt - Stored salt
 * @param {string} storedHash - Stored hex hash
 * @returns {Promise<boolean>} Match result
 */
export async function verifyPassword(password, salt, storedHash) {
  const computedHash = await hashPassword(password, salt);
  return computedHash === storedHash;
}

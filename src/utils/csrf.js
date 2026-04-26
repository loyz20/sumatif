const crypto = require('crypto');

/**
 * Generate a CSRF token - a random string that's cryptographically secure
 * Tokens are stored in memory/session (simple approach) or database for stateless apps
 * For this implementation, we'll use a signed token approach
 */
function generateCsrfToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create a signed CSRF token using a secret
 * This allows validation without storing tokens
 */
function createSignedCsrfToken(secret) {
  const token = generateCsrfToken();
  const timestamp = Date.now().toString();
  
  // Create HMAC of token + timestamp
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(token + timestamp)
    .digest('hex');
  
  return {
    token: `${token}.${timestamp}.${hmac}`,
    raw: token,
  };
}

/**
 * Verify a signed CSRF token
 */
function verifyCsrfToken(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    const [rawToken, timestamp, receivedHmac] = parts;
    
    // Verify HMAC
    const expectedHmac = crypto
      .createHmac('sha256', secret)
      .update(rawToken + timestamp)
      .digest('hex');
    
    // Timing-safe comparison
    if (!crypto.timingSafeEqual(Buffer.from(receivedHmac), Buffer.from(expectedHmac))) {
      return false;
    }

    // Check token age (24 hours)
    const age = Date.now() - parseInt(timestamp, 10);
    const MAX_AGE = 24 * 60 * 60 * 1000;
    
    if (age > MAX_AGE) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  generateCsrfToken,
  createSignedCsrfToken,
  verifyCsrfToken,
};

# Security Guidelines

This document outlines the security best practices and procedures for the Sekolahku v2 application.

## Environment Secrets Management

### JWT Secrets

**Critical**: The JWT secrets must be kept confidential and rotated regularly.

#### Setting Up Secrets

1. **Generate strong secrets**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

2. **Store in environment variables**:
   - `JWT_ACCESS_SECRET` - Used for access token signing (15 minute expiry)
   - `JWT_REFRESH_SECRET` - Used for refresh token signing (7 day expiry)
   - `CSRF_SECRET` - Used for CSRF token signing (defaults to JWT_ACCESS_SECRET if not set)

3. **Never commit secrets** to version control:
   ```
   # .gitignore should contain:
   .env
   .env.local
   .env.*.local
   ```

#### Secret Rotation Procedure

**Rotate secrets on these events**:
- At least quarterly (every 3 months)
- Immediately if compromised
- After employee departure with access
- After any unauthorized access attempt

**How to rotate**:

1. **Generate new secrets**:
```bash
node -e "console.log('New JWT_ACCESS_SECRET:', require('crypto').randomBytes(32).toString('hex')); console.log('New JWT_REFRESH_SECRET:', require('crypto').randomBytes(32).toString('hex')); console.log('New CSRF_SECRET:', require('crypto').randomBytes(32).toString('hex'))'
```

2. **Update environment variables** in all environments:
   - Development: Update local `.env` file
   - Staging: Update deployment environment variables
   - Production: Update production secrets manager/environment

3. **Deploy the change**:
   - No code changes needed
   - Restart application to read new secrets
   - Old tokens will become invalid (users will need to re-login)

4. **Verify rotation**:
   - Test login works with new secrets
   - Verify old tokens are rejected
   - Monitor for user complaints

#### Emergency Secret Rotation

If a secret is compromised:

1. **Immediately invalidate all tokens**:
```sql
-- Execute in database:
UPDATE auth_refresh_tokens SET revoked_at = NOW() WHERE revoked_at IS NULL;
```

2. **Update secrets**:
   - Set new secrets in all environments
   - Restart all application instances

3. **Force user re-authentication**:
   - Users will see "Token expired" message
   - Will be redirected to login
   - Need to login again with new session

4. **Document the incident**:
   - Record when rotation occurred
   - Note the reason
   - Add to security audit log

## CSRF Protection

### Overview

Cross-Site Request Forgery (CSRF) protection is implemented using signed tokens.

### How CSRF Works in This Application

1. **Getting a CSRF Token**:
```bash
GET /api/v1/auth/csrf-token
```

Response:
```json
{
  "data": {
    "csrf_token": "token-value"
  }
}
```

2. **Submitting with CSRF Token**:
   - Send token in `X-CSRF-Token` header for API calls
   - Or in `csrf_token` field in request body

3. **Token Validation**:
   - Tokens are signed and time-limited (24 hours)
   - Invalid or expired tokens are rejected with 403 Forbidden

### Implementation Details

- CSRF tokens use HMAC-SHA256 signing
- Tokens expire after 24 hours
- Only POST, PUT, DELETE requests require CSRF validation
- GET requests bypass CSRF checks
- Login endpoint (public) doesn't require CSRF token

## Authentication Security

### Access Token

- **Type**: JWT
- **Expiry**: 15 minutes
- **Storage**: httpOnly cookie (XSS-protected)
- **Contains**: User ID, role, school ID, unique JTI

### Refresh Token

- **Type**: JWT  
- **Expiry**: 7 days
- **Storage**: httpOnly cookie (XSS-protected)
- **Rotation**: New refresh token issued on each refresh
- **Revocation**: Tracked in database for logout support

### Cookie Security

- **httpOnly**: True (prevents JavaScript access)
- **secure**: True in production (HTTPS only)
- **sameSite**: strict (prevents cross-site cookie sending)
- **path**: / (available to entire application)

### Recommended Session Timeout

- Access token: 15 minutes (current)
- Refresh token: 7 days (consider reducing to 1-3 days for higher security)
- Idle timeout: Optional (implement server-side session tracking)

## Password Security

### Hashing Algorithm

Passwords are hashed using `scrypt`:
- **Algorithm**: scrypt
- **N**: 16384 (default from Node.js crypto)
- **Random salt**: 16 bytes per password
- **Output length**: 64 bytes

### Password Requirements

Recommend enforcing:
- Minimum length: 8 characters (currently 6)
- Complexity: Mix of uppercase, lowercase, numbers, symbols
- No common patterns
- Check against known compromised password lists

## CORS Configuration

### Current Settings

```javascript
cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true // Enables cookie transmission
})
```

### Safe Origins

- **Development**: `http://localhost:5173`
- **Staging**: `https://staging.example.com`
- **Production**: `https://app.example.com`

### Important Notes

- Always specify exact origins, never use `*` with `credentials: true`
- Multiple origins separated by comma: `http://localhost:5173,https://app.example.com`
- Update CORS_ORIGIN before deploying to each environment

## Rate Limiting

### Current Implementation

- **Global limit**: 1000 requests per 15 minutes per IP
- **Headers**: Returned in response for client visibility

### Recommended Enhancements

- Implement per-endpoint rate limits (stricter on login, looser on GET)
- Add user-based rate limiting (after auth)
- Monitor for unusual patterns

### Example Enhanced Configuration

```javascript
// Login - strict limit
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  skipSuccessfulRequests: true,
});

// API - moderate limit  
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100, // 100 requests per minute
});
```

## HTTPS Requirements

### Production Requirements

- **All traffic must be HTTPS** (TLS 1.2+)
- **Certificate**: Valid SSL/TLS certificate
- **HSTS**: Enable HTTP Strict-Transport-Security header

### HSTS Configuration

```javascript
app.use(helmet.hsts({
  maxAge: 31536000, // 1 year
  includeSubDomains: true,
  preload: true
}));
```

### Redirect HTTP to HTTPS

```javascript
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

## Database Security

### Connection Security

- Use strong database passwords
- Connect over TLS if possible
- Use connection pooling (prevents connection exhaustion)
- Set appropriate connection limits

### Data Protection

- Never log passwords or tokens
- Sanitize error messages (don't expose DB schema)
- Use parameterized queries (prevents SQL injection) ✅ Already implemented
- Regular backups with encryption

### Access Control

- Principle of least privilege
- Separate read-only and write access
- Audit logging for sensitive operations

## Logging and Monitoring

### What to Log

- Login attempts (success and failure)
- Failed authorization attempts
- Data modifications (create, update, delete)
- System errors

### What NOT to Log

- Passwords
- Tokens (access or refresh)
- Sensitive personal data
- Database credentials

### Example Safe Logging

```javascript
// Good - safe for logging
console.log(`User ${user.id} logged in from ${req.ip}`);

// Bad - exposes sensitive data
console.log(`User logged in with token: ${token}`);
```

## Dependency Security

### Regular Audits

Run security audits regularly:

```bash
# Check for vulnerabilities
npm audit

# Fix automatically where possible
npm audit fix

# Update specific packages
npm update [package-name]
```

### Supply Chain Security

- Pin versions in package.json (not using `^` or `~`)
- Review dependency changes before updating
- Monitor for deprecation warnings
- Use npm lockfile in version control

## Security Headers

The application uses Helmet.js to set secure headers:

- `Strict-Transport-Security` - Enforce HTTPS
- `Content-Security-Policy` - Prevent XSS attacks
- `X-Frame-Options` - Prevent clickjacking
- `X-Content-Type-Options` - Prevent MIME type sniffing
- `Referrer-Policy` - Control referrer information

## Incident Response

### If Credentials Are Compromised

1. **Immediately rotate** all JWT secrets
2. **Invalidate all tokens** in the database
3. **Force user re-authentication**
4. **Review access logs** for unauthorized activity
5. **Document the incident** for compliance

### If Database Is Breached

1. **Rotate all API secrets**
2. **Reset all user passwords**
3. **Enable multi-factor authentication** (if available)
4. **Notify affected users**
5. **Review and strengthen security controls**

## Checklist for Deployment

- [ ] All environment secrets configured
- [ ] HTTPS/SSL certificate installed
- [ ] CORS origins whitelist verified
- [ ] Rate limiting configured appropriately
- [ ] Logging enabled (without sensitive data)
- [ ] Database backups configured
- [ ] Monitoring and alerts set up
- [ ] Security headers verified with tool
- [ ] Dependencies audited (`npm audit`)
- [ ] Secrets Manager configured (if available)

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Node.js Security Checklist](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

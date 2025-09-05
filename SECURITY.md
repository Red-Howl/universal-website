# 🔒 Kalamkar Security Documentation

## Overview
This document outlines the comprehensive security measures implemented in the Kalamkar e-commerce platform. Our security framework provides enterprise-grade protection against common web vulnerabilities and attacks.

## 🛡️ Security Features Implemented

### 1. **Security Headers**
- **Content Security Policy (CSP)**: Prevents XSS attacks by controlling resource loading
- **HTTP Strict Transport Security (HSTS)**: Enforces HTTPS connections
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-XSS-Protection**: Browser-level XSS protection
- **Referrer Policy**: Controls referrer information leakage

### 2. **Input Validation & Sanitization**
- **Comprehensive validation rules** for all user inputs
- **XSS protection** with HTML sanitization
- **SQL injection prevention** with parameterized queries
- **NoSQL injection protection** for MongoDB-style attacks
- **Command injection prevention**
- **Path traversal protection**

### 3. **Rate Limiting**
- **IP-based rate limiting** with configurable windows
- **User-specific rate limits** for authenticated users
- **Endpoint-specific limits** (login, API, admin, etc.)
- **Automatic IP blocking** for excessive requests
- **Whitelist support** for trusted IPs

### 4. **CSRF Protection**
- **Token-based CSRF protection** for all state-changing requests
- **Database-stored tokens** with expiration
- **IP validation** for additional security
- **One-time use tokens** to prevent replay attacks

### 5. **Authentication Security**
- **Password strength requirements** with complexity rules
- **Secure password hashing** using bcrypt
- **Session management** with secure tokens
- **Automatic session timeout**
- **Login attempt monitoring** and account lockout

### 6. **File Upload Security**
- **File type validation** with whitelist approach
- **File size limits** to prevent DoS attacks
- **Filename sanitization** to prevent path traversal
- **Virus scanning** integration ready
- **Secure file storage** with access controls

### 7. **Database Security**
- **Parameterized queries** to prevent SQL injection
- **Input sanitization** before database operations
- **Connection pooling** with limits
- **Query timeout** protection
- **Audit logging** for sensitive operations

### 8. **Real-time Security Monitoring**
- **Security event logging** with severity levels
- **Suspicious activity detection** with pattern matching
- **Automated alerting** for critical security events
- **CSP violation reporting** and monitoring
- **Performance monitoring** for security impact

## 🚀 Implementation Guide

### 1. **Environment Setup**

Copy the security configuration template:
```bash
cp security-config.example.env .env.local
```

Update the following critical values:
```env
ENCRYPTION_KEY=your-32-character-encryption-key-here
JWT_SECRET=your-jwt-secret-key-here
SESSION_SECRET=your-session-secret-key-here
CSRF_SECRET=your-csrf-secret-key-here
```

### 2. **Middleware Configuration**

The security middleware is automatically applied to all routes. It provides:
- Security headers injection
- Rate limiting enforcement
- Suspicious activity detection
- IP whitelisting for admin routes

### 3. **Using Security Features**

#### **Secure Fetch Wrapper**
```javascript
import { useSecurity } from '../components/SecurityProvider';

const { secureFetch } = useSecurity();

// Automatically includes CSRF tokens and security headers
const response = await secureFetch('/api/orders', {
  method: 'POST',
  body: JSON.stringify(orderData)
});
```

#### **Input Validation**
```javascript
import { CommonSchemas } from '../utils/inputValidation';

// Validate user registration
const result = CommonSchemas.userRegistration.validate(userData);
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

#### **Rate Limiting**
```javascript
import { rateLimiters } from '../utils/rateLimit';

// Apply rate limiting to API endpoint
export default rateLimiters.login(async (req, res) => {
  // Your API logic here
});
```

## 🔧 Configuration Options

### **Rate Limiting**
```javascript
// Customize rate limits per endpoint
const RATE_LIMITS = {
  LOGIN: { windowMs: 15 * 60 * 1000, max: 5 },
  API_GENERAL: { windowMs: 15 * 60 * 1000, max: 100 },
  ADMIN: { windowMs: 15 * 60 * 1000, max: 50 }
};
```

### **Security Headers**
```javascript
// Customize Content Security Policy
const cspPolicy = {
  'default-src': "'self'",
  'script-src': "'self' 'unsafe-inline'",
  'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com"
};
```

### **File Upload Limits**
```javascript
// Configure file upload security
const fileUploadConfig = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
  allowedExtensions: ['jpg', 'jpeg', 'png', 'gif']
};
```

## 🚨 Security Monitoring

### **Alert Types**
- **Critical**: Immediate attention required (multiple failed logins, SQL injection attempts)
- **Warning**: Suspicious activity detected (CSP violations, unusual traffic patterns)
- **Info**: Normal security events (successful logins, file uploads)

### **Monitoring Dashboard**
Access security metrics at `/admin/security` (admin only):
- Real-time security alerts
- Rate limiting statistics
- Failed authentication attempts
- CSP violation reports
- System security health

## 🧪 Security Testing

### **Automated Tests**
```bash
# Run security tests
npm run test:security

# Test rate limiting
npm run test:rate-limit

# Test input validation
npm run test:validation
```

### **Manual Testing Checklist**
- [ ] XSS protection (try injecting `<script>alert('xss')</script>`)
- [ ] SQL injection protection (try `'; DROP TABLE users; --`)
- [ ] CSRF protection (test forms without tokens)
- [ ] Rate limiting (exceed request limits)
- [ ] File upload security (try uploading malicious files)
- [ ] Authentication bypass attempts
- [ ] Session hijacking tests
- [ ] Admin route access controls

## 🔒 Security Best Practices

### **For Developers**
1. **Always validate and sanitize user inputs**
2. **Use the secure fetch wrapper for API calls**
3. **Implement proper error handling without information leakage**
4. **Follow the principle of least privilege**
5. **Keep dependencies updated**
6. **Review security logs regularly**

### **For Administrators**
1. **Monitor security alerts daily**
2. **Update IP whitelists as needed**
3. **Review failed authentication attempts**
4. **Perform regular security audits**
5. **Keep backup and recovery plans updated**
6. **Train staff on security procedures**

## 📋 Security Compliance

### **Standards Compliance**
- **OWASP Top 10** protection implemented
- **GDPR** privacy controls ready
- **PCI DSS** payment security guidelines followed
- **ISO 27001** security management principles applied

### **Regular Security Tasks**
- **Weekly**: Review security logs and alerts
- **Monthly**: Update security configurations
- **Quarterly**: Conduct security assessments
- **Annually**: Full security audit and penetration testing

## 🆘 Incident Response

### **Security Incident Procedure**
1. **Immediate Response**: Isolate affected systems
2. **Assessment**: Determine scope and impact
3. **Containment**: Stop the attack and prevent spread
4. **Eradication**: Remove malicious code/access
5. **Recovery**: Restore systems and services
6. **Lessons Learned**: Update security measures

### **Emergency Contacts**
- **Security Team**: security@kalamkar.art
- **System Administrator**: admin@kalamkar.art
- **Development Team**: dev@kalamkar.art

## 📚 Additional Resources

- [OWASP Security Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [Supabase Security Documentation](https://supabase.com/docs/guides/auth/security)

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Maintained by**: Kalamkar Security Team

For security questions or to report vulnerabilities, please contact: security@kalamkar.art

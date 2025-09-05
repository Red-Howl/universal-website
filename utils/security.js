import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Input validation utilities
export const validation = {
  // Email validation
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  },
  
  // Phone validation (Indian format)
  phone: (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  },
  
  // Name validation
  name: (name) => {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return nameRegex.test(name.trim());
  },
  
  // Password strength validation
  password: (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },
  
  // URL validation
  url: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  
  // Numeric validation
  number: (value, min = null, max = null) => {
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    if (min !== null && num < min) return false;
    if (max !== null && num > max) return false;
    return true;
  },
  
  // String length validation
  stringLength: (str, min = 0, max = Infinity) => {
    if (typeof str !== 'string') return false;
    return str.length >= min && str.length <= max;
  }
};

// Input sanitization utilities
export const sanitize = {
  // HTML sanitization
  html: (input) => {
    if (typeof input !== 'string') return '';
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },
  
  // SQL injection prevention
  sql: (input) => {
    if (typeof input !== 'string') return '';
    return input
      .replace(/'/g, "''")
      .replace(/;/g, '')
      .replace(/--/g, '')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '');
  },
  
  // Remove dangerous characters
  alphanumeric: (input) => {
    if (typeof input !== 'string') return '';
    return input.replace(/[^a-zA-Z0-9]/g, '');
  },
  
  // Clean filename
  filename: (input) => {
    if (typeof input !== 'string') return '';
    return input
      .replace(/[^a-zA-Z0-9._-]/g, '')
      .substring(0, 255);
  },
  
  // Phone number sanitization
  phone: (input) => {
    if (typeof input !== 'string') return '';
    return input.replace(/\D/g, '').substring(0, 10);
  },
  
  // Trim and clean string
  string: (input) => {
    if (typeof input !== 'string') return '';
    return input.trim().replace(/\s+/g, ' ');
  }
};

// Encryption utilities
export const encryption = {
  // Generate random salt
  generateSalt: (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
  },
  
  // Hash password with salt
  hashPassword: (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  },
  
  // Verify password
  verifyPassword: (password, hash, salt) => {
    const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
  },
  
  // Encrypt sensitive data
  encrypt: (text, key = process.env.ENCRYPTION_KEY) => {
    if (!key) throw new Error('Encryption key not provided');
    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  },
  
  // Decrypt sensitive data
  decrypt: (encryptedData, key = process.env.ENCRYPTION_KEY) => {
    if (!key) throw new Error('Encryption key not provided');
    const algorithm = 'aes-256-gcm';
    const decipher = crypto.createDecipher(algorithm, key);
    
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  },
  
  // Generate secure token
  generateToken: (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
  },
  
  // Generate CSRF token
  generateCSRFToken: () => {
    return crypto.randomBytes(32).toString('base64');
  }
};

// Security logging
export const securityLogger = {
  logSecurityEvent: (event, details, severity = 'INFO') => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      event,
      details,
      severity,
      userAgent: details.userAgent || 'Unknown',
      ip: details.ip || 'Unknown'
    };
    
    console.log(`[SECURITY-${severity}] ${timestamp}:`, logEntry);
    
    // In production, send to security monitoring service
    if (process.env.NODE_ENV === 'production' && severity === 'CRITICAL') {
      // Send alert to security team
      // Example: sendSecurityAlert(logEntry);
    }
  },
  
  logLoginAttempt: (email, success, ip, userAgent) => {
    securityLogger.logSecurityEvent('LOGIN_ATTEMPT', {
      email,
      success,
      ip,
      userAgent
    }, success ? 'INFO' : 'WARNING');
  },
  
  logSuspiciousActivity: (activity, ip, userAgent) => {
    securityLogger.logSecurityEvent('SUSPICIOUS_ACTIVITY', {
      activity,
      ip,
      userAgent
    }, 'CRITICAL');
  },
  
  logDataAccess: (table, action, userId, ip) => {
    securityLogger.logSecurityEvent('DATA_ACCESS', {
      table,
      action,
      userId,
      ip
    }, 'INFO');
  }
};

// CSRF protection
export const csrf = {
  generateToken: () => {
    return encryption.generateCSRFToken();
  },
  
  verifyToken: (token, sessionToken) => {
    return token === sessionToken;
  },
  
  middleware: (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
      const token = req.headers['x-csrf-token'] || req.body._csrf;
      const sessionToken = req.session?.csrfToken;
      
      if (!csrf.verifyToken(token, sessionToken)) {
        return res.status(403).json({ error: 'Invalid CSRF token' });
      }
    }
    next();
  }
};

// Content Security Policy helpers
export const csp = {
  generateNonce: () => {
    return crypto.randomBytes(16).toString('base64');
  },
  
  buildPolicy: (nonce) => {
    return {
      'default-src': "'self'",
      'script-src': `'self' 'nonce-${nonce}' 'unsafe-inline'`,
      'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
      'font-src': "'self' https://fonts.gstatic.com",
      'img-src': "'self' data: https: blob:",
      'connect-src': "'self' https://api.supabase.co https://*.supabase.co wss://*.supabase.co"
    };
  }
};

// File upload security
export const fileUpload = {
  // Allowed file types
  allowedTypes: {
    images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    documents: ['application/pdf', 'text/plain'],
    all: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain']
  },
  
  // Max file sizes (in bytes)
  maxSizes: {
    image: 5 * 1024 * 1024, // 5MB
    document: 10 * 1024 * 1024, // 10MB
    default: 2 * 1024 * 1024 // 2MB
  },
  
  // Validate file
  validateFile: (file, type = 'all') => {
    const errors = [];
    
    // Check file type
    if (!fileUpload.allowedTypes[type].includes(file.type)) {
      errors.push('File type not allowed');
    }
    
    // Check file size
    const maxSize = fileUpload.maxSizes[type] || fileUpload.maxSizes.default;
    if (file.size > maxSize) {
      errors.push(`File too large. Max size: ${maxSize / 1024 / 1024}MB`);
    }
    
    // Check filename
    if (!file.name || file.name.length > 255) {
      errors.push('Invalid filename');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  },
  
  // Generate safe filename
  generateSafeFilename: (originalName, userId) => {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop();
    const safeName = sanitize.filename(originalName.split('.')[0]);
    return `${userId}_${timestamp}_${safeName}.${extension}`;
  }
};

// Session security
export const session = {
  // Generate secure session ID
  generateSessionId: () => {
    return encryption.generateToken(64);
  },
  
  // Validate session
  validateSession: (sessionData) => {
    if (!sessionData || !sessionData.id || !sessionData.userId) {
      return false;
    }
    
    // Check session expiry
    if (sessionData.expiresAt && new Date() > new Date(sessionData.expiresAt)) {
      return false;
    }
    
    return true;
  },
  
  // Create secure session
  createSession: (userId, duration = 24 * 60 * 60 * 1000) => { // 24 hours default
    return {
      id: session.generateSessionId(),
      userId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + duration),
      csrfToken: csrf.generateToken()
    };
  }
};

// Database security helpers
export const dbSecurity = {
  // Sanitize database inputs
  sanitizeInput: (input) => {
    if (typeof input === 'string') {
      return sanitize.sql(input);
    }
    if (typeof input === 'object' && input !== null) {
      const sanitized = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[sanitize.alphanumeric(key)] = dbSecurity.sanitizeInput(value);
      }
      return sanitized;
    }
    return input;
  },
  
  // Validate database operation
  validateOperation: (table, operation, data) => {
    const allowedTables = ['products', 'orders', 'users', 'notifications'];
    const allowedOperations = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
    
    if (!allowedTables.includes(table)) {
      throw new Error('Invalid table name');
    }
    
    if (!allowedOperations.includes(operation.toUpperCase())) {
      throw new Error('Invalid operation');
    }
    
    return true;
  }
};

export default {
  validation,
  sanitize,
  encryption,
  securityLogger,
  csrf,
  csp,
  fileUpload,
  session,
  dbSecurity
};

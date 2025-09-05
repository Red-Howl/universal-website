import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Security Context
const SecurityContext = createContext({});

// Security Provider Component
export function SecurityProvider({ children }) {
  const [csrfToken, setCsrfToken] = useState(null);
  const [securityConfig, setSecurityConfig] = useState({
    enforceHttps: process.env.NODE_ENV === 'production',
    enableCSRF: true,
    enableXSSProtection: true,
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  });
  const [securityAlerts, setSecurityAlerts] = useState([]);

  // Generate and fetch CSRF token
  const generateCSRFToken = async () => {
    try {
      const response = await fetch('/api/security/csrf', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setCsrfToken(data.csrfToken);
        return data.csrfToken;
      } else {
        console.error('Failed to generate CSRF token');
        return null;
      }
    } catch (error) {
      console.error('Error generating CSRF token:', error);
      return null;
    }
  };

  // Validate CSRF token
  const validateCSRFToken = async (token) => {
    try {
      const response = await fetch('/api/security/validate-csrf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
        credentials: 'include',
      });
      
      const data = await response.json();
      return data.valid;
    } catch (error) {
      console.error('Error validating CSRF token:', error);
      return false;
    }
  };

  // Secure fetch wrapper
  const secureFetch = async (url, options = {}) => {
    // Ensure CSRF token is included for state-changing requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method?.toUpperCase())) {
      if (!csrfToken) {
        await generateCSRFToken();
      }
      
      options.headers = {
        ...options.headers,
        'X-CSRF-Token': csrfToken,
      };
    }
    
    // Add security headers
    options.headers = {
      ...options.headers,
      'X-Requested-With': 'XMLHttpRequest',
      'Cache-Control': 'no-cache',
    };
    
    // Ensure credentials are included
    options.credentials = 'include';
    
    try {
      const response = await fetch(url, options);
      
      // Check for security-related response headers
      const securityHeaders = {
        'X-Frame-Options': response.headers.get('X-Frame-Options'),
        'X-Content-Type-Options': response.headers.get('X-Content-Type-Options'),
        'X-XSS-Protection': response.headers.get('X-XSS-Protection'),
        'Strict-Transport-Security': response.headers.get('Strict-Transport-Security'),
      };
      
      // Log any missing security headers (in development)
      if (process.env.NODE_ENV === 'development') {
        Object.entries(securityHeaders).forEach(([header, value]) => {
          if (!value) {
            console.warn(`Missing security header: ${header}`);
          }
        });
      }
      
      return response;
    } catch (error) {
      console.error('Secure fetch error:', error);
      throw error;
    }
  };

  // Content Security Policy violation handler
  const handleCSPViolation = (violationEvent) => {
    const violation = {
      documentURI: violationEvent.documentURI,
      referrer: violationEvent.referrer,
      blockedURI: violationEvent.blockedURI,
      violatedDirective: violationEvent.violatedDirective,
      originalPolicy: violationEvent.originalPolicy,
      timestamp: new Date().toISOString(),
    };
    
    console.warn('CSP Violation:', violation);
    
    // Add to security alerts
    addSecurityAlert({
      type: 'csp_violation',
      message: `Content Security Policy violation: ${violation.violatedDirective}`,
      details: violation,
      severity: 'warning',
    });
    
    // Report to security endpoint (in production)
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/security/report-violation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'csp', violation }),
      }).catch(console.error);
    }
  };

  // XSS detection
  const detectXSS = (input) => {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /<object[^>]*>.*?<\/object>/gi,
      /<embed[^>]*>.*?<\/embed>/gi,
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
  };

  // Sanitize input
  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };

  // Add security alert
  const addSecurityAlert = (alert) => {
    const newAlert = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      ...alert,
    };
    
    setSecurityAlerts(prev => [...prev, newAlert]);
    
    // Auto-remove alerts after 5 minutes
    setTimeout(() => {
      setSecurityAlerts(prev => prev.filter(a => a.id !== newAlert.id));
    }, 5 * 60 * 1000);
  };

  // Clear security alert
  const clearSecurityAlert = (alertId) => {
    setSecurityAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  // Session timeout handler
  const handleSessionTimeout = () => {
    addSecurityAlert({
      type: 'session_timeout',
      message: 'Your session has expired for security reasons',
      severity: 'warning',
    });
    
    // Sign out user
    supabase.auth.signOut();
  };

  // Initialize security features
  useEffect(() => {
    // Generate initial CSRF token
    generateCSRFToken();
    
    // Set up CSP violation handler
    document.addEventListener('securitypolicyviolation', handleCSPViolation);
    
    // Set up session timeout
    let sessionTimer;
    const resetSessionTimer = () => {
      clearTimeout(sessionTimer);
      sessionTimer = setTimeout(handleSessionTimeout, securityConfig.sessionTimeout);
    };
    
    // Reset timer on user activity
    const activities = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activities.forEach(activity => {
      document.addEventListener(activity, resetSessionTimer, true);
    });
    
    resetSessionTimer();
    
    // Check for HTTPS in production
    if (securityConfig.enforceHttps && process.env.NODE_ENV === 'production') {
      if (window.location.protocol !== 'https:') {
        window.location.replace(`https:${window.location.href.substring(window.location.protocol.length)}`);
      }
    }
    
    // Cleanup
    return () => {
      document.removeEventListener('securitypolicyviolation', handleCSPViolation);
      activities.forEach(activity => {
        document.removeEventListener(activity, resetSessionTimer, true);
      });
      clearTimeout(sessionTimer);
    };
  }, [securityConfig]);

  // Security context value
  const securityValue = {
    csrfToken,
    securityConfig,
    securityAlerts,
    generateCSRFToken,
    validateCSRFToken,
    secureFetch,
    detectXSS,
    sanitizeInput,
    addSecurityAlert,
    clearSecurityAlert,
    handleSessionTimeout,
  };

  return (
    <SecurityContext.Provider value={securityValue}>
      {children}
      {/* Security Alerts Component */}
      <SecurityAlerts />
    </SecurityContext.Provider>
  );
}

// Security Alerts Component
function SecurityAlerts() {
  const { securityAlerts, clearSecurityAlert } = useContext(SecurityContext);
  
  if (securityAlerts.length === 0) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 10000,
      maxWidth: '400px',
    }}>
      {securityAlerts.map(alert => (
        <div
          key={alert.id}
          style={{
            backgroundColor: alert.severity === 'critical' ? '#dc3545' : 
                           alert.severity === 'warning' ? '#ffc107' : '#17a2b8',
            color: alert.severity === 'warning' ? '#000' : '#fff',
            padding: '12px 16px',
            borderRadius: '4px',
            marginBottom: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <strong>{alert.type.replace('_', ' ').toUpperCase()}</strong>
            <div style={{ fontSize: '14px', marginTop: '4px' }}>
              {alert.message}
            </div>
          </div>
          <button
            onClick={() => clearSecurityAlert(alert.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '0 4px',
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

// Hook to use security context
export function useSecurity() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}

// HOC for protected components
export function withSecurity(WrappedComponent) {
  return function SecurityWrappedComponent(props) {
    const security = useSecurity();
    
    return <WrappedComponent {...props} security={security} />;
  };
}

export default SecurityProvider;

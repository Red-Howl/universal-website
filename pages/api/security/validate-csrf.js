// CSRF Token Validation API endpoint
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { token } = req.body;
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    if (!token) {
      return res.status(400).json({
        error: 'CSRF token is required',
        valid: false
      });
    }
    
    // Validate CSRF token from database
    const { data: tokenData, error: fetchError } = await supabase
      .from('csrf_tokens')
      .select('*')
      .eq('token', token)
      .eq('is_used', false)
      .gte('expires_at', new Date().toISOString())
      .single();
    
    if (fetchError || !tokenData) {
      console.warn(`Invalid CSRF token attempt from IP: ${clientIP}`);
      return res.status(403).json({
        error: 'Invalid or expired CSRF token',
        valid: false
      });
    }
    
    // Additional security checks
    const currentIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const currentUserAgent = req.headers['user-agent'];
    
    // Check if IP matches (optional, can be disabled for mobile users)
    if (process.env.CSRF_STRICT_IP_CHECK === 'true' && tokenData.ip_address !== currentIP) {
      console.warn(`CSRF token IP mismatch: ${tokenData.ip_address} vs ${currentIP}`);
      return res.status(403).json({
        error: 'CSRF token IP mismatch',
        valid: false
      });
    }
    
    // Mark token as used (one-time use)
    const { error: updateError } = await supabase
      .from('csrf_tokens')
      .update({
        is_used: true,
        used_at: new Date().toISOString()
      })
      .eq('id', tokenData.id);
    
    if (updateError) {
      console.error('Failed to mark CSRF token as used:', updateError);
    }
    
    res.status(200).json({
      success: true,
      valid: true,
      message: 'CSRF token is valid',
      tokenId: tokenData.id
    });
    
  } catch (error) {
    console.error('CSRF validation error:', error);
    res.status(500).json({
      error: 'Failed to validate CSRF token',
      valid: false
    });
  }
}

// Middleware function for CSRF protection
export function csrfProtection(req, res, next) {
  // Skip CSRF for GET requests (they should be safe)
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }
  
  const token = req.headers['x-csrf-token'] || 
                req.body._csrf || 
                req.cookies['csrf-token'];
  
  if (!token) {
    return res.status(403).json({
      error: 'CSRF token missing',
      message: 'Request must include a valid CSRF token'
    });
  }
  
  // Validate token (this would typically be done synchronously with a session store)
  // For now, we'll do a quick format check
  if (typeof token !== 'string' || token.length < 32) {
    return res.status(403).json({
      error: 'Invalid CSRF token format'
    });
  }
  
  // In a real implementation, you'd validate against stored tokens
  // For now, we'll assume the token is valid if it passes format check
  next();
}

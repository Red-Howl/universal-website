// CSRF Token API endpoint
import { csrf } from '../../../utils/security';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  // Only allow GET requests for CSRF token generation
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Generate CSRF token
    const csrfToken = csrf.generateToken();
    
    // Get user session if available
    const authHeader = req.headers.authorization;
    let userId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (!error && user) {
          userId = user.id;
        }
      } catch (error) {
        // Continue without user ID if token is invalid
        console.warn('Invalid auth token for CSRF generation:', error.message);
      }
    }
    
    // Store CSRF token in database with expiration
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    
    const { error: insertError } = await supabase
      .from('csrf_tokens')
      .insert({
        token: csrfToken,
        user_id: userId,
        ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        user_agent: req.headers['user-agent'],
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString()
      });
    
    if (insertError) {
      console.error('Failed to store CSRF token:', insertError);
      // Continue anyway, token can still be used for basic protection
    }
    
    // Set CSRF token in cookie (httpOnly for security)
    res.setHeader('Set-Cookie', [
      `csrf-token=${csrfToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/`
    ]);
    
    // Also return token in response for client-side use
    res.status(200).json({
      success: true,
      csrfToken,
      expiresAt: expiresAt.toISOString(),
      message: 'CSRF token generated successfully'
    });
    
  } catch (error) {
    console.error('CSRF token generation failed:', error);
    res.status(500).json({
      error: 'Failed to generate CSRF token',
      message: 'Internal server error'
    });
  }
}

// Create CSRF tokens table if it doesn't exist
export async function createCSRFTokensTable() {
  const { error } = await supabase.rpc('create_csrf_tokens_table', {
    table_sql: `
      CREATE TABLE IF NOT EXISTS csrf_tokens (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        token VARCHAR(255) NOT NULL UNIQUE,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        ip_address INET,
        user_agent TEXT,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        used_at TIMESTAMP WITH TIME ZONE,
        is_used BOOLEAN DEFAULT FALSE
      );
      
      CREATE INDEX IF NOT EXISTS idx_csrf_tokens_token ON csrf_tokens(token);
      CREATE INDEX IF NOT EXISTS idx_csrf_tokens_user_id ON csrf_tokens(user_id);
      CREATE INDEX IF NOT EXISTS idx_csrf_tokens_expires_at ON csrf_tokens(expires_at);
      
      -- Clean up expired tokens
      CREATE OR REPLACE FUNCTION cleanup_expired_csrf_tokens()
      RETURNS void AS $$
      BEGIN
        DELETE FROM csrf_tokens WHERE expires_at < NOW();
      END;
      $$ LANGUAGE plpgsql;
    `
  });
  
  if (error) {
    console.error('Failed to create CSRF tokens table:', error);
  }
}

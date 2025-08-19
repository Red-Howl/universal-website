import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // --- NEW: State for the user's name
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (isSignUp) {
      // --- Sign Up Logic Updated ---
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName // Save the full name to the user's profile
          }
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Sign up successful! Please check your email to confirm your account.');
      }
    } else {
      // --- Login Logic (Unchanged) ---
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        if (email === 'admin@kalamkar.art') {
          router.push('/admin/products');
        } else {
          router.push('/shop');
        }
      }
    }
  };

  return (
    <>
      <style jsx>{`
        /* Styles are the same */
        .login-container { max-width: 400px; margin: 4rem auto; padding: 2rem; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .title { text-align: center; font-family: var(--font-playfair); color: var(--color-primary-teal); }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; }
        .form-group input { width: 100%; padding: 0.8rem; border: 1px solid #ccc; border-radius: 5px; }
        .submit-btn { width: 100%; padding: 1rem; background-color: var(--color-primary-teal); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; }
        .toggle-text { text-align: center; margin-top: 1rem; font-size: 0.9rem; }
        .toggle-text span { color: var(--color-primary-teal); font-weight: bold; cursor: pointer; }
        .message, .error-message { text-align: center; margin-top: 1rem; }
        .message { color: green; }
        .error-message { color: red; }
      `}</style>
      <div className="login-container">
        <h1 className="title">{isSignUp ? 'Create Account' : 'Login'}</h1>
        <form onSubmit={handleSubmit}>

          {/* --- NEW: This field only shows in signup mode --- */}
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="submit-btn">{isSignUp ? 'Sign Up' : 'Login'}</button>

          {error && <p className="error-message">{error}</p>}
          {message && <p className="message">{message}</p>}
        </form>
        <p className="toggle-text">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <span onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Login' : 'Sign Up'}
          </span>
        </p>
      </div>
    </>
  );
}
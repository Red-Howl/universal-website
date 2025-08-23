import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CartContext } from '../context/CartContext';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Navbar({ siteSettings }) {
  const { cart } = useContext(CartContext);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // --- NEW: States for notifications ---
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    }
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // --- NEW: Fetch notifications ---
    async function fetchNotifications() {
        const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
        if (data) {
            setNotifications(data);
            const lastSeenNotifId = localStorage.getItem('lastSeenNotifId');
            // Show red dot if there are notifications and the latest one is newer than the last one seen
            if (data.length > 0 && data[0].id > (parseInt(lastSeenNotifId) || 0)) {
                setHasUnread(true);
            }
        }
    }
    fetchNotifications();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // --- NEW: Function to handle bell click ---
  const handleBellClick = () => {
      setShowNotifications(!showNotifications);
      if (notifications.length > 0) {
          localStorage.setItem('lastSeenNotifId', notifications[0].id);
          setHasUnread(false);
      }
  }

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  // --- NEW: Prepare the WhatsApp link ---
  const contactPhone = siteSettings?.contact_phone || '';
  // Remove all non-digit characters to get a clean number for the link
  const formattedPhone = contactPhone.replace(/\D/g, '');
  const whatsappMessage = encodeURIComponent("hello kalamkar , i want to place a cutom order !");
  const whatsappLink = `https://wa.me/${formattedPhone}?text=${whatsappMessage}`;

  return (
    <>
      <style jsx>{`
        /* Updated styles */
        .nav { display: flex; flex-direction: column; align-items: center; padding: 1rem; background-color: var(--color-background-cream); border-bottom: 1px solid #eee; font-family: var(--font-lato); text-align: center; position: relative; }
        .logo-container { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); }
        .brand-link { text-decoration: none; color: var(--color-primary-teal); }
        .logo-img { height: 50px; width: 50px; border-radius: 50%; object-fit: cover; }
        .logo-text { font-size: 1.8rem; font-weight: bold; font-family: var(--font-playfair); }
        .main-nav-links { display: flex; flex-direction: column; gap: 1rem; list-style: none; padding: 0; margin: 1rem 0; }
        .main-nav-links a { color: #2c2c2c; text-decoration: none; font-weight: 600; }
        .right-nav { display: flex; align-items: center; gap: 1.5rem; }
        .auth-links { display: flex; gap: 1rem; align-items: center; }
        .auth-links a { color: #2c2c2c; text-decoration: none; font-weight: 600; }
        .logout-btn { background: none; border: none; cursor: pointer; font-family: inherit; font-size: 1rem; color: #2c2c2c; font-weight: 600; }
        .cart-container { position: relative; color: #2c2c2c; text-decoration: none; font-weight: 600; }
        .cart-count { position: absolute; top: -10px; right: -10px; background-color: var(--color-accent-gold); color: white; border-radius: 50%; width: 22px; height: 22px; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        
        /* Mobile navigation reorganization */
        .mobile-nav-row { display: flex; justify-content: space-between; align-items: center; width: 100%; margin: 0.5rem 0; }
        .mobile-nav-row a, .mobile-nav-row button { color: #2c2c2c; text-decoration: none; font-weight: 600; font-size: 0.9rem; }
        .mobile-custom-order { color: #2c2c2c; text-decoration: none; font-weight: 600; }

        /* New styles for notifications */
        .notifications-container { position: relative; }
        .notification-bell { cursor: pointer; position: relative; font-size: 1.5rem; }
        .unread-dot { position: absolute; top: 0px; right: 0px; width: 8px; height: 8px; background-color: red; border-radius: 50%; }
        .notifications-dropdown { position: absolute; top: 100%; right: 0; background-color: white; border: 1px solid #ddd; border-radius: px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); width: 300px; max-height: 400px; overflow-y: auto; z-index: 1000; margin-top: 15px; text-align: left; }
        .notification-item { padding: 1rem; border-bottom: 1px solid #eee; }
        .notification-item:last-child { border-bottom: none; }
        .notification-date { font-size: 0.8em; color: #888; margin-top: 5px; }

        @media (min-width: 768px) { 
          .nav { flex-direction: row; justify-content: center; padding: 1rem 2rem; align-items: center; }
          .mobile-nav-row { display: none; }
          .main-nav-links { flex-direction: row; gap: 1.5rem; margin: 0; display: flex; }
          .right-nav { display: flex; position: absolute; right: 2rem; }
        }
      `}</style>

      <nav className="nav">
        <div className="logo-container">
          {siteSettings?.logo_url && (
            <img src={siteSettings.logo_url} alt="Kalamkar Logo" className="logo-img" />
          )}
        </div>
        
        <Link href="/" className="brand-link">
          <span className="logo-text">Kalamkar</span>
        </Link>

        {/* Mobile Navigation Layout */}
        <div className="mobile-nav-row">
          {user ? (
            <>
              <Link href="/account/orders">My Account</Link>
              <Link href="/shop">Shop</Link>
              <Link href="/cart" className="cart-container">
                Cart
                {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
              </Link>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/shop">Shop</Link>
              <Link href="/cart" className="cart-container">
                Cart
                {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
              </Link>
            </>
          )}
        </div>

        <div className="mobile-nav-row">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="mobile-custom-order">
            Custom Order
          </a>
          
          {/* Notifications Bell */}
          <div className="notifications-container">
              <div className="notification-bell" onClick={handleBellClick}>
                  <span>🔔</span>
                  {hasUnread && <div className="unread-dot"></div>}
              </div>
              {showNotifications && (
                  <div className="notifications-dropdown">
                      {notifications.length > 0 ? (
                          notifications.map(notif => (
                              <div key={notif.id} className="notification-item">
                                  <p>{notif.message}</p>
                                  <p className="notification-date">{new Date(notif.created_at).toLocaleDateString()}</p>
                              </div>
                          ))
                      ) : <div className="notification-item">No new announcements.</div>}
                  </div>
              )}
          </div>
        </div>

        {/* Desktop Navigation (hidden on mobile) */}
        <ul className="main-nav-links">
          <li><Link href="/shop">Shop</Link></li>
          <li>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              Custom Order
            </a>
          </li>
        </ul>

        <div className="right-nav">
          <div className="auth-links">
            {user ? (
              <>
                <Link href="/account/orders">My Account</Link>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </>
            ) : (
              <Link href="/login">Login</Link>
            )}
          </div>

          <div className="notifications-container">
              <div className="notification-bell" onClick={handleBellClick}>
                  <span>🔔</span>
                  {hasUnread && <div className="unread-dot"></div>}
              </div>
              {showNotifications && (
                  <div className="notifications-dropdown">
                      {notifications.length > 0 ? (
                          notifications.map(notif => (
                              <div key={notif.id} className="notification-item">
                                  <p>{notif.message}</p>
                                  <p className="notification-date">{new Date(notif.created_at).toLocaleDateString()}</p>
                              </div>
                          ))
                      ) : <div className="notification-item">No new announcements.</div>}
                  </div>
              )}
          </div>

          <Link href="/cart" className="cart-container">
            🛒
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Link>
        </div>
      </nav>
    </>
  );
}
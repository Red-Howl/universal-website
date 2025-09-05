
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

  // States for notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    }
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Fetch notifications
    async function fetchNotifications() {
        const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
        if (data) {
            setNotifications(data);
            // Count unread notifications (notifications that haven't been marked as read)
            const unread = data.filter(notif => !notif.is_read);
            setUnreadCount(unread.length);
        }
    }
    fetchNotifications();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Apply dynamic CSS variables from site settings (theme colors)
  useEffect(() => {
    if (!siteSettings) return;
    const root = document.documentElement;
    const map = {
      'color_primary': '--cfg-color-primary',
      'color_secondary': '--cfg-color-secondary',
      'color_accent': '--cfg-color-accent',
      'color_light_grey': '--cfg-color-light-grey',
      'color_medium_grey': '--cfg-color-medium-grey',
      'color_dark_grey': '--cfg-color-dark-grey',
      'color_border': '--cfg-color-border',
      'color_hover': '--cfg-color-hover',
      'color_success': '--cfg-color-success',
      'color_error': '--cfg-color-error',
      'color_warning': '--cfg-color-warning',
      'color_white': '--cfg-color-white',
      'color_black': '--cfg-color-black',
      'color_card_bg': '--cfg-color-card-bg',
      'color_page_bg': '--cfg-color-page-bg'
    };
    Object.entries(map).forEach(([key, cssVar]) => {
      if (siteSettings[key]) root.style.setProperty(cssVar, siteSettings[key]);
    });
  }, [siteSettings]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Remove the handleBellClick function since we're now using Link

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Prepare the WhatsApp link
  const contactPhone = siteSettings?.contact_phone || '';
  const formattedPhone = contactPhone.replace(/\D/g, '');
  const whatsappMessage = encodeURIComponent("hello kalamkar , i want to place a cutom order !");
  const whatsappLink = `https://wa.me/${formattedPhone}?text=${whatsappMessage}`;

  return (
    <>
      <style jsx>{`
        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          background-color: var(--color-card-bg);
          border-bottom: 1px solid var(--color-border);
          font-family: var(--font-lato);
          position: relative;
          box-shadow: var(--shadow-light);
        }

        .logo-container {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .logo-img {
          height: 50px;
          width: 50px;
          border-radius: 50%;
          object-fit: cover;
        }

        .center-brand {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .brand-link {
          text-decoration: none;
          color: var(--color-dark-grey);
        }

        .logo-text {
          font-size: 1.8rem;
          font-weight: normal;
          font-family: var(--font-playfair);
          color: var(--color-dark-grey);
        }

        .nav-items {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex: 1;
          justify-content: flex-end;
        }

        .nav-items a {
          color: var(--color-dark-grey);
          text-decoration: none;
          font-weight: normal;
          font-size: 1rem;
          transition: color 0.3s ease;
        }

        .nav-items a:hover {
          color: var(--color-primary);
        }

        .logout-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: 1rem;
          color: var(--color-dark-grey);
          font-weight: normal;
          transition: color 0.3s ease;
        }

        .logout-btn:hover {
          color: var(--color-primary);
        }

        .cart-container {
          position: relative;
          color: var(--color-dark-grey);
          text-decoration: none;
          font-weight: normal;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          transition: color 0.3s ease;
        }

        .cart-container.has-items {
          color: var(--color-primary) !important;
        }

        .cart-count {
          position: absolute;
          top: -10px;
          right: -10px;
          background-color: var(--color-accent-gold);
          color: white;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: normal;
        }

        .notifications-container {
          position: relative;
        }

        .notification-bell {
          cursor: pointer;
          position: relative;
          font-size: 1.5rem;
          text-decoration: none;
          color: #2c2c2c;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .notification-bell:hover {
          transform: scale(1.1);
          color: var(--color-primary-teal);
        }

        .notification-count {
          position: absolute;
          top: -8px;
          right: -8px;
          background-color: #EF4444;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          animation: pulse 2s infinite;
        }



        .notifications-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 5px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          width: 300px;
          max-height: 400px;
          overflow-y: auto;
          z-index: 1000;
          margin-top: 15px;
          text-align: left;
        }

        .notification-item {
          padding: 1rem;
          border-bottom: 1px solid #eee;
        }

        .notification-item:last-child {
          border-bottom: none;
        }

        .notification-date {
          font-size: 0.8em;
          color: #888;
          margin-top: 5px;
        }

        @media (max-width: 768px) {
          .nav {
            flex-direction: column;
            padding: 1rem;
            gap: 1rem;
          }

          .logo-container {
            justify-content: center;
          }

          .center-brand {
            position: static;
            transform: none;
          }

          .nav-items {
            justify-content: center;
            flex-wrap: wrap;
            gap: 1.5rem;
          }
        }
      `}</style>

      <nav className="nav slide-in-down">
        <div className="logo-container">
          {siteSettings?.logo_url && (
            <img src={siteSettings.logo_url} alt="Kalamkar Logo" className="logo-img scale-on-hover" />
          )}
        </div>
        
        <div className="center-brand">
          <Link href="/" className="brand-link scale-on-hover">
            <span className="logo-text">Kalamkar</span>
          </Link>
        </div>

        <div className="nav-items stagger-animation">
          {user ? (
            <Link href="/account/orders" className="btn-animate">My Account</Link>
          ) : (
            <Link href="/login" className="btn-animate">Login</Link>
          )}
          
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-animate">
             Custom order
          </a>
          
          <Link href="/shop" className="btn-animate">Shop</Link>
          
          <Link 
            href="/cart" 
            className={`cart-container btn-animate ${itemCount > 0 ? 'has-items' : ''}`}
            style={{ color: itemCount > 0 ? 'var(--color-primary)' : 'var(--color-dark-grey)' }}
          >
           Cart
          </Link>

          <div className="notifications-container">
            <Link href="/notifications" className="notification-bell bounce-animate">
              <span>🔔</span>
              {unreadCount > 0 && (
                <span className="notification-count pulse-animate">{unreadCount}</span>
              )}
            </Link>
          </div>

          {user && (
            <button onClick={handleLogout} className="logout-btn btn-animate">Logout</button>
          )}
        </div>
      </nav>
    </>
  );
}

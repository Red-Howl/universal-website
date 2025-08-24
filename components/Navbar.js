
import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CartContext } from '../context/CartContext';
import { supabase } from '../lib/supabase';

export default function Navbar({ siteSettings }) {
  const { cart } = useContext(CartContext);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // States for notifications
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

    // Fetch notifications
    async function fetchNotifications() {
        const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
        if (data) {
            setNotifications(data);
            const lastSeenNotifId = localStorage.getItem('lastSeenNotifId');
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

  // Function to handle bell click
  const handleBellClick = () => {
      setShowNotifications(!showNotifications);
      if (notifications.length > 0) {
          localStorage.setItem('lastSeenNotifId', notifications[0].id);
          setHasUnread(false);
      }
  }

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
          background-color: var(--color-background-cream);
          border-bottom: 1px solid #eee;
          font-family: var(--font-lato);
          position: relative;
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
          color: var(--color-primary-teal);
        }

        .logo-text {
          font-size: 1.8rem;
          font-weight: normal;
          font-family: var(--font-playfair);
        }

        .nav-items {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex: 1;
          justify-content: flex-end;
        }

        .nav-items a {
          color: #2c2c2c;
          text-decoration: none;
          font-weight: normal;
          font-size: 1rem;
        }

        .nav-items a:hover {
          color: var(--color-primary-teal);
        }

        .logout-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: 1rem;
          color: #2c2c2c;
          font-weight: normal;
        }

        .logout-btn:hover {
          color: var(--color-primary-teal);
        }

        .cart-container {
          position: relative;
          color: #2c2c2c;
          text-decoration: none;
          font-weight: normal;
          display: flex;
          align-items: center;
          gap: 0.3rem;
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
        }

        .unread-dot {
          position: absolute;
          top: 0px;
          right: 0px;
          width: 8px;
          height: 8px;
          background-color: red;
          border-radius: 50%;
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

      <nav className="nav">
        <div className="logo-container">
          {siteSettings?.logo_url && (
            <img src={siteSettings.logo_url} alt="Kalamkar Logo" className="logo-img" />
          )}
        </div>
        
        <div className="center-brand">
          <Link href="/" className="brand-link">
            <span className="logo-text">Kalamkar</span>
          </Link>
        </div>

        <div className="nav-items">
          {user ? (
            <Link href="/account/orders">My Account</Link>
          ) : (
            <Link href="/login">Login</Link>
          )}
          
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
             Custom order
          </a>
          
          <Link href="/shop">Shop</Link>
          
          <Link href="/cart" className="cart-container">
           Cart
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Link>

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

          {user && (
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          )}
        </div>
      </nav>
    </>
  );
}

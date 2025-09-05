import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
    markAllAsRead();
  }, []);

  async function fetchNotifications() {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }

  async function markAllAsRead() {
    try {
      // Mark all notifications as read when user opens the notifications page
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedNotification(null);
  };

  const closePopup = () => {
    router.back();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'announcement':
        return '📢';
      case 'promotion':
        return '🎉';
      case 'update':
        return '🔄';
      case 'maintenance':
        return '🔧';
      default:
        return '📋';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'announcement':
        return '#3b82f6';
      case 'promotion':
        return '#10b981';
      case 'update':
        return '#f59e0b';
      case 'maintenance':
        return '#ef4444';
      default:
        return '#8b5cf6';
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white',
          animation: 'pulse 2s infinite'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
          <div style={{ fontSize: '1.5rem' }}>Loading notifications...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0, -30px, 0);
          }
          70% {
            transform: translate3d(0, -15px, 0);
          }
          90% {
            transform: translate3d(0, -4px, 0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        .page-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          z-index: 1000;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          font-family: var(--font-lato), sans-serif;
          animation: fadeInUp 0.3s ease-out;
        }

        .notifications-popup {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          width: 100%;
          max-width: 500px;
          height: 70vh;
          border-radius: 25px 25px 0 0;
          padding: 2rem 1.5rem;
          box-shadow: 0 -10px 30px rgba(0,0,0,0.1);
          animation: slideInUp 0.4s ease-out;
          overflow-y: auto;
          position: relative;
          border: 1px solid rgba(255,255,255,0.8);
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
          animation: fadeInUp 0.8s ease-out;
        }

        .header h1 {
          color: #1e293b;
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          text-shadow: none;
        }

        .header p {
          color: #64748b;
          font-size: 1rem;
          margin: 0;
        }

        .close-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255,255,255,0.8);
          border: 1px solid rgba(226,232,240,0.5);
          color: #64748b;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          cursor: pointer;
        }

        .close-button:hover {
          background: rgba(255,255,255,1);
          color: #1e293b;
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .drag-handle {
          width: 40px;
          height: 4px;
          background: rgba(148,163,184,0.4);
          border-radius: 2px;
          margin: 0 auto 1rem auto;
          cursor: grab;
        }

        .notifications-container {
          max-width: 100%;
          margin: 0;
        }

        .notification-card {
          background: rgba(255,255,255,0.9);
          border-radius: 15px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(226,232,240,0.3);
          animation: slideInRight 0.6s ease-out;
          animation-fill-mode: both;
        }

        .notification-card:nth-child(1) { animation-delay: 0.1s; }
        .notification-card:nth-child(2) { animation-delay: 0.2s; }
        .notification-card:nth-child(3) { animation-delay: 0.3s; }
        .notification-card:nth-child(4) { animation-delay: 0.4s; }
        .notification-card:nth-child(5) { animation-delay: 0.5s; }

        .notification-card:hover {
          transform: translateY(-3px) scale(1.01);
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
          border-color: rgba(226,232,240,0.6);
        }

        .notification-header {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }

        .notification-icon {
          font-size: 2rem;
          margin-right: 1rem;
          animation: bounce 2s infinite;
        }

        .notification-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
          flex: 1;
        }

        .notification-date {
          color: #94a3b8;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .notification-message {
          color: #475569;
          line-height: 1.6;
          font-size: 1.1rem;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .notification-type-badge {
          display: inline-block;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 1rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #64748b;
          animation: fadeInUp 0.8s ease-out;
        }

        .empty-state-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: pulse 2s infinite;
        }

        .empty-state h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          font-weight: 300;
          color: #1e293b;
        }

        .empty-state p {
          font-size: 1.1rem;
          opacity: 0.8;
          margin: 0;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeInUp 0.3s ease-out;
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 3rem;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
          animation: slideInRight 0.4s ease-out;
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #718096;
          transition: color 0.3s ease;
        }

        .modal-close:hover {
          color: #2D3748;
        }

        .modal-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          animation: bounce 2s infinite;
        }

        .modal-title {
          font-size: 2rem;
          font-weight: 600;
          color: #2D3748;
          margin-bottom: 1rem;
        }

        .modal-message {
          color: #4A5568;
          line-height: 1.8;
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }

        .modal-date {
          color: #718096;
          font-size: 1rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .notifications-popup {
            height: 80vh;
            border-radius: 20px 20px 0 0;
            padding: 1.5rem 1rem;
          }

          .header h1 {
            font-size: 1.8rem;
          }

          .notification-card {
            padding: 1.2rem;
          }

          .notification-title {
            font-size: 1.2rem;
          }

          .modal-content {
            padding: 2rem;
            margin: 1rem;
          }
        }
      `}</style>

      <div className="page-container" onClick={closePopup}>
        <div className="notifications-popup" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={closePopup}>
            ×
          </button>
          
          <div className="drag-handle"></div>

          <div className="header">
            <h1>📢 Notifications</h1>
            <p>Stay updated with the latest announcements</p>
          </div>

          <div className="notifications-container">
          {notifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔔</div>
              <h2>No notifications yet</h2>
              <p>We&apos;ll notify you when there are important updates!</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div 
                key={notification.id} 
                className="notification-card"
                onClick={() => handleNotificationClick(notification)}
                style={{
                  borderLeft: `5px solid ${getNotificationColor(notification.type || 'default')}`
                }}
              >
                <div className="notification-header">
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type || 'default')}
                  </div>
                  <h3 className="notification-title">
                    {notification.title || 'Untitled Notification'}
                  </h3>
                  <div className="notification-date">
                    {formatDate(notification.created_at)}
                  </div>
                </div>
                
                <p className="notification-message">
                  {notification.message}
                </p>
                
                                 <div 
                   className="notification-type-badge"
                   style={{
                     backgroundColor: `${getNotificationColor(notification.type || 'default')}15`,
                     color: getNotificationColor(notification.type || 'default'),
                     border: `1px solid ${getNotificationColor(notification.type || 'default')}30`
                   }}
                 >
                   {notification.type || 'announcement'}
                 </div>
              </div>
            ))
          )}
          </div>
        </div>

        {showModal && selectedNotification && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>×</button>
              
              <div className="modal-icon">
                {getNotificationIcon(selectedNotification.type || 'default')}
              </div>
              
              <h2 className="modal-title">
                {selectedNotification.title || 'Untitled Notification'}
              </h2>
              
              <p className="modal-message">
                {selectedNotification.message}
              </p>
              
              <div className="modal-date">
                {formatDate(selectedNotification.created_at)}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

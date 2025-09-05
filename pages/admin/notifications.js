import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Schedule states
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);

  useEffect(() => {
    fetchNotifications();
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
      setErrorMessage('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!message.trim() || !title.trim()) {
      setErrorMessage('Please fill in both title and message');
      return;
    }

    // Check if scheduled and validate date/time
    if (isScheduled) {
      if (!scheduledDate || !scheduledTime) {
        setErrorMessage('Please select both date and time for scheduling');
        return;
      }
      
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      if (scheduledDateTime <= new Date()) {
        setErrorMessage('Scheduled date and time must be in the future');
        return;
      }
    }

    setSending(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const notificationData = {
        title: title.trim(),
        message: message.trim(),
        created_at: new Date().toISOString()
      };

      // Add scheduling data if scheduled
      if (isScheduled) {
        notificationData.scheduled_at = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
        notificationData.is_scheduled = true;
      }

      const { error } = await supabase
        .from('notifications')
        .insert([notificationData]);

      if (error) throw error;

      setTitle('');
      setMessage('');
      setScheduledDate('');
      setScheduledTime('');
      setIsScheduled(false);
      
      const successMsg = isScheduled 
        ? `Notification scheduled for ${scheduledDate} at ${scheduledTime}!`
        : 'Notification sent successfully!';
      
      setSuccessMessage(successMsg);
      await fetchNotifications();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error sending notification:', error);
      setErrorMessage('Failed to send notification: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSuccessMessage('Notification deleted successfully!');
      await fetchNotifications();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting notification:', error);
      setErrorMessage('Failed to delete notification: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      return new Date(dateString).toLocaleString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          Loading notifications...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }} className="page-fade-in">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }} className="slide-in-down">Notification Management</h1>

        {/* Messages */}
        {successMessage && (
          <div style={{ 
            background: '#d4edda', 
            color: '#155724', 
            padding: '1rem', 
            borderRadius: '5px', 
            marginBottom: '1rem',
            border: '1px solid #c3e6cb'
          }}>
            ✅ {successMessage}
          </div>
        )}
        {errorMessage && (
          <div style={{ 
            background: '#f8d7da', 
            color: '#721c24', 
            padding: '1rem', 
            borderRadius: '5px', 
            marginBottom: '1rem',
            border: '1px solid #f5c6cb'
          }}>
            ❌ {errorMessage}
          </div>
        )}

        {/* Send New Notification */}
        <div style={{ 
          background: 'var(--color-card-bg)', 
          padding: '2rem', 
          borderRadius: '10px', 
          boxShadow: 'var(--shadow-medium)',
          marginBottom: '2rem',
          color: 'var(--color-dark-grey)'
        }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Send New Notification</h2>
          <form onSubmit={handleSendNotification} className="slide-in-up">
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter notification title..."
                className="input-animate"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '5px',
                  fontSize: '1rem',
                  backgroundColor: 'var(--color-medium-grey)',
                  color: 'var(--color-dark-grey)'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your notification message..."
                className="input-animate"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: '5px',
                  fontSize: '1rem',
                  minHeight: '100px',
                  resize: 'vertical',
                  backgroundColor: 'var(--color-medium-grey)',
                  color: 'var(--color-dark-grey)'
                }}
                required
              />
              <small style={{ color: '#666', fontSize: '0.8rem' }}>
                {message.length}/500 characters
              </small>
            </div>

                         <div style={{ marginBottom: '1.5rem' }}>
               <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                 <input
                   type="checkbox"
                   checked={isScheduled}
                   onChange={(e) => setIsScheduled(e.target.checked)}
                   style={{ marginRight: '0.5rem' }}
                 />
                 <span style={{ fontWeight: 'bold' }}>Schedule this notification</span>
               </label>
               
               {isScheduled && (
                 <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                   <div style={{ flex: 1 }}>
                     <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                       Date
                     </label>
                     <input
                       type="date"
                       value={scheduledDate}
                       onChange={(e) => setScheduledDate(e.target.value)}
                       min={new Date().toISOString().split('T')[0]}
                       style={{
                         width: '100%',
                         padding: '0.8rem',
                         border: '1px solid #ddd',
                         borderRadius: '5px',
                         fontSize: '1rem'
                       }}
                       required={isScheduled}
                     />
                   </div>
                   <div style={{ flex: 1 }}>
                     <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                       Time
                     </label>
                     <input
                       type="time"
                       value={scheduledTime}
                       onChange={(e) => setScheduledTime(e.target.value)}
                       style={{
                         width: '100%',
                         padding: '0.8rem',
                         border: '1px solid #ddd',
                         borderRadius: '5px',
                         fontSize: '1rem'
                       }}
                       required={isScheduled}
                     />
                   </div>
                 </div>
               )}
             </div>

             <button 
               type="submit" 
               disabled={sending || !message.trim() || !title.trim()}
               className="btn-animate"
               style={{
                 width: '100%',
                 padding: '1rem',
                 background: isScheduled ? '#28a745' : '#007bff',
                 color: 'white',
                 border: 'none',
                 borderRadius: '5px',
                 fontSize: '1rem',
                 cursor: 'pointer',
                 opacity: (sending || !message.trim() || !title.trim()) ? 0.6 : 1
               }}
             >
               {sending ? 'Sending...' : (isScheduled ? 'Schedule Notification' : 'Send Notification')}
             </button>
          </form>
        </div>

        {/* All Notifications */}
        <div style={{ 
          background: 'var(--color-card-bg)', 
          padding: '2rem', 
          borderRadius: '10px', 
          boxShadow: 'var(--shadow-medium)',
          color: 'var(--color-dark-grey)'
        }}>
          <h2 style={{ marginBottom: '1.5rem' }}>All Notifications</h2>
          
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              <p>No notifications yet</p>
              <p>Send your first notification to get started!</p>
            </div>
          ) : (
            <div>
              {notifications.map(notification => (
                <div key={notification.id} style={{
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  padding: '1rem',
                  marginBottom: '1rem',
                  background: 'var(--color-medium-grey)',
                  color: 'var(--color-dark-grey)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                      {notification.title || 'Untitled Notification'}
                    </h3>
                    <button
                      onClick={() => handleDelete(notification.id)}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                                     <p style={{ margin: '0.5rem 0', color: '#555' }}>
                     {notification.message}
                   </p>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <small style={{ color: '#666', fontSize: '0.8rem' }}>
                       {formatDate(notification.created_at)}
                     </small>
                     {notification.is_scheduled && notification.scheduled_at && (
                       <small style={{ 
                         color: '#28a745', 
                         fontSize: '0.8rem', 
                         fontWeight: 'bold',
                         background: '#d4edda',
                         padding: '0.2rem 0.5rem',
                         borderRadius: '3px'
                       }}>
                         Scheduled: {formatDate(notification.scheduled_at)}
                       </small>
                     )}
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>

                 {/* Scheduled Notifications */}
         <div style={{ 
           background: 'var(--color-card-bg)', 
           padding: '2rem', 
           borderRadius: '10px', 
           boxShadow: 'var(--shadow-medium)',
           marginTop: '2rem',
           color: 'var(--color-dark-grey)'
         }}>
           <h2 style={{ marginBottom: '1.5rem' }}>Scheduled Notifications</h2>
           
           {notifications.filter(n => n.is_scheduled && n.scheduled_at).length === 0 ? (
             <p style={{ color: '#666', textAlign: 'center' }}>
               No scheduled notifications
             </p>
           ) : (
             <div>
               {notifications
                 .filter(n => n.is_scheduled && n.scheduled_at)
                 .map(notification => (
                   <div key={notification.id} style={{
                     border: '1px solid #28a745',
                     borderRadius: '5px',
                     padding: '1rem',
                     marginBottom: '1rem',
                     background: '#f8fff9'
                   }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                       <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#28a745' }}>
                         {notification.title || 'Untitled Notification'}
                       </h3>
                       <button
                         onClick={() => handleDelete(notification.id)}
                         style={{
                           background: '#dc3545',
                           color: 'white',
                           border: 'none',
                           padding: '0.5rem 1rem',
                           borderRadius: '3px',
                           cursor: 'pointer',
                           fontSize: '0.9rem'
                         }}
                       >
                         Cancel
                       </button>
                     </div>
                     <p style={{ margin: '0.5rem 0', color: '#555' }}>
                       {notification.message}
                     </p>
                     <small style={{ 
                       color: '#28a745', 
                       fontSize: '0.8rem', 
                       fontWeight: 'bold'
                     }}>
                       Scheduled for: {formatDate(notification.scheduled_at)}
                     </small>
                   </div>
                 ))}
             </div>
           )}
         </div>
      </div>
    </AdminLayout>
  );
}

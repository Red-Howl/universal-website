import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({});
  const [newPassword, setNewPassword] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [logoMessage, setLogoMessage] = useState('');
  const [settingsMessage, setSettingsMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (data) {
        const settingsObject = data.reduce((acc, setting) => {
          acc[setting.setting_name] = setting.setting_value;
          return acc;
        }, {});
        setSettings(settingsObject);
      }
    }
    fetchSettings();
  }, []);

  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSettingsMessage('');
    const updatePromises = Object.keys(settings).map(key =>
      supabase.from('site_settings').update({ setting_value: settings[key] }).eq('setting_name', key)
    );
    const results = await Promise.all(updatePromises);
    const hasError = results.some(res => res.error && res.error.message !== 'No rows found');
    if (hasError) {
      setSettingsMessage('Error updating some settings.');
    } else {
      setSettingsMessage('Settings updated successfully!');
    }
  };

  const handleChangePassword = async (e) => {
      e.preventDefault();
      setPasswordMessage('');
      if(newPassword.length < 6) {
          setPasswordMessage('Password must be at least 6 characters long.');
          return;
      }
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if(error) {
          setPasswordMessage('Error changing password: ' + error.message);
      } else {
          setNewPassword('');
          setPasswordMessage('Password changed successfully!');
      }
  }

  const handleLogoUpload = async () => {
    if (!logoFile) {
      alert('Please select a logo file to upload.');
      return;
    }
    setUploading(true);
    setLogoMessage('');
    const fileName = `logo_${Date.now()}`;

    const { error: uploadError } = await supabase.storage.from('site-assets').upload(fileName, logoFile, { upsert: true });
    if (uploadError) {
      setLogoMessage('Error uploading logo: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('site-assets').getPublicUrl(fileName);
    const newLogoUrl = urlData.publicUrl;

    const { error: updateError } = await supabase.from('site_settings').update({ setting_value: newLogoUrl }).eq('setting_name', 'logo_url');

    setUploading(false);
    if (updateError) {
      setLogoMessage('Error saving logo URL: ' + updateError.message);
    } else {
      setSettings(prev => ({ ...prev, logo_url: newLogoUrl }));
      setLogoMessage('Logo updated successfully!');
    }
  };

  return (
    <AdminLayout>
      <style jsx>{`
        /* All styles are the same */
        .settings-container { max-width: 800px; margin: 2rem auto; padding: 2rem; }
        .title { font-family: var(--font-playfair); font-size: 2.5rem; margin-bottom: 2rem; }
        .form-section { margin-bottom: 3rem; border-bottom: 1px solid #eee; padding-bottom: 2rem; }
        .message { margin-top: 1rem; font-weight: bold; }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
        .form-group input, .form-group textarea { width: 100%; padding: 0.8rem; border: 1px solid #ccc; border-radius: 5px; font-size: 1rem; }
        .save-btn { padding: 0.8rem 1.5rem; background-color: var(--color-primary-teal); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; }
        .save-btn:disabled { background-color: #ccc; }
      `}</style>
      <div className="settings-container">
        <h1 className="title">Site Settings</h1>

        <div className="form-section">
          <h2>Site Logo</h2>
          {settings.logo_url && <img src={settings.logo_url} alt="Current Logo" style={{ maxWidth: '150px', marginBottom: '1rem', borderRadius: '50%' }} />}
          <div className="form-group">
            <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
            <button type="button" onClick={handleLogoUpload} disabled={uploading} style={{ marginLeft: '1rem' }} className="save-btn">
              {uploading ? 'Uploading...' : 'Upload & Save Logo'}
            </button>
            {logoMessage && <p className="message">{logoMessage}</p>}
          </div>
        </div>

        <div className="form-section">
          <h2>General Content & UPI</h2>
          <form onSubmit={handleUpdateSettings}>
            <div className="form-group"><label>Site Name</label><input type="text" name="site_name" value={settings.site_name || ''} onChange={handleSettingChange} /></div>

            {/* --- THIS IS THE NEW UPI ID FIELD --- */}
            <div className="form-group">
                <label>Your UPI ID (for manual payments)</label>
                <input type="text" name="upi_id" value={settings.upi_id || ''} onChange={handleSettingChange} />
            </div>

            <div className="form-group"><label>Site Description (for Homepage)</label><textarea name="site_description" rows="5" value={settings.site_description || ''} onChange={handleSettingChange}></textarea></div>
            <div className="form-group"><label>Contact Phone</label><input type="text" name="contact_phone" value={settings.contact_phone || ''} onChange={handleSettingChange} /></div>
            <div className="form-group"><label>Contact Email</label><input type="email" name="contact_email" value={settings.contact_email || ''} onChange={handleSettingChange} /></div>
            <div className="form-group"><label>Instagram URL</label><input type="url" name="social_instagram" value={settings.social_instagram || ''} onChange={handleSettingChange} /></div>
            <div className="form-group"><label>YouTube URL</label><input type="url" name="social_youtube" value={settings.social_youtube || ''} onChange={handleSettingChange} /></div>
            <button type="submit" className="save-btn">Save General Settings</button>
            {settingsMessage && <p className="message">{settingsMessage}</p>}
          </form>
        </div>

        <div className="form-section">
            <h2>Security</h2>
            <form onSubmit={handleChangePassword}>
                <div className="form-group"><label>New Admin Password</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
                <button type="submit" className="save-btn">Change Password</button>
                {passwordMessage && <p className="message">{passwordMessage}</p>}
            </form>
        </div>
      </div>
    </AdminLayout>
  );
}
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
  
  // Theme color configuration: key in site_settings -> description (what it changes)
  const THEME_COLORS = [
    { key: 'color_primary', label: 'Primary', desc: 'Links hover, active accents, highlight states.' },
    { key: 'color_secondary', label: 'Secondary', desc: 'Sub-accents and subtle highlights.' },
    { key: 'color_accent', label: 'Accent', desc: 'Accent backgrounds like table headers.' },
    { key: 'color_light_grey', label: 'Light Grey (bg-1)', desc: 'Primary dark page section background.' },
    { key: 'color_medium_grey', label: 'Medium Grey (bg-2)', desc: 'Cards/containers background.' },
    { key: 'color_dark_grey', label: 'Text (Light on Dark)', desc: 'Main text color on dark backgrounds.' },
    { key: 'color_border', label: 'Border', desc: 'Borders and dividers across the UI.' },
    { key: 'color_hover', label: 'Hover', desc: 'Generic hover background/foreground shade.' },
    { key: 'color_success', label: 'Success', desc: 'Success badges/messages (green).' },
    { key: 'color_error', label: 'Error', desc: 'Errors, destructive buttons, alerts (red).' },
    { key: 'color_warning', label: 'Warning', desc: 'Warnings, caution labels (orange).' },
    { key: 'color_white', label: 'Surface (dark “white”)', desc: 'Surface color replacing pure white in dark theme.' },
    { key: 'color_black', label: 'Base Dark', desc: 'Base darkest shade for headers/deep backgrounds.' },
    { key: 'color_card_bg', label: 'Card Background', desc: 'Cards, panels, nav bars background.' },
    { key: 'color_page_bg', label: 'Page Background', desc: 'Overall page background.' }
  ];

  const [currentColors, setCurrentColors] = useState({});

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (data) {
        const settingsObject = data.reduce((acc, setting) => {
          acc[setting.setting_name] = setting.setting_value;
          return acc;
        }, {});
        setSettings(settingsObject);
        // Apply theme immediately on load and capture current colors
        applyTheme(settingsObject);
        captureComputedTheme();
      }
    }
    fetchSettings();
  }, []);

  function applyTheme(currentSettings) {
    if (typeof window === 'undefined') return;
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
      if (currentSettings[key]) root.style.setProperty(cssVar, currentSettings[key]);
    });
    // After applying, capture the effective values
    captureComputedTheme();
  }

  function captureComputedTheme() {
    if (typeof window === 'undefined') return;
    const cs = getComputedStyle(document.documentElement);
    const snapshot = {
      color_primary: cs.getPropertyValue('--color-primary').trim(),
      color_secondary: cs.getPropertyValue('--color-secondary').trim(),
      color_accent: cs.getPropertyValue('--color-accent').trim(),
      color_light_grey: cs.getPropertyValue('--color-light-grey').trim(),
      color_medium_grey: cs.getPropertyValue('--color-medium-grey').trim(),
      color_dark_grey: cs.getPropertyValue('--color-dark-grey').trim(),
      color_border: cs.getPropertyValue('--color-border').trim(),
      color_hover: cs.getPropertyValue('--color-hover').trim(),
      color_success: cs.getPropertyValue('--color-success').trim(),
      color_error: cs.getPropertyValue('--color-error').trim(),
      color_warning: cs.getPropertyValue('--color-warning').trim(),
      color_white: cs.getPropertyValue('--color-white').trim(),
      color_black: cs.getPropertyValue('--color-black').trim(),
      color_card_bg: cs.getPropertyValue('--color-card-bg').trim(),
      color_page_bg: cs.getPropertyValue('--color-page-bg').trim()
    };
    setCurrentColors(snapshot);
  }

  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    const next = { ...settings, [name]: value };
    setSettings(next);
    // If it's a theme color, apply live as you type/paste
    applyTheme(next);
    captureComputedTheme();
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSettingsMessage('');
    // Use upsert so new settings keys (like theme colors) are created if missing
    const rows = Object.keys(settings).map(key => ({ setting_name: key, setting_value: settings[key] }));
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'setting_name' });
    if (error) setSettingsMessage('Error updating settings: ' + error.message);
    else {
      setSettingsMessage('Settings updated successfully!');
      applyTheme(settings);
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

        {/* Theme Colors */}
        <div className="form-section">
          <h2>Theme Colors</h2>
          <p style={{marginBottom: '1rem'}}>Pick any color code to instantly theme the site. You can paste hex codes (e.g., #6b7280) or use the picker.</p>
          <form onSubmit={handleUpdateSettings}>
            {THEME_COLORS.map(({ key, label, desc }) => (
              <div className="form-group" key={key} style={{display: 'grid', gridTemplateColumns: '240px 56px 1fr', alignItems: 'center', gap: '12px'}}>
                <label style={{minWidth: '220px'}}>
                  {label}
                  <div style={{ fontSize: '0.8rem', color: '#9aa0a6' }}>{desc}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    <span style={{ fontSize: '0.8rem', color: '#9aa0a6' }}>Current:</span>
                    <span title={currentColors[key] || ''} style={{ display: 'inline-block', width: 18, height: 18, borderRadius: 3, border: '1px solid #333', background: currentColors[key] || 'transparent' }} />
                    <code style={{ fontSize: '0.8rem', color: '#9aa0a6' }}>{currentColors[key] || '—'}</code>
                  </div>
                </label>
                <input
                  type="color"
                  value={/^#([0-9a-fA-F]{3}){1,2}$/.test(settings[key] || '') ? settings[key] : (currentColors[key] || '#6b7280')}
                  onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                  style={{width: '48px', height: '36px', padding: 0, border: 'none', background: 'transparent'}}
                  title={`Pick color for ${label}`}
                />
                <input
                  type="text"
                  name={key}
                  value={settings[key] || ''}
                  onChange={handleSettingChange}
                  placeholder="#000000 or any valid CSS color"
                  style={{flex: 1}}
                />
              </div>
            ))}
            <button type="submit" className="save-btn">Save Theme Colors</button>
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
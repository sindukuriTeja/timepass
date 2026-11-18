import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

export default function ProfileModal({ onClose }) {
  const { user, updateProfile, changeKey, logout } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [gender, setGender] = useState(user?.gender || 'Female');
  const [oldKey, setOldKey] = useState('');
  const [newKey, setNewKey] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const handleProfileSave = async () => {
    setSaving(true);
    const result = await updateProfile(username, gender);
    setSaving(false);
    if (result.success) {
      setMsg({ type: 'success', text: 'Profile updated! 💕' });
    } else {
      setMsg({ type: 'error', text: result.error });
    }
    setTimeout(() => setMsg({ type: '', text: '' }), 3000);
  };

  const handleKeyChange = async () => {
    if (!oldKey || !newKey) {
      setMsg({ type: 'error', text: 'Both keys are required' });
      return;
    }
    if (newKey.length > 64) {
      setMsg({ type: 'error', text: 'New key too long (max 64 chars)' });
      return;
    }
    setSaving(true);
    const result = await changeKey(oldKey, newKey);
    setSaving(false);
    if (result.success) {
      setMsg({ type: 'success', text: 'Key changed! Use new key next login 🔑' });
      setOldKey('');
      setNewKey('');
      setTimeout(() => {
        logout();
        onClose();
      }, 1500);
    } else {
      setMsg({ type: 'error', text: result.error });
    }
    setTimeout(() => setMsg({ type: '', text: '' }), 3000);
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="mbox" onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={onClose}>✕</button>
        <h2>Your profile 👤</h2>

        {/* Profile Info */}
        <div style={{ marginBottom: '20px' }}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            maxLength={30}
          />
          <div className="gender">
            {['Male', 'Female', 'Others'].map((g) => (
              <label key={g}>
                <input
                  type="radio"
                  name="g"
                  value={g}
                  checked={gender === g}
                  onChange={() => setGender(g)}
                />
                <span>
                  {g === 'Male' ? '👨' : g === 'Female' ? '👩' : '🌈'} {g}
                </span>
              </label>
            ))}
          </div>
          <button className="btn" style={{ width: '100%', marginTop: '10px' }} onClick={handleProfileSave} disabled={saving}>
            {saving ? 'Saving...' : '💾 Save Profile'}
          </button>
        </div>

        {/* Change Key */}
        <div style={{ borderTop: '2px solid var(--p3)', paddingTop: '20px' }}>
          <h3 style={{ color: 'var(--p1)', fontSize: '22px', marginBottom: '12px' }}>🔑 Change Access Key</h3>
          <input
            type="password"
            value={oldKey}
            onChange={(e) => setOldKey(e.target.value)}
            placeholder="Current access key"
          />
          <input
            type="text"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            maxLength={64}
            placeholder="New access key"
          />
          <button className="btn out" style={{ width: '100%', marginTop: '10px' }} onClick={handleKeyChange} disabled={saving}>
            {saving ? 'Changing...' : '🔐 Update Key'}
          </button>
        </div>

        {msg.text && (
          <p className={msg.type === 'success' ? 'success' : 'err'} style={{ textAlign: 'center', marginTop: '15px' }}>
            {msg.type === 'success' ? '✅' : '⚠️'} {msg.text}
          </p>
        )}
      </div>
    </div>
  );
}

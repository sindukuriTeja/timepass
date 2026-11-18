import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

export default function ProfileModal({ onClose }) {
  const { user, updateProfile, logout } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [gender, setGender] = useState(user?.gender || 'Female');
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

  return (
    <div className="modal" onClick={onClose}>
      <div className="mbox" onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={onClose}>✕</button>
        <h2>Your profile 👤</h2>

        <div>
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

        {msg.text && (
          <p className={msg.type === 'success' ? 'success' : 'err'} style={{ textAlign: 'center', marginTop: '15px' }}>
            {msg.type === 'success' ? '✅' : '⚠️'} {msg.text}
          </p>
        )}

        <div style={{ borderTop: '2px solid var(--p3)', paddingTop: '20px', marginTop: '20px' }}>
          <button
            className="btn out"
            style={{ width: '100%' }}
            onClick={() => { logout(); onClose(); }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

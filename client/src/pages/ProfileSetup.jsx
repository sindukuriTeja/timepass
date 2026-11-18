import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Logo() {
  return (
    <svg viewBox="0 0 48 48" style={{ width: '38px', height: '38px' }} aria-hidden="true">
      <path d="M24 43C8 31 4 22 4 15a10 10 0 0 1 20-3 10 10 0 0 1 20 3c0 7-4 16-20 28z" fill="#ff5c8a"/>
      <circle cx="24" cy="23" r="10" fill="#fff"/>
      <path d="M24 16v7l5 3" stroke="#c2185b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </svg>
  );
}

export default function ProfileSetup() {
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const { setProfile } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Pick a username!');
      return;
    }
    if (!gender) {
      setError('Choose your gender!');
      return;
    }
    setProfile(username.trim(), gender);
    navigate('/');
  };

  return (
    <div className="auth">
      <span className="fl" style={{ top: '10%', left: '8%' }}>Hey there! 👋</span>
      <span className="heart" style={{ bottom: '14%', right: '10%' }}>💕</span>
      <div className="glass">
        <div className="logo" style={{ justifyContent: 'center' }}>
          <Logo /> Timepass
        </div>
        <h2 style={{ marginTop: '10px' }}>Let's get you set up</h2>
        <p className="hand" style={{ textAlign: 'center', fontSize: '22px', margin: '4px 0 14px' }}>
          No login. No password. Just vibes.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Pick a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={30}
            autoFocus
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
          <div className="err">{error}</div>
          <button className="btn" type="submit">
            🚀 Start Chatting
          </button>
        </form>
        <p className="hand" style={{ textAlign: 'center', marginTop: '15px', color: 'var(--soft)', fontSize: '18px' }}>
          From Random Hellos to Unexpected Hearts 💘
        </p>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

export default function Signup() {
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('Female');
  const [accessKey, setAccessKey] = useState('');
  const [keyStatus, setKeyStatus] = useState({ valid: null, message: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const checkKey = useCallback(async (key) => {
    if (key.length < 1) {
      setKeyStatus({ valid: null, message: '' });
      return;
    }
    if (key.length > 64) {
      setKeyStatus({ valid: false, message: 'Key too long (max 64 chars)' });
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessKey: key }),
      });
      const data = await res.json();
      if (data.success) {
        setKeyStatus({ valid: false, message: 'Access key already taken' });
      } else {
        setKeyStatus({ valid: true, message: 'Key is available!' });
      }
    } catch {
      setKeyStatus({ valid: null, message: '' });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (accessKey) checkKey(accessKey);
    }, 500);
    return () => clearTimeout(timer);
  }, [accessKey, checkKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !gender || !accessKey.trim()) {
      setError('Add a username and access key.');
      return;
    }
    if (accessKey.length > 64) {
      setError('Access key too long (max 64 chars)');
      return;
    }
    if (keyStatus.valid === false) {
      setError('Access key already taken');
      return;
    }
    setLoading(true);
    setError('');
    const result = await signup(username.trim(), gender, accessKey.trim());
    setLoading(false);
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  return (
    <div className="auth">
      <span className="fl" style={{ top: '10%', right: '8%' }}>Hey 💌</span>
      <span className="heart" style={{ bottom: '12%', left: '10%' }}>💖</span>
      <div className="glass">
        <h2>Join Timepass</h2>
        <input
          id="su"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        <input
          id="sk"
          placeholder="Access key (letters and/or numbers)"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          maxLength={64}
        />
        {keyStatus.message && (
          <div className={keyStatus.valid ? 'success' : 'err'}>
            {keyStatus.valid ? '✅' : '⚠️'} {keyStatus.message}
          </div>
        )}
        <button className="btn" onClick={handleSubmit} disabled={loading || keyStatus.valid === false}>
          {loading ? 'Creating...' : 'Sign up'}
        </button>
        <p style={{ textAlign: 'center' }}>
          Already a user? <Link to="/login" className="link">Log in</Link>
        </p>
      </div>
    </div>
  );
}

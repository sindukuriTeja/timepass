import React, { useState } from 'react';
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

export default function Login() {
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accessKey.trim()) {
      setError('Enter your access key.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await login(accessKey.trim());
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError('Access key not found. Try again.');
    }
  };

  return (
    <div className="auth">
      <span className="fl" style={{ top: '10%', left: '8%' }}>Hello 😄</span>
      <span className="heart" style={{ bottom: '14%', right: '10%' }}>💕</span>
      <div className="glass">
        <div className="logo" style={{ justifyContent: 'center' }}>
          <Logo /> Timepass
        </div>
        <h2 style={{ marginTop: '10px' }}>Welcome back</h2>
        <p className="hand" style={{ textAlign: 'center', fontSize: '22px', margin: '4px 0 14px' }}>
          Privacy is power
        </p>
        <form onSubmit={handleSubmit}>
          <input
            id="lk"
            type="password"
            placeholder="Your access key"
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            autoFocus
          />
          <div className="err" id="le">{error}</div>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p style={{ textAlign: 'center' }}>
          New user? <Link to="/signup" className="link">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

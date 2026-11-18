import React, { useState, useEffect } from 'react';
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

export default function ConnectCard() {
  const { user, keyHash, onlineUsers, sendChatRequest } = useAuth();
  const [available, setAvailable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sent, setSent] = useState({});

  const fetchAvailable = async () => {
    if (!keyHash) return;
    try {
      const res = await fetch(`http://localhost:5000/api/available-users/${keyHash}`);
      const data = await res.json();
      setAvailable(data);
    } catch {
      setAvailable([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAvailable();
    const interval = setInterval(fetchAvailable, 5000);
    return () => clearInterval(interval);
  }, [keyHash, onlineUsers]);

  const handleChat = (targetKeyHash, targetUsername) => {
    if (sent[targetKeyHash]) return;
    sendChatRequest(targetKeyHash);
    setSent((prev) => ({ ...prev, [targetKeyHash]: true }));
    setTimeout(() => {
      setSent((prev) => {
        const next = { ...prev };
        delete next[targetKeyHash];
        return next;
      });
    }, 3000);
  };

  return (
    <div style={{ padding: '20px 5vw', maxWidth: '760px', margin: '0 auto' }}>
      <div className="mbox" style={{ animation: 'slideUp 0.4s ease' }}>
        <h2>Who's online 💞</h2>
        <p className="hand" style={{ color: 'var(--soft)', fontSize: '20px' }}>
          Showing {user?.gender === 'Others' ? 'all' : user?.gender === 'Male' ? 'female' : 'male'} users for you
        </p>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <span className="spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }} />
            <p style={{ marginTop: '15px', color: 'var(--soft)' }}>Finding souls to connect with...</p>
          </div>
        ) : available.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '3rem', marginBottom: '15px' }}>🌙</p>
            <p className="hand" style={{ color: 'var(--soft)', fontSize: '1.5rem' }}>
              No one's around right now. Check back soon!
            </p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Username</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {available.map((u, i) => (
                <tr key={u.keyHash}>
                  <td>{i + 1}</td>
                  <td>
                    <span style={{ marginRight: '8px' }}>
                      {u.gender === 'Male' ? '👨' : u.gender === 'Female' ? '👩' : '🧑'}
                    </span>
                    {u.username}
                  </td>
                  <td>
                    <button
                      className="btn sm"
                      style={{ opacity: sent[u.keyHash] ? 0.6 : 1 }}
                      disabled={sent[u.keyHash]}
                      onClick={() => handleChat(u.keyHash, u.username)}
                    >
                      {sent[u.keyHash] ? '📨 Sent' : 'Chat'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

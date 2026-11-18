import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

export default function ConnectCard() {
  const { user, onlineUsers, sendChatRequest } = useAuth();
  const [available, setAvailable] = useState([]);
  const [sent, setSent] = useState({});

  // Filter online users based on gender matching
  useEffect(() => {
    if (!user) return;
    let filtered = onlineUsers.filter((u) => u.socketId !== user.socketId);
    if (user.gender !== 'Others') {
      filtered = filtered.filter((u) => u.gender !== user.gender);
    }
    setAvailable(filtered);
  }, [onlineUsers, user]);

  const handleChat = (targetSocketId) => {
    if (sent[targetSocketId]) return;
    sendChatRequest(targetSocketId);
    setSent((prev) => ({ ...prev, [targetSocketId]: true }));
    setTimeout(() => {
      setSent((prev) => {
        const next = { ...prev };
        delete next[targetSocketId];
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
        {available.length === 0 ? (
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
                <tr key={u.socketId}>
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
                      style={{ opacity: sent[u.socketId] ? 0.6 : 1 }}
                      disabled={sent[u.socketId]}
                      onClick={() => handleChat(u.socketId)}
                    >
                      {sent[u.socketId] ? '📨 Sent' : 'Chat'}
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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import ConnectCard from '../components/ConnectCard';
import ProfileModal from '../components/ProfileModal';

function Logo() {
  return (
    <svg viewBox="0 0 48 48" style={{ width: '38px', height: '38px' }} aria-hidden="true">
      <path d="M24 43C8 31 4 22 4 15a10 10 0 0 1 20-3 10 10 0 0 1 20 3c0 7-4 16-20 28z" fill="#ff5c8a"/>
      <circle cx="24" cy="23" r="10" fill="#fff"/>
      <path d="M24 16v7l5 3" stroke="#c2185b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </svg>
  );
}

function Splash() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(t);
  }, []);
  if (!visible) return null;
  return (
    <div className="splash">
      <div>
        <h2>Privacy is Power</h2>
        <small>🔒 Your chats vanish when you exit</small>
      </div>
    </div>
  );
}

function NotificationBell() {
  const { notifications, acceptChat, declineChat } = useAuth();
  const [open, setOpen] = useState(false);

  if (notifications.length === 0) return null;

  return (
    <div className="right">
      <button className="bell" onClick={() => setOpen(!open)}>
        🔔<i>{notifications.length}</i>
      </button>
      <div className={`notif ${open ? 'on' : ''}`}>
        {notifications.map((n, i) => (
          n.type === 'request' ? (
            <div key={i}>
              <b>{n.from}</b> wants to connect 💌
              <div className="row">
                <button className="btn" onClick={() => { acceptChat(n.fromSocketId); setOpen(false); }}>
                  Accept
                </button>
                <button className="btn out" onClick={() => { declineChat(n.fromSocketId); setOpen(false); }}>
                  Decline
                </button>
              </div>
            </div>
          ) : n.type === 'declined' ? (
            <p key={i} style={{ color: 'var(--soft)' }}>😔 Your chat request was declined</p>
          ) : null
        ))}
      </div>
    </div>
  );
}

function ProfileIcon() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <div className="right">
      <button className="pf" onClick={() => { setOpen(!open); setShowProfile(false); }}>
        {user?.username?.[0]?.toUpperCase() || '😊'}
      </button>
      <div className={`menu ${open ? 'on' : ''}`}>
        <div><b>{user?.username}</b></div>
        <div onClick={() => { setShowProfile(true); setOpen(false); }}>👤 Profile</div>
        <div onClick={handleLogout}>🚪 Logout</div>
      </div>
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
}

export default function Dashboard() {
  const [showConnect, setShowConnect] = useState(false);
  const { user, logout, navigate } = useAuth();
  const IDLE_TIMEOUT = 5 * 60 * 60 * 1000;

  useEffect(() => {
    let idleTimer;
    const resetTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        logout();
        navigate('/setup');
      }, IDLE_TIMEOUT);
    };
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      clearTimeout(idleTimer);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [logout, navigate]);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Splash />
      <div className="appbar">
        <div className="logo" onClick={() => setShowConnect(false)} style={{ cursor: 'pointer' }}>
          <Logo /> Timepass
        </div>
        <div className="mid">
          <button className="btn glow" onClick={() => setShowConnect(!showConnect)}>
            {showConnect ? '✕ Close' : '💞 Connect'}
          </button>
        </div>
        <div className="right" style={{ position: 'relative' }}>
          <NotificationBell />
          <ProfileIcon />
        </div>
      </div>

      {showConnect ? (
        <div style={{ paddingTop: '80px' }}>
          <ConnectCard />
        </div>
      ) : (
        <div className="lobby">
          <span className="fl" style={{ top: '14%', left: '10%' }}>Psst… say hi 🤭</span>
          <span className="heart" style={{ top: '20%', right: '14%' }}>💗</span>
          <span className="heart" style={{ bottom: '16%', left: '16%' }}>💕</span>
          <span className="fl" style={{ bottom: '14%', right: '10%', animationDelay: '1s' }}>Hello 😄</span>
          <div>
            <h2>Ready to meet someone new?</h2>
            <p className="hand" style={{ fontSize: '26px', color: 'var(--soft)' }}>
              Tap Connect to see who's online
            </p>
            <button className="btn" onClick={() => setShowConnect(true)}>
              Connect now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

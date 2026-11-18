import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../AuthContext';

function Logo() {
  return (
    <svg viewBox="0 0 48 48" style={{ width: '30px', height: '30px' }} aria-hidden="true">
      <path d="M24 43C8 31 4 22 4 15a10 10 0 0 1 20-3 10 10 0 0 1 20 3c0 7-4 16-20 28z" fill="#ff5c8a"/>
      <circle cx="24" cy="23" r="10" fill="#fff"/>
      <path d="M24 16v7l5 3" stroke="#c2185b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </svg>
  );
}

export default function ChatPage() {
  const { user, chatPartner, sendMessage, exitChat, socket, activeChat, logout, navigate } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [listeningError, setListeningError] = useState('');
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const IDLE_TIMEOUT = 5 * 60 * 60 * 1000;

  useEffect(() => {
    setMessages([]);
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on('new-message', handler);
    return () => socket.off('new-message', handler);
  }, [socket]);

  useEffect(() => {
    let idleTimer;
    const resetTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (socket) socket.emit('exit-chat');
        logout();
        navigate('/');
      }, IDLE_TIMEOUT);
    };
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click', 'sendMessage'];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      clearTimeout(idleTimer);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [logout, navigate, socket]);

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(message.trim());
    setMessages((prev) => [...prev, { sender: user.username, text: message.trim(), timestamp: Date.now() }]);
    setMessage('');
    window.dispatchEvent(new Event('sendMessage'));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setListeningError('Voice input not supported. Try Chrome.');
      setTimeout(() => setListeningError(''), 3000);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onstart = () => { setIsListening(true); setListeningError(''); };
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setMessage(transcript);
    };
    recognition.onend = () => { setIsListening(false); };
    recognition.onerror = (event) => {
      setIsListening(false);
      setListeningError(`Voice error: ${event.error}`);
      setTimeout(() => setListeningError(''), 3000);
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleExit = () => {
    exitChat();
  };

  return (
    <div className="chat on">
      <div className="chead">
        <div className="logo"><Logo /></div>
        <span className="av" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--gold)', display: 'grid', placeItems: 'center' }}>
          {chatPartner?.[0]?.toUpperCase() || '🧑'}
        </span>
        <b id="cn">{chatPartner || 'Stranger'}</b>
        <span style={{ marginLeft: 'auto', color: 'var(--soft)', fontSize: '0.85rem' }}>● online</span>
      </div>

      <div className="msgs" id="msgs">
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', opacity: 0.7 }}>
            <p style={{ fontSize: '3rem', marginBottom: '15px' }}>💕</p>
            <p className="hand" style={{ fontSize: '1.5rem', color: 'var(--soft)' }}>
              Say hi to {chatPartner}!
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`b ${msg.sender === user.username ? 'me' : 'th'}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="cbar">
        <div className="inp">
          <input
            id="mi"
            type="text"
            placeholder={isListening ? 'Listening… 🎤' : 'Type a message…'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className={`mic ${isListening ? 'rec' : ''}`}
            id="mic"
            onClick={toggleListening}
            title="Voice to text"
          >
            {isListening ? '🛑' : '🎤'}
          </button>
          <button className="btn sm" style={{ padding: '14px 24px' }} onClick={handleSend}>
            Send
          </button>
        </div>
        <button className="btn out exit" onClick={handleExit}>Exit chat</button>
        <div className="note">Exiting deletes this chat for both of you.</div>
        {listeningError && <p className="err" style={{ textAlign: 'center' }}>{listeningError}</p>}
      </div>
    </div>
  );
}

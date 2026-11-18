import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [keyHash, setKeyHash] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatPartner, setChatPartner] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(API_URL, { transports: ['websocket', 'polling'] });
    setSocket(newSocket);

    newSocket.on('user-list-update', (list) => {
      setOnlineUsers(list);
    });

    newSocket.on('chat-request', (data) => {
      setNotifications((prev) => [...prev, { type: 'request', ...data }]);
    });

    newSocket.on('chat-started', (data) => {
      setActiveChat(data.chatId);
      setChatPartner(data.partner);
    });

    newSocket.on('chat-declined', () => {
      setNotifications((prev) => [...prev, { type: 'declined' }]);
    });

    newSocket.on('new-message', (msg) => {
      setActiveChat((prev) => (prev ? { ...prev, messages: [...(prev.messages || []), msg] } : null));
    });

    newSocket.on('chat-exited', () => {
      setActiveChat(null);
      setChatPartner(null);
    });

    return () => newSocket.close();
  }, []);

  // Register with socket when user logs in
  useEffect(() => {
    if (socket && keyHash) {
      socket.emit('register', keyHash);
    }
  }, [socket, keyHash]);

  const login = async (accessKey) => {
    const res = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessKey }),
    });
    const data = await res.json();
    if (data.success) {
      setUser({ username: data.username, gender: data.gender });
      setKeyHash(data.keyHash);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const signup = async (username, gender, accessKey) => {
    const res = await fetch(`${API_URL}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, gender, accessKey }),
    });
    const data = await res.json();
    if (data.success) {
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const logout = () => {
    if (socket) socket.emit('exit-chat');
    setUser(null);
    setKeyHash(null);
    setActiveChat(null);
    setChatPartner(null);
    setNotifications([]);
  };

  const updateProfile = async (username, gender) => {
    const res = await fetch(`${API_URL}/api/update-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyHash, username, gender }),
    });
    const data = await res.json();
    if (data.success) {
      setUser({ username: data.username, gender: data.gender });
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const changeKey = async (oldKey, newKey) => {
    const res = await fetch(`${API_URL}/api/change-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldKey, newKey, keyHash }),
    });
    const data = await res.json();
    if (data.success) {
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const sendChatRequest = (targetKeyHash) => {
    if (socket) socket.emit('send-chat-request', targetKeyHash);
  };

  const acceptChat = (fromKeyHash) => {
    if (socket) socket.emit('accept-chat', fromKeyHash);
    setNotifications((prev) => prev.filter((n) => n.fromKeyHash !== fromKeyHash));
  };

  const declineChat = (fromKeyHash) => {
    if (socket) socket.emit('decline-chat', fromKeyHash);
    setNotifications((prev) => prev.filter((n) => n.fromKeyHash !== fromKeyHash));
  };

  const sendMessage = (message) => {
    if (socket && activeChat && keyHash) {
      socket.emit('send-message', { chatId: activeChat, message, senderKeyHash: keyHash });
    }
  };

  const exitChat = () => {
    if (socket) socket.emit('exit-chat');
    setActiveChat(null);
    setChatPartner(null);
  };

  const clearNotification = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        keyHash,
        socket,
        onlineUsers,
        notifications,
        activeChat,
        chatPartner,
        login,
        signup,
        logout,
        updateProfile,
        changeKey,
        sendChatRequest,
        acceptChat,
        declineChat,
        sendMessage,
        exitChat,
        clearNotification,
        API_URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

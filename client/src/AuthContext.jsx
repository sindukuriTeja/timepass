import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const AuthContext = createContext(null);

// Connect to same origin in production (Render), localhost in dev
const API_URL = import.meta.env.DEV ? 'http://localhost:5000' : '';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatPartner, setChatPartner] = useState(null);
  const [profileSetup, setProfileSetup] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(API_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setSocketConnected(true);
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      setSocketConnected(false);
      console.log('Socket disconnected');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    newSocket.on('user-list-update', (list) => {
      setOnlineUsers(list);
    });

    newSocket.on('chat-request', (data) => {
      console.log('Chat request received:', data);
      setNotifications((prev) => [...prev, { type: 'request', ...data }]);
    });

    newSocket.on('chat-started', (data) => {
      console.log('Chat started:', data);
      setActiveChat(data.chatId);
      setChatPartner(data.partner);
    });

    newSocket.on('chat-declined', () => {
      setNotifications((prev) => [...prev, { type: 'declined' }]);
    });

    newSocket.on('new-message', (msg) => {
      setActiveChat((prev) => prev);
    });

    newSocket.on('chat-exited', () => {
      setActiveChat(null);
      setChatPartner(null);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // Set profile on socket when user sets it
  useEffect(() => {
    if (socket && user) {
      socket.emit('set-profile', { username: user.username, gender: user.gender });
    }
  }, [socket, user]);

  // Set profile (username + gender) — replaces login/signup
  const setProfile = (username, gender) => {
    setUser({ username, gender });
    setProfileSetup(true);
  };

  // Logout — clears profile and disconnects socket
  const logout = () => {
    if (socket) socket.emit('exit-chat');
    setUser(null);
    setActiveChat(null);
    setChatPartner(null);
    setNotifications([]);
    setProfileSetup(false);
  };

  // Update profile info
  const updateProfile = (username, gender) => {
    setUser({ username, gender });
    return { success: true };
  };

  const sendChatRequest = (targetSocketId) => {
    if (socket && socketConnected) {
      console.log('Sending chat request to:', targetSocketId);
      socket.emit('send-chat-request', targetSocketId);
    } else {
      console.error('Socket not connected, cannot send chat request');
    }
  };

  const acceptChat = (fromSocketId) => {
    if (socket && socketConnected) {
      console.log('Accepting chat from:', fromSocketId);
      socket.emit('accept-chat', fromSocketId);
    } else {
      console.error('Socket not connected, cannot accept chat');
    }
    setNotifications((prev) => prev.filter((n) => n.fromSocketId !== fromSocketId));
  };

  const declineChat = (fromSocketId) => {
    if (socket && socketConnected) {
      socket.emit('decline-chat', fromSocketId);
    }
    setNotifications((prev) => prev.filter((n) => n.fromSocketId !== fromSocketId));
  };

  const sendMessage = (message) => {
    if (socket && socketConnected && activeChat && user) {
      socket.emit('send-message', { chatId: activeChat, message });
    }
  };

  const exitChat = () => {
    if (socket && socketConnected) {
      socket.emit('exit-chat');
    }
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
        socket,
        onlineUsers,
        notifications,
        activeChat,
        chatPartner,
        profileSetup,
        setProfile,
        logout,
        updateProfile,
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

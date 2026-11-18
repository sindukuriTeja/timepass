import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import ProfileSetup from './pages/ProfileSetup';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/setup" replace />;
}

function AppRoutes() {
  const { user, activeChat } = useAuth();

  // Chat page takes priority when a chat is active
  if (activeChat) {
    return <ChatPage />;
  }

  // No user yet → force profile setup
  if (!user) {
    return <ProfileSetup />;
  }

  // User exists → normal routes
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/app" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;

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

  if (activeChat) {
    return <ChatPage />;
  }

  if (!user) {
    return <ProfileSetup />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/home" element={<Dashboard />} />
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

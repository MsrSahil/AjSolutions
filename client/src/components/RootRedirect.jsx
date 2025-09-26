import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RootRedirect = () => {
  const { isLogin, user } = useAuth();

  if (!isLogin) {
    // Agar login nahi hai, to login page par bhejo
    return <Navigate to="/login" replace />;
  }
  
  // Agar login hai, to role ke hisab se dashboard par bhejo
  if (user.role === 'admin') {
    return <Navigate to="/admindashboard" replace />;
  }
  
  // Normal user ke liye
  return <Navigate to="/dashboard" replace />;
};

export default RootRedirect;
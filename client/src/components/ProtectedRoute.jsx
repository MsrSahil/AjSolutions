import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { isLogin, user } = useAuth();

  if (!isLogin) {
    // Agar login nahi hai, to login page par bhejo
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && user.role !== 'admin') {
    // Agar admin route hai lekin user admin nahi hai, to dashboard par bhejo
    return <Navigate to="/dashboard" replace />;
  }

  // Agar sab theek hai, to page dikhao
  return <Outlet />;
};

export default ProtectedRoute;
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Use the useAuth hook
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

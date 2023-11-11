// src/components/admin/EnsureAuth.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const EnsureAuth = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Usa la propiedad isAuthenticated del contexto

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default EnsureAuth;




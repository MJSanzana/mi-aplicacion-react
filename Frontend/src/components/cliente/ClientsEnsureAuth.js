// src/components/cliente/EnsureAuth.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ClientsEnsureAuth = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Usa la propiedad isAuthenticated del contexto

  if (!isAuthenticated) {
    return <Navigate to="/Cliente/login" />;
  }

  return children;
};

export default ClientsEnsureAuth;
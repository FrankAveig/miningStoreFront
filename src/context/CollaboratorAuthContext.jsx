import React, { createContext, useContext, useEffect, useState } from 'react';

const CollaboratorAuthContext = createContext();

export const CollaboratorAuthProvider = ({ children }) => {
  const [collaborator, setCollaborator] = useState(() => {
    const saved = localStorage.getItem('collaborator');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  useEffect(() => {
    if (collaborator) {
      localStorage.setItem('collaborator', JSON.stringify(collaborator));
    } else {
      localStorage.removeItem('collaborator');
    }
  }, [collaborator]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Recibe la respuesta completa (axios.data) y extrae data.token y data.collaborator
  const login = (apiPayload) => {
    // apiPayload: { status, title, message, data: { collaborator, token, type } }
    const payloadData = apiPayload?.data || {};
    const receivedCollaborator = payloadData.collaborator || null;
    const receivedToken = payloadData.token || null;

    setCollaborator(receivedCollaborator);
    setToken(receivedToken);
  };

  const logout = () => {
    setCollaborator(null);
    setToken(null);
    localStorage.removeItem('collaborator');
    localStorage.removeItem('token');
  };

  const isAuthenticated = () => {
    return !!token && !!collaborator;
  };

  return (
    <CollaboratorAuthContext.Provider
      value={{ collaborator, token, login, logout, isAuthenticated }}
    >
      {children}
    </CollaboratorAuthContext.Provider>
  );
};

export const useCollaboratorAuth = () => {
  const context = useContext(CollaboratorAuthContext);
  if (!context) {
    throw new Error('useCollaboratorAuth debe ser usado dentro de un CollaboratorAuthProvider');
  }
  return context;
};



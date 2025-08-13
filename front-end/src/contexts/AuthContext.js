import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      api.get('/api/auth/me')
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
          delete api.defaults.headers.Authorization;
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const response = await api.post('/api/auth/login', { username, password });
    const token = response.data.token;

    localStorage.setItem('token', token);
    api.defaults.headers.Authorization = `Bearer ${token}`;

    // Buscar dados do usuário
    const userResponse = await api.get('/api/auth/me');
    setUser(userResponse.data);

    // ✅ Retornar role (tipo de usuário)
    return userResponse.data.role;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.Authorization;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

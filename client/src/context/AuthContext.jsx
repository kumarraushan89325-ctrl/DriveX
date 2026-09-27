import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api, { getErrorMessage } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const storeSession = (payload) => {
    if (payload?.token) localStorage.setItem('drivenow_token', payload.token);
    setUser(payload?.user || null);
  };

  const clearSession = () => {
    localStorage.removeItem('drivenow_token');
    setUser(null);
  };

  useEffect(() => {
    const boot = async () => {
      const token = localStorage.getItem('drivenow_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    };
    boot();
  }, []);

  const register = async (form) => {
    const { data } = await api.post('/auth/register', form);
    storeSession(data);
    return data.user;
  };

  const login = async (form) => {
    const { data } = await api.post('/auth/login', form);
    storeSession(data);
    return data.user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      clearSession();
    }
  };

  const updateProfile = async (id, payload) => {
    const { data } = await api.put(`/users/${id}`, payload);
    setUser(data.user);
    return data.user;
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin: user?.role === 'admin',
      register,
      login,
      logout,
      updateProfile,
      getErrorMessage,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

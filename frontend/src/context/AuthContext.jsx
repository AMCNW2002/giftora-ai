import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../services/api';

const AuthContext = createContext(null);

/**
 * Keeps track of "who is logged in".
 * On page load, if a token is saved we ask the backend (/api/auth/me) to confirm it is still valid.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(getToken())); // true while we verify a saved token

  useEffect(() => {
    if (!getToken()) return;
    let cancelled = false;
    api
      .me()
      .then((u) => !cancelled && setUser(u))
      .catch(() => !cancelled && setUser(null))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  // api.js fires this event when the backend says "401 - token expired/invalid"
  useEffect(() => {
    const onUnauthorized = () => setUser(null);
    window.addEventListener('giftora:unauthorized', onUnauthorized);
    return () => window.removeEventListener('giftora:unauthorized', onUnauthorized);
  }, []);

  const finishAuth = ({ user: u, token }) => {
    setToken(token);
    setUser(u);
    return u;
  };

  const login = useCallback(async (credentials) => finishAuth(await api.login(credentials)), []);
  const register = useCallback(async (details) => finishAuth(await api.register(details)), []);
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: Boolean(user), login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

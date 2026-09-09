import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/authService';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => AuthService.getCurrentSession());
  const [role, setRole] = useState(() => AuthService.getCurrentSession()?.role || null);

  useEffect(() => {
    setRole(user?.role || null);
  }, [user]);

  const login = async (email, password) => {
    let nextUser;
    try {
      const result = await api.login(email, password);
      localStorage.setItem('farmdirect_api_token', result.token);
      nextUser = { ...result.user, ...(result.user.profile || {}) };
    } catch (apiError) {
      // Keep the seeded demo accounts usable while MongoDB is unavailable.
      nextUser = await AuthService.signIn(email, password);
    }
    setUser(nextUser);
    setRole(nextUser.role);
    return nextUser;
  };

  const logout = () => {
    AuthService.clearSession();
    localStorage.removeItem('farmdirect_api_token');
    setUser(null);
    setRole(null);
  };

  const switchRole = (nextRole) => {
    if (nextRole && user?.role !== nextRole) setRole(nextRole);
  };

  const updateProfile = (changes) => {
    if (!user) return;
    const nextUser = { ...user, ...changes, updatedAt: new Date().toISOString() };
    api.updateProfile(changes).catch(() => {});
    const users = AuthService.getUsersCollection();
    users[nextUser.uid] = nextUser;
    AuthService.saveUsersCollection(users);
    AuthService.saveSession(nextUser);
    setUser(nextUser);
  };

  const updateUserBalance = (uid, amount) => {
    const users = AuthService.getUsersCollection();
    const target = users[uid];
    if (!target) return null;
    const nextUser = { ...target, walletBalance: Math.max(0, (target.walletBalance ?? 0) + amount), updatedAt: new Date().toISOString() };
    users[uid] = nextUser;
    AuthService.saveUsersCollection(users);
    if (user?.uid === uid) {
      AuthService.saveSession(nextUser);
      setUser(nextUser);
    }
    return nextUser;
  };

  const registerFarmer = async (data) => {
    const result = await api.register({ ...data, role: 'farmer' });
    localStorage.setItem('farmdirect_api_token', result.token);
    const nextUser = { ...result.user, ...(result.user.profile || {}) };
    setUser(nextUser);
    setRole(nextUser.role);
    return nextUser;
  };

  const registerBuyer = async (data) => {
    const result = await api.register({ ...data, role: 'buyer' });
    localStorage.setItem('farmdirect_api_token', result.token);
    const nextUser = { ...result.user, ...(result.user.profile || {}) };
    setUser(nextUser);
    setRole(nextUser.role);
    return nextUser;
  };

  return <AuthContext.Provider value={{
    user,
    role,
    isAuthenticated: Boolean(user),
    login,
    logout,
    switchRole,
    updateProfile,
    updateUserBalance,
    registerFarmer,
    registerBuyer,
    requestPasswordReset: AuthService.requestPasswordReset,
    confirmPasswordReset: AuthService.confirmPasswordReset,
  }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

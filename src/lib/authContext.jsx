import React, { createContext, useContext, useState } from 'react';

// AuthProvider / useAuth — passthrough until real Supabase auth is wired up
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const value = {
    isAuthenticated: true,
    isLoadingAuth: false,
    isLoadingPublicSettings: false,
    authChecked: true,
    authError: null,
    user: null,
    navigateToLogin: () => {},
    checkUserAuth: () => {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

// AdminAuthProvider / useAdminAuth — retained for Sidebar / AdminAuthProvider usage
const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const login = () => setIsAdmin(true);
  const logout = () => setIsAdmin(false);

  return (
    <AdminAuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);

import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/authAPI';

export const AuthContext = createContext(null);

const extractUser = (res) => {
  if (!res) return null;
  const data = res.data !== undefined ? res.data : res;
  if (data && data.user) return data.user;
  return data;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await authAPI.getProfile();
          const userProfile = extractUser(response);
          if (userProfile && userProfile._id) {
            setUser(userProfile);
            localStorage.setItem('user', JSON.stringify(userProfile));
          } else {
            logout();
          }
        } catch (err) {
          console.error('Failed to verify token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await authAPI.login({ email, password });
      const authData = response.data !== undefined ? response.data : response;
      const newToken = authData?.token || response?.token;
      const userProfile = extractUser(response);

      if (newToken) {
        setToken(newToken);
        localStorage.setItem('token', newToken);
      }
      if (userProfile) {
        setUser(userProfile);
        localStorage.setItem('user', JSON.stringify(userProfile));
      }

      return authData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const response = await authAPI.register(userData);
      const authData = response.data !== undefined ? response.data : response;
      const newToken = authData?.token || response?.token;
      const userProfile = extractUser(response);

      if (newToken) {
        setToken(newToken);
        localStorage.setItem('token', newToken);
      }
      if (userProfile) {
        setUser(userProfile);
        localStorage.setItem('user', JSON.stringify(userProfile));
      }

      return authData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await authAPI.updateProfile(data);
      const userProfile = extractUser(response);
      if (userProfile) {
        setUser(userProfile);
        localStorage.setItem('user', JSON.stringify(userProfile));
      }
      return userProfile;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

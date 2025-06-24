import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api'; // Import the API service

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentRoute, setCurrentRoute] = useState('/');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('accessToken');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setCurrentRoute('/dashboard');
    }
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await api.login(credentials);
      setUser(response.user);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      localStorage.setItem('accessToken', response.access_token);
      setCurrentRoute('/dashboard');
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

    const register = async (userData) => {
    setLoading(true);
    try {
      const response = await api.register(userData);
      // On successful registration, redirect to the login page
      setCurrentRoute('/login');
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    setCurrentRoute('/');
  };

  const navigate = (route) => {
    setCurrentRoute(route);
  };

  return (
    <AppContext.Provider value={{
      user,
      currentRoute,
      loading,
      login,
      register,
      logout,
      navigate,
      api
    }}>
      {children}
    </AppContext.Provider>
  );
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import { storeAPI, categoryAPI } from '../services/api.js';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshSettings = async () => {
    try {
      const res = await storeAPI.getPublicSettings();
      if (res.success && res.data) {
        setSettings(res.data);
      }
    } catch (err) {
      console.error('Error fetching store settings:', err);
    }
  };

  const refreshCategories = async () => {
    try {
      const res = await categoryAPI.getPublicCategories();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([refreshSettings(), refreshCategories()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        settings,
        categories,
        loading,
        error,
        refreshSettings,
        refreshCategories,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

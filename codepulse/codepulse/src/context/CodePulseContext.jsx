import React, { createContext, useState, useEffect } from 'react';
import * as api from '../api';

export const CodePulseContext = createContext();

export function CodePulseProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('codepulse_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [submissions, setSubmissions] = useState([]);
  const [errorLibrary, setErrorLibrary] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load errors on startup
  useEffect(() => {
    const loadErrors = async () => {
      try {
        const errors = await api.getErrors();
        setErrorLibrary(errors);
      } catch (err) {
        console.error("Failed to load error library from Django backend:", err);
      }
    };
    loadErrors();

    const handleAuthError = () => {
      setUser(null);
    };
    window.addEventListener('auth_unauthorized', handleAuthError);
    return () => window.removeEventListener('auth_unauthorized', handleAuthError);
  }, []);

  // Load submissions whenever user logs in or changes
  useEffect(() => {
    if (user) {
      const loadSubmissions = async () => {
        setLoading(true);
        try {
          const subs = await api.getSubmissions();
          setSubmissions(subs);
        } catch (err) {
          console.error("Failed to load submissions from Django backend:", err);
        } finally {
          setLoading(false);
        }
      };
      loadSubmissions();
    } else {
      setSubmissions([]);
    }
  }, [user]);

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login(email, password);
      setUser(data);
      sessionStorage.setItem('codepulse_user', JSON.stringify(data));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await api.register(name, email, password);
      setUser(data);
      sessionStorage.setItem('codepulse_user', JSON.stringify(data));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const loginDemoUser = async () => {
    setLoading(true);
    try {
      // Authenticate with Django backend to get a real token
      const data = await api.login("alex.mercer@codepulse.io", "demopassword123");
      setUser(data);
      sessionStorage.setItem('codepulse_user', JSON.stringify(data));
      return data;
    } catch (err) {
      console.warn("Django backend demo auth failed, falling back to local session", err);
      const demoUser = { name: "Alex Mercer", email: "alex.mercer@codepulse.io", token: "demo-token" };
      setUser(demoUser);
      sessionStorage.setItem('codepulse_user', JSON.stringify(demoUser));
      return demoUser;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    setUser(null);
    sessionStorage.removeItem('codepulse_user');
  };

  const addSubmission = async (newSubData) => {
    setLoading(true);
    try {
      const savedSub = await api.saveSubmission(newSubData);
      setSubmissions(prev => [savedSub, ...prev]);
      return savedSub;
    } catch (err) {
      console.error("Failed to save submission on Django backend:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CodePulseContext.Provider value={{
      user,
      submissions,
      errorLibrary,
      loading,
      loginUser,
      registerUser,
      loginDemoUser,
      logoutUser,
      addSubmission
    }}>
      {children}
    </CodePulseContext.Provider>
  );
}

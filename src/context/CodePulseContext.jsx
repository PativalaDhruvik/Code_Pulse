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
  }, []);

  // Load submissions and error library whenever user logs in or changes
  useEffect(() => {
    if (user) {
      const loadUserData = async () => {
        setLoading(true);
        try {
          const [subs, errors] = await Promise.all([
            api.getSubmissions(),
            api.getErrors()
          ]);
          setSubmissions(subs);
          setErrorLibrary(errors);
        } catch (err) {
          console.error("Failed to load user data from Django backend:", err);
          // Try loading individually if combined call fails
          try {
            const subs = await api.getSubmissions();
            setSubmissions(subs);
          } catch (e) { }
          try {
            const errors = await api.getErrors();
            setErrorLibrary(errors);
          } catch (e) { }
        } finally {
          setLoading(false);
        }
      };
      loadUserData();
    } else {
      setSubmissions([]);
    }
  }, [user]);


  // saving the login token
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login(email, password);
      setUser(data);
      sessionStorage.setItem('codepulse_user', JSON.stringify(data));
      sessionStorage.removeItem('codepulse_checkcode_state');
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
      sessionStorage.removeItem('codepulse_checkcode_state');
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
      sessionStorage.removeItem('codepulse_checkcode_state');
      return data;
    } catch (err) {
      console.warn("Django backend demo auth failed, falling back to local session", err);
      const demoUser = { name: "Alex Mercer", email: "alex.mercer@codepulse.io", token: "demo-token" };
      setUser(demoUser);
      sessionStorage.setItem('codepulse_user', JSON.stringify(demoUser));
      sessionStorage.removeItem('codepulse_checkcode_state');
      return demoUser;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    setUser(null);
    sessionStorage.removeItem('codepulse_user');
    sessionStorage.removeItem('codepulse_checkcode_state');
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

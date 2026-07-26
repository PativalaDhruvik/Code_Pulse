import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CodePulseProvider, CodePulseContext } from './context/CodePulseContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CheckCode from './pages/CheckCode';
import MyPulse from './pages/MyPulse';
import History from './pages/History';
import ErrorLibrary from './pages/ErrorLibrary';

// Protected layout check
function ProtectedLayout() {
  const { user } = useContext(CodePulseContext);
  return user ? <Layout /> : <Navigate to="/" replace />;
}

// Redirect logged in user from Login Page
function PublicRoute({ children }) {
  const { user } = useContext(CodePulseContext);
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Authentication Path */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected Diagnostics Paths */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/check" element={<CheckCode />} />
        <Route path="/pulse" element={<MyPulse />} />
        <Route path="/history" element={<History />} />
        <Route path="/learn" element={<ErrorLibrary />} />
      </Route>

      {/* Catch All Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <CodePulseProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </CodePulseProvider>
  );
}

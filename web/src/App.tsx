import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Home from './pages/Home';
import MeetingDetail from './pages/MeetingDetail';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import './App.css';

function App() {
  useEffect(() => {
    // Request notification permission for browser notifications
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected Routes (Sidebar Layout) */}
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/meeting/:id" element={<MeetingDetail />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<div style={{ color: 'white', padding: 20 }}><h1>404 Not Found</h1><p>Current Path: {window.location.pathname}</p></div>} />
    </Routes>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;

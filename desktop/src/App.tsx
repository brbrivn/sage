import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Home from './pages/Home';
import MeetingDetail from './pages/MeetingDetail';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import './App.css';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onDeepLink((urlPath) => {
        console.log('[Renderer] Deep link received:', urlPath);
        // urlPath will be like "auth/callback?token=..."
        const target = `/${urlPath}`;
        console.log('[Renderer] Navigating to:', target);
        navigate(target);
      });
    }
  }, [navigate]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected Routes (Sidebar Layout) */}
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/meeting/:id" element={<MeetingDetail />} />
        <Route path="/settings" element={<Settings />} /> {/* Added Settings route */}
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

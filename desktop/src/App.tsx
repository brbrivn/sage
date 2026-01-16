import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import MeetingDetail from './pages/MeetingDetail';
import AuthCallback from './pages/AuthCallback';
import './App.css';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.onDeepLink((urlPath) => {
        // urlPath will be like "auth/callback?token=..."
        navigate(`/${urlPath}`);
      });
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/home" element={<Home />} />
      <Route path="/meeting/:id" element={<MeetingDetail />} />
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

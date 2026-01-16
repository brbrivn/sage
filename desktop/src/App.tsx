import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import MeetingDetail from './pages/MeetingDetail';
import AuthCallback from './pages/AuthCallback';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/home" element={<Home />} />
        <Route path="/meeting/:id" element={<MeetingDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

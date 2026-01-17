import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { removeToken } from '../services/api';
import ActivityPanel from './ActivityPanel';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        removeToken();
        navigate('/');
    };

    return (
        <aside className="sidebar">
            <div className="logo-area">
                <h1>Sage</h1>
            </div>

            <nav className="nav-menu">
                <NavLink to="/home" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Home size={20} />
                    <span>Timeline</span>
                </NavLink>

                <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <SettingsIcon size={20} />
                    <span>Settings</span>
                </NavLink>
            </nav>

            <div className="footer-menu">
                <button onClick={handleLogout} className="nav-item logout-btn">
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

const Layout = () => {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <Outlet />
            </main>
            <ActivityPanel />
        </div>
    );
};

export default Layout;

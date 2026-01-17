import { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Shield } from 'lucide-react';

const Settings = () => {
    // Basic persisted state for settings (mocking backend persistence for now)
    const [theme, setTheme] = useState(localStorage.getItem('sage_theme') || 'dark');
    const [notifications, setNotifications] = useState(true);
    const [sound, setSound] = useState(true);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('sage_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <header className="header">
                <h2>Settings</h2>
            </header>

            <div className="settings-section">
                <h3><Shield size={18} /> General</h3>

                <div className="setting-item">
                    <div className="setting-info">
                        <span>Appearance</span>
                        <small>Switch between light and dark mode</small>
                    </div>
                    <button className="icon-btn" onClick={toggleTheme}>
                        {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                </div>
            </div>

            <div className="settings-section">
                <h3><Bell size={18} /> Notifications</h3>

                <div className="setting-item">
                    <div className="setting-info">
                        <span>Desktop Alerts</span>
                        <small>Show native popups when VIPs join</small>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={notifications}
                            onChange={(e) => setNotifications(e.target.checked)}
                        />
                        <span className="slider"></span>
                    </label>
                </div>

                <div className="setting-item">
                    <div className="setting-info">
                        <span>Sound</span>
                        <small>Play a chime when alert triggers</small>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={sound}
                            onChange={(e) => setSound(e.target.checked)}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>

            <div className="settings-section">
                <h3>Account</h3>
                <div className="setting-item">
                    <div className="setting-info">
                        <span>Connected Google Account</span>
                        <small>Syncing calendars from Google</small>
                    </div>
                    <span className="badge-connected">Connected</span>
                </div>
            </div>
        </div>
    );
};

export default Settings;

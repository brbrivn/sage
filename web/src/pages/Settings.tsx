import { useState, useEffect } from 'react';
import { Moon, Sun, UserCircle, Plus } from 'lucide-react';

const Settings = () => {
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
        <div className="settings-container">
            <div className="settings-header">
                <h1>Settings</h1>
                <p>Manage your account, appearance, and notifications.</p>
            </div>

            <div className="settings-body">
                {/* General Section */}
                <section className="settings-group">
                    <h2 className="group-title">General</h2>
                    <div className="settings-row">
                        <div className="row-info">
                            <label>Appearance</label>
                            <span>Toggle between light and dark mode.</span>
                        </div>
                        <button className="theme-toggle" onClick={toggleTheme}>
                            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                            <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
                        </button>
                    </div>
                </section>

                {/* Notifications Section */}
                <section className="settings-group">
                    <h2 className="group-title">Notifications</h2>
                    <div className="settings-row">
                        <div className="row-info">
                            <label>Desktop Alerts</label>
                            <span>Receive notifications when participants join.</span>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={notifications}
                                onChange={(e) => setNotifications(e.target.checked)}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className="settings-row">
                        <div className="row-info">
                            <label>Sound Effects</label>
                            <span>Play a sound when an alert is triggered.</span>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={sound}
                                onChange={(e) => setSound(e.target.checked)}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </section>

                {/* Account Section */}
                <section className="settings-group">
                    <h2 className="group-title">Accounts</h2>
                    <div className="settings-row">
                        <div className="row-info">
                            <label>Connected Google Accounts</label>
                            <span>Manage your linked calendars and event sources.</span>
                        </div>
                    </div>

                    <div className="accounts-list">
                        <div className="account-item">
                            <UserCircle size={20} className="account-icon" />
                            <div className="account-details">
                                <span className="account-email">Primary Account</span>
                                <span className="account-status">Connected</span>
                            </div>
                        </div>

                        <button className="add-account-btn" onClick={() => {
                            const user = JSON.parse(atob(localStorage.getItem('sage_token')?.split('.')[1] || '{}'));
                            window.location.href = `http://localhost:5001/api/auth/google?state=web:${user.id}`;
                        }}>
                            <Plus size={16} />
                            <span>Link another Google Account</span>
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;

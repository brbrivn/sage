import { useState, useEffect } from 'react';
import { Moon, Sun, Plus } from 'lucide-react';

const Settings = () => {
    const [theme, setTheme] = useState(localStorage.getItem('sage_theme') || 'dark');
    const [notifMethod, setNotifMethod] = useState('push');
    const [accounts, setAccounts] = useState<any[]>([]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('sage_theme', theme);

        // Fetch accounts
        import('../services/api').then(({ fetchAccounts }) => {
            fetchAccounts().then(setAccounts).catch(console.error);
        });
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const handleLinkAccount = () => {
        const user = JSON.parse(atob(localStorage.getItem('sage_token')?.split('.')[1] || '{}'));
        window.location.href = `http://localhost:5001/api/auth/google?state=web:${user.id}`;
    };

    return (
        <div className="settings-container">
            <header className="settings-header">
                <h1>Settings</h1>
                <p>Manage your connections and preferences.</p>
            </header>

            <div className="settings-body">
                {/* Connected Accounts */}
                <section className="settings-group">
                    <h2 className="group-title">Connected Accounts</h2>
                    <div className="accounts-list">
                        {accounts.map(acc => (
                            <div key={acc.id} className="account-item">
                                <div className="log-icon" style={{ background: 'var(--primary-faded)', color: 'var(--primary)' }}>
                                    {acc.provider === 'google' ? 'G' : 'Z'}
                                </div>
                                <div className="account-details" style={{ flex: 1 }}>
                                    <span className="account-email">{acc.email}</span>
                                    <span className="account-status">Connected</span>
                                </div>
                                <button className="event-op-btn danger">Disconnect</button>
                            </div>
                        ))}

                        <button className="add-account-btn" onClick={handleLinkAccount}>
                            <Plus size={16} />
                            <span>Link another Google Account</span>
                        </button>
                    </div>
                </section>

                {/* Notification Method */}
                <section className="settings-group">
                    <h2 className="group-title">Notification Method</h2>
                    <div className="settings-row" onClick={() => setNotifMethod('push')}>
                        <div className="row-info">
                            <label>Push Notification</label>
                            <span>Receive browser alerts instantly.</span>
                        </div>
                        <input type="radio" checked={notifMethod === 'push'} readOnly />
                    </div>
                    <div className="settings-row" onClick={() => setNotifMethod('email')}>
                        <div className="row-info">
                            <label>Email Alert</label>
                            <span>Receive an email when VIP joins.</span>
                        </div>
                        <input type="radio" checked={notifMethod === 'email'} readOnly />
                    </div>
                    <button className="secondary-btn" style={{ marginTop: 8 }} onClick={() => new Notification('Test', { body: 'This is a test alert.' })}>
                        Test Notification
                    </button>
                </section>

                {/* Preferences */}
                <section className="settings-group">
                    <h2 className="group-title">Preferences</h2>
                    <div className="settings-row">
                        <div className="row-info">
                            <label>Appearance</label>
                            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                        </div>
                        <button className="theme-toggle" onClick={toggleTheme}>
                            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                        </button>
                    </div>
                    <div className="settings-row">
                        <div className="row-info">
                            <label>Calendar Sync Frequency</label>
                            <span>How often we check for changes.</span>
                        </div>
                        <select className="pill-select" style={{ border: '1px solid var(--border)', padding: '4px 8px', borderRadius: 6 }}>
                            <option>15 min</option>
                            <option>30 min</option>
                            <option>1 hour</option>
                        </select>
                    </div>
                </section>

                {/* Account */}
                <section className="settings-group">
                    <h2 className="group-title">Account</h2>
                    <button className="nav-item logout-btn" style={{ justifyContent: 'flex-start', padding: 0 }} onClick={() => {
                        import('../services/api').then(({ removeToken }) => {
                            removeToken();
                            window.location.href = '/';
                        });
                    }}>
                        Log Out
                    </button>
                </section>
            </div>
        </div>
    );
};

export default Settings;

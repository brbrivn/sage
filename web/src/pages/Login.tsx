import React from 'react';

const Login = () => {
    const handleLogin = () => {
        // Now strictly Web-focused
        const loginUrl = `http://localhost:5001/api/auth/google?state=web`;
        window.location.href = loginUrl;
    };

    return (
        <div className="settings-container" style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
        }}>
            <div className="logo-area" style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 48, letterSpacing: '-0.04em' }}>Sage</h1>
            </div>

            <h2 style={{ fontSize: 24, marginBottom: 16, fontWeight: 500 }}>
                Confidence in your calendar.
            </h2>
            <p style={{ color: 'var(--text-sec)', marginBottom: 32, maxWidth: 300 }}>
                Get notified the second your VIPs join the meeting. No more awkward waiting.
            </p>

            <button
                onClick={handleLogin}
                className="add-account-btn"
                style={{
                    background: 'var(--text)',
                    color: 'var(--bg)',
                    padding: '12px 24px',
                    fontSize: 15,
                    fontWeight: 600,
                    border: 'none',
                    width: 'auto'
                }}
            >
                Sign in with Google
            </button>

            <div style={{ marginTop: 64, color: 'var(--gray-600)', fontSize: 12 }}>
                Standard Web Push Notifications • HIPAA Compliant • Secure
            </div>
        </div>
    );
};

export default Login;

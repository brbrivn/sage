

const Login = () => {
    const handleLogin = () => {
        // Detect if running in Electron or Web
        const isElectron = !!window.electronAPI;
        const state = isElectron ? 'desktop' : 'web';
        const loginUrl = `http://localhost:5001/api/auth/google?state=${state}`;

        if (isElectron) {
            window.electronAPI.openExternal(loginUrl);
        } else {
            window.location.href = loginUrl;
        }
    };

    return (
        <div className="container">
            <h1>Sage</h1>
            <p>Meeting VIP Alerts</p>
            <button onClick={handleLogin}>Sign in with Google</button>
        </div>
    );
};

export default Login;

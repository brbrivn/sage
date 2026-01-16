

const Login = () => {
    const handleLogin = () => {
        const loginUrl = 'http://localhost:5000/api/auth/google?state=desktop';
        if (window.electronAPI) {
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

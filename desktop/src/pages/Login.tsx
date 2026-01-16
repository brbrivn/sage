

const Login = () => {
    const handleLogin = () => {
        // Redirect to Backend Google Auth
        // On success, backend will redirect to http://localhost:5173/auth/callback?token=...
        window.location.href = 'http://localhost:5000/api/auth/google';
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

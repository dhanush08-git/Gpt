import { useState } from "react";
import "./Login.css";

function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        // Implement login logic here, e.g., send credentials to backend and handle response
        const res = await fetch("http://localhost:8000/api/auth/login", {
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                email,password
            })
        });
        const data = await res.json();
        if(!res.ok){
            setError(data.message || "Login failed. Please try again(invalid credentials).");
            return;
        }
        localStorage.setItem("token",data.token);
        localStorage.setItem("username", data.username);
        window.location.href = "/"; // Redirect to home page after login
    };
    
    return(
         <div className="login-page">
          <div className="login-box">
              <h1>Login</h1>
                <input type="email" placeholder="Email" 
                value={email} onChange={e =>
                setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              <button onClick={handleLogin}>Login</button>
              {error && <p 
                className="error">{error}</p>}
                <p className="link">Don't have an
                account? <a href="/register">Register</a></p>
            </div>
        </div>
    );
}

export default Login;
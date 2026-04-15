import { useState } from "react";
import "./Register.css";
import API from "../api.js";


const Register = () => {
const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const res = await fetch(`${API}/api/auth/register`, {
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                username: userName,
                email: email,
                password: password
            })
        });
        const data = await res.json();
        if(!res.ok){
            setError(data.message || "Login failed. Please try again(invalid credentials).");
            return;
        }
        console.log(data);
        console.log("status:", res.status, "ok:", res.ok);
        if(res.ok){
            alert("Registration successful! Please login.");
            window.location.href = "/login"; // Redirect to login page after successful registration
        } else {
            alert(data.message || "Registration failed. Please try again.");
        }
    };
    return (
         <div className="register-page">
          <div className="register-box">
              <h1>Create Account</h1>
                <form onSubmit={handleSubmit}>
                    <input type="text" 
                    placeholder="Username" />
                    <input type="email" 
                    placeholder="Email" />
                    <input type="password" 
                    placeholder="Password" />
                    <button type="submit">Register</button>
                </form>
                {error && <p 
                className="error">{error}</p>}
                <p className="link">Already have an account? <a href="/login">Login</a></p>
          </div>
      </div>
    );
}

export default Register;
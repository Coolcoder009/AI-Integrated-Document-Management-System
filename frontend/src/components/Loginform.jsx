import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Loginform.css';
import eyeIcon from '../Assets/eye.png';

function LoginForm({ onSignIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [activeTab, setActiveTab] = useState('individual'); // 'individual' or 'organization'
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    user_type: activeTab, // Include the selected user type
                }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('user_id', data.user_id); // Optionally save user ID
                localStorage.setItem('email', data.email); // Optionally save email
                onSignIn(); // Update app's authenticated state
                navigate('/'); // Redirect to Home
            } else {
                const errorData = await response.json();
                console.error("Login error:", errorData.detail);
                alert("Invalid credentials or user type");
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="main-container">
            <div className="image-container">
            </div>
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    <div className="tab-buttons">
                        <button
                            type="button"
                            className={`tab-button ${activeTab === 'individual' ? 'active' : ''}`}
                            onClick={() => setActiveTab('individual')}
                        >
                            Individual
                        </button>
                        <button
                            type="button"
                            className={`tab-button ${activeTab === 'organization' ? 'active' : ''}`}
                            onClick={() => setActiveTab('organization')}
                        >
                            Organization
                        </button>
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
                            required
                        />
                    </div>
                    <div className="input-group password-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                        <button
                            type="button"
                            className="show-password-button"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <img src={eyeIcon} alt="Show Password" />
                        </button>
                    </div>
                    <div className="checkbox-group">
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                        <span>Remember me</span>
                    </div>
                    <button type="submit" className="sign-in-button">Sign In</button>
                    <div className="signup-link">
                        Don’t have an account? <Link to="/signup">Sign up now</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;

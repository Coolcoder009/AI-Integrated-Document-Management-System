import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import '../styles/Loginform.css';
import eyeIcon from '../Assets/eye.png';

function SignupForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('individual'); // Either 'individual' or 'organization'
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // Initialize navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    user_type: activeTab, // Send user_type based on selected tab
                }),
            });

            if (response.ok) {
                // Navigate to the Login page after successful signup
                navigate('/login');
                alert("User created successfully! Please log in.");
            } else {
                const errorData = await response.json();
                console.error("Signup error:", errorData.detail);
                alert(errorData.detail || "Failed to sign up.");
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="main-container">
            <div className="image-container">
            </div>
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>Sign Up</h2>
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
                    <button type="submit" className="sign-in-button">Sign Up</button>
                    <div className="signup-link">
                        Already have an account? <a href="/login">Login</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignupForm;

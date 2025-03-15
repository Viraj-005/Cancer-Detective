import { useState } from "react";
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../token";
import google from "../assets/google.png";
import logo from '../assets/CDlogo.svg';
import '../styles/AuthForm.css';

const AuthForm = ({ route, method }) => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        showPassword: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const returnUrl = location.state?.from || '/';

    const [passwordChecks, setPasswordChecks] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });
    
    // Add this function to check password requirements
    const checkPasswordRequirements = (password) => {
        setPasswordChecks({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*]/.test(password)
        });
    };
    
    // Update the handleChange function
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: name === 'password' ? value : value.trim()
        }));
    
        // Check password requirements when password field changes
        if (name === 'password') {
            checkPasswordRequirements(value);
            setShowPasswordRequirements(true);
        } else if (name === 'confirmPassword') {
            setShowPasswordRequirements(false);
        }
    };

    const togglePasswordVisibility = () => {
        setFormData(prevState => ({
            ...prevState,
            showPassword: !prevState.showPassword
        }));
    };

    const togglePasswordRequirements = () => {
        setShowPasswordRequirements(!showPasswordRequirements);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return "Email is required";
        }
        if (!emailRegex.test(email)) {
            return "Please enter a valid email address";
        }
        return null;
    };
    
    const validatePassword = (password, isRegistration = false) => {
        if (!password) {
            return "Password is required";
        }
        if (isRegistration) {
            if (password.length < 8) {
                return "Password must be at least 8 characters long";
            }
            if (!/[A-Z]/.test(password)) {
                return "Password must contain at least one uppercase letter";
            }
            if (!/[a-z]/.test(password)) {
                return "Password must contain at least one lowercase letter";
            }
            if (!/[0-9]/.test(password)) {
                return "Password must contain at least one number";
            }
            if (!/[!@#$%^&*]/.test(password)) {
                return "Password must contain at least one special character (!@#$%^&*)";
            }
        }
        return null;
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
    
        // Validate email
        const emailError = validateEmail(formData.email);
        if (emailError) {
            toast.error(emailError);
            setLoading(false);
            return;
        }
    
        // Validate password
        const passwordError = validatePassword(formData.password, method === 'register');
        if (passwordError) {
            toast.error(passwordError);
            setLoading(false);
            return;
        }
    
        // For registration, validate confirm password
        if (method === 'register') {
            if (!formData.confirmPassword) {
                toast.error("Please confirm your password");
                setLoading(false);
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                toast.error("Passwords do not match");
                setLoading(false);
                return;
            }
        }
    
        const submissionData = method === 'register'
        ? {
            username: formData.username.trim(),
            email: formData.email.trim(),
            password: formData.password,
            confirm_password: formData.confirmPassword
        }
        : {
            email: formData.email.trim(),
            password: formData.password
        };
    
        try {
            const res = await api.post(route, submissionData);
            
            if (method === 'login') {
                if (res.data.access) {
                    localStorage.setItem(ACCESS_TOKEN, res.data.access);
                    localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                    toast.success('Successfully logged in!');
                    navigate(returnUrl);
                } else {
                    throw new Error('No access token received');
                }
            } else {
                toast.success('Registration successful! Please verify your email.');
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (error) {
            console.error("Error:", error);
            let errorMessage = "An error occurred. Please try again.";
            
            if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
            } else if (error.response?.status === 401) {
                errorMessage = "Invalid email or password";
            } else if (error.response?.status === 400) {
                if (error.response.data.email) {
                    errorMessage = error.response.data.email[0];
                } else if (error.response.data.password) {
                    errorMessage = error.response.data.password[0];
                }
            }
            
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    // Add password requirement hints for registration
    const PasswordRequirements = () => {
        if (method !== 'register' || !showPasswordRequirements) return null;
        
        return (
            <div className="password-requirements-container">
                <div className="password-requirements-header" onClick={togglePasswordRequirements}>
                    <p className="requirements-title">Password Requirements</p>
                    {showPasswordRequirements ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {showPasswordRequirements && (
                    <div className="password-requirements">
                        <ul className="requirements-list">
                            <li className={passwordChecks.length ? 'valid' : 'invalid'}>
                                <span className="check-icon">{passwordChecks.length ? '✓' : '✕'}</span>
                                At least 8 characters
                            </li>
                            <li className={passwordChecks.uppercase ? 'valid' : 'invalid'}>
                                <span className="check-icon">{passwordChecks.uppercase ? '✓' : '✕'}</span>
                                One uppercase letter
                            </li>
                            <li className={passwordChecks.lowercase ? 'valid' : 'invalid'}>
                                <span className="check-icon">{passwordChecks.lowercase ? '✓' : '✕'}</span>
                                One lowercase letter
                            </li>
                            <li className={passwordChecks.number ? 'valid' : 'invalid'}>
                                <span className="check-icon">{passwordChecks.number ? '✓' : '✕'}</span>
                                One number
                            </li>
                            <li className={passwordChecks.special ? 'valid' : 'invalid'}>
                                <span className="check-icon">{passwordChecks.special ? '✓' : '✕'}</span>
                                One special character (!@#$%^&*)
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    const handleGoogleLogin = () => {
        // Display the toast message
        toast.info("Redirecting to Google Login...");
    
        // Redirect to Google login page after a delay (e.g., 2 seconds)
        setTimeout(() => {
            window.location.href = "http://localhost:8000/accounts/google/login/";
        }, 2000); // 2000 milliseconds = 2 seconds
    };

    return (
        <div className="form-container">
            {loading && (
                <div className="loading-indicator">
                    {error ? <span className="error-message">{error}</span> : <div className="spinner-load"></div>}
                </div>
            )}
            {!loading && (
                <form onSubmit={handleSubmit} className="form">
                    <div className="logo-container">
                        <img src={logo} alt="Logo" className="form-logo" />
                    </div>
                    <h2>{method === 'register' ? 'Create Your Account' : 'Welcome Back'}</h2>
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    {method === 'register' && (
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <div className="input-wrapper">
                                <FaUser className="input-icon" />
                                <input 
                                    type="text" 
                                    id="username"
                                    name="username"
                                    value={formData.username} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Enter your username"
                                    autoComplete="username"
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-wrapper">
                            <FaEnvelope className="input-icon" />
                            <input 
                                type="email" 
                                id="email"
                                name="email"
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                                placeholder="Enter your email"
                                autoComplete="email"
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <FaLock className="input-icon" />
                            <input 
                                type={formData.showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}  
                                onChange={handleChange} 
                                required 
                                placeholder="Enter your password"
                                autoComplete={method === 'register' ? "new-password" : "current-password"}
                            />
                            <div className="eye-icon" onClick={togglePasswordVisibility}>
                                {formData.showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                        <PasswordRequirements />
                    </div>

                    {method === 'register' && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="input-wrapper">
                                <FaLock className="input-icon" />
                                <input 
                                    type={formData.showPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}  
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                />
                                <div className="eye-icon" onClick={togglePasswordVisibility}>
                                {formData.showPassword ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>
                        </div>
                    )}

                    <button type="submit" className="form-button">
                        Continue
                    </button>

                    {/* Forgot Password Link */}
                    {method === 'login' && (
                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                            <a 
                                href="/reset-password" 
                                style={{ 
                                    color: '#2563eb', 
                                    textDecoration: 'none',
                                    fontSize: '14px'
                                }}
                                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                            >
                                Forgot Password?
                            </a>
                        </div>
                    )}

                    <div style={{ 
                        textAlign: 'center', 
                        marginTop: '15px', 
                        marginBottom: '20px'
                    }}>
                        <span style={{ color: '#000' }}>
                            {method === 'login' ? "Don't have an account? " : "Already have an account? "}
                        </span>
                        <a 
                            href={method === 'login' ? "/register" : "/login"}
                            style={{ 
                                color: '#2563eb', 
                                textDecoration: 'none'
                            }}
                            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                        >
                            {method === 'login' ? 'Sign up' : 'Login'}
                        </a>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        margin: '20px 0',
                        gap: '10px'
                    }}>
                        <div style={{
                            flex: 1,
                            height: '1px',
                            backgroundColor: '#ddd'
                        }} />
                        <span style={{
                            color: '#666',
                            fontSize: '14px'
                        }}>OR</span>
                        <div style={{
                            flex: 1,
                            height: '1px',
                            backgroundColor: '#ddd'
                        }} />
                    </div>

                    <button 
                        type="button" 
                        onClick={handleGoogleLogin}
                        className="google-button"
                    >
                        <img src={google} alt="Google icon" className="google-icon" />
                        Continue with Google
                    </button>
                    <div className="legal-links">
                        <a 
                            href="/terms" 
                            onClick={(e) => {
                            e.preventDefault();
                            window.open('/terms', '_blank', 'noopener,noreferrer');
                        }}
                        >
                            Terms of Use
                        </a>
                        <span style={{ color: '#666' }}>|</span>
                        <a
                            href="/privacy" 
                            onClick={(e) => {
                            e.preventDefault();
                            window.open('/privacy', '_blank', 'noopener,noreferrer');
                        }}
                        >
                            Privacy Policy
                        </a>
                    </div>
                </form>
            )}
        </div>
    );
};

AuthForm.propTypes = {
    route: PropTypes.string.isRequired,
    method: PropTypes.oneOf(['login', 'register']).isRequired
};

export default AuthForm;
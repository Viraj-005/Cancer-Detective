import { useState } from "react";
import { FaEnvelope, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom"; // Assuming you're using react-router for navigation
import api from "../api";
import "../styles/ResetPassword.css";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!email) {
            setError("Email is required.");
            setLoading(false);
            return;
        }

        console.log("Sending request to reset password with email:", email);

        try {
            const res = await api.post("/api/reset-password/", { email });
            console.log("Response from server:", res.data);

            if (res.status === 200) {
                setEmailSent(true); // Show the success message
                toast.success("Password reset link sent to your email.");
            }
        } catch (error) {
            console.error("Error during request:", error);
            if (error.response) {
                console.error("Server response data:", error.response.data);
                console.error("Server response status:", error.response.status);
                console.error("Server response headers:", error.response.headers);

                if (error.response.status === 404) {
                    setError("User with this email does not exist.");
                    toast.error("User with this email does not exist.");
                } else if (error.response.status === 500) {
                    setError("Failed to send reset link. Please try again later.");
                    toast.error("Failed to send reset link. Please try again later.");
                } else {
                    setError("Something went wrong. Please try again.");
                    toast.error("Something went wrong. Please try again.");
                }
            } else if (error.request) {
                setError("Network error. Please check your internet connection.");
                toast.error("Network error. Please check your internet connection.");
            } else {
                setError("Something went wrong. Please try again.");
                toast.error("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendEmail = () => {
        setEmailSent(false); // Allow the user to resend the email
    };

    return (
        <div className="form-container">
            {loading && (
                <div className="loading-indicator">
                    {error ? <span className="error-message">{error}</span> : <div className="spinner-load"></div>}
                </div>
            )}
            {!loading && !emailSent && (
                <form onSubmit={handleSubmit} className="form">
                    <h2>Reset Password</h2>
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-wrapper">
                            <FaEnvelope className="input-icon" />
                            <input 
                                type="email" 
                                id="email"
                                name="email"
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                placeholder="Enter your email"
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <button type="submit" className="form-button">
                        Send Reset Link
                    </button>

                    <Link to="/login" className="back-to-login-link">
                        <FaArrowLeft className="back-icon" />
                        Back to Login
                    </Link>
                </form>
            )}

            {emailSent && (
                <div className="email-sent-message">
                    <FaCheckCircle className="success-icon" />
                    <h2>Check Your Email</h2>
                    <p>Please check the email address for instructions to reset your password.</p>
                    <button 
                        type="button" 
                        onClick={handleResendEmail}
                        className="resend-button"
                    >
                        Resend Email
                    </button>
                </div>
            )}
        </div>
    );
};

export default ResetPassword;
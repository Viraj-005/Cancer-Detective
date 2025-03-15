import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../api";
import "../styles/AuthForm.css";

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { uidb64, token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (!newPassword || !confirmPassword) {
            setError("All fields are required.");
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        console.log("Sending request to change password with:", { uidb64, token });

        try {
            const res = await api.post(`/api/change-password/${uidb64}/${token}/`, { new_password: newPassword });
            console.log("Response from server:", res.data);

            if (res.status === 200) {
                setSuccess("Password changed successfully.");
                toast.success("Password changed successfully.");
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            }
        } catch (error) {
            console.error("Error during request:", error);
            if (error.response) {
                console.error("Server response data:", error.response.data);
                console.error("Server response status:", error.response.status);
                console.error("Server response headers:", error.response.headers);

                if (error.response.status === 400) {
                    setError("Invalid or expired token.");
                    toast.error("Invalid or expired token.");
                } else if (error.response.status === 404) {
                    setError("Endpoint not found. Please check the URL.");
                    toast.error("Endpoint not found. Please check the URL.");
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

    return (
        <div className="form-container">
            {loading && (
                <div className="loading-indicator">
                    {error ? <span className="error-message">{error}</span> : <div className="spinner-load"></div>}
                </div>
            )}
            {!loading && (
                <form onSubmit={handleSubmit} className="form">
                    <h2>Change Password</h2>
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <div className="input-wrapper">
                            <FaLock className="input-icon" />
                            <input 
                                type={showPassword ? "text" : "password"}
                                id="newPassword"
                                name="newPassword"
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)} 
                                required 
                                placeholder="Enter new password"
                                autoComplete="new-password"
                            />
                            <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="input-wrapper">
                            <FaLock className="input-icon" />
                            <input 
                                type={showPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                                placeholder="Confirm new password"
                                autoComplete="new-password"
                            />
                            <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="form-button">
                        Change Password
                    </button>
                </form>
            )}
        </div>
    );
};

export default ChangePassword;
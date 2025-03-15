import { useState } from "react";
import PropTypes from "prop-types";
import api from "../api";
import { toast } from "react-toastify";
import { clearTokens } from "../token";
import google from "../assets/google.png";

const ProfileModal = ({ user, onClose }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDeleteAccount = async () => {
        try {
            await api.delete('/api/user/delete/');
            clearTokens();
            toast.success("Your account has been successfully deleted.");
            setTimeout(() => {
                window.location.href = '/';
            }, 2000); // Redirect after 2 seconds to allow the user to see the toast message
        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error('Failed to delete account. Please try again.');
        }
    };

    return (
        <div className="profile-modal-overlay">
            <div className="profile-modal-container">
                <div className="profile-modal-header">
                    <h2>Profile Information</h2>
                    <button onClick={onClose} className="profile-modal-close">×</button>
                </div>

                <div className="profile-modal-content">
                    <div className="profile-info-row">
                        <span className="profile-info-label">Username:</span>
                        <span className="profile-info-value">
                            {user.username}
                            {user.googleProfile && (
                                <img 
                                    src={google} 
                                    alt="Google Account" 
                                    className="google-account-icon"
                                />
                            )}
                        </span>
                    </div>
                    <div className="profile-info-row">
                        <span className="profile-info-label">Email:</span>
                        <span className="profile-info-value">{user.email}</span>
                    </div>
                </div>

                <div className="profile-modal-footer">
                    {!showDeleteConfirm ? (
                        <button 
                            onClick={() => setShowDeleteConfirm(true)}
                            className="profile-delete-btn"
                        >
                            Delete Account
                        </button>
                    ) : (
                        <div className="profile-delete-confirm">
                            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                            <div className="profile-delete-actions">
                                <button 
                                    onClick={handleDeleteAccount}
                                    className="profile-delete-confirm-btn"
                                >
                                    Yes, Delete
                                </button>
                                <button 
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="profile-delete-cancel-btn"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

ProfileModal.propTypes = {
    user: PropTypes.shape({
        username: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        googleProfile: PropTypes.string
    }).isRequired,
    onClose: PropTypes.func.isRequired
};

export default ProfileModal;
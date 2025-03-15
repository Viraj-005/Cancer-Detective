import { useState } from 'react';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';
import PropTypes from 'prop-types';
import ProfileModal from '../components/ProfileModal';
import '../styles/ProfileSection.css';

const ProfileSection = ({ user, onLogout }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [imageError, setImageError] = useState(false); // Track image load failures

    // If user is null, don't render anything
    if (!user) {
        return null;
    }

    /**
     * Generate a deterministic dark color based on the user's email or username.
     * This ensures the color remains consistent for the same user.
     */
    const getDeterministicDarkColor = (input) => {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            hash = input.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = hash % 360; // Hue range: 0-359
        const saturation = 70; // Saturation range: 0-100 (70% for vibrant colors)
        const lightness = 50; // Lightness range: 0-100 (50% for dark colors)
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    /**
     * Get the profile icon based on the user's data.
     * - If `googleProfile` is a valid image URL, display the image.
     * - If the image fails to load, fallback to initials.
     * - If no `googleProfile`, use username initials.
     */
    const getProfileIcon = () => {
        if (user.googleProfile && user.googleProfile.startsWith('http') && !imageError) {
            return (
                <img 
                    src={user.googleProfile} 
                    alt="Profile" 
                    className="profile-image"
                    onError={() => setImageError(true)} // Handle image load failure
                />
            );
        }

        // Fallback: Display user's initials
        const initials = user.username
            ? user.username.substring(0, 2).toUpperCase()
            : 'U'; // Default to "U" if no username

        return (
            <div 
                className="profile-initials"
                style={{ backgroundColor: getDeterministicDarkColor(user.email || user.username) }}
            >
                {initials}
            </div>
        );
    };

    /**
     * Handle profile click to open the profile modal.
     */
    const handleProfileClick = () => {
        setShowProfileModal(true);
        setShowDropdown(false);
    };

    return (
        <div className="profile-section">
            {/* Profile Trigger */}
            <div 
                className="profile-trigger" 
                onClick={() => setShowDropdown(!showDropdown)}
            >
                {getProfileIcon()}
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
                <div className="profile-dropdown">
                    <button onClick={handleProfileClick} className="dropdown-item">
                        <FaUser /> {user.username || 'User'}
                    </button>
                    <button onClick={onLogout} className="dropdown-item">
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            )}

            {/* Profile Modal */}
            {showProfileModal && (
                <ProfileModal 
                    user={user} 
                    onClose={() => setShowProfileModal(false)} 
                />
            )}
        </div>
    );
};

// Prop Types for type-checking
ProfileSection.propTypes = {
    user: PropTypes.shape({
        username: PropTypes.string,
        email: PropTypes.string,
        googleProfile: PropTypes.string
    }),
    onLogout: PropTypes.func.isRequired
};

export default ProfileSection;
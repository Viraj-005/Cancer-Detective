import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleSignup = () => {
    onClose();
    navigate('/register');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Welcome back</h2>
        <p className="modal-description">
          Login or Signup to Upload Images and Get Cancer Detection Results.
        </p>
        
        <div className="button-container">
          <button
            onClick={handleLogin}
            className="login-button"
          >
            Log in
          </button>
          
          <button
            onClick={handleSignup}
            className="signup-button"
          >
            Sign up
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="stay-out-button"
        >
          Stay logged out
        </button>
      </div>
    </div>
  );
};

AuthModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  returnUrl: PropTypes.string
};

export default AuthModal;
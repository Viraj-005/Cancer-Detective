import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaArrowRight } from 'react-icons/fa';
import { useAuthentication } from "../auth";
import api from '../api';
import PropTypes from 'prop-types'; // Import PropTypes
import CDlogo from '../assets/CDlogo.svg';
import ProfileSection from '../components/ProfileSection';
import '../styles/Navbar.css';

function Navbar({ onProfileClick }) {
  const { isAuthorized, logout } = useAuthentication();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1250);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthorized) {
        try {
          const response = await api.get('/api/auth/user/');
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthorized]);

  const handleLogout = () => {
    logout(navigate);
    setUser(null);
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={CDlogo} alt="Cancer Detective Logo" className="logo-image" />
          Cancer Detective
        </Link>
      </div>

      {/* Desktop Navigation Links */}
      <ul className="navbar-links">
        <li><Link to="/detection" className="navbar-link">Detection</Link></li>
        <li><Link to="/about" className="navbar-link">About Us</Link></li>
        <li><Link to="/how-it-works" className="navbar-link">How It Works</Link></li>
        <li><Link to="/contact" className="navbar-link">Contact</Link></li>
      </ul>

      {/* Desktop Profile/Signup Section */}
      <div className="navbar-desktop-right">
        {isAuthorized && !loading ? (
          <ProfileSection 
            user={user} 
            onLogout={handleLogout}
            onProfileClick={onProfileClick}
          />
        ) : (
          <Link to="/getstarted" className="navbar-link desktop-signup">
            Get Started <FaArrowRight />
          </Link>
        )}
      </div>

      {/* Mobile Profile Section */}
      {isMobile && isAuthorized && !loading && (
        <div className="navbar-mobile-profile">
          <ProfileSection 
            user={user} 
            onLogout={handleLogout}
            onProfileClick={onProfileClick}
          />
        </div>
      )}

      {/* Mobile Menu Toggle */}
      <button className="menu-toggle" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <ul>
          <li><Link to="/detection" className="navbar-link">Detection</Link></li>
          <li><Link to="/about" className="navbar-link">About Us</Link></li>
          <li><Link to="/how-it-works" className="navbar-link">How It Works</Link></li>
          <li><Link to="/contact" className="navbar-link">Contact</Link></li>
          {!isAuthorized && (
            <li>
              <Link to="/signup" className="navbar-link mobile-signup">
                Get Started <FaArrowRight />
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

// Add PropTypes validation
Navbar.propTypes = {
  onProfileClick: PropTypes.func.isRequired, // Validate onProfileClick as a required function
};

export default Navbar;
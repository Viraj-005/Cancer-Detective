import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';
import CDlogo from '../assets/CDlogo.svg';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-text">
          <h2>
            <img src={CDlogo} alt="Cancer Detective Logo" className="logo-image" />
            Cancer Detective
          </h2>
          <p>
            Cancer Detective is committed to empowering individuals with early and accurate cancer detection tools. Using advanced AI, we provide insights to help you take proactive steps for your health. Start your journey toward better health today.
          </p>
        </div>
        
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/detection">Detection</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/how-it-works">How It Works</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={24} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <FaGithub size={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Cancer Detective. All rights reserved.</p>
        <div className="footer-legal">
          <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Use</a>
          <span className="divider">|</span>
          <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
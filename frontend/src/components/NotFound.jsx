import { FaExclamationTriangle } from 'react-icons/fa';
import '../styles/NotFound.css';

function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <FaExclamationTriangle className="error-icon" />
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist or has been moved.</p>
        <button onClick={() => window.location.href = '/'} className="go-home-button">
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;

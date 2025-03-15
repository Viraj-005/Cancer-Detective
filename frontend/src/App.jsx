import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';
import Home from './pages/HomePage';
import Detection from './pages/Detection';
import About from './pages/AboutUs';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/ContactFeedback';
import NotFound from './components/NotFound';
import Loader from './components/Loader';
import AuthPage from './pages/AuthPage';
import TermsOfUse from './components/TermsOfUse';
import PrivacyPolicy from './components/PrivacyPolicy';
import { useAuthentication } from "./auth";
import RedirectGoogleAuth from "./components/RedirectGoogleAuth";
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import VerifyEmail from './pages/VerifyEmail';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AuthRoute = ({ component: Component }) => {
  const { isAuthorized } = useAuthentication();
  return isAuthorized ? <Navigate to="/" /> : Component;
};

AuthRoute.propTypes = {
  component: PropTypes.element.isRequired
};

const LegalLayout = ({ children }) => (
  <div className="legal-layout">
    {children}
  </div>
);

LegalLayout.propTypes = {
  children: PropTypes.node.isRequired
};

function App() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [location]);

  if (loading) return <Loader />;

  return (
    <div className="App">
      <ScrollToTop />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<AuthLayout><AuthRoute component={<AuthPage initialMethod="login" />} /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><AuthRoute component={<AuthPage initialMethod="register" />} /></AuthLayout>} />
        <Route path="/getstarted" element={<AuthLayout><AuthRoute component={<AuthPage initialMethod="getstarted" />} /></AuthLayout>} />
        <Route path="/auth" element={<AuthLayout><AuthPage /></AuthLayout>} />
        <Route path="/login/callback" element={<AuthLayout><RedirectGoogleAuth /></AuthLayout>} />

        {/* Password Reset Routes */}
        <Route path="/reset-password" element={<AuthLayout><ResetPassword /></AuthLayout>} />
        <Route path="/change-password/:uidb64/:token" element={<AuthLayout><ChangePassword /></AuthLayout>} />

        {/* Email Verification Route */}
        <Route path="/verify-email/:uidb64/:token" element={<AuthLayout><VerifyEmail /></AuthLayout>} />

        {/* Legal Routes */}
        <Route path="/terms" element={<LegalLayout><TermsOfUse /></LegalLayout>} />
        <Route path="/privacy" element={<LegalLayout><PrivacyPolicy /></LegalLayout>} />

        {/* Main Routes */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/detection" element={<MainLayout><Detection /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/how-it-works" element={<MainLayout><HowItWorks /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </div>
  );
}

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
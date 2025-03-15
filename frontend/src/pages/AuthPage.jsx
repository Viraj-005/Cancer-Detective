import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AuthForm from "../components/AuthForm";
import AuthModal from "../components/AuthModal";
import { useLocation, useNavigate } from "react-router-dom";

const AuthPage = ({ initialMethod = 'login', setMethod }) => {
    const [method, setLocalMethod] = useState(initialMethod);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Get the return URL from location state or default to '/'
    const returnUrl = location.state?.from || '/';

    useEffect(() => {
        setLocalMethod(initialMethod);
        if (setMethod) {
            setMethod(initialMethod);
        }
    }, [initialMethod, setMethod]);

    useEffect(() => {
        // Reset states when component mounts
        setIsModalOpen(true);
        setShowForm(false);
        
        // If we're at /login or /register directly, show the form
        if (location.pathname === '/login' || location.pathname === '/register') {
            setShowForm(true);
            setIsModalOpen(false);
        }
    }, [location.pathname]);

    const route = method === 'login' ? '/api/token/' : '/api/user/register/';

    const handleModalClose = () => {
        setIsModalOpen(false);
        // If modal is closed without selecting login/register, redirect to home
        if (!showForm) {
            navigate(returnUrl);
        }
    };

    return (
        <div>
            <AuthModal 
                isOpen={isModalOpen} 
                onClose={handleModalClose}
                returnUrl={returnUrl}
            />
            {showForm && <AuthForm route={route} method={method} />}
        </div>
    );
};

AuthPage.propTypes = {
    initialMethod: PropTypes.oneOf(['login', 'register', 'getstarted']),
    setMethod: PropTypes.func
};

export default AuthPage;
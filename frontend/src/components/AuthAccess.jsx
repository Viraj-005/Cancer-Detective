import PropTypes from "prop-types"; // Import prop-types for props validation
import { Navigate } from "react-router-dom";
import { useAuthentication } from "../auth";

function ProtectedRoute({ children }) {
    const { isAuthorized } = useAuthentication();

    if (isAuthorized === null) {
        return <div>Loading...........</div>; // Ensure proper JSX syntax
    }

    if (
        isAuthorized &&
        (window.location.pathname === "/getstarted" || window.location.pathname === "/login" || window.location.pathname === "/register")
    ) {
        return <Navigate to="/" />; // Redirect if already authorized
    }

    return children;
}

// Props validation
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired, // Ensures 'children' is a valid React node
};

export default ProtectedRoute;

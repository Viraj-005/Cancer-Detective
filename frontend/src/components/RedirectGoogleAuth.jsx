import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { setTokens } from "../token";

function RedirectGoogleAuth() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log("RedirectGoogleAuth component mounted");

        const queryParams = new URLSearchParams(location.search);
        const accessToken = queryParams.get('access_token');
        const error = queryParams.get('error');

        console.log("Query Parameters:", { accessToken, error });

        if (accessToken) {
            console.log("Access token found in URL:", accessToken);

            // Save both tokens
            setTokens(accessToken, null, accessToken);
            console.log("Tokens saved to localStorage");

            // Verify the token with the backend
            axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            axios.get('http://127.0.0.1:8000/api/auth/user/')
                .then(response => {
                    console.log("User data from backend:", response.data);

                    if (response.data.access) {
                        setTokens(response.data.access, null, accessToken);
                        console.log("Updated tokens in localStorage");
                    }

                    toast.success("Successfully logged in with Google!");
                    navigate('/');
                    window.location.reload(); // Force reload to update auth state
                })
                .catch(error => {
                    console.error("Error verifying token:", error.response ? error.response.data : error.message);
                    
                    if (error.response?.status === 401) {
                        toast.error("Invalid or expired token. Please log in again.");
                    } else {
                        toast.error("Failed to verify token. Please try again.");
                    }
                    
                    navigate('/login');
                });
        } else if (error) {
            console.error("Error from Google OAuth2 flow:", error);
            
            switch (error) {
                case 'access_denied':
                    toast.error("Google login was denied. Please try again.");
                    break;
                case 'invalid_request':
                    toast.error("Invalid request. Please try again.");
                    break;
                default:
                    toast.error("An error occurred during Google login. Please try again.");
            }
            
            navigate('/login');
        } else {
            console.error("No access token or error found in URL");
            navigate('/login');
        }
    }, [navigate, location]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Logging In...</h2>
        </div>
    );
}

export default RedirectGoogleAuth;
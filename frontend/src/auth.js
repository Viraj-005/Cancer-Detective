import { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import api from "./api";
import { ACCESS_TOKEN, REFRESH_TOKEN, GOOGLE_ACCESS_TOKEN, clearTokens } from "./token";
import { toast } from "react-toastify";

export const useAuthentication = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const googleToken = localStorage.getItem(GOOGLE_ACCESS_TOKEN);

        if (token) {
            try {
                const decoded = jwtDecode(token);
                const tokenExpiration = decoded.exp;
                const now = Date.now() / 1000;

                if (tokenExpiration < now) {
                    await refreshToken();
                } else {
                    setIsAuthorized(true);
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                setIsAuthorized(false);
                clearTokens();
            }
        } else if (googleToken) {
            try {
                const isValid = await validateGoogleToken(googleToken);
                setIsAuthorized(isValid);
                if (!isValid) {
                    clearTokens();
                }
            } catch (error) {
                console.error('Error validating Google token:', error);
                setIsAuthorized(false);
                clearTokens();
            }
        } else {
            setIsAuthorized(false);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, );

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post('/api/token/refresh/', {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
                clearTokens();
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            setIsAuthorized(false);
            clearTokens();
        }
    };

    const validateGoogleToken = async (googleToken) => {
        try {
            const res = await api.post('/api/google/validate_token/', {
                access_token: googleToken,
            });
            return res.data.valid;
        } catch (error) {
            console.error('Error validating Google token:', error);
            return false;
        }
    };

    const logout = (navigate) => {
        clearTokens();
        setIsAuthorized(false);

        // Display the toast message
        toast.success("Logged out successfully!");

        // Redirect to home page after a delay (e.g., 2 seconds)
        setTimeout(() => {
            navigate("/"); // Use navigate to redirect
        }, 2000); // 2000 milliseconds = 2 seconds
    };

    return { isAuthorized, isLoading, logout, checkAuth };
};
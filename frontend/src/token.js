// Token constants
export const ACCESS_TOKEN = 'access';
export const REFRESH_TOKEN = 'refresh';
export const GOOGLE_ACCESS_TOKEN = 'google_access_token';

// Token management functions
export const setTokens = (accessToken, refreshToken = null, googleToken = null) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN, refreshToken);
    }
    if (googleToken) {
        localStorage.setItem(GOOGLE_ACCESS_TOKEN, googleToken);
    }
};

export const clearTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(GOOGLE_ACCESS_TOKEN);
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN);
export const getGoogleToken = () => localStorage.getItem(GOOGLE_ACCESS_TOKEN);
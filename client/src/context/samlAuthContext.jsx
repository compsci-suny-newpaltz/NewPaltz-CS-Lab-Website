import { createContext, useState, useEffect, useContext } from 'react';

const HYDRA_BASE_URL = import.meta.env.VITE_HYDRA_BASE_URL || 'https://hydra.newpaltz.edu';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export const SAMLAuthContext = createContext();

export const SAMLAuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check SAML auth status on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/saml/me`, {
                credentials: 'include'
            });

            const data = await response.json();

            if (data.authenticated) {
                setUser(data.user);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login = (returnTo = window.location.pathname) => {
        window.location.href = `${HYDRA_BASE_URL}/login?returnTo=${encodeURIComponent(returnTo)}`;
    };

    const logout = () => {
        window.location.href = `${HYDRA_BASE_URL}/logout`;
    };

    return (
        <SAMLAuthContext.Provider value={{
            user,
            loading,
            isAuthenticated,
            isAdmin: user?.isAdmin || false,
            isStudent: user?.affiliation === 'student',
            isStaff: user?.affiliation === 'faculty' || user?.affiliation === 'staff',
            login,
            logout,
            checkAuthStatus
        }}>
            {children}
        </SAMLAuthContext.Provider>
    );
};

export const useSAMLAuth = () => useContext(SAMLAuthContext);

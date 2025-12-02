import { createContext, useState, useEffect } from "react";
import authService from "../services/authService";
import jwt_decode from "jwt-decode";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [samlUser, setSamlUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            // Check JWT token first (legacy admin login)
            const token = authService.getToken();
            if (token) {
                try {
                    const decoded = jwt_decode(token);
                    setUser(decoded);
                } catch (err) {
                    console.error("Invalid token:", err);
                    authService.logout();
                    setUser(null);
                }
            }

            // Also check SAML auth
            try {
                const response = await fetch(`${API_BASE_URL}/api/saml/me`, {
                    credentials: 'include'
                });
                const data = await response.json();
                if (data.authenticated) {
                    setSamlUser(data.user);
                    // If SAML user is admin, also set as main user for admin panel access
                    if (data.user.isAdmin && !token) {
                        setUser({
                            id: data.user.email,
                            username: data.user.name,
                            email: data.user.email,
                            role: 'admin', // SAML admins get admin role
                            isSamlUser: true
                        });
                    }
                }
            } catch (err) {
                console.error("SAML auth check error:", err);
            }

            setLoading(false);
        };

        fetchUser();
    }, []);

    const logout = () => {
        authService.logout();
        setUser(null);
        setSamlUser(null);
        // If SAML user, also redirect to Hydra logout
        if (samlUser) {
            const HYDRA_BASE_URL = import.meta.env.VITE_HYDRA_BASE_URL || 'https://hydra.newpaltz.edu';
            window.location.href = `${HYDRA_BASE_URL}/logout`;
        }
    };

    // Combined auth state
    const isAuthenticated = !!user || !!samlUser;
    const isAdmin = user?.role === 'admin' || samlUser?.isAdmin;

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            samlUser,
            setSamlUser,
            loading,
            logout,
            isAuthenticated,
            isAdmin
        }}>
            {children}
        </AuthContext.Provider>
    );
};

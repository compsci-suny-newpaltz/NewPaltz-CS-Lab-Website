import { createContext, useState, useEffect } from "react";
import authService from "../services/authService";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = () => {
            const token = authService.getToken();
            if (token) {
                try {
                    const decoded = jwt_decode(token); // decode token
                    setUser(decoded);
                } catch (err) {
                    console.error("Invalid token:", err);
                    authService.logout();
                    setUser(null);
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

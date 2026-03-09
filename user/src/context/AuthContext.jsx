import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("userToken") || null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                // Backend profile endpoint (to be implemented or skipped if not available)
                const response = await api.get("/user/profile").catch(() => null);
                if (response?.data?.data) setUser(response.data.data);
            } catch (err) {
                console.error("Failed to fetch user profile", err);
                localStorage.removeItem("userToken");
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token]);

    const login = (newToken, userData) => {
        localStorage.setItem("userToken", newToken);
        setToken(newToken);
        if (userData) setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("userToken");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, setUser, login, logout, isAuthenticated: !!token, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

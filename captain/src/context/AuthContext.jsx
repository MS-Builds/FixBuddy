import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("captainToken") || null);
  const [captain, setCaptain] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get("/captain/profile");
        // backend returns { success: true, data: captain }
        setCaptain(response.data.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        localStorage.removeItem("captainToken");
        setToken(null);
        setCaptain(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [token]);

  const login = (newToken, captainData) => {
    localStorage.setItem("captainToken", newToken);
    setToken(newToken);
    if(captainData) setCaptain(captainData);
  };

  const logout = () => {
    localStorage.removeItem("captainToken");
    setToken(null);
    setCaptain(null);
  };

  return (
    <AuthContext.Provider value={{ token, captain, setCaptain, login, logout, isAuthenticated: !!token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

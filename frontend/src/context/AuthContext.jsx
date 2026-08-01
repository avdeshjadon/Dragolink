/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../lib/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
      } catch (error) {
        console.error("Auth initialization failed:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const register = async (userData) => {
    const { data } = await api.post("/auth/register", userData);
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const googleLogin = async (userData) => {
    const { data } = await api.post("/auth/google", userData);
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const sendOtp = async (data) => {
    return await api.post("/auth/send-otp", data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, googleLogin, sendOtp, logout, loading, checkAuth }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

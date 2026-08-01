/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../lib/axios";
import { auth } from "../lib/firebase";
import { getRedirectResult } from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // 1. First, check if we just returned from a Google OAuth redirect
      const redirectResult = await getRedirectResult(auth);
      if (redirectResult && redirectResult.user) {
        const firebaseUser = redirectResult.user;
        try {
          const { data } = await api.post("/auth/google", {
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split("@")[0]
          });
          localStorage.setItem("token", data.token);
          setUser(data.user);
        } catch (backendError) {
          console.error("Backend Google Auth Error:", backendError);
          alert("Google Login successful, but Backend server failed to process it. Please restart/deploy your backend server.");
        }
        setLoading(false);
        return; // Successfully authenticated via redirect
      }
    } catch (error) {
      console.error("Firebase redirect result error:", error);
    }

    // 2. Normal JWT token check if not from redirect
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

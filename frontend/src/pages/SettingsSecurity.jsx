/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import React, { useState } from "react";
import { api } from "../lib/axios";
import AsyncButton from "../components/AsyncButton";
import { useAuth } from "../context/AuthContext";
import { KeyRound, AlertCircle, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsSecurity() {
  const { user, checkAuth } = useAuth();
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  React.useEffect(() => {
    if (passwordMessage) {
      const timer = setTimeout(() => {
        setPasswordMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [passwordMessage]);

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMessage("New passwords do not match");
      setIsSuccess(false);
      return;
    }
    setPasswordMessage("");
    try {
      await api.put("/users/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswordMessage(user?.hasPassword ? "Password updated successfully" : "Password set successfully");
      setIsSuccess(true);
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      if (checkAuth) {
        await checkAuth();
      } else {
        window.location.reload();
      }
    } catch (error) {
      setPasswordMessage(
        error.response?.data?.message || "Failed to update password",
      );
      setIsSuccess(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto w-full pb-10">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight mb-2">
          Security Settings
        </h1>
        <p className="text-base text-text-secondary">
          Manage your account security and authentication methods.
        </p>
      </div>

      {/* Layout Grid */}
      <div className="max-w-2xl">
        {/* Change Password Card */}
        <div className="bg-surface-light border border-outline-variant/15 shadow-sm rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10 bg-surface-dim/30">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-text-primary">
                {user?.hasPassword ? "Change Password" : "Create New Password"}
              </h2>
            </div>
            <p className="text-sm text-text-secondary mt-2">
              {user?.hasPassword 
                ? "Update your password to keep your account secure." 
                : "You haven't created a password yet. Create a new password below."}
            </p>
          </div>

          <div className="p-6">
            <AnimatePresence>
              {passwordMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${
                    isSuccess 
                      ? "bg-green-50 border-green-200 text-green-800" 
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  {isSuccess ? <CheckCircle2 size={18} className="mt-0.5" /> : <AlertCircle size={18} className="mt-0.5" />}
                  <div className="flex-1 text-sm font-medium">
                    {passwordMessage}
                  </div>
                  <button onClick={() => setPasswordMessage("")} className="opacity-70 hover:opacity-100 transition-opacity">
                    <X size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
              {user?.hasPassword && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-text-primary">
                    Current Password
                  </label>
                  <input
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    required
                    placeholder="Enter current password"
                    className="w-full bg-surface-dim border border-outline-variant/30 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all rounded-xl px-4 py-2.5 text-sm font-medium"
                    type="password"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-text-primary">
                  New Password
                </label>
                <input
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  required
                  placeholder="Enter new password"
                  className="w-full bg-surface-dim border border-outline-variant/30 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all rounded-xl px-4 py-2.5 text-sm font-medium"
                  type="password"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-text-primary">
                  Confirm New Password
                </label>
                <input
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  required
                  placeholder="Confirm new password"
                  className="w-full bg-surface-dim border border-outline-variant/30 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all rounded-xl px-4 py-2.5 text-sm font-medium"
                  type="password"
                />
              </div>
              <div className="mt-4">
                <AsyncButton
                  onClick={handlePasswordChange}
                  className="w-full bg-brand hover:bg-brand-dark text-white rounded-xl py-3 px-4 text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                  type="submit"
                >
                  {user?.hasPassword ? "Update Password" : "Create Password"}
                </AsyncButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


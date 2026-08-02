/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import React, { useState, useEffect } from "react";
import { api } from "../lib/axios";
import AsyncButton from "../components/AsyncButton";
import { useAuth } from "../context/AuthContext";
import { KeyRound, ShieldCheck, MonitorSmartphone, AlertCircle, CheckCircle2, X } from "lucide-react";
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
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/users/security-logs");
        setLogs(res.data);
      } catch (error) {
        console.error("Failed to load security logs", error);
      } finally {
        setLogsLoading(false);
      }
    };
    fetchLogs();
  }, []);

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
          Manage your account security, authentication methods, and active sessions.
        </p>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Passwords & 2FA */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          {/* Change Password Card */}
          <div className="bg-surface-light border border-outline-variant/15 shadow-sm rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-outline-variant/10 bg-surface-dim/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand/10 text-brand rounded-lg">
                  <KeyRound size={20} />
                </div>
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

          {/* Two-Factor Authentication Card */}
          <div className="bg-surface-light border border-outline-variant/15 shadow-sm rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-bl-full -z-10"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                  <ShieldCheck size={20} />
                </div>
                <h2 className="text-lg font-bold text-text-primary">
                  Two-Factor Auth
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                Inactive
              </span>
            </div>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              Add an extra layer of security to your account. We'll ask for a code from your authenticator app when you log in.
            </p>
            <button
              className="w-full border-2 border-brand text-brand rounded-xl py-2.5 px-4 text-sm font-bold hover:bg-brand/5 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
              type="button"
            >
              Enable 2FA
            </button>
          </div>
        </div>

        {/* Right Column: Active Sessions */}
        <div className="lg:col-span-7">
          <div className="bg-surface-light border border-outline-variant/15 shadow-sm rounded-2xl h-full flex flex-col overflow-hidden">
            <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between bg-surface-dim/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <MonitorSmartphone size={20} />
                </div>
                <h2 className="text-lg font-bold text-text-primary">
                  Active Sessions
                </h2>
              </div>
              <button className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors tracking-wide">
                REVOKE ALL
              </button>
            </div>
            
            <div className="flex-1 overflow-x-auto">
              {logsLoading ? (
                <div className="p-10 flex flex-col items-center justify-center text-text-secondary h-full">
                  <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-sm">Loading security logs...</p>
                </div>
              ) : logs.length > 0 ? (
                <ul className="divide-y divide-outline-variant/10">
                  {logs.map((log) => (
                    <li key={log.id} className="p-5 hover:bg-surface-dim/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-surface-dim rounded-full mt-1">
                          <MonitorSmartphone size={16} className="text-text-secondary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary mb-0.5">
                            {log.device || "Unknown Device"}
                          </p>
                          <p className="text-xs font-medium text-text-secondary mb-1">
                            {log.location || "Unknown Location"} • {log.ipAddress || "Unknown IP"}
                          </p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-brand/10 text-brand uppercase tracking-wider">
                            {log.eventType}
                          </span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-xs font-medium text-text-secondary bg-surface-dim px-2 py-1 rounded-md">
                          {new Date(log.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-12 flex flex-col items-center justify-center text-text-secondary h-full text-center">
                  <MonitorSmartphone size={40} className="mb-4 opacity-20" />
                  <p className="text-sm font-medium text-text-primary mb-1">No active sessions</p>
                  <p className="text-xs">You don't have any recent security logs to display.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


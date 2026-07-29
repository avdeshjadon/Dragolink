/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import React, { useState, useEffect } from "react";
import { api } from "../lib/axios";
import AsyncButton from "../components/AsyncButton";

export default function SettingsSecurity() {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");
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
      return;
    }
    setPasswordMessage("");
    try {
      await api.put("/users/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswordMessage("Password updated successfully");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordMessage(
        error.response?.data?.message || "Failed to update password",
      );
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Page Header */}
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-on-surface tracking-tight mb-1">
            Security Settings
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Manage your account security, authentication methods, and active
            sessions.
          </p>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Passwords & 2FA */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Change Password Card */}
          <div className="bg-surface-container-low border border-outline-variant/10 shadow-sm rounded-xl p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant/10">
              <span className="material-symbols-outlined text-primary">
                key
              </span>
              <h2 className="text-headline-md font-headline-md text-on-surface">
                Change Password
              </h2>
            </div>
            {passwordMessage && (
              <div
                className={`mb-4 p-3 rounded text-sm ${passwordMessage.includes("success") ? "bg-primary/20 text-primary" : "bg-error/20 text-error"}`}
              >
                {passwordMessage}
              </div>
            )}
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex flex-col gap-1">
                <label className="text-label-sm font-label-sm text-on-surface-variant">
                  Current Password
                </label>
                <input
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                  className="bg-surface-dim border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all rounded-lg px-4 py-2 text-body-md font-body-md font-code-sm"
                  type="password"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-sm font-label-sm text-on-surface-variant">
                  New Password
                </label>
                <input
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  required
                  className="bg-surface-dim border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all rounded-lg px-4 py-2 text-body-md font-body-md font-code-sm"
                  type="password"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-label-sm font-label-sm text-on-surface-variant">
                  Confirm New Password
                </label>
                <input
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  className="bg-surface-dim border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all rounded-lg px-4 py-2 text-body-md font-body-md font-code-sm"
                  type="password"
                />
              </div>
              <div className="mt-2">
                <AsyncButton
                  onClick={handlePasswordChange}
                  className="w-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-white rounded-lg py-2 px-4 text-label-md font-label-md font-semibold transition-colors shadow-sm active:scale-95 border border-primary-fixed/20 cursor-pointer"
                  type="submit"
                >
                  Update Password
                </AsyncButton>
              </div>
            </form>
          </div>

          {/* Two-Factor Authentication Card */}
          <div className="bg-surface-container-low border border-outline-variant/10 shadow-sm rounded-xl p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  shield_locked
                </span>
                <h2 className="text-headline-md font-headline-md text-on-surface">
                  Two-Factor Auth
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-surface-container-highest border border-outline-variant/20 text-label-sm font-label-sm text-on-surface-variant">
                <span className="w-2 h-2 rounded-full bg-outline"></span>
                Inactive
              </span>
            </div>
            <p className="text-body-md font-body-md text-on-surface-variant mb-4">
              Add an extra layer of security to your account by requiring a code
              from your authenticator app upon login.
            </p>
            <button
              className="w-full border border-primary text-primary rounded-lg py-2 px-4 text-label-md font-label-md font-semibold hover:bg-primary/10 transition-colors flex items-center justify-center gap-2 active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                add_circle
              </span>
              Enable 2FA
            </button>
          </div>
        </div>

        {/* Right Column: Active Sessions */}
        <div className="lg:col-span-8">
          <div className="bg-surface-container-low border border-outline-variant/10 shadow-sm rounded-xl hover:shadow-md transition-all duration-300 h-full flex flex-col">
            <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  devices
                </span>
                <h2 className="text-headline-md font-headline-md text-on-surface">
                  Active Sessions
                </h2>
              </div>
              <button className="text-error hover:text-error-container text-label-sm font-label-sm transition-colors uppercase tracking-wider font-semibold">
                Revoke All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/10 bg-surface-container-lowest/50">
                    <th className="py-3 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-medium">
                      Event
                    </th>
                    <th className="py-3 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-medium">
                      IP Address
                    </th>
                    <th className="py-3 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-medium">
                      Device & Location
                    </th>
                    <th className="py-3 px-6 text-right text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-medium">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {logsLoading ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-8 text-center text-on-surface-variant"
                      >
                        Loading security logs...
                      </td>
                    </tr>
                  ) : logs.length > 0 ? (
                    logs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-surface-container-high/30 transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <div className="text-body-md font-body-md font-medium text-on-surface">
                            {log.eventType}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-code-sm font-code-sm text-on-surface-variant">
                            {log.ipAddress || "Unknown"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="text-body-md font-body-md font-medium text-on-surface">
                                {log.device || "Unknown Device"}
                              </div>
                              <div className="text-label-sm font-label-sm text-on-surface-variant mt-0.5">
                                {log.location || "Unknown Location"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="text-body-md font-body-md text-on-surface-variant">
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-8 text-center text-on-surface-variant"
                      >
                        No security logs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

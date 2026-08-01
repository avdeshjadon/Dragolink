/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import React, { useState, useEffect } from "react";
import { api } from "../lib/axios";
import AsyncButton from "../components/AsyncButton";

export default function SettingsProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    timezone: "est",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          company: res.data.company || "",
          timezone: res.data.timezone || "est",
        });
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSave = async () => {
    setMessage("");
    try {
      await api.put("/users/profile", {
        name: formData.name,
        company: formData.company,
        timezone: formData.timezone,
      });
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile", error);
      setMessage("Failed to update profile.");
    }
  };

  const userInitial = formData.name ? formData.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-on-surface tracking-tight mb-1">
            Profile Settings
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Manage your personal information and preferences.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <span className="text-on-surface-variant font-body-md">Loading profile...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {message && (
            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${message.includes("success") ? "bg-primary/10 text-primary border border-primary/20" : "bg-error/10 text-error border border-error/20"}`}>
              <span className="material-symbols-outlined text-[20px]">
                {message.includes("success") ? "check_circle" : "error"}
              </span>
              {message}
            </div>
          )}
          
          <div className="bg-surface-container-low border border-outline-variant/10 shadow-sm rounded-2xl overflow-hidden">
            {/* Avatar Section */}
            <div className="p-8 border-b border-outline-variant/10 flex flex-col md:flex-row items-center gap-8 bg-surface-container-lowest">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white bg-gradient-to-br from-primary to-primary-container shadow-lg ring-4 ring-background transition-transform duration-300 group-hover:scale-105">
                  {userInitial}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                  <span className="material-symbols-outlined text-white text-2xl">
                    photo_camera
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-start gap-3">
                <div className="flex gap-3">
                  <button className="px-5 py-2.5 bg-surface-container-high hover:bg-surface-variant text-on-surface text-sm font-semibold rounded-lg transition-colors border border-outline-variant/20 shadow-sm">
                    Upload Picture
                  </button>
                  <button className="px-5 py-2.5 text-error hover:bg-error/10 text-sm font-semibold rounded-lg transition-colors">
                    Remove
                  </button>
                </div>
                <p className="text-xs text-on-surface-variant/80">
                  Recommended: Square JPG or PNG, at least 256x256px. Max 5MB.
                </p>
              </div>
            </div>

            {/* Form Section */}
            <form
              className="p-8 flex flex-col gap-8"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-semibold text-on-surface">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[20px]">
                      person
                    </span>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-surface-dim border border-outline-variant/30 rounded-xl pl-10 pr-4 py-3 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-on-surface-variant/40"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-semibold text-on-surface">
                    Email Address <span className="text-xs font-normal text-on-surface-variant ml-2">(Cannot be changed)</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[20px]">
                      mail
                    </span>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full bg-surface-container-highest border border-outline-variant/10 rounded-xl pl-10 pr-4 py-3 text-sm text-on-surface-variant focus:outline-none cursor-not-allowed opacity-80"
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="company" className="text-sm font-semibold text-on-surface">
                    Company (Optional)
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[20px]">
                      business
                    </span>
                    <input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full bg-surface-dim border border-outline-variant/30 rounded-xl pl-10 pr-4 py-3 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-on-surface-variant/40"
                      placeholder="e.g. Dragolink Inc."
                    />
                  </div>
                </div>

                {/* Time Zone */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="timezone" className="text-sm font-semibold text-on-surface">
                    Time Zone
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[20px] pointer-events-none">
                      schedule
                    </span>
                    <select
                      id="timezone"
                      value={formData.timezone}
                      onChange={handleChange}
                      className="w-full appearance-none bg-surface-dim border border-outline-variant/30 rounded-xl pl-10 pr-10 py-3 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                    >
                      <option value="pst">Pacific Standard Time (PST)</option>
                      <option value="est">Eastern Standard Time (EST)</option>
                      <option value="utc">Coordinated Universal Time (UTC)</option>
                      <option value="cet">Central European Time (CET)</option>
                      <option value="ist">Indian Standard Time (IST)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 pointer-events-none">
                      expand_more
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1 ml-1">
                    Used for analytics reporting and data visualization.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-6 border-t border-outline-variant/10 flex justify-end">
                <AsyncButton
                  type="submit"
                  onClick={handleSave}
                  className="bg-primary hover:bg-primary/90 text-white font-semibold text-sm px-8 py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  Save Profile
                </AsyncButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

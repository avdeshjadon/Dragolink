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

  return (
    <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 shadow-sm p-6 lg:p-10 flex flex-col gap-10">
      <header>
        <h3 className="font-headline-lg text-headline-lg text-on-surface mb-1">
          Profile Details
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Update your personal information and how others see you on the
          platform.
        </p>
      </header>

      <div className="h-[1px] w-full bg-outline-variant/10"></div>

      {/* Avatar Section */}
      <div className="flex items-start md:items-center gap-6 flex-col md:flex-row">
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-surface-variant bg-surface-container-highest group cursor-pointer">
          <img
            alt="Current Avatar"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAibvZv4rjuo5SMEcpykMaFeFMADy-kPqzbujLCMYDPdneARqSczxGHzzPFpVudtMfKjKAUIYGiGM4wAmRNi3c6NIVQOgEnnYWqNCtx4MczaIhJl5xD8346qgM2MVMzwZXYzJOIIR6m66pq4pUYXM2ZXqwhvHqu75MpWDJhE4Ri0gcrc4YedNmM6t6c8rGcE2qUO88ypXyYXk7LyVqqswoTYBkCWiHZgTYol35ygJqg29TzVAWPO0QsJKqBr0xM2fQtklzO8IU6sYyg"
          />
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-primary">
              upload
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <button className="bg-surface-container-highest border border-outline-variant/30 text-on-surface font-label-md text-label-md px-4 py-2 rounded-md hover:bg-surface-variant transition-colors duration-200">
              Upload new
            </button>
            <button className="text-error hover:text-error-container font-label-md text-label-md transition-colors duration-200">
              Remove
            </button>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            Recommended size: 256x256px. Max file size: 5MB.
          </p>
        </div>
      </div>

      {/* Form Fields */}
      {loading ? (
        <div className="py-10 text-center text-on-surface-variant">
          Loading profile...
        </div>
      ) : (
        <form
          className="flex flex-col gap-6 max-w-2xl"
          onSubmit={(e) => e.preventDefault()}
        >
          {message && (
            <div
              className={`p-4 rounded-md ${message.includes("success") ? "bg-primary-container text-on-primary-container" : "bg-error-container text-on-error-container"}`}
            >
              {message}
            </div>
          )}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-2">
              <label
                className="font-label-md text-label-md text-on-surface"
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="bg-surface-dim border border-outline-variant/30 rounded-md px-4 py-2 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="font-label-md text-label-md text-on-surface"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[18px]">
                mail
              </span>
              <input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-surface-dim border border-outline-variant/30 rounded-md pl-[42px] pr-4 py-2 font-body-md text-body-md text-on-surface/70 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all w-full opacity-70 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="font-label-md text-label-md text-on-surface"
              htmlFor="company"
            >
              Company
            </label>
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[18px]">
                domain
              </span>
              <input
                id="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                className="bg-surface-dim border border-outline-variant/30 rounded-md pl-[42px] pr-4 py-2 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="font-label-md text-label-md text-on-surface"
              htmlFor="timezone"
            >
              Time Zone
            </label>
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[18px]">
                language
              </span>
              <select
                id="timezone"
                value={formData.timezone}
                onChange={handleChange}
                className="appearance-none bg-surface-dim border border-outline-variant/30 rounded-md pl-[42px] pr-10 py-2 font-body-md text-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all w-full cursor-pointer"
              >
                <option value="pst">Pacific Standard Time (PST)</option>
                <option value="est">Eastern Standard Time (EST)</option>
                <option value="utc">Coordinated Universal Time (UTC)</option>
                <option value="cet">Central European Time (CET)</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 pointer-events-none">
                expand_more
              </span>
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
              This timezone will be used across all your analytics dashboards.
            </p>
          </div>

          <div className="h-[1px] w-full bg-outline-variant/10 my-4"></div>

          <div className="flex justify-end gap-4">
            <AsyncButton
              type="submit"
              onClick={handleSave}
              className="bg-primary-container text-on-primary-container font-label-md text-label-md px-6 py-2 rounded-md hover:bg-primary hover:text-white transition-colors duration-200 shadow-sm border border-primary-fixed/20 active:scale-95 cursor-pointer"
            >
              Save Changes
            </AsyncButton>
          </div>
        </form>
      )}
    </div>
  );
}

/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import axios from "axios";
import toast from "react-hot-toast";

// Suppress duplicate toasts for Viewer Access Denied
const originalToastError = toast.error;
toast.error = (message, options) => {
  if (message && typeof message === 'string' && message.includes("VIEWER_ACCESS_DENIED")) {
    return;
  }
  return originalToastError(message, options);
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const workspaceId = localStorage.getItem("workspaceId");
  if (workspaceId) {
    config.headers["X-Workspace-Id"] = workspaceId;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      if (error.response.data && error.response.data.message && error.response.data.message.includes("VIEWER_ACCESS_DENIED")) {
        window.dispatchEvent(new CustomEvent("viewer-access-denied"));
        // Force the local catch blocks to pass this string to toast.error, which we ignore above
        error.response.data.message = "VIEWER_ACCESS_DENIED_SILENT";
      } else if (error.response.data && error.response.data.error === "ACCOUNT_SUSPENDED") {
        window.dispatchEvent(new CustomEvent("account-suspended", { detail: error.response.data.message }));
      }
    }
    return Promise.reject(error);
  }
);

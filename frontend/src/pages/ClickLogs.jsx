/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import MotionAlert from "../components/motion/MotionAlert";
import { api } from "../lib/axios";

export default function ClickLogs() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clickLogs, setClickLogs] = useState([]);
  const [isClickLogLoading, setIsClickLogLoading] = useState(true);
  const [expandedLogId, setExpandedLogId] = useState(null);

  const [deleteLogModalId, setDeleteLogModalId] = useState(null);
  const [isClearAllLogsModalOpen, setIsClearAllLogsModalOpen] = useState(false);
  const [isDeletingLog, setIsDeletingLog] = useState(false);
  const [linkDetails, setLinkDetails] = useState(null);

  useEffect(() => {
    fetchClickLogs();
  }, [id]);

  const fetchClickLogs = async () => {
    try {
      setIsClickLogLoading(true);
      const [logsRes, linkRes] = await Promise.all([
        api.get(`/analytics/links/${id}`),
        api.get(`/links`), // Fetch links to find details
      ]);
      setClickLogs(logsRes.data);
      const link = linkRes.data.find((l) => l.id.toString() === id);
      if (link) setLinkDetails(link);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load click logs");
    } finally {
      setIsClickLogLoading(false);
    }
  };

  const handleDeleteLog = async (logId) => {
    setIsDeletingLog(true);
    try {
      await api.delete(`/analytics/links/${id}/logs/${logId}`);
      toast.success("Log deleted successfully");
      setClickLogs(clickLogs.filter((log) => log.id !== logId));
      setDeleteLogModalId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete log");
    } finally {
      setIsDeletingLog(false);
    }
  };

  const handleClearAllLogs = async () => {
    try {
      await api.delete(`/analytics/links/${id}/logs`);
      toast.success("All logs cleared successfully");
      setClickLogs([]);
      setIsClearAllLogsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear logs");
    }
  };

  const downloadLogsCSV = () => {
    if (!clickLogs.length) return;
    const headers = [
      "Date",
      "IP Address",
      "OS",
      "Browser",
      "Device",
      "Location",
      "Referrer",
      "Is Bot",
    ];
    const csvData = clickLogs.map((log) => [
      new Date(log.clickedAt).toLocaleString(),
      log.ipAddress || "Unknown",
      `${log.operatingSystem || "Unknown"} ${log.osVersion || ""}`.trim(),
      `${log.browser || "Unknown"} ${log.browserVersion || ""}`.trim(),
      log.deviceType || "Unknown",
      `${log.city || ""} ${log.country || ""}`.trim() || "Unknown",
      log.referrer || "Direct",
      log.isBot ? "Yes" : "No",
    ]);
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `click-logs-${linkDetails?.customAlias || linkDetails?.shortCode || id}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans selection:bg-primary/20">
      <Toaster
        position="top-right"
        toastOptions={{ className: "font-body-sm" }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/links")}
              className="p-2 -ml-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-[24px]">
                arrow_back
              </span>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-semibold text-on-surface tracking-tight">
                Click Logs
              </h1>
              {linkDetails && (
                <p className="text-label-sm text-on-surface-variant mt-0.5">
                  Detailed tracking data for{" "}
                  <span className="text-primary font-medium">
                    {linkDetails.title ||
                      linkDetails.customAlias ||
                      linkDetails.shortCode}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {clickLogs.length > 0 && (
              <button
                onClick={() => setIsClearAllLogsModalOpen(true)}
                className="hidden sm:flex px-4 py-2 bg-error/10 hover:bg-error/20 text-error rounded-lg font-label-md transition-colors items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">
                  delete_sweep
                </span>
                Clear All Logs
              </button>
            )}
            <button
              onClick={downloadLogsCSV}
              disabled={clickLogs.length === 0}
              className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-label-md transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                download
              </span>
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MotionAlert
          isOpen={isClearAllLogsModalOpen}
          onClose={() => setIsClearAllLogsModalOpen(false)}
          onConfirm={handleClearAllLogs}
          title="Clear All Click Logs?"
          description={`Are you sure you want to permanently delete all click logs for "${linkDetails?.title || linkDetails?.customAlias || linkDetails?.shortCode}"? This action cannot be undone.`}
          confirmText="Clear All"
          isDestructive={true}
          icon={
            <span className="material-symbols-outlined text-[32px]">
              delete_sweep
            </span>
          }
        />

        {isClickLogLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : clickLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-on-surface-variant bg-surface-container-lowest border border-outline-variant/30 rounded-3xl">
            <span className="material-symbols-outlined text-[48px] mb-4 opacity-50">
              analytics
            </span>
            <p className="text-label-lg">No clicks recorded yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {clickLogs.map((log, idx) => {
                const isExpanded = expandedLogId === (log.id || idx);
                const isDeleting =
                  isDeletingLog && deleteLogModalId === (log.id || idx);

                return (
                  <motion.div
                    key={log.id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      scale: 0.95,
                      overflow: "hidden",
                    }}
                    transition={{ duration: 0.2 }}
                    className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 hover:border-outline-variant/50 hover:shadow-sm transition-all duration-300"
                  >
                    {/* Top Section */}
                    <div
                      className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer select-none ${isExpanded ? "mb-4 border-b border-outline-variant/20 pb-4" : ""}`}
                      onClick={() =>
                        setExpandedLogId(isExpanded ? null : log.id || idx)
                      }
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-sm">
                          <span className="material-symbols-outlined text-[24px]">
                            touch_app
                          </span>
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="text-headline-sm font-headline-sm text-on-surface">
                              {new Date(
                                log.clickedAt +
                                  (!log.clickedAt.endsWith("Z") ? "Z" : ""),
                              ).toLocaleString(undefined, {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </p>
                            {log.isBot && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-error/10 text-error rounded-sm tracking-wider uppercase">
                                Bot
                              </span>
                            )}
                            {log.qrScan && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-primary/10 text-primary rounded-sm tracking-wider uppercase">
                                QR Scan
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-label-sm text-on-surface-variant">
                            <span className="font-code-sm px-2 py-0.5 bg-surface-container rounded-md text-primary font-medium">
                              {log.ipAddress}
                            </span>
                            {log.isp && log.isp !== "Unknown" && (
                              <span
                                className="flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded-md text-on-surface max-w-[200px] truncate"
                                title={log.isp}
                              >
                                <span className="material-symbols-outlined text-[14px]">
                                  router
                                </span>
                                {log.isp}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Area: Device Pills */}
                      <div className="flex items-center justify-between lg:justify-end gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {log.deviceType && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container border border-outline-variant/20 rounded-lg text-xs font-medium capitalize text-on-surface hidden md:flex">
                              <span className="material-symbols-outlined text-[16px] text-primary">
                                {log.deviceType.toLowerCase() === "mobile"
                                  ? "smartphone"
                                  : log.deviceType.toLowerCase() === "tablet"
                                    ? "tablet_mac"
                                    : "desktop_windows"}
                              </span>
                              {log.deviceType}
                            </span>
                          )}
                          {log.operatingSystem &&
                            log.operatingSystem !== "Unknown" && (
                              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container border border-outline-variant/20 rounded-lg text-xs font-medium text-on-surface hidden md:flex">
                                <span className="material-symbols-outlined text-[16px] text-tertiary">
                                  settings_system_daydream
                                </span>
                                {log.operatingSystem} {log.osVersion || ""}
                              </span>
                            )}
                          {log.browser && log.browser !== "Unknown" && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container border border-outline-variant/20 rounded-lg text-xs font-medium text-on-surface hidden md:flex">
                              <span className="material-symbols-outlined text-[16px] text-secondary">
                                public
                              </span>
                              {log.browser} {log.browserVersion || ""}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteLogModalId(log.id || idx);
                            }}
                            className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <AnimatedTrashIcon className="w-5 h-5" />
                          </button>
                          <span
                            className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                          >
                            expand_more
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delete Confirmation Alert (Inline) */}
                    <AnimatePresence>
                      {deleteLogModalId === (log.id || idx) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 p-4 bg-error/5 border border-error/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 text-error">
                              <span className="material-symbols-outlined">
                                warning
                              </span>
                              <p className="text-label-md font-medium">
                                Delete this log entry?
                              </p>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                              <button
                                onClick={() => setDeleteLogModalId(null)}
                                className="flex-1 sm:flex-none px-4 py-2 text-label-md font-medium text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors border border-outline-variant/30 cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleDeleteLog(log.id)}
                                disabled={isDeleting}
                                className="flex-1 sm:flex-none px-4 py-2 bg-error text-white text-label-md font-medium rounded-lg hover:bg-error/90 transition-colors shadow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center min-w-[80px]"
                              >
                                {isDeleting ? (
                                  <AnimatedTrashIcon
                                    isDeleting={true}
                                    className="w-4 h-4"
                                  />
                                ) : (
                                  <>
                                    <AnimatedTrashIcon className="w-4 h-4 mr-1" />{" "}
                                    Delete
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Expanded Content Area */}
                    <AnimatePresence>
                      {isExpanded && deleteLogModalId !== (log.id || idx) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                            {/* Device & OS */}
                            <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-start gap-3 md:hidden">
                              <div className="p-2 bg-surface-container rounded-lg text-primary">
                                <span className="material-symbols-outlined text-[20px]">
                                  {log.deviceType?.toLowerCase() === "mobile"
                                    ? "smartphone"
                                    : "desktop_windows"}
                                </span>
                              </div>
                              <div>
                                <p className="text-[11px] font-label-sm uppercase tracking-wider text-on-surface-variant mb-0.5">
                                  System
                                </p>
                                <p className="text-body-sm text-on-surface capitalize">
                                  {log.deviceType || "Unknown"} •{" "}
                                  {log.operatingSystem || "Unknown"}{" "}
                                  {log.osVersion || ""}
                                </p>
                                <p className="text-body-sm text-on-surface mt-0.5">
                                  {log.browser || "Unknown"}{" "}
                                  {log.browserVersion || ""}
                                </p>
                              </div>
                            </div>

                            {/* Location */}
                            <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-start gap-3">
                              <div className="p-2 bg-surface-container rounded-lg text-secondary">
                                <span className="material-symbols-outlined text-[20px]">
                                  location_on
                                </span>
                              </div>
                              <div>
                                <p className="text-[11px] font-label-sm uppercase tracking-wider text-on-surface-variant mb-0.5">
                                  Location
                                </p>
                                <p className="text-body-sm text-on-surface">
                                  {log.city ? `${log.city}, ` : ""}
                                  {log.country || "Unknown"}
                                </p>
                                {(log.region || log.zip) && (
                                  <p className="text-[12px] text-on-surface-variant mt-0.5">
                                    {log.region || ""} {log.zip || ""}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Network */}
                            <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-start gap-3">
                              <div className="p-2 bg-surface-container rounded-lg text-tertiary">
                                <span className="material-symbols-outlined text-[20px]">
                                  language
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-[11px] font-label-sm uppercase tracking-wider text-on-surface-variant mb-0.5">
                                  Network
                                </p>
                                <p
                                  className="text-body-sm text-on-surface truncate"
                                  title={log.referrer}
                                >
                                  {log.referrer && log.referrer !== "Anonymous"
                                    ? log.referrer
                                    : "Direct / None"}
                                </p>
                                {log.isp && log.isp !== "Unknown" && (
                                  <p
                                    className="text-[12px] text-on-surface-variant mt-0.5 truncate"
                                    title={log.isp}
                                  >
                                    {log.isp}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* UTM Parameters */}
                            <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-start gap-3">
                              <div className="p-2 bg-surface-container rounded-lg text-error">
                                <span className="material-symbols-outlined text-[20px]">
                                  campaign
                                </span>
                              </div>
                              <div className="min-w-0 w-full">
                                <p className="text-[11px] font-label-sm uppercase tracking-wider text-on-surface-variant mb-0.5">
                                  Campaign (UTM)
                                </p>
                                {log.utmSource ||
                                log.utmMedium ||
                                log.utmCampaign ? (
                                  <div className="space-y-1 mt-1">
                                    {log.utmSource && (
                                      <p className="text-[12px] flex justify-between">
                                        <span className="text-on-surface-variant">
                                          Source:
                                        </span>{" "}
                                        <span className="text-on-surface font-medium truncate">
                                          {log.utmSource}
                                        </span>
                                      </p>
                                    )}
                                    {log.utmMedium && (
                                      <p className="text-[12px] flex justify-between">
                                        <span className="text-on-surface-variant">
                                          Medium:
                                        </span>{" "}
                                        <span className="text-on-surface font-medium truncate">
                                          {log.utmMedium}
                                        </span>
                                      </p>
                                    )}
                                    {log.utmCampaign && (
                                      <p className="text-[12px] flex justify-between">
                                        <span className="text-on-surface-variant">
                                          Campaign:
                                        </span>{" "}
                                        <span className="text-on-surface font-medium truncate">
                                          {log.utmCampaign}
                                        </span>
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-body-sm text-on-surface-variant italic">
                                    No UTM data
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}

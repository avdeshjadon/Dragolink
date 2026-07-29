/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import MotionAlert from "../components/motion/MotionAlert";
import MotionModal from "../components/motion/MotionModal";
import { api } from "../lib/axios";
import { QRCodeSVG } from "qrcode.react";
import AsyncButton from "../components/AsyncButton";
export default function MyLinks() {
  const navigate = useNavigate();
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Active");
  const [activeTab, setActiveTab] = useState("links"); // 'links' or 'qr'

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Modal states
  const [deleteModalLink, setDeleteModalLink] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Click Log Modal State

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const response = await api.get("/links");
      setLinks(
        response.data.map((link) => ({
          ...link,
          createdAt: new Date(link.createdAt).toLocaleDateString(),
        })),
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to load links");
    } finally {
      setLoading(false);
    }
  };

  const displayedLinks = links.filter((link) => {
    const isQR = link.title && link.title.startsWith("[QR]");
    if (activeTab === "qr" && !isQR) return false;
    if (activeTab === "links" && isQR) return false;

    if (activeFilter === "Active") return link.active && link.status !== "Expired";
    if (activeFilter === "Expired") return link.status === "Expired";
    if (activeFilter === "Scheduled") return link.status === "Scheduled";
    return true;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLinks(displayedLinks.map((l) => l.id));
    } else {
      setSelectedLinks([]);
    }
  };

  const handleSelect = (id) => {
    if (selectedLinks.includes(id)) {
      setSelectedLinks(selectedLinks.filter((linkId) => linkId !== id));
    } else {
      setSelectedLinks([...selectedLinks, id]);
    }
  };

  const handleCopy = (shortCode) => {
    const url = `${import.meta.env.VITE_APP_URL}/${shortCode}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied to clipboard!");
    });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/links/${id}`);
      setDeleteModalLink(null);
      fetchLinks();
      setSelectedLinks(selectedLinks.filter((selectedId) => selectedId !== id));
      toast.success("Link deleted successfully!");
    } catch (err) {
      console.error("Failed to delete link", err);
      toast.error(err.response?.data?.message || "Failed to delete link");
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await api.patch(`/links/${id}/toggle`);
      fetchLinks();
      toast.success(
        `Link ${currentStatus ? "deactivated" : "activated"} successfully!`,
      );
    } catch (err) {
      console.error("Failed to toggle link status", err);
      toast.error(
        err.response?.data?.message || "Failed to update link status",
      );
    }
  };

  const handleBulkDelete = () => {
    if (selectedLinks.length === 0) return;
    setIsBulkDeleteModalOpen(true);
  };

  const executeBulkDelete = async () => {
    try {
      await Promise.all(selectedLinks.map((id) => api.delete(`/links/${id}`)));
      setSelectedLinks([]);
      setIsBulkDeleteModalOpen(false);
      fetchLinks();
      toast.success(`${selectedLinks.length} items deleted successfully!`);
    } catch (err) {
      console.error("Failed to bulk delete", err);
      toast.error("Failed to delete some items");
    }
  };

  const handleExportLinks = () => {
    if (!displayedLinks || displayedLinks.length === 0) return;

    const headers = [
      "Title",
      "Long URL",
      "Short Code",
      "Custom Alias",
      "Status",
      "Click Count",
      "Created At",
      "Expires At",
    ];

    const rows = displayedLinks.map((link) => {
      const createdAt = new Date(link.createdAt).toLocaleString();
      const expiresAt = link.expiryDate
        ? new Date(link.expiryDate).toLocaleString()
        : "Never";

      return [
        `"${link.title || ""}"`,
        `"${link.longUrl || ""}"`,
        `"${link.shortCode || ""}"`,
        `"${link.customAlias || ""}"`,
        `"${link.active ? "Active" : "Inactive"}"`,
        `"${link.clickCount || 0}"`,
        `"${createdAt}"`,
        `"${expiresAt}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.setAttribute(
      "download",
      `dragolink-export-${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    toast.success("Links exported successfully!");
  };

  return (
    <div className="flex flex-col h-full bg-background font-sans relative">
      {/* Header Context for Desktop */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="hidden md:flex flex-col">
          <h2 className="text-headline-lg font-headline-lg text-on-surface">
            {activeTab === "links" ? "My Links" : "My QR Codes"}
          </h2>
          <span className="text-label-md font-label-md text-on-surface-variant mt-1">
            {links.length} Total {activeTab === "links" ? "Links" : "QR Codes"}
          </span>
        </div>

        {/* Toggle Switch */}
        <div className="mt-4 sm:mt-0 flex bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-1 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("links")}
            className={`cursor-pointer flex-1 sm:flex-none px-4 py-1.5 text-label-md font-label-md rounded-md transition-colors flex items-center justify-center gap-2 ${
              activeTab === "links"
                ? "bg-primary text-white shadow-md"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">link</span>
            Links
          </button>
          <button
            onClick={() => setActiveTab("qr")}
            className={`cursor-pointer flex-1 sm:flex-none px-4 py-1.5 text-label-md font-label-md rounded-md transition-colors flex items-center justify-center gap-2 ${
              activeTab === "qr"
                ? "bg-primary-container text-on-primary-container shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              qr_code_2
            </span>
            QR Codes
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Toolbar & Filters */}
        {selectedLinks.length > 0 ? (
          <div className="flex items-center justify-between bg-secondary-container/40 border border-secondary-fixed/20 rounded-lg p-2 px-4 animate-fade-in">
            <span className="text-label-sm font-label-sm text-secondary-fixed">
              {selectedLinks.length} items selected
            </span>
            <div className="flex gap-2">
              <button className="text-label-sm font-label-sm text-on-surface hover:text-primary transition-colors flex items-center gap-1 cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">
                  label
                </span>{" "}
                Tag
              </button>
              <button
                onClick={handleBulkDelete}
                className="text-label-sm font-label-sm text-error hover:text-error/80 transition-colors flex items-center gap-1 ml-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  delete
                </span>{" "}
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-panel p-4 rounded-xl relative z-20">
            <div className="flex items-center gap-2">
              <button className="bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface text-label-md font-label-md py-1.5 px-3 rounded-lg flex items-center justify-center transition-colors cursor-pointer" title="Filter">
                <span className="material-symbols-outlined text-[18px]">
                  filter_list
                </span>
              </button>
              <div className="flex bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-1">
                {["All", "Active", "Expired", "Scheduled"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1 text-label-sm font-label-sm rounded-md transition-colors cursor-pointer ${
                      activeFilter === filter
                        ? "bg-secondary-container text-on-secondary-container"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleExportLinks}
                className="hidden sm:flex bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface text-label-md font-label-md py-1.5 px-3 rounded-lg items-center gap-2 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  download
                </span>
                Export
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsCreateOpen(!isCreateOpen)}
                  className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white text-label-md font-label-md py-1.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(21,128,61,0.3)] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    add_link
                  </span>
                  Create Link
                  <span
                    className="material-symbols-outlined text-[18px] ml-1 transition-transform"
                    style={{
                      transform: isCreateOpen ? "rotate(180deg)" : "none",
                    }}
                  >
                    expand_more
                  </span>
                </button>

                <AnimatePresence>
                  {isCreateOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/20 overflow-hidden z-50 flex flex-col p-2"
                    >
                      <Link
                        to="/create"
                        onClick={() => setIsCreateOpen(false)}
                        className="px-4 py-2 flex items-center gap-3 text-label-md font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors rounded-lg"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          link
                        </span>
                        Shorten Link
                      </Link>
                      <Link
                        to="/qr"
                        onClick={() => setIsCreateOpen(false)}
                        className="px-4 py-2 flex items-center gap-3 text-label-md font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors rounded-lg"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          qr_code_2
                        </span>
                        QR Code
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* Premium Data List */}
        <div className="flex flex-col gap-4">
          {/* Cards */}
          {displayedLinks.map((link) => (
            <div
              key={link.id}
              className={`group relative flex flex-col xl:flex-row xl:items-center gap-4 p-5 bg-surface/60 backdrop-blur-xl border border-outline-variant/20 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${link.status === "Expired" ? "opacity-75 grayscale-[0.2]" : ""}`}
            >
              {/* Icon/Preview & Main Info */}
              {activeTab === "qr" ? (
                <div className="flex flex-1 items-center gap-5 min-w-0">
                  <div className="w-20 h-20 bg-white rounded-xl border border-outline-variant/20 p-2 shrink-0 flex items-center justify-center shadow-sm relative overflow-hidden group-hover:shadow-md transition-shadow">
                    <QRCodeSVG
                      value={`${import.meta.env.VITE_APP_URL}/${link.customAlias || link.shortCode}`}
                      size={64}
                    />
                  </div>
                  <div className="flex flex-col min-w-0 justify-center">
                    <span className="text-headline-sm font-headline-sm text-on-surface truncate mb-1 group-hover:text-primary transition-colors">
                      {link.title || link.customAlias || link.shortCode}
                    </span>
                    <span className="text-body-md font-body-md text-on-surface-variant/70 truncate">
                      {link.longUrl}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 items-center gap-4 min-w-0">
                  <div className="flex flex-col min-w-0 justify-center gap-1">
                    <span className="text-headline-sm font-headline-sm text-on-surface truncate group-hover:text-primary transition-colors">
                      {link.title || link.customAlias || link.shortCode}
                    </span>
                    <span className="text-body-md font-body-md text-on-surface-variant/70 truncate hidden sm:block">
                      {link.longUrl}
                    </span>
                  </div>
                </div>
              )}

              {/* Stats & Actions Area */}
              <div className="flex items-center justify-between xl:justify-end gap-6 xl:w-[500px] shrink-0 mt-4 xl:mt-0 pt-4 xl:pt-0 border-t border-outline-variant/10 xl:border-t-0">
                {/* Short URL Pill (Only in Links tab) */}
                {activeTab === "links" && (
                  <button
                    onClick={() => handleCopy(link.customAlias || link.shortCode)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/20 rounded-lg cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all text-label-sm font-medium text-on-surface hover:text-primary whitespace-nowrap"
                    title="Copy shortened link"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    Copy Link
                  </button>
                )}

                {/* Clicks */}
                <div className="flex items-center gap-2" title="Total Clicks">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                    ads_click
                  </span>
                  <span className="text-label-lg font-label-lg text-on-surface">
                    {link.clickCount?.toLocaleString()}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="hidden sm:block relative w-fit">
                  <select
                    value={link.active ? "active" : "inactive"}
                    onChange={(e) => {
                      const newStatus = e.target.value === "active";
                      if (newStatus !== link.active) {
                        handleToggleActive(link.id, link.active);
                      }
                    }}
                    className={`appearance-none inline-flex items-center pl-6 pr-7 py-1 rounded-full text-label-sm font-label-sm cursor-pointer outline-none transition-colors border shadow-sm ${
                      link.active 
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]" 
                        : "bg-surface-container-high text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-highest"
                    }`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  {/* Status dot */}
                  <div className={`w-1.5 h-1.5 rounded-full absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${link.active ? "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" : "bg-on-surface-variant/50"}`}></div>
                  {/* Custom arrow for select */}
                  <span className={`material-symbols-outlined text-[14px] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${link.active ? "text-emerald-600" : "text-on-surface-variant"}`}>
                    expand_more
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 ml-2">
                  <button
                    onClick={() => navigate(`/logs/${link.id}`)}
                    className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                    title="Click Log / Info"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      info
                    </span>
                  </button>
                  <button
                    onClick={() => navigate(`/analytics/${link.id}`)}
                    className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                    title="Analytics"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      bar_chart
                    </span>
                  </button>
                  <button
                    onClick={() => navigate(`/links/${link.id}/edit`)}
                    className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      edit
                    </span>
                  </button>
                  <button
                    onClick={() => setDeleteModalLink(link)}
                    className="text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {displayedLinks.length === 0 && !loading && (
            <div className="p-12 flex flex-col items-center justify-center bg-surface/50 rounded-2xl border border-outline-variant/20 border-dashed animate-fade-in mt-4">
              <img 
                src="/images/no_result_found.svg" 
                alt="No links found" 
                className="w-48 h-48 mb-2 opacity-90 object-contain drop-shadow-sm"
              />
              <h3 className="text-headline-sm font-headline-sm text-on-surface mb-2 mt-4">
                No links found
              </h3>
              <p className="text-body-md text-on-surface-variant text-center max-w-sm mb-6">
                You haven't created any{" "}
                {activeTab === "qr" ? "QR Codes" : "links"} in this category
                yet. Start sharing to see them here.
              </p>
              <button
                onClick={() => navigate(activeTab === "qr" ? "/qr" : "/create")}
                className="bg-primary text-white px-6 py-2.5 rounded-lg text-label-md font-label-md hover:bg-primary/90 transition-colors shadow-md flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {activeTab === "qr" ? "qr_code_2" : "add_link"}
                </span>
                Create {activeTab === "qr" ? "QR Code" : "Short Link"}
              </button>
            </div>
          )}

          {/* Pagination */}
          {displayedLinks.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-label-sm font-label-sm text-on-surface-variant ml-2">
                Showing {displayedLinks.length} results
              </span>
              <div className="flex items-center gap-2 bg-surface/60 backdrop-blur-sm border border-outline-variant/20 rounded-lg p-1 shadow-sm">
                <button
                  className="p-1.5 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  disabled
                >
                  <span className="material-symbols-outlined text-[18px]">
                    chevron_left
                  </span>
                </button>
                <button className="w-8 h-8 rounded-md flex items-center justify-center text-label-sm font-label-sm bg-primary text-white shadow-sm cursor-pointer">
                  1
                </button>
                <button
                  className="p-1.5 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  disabled
                >
                  <span className="material-symbols-outlined text-[18px]">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <MotionAlert
        isOpen={!!deleteModalLink}
        onClose={() => setDeleteModalLink(null)}
        onConfirm={() => handleDelete(deleteModalLink?.id)}
        title="Delete Link?"
        description={
          <>
            Are you sure you want to delete{" "}
            <span className="font-bold text-on-surface">
              {deleteModalLink?.title ||
                deleteModalLink?.customAlias ||
                deleteModalLink?.shortCode}
            </span>
            ? This action cannot be undone.
          </>
        }
        confirmText="Delete"
        isDestructive={true}
        icon={
          <span className="material-symbols-outlined text-[32px]">warning</span>
        }
      />

      {/* Bulk Delete Confirmation Modal */}
      <MotionAlert
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={executeBulkDelete}
        title={`Delete ${selectedLinks.length} Items?`}
        description={`This will permanently delete the ${selectedLinks.length} selected ${activeTab === "qr" ? "QR Codes" : "links"}. This action cannot be undone.`}
        confirmText="Delete"
        isDestructive={true}
        icon={
          <span className="material-symbols-outlined text-[32px]">
            delete_sweep
          </span>
        }
      />
    </div>
  );
}

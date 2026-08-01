/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { api } from "../lib/axios";
import AsyncButton from "../components/AsyncButton";
import CampaignSelect from "../components/CampaignSelect";

export default function EditLink() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isEditingLink, setIsEditingLink] = useState(false);

  // States
  const [editUrl, setEditUrl] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editAlias, setEditAlias] = useState("");
  const [editRoutingRules, setEditRoutingRules] = useState([]);
  const [editUtmSource, setEditUtmSource] = useState("");
  const [editUtmMedium, setEditUtmMedium] = useState("");
  const [editUtmCampaign, setEditUtmCampaign] = useState("");
  const [editUtmTerm, setEditUtmTerm] = useState("");
  const [editUtmContent, setEditUtmContent] = useState("");
  const [editTrackIp, setEditTrackIp] = useState(true);
  const [editTrackBrowser, setEditTrackBrowser] = useState(true);
  const [editTrackOs, setEditTrackOs] = useState(true);
  const [editTrackDevice, setEditTrackDevice] = useState(true);
  const [editTrackReferrer, setEditTrackReferrer] = useState(true);
  const [originalLink, setOriginalLink] = useState(null);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await api.get("/campaigns");
        setCampaigns(res.data);
      } catch (error) {
        console.error("Failed to load campaigns", error);
      }
    };
    fetchCampaigns();
  }, []);

  useEffect(() => {
    const fetchLinkDetails = async () => {
      try {
        const response = await api.get(`/links/${id}`);
        const link = response.data;

        setEditUrl(link.longUrl);
        setEditTitle(link.title || "");
        setEditAlias(link.customAlias || "");
        setEditRoutingRules(link.routingRules || []);

        setEditUtmSource(link.utmSource || "");
        setEditUtmMedium(link.utmMedium || "");
        setEditUtmCampaign(link.utmCampaign || "");
        setEditUtmTerm(link.utmTerm || "");
        setEditUtmContent(link.utmContent || "");

        setEditTrackIp(link.trackIp !== false);
        setEditTrackBrowser(link.trackBrowser !== false);
        setEditTrackOs(link.trackOs !== false);
        setEditTrackDevice(link.trackDevice !== false);
        setEditTrackReferrer(link.trackReferrer !== false);
        setOriginalLink(link);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch link details", error);
        toast.error("Failed to fetch link details");
        navigate("/links");
      }
    };
    fetchLinkDetails();
  }, [id, navigate]);

  const addEditRoutingRule = () => {
    setEditRoutingRules([
      ...editRoutingRules,
      { type: "OS", conditionValue: "", destinationUrl: "" },
    ]);
  };

  const removeEditRoutingRule = (index) => {
    setEditRoutingRules(editRoutingRules.filter((_, i) => i !== index));
  };

  const updateEditRoutingRule = (index, field, value) => {
    const newRules = [...editRoutingRules];
    newRules[index][field] = value;
    setEditRoutingRules(newRules);
  };

  const isChanged = () => {
    if (!originalLink) return false;
    if (editUrl !== originalLink.longUrl) return true;
    if (editTitle !== (originalLink.title || "")) return true;
    if (editAlias !== (originalLink.customAlias || "")) return true;
    
    // Quick deep equal for routing rules
    if (JSON.stringify(editRoutingRules) !== JSON.stringify(originalLink.routingRules || [])) return true;
    
    if (editUtmSource !== (originalLink.utmSource || "")) return true;
    if (editUtmMedium !== (originalLink.utmMedium || "")) return true;
    if (editUtmCampaign !== (originalLink.utmCampaign || "")) return true;
    if (editUtmTerm !== (originalLink.utmTerm || "")) return true;
    if (editUtmContent !== (originalLink.utmContent || "")) return true;
    
    if (editTrackIp !== (originalLink.trackIp !== false)) return true;
    if (editTrackBrowser !== (originalLink.trackBrowser !== false)) return true;
    if (editTrackOs !== (originalLink.trackOs !== false)) return true;
    if (editTrackDevice !== (originalLink.trackDevice !== false)) return true;
    if (editTrackReferrer !== (originalLink.trackReferrer !== false)) return true;
    
    return false;
  };

  const handleEditSubmit = async () => {
    if (!editUrl) {
      toast.error("Destination URL is required");
      return;
    }

    setIsEditingLink(true);
    try {
      await api.put(`/links/${id}`, {
        longUrl: editUrl,
        title: editTitle,
        customAlias: editAlias,
        routingRules: editRoutingRules,
        utmSource: editUtmSource || undefined,
        utmMedium: editUtmMedium || undefined,
        utmCampaign: editUtmCampaign || undefined,
        utmTerm: editUtmTerm || undefined,
        utmContent: editUtmContent || undefined,
        trackIp: editTrackIp,
        trackBrowser: editTrackBrowser,
        trackOs: editTrackOs,
        trackDevice: editTrackDevice,
        trackReferrer: editTrackReferrer,
      });
      toast.success("Link updated successfully!");
      navigate("/links");
    } catch (err) {
      console.error("Failed to update link", err);
      const msg = err.response?.data?.message;
      if (msg !== "VIEWER_ACCESS_DENIED_SILENT") {
        toast.error(msg || "Failed to update link");
      }
    } finally {
      setIsEditingLink(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans selection:bg-primary/20 pb-20">
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
              className="p-2 -ml-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">
                arrow_back
              </span>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-semibold text-on-surface tracking-tight">
                Edit Link
              </h1>
              <p className="text-label-sm text-on-surface-variant mt-0.5">
                Update destination, routing, and tracking settings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleEditSubmit}
              disabled={!isChanged() || isEditingLink}
              className={`px-6 py-2 rounded-lg font-label-md flex items-center gap-2 transition-colors cursor-pointer ${
                isChanged()
                  ? "bg-primary text-white hover:bg-primary/90 shadow-sm"
                  : "bg-surface-container-highest text-on-surface-variant cursor-not-allowed opacity-60"
              }`}
            >
              {isEditingLink ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">
                  save
                </span>
              )}
              <span className="hidden sm:inline">Save Changes</span>
              <span className="sm:hidden">Save</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant/30 shadow-sm">
          <h3 className="font-label-lg text-[14px] text-on-surface uppercase tracking-wider mb-6 border-b border-outline-variant/20 pb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              link
            </span>
            Basic Info
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
                Destination URL
              </label>
              <input
                type="url"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-xl px-4 py-3 font-code-sm text-code-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
                  Link Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-xl px-4 py-3 font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
                  Custom Alias
                </label>
                <input
                  type="text"
                  value={editAlias}
                  onChange={(e) => setEditAlias(e.target.value)}
                  className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-xl px-4 py-3 font-code-sm text-code-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>
            
            {/* Campaign */}
            <div>
              <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
                Campaign
              </label>
              <CampaignSelect
                campaigns={campaigns}
                value={editUtmCampaign}
                onChange={setEditUtmCampaign}
              />
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant/30 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-outline-variant/20 pb-3">
            <h3 className="font-label-lg text-[14px] text-on-surface uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">
                route
              </span>
              Dynamic Routing
            </h3>
            <button
              onClick={addEditRoutingRule}
              className="text-primary hover:bg-primary/10 font-label-sm uppercase tracking-wider text-[12px] bg-primary/5 px-4 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>{" "}
              Add Rule
            </button>
          </div>
          <div className="space-y-4">
            {editRoutingRules.length === 0 ? (
              <div className="text-center py-6 bg-surface-container/50 rounded-2xl border border-outline-variant/20 border-dashed">
                <p className="text-label-md text-on-surface-variant">
                  No routing rules configured.
                </p>
                <p className="text-body-sm text-on-surface-variant/70 mt-1">
                  Redirect users based on their OS or Device.
                </p>
              </div>
            ) : (
              editRoutingRules.map((rule, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-surface-container p-4 rounded-2xl border border-outline-variant/20 group transition-all hover:border-primary/30"
                >
                  <div className="flex w-full sm:w-auto items-center gap-3">
                    <select
                      value={rule.type}
                      onChange={(e) =>
                        updateEditRoutingRule(index, "type", e.target.value)
                      }
                      className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-3 pr-8 py-2.5 font-label-sm uppercase tracking-wider text-[12px] text-on-surface focus:border-primary outline-none cursor-pointer"
                    >
                      <option value="OS">OS</option>
                      <option value="DEVICE">Device</option>
                    </select>
                    {rule.type === "OS" ? (
                      <select
                        value={rule.conditionValue}
                        onChange={(e) =>
                          updateEditRoutingRule(
                            index,
                            "conditionValue",
                            e.target.value,
                          )
                        }
                        className="bg-surface-container-lowest flex-1 sm:w-36 border border-outline-variant/50 rounded-xl px-4 pr-10 py-2.5 font-body-sm text-[13px] text-on-surface outline-none"
                      >
                        <option value="">Select OS...</option>
                        <option value="ios">iOS</option>
                        <option value="android">Android</option>
                        <option value="macos">macOS</option>
                        <option value="windows">Windows</option>
                        <option value="linux">Linux</option>
                      </select>
                    ) : (
                      <select
                        value={rule.conditionValue}
                        onChange={(e) =>
                          updateEditRoutingRule(
                            index,
                            "conditionValue",
                            e.target.value,
                          )
                        }
                        className="bg-surface-container-lowest flex-1 sm:w-36 border border-outline-variant/50 rounded-xl px-4 pr-10 py-2.5 font-body-sm text-[13px] text-on-surface outline-none"
                      >
                        <option value="">Select Device...</option>
                        <option value="mobile">Mobile</option>
                        <option value="desktop">Desktop</option>
                        <option value="tablet">Tablet</option>
                      </select>
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="Destination URL"
                    value={rule.destinationUrl}
                    onChange={(e) =>
                      updateEditRoutingRule(
                        index,
                        "destinationUrl",
                        e.target.value,
                      )
                    }
                    className="flex-1 w-full bg-surface-container-lowest text-on-surface border border-outline-variant/50 rounded-xl px-4 py-2.5 font-code-sm text-[13px] focus:border-primary outline-none"
                  />
                  <button
                    onClick={() => removeEditRoutingRule(index)}
                    className="p-2.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-colors sm:ml-auto w-full sm:w-auto flex justify-center mt-2 sm:mt-0 items-center"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant/30 shadow-sm">
          <h3 className="font-label-lg text-[14px] text-on-surface uppercase tracking-wider mb-6 border-b border-outline-variant/20 pb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-[20px]">
              campaign
            </span>
            UTM Parameters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
                Source
              </label>
              <input
                type="text"
                value={editUtmSource}
                onChange={(e) => setEditUtmSource(e.target.value)}
                placeholder="e.g. google, newsletter"
                className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-xl px-4 py-3 font-code-sm text-code-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
                Medium
              </label>
              <input
                type="text"
                value={editUtmMedium}
                onChange={(e) => setEditUtmMedium(e.target.value)}
                placeholder="e.g. cpc, email"
                className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-xl px-4 py-3 font-code-sm text-code-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
                Term
              </label>
              <input
                type="text"
                value={editUtmTerm}
                onChange={(e) => setEditUtmTerm(e.target.value)}
                placeholder="Identify paid keywords"
                className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-xl px-4 py-3 font-code-sm text-code-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
                Content
              </label>
              <input
                type="text"
                value={editUtmContent}
                onChange={(e) => setEditUtmContent(e.target.value)}
                placeholder="Differentiate ads"
                className="w-full bg-surface-container text-on-surface border border-outline-variant/50 rounded-xl px-4 py-3 font-code-sm text-code-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-3xl border border-outline-variant/30 shadow-sm">
          <h3 className="font-label-lg text-[14px] text-on-surface uppercase tracking-wider mb-6 border-b border-outline-variant/20 pb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              tune
            </span>
            Tracking Options
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 p-4 bg-surface-container border border-outline-variant/30 rounded-2xl cursor-pointer hover:border-primary/50 transition-colors">
              <input
                type="checkbox"
                checked={editTrackIp}
                onChange={(e) => setEditTrackIp(e.target.checked)}
                className="w-4 h-4 text-primary rounded border-outline-variant bg-surface-container-lowest focus:ring-primary focus:ring-2"
              />
              <span className="text-body-md text-on-surface font-medium select-none">
                Track IP
              </span>
            </label>
            <label className="flex items-center gap-3 p-4 bg-surface-container border border-outline-variant/30 rounded-2xl cursor-pointer hover:border-primary/50 transition-colors">
              <input
                type="checkbox"
                checked={editTrackBrowser}
                onChange={(e) => setEditTrackBrowser(e.target.checked)}
                className="w-4 h-4 text-primary rounded border-outline-variant bg-surface-container-lowest focus:ring-primary focus:ring-2"
              />
              <span className="text-body-md text-on-surface font-medium select-none">
                Track Browser
              </span>
            </label>
            <label className="flex items-center gap-3 p-4 bg-surface-container border border-outline-variant/30 rounded-2xl cursor-pointer hover:border-primary/50 transition-colors">
              <input
                type="checkbox"
                checked={editTrackOs}
                onChange={(e) => setEditTrackOs(e.target.checked)}
                className="w-4 h-4 text-primary rounded border-outline-variant bg-surface-container-lowest focus:ring-primary focus:ring-2"
              />
              <span className="text-body-md text-on-surface font-medium select-none">
                Track OS
              </span>
            </label>
            <label className="flex items-center gap-3 p-4 bg-surface-container border border-outline-variant/30 rounded-2xl cursor-pointer hover:border-primary/50 transition-colors">
              <input
                type="checkbox"
                checked={editTrackDevice}
                onChange={(e) => setEditTrackDevice(e.target.checked)}
                className="w-4 h-4 text-primary rounded border-outline-variant bg-surface-container-lowest focus:ring-primary focus:ring-2"
              />
              <span className="text-body-md text-on-surface font-medium select-none">
                Track Device
              </span>
            </label>
            <label className="flex items-center gap-3 p-4 bg-surface-container border border-outline-variant/30 rounded-2xl cursor-pointer hover:border-primary/50 transition-colors">
              <input
                type="checkbox"
                checked={editTrackReferrer}
                onChange={(e) => setEditTrackReferrer(e.target.checked)}
                className="w-4 h-4 text-primary rounded border-outline-variant bg-surface-container-lowest focus:ring-primary focus:ring-2"
              />
              <span className="text-body-md text-on-surface font-medium select-none">
                Track Referrer
              </span>
            </label>
          </div>
        </section>

        {/* Bottom Action Area */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 mt-6 border-t border-outline-variant/20">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-outline-variant text-primary font-label-md text-label-md hover:bg-surface-container-highest transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <AsyncButton
            onClick={handleEditSubmit}
            disabled={!isChanged() || isEditingLink}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              isChanged()
                ? "bg-primary text-white hover:bg-primary/90 shadow-[0_0_15px_rgba(21,128,61,0.3)] sm:shadow-sm"
                : "bg-surface-container-highest text-on-surface-variant cursor-not-allowed opacity-60"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            Save Changes
          </AsyncButton>
        </div>
      </main>
    </div>
  );
}

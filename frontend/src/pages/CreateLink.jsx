/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../lib/axios";
import AsyncButton from "../components/AsyncButton";

export default function CreateLink() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [alias, setAlias] = useState("");
  const [tags, setTags] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [aliasSuggestions, setAliasSuggestions] = useState([]);

  // Generate alias suggestions based on destination URL
  useEffect(() => {
    if (!url) {
      setAliasSuggestions([]);
      return;
    }
    try {
      const urlObj = new URL(url);
      let path = urlObj.pathname;
      let hostname = urlObj.hostname.replace("www.", "").split(".")[0];

      if (path.endsWith("/")) path = path.slice(0, -1);
      const segments = path.split("/").filter(Boolean);
      const lastSegment = segments[segments.length - 1] || "";
      const cleanSegment = lastSegment
        .split(".")[0]
        .replace(/[^a-zA-Z0-9-]/g, "-")
        .toLowerCase();

      const suggestions = new Set();

      if (cleanSegment && cleanSegment.length > 2) {
        suggestions.add(cleanSegment);
        const words = cleanSegment.split("-");
        if (words.length > 1) {
          suggestions.add(`${words[0]}-${words[1]}`);
        }
      }

      if (hostname && hostname.length > 2 && hostname !== "localhost") {
        if (cleanSegment) {
          suggestions.add(`${hostname}-${cleanSegment.split("-")[0]}`);
        } else {
          suggestions.add(hostname);
        }
      }

      while (suggestions.size < 3) {
        suggestions.add(Math.random().toString(36).substring(2, 6));
      }

      setAliasSuggestions(Array.from(suggestions).slice(0, 3));
    } catch (e) {
      setAliasSuggestions([]);
    }
  }, [url]);

  // Tracking Preferences
  const [trackIp, setTrackIp] = useState(true);
  const [trackBrowser, setTrackBrowser] = useState(true);
  const [trackOs, setTrackOs] = useState(true);
  const [trackDevice, setTrackDevice] = useState(true);
  const [trackReferrer, setTrackReferrer] = useState(true);

  // UTM Parameters
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [utmTerm, setUtmTerm] = useState("");
  const [utmContent, setUtmContent] = useState("");

  // Routing Rules
  const [routingRules, setRoutingRules] = useState([]);

  const addRoutingRule = () => {
    setRoutingRules([
      ...routingRules,
      { type: "OS", conditionValue: "", destinationUrl: "" },
    ]);
  };

  const updateRoutingRule = (index, field, value) => {
    const newRules = [...routingRules];
    newRules[index][field] = value;
    setRoutingRules(newRules);
  };

  const removeRoutingRule = (index) => {
    setRoutingRules(routingRules.filter((_, i) => i !== index));
  };

  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!url) {
      toast.error("Destination URL is required");
      return;
    }

    try {
      const payload = {
        longUrl: url,
        title: title || undefined,
        customAlias: alias || undefined,
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : undefined,
        trackIp,
        trackBrowser,
        trackOs,
        trackDevice,
        trackReferrer,
        utmSource: utmSource || undefined,
        utmMedium: utmMedium || undefined,
        utmCampaign: utmCampaign || undefined,
        utmTerm: utmTerm || undefined,
        utmContent: utmContent || undefined,
        routingRules: routingRules.filter(
          (r) => r.conditionValue && r.destinationUrl,
        ),
      };

      await api.post("/links", payload);
      toast.success("Link created successfully!");
      navigate("/links");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create link");
      console.error(err);
    }
  };

  return (
    <div className="font-sans flex flex-col h-full gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-1">
            Create Link
          </h2>
          <p className="text-on-surface-variant">
            Generate a powerful, trackable short link.
          </p>
        </div>
        <div className="hidden md:flex gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-lg border border-outline-variant text-primary font-label-md text-label-md hover:bg-surface-container-highest transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <AsyncButton
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-primary text-white font-label-md text-label-md hover:bg-primary/90 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            Create Now
          </AsyncButton>
        </div>
      </div>

      {/* Form Layout */}
      <div className="max-w-3xl mx-auto w-full pb-8">
        {/* Form Container */}
        <div className="space-y-6">
          {/* Destination & Basic Info */}
          <section className="tonal-card rounded-xl p-4 md:p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-outline-variant/10 pb-2 mb-4">
              <span className="material-symbols-outlined text-primary text-[20px]">
                link
              </span>
              <h3 className="font-headline-md text-[18px] text-on-surface">
                Destination
              </h3>
            </div>

            {/* URL Input */}
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
                Destination URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">
                    language
                  </span>
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="premium-input w-full rounded-lg pl-10 pr-4 py-2 font-code-sm text-code-sm"
                  placeholder="https://example.com/very/long/path/to/campaign"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
                Link Title (Internal)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="premium-input w-full rounded-lg px-4 py-2 font-body-md"
                placeholder="e.g. Q3 Social Media Campaign"
              />
            </div>
          </section>

          {/* Routing & Behavior */}
          <section className="tonal-card rounded-xl p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/10 pb-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  route
                </span>
                <h3 className="font-headline-md text-[18px] text-on-surface">
                  Routing
                </h3>
              </div>
              <span className="font-label-sm text-label-sm text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  check_circle
                </span>
                Alias available
              </span>
            </div>

            {/* Custom Alias */}
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
                Custom Alias
              </label>
              <div className="flex flex-col sm:flex-row rounded-lg overflow-hidden border border-outline-variant focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all mb-2">
                <span className="px-4 py-2 bg-surface-container-highest text-on-surface-variant font-code-sm text-code-sm border-r border-outline-variant/50 flex items-center">
                  dragolink.vercel.app/
                </span>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  className="flex-1 bg-surface-container-low text-on-surface px-4 py-2 font-code-sm text-code-sm focus:outline-none"
                  placeholder="my-custom-alias"
                />
                <button
                  onClick={() =>
                    setAlias(Math.random().toString(36).substring(2, 8))
                  }
                  type="button"
                  className="px-2 py-2 bg-surface-container-highest text-outline hover:text-primary transition-colors border-l border-outline-variant/50 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    autorenew
                  </span>
                </button>
              </div>

              {/* Alias Suggestions */}
              {aliasSuggestions.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-label-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">
                      auto_awesome
                    </span>{" "}
                    Suggestions:
                  </span>
                  {aliasSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAlias(suggestion)}
                      className="px-3 py-1 rounded-full border border-outline-variant/30 bg-surface-container-lowest text-on-surface-variant text-[12px] hover:border-primary hover:text-primary transition-colors cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Expiration & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
                  Expiration Date
                </label>
                <div className="relative">
                  <input
                    className="premium-input w-full rounded-lg px-4 py-2 font-body-md text-on-surface-variant"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
                  Tags
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="premium-input w-full rounded-lg px-4 py-2 font-body-md"
                    placeholder="Add tags..."
                  />
                  {tags && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <span className="bg-surface-container-highest px-1 py-1 rounded text-[10px] text-on-surface-variant font-code-sm">
                        {tags}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Dynamic Routing */}
          <section className="tonal-card rounded-xl p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/10 pb-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  alt_route
                </span>
                <h3 className="font-headline-md text-[18px] text-on-surface">
                  Dynamic Routing
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {routingRules.map((rule, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-2 items-start sm:items-center bg-surface-container-low p-3 rounded-lg border border-outline-variant/30 relative"
                >
                  <div className="flex gap-2 w-full sm:w-auto">
                    <select
                      value={rule.type}
                      onChange={(e) =>
                        updateRoutingRule(index, "type", e.target.value)
                      }
                      className="premium-input rounded-lg px-2 py-1.5 font-code-sm text-[13px] text-on-surface-variant bg-surface-container-highest border-none"
                    >
                      <option value="OS">OS</option>
                      <option value="DEVICE">Device</option>
                    </select>
                    {rule.type === "OS" ? (
                      <select
                        value={rule.conditionValue}
                        onChange={(e) =>
                          updateRoutingRule(
                            index,
                            "conditionValue",
                            e.target.value,
                          )
                        }
                        className="premium-input flex-1 sm:w-32 rounded-lg px-3 py-1.5 font-body-sm text-[13px] text-on-surface"
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
                          updateRoutingRule(
                            index,
                            "conditionValue",
                            e.target.value,
                          )
                        }
                        className="premium-input flex-1 sm:w-32 rounded-lg px-3 py-1.5 font-body-sm text-[13px] text-on-surface"
                      >
                        <option value="">Select Device...</option>
                        <option value="mobile">Mobile</option>
                        <option value="tablet">Tablet</option>
                        <option value="desktop">Desktop</option>
                      </select>
                    )}
                  </div>
                  <span className="text-on-surface-variant text-[12px] hidden sm:block">
                    ➔
                  </span>
                  <input
                    type="url"
                    placeholder="Destination URL"
                    value={rule.destinationUrl}
                    onChange={(e) =>
                      updateRoutingRule(index, "destinationUrl", e.target.value)
                    }
                    className="premium-input w-full rounded-lg px-3 py-1.5 font-code-sm text-[13px]"
                  />
                  <button
                    type="button"
                    onClick={() => removeRoutingRule(index)}
                    className="absolute top-2 right-2 sm:static p-1 text-error/70 hover:text-error hover:bg-error/10 rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      close
                    </span>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addRoutingRule}
                className="flex items-center gap-1 text-[13px] font-label-sm text-primary hover:text-primary/80 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">
                  add
                </span>
                Add Routing Rule
              </button>
            </div>
          </section>

          {/* UTM Parameters */}
          <section className="tonal-card rounded-xl p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/10 pb-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  campaign
                </span>
                <h3 className="font-headline-md text-[18px] text-on-surface">
                  UTM Parameters
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                  Source
                </label>
                <input
                  type="text"
                  list="utm_source_options"
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  className="premium-input w-full rounded-lg px-3 py-1.5 font-code-sm text-[13px]"
                  placeholder="Select or type..."
                />
                <datalist id="utm_source_options">
                  <option value="google" />
                  <option value="facebook" />
                  <option value="instagram" />
                  <option value="twitter" />
                  <option value="linkedin" />
                  <option value="youtube" />
                  <option value="tiktok" />
                  <option value="newsletter" />
                </datalist>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                  Medium
                </label>
                <input
                  type="text"
                  list="utm_medium_options"
                  value={utmMedium}
                  onChange={(e) => setUtmMedium(e.target.value)}
                  className="premium-input w-full rounded-lg px-3 py-1.5 font-code-sm text-[13px]"
                  placeholder="Select or type..."
                />
                <datalist id="utm_medium_options">
                  <option value="social" />
                  <option value="email" />
                  <option value="cpc" />
                  <option value="banner" />
                  <option value="referral" />
                  <option value="organic" />
                  <option value="affiliate" />
                </datalist>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                  Campaign
                </label>
                <input
                  type="text"
                  list="utm_campaign_options"
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                  className="premium-input w-full rounded-lg px-3 py-1.5 font-code-sm text-[13px]"
                  placeholder="Select or type..."
                />
                <datalist id="utm_campaign_options">
                  <option value="spring_sale" />
                  <option value="summer_promo" />
                  <option value="black_friday" />
                  <option value="holiday_specials" />
                  <option value="welcome_series" />
                  <option value="retargeting" />
                </datalist>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                  Term
                </label>
                <input
                  type="text"
                  value={utmTerm}
                  onChange={(e) => setUtmTerm(e.target.value)}
                  className="premium-input w-full rounded-lg px-3 py-1.5 font-code-sm text-[13px]"
                  placeholder="e.g. running+shoes"
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
                  Content
                </label>
                <input
                  type="text"
                  list="utm_content_options"
                  value={utmContent}
                  onChange={(e) => setUtmContent(e.target.value)}
                  className="premium-input w-full rounded-lg px-3 py-1.5 font-code-sm text-[13px]"
                  placeholder="Select or type..."
                />
                <datalist id="utm_content_options">
                  <option value="logolink" />
                  <option value="textlink" />
                  <option value="sidebar" />
                  <option value="header_banner" />
                  <option value="video_ad" />
                  <option value="button_blue" />
                </datalist>
              </div>
            </div>
          </section>

          {/* Advanced Tracking */}
          <section className="mt-8 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 border-b border-outline-variant/20 mb-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  tune
                </span>
                <h3 className="font-label-lg text-[14px] text-on-surface uppercase tracking-wider">
                  Tracking Options
                </h3>
              </div>
              <button
                onClick={() => {
                  const newState = !(
                    trackIp &&
                    trackBrowser &&
                    trackOs &&
                    trackDevice &&
                    trackReferrer
                  );
                  setTrackIp(newState);
                  setTrackBrowser(newState);
                  setTrackOs(newState);
                  setTrackDevice(newState);
                  setTrackReferrer(newState);
                }}
                className="text-[12px] font-label-sm text-primary hover:text-primary/80 transition-colors"
              >
                {trackIp &&
                trackBrowser &&
                trackOs &&
                trackDevice &&
                trackReferrer
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                {
                  id: "ip",
                  label: "IP & Location",
                  state: trackIp,
                  setter: setTrackIp,
                },
                {
                  id: "browser",
                  label: "Browser",
                  state: trackBrowser,
                  setter: setTrackBrowser,
                },
                { id: "os", label: "OS", state: trackOs, setter: setTrackOs },
                {
                  id: "device",
                  label: "Device",
                  state: trackDevice,
                  setter: setTrackDevice,
                },
                {
                  id: "referrer",
                  label: "Referrer",
                  state: trackReferrer,
                  setter: setTrackReferrer,
                },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={opt.state}
                    onChange={(e) => opt.setter(e.target.checked)}
                    className="w-3.5 h-3.5 rounded-sm border-outline-variant/40 text-primary focus:ring-0 focus:ring-offset-0 bg-transparent transition-all cursor-pointer"
                  />
                  <span className="text-[13px] text-on-surface-variant group-hover:text-on-surface transition-colors select-none">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Mobile Action Area */}
          <div className="md:hidden flex flex-col gap-2 pt-6 mt-6 border-t border-outline-variant/20">
            <AsyncButton
              onClick={handleSubmit}
              className="w-full py-4 rounded-lg bg-primary text-white font-label-md text-label-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(21,128,61,0.3)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                bolt
              </span>
              Create Link
            </AsyncButton>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-4 rounded-lg border border-outline-variant text-primary font-label-md text-label-md hover:bg-surface-container-highest transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

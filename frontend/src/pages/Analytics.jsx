/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/axios";
import { Loader2, ArrowLeft } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Analytics() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [data, setData] = useState({
    totalClicks: 0,
    uniqueVisitors: 0,
    topCampaign: "N/A",
    topCampaignSub: "",
    clicksByDate: [],
    referrers: [],
    browsers: [],
  });

  const [linkTitle, setLinkTitle] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        if (id) {
          // Fetch specific link analytics
          const [linkRes, clicksRes] = await Promise.all([
            api.get(`/links/${id}`),
            api.get(`/analytics/links/${id}`),
          ]);

          const link = linkRes.data;
          const clicks = clicksRes.data;

          setLinkTitle(link.title || link.shortCode);

          // Process raw clicks
          const totalClicks = clicks.length;
          const uniqueVisitors = new Set(clicks.map((c) => c.ipAddress)).size;

          // Group dates
          const groupedDates = {};
          for (let i = timeRange - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split("T")[0];
            groupedDates[dateStr] = 0;
          }

          clicks.forEach((c) => {
            if (c.clickedAt) {
              const dateStr = c.clickedAt.split("T")[0];
              if (groupedDates[dateStr] !== undefined) {
                groupedDates[dateStr]++;
              }
            }
          });

          const clicksByDate = Object.keys(groupedDates).map((date) => ({
            date,
            count: groupedDates[date],
          }));

          // Group referrers
          const refCount = {};
          clicks.forEach((c) => {
            let ref = c.referrer || "Direct";
            if (ref.length > 30) ref = ref.substring(0, 30) + "...";
            refCount[ref] = (refCount[ref] || 0) + 1;
          });
          const referrers = Object.keys(refCount)
            .map((r) => ({ name: r, count: refCount[r] }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

          // Group browsers
          const browserCount = {};
          clicks.forEach((c) => {
            let b = c.browser || "Unknown";
            browserCount[b] = (browserCount[b] || 0) + 1;
          });
          const browsers = Object.keys(browserCount)
            .map((b) => ({ name: b, count: browserCount[b] }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

          setData({
            totalClicks,
            uniqueVisitors,
            topCampaign: link.active ? "Active" : "Inactive",
            topCampaignSub: `Created: ${new Date(link.createdAt).toLocaleDateString()}`,
            clicksByDate,
            referrers,
            browsers,
          });
        } else {
          // Fetch global dashboard analytics
          const res = await api.get("/analytics/dashboard", {
            params: { days: timeRange },
          });
          const dash = res.data;

          const topCampaignData = 
            dash.topCampaigns && dash.topCampaigns.length > 0 ? dash.topCampaigns[0] : null;

          setData({
            totalClicks: dash.totalClicks,
            uniqueVisitors: dash.uniqueVisitors,
            topCampaign: topCampaignData ? topCampaignData.name : "None",
            topCampaignSub: topCampaignData
              ? `${((topCampaignData.clicks / Math.max(1, dash.totalClicks)) * 100).toFixed(1)}% of total volume`
              : "",
            clicksByDate: dash.clicksByDate.map((d) => ({
              date: d.date,
              count: d.count,
            })),
            referrers: (dash.clicksByReferrer || [])
              .map((r) => ({ name: r.referrer || "Direct", count: r.count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 5),
            browsers: (dash.clicksByBrowser || [])
              .map((b) => ({ name: b.browser || "Unknown", count: b.count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 5),
          });
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [id, timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate total for percentages
  const refTotal =
    data.referrers.reduce((acc, curr) => acc + curr.count, 0) || 1; // avoid / 0
  const browserTotal =
    data.browsers.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const colors = [
    "bg-primary",
    "bg-secondary",
    "bg-tertiary",
    "bg-error",
    "bg-outline",
  ];

  return (
    <div className="flex flex-col h-full bg-background font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <div className="flex items-center gap-3">
            {id && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-headline-lg font-headline-lg text-primary-fixed-dim">
              {id
                ? `Link Analytics: ${linkTitle}`
                : "Global Analytics Dashboard"}
            </h2>
          </div>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1 ml-2 md:ml-0">
            Comprehensive breakdown of link performance and traffic sources.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Filters */}
          <div className="flex gap-2">
            <div className="relative group">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 bg-surface-container px-4 py-2 rounded-lg border border-outline-variant/30 text-label-md font-label-md text-on-surface hover:border-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">
                  calendar_today
                </span>
                Last {timeRange} Days
                <span className="material-symbols-outlined text-[16px]">
                  arrow_drop_down
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-surface-container-high border border-outline-variant/30 rounded-xl shadow-lg overflow-hidden z-50">
                  <div className="flex flex-col py-1">
                    {[7, 30, 90].map((days) => (
                      <button
                        key={days}
                        onClick={() => {
                          setTimeRange(days);
                          setIsDropdownOpen(false);
                        }}
                        className={`px-4 py-2 text-left text-label-md font-label-md hover:bg-primary/10 transition-colors ${timeRange === days ? "text-primary bg-primary/5" : "text-on-surface"}`}
                      >
                        Last {days} Days
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Export */}
          <button className="flex items-center gap-1 bg-surface-container-high px-4 py-2 rounded-lg border border-outline-variant/50 text-label-md font-label-md text-primary hover:bg-surface-bright transition-colors ml-auto md:ml-0">
            <span className="material-symbols-outlined text-[16px]">
              download
            </span>
            Export CSV
          </button>
        </div>
      </div>

      {/* Analytics Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
        {/* Key Metrics Overview */}
        <div className="xl:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="glass-panel p-4 rounded-xl hover:border-primary transition-colors border border-outline-variant/20 shadow-sm">
            <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
              Total Clicks
            </p>
            <p className="text-headline-lg font-headline-lg text-on-surface">
              {data.totalClicks.toLocaleString()}
            </p>
          </div>
          <div className="glass-panel p-4 rounded-xl hover:border-primary transition-colors border border-outline-variant/20 shadow-sm">
            <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
              Unique Visitors
            </p>
            <p className="text-headline-lg font-headline-lg text-on-surface">
              {data.uniqueVisitors.toLocaleString()}
            </p>
          </div>
          <div className="glass-panel p-4 rounded-xl hover:border-primary transition-colors border border-outline-variant/20 shadow-sm col-span-2 md:col-span-1">
            <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">
              {id ? "Link Status" : "Top Campaign"}
            </p>
            <p className="text-headline-md font-headline-md text-on-surface truncate">
              {data.topCampaign}
            </p>
            {data.topCampaignSub && (
              <p className="text-label-sm font-label-sm text-secondary mt-1">
                {data.topCampaignSub}
              </p>
            )}
          </div>
        </div>

        {/* Interactive Chart (Section 1) */}
        <div className="xl:col-span-2 glass-panel rounded-xl p-6 flex flex-col border border-outline-variant/20 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-headline-md font-headline-md text-on-surface">
              Clicks Over Time
            </h3>
          </div>
          {/* Chart Visualization Area */}
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.clicksByDate}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ffffff15"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#a3a3a3", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => {
                    if (!val) return "";
                    const d = new Date(val);
                    return `${d.getDate()} ${d.toLocaleString("default", { month: "short" })}`;
                  }}
                />
                <YAxis
                  tick={{ fill: "#a3a3a3", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                  labelFormatter={(val) => {
                    if (!val) return "";
                    return new Date(val).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Referrers & Browsers (Section 2) */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          {/* Referrers Chart */}
          <div className="glass-panel rounded-xl p-5 flex-1 border border-outline-variant/20 shadow-sm">
            <h3 className="text-label-md font-label-md text-on-surface mb-5 uppercase tracking-wider">
              Top Referrers
            </h3>
            <div className="space-y-5">
              {data.referrers.length === 0 ? (
                <div className="text-on-surface-variant text-sm text-center py-4">
                  No referrer data yet.
                </div>
              ) : (
                data.referrers.map((ref, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-label-sm font-label-sm mb-2">
                      <span className="text-on-surface truncate pr-2">
                        {ref.name}
                      </span>
                      <span className="text-on-surface-variant font-code-sm">
                        {((ref.count / refTotal) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full ${colors[idx % colors.length]}`}
                        style={{ width: `${(ref.count / refTotal) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Browser Chart */}
          <div className="glass-panel rounded-xl p-5 flex-1 border border-outline-variant/20 shadow-sm">
            <h3 className="text-label-md font-label-md text-on-surface mb-6 uppercase tracking-wider">
              Browser Usage
            </h3>
            <div className="flex items-end justify-around h-32 mt-auto">
              {data.browsers.length === 0 ? (
                <div className="text-on-surface-variant text-sm flex items-center justify-center w-full h-full">
                  No browser data yet.
                </div>
              ) : (
                data.browsers.map((b, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-2 group w-full relative"
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-highest px-2 py-1 rounded text-xs text-on-surface z-10 pointer-events-none whitespace-nowrap shadow-md border border-outline-variant/20">
                      {b.count} clicks
                    </div>
                    <div
                      className={`w-8 ${colors[idx % colors.length]} rounded-t-sm transition-all duration-300 group-hover:brightness-125`}
                      style={{
                        height: `${Math.max(10, (b.count / browserTotal) * 100)}%`,
                        minHeight: "10px",
                      }}
                    ></div>
                    <span
                      className="text-code-sm font-code-sm text-on-surface-variant truncate w-full text-center"
                      title={b.name}
                    >
                      {b.name.substring(0, 3)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

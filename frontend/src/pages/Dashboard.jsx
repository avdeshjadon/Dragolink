/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#15803d", "#79db8d", "#98da27", "#4ade80", "#22c55e"];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("7D");
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/analytics/dashboard")
      .then((res) => {
        setMetrics(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load dashboard metrics", err);
        setLoading(false);
      });
  }, []);

  if (loading || !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  // Formatting data for Recharts
  const chartData =
    metrics.clicksByDate?.map((item) => ({
      date: item.date,
      clicks: item.count,
    })) || [];

  const pieData =
    metrics.clicksByDevice?.map((item) => ({
      name: item.device || item.deviceType || "Unknown",
      value: item.count,
    })) || [];

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-on-surface">
            Good morning, {user?.name?.split(" ")[0] || "User"}
          </h2>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">
            Here's what's happening with your links today.
          </p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center border border-outline-variant/30 rounded-lg bg-surface-container-low px-2 py-1">
            {["7D", "30D", "All Time"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1 text-label-md font-label-md rounded transition-colors ${
                  timeRange === range
                    ? "bg-surface-container-high text-primary shadow-sm"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-outline-variant/30 rounded-lg text-label-md font-label-md text-primary hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined" data-icon="download">
              download
            </span>
            Export
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Card 1 */}
        <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10 relative overflow-hidden group hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-label-md font-label-md text-on-surface-variant">
              Total Links
            </span>
            <span
              className="material-symbols-outlined text-primary"
              data-icon="link"
            >
              link
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-headline-lg font-headline-lg text-on-surface">
              {metrics.totalLinks.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10 relative overflow-hidden group hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-label-md font-label-md text-on-surface-variant">
              Total Clicks
            </span>
            <span
              className="material-symbols-outlined text-primary"
              data-icon="mouse"
            >
              mouse
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-headline-lg font-headline-lg text-on-surface">
              {metrics.totalClicks.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10 relative overflow-hidden group hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-label-md font-label-md text-on-surface-variant">
              Unique Visitors
            </span>
            <span
              className="material-symbols-outlined text-primary"
              data-icon="person"
            >
              person
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-headline-lg font-headline-lg text-on-surface">
              {metrics.uniqueVisitors?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10 relative overflow-hidden group hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-label-md font-label-md text-on-surface-variant">
              Active Links
            </span>
            <span
              className="material-symbols-outlined text-primary"
              data-icon="link"
            >
              link
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-headline-lg font-headline-lg text-on-surface">
              {metrics.activeLinks?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="bg-surface-container-low rounded-xl p-4 md:p-6 border border-outline-variant/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-headline-md font-headline-md text-on-surface">
            Click Activity
          </h3>
          <button className="text-on-surface-variant hover:text-primary">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>
        <div className="w-full h-72">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#15803d" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#15803d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "var(--color-on-surface-variant)",
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "var(--color-on-surface-variant)",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-surface-container-highest)",
                    borderRadius: "8px",
                    border: "1px solid var(--color-outline-variant)",
                  }}
                  itemStyle={{
                    color: "var(--color-on-surface)",
                    fontWeight: "bold",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#15803d"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorClicks)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-on-surface-variant">
              No click activity data available.
            </div>
          )}
        </div>
      </div>

      {/* Secondary Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performing Links Table */}
        <div className="lg:col-span-2 bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden flex flex-col">
          <div className="p-4 flex justify-between items-center border-b border-outline-variant/10">
            <h3 className="text-label-md font-label-md font-semibold text-on-surface uppercase tracking-wider">
              Top Performing Links
            </h3>
            <a
              className="text-label-sm font-label-sm text-primary hover:underline"
              href="#"
            >
              View All
            </a>
          </div>
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-label-sm font-label-sm text-on-surface-variant uppercase border-b border-outline-variant/5">
                  <th className="p-4 font-medium">Link Name</th>
                  <th className="p-4 font-medium">Short URL</th>
                  <th className="p-4 font-medium text-right">Clicks</th>
                </tr>
              </thead>
              <tbody className="text-body-md font-body-md">
                {metrics.topLinks && metrics.topLinks.length > 0 ? (
                  metrics.topLinks.map((link) => (
                    <tr
                      key={link.id}
                      className="border-b border-outline-variant/5 hover:bg-surface-container-high transition-colors"
                    >
                      <td className="p-4 text-on-surface font-medium flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
                          <span className="material-symbols-outlined text-[14px]">
                            campaign
                          </span>
                        </div>
                        {link.title || link.shortCode}
                      </td>
                      <td className="p-4">
                        <span className="font-code-sm text-code-sm text-primary">
                          {import.meta.env.VITE_APP_URL}/{link.shortCode}
                        </span>
                      </td>
                      <td className="p-4 text-right text-on-surface-variant">
                        {link.clickCount?.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="p-4 text-center text-on-surface-variant"
                    >
                      No top links found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 p-4 flex flex-col">
          <h3 className="text-label-md font-label-md font-semibold text-on-surface uppercase tracking-wider mb-6 border-b border-outline-variant/10 pb-4">
            Device Breakdown
          </h3>
          <div className="flex-grow flex items-center justify-center relative">
            <div className="w-40 h-40">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor:
                          "var(--color-surface-container-highest)",
                        borderRadius: "8px",
                        border: "1px solid var(--color-outline-variant)",
                      }}
                      itemStyle={{ color: "var(--color-on-surface)" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-on-surface-variant text-label-sm">
                  No device data
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            {pieData.map((device, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-label-md font-label-md"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  <span className="text-on-surface">{device.name}</span>
                </div>
                <span className="text-on-surface-variant">{device.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Third Row Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Location Breakdown */}
        <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 p-4 flex flex-col">
          <h3 className="text-label-md font-label-md font-semibold text-on-surface uppercase tracking-wider mb-4 border-b border-outline-variant/10 pb-4">
            Top Locations
          </h3>
          <div className="flex-grow">
            {metrics.clicksByCountry && metrics.clicksByCountry.length > 0 ? (
              <div className="flex flex-col gap-3">
                {metrics.clicksByCountry.slice(0, 5).map((loc, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-label-md font-label-md bg-surface-container-high rounded p-2 px-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                        public
                      </span>
                      <span className="text-on-surface">
                        {loc.country || "Unknown"}
                      </span>
                    </div>
                    <span className="text-primary font-bold">{loc.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-on-surface-variant text-label-sm min-h-[100px]">
                No location data
              </div>
            )}
          </div>
        </div>

        {/* Browser Breakdown */}
        <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 p-4 flex flex-col">
          <h3 className="text-label-md font-label-md font-semibold text-on-surface uppercase tracking-wider mb-4 border-b border-outline-variant/10 pb-4">
            Top Browsers
          </h3>
          <div className="flex-grow">
            {metrics.clicksByBrowser && metrics.clicksByBrowser.length > 0 ? (
              <div className="flex flex-col gap-3">
                {metrics.clicksByBrowser.slice(0, 5).map((browser, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-label-md font-label-md bg-surface-container-high rounded p-2 px-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                        language
                      </span>
                      <span className="text-on-surface">
                        {browser.browser || "Unknown"}
                      </span>
                    </div>
                    <span className="text-primary font-bold">
                      {browser.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-on-surface-variant text-label-sm min-h-[100px]">
                No browser data
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Campaigns Section */}
      <div className="grid grid-cols-1 gap-6 mt-6">
        <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden flex flex-col">
          <div className="p-4 flex justify-between items-center border-b border-outline-variant/10">
            <h3 className="text-label-md font-label-md font-semibold text-on-surface uppercase tracking-wider">
              Top Campaigns
            </h3>
            <button
              onClick={() => navigate('/campaigns')}
              className="text-label-sm font-label-sm text-primary hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-label-sm font-label-sm text-on-surface-variant uppercase border-b border-outline-variant/5">
                  <th className="p-4 font-medium">Campaign Name</th>
                  <th className="p-4 font-medium text-right">Total Clicks</th>
                </tr>
              </thead>
              <tbody className="text-body-md font-body-md">
                {metrics.topCampaigns && metrics.topCampaigns.length > 0 ? (
                  metrics.topCampaigns.map((camp, idx) => (
                    <tr
                      key={idx}
                      onClick={() => navigate(`/links?campaign=${encodeURIComponent(camp.name)}`)}
                      className="border-b border-outline-variant/5 hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      <td className="p-4 text-on-surface font-medium flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
                          <span className="material-symbols-outlined text-[14px]">
                            campaign
                          </span>
                        </div>
                        {camp.name}
                      </td>
                      <td className="p-4 text-right text-on-surface-variant">
                        {camp.clicks?.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      className="p-4 text-center text-on-surface-variant"
                    >
                      No campaign data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

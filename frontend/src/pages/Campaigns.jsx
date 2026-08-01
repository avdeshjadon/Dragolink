/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/axios";
import AsyncButton from "../components/AsyncButton";
import { motion, AnimatePresence } from "framer-motion";
import MotionAlert from "../components/motion/MotionAlert";

export default function Campaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [campaignToDelete, setCampaignToDelete] = useState(null);

  const fetchCampaigns = async () => {
    try {
      const res = await api.get("/campaigns");
      setCampaigns(res.data);
    } catch (error) {
      console.error("Failed to load campaigns", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);



  const confirmDeleteCampaign = async () => {
    if (!campaignToDelete) return;
    try {
      await api.delete(`/campaigns/${campaignToDelete.id}`);
      await fetchCampaigns();
    } catch (error) {
      console.error("Failed to delete campaign", error);
    } finally {
      setCampaignToDelete(null);
    }
  };
  return (
    <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full flex flex-col">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight mb-2">
            Campaigns
          </h2>
          <p className="text-base text-on-surface-variant max-w-2xl">
            Group your links, track overall performance, and manage marketing
            campaigns across multiple channels.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline-variant text-[18px]">
                search
              </span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 bg-surface-container-lowest border border-outline-variant/30 rounded-lg pl-10 pr-4 py-2 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant"
              placeholder="Search campaigns..."
            />
          </div>
          <button
            onClick={() => navigate('/campaigns/create')}
            className="hidden sm:flex bg-primary hover:bg-primary/90 text-white text-label-md font-label-md py-2 px-4 rounded-lg items-center justify-center gap-2 transition-colors shadow-md cursor-pointer whitespace-nowrap shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Create New
          </button>
        </div>
      </div>

      {/* Campaign List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          Loading campaigns...
        </div>
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns
            .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((campaign) => (
            <div
              key={campaign.id}
              onClick={() => navigate(`/links?campaign=${encodeURIComponent(campaign.name)}`)}
              className="bg-surface-container border border-outline-variant/20 rounded-xl p-6 shadow-sm hover:border-primary/30 transition-colors flex flex-col cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined">campaign</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-label-sm font-label-sm text-on-surface-variant mr-2">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/campaigns/${campaign.id}/edit`);
                    }}
                    className="text-on-surface-variant hover:text-primary hover:bg-primary/10 p-1.5 rounded-md transition-colors flex items-center justify-center"
                    title="Edit Campaign"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      edit
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCampaignToDelete(campaign);
                    }}
                    className="text-error hover:bg-error/10 p-1.5 rounded-md transition-colors flex items-center justify-center"
                    title="Delete Campaign"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      delete
                    </span>
                  </button>
                </div>
              </div>
              <h3 className="text-title-lg font-title-lg text-on-surface mb-2">
                {campaign.name}
              </h3>
              <p className="text-body-md font-body-md text-on-surface-variant line-clamp-2 mb-6 flex-1">
                {campaign.description || "No description provided."}
              </p>

              <div className="flex gap-4 pt-4 border-t border-outline-variant/10">
                <div>
                  <div className="text-label-sm font-label-sm text-on-surface-variant">
                    Total Links
                  </div>
                  <div className="text-title-md font-title-md text-on-surface">
                    {campaign.totalLinks?.toLocaleString() || 0}
                  </div>
                </div>
                <div className="border-l border-outline-variant/20 pl-4">
                  <div className="text-label-sm font-label-sm text-on-surface-variant">
                    Total Clicks
                  </div>
                  <div className="text-title-md font-title-md text-primary font-bold">
                    {campaign.totalClicks?.toLocaleString() || 0}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl overflow-hidden shadow-sm flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 text-primary shadow-inner">
            <span className="material-symbols-outlined text-[32px]">
              campaign
            </span>
          </div>
          <h3 className="text-lg font-bold text-on-surface mb-2">
            No campaigns yet
          </h3>
          <p className="text-sm text-on-surface-variant max-w-md text-center mb-6">
            Create your first campaign to group related links and track their
            collective performance over time.
          </p>
          <button
            onClick={() => navigate('/campaigns/create')}
            className="flex items-center gap-2 px-6 py-2.5 bg-surface-container border border-outline-variant/30 rounded-lg text-on-surface font-medium hover:border-primary/50 transition-colors cursor-pointer"
          >
            Get Started
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <MotionAlert
        isOpen={!!campaignToDelete}
        onClose={() => setCampaignToDelete(null)}
        onConfirm={confirmDeleteCampaign}
        title="Delete Campaign?"
        description={
          <>
            Are you sure you want to delete{" "}
            <span className="font-bold text-on-surface">
              {campaignToDelete?.name}
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
    </div>
  );
}

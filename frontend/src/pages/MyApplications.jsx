/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Loader2,
  Search,
  ChevronDown,
  Calendar,
  FileText,
  Monitor,
  GraduationCap,
  DollarSign,
  ExternalLink,
} from "lucide-react";
import { api } from "../lib/axios";

export default function MyApplications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null); // Track which application is expanded

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/applications/me");
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setItems(sorted);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPLIED":
      case "NEW":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-label-sm font-label-sm shadow-[0_0_10px_rgba(16,185,129,0.1)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
            Applied
          </span>
        );
      case "REVIEWING":
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 text-label-sm font-label-sm">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>{" "}
            Under Review
          </span>
        );
      case "HIRED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-label-sm font-label-sm">
            <span className="w-2 h-2 rounded-full bg-primary"></span> Hired
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error/10 text-error border border-error/20 text-label-sm font-label-sm">
            <span className="w-2 h-2 rounded-full bg-error"></span> Not Selected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/30 text-label-sm font-label-sm">
            <span className="w-2 h-2 rounded-full bg-on-surface-variant/50"></span>{" "}
            {status}
          </span>
        );
    }
  };

  const filteredItems = items.filter((item) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.jobRole?.toLowerCase().includes(q) ||
        item.status?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
              Job Applications
            </h1>
            <p className="text-on-surface-variant text-sm mt-0.5">
              Track and view details of your submitted job applications
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface/40 backdrop-blur-md border border-outline-variant/20 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:w-1/2 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
            <input
              type="text"
              placeholder="Search by role or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant/20 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
            />
          </div>
        </div>
        <div className="text-label-sm font-label-sm text-on-surface-variant ml-auto hidden sm:block">
          {filteredItems.length} application{filteredItems.length !== 1 && "s"}{" "}
          total
        </div>
      </div>

      {/* Applications List */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="py-12 flex justify-center bg-surface/50 rounded-2xl border border-outline-variant/20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center bg-surface/50 rounded-2xl border border-outline-variant/20 border-dashed animate-fade-in">
            <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Briefcase className="w-10 h-10 text-on-surface-variant/50" />
            </div>
            <h3 className="text-headline-sm font-headline-sm text-on-surface mb-2">
              No applications found
            </h3>
            <p className="text-body-md text-on-surface-variant text-center max-w-sm mb-6">
              {searchQuery
                ? "No applications match your search criteria."
                : "You haven't submitted any job applications yet."}
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`group bg-surface/60 backdrop-blur-xl border border-outline-variant/20 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden ${expandedId === item.id ? "ring-1 ring-primary/30 shadow-lg" : ""}`}
            >
              {/* Summary Header (Clickable) */}
              <div
                onClick={() => toggleExpand(item.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-surface-container-lowest/50 transition-colors select-none"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div>
                    <h3 className="text-headline-sm font-headline-sm text-on-surface group-hover:text-primary transition-colors">
                      {item.jobRole}
                    </h3>
                    <div className="flex items-center gap-3 text-label-sm text-on-surface-variant mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-on-surface-variant/30"></span>
                      <span>Notice: {item.noticePeriod}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full pt-3 sm:pt-0 border-t sm:border-t-0 border-outline-variant/10">
                  {getStatusBadge(item.status)}
                  <button
                    className={`p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant transition-transform duration-300 ${expandedId === item.id ? "rotate-180 bg-surface-container text-primary" : "cursor-pointer"}`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Expandable Detailed Content */}
              <AnimatePresence>
                {expandedId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="border-t border-outline-variant/10 bg-surface-container-lowest/30"
                  >
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Column 1 */}
                      <div className="space-y-6">
                        {/* Personal Info */}
                        <div>
                          <h4 className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">
                              person
                            </span>{" "}
                            Personal Info
                          </h4>
                          <div className="bg-surface rounded-xl border border-outline-variant/20 p-4 space-y-3 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-label-sm text-on-surface-variant">
                                Full Name
                              </span>
                              <span className="text-body-md font-medium text-on-surface">
                                {item.firstName} {item.lastName}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-label-sm text-on-surface-variant">
                                Email
                              </span>
                              <span className="text-body-md text-on-surface">
                                {item.email}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-label-sm text-on-surface-variant">
                                Phone
                              </span>
                              <span className="text-body-md text-on-surface">
                                {item.contactNumber}
                              </span>
                            </div>
                            <div className="pt-2 flex gap-3">
                              {item.linkedinUrl && (
                                <a
                                  href={item.linkedinUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1.5 text-label-sm bg-surface-container hover:bg-primary/10 hover:text-primary transition-colors px-3 py-1.5 rounded-lg border border-outline-variant/20 w-fit cursor-pointer"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />{" "}
                                  LinkedIn
                                </a>
                              )}
                              {item.resumeUrl && (
                                <a
                                  href={item.resumeUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1.5 text-label-sm bg-surface-container hover:bg-primary/10 hover:text-primary transition-colors px-3 py-1.5 rounded-lg border border-outline-variant/20 w-fit cursor-pointer"
                                >
                                  <FileText className="w-3.5 h-3.5" /> Resume
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Professional & Expected */}
                        <div>
                          <h4 className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" /> Professional
                            Profile
                          </h4>
                          <div className="bg-surface rounded-xl border border-outline-variant/20 p-4 space-y-3 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-label-sm text-on-surface-variant">
                                Experience
                              </span>
                              <span className="text-body-md font-medium text-on-surface">
                                {item.yearsOfExperience} Years
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-label-sm text-on-surface-variant">
                                Notice Period
                              </span>
                              <span className="text-body-md text-on-surface">
                                {item.noticePeriod}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-label-sm text-on-surface-variant">
                                Expected CTC
                              </span>
                              <span className="text-body-md text-on-surface font-code-sm">
                                {item.expectedCtc}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Column 2 */}
                      <div className="space-y-6">
                        {/* Education */}
                        <div>
                          <h4 className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" /> Education
                          </h4>
                          <div className="bg-surface rounded-xl border border-outline-variant/20 p-4 space-y-3 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-label-sm text-on-surface-variant">
                                10th Percentage
                              </span>
                              <span className="text-body-md font-medium text-on-surface">
                                {item.highSchoolPercentage}%
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-label-sm text-on-surface-variant">
                                12th Percentage
                              </span>
                              <span className="text-body-md text-on-surface">
                                {item.seniorSecondaryPercentage}%
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-label-sm text-on-surface-variant">
                                Degree CGPA
                              </span>
                              <span className="text-body-md text-on-surface font-code-sm">
                                {item.degreeCgpa}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Technical Specs */}
                        <div>
                          <h4 className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Monitor className="w-4 h-4" /> Technical & Skills
                          </h4>
                          <div className="bg-surface rounded-xl border border-outline-variant/20 p-4 space-y-3 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-label-sm text-on-surface-variant">
                                Laptop Specs
                              </span>
                              <span className="text-body-sm text-on-surface">
                                {item.laptopOs} | {item.laptopRam} |{" "}
                                {item.laptopProcessor}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-label-sm text-on-surface-variant">
                                Programming
                              </span>
                              <span className="text-body-sm text-on-surface leading-tight">
                                {item.programmingLanguages}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-label-sm text-on-surface-variant">
                                Spoken Languages
                              </span>
                              <span className="text-body-sm text-on-surface leading-tight">
                                {item.spokenLanguages}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Full Width Row: Cover Letter */}
                      {item.coverLetter && (
                        <div className="md:col-span-2">
                          <h4 className="text-label-md font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Cover Letter
                          </h4>
                          <div className="bg-surface rounded-xl border border-outline-variant/20 p-5 shadow-sm text-body-md text-on-surface whitespace-pre-wrap leading-relaxed">
                            {item.coverLetter}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

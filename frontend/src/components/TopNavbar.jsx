/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../lib/axios";
import { motion, AnimatePresence } from "framer-motion";

export default function TopNavbar() {
  const location = useLocation();
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const storedWorkspaceId = localStorage.getItem("workspaceId");
    
    api.get("/team/workspaces").then(res => {
      setWorkspaces(res.data);
      if (res.data.length > 0) {
        if (storedWorkspaceId) {
          const found = res.data.find(w => w.id.toString() === storedWorkspaceId);
          if (found) {
            setActiveWorkspace(found);
          } else {
            setActiveWorkspace(res.data[0]);
            localStorage.removeItem("workspaceId");
          }
        } else {
          setActiveWorkspace(res.data[0]);
        }
      }
    }).catch(err => console.error(err));
  }, []);

  const handleWorkspaceChange = (workspace) => {
    setActiveWorkspace(workspace);
    if (workspace.role === "OWNER") {
      localStorage.removeItem("workspaceId");
    } else {
      localStorage.setItem("workspaceId", workspace.id.toString());
    }
    setIsDropdownOpen(false);
    window.location.reload();
  };

  return (
    <header className="flex-none border-b border-outline-variant/10 bg-surface/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-4 md:px-6 py-4 relative">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-headline-md font-display-lg font-bold text-primary tracking-tight"
          >
            <img
              src="/dragolink.svg"
              alt="Dragolink Logo"
              className="h-8 w-8"
            />
            <span className="hidden sm:inline">DRAGOLINK</span>
          </Link>

          {/* Workspace Switcher */}
          {workspaces.length > 1 && activeWorkspace && (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container transition-all border border-outline-variant/30 shadow-sm hover:shadow"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-container text-on-primary flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
                  {activeWorkspace.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-label-md font-semibold text-on-surface truncate max-w-[150px] leading-tight">
                    {activeWorkspace.name}
                  </span>
                  <span className="text-[9px] font-bold text-primary tracking-widest uppercase leading-tight mt-0.5">
                    {activeWorkspace.role}
                  </span>
                </div>
                <span className={`material-symbols-outlined text-[18px] text-on-surface-variant ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  keyboard_arrow_down
                </span>
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute left-0 mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-xl shadow-surface-variant/20 border border-outline-variant/30 overflow-hidden z-50 backdrop-blur-xl"
                  >
                    <div className="p-3 border-b border-outline-variant/10 bg-surface/50">
                      <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Select Workspace</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-1.5 space-y-0.5">
                      {workspaces.map((workspace) => (
                        <button
                          key={workspace.id}
                          onClick={() => handleWorkspaceChange(workspace)}
                          className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                            activeWorkspace.id === workspace.id 
                              ? "bg-primary/10 text-on-surface" 
                              : "hover:bg-surface-container text-on-surface"
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 shadow-sm transition-colors ${
                              activeWorkspace.id === workspace.id
                                ? "bg-gradient-to-br from-primary to-primary-container text-on-primary"
                                : "bg-surface-variant text-on-surface-variant"
                            }`}>
                              {workspace.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-label-md font-semibold truncate">{workspace.name}</span>
                              <span className={`text-[10px] font-bold tracking-wider uppercase mt-0.5 ${
                                activeWorkspace.id === workspace.id ? "text-primary" : "text-on-surface-variant"
                              }`}>{workspace.role}</span>
                            </div>
                          </div>
                          {activeWorkspace.id === workspace.id && (
                            <span className="material-symbols-outlined text-[18px] shrink-0 text-primary">check_circle</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

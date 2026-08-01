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
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors border border-outline-variant/20"
              >
                <div className="w-5 h-5 rounded-md bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold">
                  {activeWorkspace.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-label-md font-medium text-on-surface truncate max-w-[180px]">
                  {activeWorkspace.name} ({activeWorkspace.role})
                </span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                  unfold_more
                </span>
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/20 overflow-hidden z-50"
                  >
                    <div className="p-2 border-b border-outline-variant/10">
                      <p className="text-label-sm text-on-surface-variant px-2">Workspaces</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-1">
                      {workspaces.map((workspace) => (
                        <button
                          key={workspace.id}
                          onClick={() => handleWorkspaceChange(workspace)}
                          className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                            activeWorkspace.id === workspace.id 
                              ? "bg-secondary-container text-on-secondary-container" 
                              : "hover:bg-surface-container-high text-on-surface"
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-6 h-6 rounded-md bg-surface-variant text-on-surface-variant flex items-center justify-center text-xs font-bold shrink-0">
                              {workspace.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-label-md font-medium truncate">{workspace.name}</span>
                              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">{workspace.role}</span>
                            </div>
                          </div>
                          {activeWorkspace.id === workspace.id && (
                            <span className="material-symbols-outlined text-[16px] shrink-0">check</span>
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

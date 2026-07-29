/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function TopNavbar() {
  const location = useLocation();

  return (
    <header className="flex-none border-b border-outline-variant/10 bg-surface/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-4 md:px-6 py-4 relative">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-headline-md font-display-lg font-bold text-primary tracking-tight"
          >
            <img
              src="/dragolink.svg"
              alt="Dragolink Logo"
              className="h-8 w-8"
            />
            DRAGOLINK
          </Link>
        </div>

        {/* Trailing Actions removed and moved to Sidebar */}
      </div>
    </header>
  );
}

/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import React, { useState } from "react";
import { motion } from "motion/react";
import { TRANSITIONS } from "../constants/motion";

const Loader = () => (
  <svg
    className="animate-spin h-5 w-5 text-current"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function AsyncButton({
  onClick,
  children,
  className = "",
  disabled = false,
  loading: externalLoading,
  type = "button",
  ...props
}) {
  const [internalLoading, setInternalLoading] = useState(false);
  const isPending =
    externalLoading !== undefined ? externalLoading : internalLoading;
  const isDisabled = isPending || disabled;

  const handleClick = async (e) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }

    if (onClick) {
      const result = onClick(e);
      if (result instanceof Promise) {
        setInternalLoading(true);
        try {
          await result;
        } finally {
          setInternalLoading(false);
        }
      }
    }
  };

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      whileHover={isDisabled ? {} : { scale: 1.02 }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      transition={TRANSITIONS.SPRING}
      className={`relative inline-flex items-center justify-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand overflow-hidden ${isPending ? "opacity-90 cursor-wait !pointer-events-none" : ""} ${className}`}
      {...props}
    >
      <span
        className={`flex items-center justify-center gap-2 transition-opacity duration-300 ${isPending ? "opacity-0" : "opacity-100"}`}
      >
        {children}
      </span>

      {isPending && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Loader />
        </span>
      )}
    </motion.button>
  );
}

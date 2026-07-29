/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { TRANSITIONS, VARIANTS } from "../../constants/motion";
import AnimatedTrashIcon from "../icons/AnimatedTrashIcon";

export default function MotionAlert({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  icon,
}) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async (e) => {
    if (onConfirm) {
      const result = onConfirm(e);
      if (result instanceof Promise) {
        setIsConfirming(true);
        try {
          await result;
        } finally {
          setIsConfirming(false);
        }
      }
    }
  };

  const content = (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 110 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={TRANSITIONS.EASE_OUT}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          <motion.div
            variants={VARIANTS.SCALE_UP}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl flex flex-col items-center text-center z-10"
          >
            {icon && (
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDestructive ? "bg-error/10 text-error" : "bg-primary/10 text-primary"}`}
              >
                {icon}
              </div>
            )}

            <h3 className="text-xl font-headline-sm text-on-surface mb-2">
              {title}
            </h3>
            <p className="text-body-md text-on-surface-variant mb-8">
              {description}
            </p>

            <div className="flex gap-3 w-full">
              <button
                onClick={onClose}
                disabled={isConfirming}
                className="flex-1 py-2.5 rounded-lg border border-outline-variant/30 text-on-surface font-label-md hover:bg-surface-container transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                disabled={isConfirming}
                className={`flex-1 py-2.5 rounded-lg font-label-md transition-all duration-300 shadow-sm cursor-pointer flex items-center justify-center gap-2 ${isDestructive ? "bg-error text-white hover:bg-error/90" : "bg-primary text-white hover:bg-primary/90"} disabled:opacity-90 disabled:cursor-wait`}
              >
                {isDestructive && (
                  <AnimatedTrashIcon
                    isDeleting={isConfirming}
                    className="w-5 h-5"
                  />
                )}
                {!isDestructive && isConfirming && (
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
                )}
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}

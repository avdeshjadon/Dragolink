/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import { useState, useEffect } from "react";
import { Ban } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";

export default function SuspendedPopup() {
  const { user } = useAuth();
  const [reason, setReason] = useState(null);
  const [isSuspended, setIsSuspended] = useState(false);

  useEffect(() => {
    // Check initial user state
    if (user && user.isActive === false) {
      setIsSuspended(true);
      setReason(user.suspensionReason || "Violation of terms of service.");
    } else {
      setIsSuspended(false);
    }
  }, [user]);

  useEffect(() => {
    const handleSuspended = (e) => {
      setIsSuspended(true);
      if (e.detail) {
        setReason(e.detail);
      }
    };
    window.addEventListener("account-suspended", handleSuspended);
    return () => window.removeEventListener("account-suspended", handleSuspended);
  }, []);

  return (
    <AnimatePresence>
      {isSuspended && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-surface-light border border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-center"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500"></div>
            
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Ban className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-text-primary mb-2">Account Suspended</h2>
            
            <p className="text-text-secondary mb-6">
              Your account has been suspended by an administrator and you no longer have access to this platform.
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <h3 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Reason for Suspension</h3>
              <p className="text-red-600 font-medium">{reason || "Administrative action."}</p>
            </div>
            
            <p className="text-sm text-text-secondary">
              If you believe this is a mistake, please contact support.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

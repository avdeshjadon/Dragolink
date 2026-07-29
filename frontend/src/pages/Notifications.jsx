/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Campaign Created Successfully",
      message: "Your summer sale marketing campaign is now live.",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: 2,
      type: "info",
      title: "New Feature Available",
      message:
        "You can now view detailed analytics for QR codes in your dashboard.",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      type: "warning",
      title: "API Rate Limit Warning",
      message: "You have reached 80% of your monthly API request quota.",
      time: "Yesterday",
      read: true,
    },
    {
      id: 4,
      type: "success",
      title: "Application Submitted",
      message:
        "Your job application has been successfully submitted and is under review.",
      time: "2 days ago",
      read: true,
    },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case "info":
        return <Info className="w-6 h-6 text-blue-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">
            Notifications
          </h1>
          <p className="text-on-surface-variant">
            Stay updated with your account activity.
          </p>
        </div>
        <button
          onClick={markAllAsRead}
          className="text-primary font-medium hover:text-primary/80 transition-colors bg-primary/10 px-4 py-2 rounded-lg"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-surface rounded-2xl border border-outline-variant/20 p-12 text-center shadow-sm"
            >
              <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-on-surface-variant" />
              </div>
              <h2 className="text-xl font-bold text-on-surface mb-2">
                No new notifications
              </h2>
              <p className="text-on-surface-variant max-w-md mx-auto">
                You're all caught up! Check back later for new updates.
              </p>
            </motion.div>
          ) : (
            notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  transition: { duration: 0.2 },
                }}
                className={`relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 ease-out hover:shadow-md ${notification.read ? "bg-surface border-outline-variant/20" : "bg-surface-container-lowest border-primary/30 shadow-sm"}`}
              >
                {!notification.read && (
                  <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}

                <div className="shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>

                <div className="flex-1 pr-8">
                  <h3
                    className={`font-bold text-lg mb-1 ${notification.read ? "text-on-surface-variant" : "text-on-surface"}`}
                  >
                    {notification.title}
                  </h3>
                  <p className="text-on-surface-variant text-base leading-relaxed mb-2">
                    {notification.message}
                  </p>
                  <span className="text-xs font-medium text-on-surface-variant/70">
                    {notification.time}
                  </span>
                </div>

                <button
                  onClick={() => removeNotification(notification.id)}
                  className="absolute bottom-5 right-5 p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

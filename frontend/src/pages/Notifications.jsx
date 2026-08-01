/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle2, AlertCircle, Info, X, Users, AlertTriangle } from "lucide-react";
import { api } from "../lib/axios";
import AsyncButton from "../components/AsyncButton";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, notifRes] = await Promise.all([
        api.get("/team/invitations").catch(() => ({ data: [] })),
        api.get("/notifications").catch(() => ({ data: [] }))
      ]);
      setInvitations(invRes.data);
      setNotifications(notifRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (id) => {
    try {
      await api.post(`/team/invitations/${id}/accept`);
      setInvitations(prev => prev.filter(inv => inv.id !== id));
      window.location.reload(); 
    } catch (error) {
      console.error("Failed to accept invitation", error);
    }
  };

  const handleDeclineInvitation = async (id) => {
    try {
      await api.post(`/team/invitations/${id}/decline`);
      setInvitations(prev => prev.filter(inv => inv.id !== id));
    } catch (error) {
      console.error("Failed to decline invitation", error);
    }
  };

  const handleAcceptUpgrade = async (memberId, notificationId) => {
    try {
      await api.post(`/team/upgrade/${memberId}/accept`);
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true, actionType: null } : n));
    } catch (error) {
      console.error("Failed to accept upgrade", error);
    }
  };

  const handleDenyUpgrade = async (memberId, notificationId) => {
    try {
      await api.post(`/team/upgrade/${memberId}/deny`);
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true, actionType: null } : n));
    } catch (error) {
      console.error("Failed to deny upgrade", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const removeNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case "error":
        return <AlertCircle className="w-6 h-6 text-error" />;
      case "info":
        return <Info className="w-6 h-6 text-blue-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  const hasItems = notifications.length > 0 || invitations.length > 0;

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
          className="text-primary font-medium hover:text-primary/80 transition-colors bg-primary/10 px-4 py-2 rounded-lg cursor-pointer"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-on-surface-variant">Loading...</div>
        ) : (
          <AnimatePresence>
            {!hasItems ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 flex flex-col items-center justify-center bg-surface/50 rounded-2xl border border-outline-variant/20 border-dashed shadow-sm mt-4"
              >
                <img 
                  src="/images/no_result_found.svg" 
                  alt="No notifications found" 
                  className="w-48 h-48 mb-2 opacity-90 object-contain drop-shadow-sm"
                />
                <h3 className="text-headline-sm font-headline-sm text-on-surface mb-2 mt-4">
                  No new notifications
                </h3>
                <p className="text-body-md text-on-surface-variant text-center max-w-sm mb-6">
                  You're all caught up! Check back later for new updates.
                </p>
              </motion.div>
            ) : (
              <>
                {/* Invitations */}
                {invitations.map((inv) => (
                  <motion.div
                    key={`inv-${inv.id}`}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                      transition: { duration: 0.2 },
                    }}
                    className="relative flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl border transition-all duration-300 ease-out bg-primary/5 border-primary/30 shadow-sm"
                  >
                    <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-primary animate-pulse" />
                    
                    <div className="shrink-0 mt-1 sm:mt-0 bg-primary/20 p-2 rounded-full text-primary">
                      <Users className="w-6 h-6" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1 text-on-surface">
                        Team Invitation
                      </h3>
                      <p className="text-on-surface-variant text-base leading-relaxed mb-2">
                        You have been invited to join <strong>{inv.name || 'a team'}</strong> as {inv.role}.
                      </p>
                      <span className="text-xs font-medium text-primary">
                        Action Required
                      </span>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                      <AsyncButton
                        onClick={() => handleAcceptInvitation(inv.id)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-primary text-white text-label-md font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                      >
                        Accept
                      </AsyncButton>
                      <AsyncButton
                        onClick={() => handleDeclineInvitation(inv.id)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-surface text-on-surface-variant border border-outline-variant/30 text-label-md font-medium rounded-lg hover:bg-surface-container transition-colors"
                      >
                        Decline
                      </AsyncButton>
                    </div>
                  </motion.div>
                ))}

                {/* Standard Notifications */}
                {notifications.map((notification) => (
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
                      
                      {notification.actionType === "UPGRADE_REQUEST" && !notification.read && (
                        <div className="flex gap-2 w-full sm:w-auto mt-3 mb-2">
                          <AsyncButton
                            onClick={() => handleAcceptUpgrade(notification.referenceId, notification.id)}
                            className="px-4 py-1.5 bg-primary text-white text-label-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                          >
                            Accept
                          </AsyncButton>
                          <AsyncButton
                            onClick={() => handleDenyUpgrade(notification.referenceId, notification.id)}
                            className="px-4 py-1.5 bg-surface text-on-surface-variant border border-outline-variant/30 text-label-sm font-medium rounded-lg hover:bg-surface-container transition-colors"
                          >
                            Deny
                          </AsyncButton>
                        </div>
                      )}
                      
                      <span className="text-xs font-medium text-on-surface-variant/70">
                        {notification.time}
                      </span>
                    </div>

                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="absolute bottom-5 right-5 p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-full transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

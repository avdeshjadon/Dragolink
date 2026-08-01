/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import MotionPage from "./motion/MotionPage";
import { api } from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import TopNavbar from "./TopNavbar";
import RoleUpgradeModal from "./RoleUpgradeModal";

export default function DashboardLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navigation, setNavigation] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [pendingUpgrades, setPendingUpgrades] = useState([]);
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    api
      .get("/public/navigation?position=DASHBOARD_SIDEBAR")
      .then((res) =>
        setNavigation(
          res.data.filter(
            (item) => item.label !== "QR Codes" && item.label !== "Admin",
          ),
        ),
      )
      .catch((err) => console.error("Failed to load sidebar navigation", err));
      
    // Fetch pending invitations
    api.get("/team/invitations")
      .then(res => setPendingInvitations(res.data))
      .catch(err => console.error("Failed to fetch invitations", err));
      
    // Fetch team to find pending upgrades
    api.get("/team")
      .then(res => {
        const upgrades = res.data.filter(member => member.upgradeRequestedRole);
        setPendingUpgrades(upgrades);
      })
      .catch(err => console.error("Failed to fetch team", err));
  }, []);

  const handleAcceptInvitation = async (id) => {
    try {
      await api.post(`/team/invitations/${id}/accept`);
      setPendingInvitations(prev => prev.filter(inv => inv.id !== id));
      window.location.reload(); // Reload to refresh workspaces
    } catch (error) {
      console.error("Failed to accept invitation", error);
    }
  };

  const handleDeclineInvitation = async (id) => {
    try {
      await api.post(`/team/invitations/${id}/decline`);
      setPendingInvitations(prev => prev.filter(inv => inv.id !== id));
    } catch (error) {
      console.error("Failed to decline invitation", error);
    }
  };

  const handleAcceptUpgrade = async (id) => {
    try {
      await api.post(`/team/upgrade/${id}/accept`);
      setPendingUpgrades(prev => prev.filter(member => member.id !== id));
    } catch (error) {
      console.error("Failed to accept upgrade", error);
    }
  };

  const handleDenyUpgrade = async (id) => {
    try {
      await api.post(`/team/upgrade/${id}/deny`);
      setPendingUpgrades(prev => prev.filter(member => member.id !== id));
    } catch (error) {
      console.error("Failed to deny upgrade", error);
    }
  };

  const SidebarContent = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    return (
      <nav className="flex h-full flex-col bg-surface-container-low w-64">
        <div className="flex-1 overflow-y-auto p-4 flex flex-col">
          {/* CTA */}
          <div className="relative mt-2 mb-8 w-full">
            <button
              onClick={() => setIsCreateOpen(!isCreateOpen)}
              className="w-full py-2 px-4 bg-primary text-white font-label-md text-label-md rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] shadow-sm border border-primary/20"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Create New
              <span
                className="material-symbols-outlined text-[18px] ml-1 transition-transform"
                style={{ transform: isCreateOpen ? "rotate(180deg)" : "none" }}
              >
                expand_more
              </span>
            </button>

            <AnimatePresence>
              {isCreateOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute left-0 top-full mt-2 w-full bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/20 overflow-hidden z-50 flex flex-col p-2"
                >
                  <Link
                    to="/create"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-4 py-2 flex items-center gap-3 text-label-md font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors rounded-lg"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      link
                    </span>
                    Shorten Link
                  </Link>
                  <Link
                    to="/qr"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-4 py-2 flex items-center gap-3 text-label-md font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors rounded-lg"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      qr_code_2
                    </span>
                    QR Code
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 space-y-2">
            {navigation.map((item) => {
              // Special handling for admin routes to redirect to DragoAdmin app
              if (item.url.startsWith("/admin")) {
                return (
                  <a
                    key={item.id}
                    href={`http://localhost:5174${item.url}`}
                    className="flex items-center gap-4 text-on-surface-variant hover:bg-surface-container-high rounded-lg px-4 py-2 transition-all duration-200"
                  >
                    <span className="material-symbols-outlined">
                      {item.badgeText}
                    </span>
                    <span className="font-label-md text-label-md">
                      {item.label}
                    </span>
                  </a>
                );
              }

              // Special active state matching Stitch design
              const isActive =
                location.pathname.startsWith(item.url) &&
                (item.url !== "/dashboard" ||
                  location.pathname === "/dashboard");

              if (isActive) {
                return (
                  <Link
                    key={item.id}
                    to={item.url}
                    className="flex items-center gap-4 bg-secondary-container text-on-secondary-container rounded-lg px-4 py-2 shadow-sm transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined icon-fill">
                      {item.badgeText}
                    </span>
                    <span className="font-label-md text-label-md font-medium">
                      {item.label}
                    </span>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.id}
                  to={item.url}
                  className="flex items-center gap-4 text-on-surface-variant hover:bg-surface-container-high rounded-lg px-4 py-2 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined">
                    {item.badgeText}
                  </span>
                  <span className="font-label-md text-label-md">
                    {item.label}
                  </span>
                </Link>
              );
            })}

            {/* Added items from TopNavbar */}
            <Link
              to="/notifications"
              className={`flex items-center gap-4 rounded-lg px-4 py-2 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] ${location.pathname.startsWith("/notifications") ? "bg-secondary-container text-on-secondary-container shadow-sm" : "text-on-surface-variant hover:bg-surface-container-high"}`}
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="font-label-md text-label-md">Notification</span>
            </Link>
            <Link
              to="/settings/profile"
              className={`flex items-center gap-4 rounded-lg px-4 py-2 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] ${location.pathname.startsWith("/settings") ? "bg-secondary-container text-on-secondary-container shadow-sm" : "text-on-surface-variant hover:bg-surface-container-high"}`}
            >
              <span className="material-symbols-outlined">settings</span>
              <span className="font-label-md text-label-md">Settings</span>
            </Link>
          </div>
        </div>

        {/* Footer Links (Fixed at bottom) */}
        <div className="p-4 space-y-2 border-t border-outline-variant/10 bg-surface-container-low z-10">
          <Link
            to="/help"
            className="flex items-center gap-4 text-on-surface-variant hover:bg-surface-container-high rounded-lg px-4 py-2 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="material-symbols-outlined">help</span>
            <span className="font-label-md text-label-md">Help Center</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 text-on-surface-variant hover:bg-surface-container-high rounded-lg px-4 py-2 transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md text-label-md">Log Out</span>
          </button>
        </div>
      </nav>
    );
  };

  return (
    <div className="antialiased min-h-screen bg-background flex flex-col">
      <TopNavbar />
      {/* Desktop Sidebar - Completely Separated & Fixed */}
      <aside className="hidden md:flex flex-col w-64 fixed top-[65px] bottom-0 left-0 z-40 border-r border-outline-variant/10 bg-surface-container-low">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Backdrop & Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 md:hidden border-r border-outline-variant/10 bg-surface-container-low"
            >
              {/* Mobile Header with close button */}
              <div className="flex items-center justify-between p-4 border-b border-outline-variant/10">
                <span className="font-headline-md font-bold text-primary">
                  Menu
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-on-surface-variant p-1"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full md:pl-64">
        {pendingInvitations.length > 0 && (
          <div className="bg-primary/10 border-b border-primary/20 p-3 px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-xl">group_add</span>
              <span className="text-label-md font-medium text-on-surface">
                You have {pendingInvitations.length} pending team invitation(s).
              </span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleAcceptInvitation(pendingInvitations[0].id)}
                className="flex-1 sm:flex-none px-4 py-1.5 bg-primary text-white text-label-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Accept {pendingInvitations[0].name ? `from ${pendingInvitations[0].name}` : ''}
              </button>
              <button
                onClick={() => handleDeclineInvitation(pendingInvitations[0].id)}
                className="flex-1 sm:flex-none px-4 py-1.5 bg-surface text-on-surface-variant border border-outline-variant/30 text-label-sm font-medium rounded-lg hover:bg-surface-container transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        )}

        {pendingUpgrades.length > 0 && (
          <div className="bg-secondary/10 border-b border-secondary/20 p-3 px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-xl">upgrade</span>
              <span className="text-label-md font-medium text-on-surface">
                {pendingUpgrades[0].email} requested a promotion to {pendingUpgrades[0].upgradeRequestedRole}.
              </span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleAcceptUpgrade(pendingUpgrades[0].id)}
                className="flex-1 sm:flex-none px-4 py-1.5 bg-secondary text-white text-label-sm font-medium rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => handleDenyUpgrade(pendingUpgrades[0].id)}
                className="flex-1 sm:flex-none px-4 py-1.5 bg-surface text-on-surface-variant border border-outline-variant/30 text-label-sm font-medium rounded-lg hover:bg-surface-container transition-colors"
              >
                Deny
              </button>
            </div>
          </div>
        )}

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden px-4 py-3 border-b border-outline-variant/10 flex items-center bg-surface-container-lowest">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-on-surface-variant flex items-center gap-2 text-label-md font-label-md"
          >
            <span className="material-symbols-outlined">menu</span> Open Menu
          </button>
        </div>

        {/* Page Canvas */}
        <div className="p-4 md:p-6 lg:p-10 w-full max-w-7xl mx-auto">
          <MotionPage key={location.pathname}>
            <Outlet />
          </MotionPage>
        </div>
      </main>
      <RoleUpgradeModal />
    </div>
  );
}

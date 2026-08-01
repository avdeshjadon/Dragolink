import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, X, ChevronDown } from "lucide-react";
import { api } from "../lib/axios";
import AsyncButton from "./AsyncButton";
import toast from "react-hot-toast";

const RoleUpgradeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [requestedRole, setRequestedRole] = useState("MEMBER");
  const [reason, setReason] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("viewer-access-denied", handleOpen);
    return () => window.removeEventListener("viewer-access-denied", handleOpen);
  }, []);

  const handleSubmit = async () => {
    try {
      await api.post("/team/request-upgrade", {
        requestedRole,
        reason
      });
      toast.success("Upgrade request sent to workspace owner!");
      setIsOpen(false);
      setReason("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-surface border border-surface-variant rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-surface-variant bg-surface-variant/20 relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-on-surface bg-surface-variant/30 hover:bg-surface-variant/50 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4">
                <ShieldAlert className="w-6 h-6 text-error" />
              </div>
              <h2 className="text-xl font-bold text-on-surface">Viewer Access Denied</h2>
              <p className="text-sm text-on-surface-variant mt-1">
                You currently have "Viewer" permissions in this workspace. You cannot create, edit, or delete resources.
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <p className="text-sm text-on-surface">
                  Need more access? You can request the workspace owner to upgrade your role to <strong>Member</strong> or <strong>Admin</strong>.
                </p>
              </div>

              <div className="space-y-4">
                {/* Role Selection Dropdown */}
                <div className="relative">
                  <label className="block text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-2">
                    Request Role
                  </label>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-surface-variant/30 border border-surface-variant rounded-xl text-sm text-on-surface hover:border-primary/50 transition-colors"
                  >
                    <span>{requestedRole === "ADMIN" ? "Admin (Full Access)" : "Member (Write Access)"}</span>
                    <ChevronDown className="w-4 h-4 text-on-surface-variant" />
                  </button>
                  
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-surface border border-surface-variant rounded-xl shadow-xl z-10 overflow-hidden"
                      >
                        <button
                          onClick={() => { setRequestedRole("MEMBER"); setIsDropdownOpen(false); }}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-surface-variant/50 transition-colors"
                        >
                          <div className="font-medium text-on-surface">Member</div>
                          <div className="text-xs text-on-surface-variant">Can create and edit links/campaigns</div>
                        </button>
                        <button
                          onClick={() => { setRequestedRole("ADMIN"); setIsDropdownOpen(false); }}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-surface-variant/50 transition-colors border-t border-surface-variant"
                        >
                          <div className="font-medium text-on-surface">Admin</div>
                          <div className="text-xs text-on-surface-variant">Full access including team management</div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Reason Input */}
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-2">
                    Reason (Optional)
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="E.g. I need to edit campaigns for the new launch."
                    className="w-full px-4 py-3 bg-surface-variant/30 border border-surface-variant rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none h-24 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-surface-variant bg-surface-variant/10 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 rounded-full transition-colors"
              >
                Cancel
              </button>
              <AsyncButton
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-primary text-on-primary text-sm font-medium rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
              >
                Send Request
              </AsyncButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RoleUpgradeModal;

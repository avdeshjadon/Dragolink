import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CampaignSelect({
  campaigns,
  value,
  onChange,
  placeholder = "Select or type a campaign...",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredCampaigns = campaigns.filter((camp) =>
    camp.name.toLowerCase().includes((value || "").toLowerCase()),
  );

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-4 pr-10 py-2.5 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body-sm text-body-sm"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) inputRef.current?.focus();
          }}
          className="absolute inset-y-0 right-0 px-3 flex items-center text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none cursor-pointer"
        >
          <span
            className={`material-symbols-outlined transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            arrow_drop_down
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-surface-container-high border border-outline-variant/30 rounded-lg shadow-xl overflow-hidden"
          >
            <ul className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((camp) => (
                  <li
                    key={camp.id}
                    onClick={() => {
                      onChange(camp.name);
                      setIsOpen(false);
                    }}
                    className="px-4 py-2.5 hover:bg-surface-container-highest cursor-pointer text-body-sm text-on-surface transition-colors"
                  >
                    {camp.name}
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-body-sm text-on-surface-variant text-center">
                  {value ? `Create new: "${value}"` : "No campaigns found"}
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

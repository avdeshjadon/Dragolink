import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function TopNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isSettingsActive = location.pathname.startsWith('/settings');
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const createRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (createRef.current && !createRef.current.contains(event.target)) {
        setIsCreateOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="flex-none border-b border-outline-variant/10 bg-surface/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-4 md:px-6 py-4 relative">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center gap-2 text-headline-md font-display-lg font-bold text-primary tracking-tight">
            <img src="/dragolink.svg" alt="Dragolink Logo" className="h-8 w-8" />
            DRAGOLINK
          </Link>
        </div>
        
        {/* Trailing Actions */}
        <div className="flex items-center gap-4">
          
          <div className="flex items-center gap-2">
            <button className="p-1 text-on-surface-variant hover:text-primary transition-colors duration-200 active:scale-95">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
          
          <div className="h-6 w-[1px] bg-outline-variant/30 mx-1 hidden lg:block"></div>
          
          <button className="hidden lg:block text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors">Upgrade</button>
          
          {/* Create Link Dropdown */}
          <div className="relative hidden sm:block shrink-0" ref={createRef}>
            <button 
              onClick={() => setIsCreateOpen(!isCreateOpen)}
              className="flex bg-primary-container text-on-primary-container font-label-md text-label-md px-4 py-2 rounded-md hover:bg-primary hover:text-white transition-colors shadow-sm active:scale-95 border border-primary-fixed/20 items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Create Link
              <span className="material-symbols-outlined text-[18px] ml-1 transition-transform" style={{ transform: isCreateOpen ? 'rotate(180deg)' : 'none' }}>expand_more</span>
            </button>

            <AnimatePresence>
              {isCreateOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-56 bg-surface-container-low rounded-xl shadow-lg border border-outline-variant/20 overflow-hidden z-50 flex flex-col p-2"
                >
                  <Link 
                    to="/create" 
                    onClick={() => setIsCreateOpen(false)} 
                    className="px-4 py-3 flex items-center gap-3 text-label-md font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors rounded-lg"
                  >
                    <span className="material-symbols-outlined text-[20px]">link</span>
                    Shorten Link
                  </Link>
                  <Link 
                    to="/qr" 
                    onClick={() => setIsCreateOpen(false)} 
                    className="px-4 py-3 flex items-center gap-3 text-label-md font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors rounded-lg"
                  >
                    <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                    Generate QR Code
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Profile Dropdown */}
          <div className="relative ml-2 shrink-0" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-9 h-9 rounded-full overflow-hidden border-2 transition-colors duration-200 focus:outline-none flex items-center justify-center cursor-pointer"
              style={{ borderColor: isProfileOpen ? 'var(--color-primary)' : 'transparent' }}
            >
              <img 
                alt="User profile photo" 
                className="w-full h-full object-cover" 
                src={user?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCs8b9_EA4cNnC4ibfJPBvx_Noxbb5A_QZ0trnV4HBq9-OgQHSzE2HeP8gArb2J7IAzuulLlBmANYFDgornGGqn0qDCbve8zuuXcdxE_CyB1CAsrsy7824hYoBFe7I_KdCH4L5WJC8i-pI-hRVCm-rypSTAk8yiW0ZfirF0dfc6Odbzp_mWg9lUdqdIyHUsCy7uJVk2HcsnK_w2Pa7Db3PzqqekDFY4mmKMIXE4tXbSkvv58McRUzHqFxIzRFNjfEwHjJ1iOws9pOvR"}
              />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-64 bg-surface-container-low rounded-xl shadow-lg border border-outline-variant/20 overflow-hidden z-50 flex flex-col"
                >
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-outline-variant/10 bg-surface-container-lowest">
                    <p className="font-bold text-on-surface text-label-md truncate">{user?.name || 'Dragolink User'}</p>
                    <p className="text-on-surface-variant text-label-sm truncate">{user?.email || 'user@example.com'}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2 flex flex-col">
                    <Link to="/settings/profile" onClick={() => setIsProfileOpen(false)} className="px-4 py-2 flex items-center gap-3 text-label-md font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
                      <span className="material-symbols-outlined text-[20px]">person</span>
                      My Profile
                    </Link>
                    <Link to="/settings/security" onClick={() => setIsProfileOpen(false)} className="px-4 py-2 flex items-center gap-3 text-label-md font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
                      <span className="material-symbols-outlined text-[20px]">security</span>
                      Security Settings
                    </Link>
                    <Link to="/apikeys" onClick={() => setIsProfileOpen(false)} className="px-4 py-2 flex items-center gap-3 text-label-md font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
                      <span className="material-symbols-outlined text-[20px]">key</span>
                      API Keys
                    </Link>
                    <div className="my-1 border-t border-outline-variant/10"></div>
                    <Link to="/help" onClick={() => setIsProfileOpen(false)} className="px-4 py-2 flex items-center gap-3 text-label-md font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
                      <span className="material-symbols-outlined text-[20px]">help</span>
                      Help Center
                    </Link>
                    <button onClick={handleLogout} className="w-full px-4 py-2 flex items-center gap-3 text-label-md font-medium text-error hover:bg-error/10 transition-colors text-left cursor-pointer">
                      <span className="material-symbols-outlined text-[20px]">logout</span>
                      Log out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
        </div>
      </div>
    </header>
  );
}

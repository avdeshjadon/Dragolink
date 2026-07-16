import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import TopNavbar from './TopNavbar';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { name: 'Analytics', href: '/analytics', icon: 'analytics' },
    { name: 'Links', href: '/links', icon: 'link' },
    { name: 'QR Codes', href: '/qr', icon: 'qr_code' },
    { name: 'Campaigns', href: '/campaigns', icon: 'campaign' },
    { name: 'Team', href: '/team', icon: 'group' },
    { name: 'API Keys', href: '/api-keys', icon: 'vpn_key' },
    { name: 'Admin', href: '/admin/overview', icon: 'admin_panel_settings' },
  ];

  const SidebarContent = () => (
    <nav className="flex h-full flex-col p-4 bg-surface-container-low w-64 overflow-y-auto">
      {/* CTA */}
      <Link to="/create" className="mt-2 mb-8 w-full py-2 px-4 bg-primary-container text-on-primary-container font-label-md text-label-md rounded-lg flex items-center justify-center gap-2 hover:bg-primary transition-colors duration-200 shadow-sm border border-primary-fixed/20">
        <span className="material-symbols-outlined text-[18px]">add</span>
        New Campaign
      </Link>

      {/* Navigation Links */}
      <div className="flex-1 space-y-2">
        {navigation.map(item => {
          // Special active state matching Stitch design
          const isActive = location.pathname.startsWith(item.href) && (item.href !== '/dashboard' || location.pathname === '/dashboard');
          
          if (isActive) {
            return (
              <Link key={item.name} to={item.href} className="flex items-center gap-4 bg-secondary-container text-on-secondary-container rounded-lg px-4 py-2 shadow-sm translate-x-1 transition-transform duration-200">
                <span className="material-symbols-outlined icon-fill">{item.icon}</span>
                <span className="font-label-md text-label-md font-medium">{item.name}</span>
              </Link>
            );
          }

          return (
            <Link key={item.name} to={item.href} className="flex items-center gap-4 text-on-surface-variant hover:bg-surface-container-high rounded-lg px-4 py-2 transition-all duration-200">
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-label-md text-label-md">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer Links */}
      <div className="mt-auto space-y-2 pt-4 border-t border-outline-variant/10">
        <a href="#" className="flex items-center gap-4 text-on-surface-variant hover:bg-surface-container-high rounded-lg px-4 py-2 transition-all duration-200">
          <span className="material-symbols-outlined">help</span>
          <span className="font-label-md text-label-md">Help Center</span>
        </a>
        <button onClick={logout} className="w-full flex items-center gap-4 text-on-surface-variant hover:bg-surface-container-high rounded-lg px-4 py-2 transition-all duration-200">
          <span className="material-symbols-outlined">logout</span>
          <span className="font-label-md text-label-md">Log Out</span>
        </button>
      </div>
    </nav>
  );

  return (
    <div className="antialiased min-h-screen flex flex-col font-body-md text-body-md overflow-x-hidden bg-background">
      <TopNavbar />
      
      <div className="flex-1 flex relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex flex-col w-64 shrink-0 border-r border-outline-variant/10">
          <SidebarContent />
        </div>

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
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-64 md:hidden border-r border-outline-variant/10 bg-surface-container-low"
              >
                {/* Mobile Header with close button */}
                <div className="flex items-center justify-between p-4 border-b border-outline-variant/10">
                  <span className="font-headline-md font-bold text-primary">Menu</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-on-surface-variant p-1">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-h-screen relative w-full overflow-hidden">
          
          {/* Mobile Menu Toggle Button (Visible only on mobile, since TopNavbar might not have a hamburger depending on screen size) */}
          <div className="md:hidden px-4 py-3 border-b border-outline-variant/10 flex items-center bg-surface-container-lowest">
            <button onClick={() => setMobileMenuOpen(true)} className="text-on-surface-variant flex items-center gap-2 text-label-md font-label-md">
              <span className="material-symbols-outlined">menu</span> Open Menu
            </button>
          </div>

          {/* Page Canvas */}
          <div className="flex-1 p-4 md:p-6 lg:p-10 w-full max-w-7xl mx-auto">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.99 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </div>
          
        </main>
      </div>
    </div>
  );
}

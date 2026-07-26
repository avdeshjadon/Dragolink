import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { api } from '../lib/axios';
import TopNavbar from './TopNavbar';
import MotionPage from './motion/MotionPage';

export default function SettingsLayout() {
  const location = useLocation();

  const [navItems, setNavItems] = useState([]);

  useEffect(() => {
    api.get('/public/navigation?position=SETTINGS_SIDEBAR')
      .then(res => setNavItems(res.data))
      .catch(err => console.error("Failed to load settings navigation", err));
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <TopNavbar />

      {/* Main Content Layout */}
      <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Local Sidebar Navigation */}
        <aside className="w-full md:w-64 flex flex-col gap-2 shrink-0">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 px-1">Settings</h2>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.url) && item.url !== '#';
              return (
                <Link
                  key={item.id}
                  to={item.url}
                  className={`flex items-center gap-3 font-label-md text-label-md rounded-lg px-4 py-3 transition-colors duration-200 ${
                    isActive
                      ? 'bg-surface-container text-primary border-l-2 border-primary'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <span 
                    className="material-symbols-outlined text-[20px]" 
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {item.badgeText}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Dynamic Route Content */}
        <section className="flex-1">
          <MotionPage key={location.pathname}>
            <Outlet />
          </MotionPage>
        </section>

      </main>
    </div>
  );
}

import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import TopNavbar from './TopNavbar';

export default function SettingsLayout() {
  const location = useLocation();

  const navItems = [
    { name: 'Profile', path: '/settings/profile', icon: 'person' },
    { name: 'Security', path: '/settings/security', icon: 'lock' },
    { name: 'Appearance', path: '#', icon: 'palette' },
    { name: 'Notifications', path: '#', icon: 'notifications_active' },
    { name: 'Billing', path: '#', icon: 'credit_card' },
    { name: 'API Keys', path: '#', icon: 'api' },
  ];

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
              const isActive = location.pathname.startsWith(item.path) && item.path !== '#';
              return (
                <Link
                  key={item.name}
                  to={item.path}
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
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Dynamic Route Content */}
        <section className="flex-1">
          <Outlet />
        </section>

      </main>
    </div>
  );
}

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminTabs() {
  const location = useLocation();

  const tabs = [
    { name: 'Overview', path: '/admin/overview' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Domains', path: '/admin/domains' },
    { name: 'Billing', path: '/admin/billing' },
  ];

  return (
    <div className="mb-8 border-b border-outline-variant/10">
      <nav className="flex space-x-8">
        {tabs.map((tab) => {
          const isActive = location.pathname.startsWith(tab.path);
          return (
            <Link
              key={tab.name}
              to={tab.path}
              className={`pb-4 text-label-md font-label-md transition-colors relative ${
                isActive 
                  ? 'text-primary' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab.name}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-t-full"></div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

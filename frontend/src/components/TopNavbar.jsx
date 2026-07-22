import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../lib/axios';

export default function TopNavbar() {
  const location = useLocation();
  const isSettingsActive = location.pathname.startsWith('/settings');
  const [links, setLinks] = useState([]);

  useEffect(() => {
    api.get('/public/navigation?position=PUBLIC_HEADER')
      .then(res => {
        setLinks(res.data);
      })
      .catch(err => {
        console.error("Failed to load top navbar navigation", err);
      });
  }, []);

  return (
    <header className="flex-none border-b border-outline-variant/10 bg-surface/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-4 md:px-6 py-4 relative">
        {/* Logo & Navigation */}
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center gap-2 text-headline-md font-display-lg font-bold text-primary tracking-tight">
            <img src="/dragolink.svg" alt="Dragolink Logo" className="h-8 w-8" />
            DRAGOLINK
          </Link>
        </div>
        
        <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-4">
          {links.map((link) => (
            <Link 
              key={link.id}
              to={link.url} 
              className="text-on-surface-variant font-medium font-label-md text-label-md hover:text-primary transition-colors duration-200"
              {...(link.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        {/* Trailing Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center border border-outline-variant/30 rounded-full px-2 py-1 bg-surface-container-lowest focus-within:border-primary transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant mr-1" style={{ fontSize: '18px' }}>search</span>
            <input className="bg-transparent border-none text-label-sm font-label-sm text-on-surface focus:outline-none w-32 placeholder:text-on-surface-variant/50" placeholder="Search..." type="text"/>
            <span className="font-code-sm text-code-sm text-on-surface-variant/50 bg-surface-variant/30 px-1 rounded ml-1">⌘K</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-1 text-on-surface-variant hover:text-primary transition-colors duration-200 active:scale-95 transition-transform duration-150">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <Link 
              to="/settings/profile" 
              className={`p-1 transition-colors duration-200 active:scale-95 transition-transform duration-150 relative block ${isSettingsActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
            >
              <span className="material-symbols-outlined" style={isSettingsActive ? { fontVariationSettings: "'FILL' 1" } : {}}>settings</span>
              {isSettingsActive && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
              )}
            </Link>
            <button className="p-1 text-on-surface-variant hover:text-primary transition-colors duration-200 active:scale-95 transition-transform duration-150">
              <span className="material-symbols-outlined">dark_mode</span>
            </button>
          </div>
          
          <div className="h-6 w-[1px] bg-outline-variant/30 mx-1 hidden lg:block"></div>
          
          <button className="hidden lg:block text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors">Upgrade</button>
          <Link to="/create" className="hidden sm:flex bg-primary-container text-on-primary-container font-label-md text-label-md px-4 py-2 rounded-md hover:bg-primary hover:text-white transition-colors shadow-sm active:scale-95 border border-primary-fixed/20 items-center gap-2">
            Create Link
          </Link>
          
          <div className="ml-2 w-8 h-8 rounded-full overflow-hidden border border-outline-variant/20 shrink-0">
            <img alt="User profile photo" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs8b9_EA4cNnC4ibfJPBvx_Noxbb5A_QZ0trnV4HBq9-OgQHSzE2HeP8gArb2J7IAzuulLlBmANYFDgornGGqn0qDCbve8zuuXcdxE_CyB1CAsrsy7824hYoBFe7I_KdCH4L5WJC8i-pI-hRVCm-rypSTAk8yiW0ZfirF0dfc6Odbzp_mWg9lUdqdIyHUsCy7uJVk2HcsnK_w2Pa7Db3PzqqekDFY4mmKMIXE4tXbSkvv58McRUzHqFxIzRFNjfEwHjJ1iOws9pOvR"/>
          </div>
        </div>
      </div>
    </header>
  );
}

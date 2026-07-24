import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../lib/axios';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard } from 'lucide-react';

export default function PublicNavbar() {
  const location = useLocation();
  const [links, setLinks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/public/navigation?position=PUBLIC_HEADER')
      .then(res => {
        setLinks(res.data);
      })
      .catch(err => {
        console.error("Failed to load header navigation", err);
      });
  }, []);

  const isCurrent = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border-light bg-surface-light/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/dragolink.svg" alt="Dragolink Logo" className="h-8 w-8" />
            <span className="text-xl font-bold text-[#16803C] tracking-tight">Dragolink</span>
          </Link>
        </div>
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-6 text-sm font-medium">
            {links.map((link) => (
              <Link 
                key={link.id}
                to={link.url} 
                className={`transition-colors ${isCurrent(link.url) ? 'text-brand' : 'text-text-secondary hover:text-brand'}`}
                {...(link.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {link.label}
              </Link>
            ))}
          </div>
        <div className="flex items-center justify-end gap-4">
          {user ? (
            <Link to="/dashboard">
              <Button size="sm" className="flex items-center gap-2 cursor-pointer shadow-md bg-brand text-white hover:bg-brand-dark transition-colors">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-brand transition-colors">
                Log in
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

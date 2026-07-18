import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';

export default function PublicNavbar() {
  const location = useLocation();

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
            <Link 
              to="/product" 
              className={`transition-colors ${isCurrent('/product') ? 'text-brand' : 'text-text-secondary hover:text-brand'}`}
            >
              Product
            </Link>
            <Link 
              to="/features" 
              className={`transition-colors ${isCurrent('/features') ? 'text-brand' : 'text-text-secondary hover:text-brand'}`}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className={`transition-colors ${isCurrent('/pricing') ? 'text-brand' : 'text-text-secondary hover:text-brand'}`}
            >
              Pricing
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors ${isCurrent('/about') ? 'text-brand' : 'text-text-secondary hover:text-brand'}`}
            >
              About Us
            </Link>
          </div>
        <div className="flex items-center justify-end gap-4">
          <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-brand transition-colors">
            Log in
          </Link>
          <Link to="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

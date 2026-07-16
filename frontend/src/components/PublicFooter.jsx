import { Link } from 'react-router-dom';
import { Mail, Shield, Zap, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

const TwitterIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const GithubIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
    <path d="M9 18c-4.51 2-5-2-7-2"></path>
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function PublicFooter() {
  return (
    <footer className="bg-surface-light border-t border-border-light pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Newsletter */}
          <div className="col-span-1 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/dragolink.svg" alt="LinkPulse Logo" className="h-8 w-8" />
              <span className="text-2xl font-bold text-brand-dark tracking-tight">LinkPulse</span>
            </Link>
            <p className="text-text-secondary text-sm mb-6 max-w-sm">
              The professional URL shortener and analytics platform built for modern teams, creators, and enterprises. 
              Optimize your links, track engagement, and scale your brand.
            </p>
            
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-text-primary mb-2">Subscribe to our newsletter</h4>
              <div className="flex gap-2 max-w-sm">
                <Input type="email" placeholder="Enter your email" className="h-10 text-sm" />
                <Button size="sm" className="h-10 px-4">Subscribe</Button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-text-secondary">
              <a href="#" className="hover:text-brand transition-colors"><TwitterIcon className="w-5 h-5" /></a>
              <a href="#" className="hover:text-brand transition-colors"><GithubIcon className="w-5 h-5" /></a>
              <a href="#" className="hover:text-brand transition-colors"><LinkedinIcon className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Product Links */}
          <div className="col-span-1">
            <h4 className="font-bold text-text-primary mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><Link to="/features" className="hover:text-brand transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-brand transition-colors">Pricing</Link></li>
              <li><Link to="/analytics" className="hover:text-brand transition-colors">Analytics Engine</Link></li>
              <li><Link to="/qr-codes" className="hover:text-brand transition-colors">QR Codes</Link></li>
              <li><Link to="/integrations" className="hover:text-brand transition-colors">Integrations</Link></li>
              <li><Link to="/api" className="hover:text-brand transition-colors">Developer API</Link></li>
              <li><Link to="/changelog" className="hover:text-brand transition-colors">Changelog</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="col-span-1">
            <h4 className="font-bold text-text-primary mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><Link to="/blog" className="hover:text-brand transition-colors">Blog</Link></li>
              <li><Link to="/docs" className="hover:text-brand transition-colors">Documentation</Link></li>
              <li><Link to="/help" className="hover:text-brand transition-colors">Help Center</Link></li>
              <li><Link to="/guides" className="hover:text-brand transition-colors">Link Management Guides</Link></li>
              <li><Link to="/case-studies" className="hover:text-brand transition-colors">Case Studies</Link></li>
              <li><Link to="/status" className="hover:text-brand transition-colors">System Status</Link></li>
            </ul>
          </div>

          {/* Company & Legal Links */}
          <div className="col-span-1">
            <h4 className="font-bold text-text-primary mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><Link to="/about" className="hover:text-brand transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-brand transition-colors flex items-center gap-2">Careers <span className="bg-brand-emerald/10 text-brand-emerald text-[10px] px-1.5 py-0.5 rounded font-bold">HIRING</span></Link></li>
              <li><Link to="/contact" className="hover:text-brand transition-colors">Contact Sales</Link></li>
              <li><Link to="/privacy" className="hover:text-brand transition-colors mt-4 block">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand transition-colors">Terms of Service</Link></li>
              <li><Link to="/security" className="hover:text-brand transition-colors">Security</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-light flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-secondary">
          <p>© {new Date().getFullYear()} LinkPulse Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-brand-emerald" /> Enterprise Secure</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-brand-accent" /> 99.99% Uptime</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

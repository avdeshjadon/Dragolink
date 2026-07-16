import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  Link as LinkIcon,
  QrCode,
  BarChart3,
  Megaphone,
  Tags,
  Key,
  Blocks,
  Users,
  CreditCard,
  Settings,
  ShieldAlert,
  ActivitySquare,
  Search,
  Bell,
  Sun,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, section: 'Main' },
    { name: 'Create Link', href: '/create', icon: PlusCircle, section: 'Main' },
    { name: 'My Links', href: '/links', icon: LinkIcon, section: 'Main' },
    { name: 'QR Codes', href: '/qr', icon: QrCode, section: 'Main' },
    
    { name: 'Campaigns', href: '/campaigns', icon: Megaphone, section: 'Management' },
    { name: 'Tags', href: '/tags', icon: Tags, section: 'Management' },
    { name: 'API Keys', href: '/api-keys', icon: Key, section: 'Management' },
    { name: 'Integrations', href: '/integrations', icon: Blocks, section: 'Management' },
    
    { name: 'Team', href: '/team', icon: Users, section: 'Workspace' },
    { name: 'Billing', href: '/billing', icon: CreditCard, section: 'Workspace' },
    { name: 'Settings', href: '/settings', icon: Settings, section: 'Workspace' },
  ];

  if (user?.role === 'ADMIN') {
    navigation.push(
      { name: 'User Management', href: '/admin/users', icon: Users, section: 'Admin-only' },
      { name: 'Blocked Domains', href: '/admin/domains', icon: ShieldAlert, section: 'Admin-only' },
      { name: 'System Health', href: '/admin/health', icon: ActivitySquare, section: 'Admin-only' }
    );
  }

  const sections = ['Main', 'Management', 'Workspace', 'Admin-only'];

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-surface-dark text-white border-r border-border-light/10">
      <div className="flex h-16 items-center px-4 justify-between shrink-0">
        <Link to="/dashboard" className="flex items-center gap-2">
          <img src="/dragolink.svg" alt="LinkPulse" className="h-8 w-8 brightness-0 invert" />
          {sidebarOpen && <span className="text-xl font-bold tracking-tight">LinkPulse</span>}
        </Link>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:block text-slate-400 hover:text-white"
        >
          <ChevronLeft className={`w-5 h-5 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        {sections.map(section => {
          const items = navigation.filter(n => n.section === section);
          if (items.length === 0) return null;
          return (
            <div key={section} className="mb-6">
              {sidebarOpen && (
                <div className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {section}
                </div>
              )}
              <ul className="space-y-1 px-2">
                {items.map(item => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group relative ${
                          isActive ? 'bg-brand text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                        title={!sidebarOpen ? item.name : undefined}
                      >
                        {isActive && (
                          <motion.div 
                            layoutId="sidebar-active"
                            className="absolute left-0 top-0 bottom-0 w-1 bg-brand-accent rounded-r-full"
                          />
                        )}
                        <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                        {sidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10">
        {sidebarOpen ? (
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Pro Plan</p>
            <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
              <div className="bg-brand-accent h-1.5 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <p className="text-xs text-slate-400 mb-3">4,500 / 10,000 links</p>
            <Button size="sm" className="w-full bg-white text-brand-dark hover:bg-slate-200">Upgrade</Button>
          </div>
        ) : (
          <Button size="icon" className="w-full bg-white text-brand-dark hover:bg-slate-200 rounded-lg">
            <span className="sr-only">Upgrade</span>
            <PlusCircle className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-bg-light font-sans overflow-hidden">
      
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 72 }}
        className="hidden lg:block shrink-0 z-20"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-brand-dark/80 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-surface-light border-b border-border-light flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-brand-dark"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm">
                  <li><span className="text-text-secondary font-medium capitalize">{location.pathname.split('/')[1] || 'Dashboard'}</span></li>
                </ol>
              </nav>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden md:block relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-text-secondary" />
              </div>
              <Input type="text" placeholder="Search..." className="pl-9 h-9 bg-bg-light border-transparent" />
            </div>
            
            <Link to="/create" className="hidden sm:block">
              <Button size="sm">Create Link</Button>
            </Link>
            
            <button className="p-2 text-text-secondary hover:text-brand-dark rounded-full hover:bg-bg-light transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-surface-light"></span>
            </button>
            
            <div className="h-8 w-8 rounded-full bg-brand-emerald text-white flex items-center justify-center font-bold text-sm ml-2 cursor-pointer border border-brand-emerald/20 shadow-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-bg-light">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-6xl"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

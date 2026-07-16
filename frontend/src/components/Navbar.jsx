import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link as LinkIcon, LogOut, LayoutDashboard, PlusCircle, List } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
              <img src="/dragolink.svg?v=2" alt="Dragolink Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Dragolink
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <Link to="/create" className="text-slate-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" /> Create
                </Link>
                <Link to="/links" className="text-slate-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                  <List className="h-4 w-4" /> My Links
                </Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin/domains" className="text-slate-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                    Admin
                  </Link>
                )}
                <div className="border-l border-slate-200 h-6 mx-2"></div>
                <span className="text-sm text-slate-500 font-medium">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                  Log in
                </Link>
                <Link to="/register" className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateLink from './pages/CreateLink';
import MyLinks from './pages/MyLinks';
import Analytics from './pages/Analytics';
import AdminDomains from './pages/AdminDomains';
import Product from './pages/Product';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import PublicAnalytics from './pages/PublicAnalytics';
import DashboardLayout from './components/DashboardLayout';
import PublicNavbar from './components/PublicNavbar';
import PublicFooter from './components/PublicFooter';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/dashboard" />;
  
  return children;
};

// Layout for Auth & Landing pages (No global Navbar, they have their own)
const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-bg-light flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/product" element={<Product />} />
          <Route path="/features" element={<Features />} />
          <Route path="/analytics" element={<PublicAnalytics />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        
        <Route element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateLink />} />
          <Route path="/links" element={<MyLinks />} />
          <Route path="/analytics/:id" element={<Analytics />} />
          
          {/* Add admin check in the element for specific routes */}
          <Route path="/admin/domains" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDomains />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;


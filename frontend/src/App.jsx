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
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/dashboard" />;
  
  return children;
};

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Layout for Auth pages (No Navbar)
const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Outlet />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8"><Dashboard /></div>
            </ProtectedRoute>
          } />
          
          <Route path="/create" element={
            <ProtectedRoute>
              <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8"><CreateLink /></div>
            </ProtectedRoute>
          } />
          
          <Route path="/links" element={
            <ProtectedRoute>
              <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8"><MyLinks /></div>
            </ProtectedRoute>
          } />
          
          <Route path="/analytics/:id" element={
            <ProtectedRoute>
              <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8"><Analytics /></div>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/domains" element={
            <ProtectedRoute adminOnly={true}>
              <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8"><AdminDomains /></div>
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

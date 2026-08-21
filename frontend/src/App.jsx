/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Toaster } from "react-hot-toast";
import MotionPage from "./components/motion/MotionPage";
import SmoothScroll from "./components/SmoothScroll";
import { useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateLink from "./pages/CreateLink";
import EditLink from "./pages/EditLink";
import MyLinks from "./pages/MyLinks";
import ClickLogs from "./pages/ClickLogs";
import Analytics from "./pages/Analytics";
import SettingsProfile from "./pages/SettingsProfile";
import SettingsSecurity from "./pages/SettingsSecurity";
import Product from "./pages/Product";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import PublicAnalytics from "./pages/PublicAnalytics";
import QRCodes from "./pages/QRCodes";
import Campaigns from "./pages/Campaigns";
import CreateCampaign from "./pages/CreateCampaign";
import EditCampaign from "./pages/EditCampaign";
import Team from "./pages/Team";
import APIKeys from "./pages/APIKeys";
import MyApplications from "./pages/MyApplications";
import Notifications from "./pages/Notifications";
import PublicQRCodes from "./pages/PublicQRCodes";
import PublicAPI from "./pages/PublicAPI";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import HelpCenter from "./pages/HelpCenter";
import Guides from "./pages/Guides";
import CaseStudies from "./pages/CaseStudies";

import Docs from "./pages/Docs";
import About from "./pages/About";
import Careers from "./pages/Careers";
import JobDetails from "./pages/JobDetails";
import JobApplicationForm from "./pages/JobApplicationForm";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Security from "./pages/Security";

import DashboardLayout from "./components/DashboardLayout";
import SettingsLayout from "./components/SettingsLayout";
import PublicNavbar from "./components/PublicNavbar";
import PublicFooter from "./components/PublicFooter";
import ScrollToTop from "./components/ScrollToTop";
import SuspendedPopup from "./components/SuspendedPopup";

// Redirect component for external admin routes
const AdminRedirect = () => {
  window.location.replace(`http://localhost:5174${window.location.pathname}`);
  return null;
};

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== "ADMIN") return <Navigate to="/dashboard" />;

  return children;
};

const PublicLayout = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-bg-light flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <MotionPage key={location.pathname}>
          <Outlet />
        </MotionPage>
      </main>
      <PublicFooter />
    </div>
  );
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/product" element={<Product />} />
          <Route path="/features" element={<Features />} />
          <Route path="/public-analytics" element={<PublicAnalytics />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/qr-codes" element={<PublicQRCodes />} />
          <Route path="/api" element={<PublicAPI />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/case-studies" element={<CaseStudies />} />

          <Route path="/docs" element={<Docs />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/:jobId" element={<JobDetails />} />
          <Route
            path="/careers/:jobId/apply"
            element={<JobApplicationForm />}
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/security" element={<Security />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* External redirects */}
          <Route path="/admin/*" element={<AdminRedirect />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create" element={<CreateLink />} />
          <Route path="/links" element={<MyLinks />} />
          <Route path="/links/:id/edit" element={<EditLink />} />
          <Route path="/logs/:id" element={<ClickLogs />} />
          <Route path="/qr" element={<QRCodes />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/create" element={<CreateCampaign />} />
          <Route path="/campaigns/:id/edit" element={<EditCampaign />} />
          <Route path="/team" element={<Team />} />
          <Route path="/api-keys" element={<APIKeys />} />
          <Route path="/applications" element={<MyApplications />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/analytics/:id" element={<Analytics />} />
        </Route>

        {/* Settings Routes wrapped in SettingsLayout */}
        <Route
          element={
            <ProtectedRoute>
              <SettingsLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/settings/profile" element={<SettingsProfile />} />
          <Route path="/settings/security" element={<SettingsSecurity />} />
          <Route path="/settings/api-keys" element={<APIKeys />} />
          <Route path="/settings/team" element={<Team />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <SmoothScroll>
      <Toaster position="top-right" />
      <BrowserRouter>
        <ScrollToTop />
        <SuspendedPopup />
        <AnimatedRoutes />
      </BrowserRouter>
    </SmoothScroll>
  );
}

export default App;

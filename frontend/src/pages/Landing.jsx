/*
Copyright (c) 2026 Avdesh Jadon (Dragolink)
All Rights Reserved.
Proprietary and Confidential – Unauthorized copying, modification, or distribution of this file,
via any medium, is strictly prohibited without prior written consent from Avdesh Jadon.
*/

import { useState, useEffect } from "react";
import { api } from "../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  Link as LinkIcon,
  BarChart3,
  QrCode,
  ShieldCheck,
  Settings2,
  Users,
  Zap,
  Globe,
  Lock,
  Cpu,
  Server,
  Smartphone,
  MessageSquare,
  Webhook as WebhookIcon,
  Network,
  Layout,
  CheckCircle2,
} from "lucide-react";

const IconMap = {
  LinkIcon,
  BarChart3,
  QrCode,
  ShieldCheck,
  Settings2,
  Users,
  Zap,
  Globe,
  Lock,
  Cpu,
  Server,
  Smartphone,
  MessageSquare,
  WebhookIcon,
  Network,
  Layout,
  CheckCircle2,
};
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export default function Landing() {
  const [url, setUrl] = useState("");
  const [pageData, setPageData] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isShortening, setIsShortening] = useState(false);

  const handleShorten = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }
    
    if (!user) {
      toast.error("Please login to shorten links");
      navigate("/login");
      return;
    }

    try {
      setIsShortening(true);
      const payload = {
        longUrl: url,
        trackIp: true,
        trackBrowser: true,
        trackOs: true,
        trackDevice: true,
        trackReferrer: true,
      };
      
      await api.post("/links", payload);
      toast.success("Link shortened successfully!");
      setUrl("");
      navigate("/links");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to shorten link");
    } finally {
      setIsShortening(false);
    }
  };

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const res = await api.get("/public/pages/home");
        if (res.data && res.data.htmlContent) {
          setPageData(JSON.parse(res.data.htmlContent));
        }
      } catch (error) {
        console.error("Failed to load home page content", error);
      }
    };
    fetchPageData();
  }, []);

  if (!pageData)
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light">
        Loading...
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-bg-light w-full font-sans">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Background Accents */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#DCE8E0_1px,transparent_1px)] [background-size:24px_24px] opacity-50"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-brand-emerald/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-brand-dark tracking-tight leading-tight mb-6">
              {pageData.hero.title1}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-accent">
                {pageData.hero.title2}
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mb-10"
          >
            {pageData.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-16"
          >
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto text-base">
                Start shortening for free
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base"
            >
              View live demo
            </Button>
          </motion.div>

          {/* Quick Shortener */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-3xl bg-surface-light p-3 sm:p-4 rounded-2xl shadow-xl shadow-brand-dark/5 border border-border-light flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-text-secondary" />
              </div>
              <Input
                type="url"
                placeholder="https://your-long-url.com/very-long-path-to-shorten"
                className="pl-10 h-12 text-base border-transparent bg-bg-light focus-visible:ring-brand-emerald"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <Button size="lg" className="h-12 px-8 shrink-0" onClick={handleShorten} disabled={isShortening}>
              {isShortening ? "Shortening..." : "Shorten"}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Capabilities */}
      <section
        id="features"
        className="py-24 bg-bg-light relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl font-extrabold text-brand-dark mb-4 tracking-tight"
            >
              {pageData.capabilities.title1}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-emerald">
                {pageData.capabilities.title2}
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-text-secondary max-w-2xl mx-auto font-medium"
            >
              {pageData.capabilities.subtitle}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pageData.features.map((feature, idx) => {
              const IconComponent = IconMap[feature.icon] || LinkIcon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="group relative bg-white p-6 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-brand-emerald/15 border border-outline-variant/30 hover:border-brand-emerald/40 transition-all duration-500 overflow-hidden"
                >
                  {/* Subtle glowing blobs inside the card on hover */}
                  <div className="absolute -right-12 -top-12 w-32 h-32 bg-brand-emerald/10 rounded-full blur-3xl group-hover:bg-brand-emerald/20 transition-all duration-700"></div>
                  <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-brand/10 rounded-full blur-3xl group-hover:bg-brand/20 transition-all duration-700"></div>

                  <div className="relative z-10">
                    <IconComponent className="w-8 h-8 text-brand mb-4 group-hover:scale-110 group-hover:-rotate-3 group-hover:text-brand-emerald transition-all duration-300 drop-shadow-sm" />
                    <h3 className="text-xl font-bold text-brand-dark mb-2 tracking-tight group-hover:text-brand transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#15803D_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-bold text-surface-light mb-6">
            {pageData.cta.title}
          </h2>
          <p className="text-xl text-border-light mb-10 max-w-2xl mx-auto">
            {pageData.cta.subtitle}
          </p>
          <Link to="/register">
            <Button
              size="lg"
              className="bg-brand-accent text-brand-dark hover:bg-brand-lime text-lg font-bold"
            >
              {pageData.cta.buttonText}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { api } from '../lib/axios';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  LinkIcon,
  Zap,
  Globe,
  Shield,
  Activity,
  BarChart3,
  Lock,
  Webhook,
  QrCode,
  Users,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Settings2,
  Cpu,
  Server,
  Smartphone,
  MessageSquare,
  Network,
  Layout
} from 'lucide-react';
import { Button } from '../components/ui/Button';

const IconMap = {
  LinkIcon, Zap, Globe, Shield, Activity, BarChart3, Lock,
  Webhook, QrCode, Users, Clock, CheckCircle2,
  ShieldCheck, Settings2, Cpu, Server, Smartphone,
  MessageSquare, Network, Layout
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
};

export default function Product() {
  

  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const res = await api.get("/public/pages/product");
        if (res.data && res.data.htmlContent) {
          setPageData(JSON.parse(res.data.htmlContent));
        }
      } catch (error) {
        console.error("Failed to load product page content", error);
      }
    };
    fetchPageData();
  }, []);

  if (!pageData) return <div className="min-h-screen flex items-center justify-center bg-bg-light">Loading...</div>;

  return (
    <div className="bg-bg-light min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">


        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-dark mb-8 tracking-tight leading-[1.1]"
        >
          {pageData.hero.title1} <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-emerald to-brand">{pageData.hero.title2}</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-text-secondary max-w-4xl mx-auto mb-10 leading-relaxed"
        >
          {pageData.hero.subtitle}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-8"
        >
          <Link to="/register">
            <Button size="lg" className="h-14 px-10 text-lg shadow-lg shadow-brand-emerald/25 hover:shadow-brand-emerald/40 transition-all duration-300">
              {pageData.hero.button1}
            </Button>
          </Link>
          <a href="mailto:sales@dragolink.com">
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg bg-bg-light/50 backdrop-blur-sm border-2 hover:bg-surface-light transition-all duration-300">
              {pageData.hero.button2}
            </Button>
          </a>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm font-medium text-text-secondary/80 flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-brand-emerald" /> {pageData.hero.guarantee.split('•')[0]}
          {pageData.hero.guarantee.includes('•') && (
            <>
              <span className="mx-2 text-border-light">•</span> 
              {pageData.hero.guarantee.split('•')[1]}
            </>
          )}
        </motion.p>
      </section>




      {/* Feature Grid */}
      <section className="py-24 bg-surface-light border-y border-border-light px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-dark mb-4">{pageData.featuresHeader.title}</h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {pageData.featuresHeader.subtitle}
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageData.features.map((f, i) => {
              const IconComponent = IconMap[f.icon] || LinkIcon;
              return (
                <motion.div
                  key={i}
                  {...fadeUp}
                  transition={{ delay: (i % 3) * 0.05 }}
                  className="bg-bg-light border border-border-light rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="w-10 h-10 bg-brand/10 text-brand rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-text-primary mb-2">{f.title}</h3>
                  <p className="text-text-secondary text-sm">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Motivational Thought */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="max-w-4xl mx-auto text-center">
          <p className="text-3xl lg:text-4xl font-bold text-brand-dark leading-relaxed mb-8 italic">
            {pageData.quote}
          </p>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-4 bg-surface-light border-t border-border-light">
        <motion.div {...fadeUp}>
          <h2 className="text-3xl font-bold text-brand-dark mb-4">{pageData.cta.title}</h2>
          <p className="text-lg text-text-secondary max-w-xl mx-auto mb-8">
            {pageData.cta.subtitle}
          </p>
          <Link to="/register">
            <Button size="lg" className="text-base px-8">{pageData.cta.buttonText}</Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
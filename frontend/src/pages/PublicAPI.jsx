import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, Zap, Code2, Database, Globe, Server, Cpu, Lock, Key, Activity, TrendingUp, Smartphone, Box } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { api } from '../lib/axios';

const iconMap = {
  Terminal, Shield, Zap, Code2, Database, Globe, Server, Cpu,
  Lock, Key, Activity, TrendingUp, Smartphone, Box
};

export default function PublicAPI() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/public/pages/api')
      .then(res => {
        setData(JSON.parse(res.data.htmlContent));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">Loading API Details...</div>;
  }

  if (!data || !data.hero) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">API data not available.</div>;
  }

  const { hero, terminalSnippet, features } = data;

  return (
    <div className="bg-bg-light min-h-screen font-sans">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl lg:text-6xl font-extrabold text-brand-dark mb-6 tracking-tight leading-[1.1]">
              {hero.title1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-emerald">{hero.title2}</span>
            </h1>
            <p className="text-xl text-text-secondary mb-4 leading-relaxed max-w-lg">
              {hero.subtitle}
            </p>
            <ul className="space-y-2 mb-10">
              {hero.bulletPoints.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-text-secondary text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="h-14 px-8 text-lg shadow-lg shadow-brand/20">
                  Generate API Key
                </Button>
              </Link>
              <a href="https://docs.dragolink.com" target="_blank" rel="noreferrer">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-surface-light border-2">
                  Read the Docs
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Terminal visual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-[2rem] overflow-hidden bg-[#0D1117] shadow-2xl border border-white/10"
          >
            <div className="flex items-center gap-2 px-6 py-4 bg-white/5 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-xs font-mono text-white/40">create_link.sh</span>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono leading-relaxed">
                <code>{terminalSnippet}</code>
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-surface-light border-y border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = iconMap[feature.icon] || Code2;
              return (
                <div key={idx} className="p-8">
                  <Icon className="w-10 h-10 text-brand mb-6" />
                  <h3 className="text-xl font-bold text-brand-dark mb-3">{feature.title}</h3>
                  <p className="text-text-secondary">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

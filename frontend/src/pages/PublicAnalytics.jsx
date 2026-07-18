import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { BarChart3, Globe, Smartphone, MousePointerClick, Clock, TrendingUp, Filter, ArrowRight, CheckCircle2, Zap, Lock, ShieldCheck, Settings2, Users, Cpu, Server, LinkIcon, QrCode } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { api } from '../lib/axios';

const iconMap = {
  Globe, Smartphone, MousePointerClick, Clock, TrendingUp, Filter,
  BarChart3, ShieldCheck, Settings2, Users, Zap, Lock, Cpu, Server, LinkIcon, QrCode
};


export default function PublicAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/public/pages/public-analytics')
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
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">Loading analytics engine...</div>;
  }

  if (!data || !data.hero) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">Analytics Engine data not available.</div>;
  }

  const { hero, stats, features } = data;

  return (
    <div className="bg-bg-light min-h-screen font-sans">

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Text */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-brand-dark mb-6 tracking-tight leading-[1.1]">
              {hero.title1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-emerald">{hero.title2}</span>
            </h1>
            <p className="text-xl text-text-secondary mb-6 leading-relaxed max-w-lg">
              {hero.subtitle}
            </p>
            <ul className="space-y-2 mb-10">
              {hero.bulletPoints.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-text-secondary text-sm">
                  <CheckCircle2 className="w-4 h-4 text-brand shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto shadow-lg shadow-brand/20">
                  Start Tracking Free
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto bg-surface-light border-2">
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right: Animated Stats Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-brand/10 blur-3xl rounded-3xl" />
            <div className="relative bg-surface-light border border-border-light rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm font-medium text-text-secondary mb-1">Total Clicks Today</div>
                  <motion.div
                    className="text-4xl font-extrabold text-brand-dark"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    142,389
                  </motion.div>
                </div>
                <div className="flex items-center gap-1 bg-brand/10 text-brand text-sm font-bold px-3 py-1.5 rounded-full">
                  <TrendingUp className="w-4 h-4" /> +24.6%
                </div>
              </div>

              {/* Fake bar chart */}
              <div className="flex items-end gap-1.5 h-24 mb-6">
                {[40, 65, 45, 80, 55, 90, 70, 95, 60, 100, 75, 88].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-brand rounded-t-sm"
                    initial={{ scaleY: 0, originY: 1 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.4 + i * 0.06, duration: 0.4, type: 'spring' }}
                    style={{ height: `${h}%`, opacity: 0.6 + (i / 12) * 0.4 }}
                  />
                ))}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-light">
                {[
                  { label: 'Unique visitors', value: '87,201' },
                  { label: 'Countries', value: '143' },
                  { label: 'Avg. CTR', value: '6.2%' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-lg font-bold text-brand-dark">{s.value}</div>
                    <div className="text-xs text-text-secondary mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-surface-light border-y border-border-light py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-3xl font-extrabold text-brand-dark">{stat.value}</div>
              <div className="text-sm text-text-secondary mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">Every insight you need, in one place</h2>
          <p className="text-lg text-text-secondary">Built for marketers, growth teams, and enterprises that treat data as a competitive advantage.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = iconMap[feature.icon] || Globe;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-surface-light rounded-2xl p-8 border border-border-light hover:border-brand/30 hover:shadow-lg transition-all"
              >
                <Icon className="w-8 h-8 text-brand mb-5" />
                <h3 className="text-xl font-bold text-brand-dark mb-3">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Privacy Banner */}
      <section className="py-16 bg-surface-light border-y border-border-light px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <Lock className="w-10 h-10 text-brand shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-brand-dark mb-2">Privacy-first analytics</h3>
            <p className="text-text-secondary">All analytics are collected without third-party cookies. We are GDPR, CCPA, and PECR compliant out of the box. Your data stays yours.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-brand-dark rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-emerald opacity-20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand opacity-20 blur-[100px] rounded-full" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Start tracking in under 60 seconds</h2>
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
              Create your first tracked link free. No credit card required. Full analytics dashboard available from day one.
            </p>
            <Link to="/register">
              <Button size="lg" className="h-14 px-10 text-lg bg-brand-emerald hover:bg-brand text-brand-dark hover:text-white transition-all shadow-xl">
                Create your first link <ArrowRight className="ml-2 w-5 h-5 inline" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

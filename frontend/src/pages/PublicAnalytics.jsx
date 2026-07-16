import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { BarChart3, Globe, Smartphone, MousePointerClick } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function PublicAnalytics() {
  return (
    <div className="bg-bg-light min-h-screen font-sans">
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-2 rounded-full font-semibold text-sm mb-8"
        >
          <BarChart3 className="w-4 h-4" /> Dragolink Analytics Engine
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl lg:text-6xl font-extrabold text-brand-dark mb-6 tracking-tight"
        >
          Understand your audience
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-text-secondary max-w-3xl mx-auto mb-10"
        >
          Stop guessing. Get real-time, actionable insights on every click, scan, and tap across all your channels.
        </motion.p>
      </section>

      <section className="py-20 bg-surface-light border-y border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-bg-light p-8 rounded-3xl border border-border-light">
              <Globe className="w-10 h-10 text-brand mb-6" />
              <h3 className="text-xl font-bold text-text-primary mb-3">Geographic Data</h3>
              <p className="text-text-secondary">Know exactly where your audience is located, down to the city level, to optimize localized campaigns.</p>
            </div>
            <div className="bg-bg-light p-8 rounded-3xl border border-border-light">
              <Smartphone className="w-10 h-10 text-brand mb-6" />
              <h3 className="text-xl font-bold text-text-primary mb-3">Device & Browser</h3>
              <p className="text-text-secondary">Understand how users access your content. Track operating systems, device types, and browser usage.</p>
            </div>
            <div className="bg-bg-light p-8 rounded-3xl border border-border-light">
              <MousePointerClick className="w-10 h-10 text-brand mb-6" />
              <h3 className="text-xl font-bold text-text-primary mb-3">Referrer Tracking</h3>
              <p className="text-text-secondary">Identify your best performing channels. See which social networks, emails, or websites are driving traffic.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-24 text-center px-4">
        <h2 className="text-3xl font-bold text-brand-dark mb-6">Start tracking today</h2>
        <Link to="/register">
          <Button size="lg" className="px-10">Create your first link</Button>
        </Link>
      </section>
    </div>
  );
}

import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, LinkIcon, Zap, Globe, Shield, Activity } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Product() {
  return (
    <div className="bg-bg-light min-h-screen font-sans">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl lg:text-6xl font-extrabold text-brand-dark mb-6 tracking-tight"
        >
          One platform to manage all your links
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-text-secondary max-w-3xl mx-auto mb-10"
        >
          Dragolink is the complete link management infrastructure for modern teams. Shorten, brand, and track every click with enterprise-grade reliability.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/register">
            <Button size="lg" className="text-base px-8">Start for free</Button>
          </Link>
        </motion.div>
      </section>

      {/* Product Showcase */}
      <section className="py-24 bg-surface-light border-y border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-12 h-12 bg-brand/10 text-brand rounded-xl flex items-center justify-center mb-6">
                <LinkIcon className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-brand-dark mb-4">Branded Links</h2>
              <p className="text-lg text-text-secondary mb-6">
                Generic short links look spammy. Use your own custom domain (e.g., link.yourbrand.com) to build trust and increase click-through rates by up to 34%.
              </p>
              <ul className="space-y-3 mb-8">
                {['Custom domains', 'Custom back-halves / aliases', 'Bulk link creation'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-text-primary font-medium">
                    <Zap className="w-5 h-5 text-brand-emerald" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-bg-light rounded-3xl border border-border-light p-8 shadow-xl">
              <div className="bg-surface-light border border-border-light rounded-xl p-4 shadow-sm flex items-center gap-4 mb-4">
                <div className="bg-brand/10 text-brand font-mono font-bold px-3 py-1 rounded">dragolink.io/demo</div>
                <ArrowRight className="text-text-secondary w-5 h-5" />
                <div className="text-text-secondary truncate text-sm">https://example.com/very-long-url-path</div>
              </div>
              <div className="bg-surface-light border border-border-light rounded-xl p-4 shadow-sm flex items-center gap-4">
                <div className="bg-brand/10 text-brand font-mono font-bold px-3 py-1 rounded">brand.co/sale</div>
                <ArrowRight className="text-text-secondary w-5 h-5" />
                <div className="text-text-secondary truncate text-sm">https://example.com/store/summer-sale</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-4">
        <h2 className="text-3xl font-bold text-brand-dark mb-6">Experience the Dragolink difference</h2>
        <Link to="/register">
          <Button size="lg">Get Started</Button>
        </Link>
      </section>
    </div>
  );
}

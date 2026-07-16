import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
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
} from 'lucide-react';
import { Button } from '../components/ui/Button';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
};

export default function Product() {
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
          One platform to manage <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-emerald to-brand">all your links</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-text-secondary max-w-4xl mx-auto mb-10 leading-relaxed"
        >
          Dragolink is the complete, high-performance link management infrastructure built for modern enterprises. We provide the tools you need to shorten, brand, organize, and track every single click across your entire marketing funnel with zero friction and absolute reliability.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-8"
        >
          <Link to="/register">
            <Button size="lg" className="h-14 px-10 text-lg shadow-lg shadow-brand-emerald/25 hover:shadow-brand-emerald/40 transition-all duration-300">
              Start for free
            </Button>
          </Link>
          <a href="mailto:sales@dragolink.com">
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg bg-bg-light/50 backdrop-blur-sm border-2 hover:bg-surface-light transition-all duration-300">
              Talk to sales
            </Button>
          </a>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm font-medium text-text-secondary/80 flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-brand-emerald" /> No credit card required 
          <span className="mx-2 text-border-light">•</span> 
          Free plan includes 1,000 links/month
        </motion.p>
      </section>




      {/* Feature Grid */}
      <section className="py-24 bg-surface-light border-y border-border-light px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-dark mb-4">Everything you need, nothing you don't</h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Dragolink brings link creation, tracking, and governance into a single workflow so your team stops piecing tools together.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: QrCode, title: 'QR codes', desc: 'Generate a branded, scannable QR code for any link in one click.' },
              { icon: Webhook, title: 'Webhooks & API', desc: 'Trigger workflows on click events and manage links programmatically.' },
              { icon: Zap, title: 'Link retargeting', desc: 'Attach pixels to any short link and retarget visitors across ad platforms.' },
              { icon: Users, title: 'Team workspaces', desc: 'Organize links by project with shared folders and granular permissions.' },
              { icon: Clock, title: 'Link expiration', desc: 'Set links to expire or redirect elsewhere after a date or click limit.' },
              { icon: Globe, title: 'Geo-targeting', desc: 'Send visitors to different destinations based on their location or device.' },
            ].map((f, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ delay: (i % 3) * 0.05 }}
                className="bg-bg-light border border-border-light rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-10 h-10 bg-brand/10 text-brand rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-text-primary mb-2">{f.title}</h3>
                <p className="text-text-secondary text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Motivational Thought */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeUp} className="max-w-4xl mx-auto text-center">
          <p className="text-3xl lg:text-4xl font-bold text-brand-dark leading-relaxed mb-8 italic">
            "The links we build today create the pathways to our success tomorrow. Every connection is an opportunity waiting to be realized."
          </p>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-4 bg-surface-light border-t border-border-light">
        <motion.div {...fadeUp}>
          <h2 className="text-3xl font-bold text-brand-dark mb-4">Experience the Dragolink difference</h2>
          <p className="text-lg text-text-secondary max-w-xl mx-auto mb-8">
            Join thousands of teams shortening, branding, and tracking their links with confidence.
          </p>
          <Link to="/register">
            <Button size="lg" className="text-base px-8">Get started</Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
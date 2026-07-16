import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Link as LinkIcon, 
  BarChart3, 
  QrCode, 
  ShieldCheck, 
  Settings2,
  Users,
  Zap,
  Globe
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import DecryptedText from '../components/DecryptedText';

export default function Landing() {
  const [url, setUrl] = useState('');

  const features = [
    { title: 'Custom short links', description: 'Create branded links that stand out and build trust.', icon: LinkIcon },
    { title: 'Advanced analytics', description: 'Track clicks, devices, and geographic data in real time.', icon: BarChart3 },
    { title: 'QR code generation', description: 'Generate custom QR codes for offline marketing campaigns.', icon: QrCode },
    { title: 'Security & Reliability', description: 'Enterprise-grade protection with advanced threat filtering.', icon: ShieldCheck },
    { title: 'API Access', description: 'Integrate link generation into your own applications seamlessly.', icon: Settings2 },
    { title: 'Team Collaboration', description: 'Work together with role-based access control for your workspace.', icon: Users },
  ];

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
              Shorten links.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-accent">Understand every click.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mb-10"
          >
            Create powerful short links, track engagement, generate QR codes, and manage your entire link infrastructure from one intelligent platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-16"
          >
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto text-base">Start shortening for free</Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
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
            <Button size="lg" className="h-12 px-8 shrink-0">Shorten</Button>
          </motion.div>
        </div>
      </section>



      {/* Capabilities */}
      <section id="features" className="py-24 bg-surface-light border-y border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-4">Everything you need to scale</h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">LinkPulse provides a comprehensive suite of tools designed for modern teams and creators.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-bg-light border border-border-light p-6 rounded-2xl hover:border-brand-emerald/50 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-surface-light rounded-xl flex items-center justify-center border border-border-light mb-6 text-brand">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-brand-dark mb-2">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#15803D_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-bold text-surface-light mb-6">Ready to optimize your links?</h2>
          <p className="text-xl text-border-light mb-10 max-w-2xl mx-auto">
            Join thousands of teams who trust LinkPulse for their link management and analytics.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-brand-accent text-brand-dark hover:bg-brand-lime text-lg font-bold">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>


    </div>
  );
}

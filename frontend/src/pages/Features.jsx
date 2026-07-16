import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  LinkIcon, BarChart3, QrCode, ShieldCheck, 
  Settings2, Users, Zap, Globe, Lock, Cpu, Server, Smartphone
} from 'lucide-react';

export default function Features() {
  const allFeatures = [
    { title: 'Custom Short Links', description: 'Create memorable, branded links that increase click-through rates and brand trust.', icon: LinkIcon },
    { title: 'Real-time Analytics', description: 'Track every click as it happens with detailed breakdowns by device, location, and referrer.', icon: BarChart3 },
    { title: 'Dynamic QR Codes', description: 'Generate high-res QR codes that can be updated anytime without reprinting.', icon: QrCode },
    { title: 'Link Expiration', description: 'Set links to automatically expire on a certain date or after a specific number of clicks.', icon: Zap },
    { title: 'Advanced Threat Protection', description: 'Automatic scanning of destination URLs to protect your audience from malware.', icon: ShieldCheck },
    { title: 'Developer API', description: 'Integrate link generation programmatically into your own applications with our REST API.', icon: Settings2 },
    { title: 'Team Workspaces', description: 'Invite team members and manage permissions with role-based access control.', icon: Users },
    { title: 'Geotargeting', description: 'Route users to different destination URLs based on their geographic location.', icon: Globe },
    { title: 'SSO & SAML', description: 'Enterprise-grade security integrations for seamless identity management.', icon: Lock },
    { title: 'UTM Builder', description: 'Automatically append UTM parameters to track campaign performance in Google Analytics.', icon: Cpu },
    { title: 'High Availability', description: 'Built on edge network infrastructure ensuring 99.99% uptime globally.', icon: Server },
    { title: 'Deep Linking', description: 'Route mobile users directly into your iOS or Android applications.', icon: Smartphone },
  ];

  return (
    <div className="bg-bg-light min-h-screen py-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-6 tracking-tight"
          >
            Powerful features for modern link management
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-text-secondary"
          >
            Everything you need to create, manage, and track your links at scale.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allFeatures.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-surface-light border border-border-light p-8 rounded-2xl hover:shadow-lg hover:border-brand-emerald/30 transition-all group"
            >
              <div className="w-14 h-14 bg-bg-light border border-border-light rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand/10 group-hover:text-brand group-hover:border-brand/20 transition-colors">
                <feature.icon className="w-7 h-7 text-text-secondary group-hover:text-brand" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        
      </div>
    </div>
  );
}

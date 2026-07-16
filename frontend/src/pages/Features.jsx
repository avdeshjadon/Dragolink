import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  LinkIcon, BarChart3, QrCode, ShieldCheck,
  Settings2, Users, Zap, Globe, Lock, Cpu, Server, Smartphone,
  ArrowRight, CheckCircle2, MessageSquare, Globe as WebhookIcon, Network, Layout,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

const categories = [
  {
    name: 'Create',
    tagline: 'Turn any URL into a branded, trackable asset',
    features: [
      { title: 'Custom Short Links', description: 'Create deeply memorable, branded short links that immediately increase click-through rates, build unshakeable audience trust, and drive meaningful engagement across every single marketing channel.', icon: LinkIcon },
      { title: 'Dynamic QR Codes', description: 'Generate high-resolution, dynamic QR codes that seamlessly bridge offline and online worlds. Update the destination URL at any time without ever needing to reprint your physical marketing materials.', icon: QrCode },
      { title: 'UTM Builder', description: 'Automatically construct and append UTM parameters to track complex campaign performance with pinpoint accuracy directly inside Google Analytics and other BI tools.', icon: Cpu },
      { title: 'Deep Linking', description: 'Intelligently route mobile users directly into specific screens within your iOS or Android applications, dramatically improving the user experience and app engagement.', icon: Smartphone },
    ],
  },
  {
    name: 'Measure',
    tagline: 'See exactly how every link performs',
    features: [
      { title: 'Real-time Analytics', description: 'Track every single click as it happens with ultra-detailed breakdowns by device type, geographic location, browser, and referrer. Make lightning-fast, data-driven decisions.', icon: BarChart3 },
      { title: 'Geotargeting', description: 'Automatically route users to entirely different destination URLs or localized landing pages based on their exact geographic location for maximum conversion rates.', icon: Globe },
      { title: 'Link Expiration', description: 'Maintain absolute control over your campaigns by setting links to automatically expire on a specific date and time, or after hitting a precise click threshold.', icon: Zap },
    ],
  },
  {
    name: 'Protect & Scale',
    tagline: 'Governance and infrastructure your security team trusts',
    features: [
      { title: 'Advanced Threat Protection', description: 'Enterprise-grade, automated scanning of all destination URLs instantly protects your audience from malware, phishing, and malicious redirects, keeping your brand reputation pristine.', icon: ShieldCheck },
      { title: 'Team Workspaces', description: 'Collaborate effortlessly by inviting team members to secure workspaces. Manage everything with granular, role-based access control and comprehensive audit logs.', icon: Users },
      { title: 'SSO & SAML', description: 'Enterprise-grade security integrations supporting SAML and Single Sign-On (SSO) for seamless identity management and frictionless onboarding for large organizations.', icon: Lock },
      { title: 'High Availability', description: 'Built on a globally distributed, high-performance edge network infrastructure guaranteeing 99.99% uptime and lightning-fast redirects from anywhere in the world.', icon: Server },
      { title: 'Developer API', description: 'Integrate powerful link generation and analytics programmatically into your own applications, internal tools, or workflows using our blazing-fast, robust REST API.', icon: Settings2 },
    ],
  },
];

const cardMotion = (idx) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { delay: (idx % 3) * 0.05, duration: 0.5 },
});

function FeatureCard({ feature, idx }) {
  return (
    <motion.div
      {...cardMotion(idx)}
      className="group relative bg-white p-6 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-brand-emerald/15 border border-outline-variant/30 hover:border-brand-emerald/40 transition-all duration-500 overflow-hidden"
    >
      <div className="absolute -right-12 -top-12 w-32 h-32 bg-brand-emerald/10 rounded-full blur-3xl group-hover:bg-brand-emerald/20 transition-all duration-700"></div>
      <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-brand/10 rounded-full blur-3xl group-hover:bg-brand/20 transition-all duration-700"></div>

      <div className="relative z-10">
        <feature.icon className="w-8 h-8 text-brand mb-4 group-hover:scale-110 group-hover:-rotate-3 group-hover:text-brand-emerald transition-all duration-300 drop-shadow-sm" />
        <h3 className="text-xl font-bold text-brand-dark mb-2 tracking-tight group-hover:text-brand transition-colors duration-300">{feature.title}</h3>
        <p className="text-text-secondary leading-relaxed font-medium">{feature.description}</p>
      </div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <div className="bg-bg-light min-h-screen py-24 font-sans relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Hero */}
        <div className="relative text-center max-w-5xl mx-auto mb-20 pt-10">

          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-dark mb-8 tracking-tight leading-[1.1]"
          >
            Powerful features for modern <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-emerald">link management</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-text-secondary font-medium max-w-3xl mx-auto leading-relaxed"
          >
            Everything you need to create, manage, track, and scale your links globally. From dynamic QR codes and deep linking to advanced threat protection and real-time granular analytics, Dragolink equips your team with absolute precision and unmatched security.
          </motion.p>
        </div>



        {/* Feature categories */}
        {categories.map((category, cIdx) => (
          <div key={category.name} className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              className="flex items-baseline gap-4 mb-8"
            >
              <span className="text-sm font-bold text-brand uppercase tracking-widest">{String(cIdx + 1).padStart(2, '0')}</span>
              <div>
                <h2 className="text-2xl font-bold text-brand-dark tracking-tight">{category.name}</h2>
                <p className="text-text-secondary font-medium">{category.tagline}</p>
              </div>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.features.map((feature, idx) => (
                <FeatureCard key={feature.title} feature={feature} idx={idx} />
              ))}
            </div>
          </div>
        ))}

        {/* Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm p-10 mb-24"
        >
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-brand-dark mb-2 tracking-tight">Connects with the tools you already use</h2>
            <p className="text-text-secondary font-medium">Wire Dragolink into your existing stack in minutes, no custom code required.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { icon: MessageSquare, label: 'Slack' },
              { icon: WebhookIcon, label: 'Webhooks' },
              { icon: Network, label: 'Zapier' },
              { icon: Layout, label: 'Chrome extension' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-outline-variant/30 hover:border-brand-emerald/40 transition-colors">
                <item.icon className="w-7 h-7 text-brand" />
                <span className="font-semibold text-text-primary text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Comparison callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 gap-6 mb-24"
        >
          <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm p-8">
            <h3 className="font-bold text-brand-dark mb-4">Without Dragolink</h3>
            <ul className="space-y-3">
              {['Untrusted, generic short links', 'Click data scattered across tools', 'No visibility into link security', 'Manual UTM tagging every time'].map((item, i) => (
                <li key={i} className="text-text-secondary text-sm font-medium">— {item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-brand-dark rounded-3xl shadow-sm p-8">
            <h3 className="font-bold text-white mb-4">With Dragolink</h3>
            <ul className="space-y-3">
              {['Branded links on your own domain', 'One dashboard for every click', 'Automatic malware & phishing scans', 'UTM parameters built in by default'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-white/90 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-brand-dark mb-4 tracking-tight">Ready to put every feature to work?</h2>
          <p className="text-lg text-text-secondary max-w-xl mx-auto mb-8 font-medium">
            Start free and upgrade whenever your team needs more.
          </p>
          <Link to="/register">
            <Button size="lg" className="text-base px-8 inline-flex items-center gap-2">
              Start for free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
import { motion } from 'framer-motion';
import { Blocks, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const SlackIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zm2.521-10.123a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
  </svg>
);

const WebhookIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2"/>
    <path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06"/>
    <path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8"/>
  </svg>
);

const BarChartIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

export default function PublicIntegrations() {
  const integrations = [
    {
      name: 'Slack',
      icon: <SlackIcon className="w-8 h-8 text-[#4A154B]" />,
      description: 'Get real-time notifications for link milestones and team activity directly in your Slack channels.'
    },
    {
      name: 'Zapier',
      icon: <Zap className="w-8 h-8 text-[#FF4A00]" />,
      description: 'Connect Dragolink to 5,000+ apps. Automate your link creation and analytics workflows without code.'
    },
    {
      name: 'Webhooks',
      icon: <WebhookIcon className="w-8 h-8 text-brand" />,
      description: 'Build custom workflows by subscribing to real-time events when links are created, updated, or clicked.'
    },
    {
      name: 'Salesforce',
      icon: <Blocks className="w-8 h-8 text-[#00A1E0]" />,
      description: 'Sync your click data with your CRM to enrich lead profiles and track campaign attribution automatically.'
    },
    {
      name: 'HubSpot',
      icon: <Blocks className="w-8 h-8 text-[#FF7A59]" />,
      description: 'Automatically append UTM parameters and sync tracking data directly to your marketing hub.'
    },
    {
      name: 'Google Analytics',
      icon: <BarChartIcon className="w-8 h-8 text-[#E37400]" />,
      description: 'Seamlessly forward UTM parameters and click events to Google Analytics 4.'
    }
  ];

  return (
    <div className="bg-bg-light min-h-screen font-sans">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-emerald/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-extrabold text-brand-dark mb-6 tracking-tight"
        >
          Connect Dragolink to <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-emerald">your favorite tools</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-text-secondary max-w-3xl mx-auto mb-5 leading-relaxed"
        >
          Automate your workflows, sync your analytics, and enrich your CRM data without writing a single line of code. Dragolink plugs into the tools your team already uses — from Slack to Salesforce, Zapier to HubSpot.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Whether you need real-time notifications, automated link creation, or CRM attribution — our native integrations and Webhook API make it effortless. Connect once and let your data flow automatically, so your team can focus on growth instead of manual data entry.
        </motion.p>
      </section>

      {/* Grid Section */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-surface-light border border-border-light rounded-3xl p-8 hover:shadow-xl hover:border-brand/30 transition-all group"
            >
              <div className="mb-6 group-hover:scale-110 transition-transform">
                {integration.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">{integration.name}</h3>
              <p className="text-text-secondary leading-relaxed mb-6">{integration.description}</p>
              <span className="text-brand font-medium flex items-center gap-1">
                Available now <ArrowRight className="w-4 h-4" />
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-surface-light border-y border-border-light text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-dark mb-6">Need a custom integration?</h2>
          <p className="text-lg text-text-secondary mb-8">
            Our Enterprise plan includes custom engineering support to integrate Dragolink directly into your proprietary internal tools.
          </p>
          <a href="mailto:sales@dragolink.com">
            <Button size="lg" className="h-14 px-10 text-lg">Contact Sales</Button>
          </a>
        </div>
      </section>
    </div>
  );
}

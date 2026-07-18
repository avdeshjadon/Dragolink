import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe, Activity, Lock, Key, Users, FileText, Zap, Server, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { api } from '../lib/axios';

const iconMap = { ShieldCheck, Globe, Activity, Lock, Key, Users, FileText, Zap, Server };

const DEFAULT_DATA = {
  hero: {
    subtitle: "ENTERPRISE SECURITY",
    title1: "Governance your ",
    title2: "security team trusts.",
    description: "At Dragolink, security isn't an afterthought. Our entire infrastructure is designed from the ground up to protect your links, your users, and your data at global scale."
  },
  badges: [
    { title: "SOC2 Type II", icon: "ShieldCheck" },
    { title: "GDPR Compliant", icon: "Globe" },
    { title: "HIPAA Ready", icon: "Activity" },
    { title: "ISO 27001", icon: "Lock" }
  ],
  features: [
    { title: "SSO & SAML", description: "Enterprise-grade security integrations supporting SAML and Single Sign-On (SSO) for seamless identity management.", icon: "Key" },
    { title: "End-to-End Encryption", description: "All data is encrypted at rest (AES-256) and in transit (TLS 1.3), ensuring absolute privacy.", icon: "Lock" },
    { title: "Granular Role-Based Access (RBAC)", description: "Define custom roles and permissions down to the workspace and individual link level.", icon: "Users" },
    { title: "Comprehensive Audit Logs", description: "Immutable logs track every user action, API request, and configuration change for compliance.", icon: "FileText" }
  ]
};

export default function Security() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/public/pages/security')
      .then(res => {
        try {
          setData(JSON.parse(res.data.htmlContent));
        } catch (e) {
          console.error("Failed to load CMS data:", e);
          setData(DEFAULT_DATA);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-emerald-500 font-mono">Loading Security Protocols...</div>;
  }

  if (!data || !data.hero) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-500 font-mono">Content not available.</div>;
  }

  const { hero, badges, features } = data;

  return (
    <div className="bg-[#050505] min-h-screen font-sans pb-24 text-gray-100 overflow-hidden relative selection:bg-brand/30">
      
      {/* Dark Mode Background Effects */}
      <div className="fixed top-0 left-0 w-full h-[800px] bg-gradient-to-b from-brand/10 to-transparent pointer-events-none" />
      <div className="fixed top-1/4 right-0 w-[600px] h-[600px] bg-brand-emerald/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none translate-x-1/2" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 border-b border-white/10 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-8 tracking-tight leading-[1.05]">
              {hero.title1} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-emerald">{hero.title2}</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12">
              {hero.description}
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <Button size="lg" className="h-14 px-8 bg-white text-black hover:bg-gray-200">
                View SOC2 Report
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 border-white/20 text-white hover:bg-white/10 backdrop-blur-md">
                Contact Security Team
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Compliance Badges */}
      <section className="py-20 bg-white/[0.02] border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-sm font-mono text-gray-500 tracking-widest uppercase mb-2">Certifications & Compliance</h2>
            <p className="text-2xl font-bold text-white">Independently verified by industry leaders.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {badges.map((badge, idx) => {
              const Icon = iconMap[badge.icon] || ShieldCheck;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 text-center hover:border-brand-emerald/50 hover:bg-white/5 transition-all group"
                >
                  <div className="w-16 h-16 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-emerald/20 transition-colors">
                    <Icon className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div className="font-bold text-white text-lg">{badge.title}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Deep-dive Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="mb-16">
          <h2 className="text-4xl font-extrabold text-white mb-4">Architected for absolute security.</h2>
          <p className="text-xl text-gray-400 max-w-2xl">Discover the infrastructure that protects your data at scale.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat, idx) => {
            const Icon = iconMap[feat.icon] || Lock;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/[0.02] border border-white/10 rounded-3xl p-10 hover:bg-white/[0.04] transition-colors relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <Icon className="w-32 h-32 text-white" />
                </div>
                
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand/20 to-brand-emerald/20 border border-white/10 flex items-center justify-center mb-6 relative z-10 backdrop-blur-md">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{feat.title}</h3>
                <p className="text-gray-400 leading-relaxed relative z-10">{feat.description}</p>
                
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-sm font-bold text-brand hover:text-brand-emerald transition-colors cursor-pointer relative z-10">
                  Read Technical Docs <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
        <div className="bg-gradient-to-r from-brand to-brand-emerald rounded-[3rem] p-px overflow-hidden shadow-2xl">
          <div className="bg-[#050505] rounded-[2.95rem] p-12 md:p-20 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent pointer-events-none" />
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 relative z-10">Need a custom security review?</h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto relative z-10">Our sales engineering team can walk you through our complete architecture, data flow diagrams, and compliance reports.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Button size="lg" className="h-16 px-10 text-lg bg-white text-black hover:bg-gray-200">
                Contact Enterprise Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

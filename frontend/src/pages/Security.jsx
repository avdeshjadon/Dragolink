import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe, Activity, Lock, Key, Users, FileText, Zap, Server, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { api } from '../lib/axios';

const iconMap = { ShieldCheck, Globe, Activity, Lock, Key, Users, FileText, Zap, Server };

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
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-brand font-mono">Loading Security Protocols...</div>;
  }

  if (!data || !data.hero) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-gray-500 font-mono">Content not available.</div>;
  }

  const { hero, badges, features, sections } = data;

  return (
    <div className="bg-bg-light min-h-screen font-sans pb-24 text-gray-900 overflow-hidden relative">
      
      {/* Light Mode Background Effects */}
      <div className="fixed top-0 left-0 w-full h-[800px] bg-gradient-to-b from-brand/5 to-transparent pointer-events-none" />

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center px-4 sm:px-6 lg:px-8 border-b border-border-light z-10 pt-16 pb-24">
        <div className="max-w-5xl mx-auto text-center w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight leading-[1.05]">
              {hero.title1} <br/>
              <span className="text-brand">{hero.title2}</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
              {hero.description}
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <Button size="lg" className="h-14 px-8 cursor-pointer">
                View SOC2 Report
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 cursor-pointer bg-white">
                Contact Security Team
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Compliance Badges */}
      <section className="py-20 bg-white border-b border-border-light relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-sm font-mono text-gray-500 tracking-widest uppercase mb-2">Certifications & Compliance</h2>
            <p className="text-2xl font-bold text-gray-900">Independently verified by industry leaders.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {badges?.map((badge, idx) => {
              const Icon = iconMap[badge.icon] || ShieldCheck;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-bg-light border border-border-light rounded-2xl p-6 text-center hover:border-brand/50 hover:shadow-md transition-all group"
                >
                  <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:bg-brand/10 transition-colors">
                    <Icon className="w-8 h-8 text-brand" />
                  </div>
                  <div className="font-bold text-gray-900 text-lg">{badge.title}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Security Features */}
      {features && features.length > 0 && (
        <section className="py-24 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Enterprise-Grade Security Features</h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">Built from the ground up to keep your organization safe.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, idx) => {
                const Icon = iconMap[feature.icon] || ShieldCheck;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-8 rounded-3xl bg-white border border-border-light shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-brand" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Detailed Policies (Sections) */}
      {sections && sections.length > 0 && (
        <section className="py-24 bg-white border-t border-border-light relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Detailed Security Policies</h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">In-depth information on how we handle and protect your data.</p>
            </div>
            
            <div className="space-y-16">
              {sections.map((section, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="prose prose-lg prose-gray max-w-none"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b border-border-light pb-2">{section.title}</h3>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {section.content}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

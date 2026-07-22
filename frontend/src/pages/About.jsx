import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Activity, Globe, Zap, Heart, Users, Target, Link } from 'lucide-react';
import { api } from '../lib/axios';

const iconMap = { Shield, Eye, Activity, Globe, Zap, Heart, Users, Target };



export default function About() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/public/pages/about')
      .then(res => {
        try {
          setData(JSON.parse(res.data.htmlContent));
        } catch (e) {
          console.error("Failed to parse About CMS data:", e);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">Loading...</div>;
  }

  if (!data || !data.hero) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">Content not available.</div>;
  }

  const { hero, stats, values, team, story, milestones } = data;

  return (
    <div className="bg-bg-light min-h-screen font-sans pb-32 text-brand-dark overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 border-b border-border-light overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-emerald/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            
            <h1 className="text-5xl lg:text-8xl font-extrabold text-brand-dark mb-8 tracking-tight leading-[1.05]">
              {hero.title1} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-emerald">{hero.title2}</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              {hero.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-surface-light border-b border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-6xl font-extrabold text-brand-dark mb-2">{stat.val}</div>
                <div className="text-sm font-bold text-text-secondary uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story & Milestones */}
      {(story || (milestones && milestones.length > 0)) && (
        <section className="py-24 bg-white border-b border-border-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16 items-start">
            
            {/* Story Text */}
            {story && (
              <div className="lg:w-1/2">
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <h2 className="text-4xl font-extrabold text-brand-dark mb-6">{story.title}</h2>
                  <div className="text-lg text-text-secondary leading-relaxed whitespace-pre-line space-y-4">
                    {story.content}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Milestones */}
            {milestones && milestones.length > 0 && (
              <div className="lg:w-1/2 w-full pl-0 lg:pl-12 border-l border-border-light">
                <div className="space-y-12">
                  {milestones.map((ms, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative"
                    >
                      <div className="absolute -left-[57px] lg:-left-[65px] top-1 w-6 h-6 rounded-full bg-surface-light border-4 border-brand-emerald shadow-sm hidden lg:block" />
                      <div className="text-brand-emerald font-bold text-xl mb-2">{ms.year}</div>
                      <h3 className="text-2xl font-extrabold text-brand-dark mb-2">{ms.title}</h3>
                      <p className="text-text-secondary leading-relaxed">{ms.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Values Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-brand-dark mb-4">Our Core Values</h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">The principles that guide every feature we build and every decision we make.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val, idx) => {
            const Icon = iconMap[val.icon] || Shield;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-surface-light border border-border-light rounded-3xl p-10 hover:shadow-xl transition-shadow group"
              >
                <div className="w-16 h-16 rounded-2xl bg-brand-emerald/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-brand-emerald" />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-4">{val.title}</h3>
                <p className="text-text-secondary leading-relaxed">{val.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-24 bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold mb-4">Leadership Team</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">The people behind the product.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {team.map((member, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white/10 group-hover:border-brand-emerald transition-colors">
                  <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                <p className="text-brand-emerald font-medium mb-4">{member.role}</p>
                <a href={member.linkedin} className="inline-flex text-white/50 hover:text-white transition-colors">
                  <Link className="w-5 h-5" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

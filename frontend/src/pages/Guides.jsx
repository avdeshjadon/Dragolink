import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Link as LinkIcon, Share2, Compass, ArrowRight, PlayCircle, Clock, GraduationCap, CheckCircle2, BookOpen, Video, TrendingUp, Shield, Globe, Zap } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { api } from '../lib/axios';

const iconMap = {
  Target, LinkIcon, Share2, BookOpen, Video, TrendingUp, Shield, Globe, Zap
};

export default function Guides() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/public/pages/guides')
      .then(res => {
        setData(JSON.parse(res.data.htmlContent));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">Loading Guides...</div>;
  }

  if (!data || !data.hero) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">Guides data not available.</div>;
  }

  const { hero, tracks, guides, newsletter } = data;

  return (
    <div className="bg-bg-light min-h-screen font-sans pb-24 text-brand-dark overflow-hidden">
      
      {/* Academy Hero */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 border-b border-border-light">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-emerald/10 opacity-60 blur-[150px] rounded-full mix-blend-multiply pointer-events-none translate-x-1/3 -translate-y-1/3" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-light border border-border-light text-brand-emerald text-sm font-medium mb-6 shadow-sm">
              <GraduationCap className="w-4 h-4" /> {hero.badgeText}
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-brand-dark mb-6 tracking-tight leading-[1.1]">
              {hero.title1} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-emerald">{hero.title2}</span>
            </h1>
            
            <p className="text-xl text-text-secondary max-w-xl leading-relaxed mb-10">
              {hero.subtitle}
            </p>
            
            <div className="flex gap-4">
              <Button size="lg" className="h-14 px-8 bg-brand-dark text-white hover:bg-brand-dark/90 shadow-xl shadow-brand-dark/10">
                Start Learning <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 border-border-light text-brand-dark hover:bg-black/5 bg-surface-light">
                Browse Catalog
              </Button>
            </div>
          </motion.div>
          
          {/* Featured Hero Guide */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative group cursor-pointer"
          >
            <div className="absolute -inset-1 bg-gradient-to-br from-brand to-brand-emerald rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
            <div className="relative bg-surface-light border border-border-light rounded-3xl overflow-hidden shadow-2xl">
              <div className="h-48 w-full bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden flex items-center justify-center border-b border-border-light">
                 <PlayCircle className="w-20 h-20 text-brand-dark/20 group-hover:text-brand-emerald transition-colors duration-500 group-hover:scale-110 shadow-sm rounded-full" />
              </div>
              <div className="p-8 bg-surface-light">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-brand-emerald/10 text-brand font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider border border-brand-emerald/20">New Masterclass</span>
                  <span className="text-text-secondary text-sm flex items-center gap-1.5"><Clock className="w-4 h-4"/> 45 min video</span>
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-3 group-hover:text-brand-emerald transition-colors">Architecting Global Link Infrastructure</h3>
                <p className="text-text-secondary mb-6">Learn how Fortune 500 companies build resilient, low-latency link architectures.</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-sm text-white">MC</div>
                  <div className="text-sm">
                    <div className="font-bold text-brand-dark">Michael Chen</div>
                    <div className="text-text-secondary">VP of Engineering</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Learning Tracks */}
      <section className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-brand-dark mb-2">Your Learning Tracks</h2>
        <p className="text-text-secondary mb-12 text-lg">Structured curricula designed to take you from beginner to expert.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tracks.map((track, idx) => (
            <div key={idx} className="bg-surface-light border border-border-light shadow-lg rounded-3xl p-8 hover:shadow-xl hover:border-brand/30 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${track.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-brand-dark">{track.progress}%</div>
                  <div className="text-xs font-bold text-text-secondary uppercase tracking-wider">Completed</div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-brand-dark mb-2">{track.title}</h3>
              <p className="text-text-secondary text-sm mb-8 line-clamp-2">{track.desc}</p>
              
              <div className="w-full h-2 bg-border-light rounded-full overflow-hidden mb-4">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${track.progress}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className={`h-full bg-gradient-to-r ${track.color}`}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-text-secondary font-medium">
                <span>{track.courses} Courses</span>
                <span>{track.time} Total</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Individual Guides Library */}
      <section className="pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-brand-dark mb-2">Latest Guides</h2>
            <p className="text-text-secondary text-lg">Dive into specific topics and tutorials.</p>
          </div>
          <Button variant="ghost" className="text-brand-emerald hover:bg-brand-emerald/10 font-bold">
            View All Guides <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {guides.map((guide, idx) => {
            const Icon = iconMap[guide.icon] || Target;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-surface-light border border-border-light shadow-md p-6 md:p-8 rounded-3xl hover:shadow-xl hover:border-brand/30 transition-all group flex flex-col md:flex-row gap-8 md:items-center cursor-pointer relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-emerald/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className={`w-20 h-20 rounded-2xl ${guide.color} border flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform relative z-10`}>
                  <Icon className="w-8 h-8" />
                </div>
              
              <div className="flex-1 relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${guide.color} backdrop-blur-sm`}>
                    {guide.level}
                  </span>
                  <span className="text-sm font-medium text-text-secondary flex items-center gap-1.5">
                    <Clock className="w-4 h-4"/> {guide.time}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-2 group-hover:text-brand-emerald transition-colors">{guide.title}</h3>
                <p className="text-text-secondary leading-relaxed line-clamp-2 max-w-3xl">{guide.desc}</p>
              </div>
              
              <div className="shrink-0 relative z-10">
                <div className="w-12 h-12 rounded-full bg-bg-light border border-border-light flex items-center justify-center group-hover:bg-brand-emerald group-hover:text-white group-hover:border-transparent transition-all shadow-sm">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          )})}
        </div>
      </section>

      {/* Academy Newsletter CTA */}
      <section className="mt-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-brand-dark rounded-[3rem] p-12 text-center border border-brand-dark/10 relative overflow-hidden shadow-2xl">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-emerald/20 via-transparent to-transparent blur-[80px]" />
           
           <div className="relative z-10">
             <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner">
                <CheckCircle2 className="w-8 h-8 text-brand-emerald" />
             </div>
             <h2 className="text-3xl font-bold text-white mb-4">{newsletter.title}</h2>
             <p className="text-white/70 max-w-xl mx-auto mb-8 text-lg">{newsletter.description}</p>
             
             <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
               <input 
                 type="email" 
                 placeholder="Enter your work email" 
                 className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 h-14 text-white placeholder:text-white/50 focus:outline-none focus:border-brand-emerald transition-colors backdrop-blur-md"
               />
               <Button size="lg" className="h-14 px-8 bg-brand-emerald text-brand-dark font-bold hover:bg-brand border-none">
                 Subscribe
               </Button>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}

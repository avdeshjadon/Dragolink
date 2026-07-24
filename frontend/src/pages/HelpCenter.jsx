import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Zap } from 'lucide-react';
import { api } from '../lib/axios';

export default function HelpCenter() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/public/pages/help')
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
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">Loading Help Center...</div>;
  }

  if (!data || !data.hero) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">Help Center data not available.</div>;
  }

  const { hero, trending } = data;
  return (
    <div className="bg-bg-light min-h-screen font-sans pb-24 text-brand-dark overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        {/* Abstract Glowing Backgrounds */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand/20 opacity-40 blur-[150px] rounded-full mix-blend-multiply pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-emerald/20 opacity-30 blur-[150px] rounded-full mix-blend-multiply pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-brand-dark mb-6 tracking-tight leading-tight">
              {hero.title1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-emerald to-brand">{hero.title2}</span>
            </h1>
            
            {/* Glassmorphic Search Bar */}
            <div className="max-w-3xl mx-auto relative mt-12 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-emerald to-brand rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />
              <div className="relative flex items-center bg-white/90 backdrop-blur-xl border border-border-light rounded-2xl h-20 px-6 shadow-xl">
                <Search className="w-7 h-7 text-text-secondary mr-4" />
                <input 
                  type="text" 
                  placeholder={hero.searchPlaceholder} 
                  className="flex-1 bg-transparent border-none text-xl text-brand-dark placeholder:text-text-secondary focus:outline-none focus:ring-0"
                />
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-light border border-border-light text-text-secondary text-sm font-mono shadow-sm">
                  <span className="text-lg">⌘</span> <span>K</span>
                </div>
              </div>
            </div>

            {/* Trending Shortcuts */}
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <span className="text-text-secondary text-sm font-medium mr-2 flex items-center">Trending:</span>
              {trending.map((topic, i) => (
                <button key={i} className="px-4 py-1.5 rounded-full bg-surface-light border border-border-light text-sm text-text-secondary hover:bg-black/5 hover:text-brand-dark transition-colors shadow-sm">
                  {topic}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>


    </div>
  );
}

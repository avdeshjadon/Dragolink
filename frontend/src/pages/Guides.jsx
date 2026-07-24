import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { api } from '../lib/axios';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Guides() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeGuideIndex, setActiveGuideIndex] = useState(0);

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

  const { hero, guides, newsletter } = data;

  return (
    <div className="bg-bg-light min-h-screen font-sans pb-24 text-brand-dark">
      
      {/* Minimal Hero */}
      <section className="min-h-[calc(100vh-80px)] flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center border-b border-border-light">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-brand-dark mb-6 tracking-tight leading-[1.1]">
            {hero.title1} <span className="text-brand">{hero.title2}</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            {hero.subtitle}
          </p>
        </motion.div>
      </section>

      {/* Guides Layout */}
      <section className="pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Navigation Sidebar */}
          <div className="lg:w-1/4 shrink-0">
            <div className="sticky top-28">
              <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-6">Directory</h3>
              <nav className="flex flex-col gap-2">
                {guides?.map((guide, idx) => {
                  const isActive = activeGuideIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveGuideIndex(idx)}
                      className={`text-left px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                        isActive 
                          ? 'bg-brand/10 text-brand' 
                          : 'text-text-secondary hover:bg-surface-light hover:text-brand-dark'
                      }`}
                    >
                      {guide.title}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Reading Content */}
          <div className="lg:w-3/4 max-w-3xl">
            {guides && guides[activeGuideIndex] && (
              <motion.article 
                key={activeGuideIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <header className="mb-12">
                  <div className="text-brand font-medium text-sm tracking-widest uppercase mb-4">
                    {guides[activeGuideIndex].time}
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-extrabold text-brand-dark mb-6 leading-tight tracking-tight">
                    {guides[activeGuideIndex].title}
                  </h2>
                  <p className="text-xl text-text-secondary leading-relaxed border-l-4 border-brand/30 pl-4">
                    {guides[activeGuideIndex].desc}
                  </p>
                </header>

                <div 
                  className="max-w-none text-gray-600 leading-relaxed
                    [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-brand-dark [&_h1]:mt-8 [&_h1]:mb-4
                    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-brand-dark [&_h2]:mt-8 [&_h2]:mb-4
                    [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-brand-dark [&_h3]:mt-6 [&_h3]:mb-3
                    [&_p]:mb-4
                    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2
                    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2
                    [&_a]:text-brand [&_a]:hover:underline [&_a]:font-medium
                    [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:mb-4 [&_pre]:text-sm [&_pre]:font-mono [&_pre]:leading-relaxed [&_pre]:shadow-sm
                    [&_code]:bg-gray-100 [&_code]:text-brand-dark [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:border [&_code]:border-gray-200
                    [&_blockquote]:border-l-4 [&_blockquote]:border-brand/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:bg-brand/5 [&_blockquote]:py-2 [&_blockquote]:pr-4 [&_blockquote]:rounded-r-lg
                    [&_strong]:font-bold [&_strong]:text-gray-900"
                  dangerouslySetInnerHTML={{ __html: guides[activeGuideIndex].content || "<p><em>No content available for this guide yet.</em></p>" }}
                />
              </motion.article>
            )}
          </div>

        </div>
      </section>

      {/* Minimal Newsletter CTA */}
      <section className="mt-32 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="bg-surface-light rounded-3xl p-10 md:p-14 text-center border border-border-light shadow-sm">
           <h2 className="text-2xl font-bold text-brand-dark mb-4">{newsletter?.title}</h2>
           <p className="text-text-secondary mb-8">{newsletter?.description}</p>
           
           <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
             <input 
               type="email" 
               placeholder="Enter your email" 
               className="flex-1 bg-white border border-border-light rounded-xl px-4 h-12 focus:outline-none focus:border-brand transition-colors"
             />
             <Button className="h-12 px-8 bg-brand-dark text-white hover:bg-brand transition-colors">
               Subscribe
             </Button>
           </div>
        </div>
      </section>

    </div>
  );
}

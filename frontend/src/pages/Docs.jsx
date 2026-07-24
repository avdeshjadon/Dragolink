import { useState, useEffect } from 'react';
import { Book, Code, Terminal, Zap, Shield, Key, ArrowRight, Hash, Database, Loader2 } from 'lucide-react';
import { api } from '../lib/axios';

const iconMap = {
  Book: <Book className="w-4 h-4" />,
  Shield: <Shield className="w-4 h-4" />,
  Database: <Database className="w-4 h-4" />,
  Terminal: <Terminal className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />
};

export default function Docs() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    api.get('/public/pages/docs')
      .then(res => {
        if (res.data && res.data.htmlContent) {
          const parsed = JSON.parse(res.data.htmlContent);
          setData(parsed);
          if (parsed.sections && parsed.sections.length > 0) {
            setActiveSection(parsed.sections[0].id);
          }
        }
      })
      .catch(err => console.error("Failed to load docs", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!data) return;
    const handleScroll = () => {
      const sectionElements = data.sections.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(data.sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [data]);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  if (!data || !data.sections) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-bg-light text-text-secondary gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Connection Error</h2>
        <p>Could not connect to the API server. It might be starting up.</p>
        <button onClick={() => window.location.reload()} className="px-5 py-2 mt-2 bg-brand text-white rounded-lg font-bold shadow-sm hover:bg-brand-dark transition-colors cursor-pointer">Try Again</button>
      </div>
    );
  }

  return (
    <div className="bg-bg-light min-h-screen font-sans text-brand-dark pt-24 pb-24 flex justify-center">
      <div className="max-w-[1400px] w-full px-4 sm:px-6 lg:px-8 flex items-start gap-12">
        
        {/* Sidebar */}
        <aside className="w-64 hidden lg:block sticky top-32 shrink-0">
          <h2 className="text-sm font-bold tracking-wider text-text-secondary uppercase mb-6">Documentation</h2>
          <nav className="space-y-1 border-l border-border-light ml-2">
            {data.sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className={`w-full text-left pl-4 py-2 text-sm font-medium transition-colors flex items-center gap-3 relative -ml-[1px] border-l-2
                  \${activeSection === section.id 
                    ? 'border-brand text-brand' 
                    : 'border-transparent text-text-secondary hover:text-brand-dark hover:border-border-dark'
                  }`}
              >
                {iconMap[section.icon] || <Book className="w-4 h-4" />}
                {section.title}
              </button>
            ))}
          </nav>
          

        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-3xl">
          {data.sections.map((section, index) => (
            <section key={section.id} id={section.id} className="mb-20 scroll-mt-32">
              
              {/* Title & Introduction */}
              {index === 0 ? (
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-6 tracking-tight flex items-center gap-4">
                  Dragolink API
                </h1>
              ) : (
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  {section.title}
                </h2>
              )}
              
              {section.content && (
                <p className="text-lg text-text-secondary mb-8 leading-relaxed whitespace-pre-wrap">
                  {section.content}
                </p>
              )}

              {/* Alert / Warning */}
              {section.alert && (
                <div className="bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald p-4 rounded-xl flex items-start gap-3 mb-8">
                  <Shield className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <strong className="font-bold block mb-1">{section.alert.title}</strong>
                    {section.alert.message}
                  </div>
                </div>
              )}

              {/* Endpoints List */}
              {section.endpoints && section.endpoints.map((ep, i) => (
                <div key={i} className="mb-12">
                  <h3 className="text-xl font-bold mb-4">{ep.title}</h3>
                  <p className="text-text-secondary mb-4">{ep.description}</p>
                  
                  <div className="flex items-center gap-3 mb-6 bg-surface-light p-3 rounded-lg border border-border-light w-fit">
                    <span className={`font-bold px-2 py-1 rounded text-xs ${ep.method === 'GET' ? 'bg-blue-500/10 text-blue-600' : 'bg-green-500/10 text-green-600'}`}>
                      {ep.method}
                    </span>
                    <code className="text-sm font-mono font-medium">{ep.path}</code>
                  </div>

                  {ep.parameters && (
                    <>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-4">Parameters</h4>
                      <div className="border border-border-light rounded-xl overflow-hidden mb-8">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-surface-light text-text-secondary">
                            <tr>
                              <th className="px-4 py-3 font-semibold border-b border-border-light">Property</th>
                              <th className="px-4 py-3 font-semibold border-b border-border-light">Type</th>
                              <th className="px-4 py-3 font-semibold border-b border-border-light">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-light">
                            {ep.parameters.map((param, j) => (
                              <tr key={j}>
                                <td className="px-4 py-3 align-top">
                                  <span className="font-mono font-bold text-brand-dark block mb-1">{param.name}</span>
                                  {param.required && <span className="text-xs text-red-500 font-semibold uppercase">Required</span>}
                                </td>
                                <td className="px-4 py-3 font-mono text-text-secondary align-top">{param.type}</td>
                                <td className="px-4 py-3 text-text-secondary align-top">{param.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  {ep.codeSnippet && (
                    <div className="bg-bg-light rounded-xl overflow-hidden shadow-sm border border-border-light">
                      <div className="bg-surface-light px-4 py-2 border-b border-border-light text-xs text-text-secondary font-mono font-bold flex items-center justify-between">
                        <span>{ep.codeSnippet.title}</span>
                        <span className="uppercase text-[10px] tracking-wider text-text-muted">{ep.codeSnippet.language}</span>
                      </div>
                      <div className="p-4 overflow-x-auto text-sm text-brand-dark font-mono bg-[#FAFAFA]">
                        <pre><code>{ep.codeSnippet.code}</code></pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Top Level Code Snippet */}
              {section.codeSnippet && !section.endpoints && (
                <div className="bg-bg-light rounded-xl overflow-hidden shadow-sm border border-border-light mt-8">
                  <div className="bg-surface-light px-4 py-2 border-b border-border-light text-xs text-text-secondary font-mono font-bold flex items-center justify-between">
                    <span>{section.codeSnippet.title}</span>
                    <span className="uppercase text-[10px] tracking-wider text-text-muted">{section.codeSnippet.language}</span>
                  </div>
                  <div className="p-4 overflow-x-auto text-sm text-brand-dark font-mono bg-[#FAFAFA]">
                    <pre><code>{section.codeSnippet.code}</code></pre>
                  </div>
                </div>
              )}

              {/* Errors List */}
              {section.errorsList && (
                <div className="border border-border-light rounded-xl overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-surface-light text-text-secondary">
                      <tr>
                        <th className="px-4 py-3 font-semibold border-b border-border-light">Code</th>
                        <th className="px-4 py-3 font-semibold border-b border-border-light">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light">
                      {section.errorsList.map((err, i) => (
                        <tr key={i}>
                          <td className="px-4 py-3 font-mono font-bold text-brand-dark whitespace-nowrap">{err.code}</td>
                          <td className="px-4 py-3 text-text-secondary">{err.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}

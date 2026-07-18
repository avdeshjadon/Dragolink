import { Book, Code, Terminal, Zap } from 'lucide-react';

export default function Docs() {
  return (
    <div className="bg-bg-light min-h-screen font-sans pb-24 text-brand-dark">
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center border-b border-border-light">
        <h1 className="text-4xl md:text-6xl font-extrabold text-brand-dark mb-6 tracking-tight">
          Documentation
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Everything you need to integrate Dragolink into your applications.
        </p>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { title: 'Getting Started', icon: <Zap className="w-6 h-6 text-brand" />, desc: 'Quickly get up and running with our API.' },
          { title: 'API Reference', icon: <Code className="w-6 h-6 text-brand" />, desc: 'Detailed endpoints, parameters, and responses.' },
          { title: 'Webhooks', icon: <Terminal className="w-6 h-6 text-brand" />, desc: 'Real-time event notifications for your links.' },
          { title: 'SDKs & Libraries', icon: <Book className="w-6 h-6 text-brand" />, desc: 'Official client libraries for Node, Python, and more.' }
        ].map((item, idx) => (
          <div key={idx} className="bg-surface-light border border-border-light rounded-3xl p-8 hover:border-brand-emerald transition-colors cursor-pointer group">
            <div className="bg-white border border-border-light w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand/10">
              {item.icon}
            </div>
            <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
            <p className="text-text-secondary">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Terminal, Shield, Zap, Code2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function PublicAPI() {
  const codeSnippet = `curl -X POST https://api.dragolink.com/v1/links \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "originalUrl": "https://example.com/very/long/url",
    "domain": "drg.link",
    "customAlias": "summer-sale",
    "tags": ["marketing", "q3"]
  }'`;

  return (
    <div className="bg-bg-light min-h-screen font-sans">
      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl lg:text-6xl font-extrabold text-brand-dark mb-6 tracking-tight leading-[1.1]">
              Link infrastructure <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-emerald">built for scale</span>
            </h1>
            <p className="text-xl text-text-secondary mb-4 leading-relaxed max-w-lg">
              Integrate short links, QR codes, and deep analytics directly into your product in minutes with our clean REST API. Engineered for extreme reliability, ultra-low latency, and teams that ship fast.
            </p>
            <ul className="space-y-2 mb-10">
              {[
                'RESTful endpoints with JSON responses',
                'Scoped API keys with role-based access',
                'Webhooks for real-time event delivery',
                'OpenAPI spec + Postman collection included',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-text-secondary text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="h-14 px-8 text-lg shadow-lg shadow-brand/20">
                  Generate API Key
                </Button>
              </Link>
              <a href="https://docs.dragolink.com" target="_blank" rel="noreferrer">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-surface-light border-2">
                  Read the Docs
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Terminal visual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-[2rem] overflow-hidden bg-[#0D1117] shadow-2xl border border-white/10"
          >
            <div className="flex items-center gap-2 px-6 py-4 bg-white/5 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-xs font-mono text-white/40">create_link.sh</span>
            </div>
            <div className="p-6 overflow-x-auto">
              <pre className="text-sm text-green-400 font-mono leading-relaxed">
                <code>{codeSnippet}</code>
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-surface-light border-y border-border-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8">
              <Zap className="w-10 h-10 text-brand mb-6" />
              <h3 className="text-xl font-bold text-brand-dark mb-3">&lt;20ms Latency</h3>
              <p className="text-text-secondary">Globally distributed edge nodes ensure your links resolve instantly, no matter where your users are.</p>
            </div>
            <div className="p-8">
              <Shield className="w-10 h-10 text-brand mb-6" />
              <h3 className="text-xl font-bold text-brand-dark mb-3">Enterprise Security</h3>
              <p className="text-text-secondary">SOC2 Type II compliant with role-based scoped API keys and strict rate-limiting options.</p>
            </div>
            <div className="p-8">
              <Code2 className="w-10 h-10 text-brand mb-6" />
              <h3 className="text-xl font-bold text-brand-dark mb-3">Webhooks</h3>
              <p className="text-text-secondary">Get real-time push notifications for link clicks, analytics milestones, and account events.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

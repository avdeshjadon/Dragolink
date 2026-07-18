import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Building, ArrowRight, Send } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { api } from '../lib/axios';

const DEFAULT_DATA = {
  hero: {
    subtitle: "CONTACT SALES",
    title1: "Let's build something ",
    title2: "incredible together.",
    description: "Get in touch with our enterprise sales team to discuss custom pricing, SLA requirements, and tailored infrastructure solutions for your business."
  },
  offices: [
    { city: "San Francisco", address: "100 Market St, Suite 400\nSan Francisco, CA 94105", phone: "+1 (800) 555-0199", email: "sf@dragolink.com" },
    { city: "London", address: "250 Bishopsgate\nLondon EC2M 4AA, UK", phone: "+44 20 7946 0958", email: "london@dragolink.com" },
    { city: "Singapore", address: "8 Marina View, Asia Square\nSingapore 018960", phone: "+65 6511 9223", email: "apac@dragolink.com" }
  ],
  emails: [
    { dept: "Enterprise Sales", email: "sales@dragolink.com" },
    { dept: "Press & Media", email: "press@dragolink.com" },
    { dept: "Partnerships", email: "partners@dragolink.com" }
  ]
};

export default function Contact() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formStatus, setFormStatus] = useState('idle');

  useEffect(() => {
    api.get('/public/pages/contact')
      .then(res => {
        try {
          setData(JSON.parse(res.data.htmlContent));
        } catch (e) {
          console.error("Failed to parse Contact CMS data:", e);
          setData(DEFAULT_DATA);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => setFormStatus('success'), 1500);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">Loading...</div>;
  }

  if (!data || !data.hero) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">Content not available.</div>;
  }

  const { hero, offices, emails } = data;

  return (
    <div className="bg-bg-light min-h-screen font-sans pb-24 text-brand-dark overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column: Info */}
          <div className="w-full lg:w-1/2">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-brand-dark mb-6 tracking-tight leading-[1.05]">
                {hero.title1} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-emerald">{hero.title2}</span>
              </h1>
              
              <p className="text-xl text-text-secondary leading-relaxed mb-16 max-w-lg">
                {hero.description}
              </p>
            </motion.div>

            <div className="space-y-16">
              {/* Offices */}
              <div>
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3"><Building className="w-6 h-6 text-brand" /> Global Offices</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {offices.map((office, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <h4 className="font-bold text-lg mb-3">{office.city}</h4>
                      <div className="space-y-3 text-sm text-text-secondary font-medium">
                        <div className="flex items-start gap-3">
                           <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-brand-emerald" />
                           <span className="whitespace-pre-line leading-relaxed">{office.address}</span>
                        </div>
                        {office.phone && (
                          <div className="flex items-center gap-3">
                             <Phone className="w-4 h-4 shrink-0 text-brand-emerald" />
                             <span>{office.phone}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Emails */}
              <div>
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3"><Mail className="w-6 h-6 text-brand" /> Contact Directory</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {emails.map((item, idx) => (
                    <div key={idx} className="bg-surface-light border border-border-light rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">{item.dept}</div>
                      <a href={`mailto:${item.email}`} className="font-medium text-brand hover:text-brand-dark transition-colors">{item.email}</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-brand-emerald/20 blur-3xl rounded-[3rem] -z-10" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
            >
              {formStatus === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-24">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 border-4 border-emerald-50">
                     <Send className="w-8 h-8 text-emerald-600 ml-1" />
                  </div>
                  <h3 className="text-3xl font-bold text-brand-dark mb-4">Message Sent!</h3>
                  <p className="text-text-secondary text-lg">Our enterprise team will get back to you within 24 hours.</p>
                  <Button className="mt-8" onClick={() => setFormStatus('idle')}>Send another message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-3xl font-extrabold text-brand-dark mb-8">Send us a message</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">First Name <span className="text-red-500">*</span></label>
                      <input required type="text" className="w-full bg-surface-light border border-border-light rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" placeholder="Jane" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Last Name <span className="text-red-500">*</span></label>
                      <input required type="text" className="w-full bg-surface-light border border-border-light rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Work Email <span className="text-red-500">*</span></label>
                    <input required type="email" className="w-full bg-surface-light border border-border-light rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" placeholder="jane@company.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Company Name</label>
                    <input type="text" className="w-full bg-surface-light border border-border-light rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" placeholder="Acme Corp" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">How can we help? <span className="text-red-500">*</span></label>
                    <textarea required className="w-full bg-surface-light border border-border-light rounded-xl px-4 py-3 h-32 resize-none focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" placeholder="Tell us about your link infrastructure needs..." />
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full h-14 text-lg mt-4 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" disabled={formStatus === 'submitting'}>
                    {formStatus === 'submitting' ? 'Sending...' : 'Send Message'} <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  
                  <p className="text-xs text-center text-text-secondary font-medium px-6">
                    By submitting this form, you agree to our <a href="/privacy" className="text-brand hover:underline">Privacy Policy</a> and <a href="/terms" className="text-brand hover:underline">Terms of Service</a>.
                  </p>
                </form>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}

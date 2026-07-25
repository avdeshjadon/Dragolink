import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Building, ArrowRight, Send, Loader2, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { api } from '../lib/axios';

export default function Contact() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formStatus, setFormStatus] = useState('idle');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    message: ''
  });

  useEffect(() => {
    api.get('/public/pages/contact')
      .then(res => {
        try {
          setData(JSON.parse(res.data.htmlContent));
        } catch (e) {
          console.error("Failed to parse Contact CMS data:", e);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    try {
      await api.post('/public/contact', formData);
      setFormStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', companyName: '', message: '' });
    } catch (err) {
      console.error(err);
      setFormStatus('error');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-brand"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  if (!data || !data.hero) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">Content not available.</div>;
  }

  const { hero, offices, emails } = data;

  return (
    <div className="bg-bg-light min-h-screen font-sans overflow-hidden">
      
      {/* Premium Header */}
      <section className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand/5 to-transparent -z-10" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-emerald/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <h1 className="text-5xl md:text-7xl font-extrabold text-brand-dark mb-6 tracking-tight leading-[1.05]">
              {hero.title1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-emerald">{hero.title2}</span>
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              {hero.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left: Contact Form (Spans 7 cols) */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-brand/5 border border-border-light relative overflow-hidden"
            >


              <h2 className="text-3xl font-extrabold text-brand-dark mb-2 flex items-center gap-3">
                <MessageCircle className="w-8 h-8 text-brand" /> Send a Message
              </h2>
              <p className="text-text-secondary mb-10">Fill out the form below and our enterprise team will connect with you.</p>

              <AnimatePresence mode="wait">
                {formStatus === 'success' ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center py-16"
                  >
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 border-8 border-emerald-50">
                       <Send className="w-10 h-10 text-emerald-600 ml-1" />
                    </div>
                    <h3 className="text-3xl font-bold text-brand-dark mb-4">Message Sent!</h3>
                    <p className="text-text-secondary text-lg max-w-md">Thank you for reaching out. A specialist will get back to you within 24 hours.</p>
                    <Button className="mt-8" onClick={() => setFormStatus('idle')}>Send Another Message</Button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit} 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-dark">First Name <span className="text-red-500">*</span></label>
                        <input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="w-full bg-bg-light border border-border-light rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all placeholder:text-gray-400" placeholder="Jane" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-dark">Last Name <span className="text-red-500">*</span></label>
                        <input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="w-full bg-bg-light border border-border-light rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all placeholder:text-gray-400" placeholder="Doe" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-dark">Work Email <span className="text-red-500">*</span></label>
                        <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full bg-bg-light border border-border-light rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all placeholder:text-gray-400" placeholder="jane@company.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-dark">Company Name</label>
                        <input name="companyName" value={formData.companyName} onChange={handleChange} type="text" className="w-full bg-bg-light border border-border-light rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all placeholder:text-gray-400" placeholder="Acme Corp" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-brand-dark">How can we help? <span className="text-red-500">*</span></label>
                      <textarea required name="message" value={formData.message} onChange={handleChange} className="w-full bg-bg-light border border-border-light rounded-xl px-4 py-4 h-40 resize-none focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all placeholder:text-gray-400 leading-relaxed" placeholder="Tell us about your link infrastructure needs, expected volume, or specific compliance requirements..." />
                    </div>
                    
                    {formStatus === 'error' && <p className="text-red-500 text-sm font-bold">Failed to send message. Please try again.</p>}

                    <Button type="submit" size="lg" className="w-full h-14 text-lg mt-4 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer" disabled={formStatus === 'submitting'}>
                      {formStatus === 'submitting' ? <><Loader2 className="w-5 h-5 animate-spin mr-2"/> Sending...</> : <>Send Message <ArrowRight className="w-5 h-5 ml-2" /></>}
                    </Button>
                    
                    <p className="text-xs text-center text-text-secondary font-medium px-6">
                      By submitting this form, you agree to our <a href="/privacy" className="text-brand hover:underline">Privacy Policy</a> and <a href="/terms" className="text-brand hover:underline">Terms of Service</a>.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right: Info Cards (Spans 5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="space-y-8">
              
              {/* Offices */}
              <div className="bg-white rounded-2xl p-8 border border-border-light shadow-sm">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-brand-dark"><Building className="w-6 h-6 text-brand" /> Global Offices</h3>
                <div className="space-y-8">
                  {offices.map((office, idx) => (
                    <div key={idx} className="group">
                      <h4 className="font-bold text-lg mb-2 text-brand-dark group-hover:text-brand transition-colors">{office.city}</h4>
                      <div className="space-y-2 text-sm text-text-secondary font-medium">
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
                    </div>
                  ))}
                </div>
              </div>

              {/* Emails */}
              <div className="bg-brand-dark rounded-2xl p-8 shadow-xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3"><Mail className="w-6 h-6 text-brand-emerald" /> Direct Contact</h3>
                <div className="space-y-6 relative z-10">
                  {emails.map((item, idx) => (
                    <div key={idx}>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{item.dept}</div>
                      <a href={`mailto:${item.email}`} className="text-lg font-medium text-white hover:text-brand-emerald transition-colors">{item.email}</a>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </section>

    </div>
  );
}

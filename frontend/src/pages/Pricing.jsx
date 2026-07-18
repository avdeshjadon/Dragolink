import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { api } from '../lib/axios';

export default function Pricing() {
  const [annual, setAnnual] = useState(true);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/public/pages/pricing')
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
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">Loading pricing...</div>;
  }

  if (!data || !data.plans) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">Pricing plans not available.</div>;
  }

  const { hero, plans } = data;

  return (
    <div className="bg-bg-light min-h-screen py-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-6 tracking-tight"
          >
            {hero?.title || 'Simple, transparent pricing'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-text-secondary"
          >
            {hero?.subtitle || 'Choose the plan that best fits your needs and start scaling your links today.'}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center items-center gap-4 mt-10"
          >
            <span className={`text-sm font-semibold ${!annual ? 'text-brand-dark' : 'text-text-secondary'}`}>Monthly billing</span>
            <button 
              onClick={() => setAnnual(!annual)}
              className="w-14 h-7 rounded-full bg-surface-light border border-border-light relative transition-colors focus:outline-none"
            >
              <div className={`w-5 h-5 rounded-full bg-brand absolute top-0.5 transition-transform ${annual ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
            <span className={`text-sm font-semibold ${annual ? 'text-brand-dark' : 'text-text-secondary'}`}>
              Annual billing <span className="text-brand-emerald bg-brand-emerald/10 px-2 py-0.5 rounded ml-1 text-xs">Save 20%</span>
            </span>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
              className={`bg-surface-light rounded-3xl p-8 border ${plan.popular ? 'border-brand shadow-xl relative' : 'border-border-light shadow-md'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-text-primary mb-2">{plan.name}</h3>
                <p className="text-text-secondary text-sm h-10">{plan.description}</p>
              </div>
              
              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-extrabold text-brand-dark">${annual ? plan.priceAnnual : plan.priceMonthly}</span>
                  <span className="text-text-secondary font-medium mb-1">/mo</span>
                </div>
                {(annual ? plan.priceAnnual : plan.priceMonthly) > 0 && (
                  <p className="text-xs text-text-secondary mt-2">
                    Billed {annual ? 'annually' : 'monthly'}
                  </p>
                )}
              </div>
              
              <Button 
                variant={plan.popular ? 'primary' : 'outline'} 
                className="w-full mb-8 h-12 text-base"
              >
                Get Started
              </Button>
              
              <div className="space-y-4">
                <p className="text-sm font-bold text-text-primary uppercase tracking-wider">What's included</p>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                      <Check className="w-5 h-5 text-brand-emerald shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.notIncluded.length > 0 && (
                  <>
                    <div className="border-t border-border-light my-4"></div>
                    <ul className="space-y-3 opacity-60">
                      {plan.notIncluded.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                          <X className="w-5 h-5 text-text-secondary shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </div>
  );
}

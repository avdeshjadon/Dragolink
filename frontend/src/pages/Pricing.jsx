import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for individuals and small projects getting started.',
      price: 0,
      features: [
        'Up to 500 links/month',
        'Basic click analytics',
        'Standard support',
        'Dragolink branding on QR codes',
        '30-day data retention',
      ],
      notIncluded: [
        'Custom domains',
        'Advanced geographic data',
        'API access',
        'Team collaboration',
      ]
    },
    {
      name: 'Pro',
      description: 'Ideal for growing businesses that need more power and customization.',
      price: annual ? 29 : 35,
      popular: true,
      features: [
        'Up to 10,000 links/month',
        'Advanced analytics dashboard',
        'Priority email support',
        'Custom QR codes with logo',
        '1-year data retention',
        'Up to 3 custom domains',
        'Basic API access (100 req/min)',
      ],
      notIncluded: [
        'Advanced SSO integrations',
        'Dedicated success manager',
      ]
    },
    {
      name: 'Business',
      description: 'For large teams and enterprises requiring massive scale.',
      price: annual ? 99 : 119,
      features: [
        'Unlimited links',
        'Enterprise analytics & reporting',
        '24/7 dedicated support',
        'Fully white-labeled experience',
        'Unlimited data retention',
        'Unlimited custom domains',
        'High-volume API access',
        'SAML SSO integration',
        'Role-based access control',
      ],
      notIncluded: []
    }
  ];

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
            Simple, transparent pricing
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-text-secondary"
          >
            No hidden fees. No surprise charges. Choose the plan that best fits your needs and start scaling your links today.
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
                  <span className="text-5xl font-extrabold text-brand-dark">${plan.price}</span>
                  <span className="text-text-secondary font-medium mb-1">/mo</span>
                </div>
                {plan.price > 0 && (
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

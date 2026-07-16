import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, BarChart3, Shield, Zap } from 'lucide-react';
import DecryptedText from '../components/DecryptedText';
import { motion } from 'motion/react';

export default function Landing() {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] w-full">
      {/* Hero Section (SaaS 3.0 Light Mode) */}
      <section className="relative overflow-hidden pt-32 pb-32 lg:pt-40 lg:pb-40 w-full px-4 sm:px-6 lg:px-8 bg-white flex flex-col items-center justify-center min-h-[90vh]">
        
        {/* Animated Dot Grid Background */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-60"></div>
        
        {/* Ambient Light Mode Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
          <div className="absolute top-[10%] left-[20%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[20%] w-[50%] h-[50%] rounded-full bg-emerald-400/10 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto w-full">
          

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-6xl font-extrabold tracking-tight text-slate-900 sm:text-7xl lg:text-8xl mb-8 leading-[1.1] z-10"
          >
            <DecryptedText text="Short links," animateOn="view" speed={30} maxIterations={8} />{' '}
            <DecryptedText 
              text="big results." 
              animateOn="view" 
              speed={40}
              maxIterations={12}
              parentClassName="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400 relative inline-block"
            />
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="max-w-2xl text-xl text-slate-600 mb-10 leading-relaxed z-10"
          >
            A powerful, scalable URL shortener and analytics platform built for modern teams.
            Create, manage, and track your links with unparalleled ease.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 mb-10 w-full justify-center max-w-md lg:max-w-none mx-auto z-10"
          >
            <Link to="/register" className="group inline-flex justify-center items-center rounded-xl bg-slate-900 px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-slate-800 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
              Get Started for free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="inline-flex justify-center items-center rounded-xl bg-white border border-slate-200 px-8 py-4 text-base font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-300">
              Log in to account
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-sm font-semibold text-slate-500 z-10"
          >
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> No credit card required</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Cancel anytime</span>
          </motion.div>


          
        </div>
      </section>

      {/* Features Section (Typography-Driven) */}
      <section className="bg-white py-32 px-4 sm:px-6 lg:px-8 w-full relative z-20 -mt-10 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight">Built for scale.</h2>
            <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">Everything you need to grow your brand, understand your audience, and secure your links.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Card 1 */}
            <div className="group relative pt-12">
              <div className="absolute -top-10 -left-6 text-[12rem] font-extrabold text-slate-100 select-none z-0 tracking-tighter group-hover:-translate-y-4 group-hover:text-primary/5 transition-all duration-500">
                01
              </div>
              <div className="relative z-10 flex flex-col border-l-2 border-slate-200 pl-8 group-hover:border-primary transition-colors duration-300">
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Custom Aliases</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Ditch the random strings. Create branded links that stand out, build trust with your audience, and perfectly match your marketing campaigns.
                </p>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="group relative pt-12">
              <div className="absolute -top-10 -left-6 text-[12rem] font-extrabold text-slate-100 select-none z-0 tracking-tighter group-hover:-translate-y-4 group-hover:text-primary/5 transition-all duration-500">
                02
              </div>
              <div className="relative z-10 flex flex-col border-l-2 border-slate-200 pl-8 group-hover:border-primary transition-colors duration-300">
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Detailed Analytics</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Track clicks in real-time. Gain actionable insights into your audience with detailed metrics on devices, browsers, and geographic locations.
                </p>
              </div>
            </div>
            
            {/* Card 3 */}
            <div className="group relative pt-12">
              <div className="absolute -top-10 -left-6 text-[12rem] font-extrabold text-slate-100 select-none z-0 tracking-tighter group-hover:-translate-y-4 group-hover:text-primary/5 transition-all duration-500">
                03
              </div>
              <div className="relative z-10 flex flex-col border-l-2 border-slate-200 pl-8 group-hover:border-primary transition-colors duration-300">
                <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Enterprise Security</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Keep your platform and users safe. We offer built-in rate limiting, intelligent phishing detection, and proactive blocked domain filtering.
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}

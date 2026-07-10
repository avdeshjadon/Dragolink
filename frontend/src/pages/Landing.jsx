import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { BarChart3, Link as LinkIcon, ShieldCheck, Zap } from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex flex-col items-center justify-center pt-20 pb-32 text-center">
      <div className="mb-8 inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-800 shadow-sm">
        <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
        The modern URL shortener
      </div>
      
      <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl mb-8">
        Short links, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">big results.</span>
      </h1>
      
      <p className="max-w-2xl text-lg text-slate-600 mb-10">
        A powerful, scalable URL shortener and analytics platform built for modern teams.
        Create, manage, and track your links with ease.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-24">
        <Link to="/register" className="inline-flex justify-center items-center rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all">
          Get Started for free
        </Link>
        <Link to="/login" className="inline-flex justify-center items-center rounded-lg bg-white border border-slate-300 px-8 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
          Log in to your account
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full text-left">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start hover:shadow-md transition-shadow">
          <div className="bg-blue-100 p-3 rounded-lg mb-4 text-blue-600">
            <LinkIcon className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Custom Aliases</h3>
          <p className="text-slate-600">Create branded links that stand out and build trust with your audience.</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start hover:shadow-md transition-shadow">
          <div className="bg-green-100 p-3 rounded-lg mb-4 text-green-600">
            <BarChart3 className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Detailed Analytics</h3>
          <p className="text-slate-600">Track clicks, devices, browsers, and referrers in real-time.</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-start hover:shadow-md transition-shadow">
          <div className="bg-purple-100 p-3 rounded-lg mb-4 text-purple-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Abuse Protection</h3>
          <p className="text-slate-600">Built-in rate limiting and blocked domains to keep the platform safe.</p>
        </div>
      </div>
    </div>
  );
}

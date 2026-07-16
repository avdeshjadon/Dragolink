import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { User, Lock, Mail, ShieldCheck, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light flex font-sans">
      
      {/* Left Form Section */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 border-r border-border-light relative z-10 bg-surface-light">
        <div className="mx-auto w-full max-w-sm">
          
          <div className="mb-10 text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <img src="/dragolink.svg" alt="LinkPulse Logo" className="h-10 w-10" />
            </Link>
            <h2 className="text-3xl font-extrabold text-brand-dark tracking-tight">Create an account</h2>
            <p className="mt-2 text-sm text-text-secondary">Join LinkPulse to master your links</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                {error}
              </motion.div>
            )}

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-text-primary">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-text-secondary" />
                </div>
                <Input
                  type="text"
                  required
                  className="pl-9"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-text-primary">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-text-secondary" />
                </div>
                <Input
                  type="email"
                  required
                  className="pl-9"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-text-primary">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-text-secondary" />
                </div>
                <Input
                  type="password"
                  required
                  minLength="6"
                  className="pl-9"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base mt-2" isLoading={isLoading}>
              Create account
            </Button>
            
          </form>

          <p className="mt-8 text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand hover:text-brand-dark transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Product Section */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center relative overflow-hidden bg-brand-dark text-surface-light">
        <div className="absolute inset-0 bg-[radial-gradient(#15803D_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-emerald/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
        
        <div className="relative z-10 max-w-lg px-8">
          <div className="mb-12">
            <h3 className="text-3xl font-bold mb-4">Start optimizing today</h3>
            <p className="text-lg text-border-light/80">Join thousands of teams who trust LinkPulse for their link management and analytics.</p>
          </div>
          
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-4 items-start bg-surface-dark p-6 rounded-2xl border border-brand/20"
            >
              <div className="bg-brand-emerald p-3 rounded-xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Actionable Insights</h4>
                <p className="text-border-light/70 text-sm mt-1">Make data-driven decisions with detailed click analytics and reports.</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 items-start bg-surface-dark p-6 rounded-2xl border border-brand/20"
            >
              <div className="bg-brand p-3 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Built for Scale</h4>
                <p className="text-border-light/70 text-sm mt-1">From small projects to enterprise infrastructure, LinkPulse scales with you.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

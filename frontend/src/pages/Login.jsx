import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { ArrowRight, Lock, Mail, ShieldCheck, Zap, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
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
            <h2 className="text-3xl font-extrabold text-brand-dark tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm text-text-secondary">Log in to your account to continue</p>
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
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-text-primary">Password</label>
                <Link to="/forgot-password" className="text-sm font-medium text-brand hover:text-brand-dark transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-text-secondary" />
                </div>
                <Input
                  type="password"
                  required
                  className="pl-9"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base mt-2" isLoading={isLoading}>
              Sign in
            </Button>
            
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-light"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface-light text-text-secondary">Or continue with</span>
              </div>
            </div>
            
            <Button variant="outline" type="button" className="w-full h-11 text-base font-semibold">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-brand hover:text-brand-dark transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Product Section */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center relative overflow-hidden bg-brand-dark text-surface-light">
        <div className="absolute inset-0 bg-[radial-gradient(#15803D_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
        
        <div className="relative z-10 max-w-lg px-8">
          <div className="mb-12">
            <h3 className="text-3xl font-bold mb-4">Master your link infrastructure</h3>
            <p className="text-lg text-border-light/80">Everything you need to grow your brand, understand your audience, and secure your links.</p>
          </div>
          
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-4 items-start bg-surface-dark p-6 rounded-2xl border border-brand/20"
            >
              <div className="bg-brand p-3 rounded-xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Advanced Analytics</h4>
                <p className="text-border-light/70 text-sm mt-1">Get real-time insights on your audience, devices, and geographic locations.</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 items-start bg-surface-dark p-6 rounded-2xl border border-brand/20"
            >
              <div className="bg-brand-emerald p-3 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Enterprise Security</h4>
                <p className="text-border-light/70 text-sm mt-1">Protect your links with passwords, expiration dates, and built-in abuse prevention.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

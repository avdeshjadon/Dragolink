import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Briefcase, Clock, DollarSign, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { api } from '../lib/axios';
import { useAuth } from '../context/AuthContext';

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  useEffect(() => {
    // Fetch all careers data and find the specific job
    api.get('/public/pages/careers')
      .then(res => {
        try {
          const data = JSON.parse(res.data.htmlContent);
          const foundJob = data.jobs?.find(j => j.id === jobId);
          setJob(foundJob || null);
        } catch (e) {
          console.error("Failed to parse Careers CMS data:", e);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [jobId]);

  const handleApplyClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    navigate(`/careers/${jobId}/apply`);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">Loading job details...</div>;
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-light">
        <h2 className="text-3xl font-bold text-brand-dark mb-4">Job Not Found</h2>
        <p className="text-text-secondary mb-8">This position may have been filled or the link is incorrect.</p>
        <Link to="/careers">
          <Button size="lg">View Open Positions</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-bg-light min-h-screen font-sans pb-32 text-brand-dark">
      {/* Header */}
      <div className="bg-surface-light border-b border-border-light pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/careers" className="inline-flex items-center text-text-secondary hover:text-brand mb-8 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Careers
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-6 leading-tight">
            {job.title}
          </h1>
          
          <div className="flex flex-wrap gap-4 text-sm font-medium text-text-secondary">
            <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-border-light shadow-sm">
              <Briefcase className="w-4 h-4 text-brand-emerald" /> {job.dept}
            </span>
            <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-border-light shadow-sm">
              <MapPin className="w-4 h-4 text-brand-emerald" /> {job.loc}
            </span>
            {job.type && (
              <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-border-light shadow-sm">
                <Clock className="w-4 h-4 text-brand-emerald" /> {job.type}
              </span>
            )}
            {job.salary && (
              <span className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-border-light shadow-sm">
                <DollarSign className="w-4 h-4 text-brand-emerald" /> {job.salary}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          {job.description && (
            <section>
              <h3 className="text-2xl font-bold text-brand-dark mb-4">About the Role</h3>
              <p className="text-lg text-text-secondary leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </section>
          )}

          {job.responsibilities && job.responsibilities.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-brand-dark mb-6">What You'll Do</h3>
              <ul className="space-y-4">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-brand-emerald shrink-0 mt-0.5" />
                    <span className="text-lg text-text-secondary leading-relaxed">{resp}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {job.requirements && job.requirements.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-brand-dark mb-6">What We're Looking For</h3>
              <ul className="space-y-4">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-brand shrink-0 mt-2.5 ml-2" />
                    <span className="text-lg text-text-secondary leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Sidebar Apply Card */}
        <div className="relative">
          <div className="sticky top-32 bg-white rounded-2xl border border-border-light p-6 shadow-xl shadow-brand/5">
            <h3 className="text-xl font-bold text-brand-dark mb-2">Ready to join us?</h3>
            <p className="text-text-secondary text-sm mb-6">Submit your application below and our team will get back to you within 48 hours.</p>
            <Button size="lg" className="w-full h-14 bg-brand text-white text-lg font-bold hover:bg-brand-dark shadow-md cursor-pointer" onClick={handleApplyClick}>
              Apply Now
            </Button>
          </div>
        </div>
      </div>

      {/* Auth Required Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowAuthModal(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-8 h-8 text-brand" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
              <p className="text-gray-500 mb-8">You need to be logged into your Dragolink account to submit a job application.</p>
              <div className="flex flex-col gap-3">
                <Button size="lg" className="w-full cursor-pointer" onClick={() => {
                  // Navigate to login but with intent to return to application flow
                  navigate('/login', { state: { from: { pathname: `/careers/${jobId}/apply` } } });
                }}>
                  Log In or Sign Up
                </Button>
                <button onClick={() => setShowAuthModal(false)} className="py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

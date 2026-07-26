import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ChevronRight, ChevronLeft, Briefcase } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { api } from '../lib/axios';
import { useAuth } from '../context/AuthContext';

export default function JobApplicationForm() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    contactNumber: '',
    linkedinUrl: '',
    resumeUrl: '',
    coverLetter: '',
    highSchoolPercentage: '',
    seniorSecondaryPercentage: '',
    degreeCgpa: '',
    laptopOs: 'Windows',
    laptopRam: '8GB',
    laptopProcessor: 'Intel i5 / AMD Ryzen 5 or equivalent',
    programmingLanguages: '',
    spokenLanguages: '',
    yearsOfExperience: '',
    noticePeriod: 'Immediate',
    expectedCtc: ''
  });

  useEffect(() => {
    if (!user) {
      alert("Please log in to submit a job application.");
      navigate('/login', { state: { from: location } });
      return;
    }

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
  }, [jobId, user, navigate, location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    
    const applicationPayload = {
      ...formData,
      jobRole: job.title,
      highSchoolPercentage: parseFloat(formData.highSchoolPercentage),
      seniorSecondaryPercentage: parseFloat(formData.seniorSecondaryPercentage),
      degreeCgpa: parseFloat(formData.degreeCgpa),
      yearsOfExperience: parseFloat(formData.yearsOfExperience)
    };
    
    try {
      await api.post('/applications', applicationPayload);
      setIsSuccess(true);
    } catch (error) {
      console.error("Failed to submit application", error);
      alert("An error occurred while submitting your application. Please try again.");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">Loading application...</div>;
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-light">
        <h2 className="text-3xl font-bold text-brand-dark mb-4">Job Not Found</h2>
        <p className="text-text-secondary mb-8">This position may have been filled or the link is incorrect.</p>
        <Link to="/careers">
          <Button size="lg">Back to Careers</Button>
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-bg-light flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl p-12 text-center flex flex-col items-center justify-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">Thank you for applying to be a {job.title}. You can track your application status in your dashboard.</p>
          <div className="flex gap-4">
            <Button size="lg" className="px-10 cursor-pointer" onClick={() => navigate('/applications')}>Go to My Applications</Button>
            <Button size="lg" variant="outline" className="px-10 cursor-pointer" onClick={() => navigate('/careers')}>Browse Other Jobs</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const stepVariants = {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { x: -20, opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-bg-light font-sans text-brand-dark pb-20 pt-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link to={`/careers/${jobId}`} className="inline-flex items-center text-text-secondary hover:text-brand transition-colors font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Job
          </Link>
          <div className="bg-brand/10 text-brand px-4 py-1.5 rounded-full font-bold text-sm flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> {job.title}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-light mb-8">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full -z-10"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand rounded-full -z-10 transition-all duration-500 ease-out" 
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            ></div>
            
            {['Basic Info', 'Education', 'Experience', 'Final Details'].map((label, index) => {
              const stepNum = index + 1;
              const isActive = currentStep === stepNum;
              const isPast = currentStep > stepNum;
              
              return (
                <div key={label} className="flex flex-col items-center gap-2 bg-white px-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                    isActive ? 'bg-brand text-white shadow-md shadow-brand/20' : 
                    isPast ? 'bg-brand text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : stepNum}
                  </div>
                  <span className={`text-xs font-semibold ${isActive || isPast ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl shadow-brand/5 border border-border-light overflow-hidden">
          <div className="p-8 md:p-10">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Job Application</h1>
            <p className="text-gray-500 mb-8">Step {currentStep} of {totalSteps}</p>
            
            <form onSubmit={e => e.preventDefault()}>
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div key="step1" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                    <h3 className="text-xl font-bold border-b pb-2">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">First Name <span className="text-red-500">*</span></label>
                        <input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Last Name <span className="text-red-500">*</span></label>
                        <input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Email Address <span className="text-red-500">*</span></label>
                        <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Contact Number <span className="text-red-500">*</span></label>
                        <input required name="contactNumber" value={formData.contactNumber} onChange={handleChange} type="tel" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand outline-none transition-all" placeholder="+1..." />
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div key="step2" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                    <h3 className="text-xl font-bold border-b pb-2">Academics & Education</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">10th Percentage <span className="text-red-500">*</span></label>
                        <input required name="highSchoolPercentage" value={formData.highSchoolPercentage} onChange={handleChange} type="number" step="0.01" min="0" max="100" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand outline-none transition-all" placeholder="e.g. 85.5" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">12th Percentage <span className="text-red-500">*</span></label>
                        <input required name="seniorSecondaryPercentage" value={formData.seniorSecondaryPercentage} onChange={handleChange} type="number" step="0.01" min="0" max="100" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand outline-none transition-all" placeholder="e.g. 88.0" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-gray-700">Degree CGPA (out of 10) <span className="text-red-500">*</span></label>
                        <input required name="degreeCgpa" value={formData.degreeCgpa} onChange={handleChange} type="number" step="0.01" min="0" max="10" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand outline-none transition-all" placeholder="e.g. 8.2" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div key="step3" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                    <h3 className="text-xl font-bold border-b pb-2">Skills & Professional Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Programming Languages <span className="text-red-500">*</span></label>
                        <input required name="programmingLanguages" value={formData.programmingLanguages} onChange={handleChange} type="text" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand outline-none transition-all" placeholder="Java, Python, C++..." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Spoken Languages <span className="text-red-500">*</span></label>
                        <input required name="spokenLanguages" value={formData.spokenLanguages} onChange={handleChange} type="text" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand outline-none transition-all" placeholder="English, Spanish..." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Years of Experience <span className="text-red-500">*</span></label>
                        <input required name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} type="number" step="0.1" min="0" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand outline-none transition-all" placeholder="e.g. 2.5" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Expected CTC (Annual) <span className="text-red-500">*</span></label>
                        <input required name="expectedCtc" value={formData.expectedCtc} onChange={handleChange} type="text" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand outline-none transition-all" placeholder="$80,000 / 12 LPA" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-semibold text-gray-700">Notice Period <span className="text-red-500">*</span></label>
                        <select name="noticePeriod" value={formData.noticePeriod} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand outline-none transition-all bg-white">
                          <option value="Immediate">Immediate</option>
                          <option value="15 Days">15 Days</option>
                          <option value="1 Month">1 Month</option>
                          <option value="2 Months">2 Months</option>
                          <option value="3 Months+">3 Months+</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div key="step4" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                    <section className="space-y-6">
                      <h3 className="text-xl font-bold border-b pb-2">IT Setup Configuration</h3>
                      <p className="text-xs text-text-secondary">Used to provision correct equipment for remote/hybrid roles.</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Laptop OS</label>
                          <select name="laptopOs" value={formData.laptopOs} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand outline-none transition-all bg-white">
                            <option value="Windows">Windows</option>
                            <option value="macOS">macOS</option>
                            <option value="Linux">Linux</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Required RAM</label>
                          <select name="laptopRam" value={formData.laptopRam} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand outline-none transition-all bg-white">
                            <option value="8GB">8GB</option>
                            <option value="16GB">16GB</option>
                            <option value="32GB">32GB</option>
                            <option value="64GB+">64GB+</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Preferred Processor</label>
                          <select name="laptopProcessor" value={formData.laptopProcessor} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand outline-none transition-all bg-white">
                            <option value="Intel i5 / AMD Ryzen 5 or equivalent">Intel i5 / AMD Ryzen 5</option>
                            <option value="Intel i7 / AMD Ryzen 7 or equivalent">Intel i7 / AMD Ryzen 7</option>
                            <option value="Intel i9 / AMD Ryzen 9 or equivalent">Intel i9 / AMD Ryzen 9</option>
                            <option value="Apple M-Series">Apple M-Series</option>
                          </select>
                        </div>
                      </div>
                    </section>

                    <section className="space-y-6">
                      <h3 className="text-xl font-bold border-b pb-2">Links & Documents</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">LinkedIn Profile URL <span className="text-red-500">*</span></label>
                          <input required name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} type="url" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand outline-none transition-all" placeholder="https://linkedin.com/in/..." />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Resume / CV Link <span className="text-red-500">*</span></label>
                          <input required name="resumeUrl" value={formData.resumeUrl} onChange={handleChange} type="url" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand outline-none transition-all" placeholder="Link to Google Drive, Dropbox, etc." />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Cover Letter (Optional)</label>
                          <textarea name="coverLetter" value={formData.coverLetter} onChange={handleChange} className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand outline-none transition-all h-32" placeholder="Tell us why you'd be a great fit..."></textarea>
                        </div>
                      </div>
                    </section>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={prevStep} 
                  disabled={currentStep === 1}
                  className="px-6 flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button type="submit" onClick={nextStep} className="px-8 flex items-center gap-2">
                    Next Step <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button type="submit" onClick={handleSubmit} className="px-10 flex items-center gap-2 bg-brand text-white hover:bg-brand-dark shadow-lg shadow-brand/20">
                    Submit Application <CheckCircle2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

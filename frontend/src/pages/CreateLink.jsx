import { useState } from 'react';
import { api } from '../lib/axios';
import { Link, useNavigate } from 'react-router-dom';
import { Copy, Download, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function CreateLink() {
  const [formData, setFormData] = useState({
    longUrl: '',
    customAlias: '',
    title: '',
    expiryDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdLink, setCreatedLink] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [copied, setCopied] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const payload = { ...formData };
      if (!payload.customAlias) delete payload.customAlias;
      if (!payload.title) delete payload.title;
      if (!payload.expiryDate) delete payload.expiryDate;
      else payload.expiryDate = new Date(payload.expiryDate).toISOString();

      const { data } = await api.post('/links', payload);
      setCreatedLink(data);
      setSuccess(true);
      
      // Fetch QR Code
      try {
        const qrRes = await api.get(`/links/${data.id}/qr`);
        setQrCode(qrRes.data.qrCode);
      } catch (qrErr) {
        console.error("Failed to load QR code");
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const url = `http://localhost:8080/${createdLink.customAlias || createdLink.shortCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (success && createdLink) {
    const shortUrl = `http://localhost:8080/${createdLink.customAlias || createdLink.shortCode}`;
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Link Created Successfully!</h2>
          <p className="text-slate-600 mb-8">Your long URL has been shortened and is ready to share.</p>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between mb-8">
            <span className="text-lg font-medium text-slate-900 truncate mr-4">{shortUrl}</span>
            <button 
              onClick={copyToClipboard}
              className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {copied ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          
          {qrCode && (
            <div className="mb-8 flex flex-col items-center">
              <p className="text-sm font-medium text-slate-700 mb-4">QR Code</p>
              <div className="p-4 bg-white border border-slate-200 rounded-xl inline-block mb-4">
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
              </div>
              <a 
                href={qrCode} 
                download={`qr-${createdLink.customAlias || createdLink.shortCode}.png`}
                className="flex items-center gap-2 text-primary hover:text-primary-hover font-medium text-sm"
              >
                <Download className="h-4 w-4" /> Download QR Code
              </a>
            </div>
          )}
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => { setSuccess(false); setFormData({longUrl: '', customAlias: '', title: '', expiryDate: ''}); }}
              className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Create Another
            </button>
            <Link 
              to="/links"
              className="bg-primary text-white hover:bg-primary-hover px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              View My Links
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center">
        <Link to="/dashboard" className="text-slate-500 hover:text-slate-900 flex items-center gap-2 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
      
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Create New Link</h1>
        
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Destination URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="longUrl"
              required
              placeholder="https://example.com/my-long-url-that-needs-shortening"
              value={formData.longUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Custom Alias (Optional)
              </label>
              <div className="flex rounded-xl shadow-sm">
                <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 text-slate-500 sm:text-sm">
                  /
                </span>
                <input
                  type="text"
                  name="customAlias"
                  placeholder="my-campaign"
                  value={formData.customAlias}
                  onChange={handleChange}
                  className="flex-1 min-w-0 block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-none rounded-r-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">Leave blank for a random short code.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Title (Optional)
              </label>
              <input
                type="text"
                name="title"
                placeholder="Summer Sale 2026"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Expiry Date & Time (Optional)
            </label>
            <input
              type="datetime-local"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          
          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-medium py-3 px-4 rounded-xl hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Shortening...
                </>
              ) : (
                'Shorten URL'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

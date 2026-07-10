import { useState, useEffect } from 'react';
import { api } from '../lib/axios';
import { ShieldAlert, Plus, Trash2 } from 'lucide-react';

export default function AdminDomains() {
  const [domains, setDomains] = useState([]);
  const [domain, setDomain] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const res = await api.get('/admin/blocked-domains');
      setDomains(res.data);
    } catch (err) {
      setError('Failed to load blocked domains');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/blocked-domains', { domain, reason });
      setDomains([...domains, res.data]);
      setDomain('');
      setReason('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add domain');
    }
  };

  const deleteDomain = async (id) => {
    if(!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/admin/blocked-domains/${id}`);
      setDomains(domains.filter(d => d.id !== id));
    } catch (err) {
      alert('Failed to remove domain');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="bg-red-100 p-3 rounded-lg text-red-600">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Abuse Protection</h1>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Block a Domain</h2>
        {error && <div className="mb-4 text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            required
            placeholder="example.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors flex justify-center items-center gap-2 font-medium">
            <Plus className="h-4 w-4" /> Block
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
           <div className="p-8 text-center text-slate-500">Loading...</div>
        ) : domains.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No domains blocked yet.</div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Domain</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Reason</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date Blocked</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {domains.map((d) => (
                <tr key={d.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{d.domain}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{d.reason || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => deleteDomain(d.id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

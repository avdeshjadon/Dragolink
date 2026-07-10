import { useState, useEffect } from 'react';
import { api } from '../lib/axios';
import { Link } from 'react-router-dom';
import { BarChart2, Edit, Trash2, ExternalLink, Copy, Check, Power, PowerOff } from 'lucide-react';

export default function MyLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await api.get('/links');
      setLinks(res.data);
    } catch (err) {
      setError('Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleStatus = async (id) => {
    try {
      const res = await api.patch(`/links/${id}/toggle`);
      setLinks(links.map(l => l.id === id ? res.data : l));
    } catch (err) {
      alert('Failed to toggle status');
    }
  };

  const deleteLink = async (id) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    try {
      await api.delete(`/links/${id}`);
      setLinks(links.filter(l => l.id !== id));
    } catch (err) {
      alert('Failed to delete link');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">My Links</h1>
        <Link to="/create" className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
          Create New
        </Link>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {links.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-medium text-slate-900 mb-2">No links found</h3>
            <p className="text-slate-500 mb-6">You haven't created any short links yet.</p>
            <Link to="/create" className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
              Create your first link
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Link Info</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Clicks</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {links.map((link) => {
                  const shortUrl = `http://localhost:8080/${link.customAlias || link.shortCode}`;
                  return (
                    <tr key={link.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">{link.title || link.customAlias || link.shortCode}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <a href={shortUrl} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                              {link.customAlias || link.shortCode} <ExternalLink className="h-3 w-3" />
                            </a>
                            <button onClick={() => copyToClipboard(link.id, shortUrl)} className="text-slate-400 hover:text-slate-700">
                              {copiedId === link.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </div>
                          <span className="text-xs text-slate-500 mt-1 truncate max-w-xs" title={link.longUrl}>{link.longUrl}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${link.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {link.active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {link.clickCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(link.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <Link to={`/analytics/${link.id}`} className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg" title="Analytics">
                            <BarChart2 className="h-4 w-4" />
                          </Link>
                          <button onClick={() => toggleStatus(link.id)} className={`${link.active ? 'text-amber-600 bg-amber-50 hover:text-amber-900' : 'text-green-600 bg-green-50 hover:text-green-900'} p-2 rounded-lg`} title={link.active ? 'Disable' : 'Enable'}>
                            {link.active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                          </button>
                          <button onClick={() => deleteLink(link.id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

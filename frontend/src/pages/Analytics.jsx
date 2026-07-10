import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/axios';
import { ArrowLeft, Clock, Monitor, Globe, Activity } from 'lucide-react';

export default function Analytics() {
  const { id } = useParams();
  const [clicks, setClicks] = useState([]);
  const [linkDetails, setLinkDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [clicksRes, linkRes] = await Promise.all([
          api.get(`/analytics/links/${id}`),
          api.get(`/links/${id}`)
        ]);
        setClicks(clicksRes.data);
        setLinkDetails(linkRes.data);
      } catch (err) {
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center">
        <Link to="/links" className="text-slate-500 hover:text-slate-900 flex items-center gap-2 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Links
        </Link>
      </div>

      {linkDetails && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{linkDetails.title || 'Analytics'}</h1>
            <a href={`http://localhost:8080/${linkDetails.customAlias || linkDetails.shortCode}`} target="_blank" rel="noreferrer" className="text-primary hover:underline text-lg">
              localhost:8080/{linkDetails.customAlias || linkDetails.shortCode}
            </a>
            <p className="text-slate-500 mt-1 truncate max-w-lg">{linkDetails.longUrl}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col items-center min-w-[120px]">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Clicks</span>
            <span className="text-4xl font-extrabold text-primary mt-1">{linkDetails.clickCount}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
          <Activity className="h-5 w-5 text-slate-500" />
          <h2 className="text-lg font-bold text-slate-900">Click History</h2>
        </div>
        
        {clicks.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-500">No clicks recorded yet for this link.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Time</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">IP Address</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Browser & OS</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Device</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Referrer</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {clicks.map((click, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        {new Date(click.clickedAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {click.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      <div className="font-medium">{click.browser}</div>
                      <div className="text-slate-500 text-xs">{click.operatingSystem}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-slate-400" />
                        {click.deviceType}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 truncate max-w-[200px]" title={click.referrer}>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{click.referrer || 'Direct'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

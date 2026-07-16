import { useState, useEffect } from 'react';
import { api } from '../lib/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Activity, Link as LinkIcon, Clock, MousePointerClick, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        setData(res.data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <svg className="animate-spin h-8 w-8 text-brand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>;
  if (!data) return null;

  const COLORS = ['#15803D', '#4ADE80', '#A3E635', '#0B3D2E', '#22C55E'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Good morning, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-sm text-text-secondary mt-1">Here's what's happening with your links today.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="h-9 px-3 rounded-md border border-border-light bg-surface-light text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This Month</option>
          </select>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-text-secondary">Total Links</p>
                <h3 className="text-3xl font-bold text-text-primary mt-2">{data.totalLinks}</h3>
              </div>
              <div className="bg-brand/10 p-2.5 rounded-lg text-brand">
                <LinkIcon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="flex items-center text-brand-emerald font-medium bg-brand-emerald/10 px-2 py-0.5 rounded">
                <TrendingUp className="w-3 h-3 mr-1" /> +12%
              </span>
              <span className="text-text-secondary ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-text-secondary">Total Clicks</p>
                <h3 className="text-3xl font-bold text-text-primary mt-2">{data.totalClicks}</h3>
              </div>
              <div className="bg-blue-100 p-2.5 rounded-lg text-blue-600">
                <MousePointerClick className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="flex items-center text-brand-emerald font-medium bg-brand-emerald/10 px-2 py-0.5 rounded">
                <TrendingUp className="w-3 h-3 mr-1" /> +24.5%
              </span>
              <span className="text-text-secondary ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-text-secondary">Active Links</p>
                <h3 className="text-3xl font-bold text-text-primary mt-2">{data.activeLinks}</h3>
              </div>
              <div className="bg-purple-100 p-2.5 rounded-lg text-purple-600">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-text-secondary">Links currently running</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-text-secondary">Expired Links</p>
                <h3 className="text-3xl font-bold text-text-primary mt-2">{data.expiredLinks}</h3>
              </div>
              <div className="bg-red-100 p-2.5 rounded-lg text-red-600">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-text-secondary">Requires attention</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Click Performance</CardTitle>
            <CardDescription>Link engagement over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {data.clicksByDate && data.clicksByDate.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.clicksByDate} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#15803D" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#15803D" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #DCE8E0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#15803D" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" activeDot={{ r: 6, strokeWidth: 0, fill: '#15803D' }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-full text-text-secondary">No data available</div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Links</CardTitle>
            <CardDescription>Your most active URLs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topLinks && data.topLinks.length > 0 ? (
                data.topLinks.map((link) => (
                  <div key={link.id} className="flex flex-col gap-2 p-4 bg-bg-light rounded-xl border border-border-light hover:border-brand/30 transition-colors">
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-semibold text-text-primary truncate">{link.title || 'Untitled Link'}</p>
                      <div className="flex items-center gap-1.5 shrink-0 bg-surface-light px-2.5 py-1 rounded-md border border-border-light text-xs font-bold text-text-primary shadow-sm">
                        <MousePointerClick className="h-3 w-3 text-brand" />
                        {link.clickCount}
                      </div>
                    </div>
                    <a href={link.shortUrl || `http://localhost:8080/${link.shortCode}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-brand hover:underline truncate">
                        localhost:8080/{link.customAlias || link.shortCode}
                    </a>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center h-48 text-text-secondary">No links created yet</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Clicks by Browser</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {data.clicksByBrowser && data.clicksByBrowser.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.clicksByBrowser}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="count"
                      nameKey="browser"
                    >
                      {data.clicksByBrowser.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-full text-text-secondary">No data available</div>
              )}
            </div>
            
            {/* Custom Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {data.clicksByBrowser?.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-text-secondary">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span>{entry.browser}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clicks by Device</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 mt-4">
              {data.clicksByDevice && data.clicksByDevice.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.clicksByDevice} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="device" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13}} width={80} />
                    <RechartsTooltip cursor={{fill: '#F6FAF7'}} contentStyle={{ borderRadius: '12px', border: '1px solid #DCE8E0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} />
                    <Bar dataKey="count" fill="#4ADE80" radius={[0, 6, 6, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-full text-text-secondary">No data available</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

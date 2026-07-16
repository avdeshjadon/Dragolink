import { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Analytics() {
  const { id } = useParams();

  return (
    <div className="flex flex-col h-full bg-background font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-primary-fixed-dim">Link Analytics {id && `(#${id})`}</h2>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">Comprehensive breakdown of link performance and traffic sources.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Filters */}
          <div className="flex gap-2">
            <div className="relative group">
              <button className="flex items-center gap-1 bg-surface-container px-4 py-2 rounded-lg border border-outline-variant/30 text-label-md font-label-md text-on-surface hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                Last 30 Days
                <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
              </button>
            </div>
          </div>
          {/* Export */}
          <button className="flex items-center gap-1 bg-surface-container-high px-4 py-2 rounded-lg border border-outline-variant/50 text-label-md font-label-md text-primary hover:bg-surface-bright transition-colors ml-auto md:ml-0">
            <span className="material-symbols-outlined text-[16px]">download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* Analytics Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
        
        {/* Key Metrics Overview */}
        <div className="xl:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-xl hover:border-primary transition-colors">
            <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Total Clicks</p>
            <p className="text-headline-lg font-headline-lg text-on-surface">1,248,593</p>
            <p className="text-label-sm font-label-sm text-primary mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +12.4% <span className="text-on-surface-variant">vs last month</span>
            </p>
          </div>
          <div className="glass-panel p-4 rounded-xl hover:border-primary transition-colors">
            <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Unique Visitors</p>
            <p className="text-headline-lg font-headline-lg text-on-surface">892,104</p>
            <p className="text-label-sm font-label-sm text-primary mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +8.2% <span className="text-on-surface-variant">vs last month</span>
            </p>
          </div>
          <div className="glass-panel p-4 rounded-xl hover:border-primary transition-colors">
            <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Avg. Time to Click</p>
            <p className="text-headline-lg font-headline-lg text-on-surface">2.4s</p>
            <p className="text-label-sm font-label-sm text-error mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_down</span> -0.3s <span className="text-on-surface-variant">vs last month</span>
            </p>
          </div>
          <div className="glass-panel p-4 rounded-xl hover:border-primary transition-colors">
            <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Top Campaign</p>
            <p className="text-headline-md font-headline-md text-on-surface truncate">Q3_Launch_Alpha</p>
            <p className="text-label-sm font-label-sm text-secondary mt-2">45% of total volume</p>
          </div>
        </div>

        {/* Interactive Heat Map (Section 1) */}
        <div className="xl:col-span-2 glass-panel rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-headline-md font-headline-md text-on-surface">Global Click Distribution</h3>
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
          {/* Heatmap Visualization Area */}
          <div className="flex-1 min-h-[300px] bg-surface-container-lowest rounded-lg border border-outline-variant/10 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-surface/0 to-surface/0"></div>
            {/* Overlay UI elements for the map */}
            <div className="absolute bottom-4 right-4 bg-surface-container/90 backdrop-blur px-2 py-1 rounded border border-outline-variant/30 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-code-sm font-code-sm text-on-surface-variant">Live Tracking Active</span>
            </div>
            <div className="text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined">map</span>
              Map Visualization
            </div>
          </div>
        </div>

        {/* Referrers & Browsers (Section 2) */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          {/* Referrers Chart */}
          <div className="glass-panel rounded-xl p-4 flex-1">
            <h3 className="text-label-md font-label-md text-on-surface mb-4">Top Referrers</h3>
            <div className="space-y-2">
              {/* Bar Item */}
              <div>
                <div className="flex justify-between text-label-sm font-label-sm mb-1">
                  <span className="text-on-surface">Twitter / X</span>
                  <span className="text-on-surface-variant font-code-sm">45%</span>
                </div>
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '45%' }}></div>
                </div>
              </div>
              {/* Bar Item */}
              <div>
                <div className="flex justify-between text-label-sm font-label-sm mb-1">
                  <span className="text-on-surface">LinkedIn</span>
                  <span className="text-on-surface-variant font-code-sm">28%</span>
                </div>
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-secondary" style={{ width: '28%' }}></div>
                </div>
              </div>
              {/* Bar Item */}
              <div>
                <div className="flex justify-between text-label-sm font-label-sm mb-1">
                  <span className="text-on-surface">Direct</span>
                  <span className="text-on-surface-variant font-code-sm">15%</span>
                </div>
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary" style={{ width: '15%' }}></div>
                </div>
              </div>
              {/* Bar Item */}
              <div>
                <div className="flex justify-between text-label-sm font-label-sm mb-1">
                  <span className="text-on-surface">Github</span>
                  <span className="text-on-surface-variant font-code-sm">12%</span>
                </div>
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-outline" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Browser Chart */}
          <div className="glass-panel rounded-xl p-4 flex-1">
            <h3 className="text-label-md font-label-md text-on-surface mb-4">Browser Usage</h3>
            <div className="flex items-end justify-around h-32 mt-auto">
              <div className="flex flex-col items-center gap-1 group">
                <div className="w-8 bg-primary rounded-t-sm group-hover:bg-primary-fixed transition-colors" style={{ height: '80%' }}></div>
                <span className="text-code-sm font-code-sm text-on-surface-variant">Chr</span>
              </div>
              <div className="flex flex-col items-center gap-1 group">
                <div className="w-8 bg-secondary rounded-t-sm group-hover:bg-secondary-fixed transition-colors" style={{ height: '50%' }}></div>
                <span className="text-code-sm font-code-sm text-on-surface-variant">Saf</span>
              </div>
              <div className="flex flex-col items-center gap-1 group">
                <div className="w-8 bg-tertiary rounded-t-sm group-hover:bg-tertiary-fixed transition-colors" style={{ height: '30%' }}></div>
                <span className="text-code-sm font-code-sm text-on-surface-variant">FF</span>
              </div>
              <div className="flex flex-col items-center gap-1 group">
                <div className="w-8 bg-outline rounded-t-sm group-hover:bg-outline-variant transition-colors" style={{ height: '15%' }}></div>
                <span className="text-code-sm font-code-sm text-on-surface-variant">Edg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Click Logs Table (Section 3) */}
        <div className="xl:col-span-3 glass-panel rounded-xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
            <h3 className="text-headline-md font-headline-md text-on-surface">Real-Time Click Logs</h3>
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
              <input 
                className="bg-surface-container border border-outline-variant/30 rounded-md py-2 pl-10 pr-4 text-label-sm font-label-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all w-64" 
                placeholder="Search hash, IP, or country..." 
                type="text"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container/50 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
                  <th className="p-4 font-medium">Timestamp</th>
                  <th className="p-4 font-medium">Link Hash</th>
                  <th className="p-4 font-medium">Country</th>
                  <th className="p-4 font-medium hidden sm:table-cell">Device / OS</th>
                  <th className="p-4 font-medium hidden md:table-cell">Referrer</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-body-md font-body-md text-on-surface font-code-sm">
                {[
                  { time: '2024-10-27 14:32:01', hash: '#xY7b2Q', country: '🇺🇸 United States', device: 'Mobile / iOS', referrer: 't.co', status: '200 OK', statusColor: 'primary' },
                  { time: '2024-10-27 14:31:45', hash: '#aB9k1Z', country: '🇬🇧 United Kingdom', device: 'Desktop / Mac', referrer: 'linkedin.com', status: '200 OK', statusColor: 'primary' },
                  { time: '2024-10-27 14:30:12', hash: '#xY7b2Q', country: '🇩🇪 Germany', device: 'Desktop / Win', referrer: 'direct', status: '404 ERR', statusColor: 'error' },
                  { time: '2024-10-27 14:28:55', hash: '#mN4p8L', country: '🇯🇵 Japan', device: 'Mobile / Android', referrer: 'github.com', status: '200 OK', statusColor: 'primary' },
                  { time: '2024-10-27 14:25:33', hash: '#xY7b2Q', country: '🇨🇦 Canada', device: 'Tablet / iPadOS', referrer: 't.co', status: '200 OK', statusColor: 'primary' },
                ].map((log, i) => (
                  <tr key={i} className="border-b border-outline-variant/10 hover:bg-surface-container-high/30 transition-colors">
                    <td className="p-4 text-on-surface-variant">{log.time}</td>
                    <td className="p-4 text-primary">{log.hash}</td>
                    <td className="p-4">{log.country}</td>
                    <td className="p-4 hidden sm:table-cell">{log.device}</td>
                    <td className="p-4 hidden md:table-cell">{log.referrer}</td>
                    <td className="p-4 text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full bg-${log.statusColor}/10 text-${log.statusColor} text-[10px] uppercase font-bold tracking-widest`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-outline-variant/20 flex justify-center bg-surface-container/30">
            <button className="text-label-sm font-label-sm text-primary hover:text-primary-fixed transition-colors flex items-center gap-1">
              View All Logs <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

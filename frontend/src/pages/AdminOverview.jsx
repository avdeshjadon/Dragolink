import React from 'react';
import AdminTabs from '../components/AdminTabs';

export default function AdminOverview() {
  return (
    <div className="w-full h-full flex flex-col font-sans bg-background">
      <AdminTabs />
      
      <div className="max-w-7xl mx-auto space-y-6 w-full">
        {/* Top App Bar / Header Area */}
        <header className="flex justify-between items-end mb-10 pb-4 border-b border-outline-variant/10">
          <div>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">Admin Overview</h2>
            <p className="text-body-md font-body-md text-on-surface-variant mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(121,219,141,0.8)]"></span>
              Live System Status • Last updated just now
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-surface-container border border-outline-variant/10 rounded-lg px-4 py-2 flex items-center gap-2 text-label-sm font-label-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              Last 24 Hours
            </div>
            <button className="bg-surface-container border border-outline-variant/10 hover:bg-surface-container-high text-on-surface rounded-lg p-2 transition-colors">
              <span className="material-symbols-outlined">refresh</span>
            </button>
          </div>
        </header>

        {/* KPI Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Users */}
          <div className="bg-surface-container border border-outline-variant/10 rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">Total Users</span>
              <span className="material-symbols-outlined text-primary/50 group-hover:text-primary transition-colors">group</span>
            </div>
            <div className="text-display-lg font-display-lg text-on-surface mb-2">142.8k</div>
            <div className="flex items-center gap-1 text-label-sm font-label-sm text-primary">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+12.5% vs last month</span>
            </div>
          </div>
          
          {/* Total Links */}
          <div className="bg-surface-container border border-outline-variant/10 rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <span className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">Active Links</span>
              <span className="material-symbols-outlined text-primary/50 group-hover:text-primary transition-colors">link</span>
            </div>
            <div className="text-display-lg font-display-lg text-on-surface mb-2">8.4M</div>
            <div className="flex items-center gap-1 text-label-sm font-label-sm text-primary">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+4.2% vs last month</span>
            </div>
          </div>
          
          {/* Paid vs Free (Data Visualization) */}
          <div className="md:col-span-2 bg-surface-container border border-outline-variant/10 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">Account Distribution</span>
              <span className="material-symbols-outlined text-on-surface-variant/50">pie_chart</span>
            </div>
            <div className="flex-1 flex items-center gap-6">
              <div className="flex-1">
                <div className="flex justify-between text-label-sm font-label-sm mb-1">
                  <span className="text-primary font-semibold">Enterprise (Paid)</span>
                  <span className="text-on-surface">32%</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2 mb-4 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '32%' }}></div>
                </div>
                <div className="flex justify-between text-label-sm font-label-sm mb-1">
                  <span className="text-on-surface-variant">Standard (Free)</span>
                  <span className="text-on-surface">68%</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                  <div className="bg-outline-variant h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
              <div className="hidden lg:block border-l border-outline-variant/10 pl-6">
                <div className="text-headline-md font-headline-md text-on-surface">45.7k</div>
                <div className="text-label-sm font-label-sm text-on-surface-variant">Paid Subscriptions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Suspicious Activity & System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Suspicious Activity Alerts */}
          <div className="lg:col-span-2 bg-surface-container border border-outline-variant/10 rounded-xl flex flex-col shadow-sm overflow-hidden">
            <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error">warning</span>
                <h3 className="text-headline-sm font-headline-lg text-on-surface">Security Alerts</h3>
              </div>
              <button className="text-label-sm font-label-sm text-primary hover:underline">View All</button>
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-outline-variant/10 bg-surface-container-lowest">
                    <th className="p-3 pl-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-medium">Severity</th>
                    <th className="p-3 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-medium">Event Type</th>
                    <th className="p-3 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-medium">Source IP</th>
                    <th className="p-3 pr-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-medium text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="text-body-sm font-body-md">
                  <tr className="border-b border-outline-variant/5 hover:bg-surface-container-high transition-colors">
                    <td className="p-3 pl-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-error-container text-on-error-container border border-error/20">Critical</span>
                    </td>
                    <td className="p-3 text-on-surface">Mass Link Deletion Attempt</td>
                    <td className="p-3 text-code-sm font-code-sm text-secondary">192.168.1.105</td>
                    <td className="p-3 pr-4 text-right text-on-surface-variant text-label-sm font-label-sm">2 min ago</td>
                  </tr>
                  <tr className="border-b border-outline-variant/5 hover:bg-surface-container-high transition-colors">
                    <td className="p-3 pl-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-bright text-secondary border border-outline-variant/30">Warning</span>
                    </td>
                    <td className="p-3 text-on-surface">Failed Login Spike</td>
                    <td className="p-3 text-code-sm font-code-sm text-secondary">45.22.109.12</td>
                    <td className="p-3 pr-4 text-right text-on-surface-variant text-label-sm font-label-sm">15 min ago</td>
                  </tr>
                  <tr className="border-b border-outline-variant/5 hover:bg-surface-container-high transition-colors">
                    <td className="p-3 pl-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-bright text-secondary border border-outline-variant/30">Warning</span>
                    </td>
                    <td className="p-3 text-on-surface">Rate Limit Exceeded (API)</td>
                    <td className="p-3 text-code-sm font-code-sm text-secondary">10.0.0.42</td>
                    <td className="p-3 pr-4 text-right text-on-surface-variant text-label-sm font-label-sm">1 hr ago</td>
                  </tr>
                  <tr className="hover:bg-surface-container-high transition-colors">
                    <td className="p-3 pl-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-container-highest text-on-surface-variant border border-outline-variant/30">Info</span>
                    </td>
                    <td className="p-3 text-on-surface">Unusual Geo-location Login</td>
                    <td className="p-3 text-code-sm font-code-sm text-secondary">88.198.50.201</td>
                    <td className="p-3 pr-4 text-right text-on-surface-variant text-label-sm font-label-sm">3 hrs ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* System Health */}
          <div className="bg-surface-container border border-outline-variant/10 rounded-xl p-4 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-headline-sm font-headline-lg text-on-surface">System Health</h3>
              <span className="material-symbols-outlined text-primary">memory</span>
            </div>
            <div className="space-y-6 flex-1">
              {/* API Latency */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">Global API Latency</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-headline-md font-headline-md text-on-surface">42</span>
                    <span className="text-label-sm font-label-sm text-on-surface-variant">ms</span>
                  </div>
                </div>
                {/* Faux Sparkline */}
                <div className="h-12 w-full bg-surface-container-highest rounded-lg relative overflow-hidden flex items-end p-1 gap-[2px]">
                  <div className="w-full bg-primary/20 h-[30%] rounded-sm"></div>
                  <div className="w-full bg-primary/40 h-[45%] rounded-sm"></div>
                  <div className="w-full bg-primary/30 h-[35%] rounded-sm"></div>
                  <div className="w-full bg-primary/60 h-[50%] rounded-sm"></div>
                  <div className="w-full bg-primary/40 h-[40%] rounded-sm"></div>
                  <div className="w-full bg-primary/80 h-[70%] rounded-sm"></div>
                  <div className="w-full bg-primary/50 h-[45%] rounded-sm"></div>
                  <div className="w-full bg-primary/30 h-[25%] rounded-sm"></div>
                  <div className="w-full bg-primary/70 h-[60%] rounded-sm"></div>
                  <div className="w-full bg-primary h-[85%] rounded-sm shadow-[0_0_8px_rgba(121,219,141,0.5)]"></div>
                </div>
              </div>
              {/* Error Rate */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">5xx Error Rate</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-headline-md font-headline-md text-primary">0.01</span>
                    <span className="text-label-sm font-label-sm text-on-surface-variant">%</span>
                  </div>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-1.5 rounded-full shadow-[0_0_5px_rgba(121,219,141,0.8)]" style={{ width: '2%' }}></div>
                </div>
                <div className="mt-2 text-right">
                  <span className="text-label-sm font-label-sm text-on-surface-variant">Status: <span className="text-primary font-medium">Optimal</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

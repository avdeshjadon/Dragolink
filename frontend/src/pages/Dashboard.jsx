import { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7D');

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-on-surface">Good morning, {user?.name?.split(' ')[0] || 'User'}</h2>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">Here's what's happening with your links today.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center border border-outline-variant/30 rounded-lg bg-surface-container-low px-2 py-1">
            {['7D', '30D', 'All Time'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1 text-label-md font-label-md rounded transition-colors ${
                  timeRange === range 
                    ? 'bg-surface-container-high text-primary shadow-sm' 
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-outline-variant/30 rounded-lg text-label-md font-label-md text-primary hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined" data-icon="download">download</span>
            Export
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Card 1 */}
        <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10 relative overflow-hidden group hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-label-md font-label-md text-on-surface-variant">Total Links</span>
            <span className="material-symbols-outlined text-primary" data-icon="link">link</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-headline-lg font-headline-lg text-on-surface">1,248</span>
            <span className="text-label-sm font-label-sm text-tertiary flex items-center">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 12%
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <svg className="w-full h-full preserve-aspect-ratio-none" viewBox="0 0 100 20">
              <path className="text-primary sparkline-path" d="M0,15 Q10,5 20,10 T40,15 T60,5 T80,10 T100,2" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
              <path className="text-primary sparkline-fill" d="M0,15 Q10,5 20,10 T40,15 T60,5 T80,10 T100,2 L100,20 L0,20 Z" fill="currentColor"></path>
            </svg>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10 relative overflow-hidden group hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-label-md font-label-md text-on-surface-variant">Total Clicks</span>
            <span className="material-symbols-outlined text-primary" data-icon="mouse">mouse</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-headline-lg font-headline-lg text-on-surface">45.2k</span>
            <span className="text-label-sm font-label-sm text-tertiary flex items-center">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 8%
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <svg className="w-full h-full preserve-aspect-ratio-none" viewBox="0 0 100 20">
              <path className="text-primary sparkline-path" d="M0,18 Q15,10 25,12 T50,5 T75,8 T100,0" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
              <path className="text-primary sparkline-fill" d="M0,18 Q15,10 25,12 T50,5 T75,8 T100,0 L100,20 L0,20 Z" fill="currentColor"></path>
            </svg>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10 relative overflow-hidden group hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-label-md font-label-md text-on-surface-variant">Unique Visitors</span>
            <span className="material-symbols-outlined text-primary" data-icon="person">person</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-headline-lg font-headline-lg text-on-surface">12.8k</span>
            <span className="text-label-sm font-label-sm text-tertiary flex items-center">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 15%
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <svg className="w-full h-full preserve-aspect-ratio-none" viewBox="0 0 100 20">
              <path className="text-primary sparkline-path" d="M0,10 Q20,15 30,5 T60,10 T80,2 T100,8" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
              <path className="text-primary sparkline-fill" d="M0,10 Q20,15 30,5 T60,10 T80,2 T100,8 L100,20 L0,20 Z" fill="currentColor"></path>
            </svg>
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10 relative overflow-hidden group hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-label-md font-label-md text-on-surface-variant">QR Scans</span>
            <span className="material-symbols-outlined text-error" data-icon="qr_code_scanner">qr_code_scanner</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-headline-lg font-headline-lg text-on-surface">3.1k</span>
            <span className="text-label-sm font-label-sm text-error flex items-center">
              <span className="material-symbols-outlined text-[14px]">arrow_downward</span> 2%
            </span>
          </div>
          <div className="h-8 w-full mt-2">
            <svg className="w-full h-full preserve-aspect-ratio-none" viewBox="0 0 100 20">
              <path className="text-error sparkline-path" d="M0,5 Q20,10 40,8 T70,15 T90,12 T100,18" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
              <path className="text-error opacity-20" d="M0,5 Q20,10 40,8 T70,15 T90,12 T100,18 L100,20 L0,20 Z" fill="currentColor"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="bg-surface-container-low rounded-xl p-4 md:p-6 border border-outline-variant/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-headline-md font-headline-md text-on-surface">Click Activity</h3>
          <button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">more_horiz</span></button>
        </div>
        <div className="w-full h-64 relative">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 250">
            <line className="chart-grid" strokeWidth="1" x1="0" x2="800" y1="50" y2="50"></line>
            <line className="chart-grid" strokeWidth="1" x1="0" x2="800" y1="100" y2="100"></line>
            <line className="chart-grid" strokeWidth="1" x1="0" x2="800" y1="150" y2="150"></line>
            <line className="chart-grid" strokeWidth="1" x1="0" x2="800" y1="200" y2="200"></line>
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#79db8d" stopOpacity="0.3"></stop>
                <stop offset="100%" stopColor="#79db8d" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            <path d="M0,200 Q50,180 100,150 T200,100 T300,120 T400,60 T500,80 T600,40 T700,50 T800,20 L800,250 L0,250 Z" fill="url(#chartGradient)"></path>
            <path d="M0,200 Q50,180 100,150 T200,100 T300,120 T400,60 T500,80 T600,40 T700,50 T800,20" fill="none" stroke="#79db8d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
            <circle className="cursor-pointer hover:r-6 transition-all" cx="400" cy="60" fill="#041711" r="5" stroke="#79db8d" strokeWidth="2"></circle>
          </svg>
          
          {/* Simulated Tooltip */}
          <div className="absolute top-[40px] left-[390px] bg-surface-container-highest border border-outline-variant/30 rounded p-2 shadow-lg pointer-events-none">
            <p className="text-label-sm font-label-sm text-on-surface-variant mb-1">Oct 12</p>
            <p className="text-label-md font-label-md text-on-surface font-semibold">1,245 Clicks</p>
          </div>
        </div>
        <div className="flex justify-between text-label-sm font-label-sm text-on-surface-variant mt-2 px-2">
          <span>Oct 8</span><span>Oct 9</span><span>Oct 10</span><span>Oct 11</span><span>Oct 12</span><span>Oct 13</span><span>Oct 14</span>
        </div>
      </div>

      {/* Secondary Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performing Links Table */}
        <div className="lg:col-span-2 bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden flex flex-col">
          <div className="p-4 flex justify-between items-center border-b border-outline-variant/10">
            <h3 className="text-label-md font-label-md font-semibold text-on-surface uppercase tracking-wider">Top Performing Links</h3>
            <a className="text-label-sm font-label-sm text-primary hover:underline" href="#">View All</a>
          </div>
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-label-sm font-label-sm text-on-surface-variant uppercase border-b border-outline-variant/5">
                  <th className="p-4 font-medium">Link Name</th>
                  <th className="p-4 font-medium">Short URL</th>
                  <th className="p-4 font-medium text-right">Clicks</th>
                </tr>
              </thead>
              <tbody className="text-body-md font-body-md">
                <tr className="border-b border-outline-variant/5 hover:bg-surface-container-high transition-colors">
                  <td className="p-4 text-on-surface font-medium flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
                      <span className="material-symbols-outlined text-[14px]">campaign</span>
                    </div>
                    Q4 Promo Campaign
                  </td>
                  <td className="p-4"><span className="font-code-sm text-code-sm text-primary">lp.co/q4-promo</span></td>
                  <td className="p-4 text-right text-on-surface-variant">12,450</td>
                </tr>
                <tr className="border-b border-outline-variant/5 hover:bg-surface-container-high transition-colors">
                  <td className="p-4 text-on-surface font-medium flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-secondary-container flex items-center justify-center text-on-secondary-container">
                      <span className="material-symbols-outlined text-[14px]">article</span>
                    </div>
                    Blog: New Features
                  </td>
                  <td className="p-4"><span className="font-code-sm text-code-sm text-primary">lp.co/update-v2</span></td>
                  <td className="p-4 text-right text-on-surface-variant">8,102</td>
                </tr>
                <tr className="border-b border-outline-variant/5 hover:bg-surface-container-high transition-colors">
                  <td className="p-4 text-on-surface font-medium flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-surface-variant flex items-center justify-center text-on-surface">
                      <span className="material-symbols-outlined text-[14px]">share</span>
                    </div>
                    Social Bio Link
                  </td>
                  <td className="p-4"><span className="font-code-sm text-code-sm text-primary">lp.co/bio</span></td>
                  <td className="p-4 text-right text-on-surface-variant">5,231</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 p-4 flex flex-col">
          <h3 className="text-label-md font-label-md font-semibold text-on-surface uppercase tracking-wider mb-6 border-b border-outline-variant/10 pb-4">Device Breakdown</h3>
          <div className="flex-grow flex items-center justify-center relative">
            <div className="w-32 h-32 rounded-full relative shadow-lg" style={{ background: 'conic-gradient(#15803d 0% 60%, #79db8d 60% 85%, #98da27 85% 100%)' }}>
              <div className="absolute inset-2 bg-surface-container-low rounded-full"></div>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <div className="flex justify-between items-center text-label-md font-label-md">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary-container"></span><span className="text-on-surface">Mobile</span></div>
              <span className="text-on-surface-variant">60%</span>
            </div>
            <div className="flex justify-between items-center text-label-md font-label-md">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary"></span><span className="text-on-surface">Desktop</span></div>
              <span className="text-on-surface-variant">25%</span>
            </div>
            <div className="flex justify-between items-center text-label-md font-label-md">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-tertiary"></span><span className="text-on-surface">Tablet</span></div>
              <span className="text-on-surface-variant">15%</span>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

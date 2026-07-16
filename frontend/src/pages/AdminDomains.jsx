import React, { useState } from 'react';
import AdminTabs from '../components/AdminTabs';

export default function AdminDomains() {
  const [expandedRow, setExpandedRow] = useState(2);

  return (
    <div className="w-full h-full flex flex-col font-sans bg-background">
      <AdminTabs />
      
      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col gap-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2 gap-4">
          <div>
            <h2 className="text-headline-lg font-headline-lg text-primary tracking-tight">Custom Domains</h2>
            <p className="text-body-md font-body-md text-on-surface-variant mt-1 max-w-2xl">Manage custom domains to create branded short links. We handle SSL provisioning automatically upon DNS verification.</p>
          </div>
          <button className="bg-primary-container text-on-primary-container font-label-md text-label-md py-2 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-sm whitespace-nowrap hover:bg-primary hover:text-white border border-primary-fixed/20 active:scale-95">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Add Domain
          </button>
        </div>

        {/* Bento Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
          <div className="bg-surface-container-low border border-outline-variant/10 shadow-sm rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Total Domains</p>
              <p className="text-headline-md font-headline-md text-on-surface">12</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined">public</span>
            </div>
          </div>
          <div className="bg-surface-container-low border border-outline-variant/10 shadow-sm rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Verified</p>
              <p className="text-headline-md font-headline-md text-primary">10</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-container/20 border border-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">verified</span>
            </div>
          </div>
          <div className="bg-surface-container-low border border-outline-variant/10 shadow-sm rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low to-error/5 z-0"></div>
            <div className="relative z-10">
              <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Action Required</p>
              <p className="text-headline-md font-headline-md text-error">2</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-error-container/30 border border-error/20 flex items-center justify-center text-error relative z-10">
              <span className="material-symbols-outlined">warning</span>
            </div>
          </div>
        </div>

        {/* Data Table Card */}
        <div className="bg-surface-container-low border border-outline-variant/10 shadow-sm rounded-xl overflow-hidden flex-1 flex flex-col">
          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-outline-variant/10 bg-surface-container-lowest/50">
                  <th className="py-3 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Domain</th>
                  <th className="py-3 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Status</th>
                  <th className="py-3 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">SSL</th>
                  <th className="py-3 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Added On</th>
                  <th className="py-3 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-body-md font-body-md divide-y divide-outline-variant/5">
                
                {/* Row 1: Active */}
                <tr className="hover:bg-surface-container-high/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_rgba(121,219,141,0.8)]"></div>
                      <span className="font-code-sm text-code-sm text-on-surface">link.acmecorp.com</span>
                      <span className="bg-surface-variant text-on-surface-variant text-[10px] uppercase px-2 py-0.5 rounded font-label-sm tracking-wider border border-outline-variant/30">DEFAULT</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary-container/10 text-primary border border-primary/20 text-label-sm font-label-sm tracking-wider">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      VERIFIED
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 text-on-surface-variant text-label-sm font-label-sm">
                      <span className="material-symbols-outlined text-[16px] text-primary">lock</span>
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-6 text-on-surface-variant text-[14px]">Oct 12, 2023</td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-on-surface-variant hover:text-primary p-1 rounded hover:bg-surface-variant border border-transparent transition-colors">
                      <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                  </td>
                </tr>

                {/* Row 2: Action Required */}
                <tr className={`${expandedRow === 2 ? 'bg-surface-container/30' : 'hover:bg-surface-container-high/30'} transition-colors cursor-pointer`} onClick={() => setExpandedRow(expandedRow === 2 ? null : 2)}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-error shadow-[0_0_5px_rgba(255,180,171,0.5)]"></div>
                      <span className="font-code-sm text-code-sm text-on-surface">promo.nexus.io</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-error-container/10 text-error border border-error/20 text-label-sm font-label-sm tracking-wider">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      DNS MISSING
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 text-on-surface-variant text-label-sm font-label-sm opacity-50">
                      <span className="material-symbols-outlined text-[16px]">lock_open</span>
                      Pending Verification
                    </span>
                  </td>
                  <td className="py-4 px-6 text-on-surface-variant text-[14px]">2 hours ago</td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-on-surface-variant hover:text-primary p-1 rounded hover:bg-surface-variant border border-transparent transition-colors">
                      <span className="material-symbols-outlined text-[20px]">{expandedRow === 2 ? 'expand_less' : 'expand_more'}</span>
                    </button>
                  </td>
                </tr>

                {/* Expanded Details Panel for Row 2 */}
                {expandedRow === 2 && (
                  <tr className="bg-surface-container/20">
                    <td className="p-0" colSpan="5">
                      <div className="px-10 py-6 border-l-2 border-error ml-6 bg-surface/50 my-2 rounded-r-lg shadow-inner">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-2 text-error">
                            <span className="material-symbols-outlined text-[18px]">dns</span>
                            <h4 className="font-headline-md text-headline-md text-[16px]">Configure DNS Records</h4>
                          </div>
                          <p className="text-body-md text-[14px] text-on-surface-variant max-w-3xl">To verify domain ownership and provision SSL, log in to your DNS provider (e.g., Cloudflare, Route53) and add the following records.</p>
                          
                          <div className="mt-2 grid gap-2 max-w-4xl">
                            {/* Record 1 */}
                            <div className="flex items-center bg-surface-container-highest rounded-lg border border-outline-variant/20 p-3 text-code-sm font-code-sm shadow-sm">
                              <div className="w-20 text-on-surface-variant font-semibold text-xs tracking-wider">TYPE</div>
                              <div className="w-24 text-on-surface bg-surface-variant/50 px-2 py-1 rounded text-center">CNAME</div>
                              <div className="w-20 text-on-surface-variant font-semibold text-xs tracking-wider pl-4">NAME</div>
                              <div className="w-40 text-on-surface truncate">promo</div>
                              <div className="w-20 text-on-surface-variant font-semibold text-xs tracking-wider pl-4">VALUE</div>
                              <div className="flex-1 text-primary flex items-center justify-between bg-primary/5 px-2 py-1 rounded border border-primary/10">
                                <span>cname.dragolink.com</span>
                                <button className="text-primary hover:text-primary-fixed-dim ml-2 active:scale-95 transition-transform" title="Copy">
                                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                </button>
                              </div>
                            </div>
                            
                            {/* Record 2 */}
                            <div className="flex items-center bg-surface-container-highest rounded-lg border border-outline-variant/20 p-3 text-code-sm font-code-sm shadow-sm">
                              <div className="w-20 text-on-surface-variant font-semibold text-xs tracking-wider">TYPE</div>
                              <div className="w-24 text-on-surface bg-surface-variant/50 px-2 py-1 rounded text-center">TXT</div>
                              <div className="w-20 text-on-surface-variant font-semibold text-xs tracking-wider pl-4">NAME</div>
                              <div className="w-40 text-on-surface truncate">_dragolink-verify</div>
                              <div className="w-20 text-on-surface-variant font-semibold text-xs tracking-wider pl-4">VALUE</div>
                              <div className="flex-1 text-primary flex items-center justify-between bg-primary/5 px-2 py-1 rounded border border-primary/10">
                                <span className="truncate">lp_verify_9a8b7c6d5e4f3g2h1i0j</span>
                                <button className="text-primary hover:text-primary-fixed-dim ml-2 flex-shrink-0 active:scale-95 transition-transform" title="Copy">
                                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex gap-3">
                            <button className="bg-surface-variant hover:bg-surface-variant/80 text-on-surface font-label-md text-label-md py-1.5 px-4 rounded border border-outline-variant/30 transition-colors shadow-sm active:scale-95">
                              Check Status Again
                            </button>
                            <button className="text-on-surface-variant hover:text-error font-label-md text-label-md py-1.5 px-4 transition-colors">
                              Remove Domain
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Row 3: Pending Provisioning */}
                <tr className="hover:bg-surface-container-high/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-secondary-fixed-dim animate-pulse shadow-[0_0_5px_rgba(160,209,188,0.5)]"></div>
                      <span className="font-code-sm text-code-sm text-on-surface">go.startup.co</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary-container/30 text-secondary-fixed-dim border border-secondary-fixed-dim/20 text-label-sm font-label-sm tracking-wider">
                      <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
                      PROVISIONING
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 text-secondary-fixed-dim text-label-sm font-label-sm">
                      <span className="material-symbols-outlined text-[16px]">lock_clock</span>
                      Generating Cert
                    </span>
                  </td>
                  <td className="py-4 px-6 text-on-surface-variant text-[14px]">Nov 01, 2023</td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-on-surface-variant hover:text-primary p-1 rounded hover:bg-surface-variant border border-transparent transition-colors">
                      <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="mt-auto px-6 py-4 border-t border-outline-variant/10 bg-surface-container-lowest/30 flex justify-between items-center text-label-sm text-on-surface-variant">
            <span>Showing 1 to 3 of 12 domains</span>
            <div className="flex gap-2">
              <button className="p-1 rounded hover:bg-surface-variant disabled:opacity-50 border border-transparent transition-colors"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
              <button className="p-1 rounded hover:bg-surface-variant border border-transparent transition-colors"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

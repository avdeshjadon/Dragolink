import React from 'react';
import AdminTabs from '../components/AdminTabs';

export default function AdminUsers() {
  return (
    <div className="w-full h-full flex flex-col font-sans bg-background">
      <AdminTabs />
      
      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col gap-6">
        
        {/* Top Header */}
        <header className="flex justify-between items-center pb-2">
          <div>
            <h2 className="text-headline-lg font-headline-lg text-primary tracking-tight">User Management</h2>
            <p className="text-body-md font-body-md text-on-surface-variant mt-1">Overview and administrative controls for all platform accounts.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-body-md focus:border-primary focus:ring-1 focus:ring-primary w-64 transition-all outline-none text-on-surface placeholder:text-outline-variant" placeholder="Search users by email or ID..." type="text"/>
            </div>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-high border border-transparent">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
            <div className="h-8 w-px bg-outline-variant/30 mx-2"></div>
            <button className="bg-primary-container text-on-primary-container px-4 py-2 rounded-lg text-label-md font-label-md hover:bg-primary hover:text-white transition-colors border border-primary-fixed/20 shadow-sm active:scale-95">
              Export CSV
            </button>
          </div>
        </header>

        {/* Bento Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-surface-container-low border border-outline-variant/10 shadow-sm p-4 rounded-xl flex flex-col">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Total Users</span>
            <span className="text-headline-lg font-headline-lg text-on-surface">14,293</span>
            <div className="mt-2 flex items-center text-primary-fixed-dim text-label-sm">
              <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span> +12% this month
            </div>
          </div>
          <div className="bg-surface-container-low border border-outline-variant/10 shadow-sm p-4 rounded-xl flex flex-col">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Active Plans (Pro+)</span>
            <span className="text-headline-lg font-headline-lg text-on-surface">3,842</span>
            <div className="mt-2 flex items-center text-primary-fixed-dim text-label-sm">
              <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span> +5% this month
            </div>
          </div>
          <div className="bg-surface-container-low border border-outline-variant/10 shadow-sm p-4 rounded-xl flex flex-col">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Pending Verifications</span>
            <span className="text-headline-lg font-headline-lg text-secondary">156</span>
            <div className="mt-2 text-on-surface-variant text-label-sm">
              Requires admin review
            </div>
          </div>
          <div className="bg-surface-container-low shadow-sm p-4 rounded-xl flex flex-col border-l-4 border border-outline-variant/10 border-l-error">
            <span className="text-label-sm font-label-sm text-error uppercase tracking-wider mb-2">Suspended Accounts</span>
            <span className="text-headline-lg font-headline-lg text-on-surface">42</span>
            <div className="mt-2 text-on-surface-variant text-label-sm">
              Policy violations
            </div>
          </div>
        </div>

        {/* Data Table Card */}
        <div className="bg-surface-container-low border border-outline-variant/10 shadow-sm rounded-xl overflow-hidden flex-1 flex flex-col">
          <div className="px-6 py-4 border-b border-outline-variant/10 flex justify-between items-center">
            <h3 className="text-headline-md font-headline-md text-on-surface">User Directory</h3>
            <div className="flex gap-2">
              <select className="bg-surface border border-outline-variant/30 rounded text-label-sm px-2 py-1 outline-none text-on-surface-variant focus:border-primary">
                <option>All Plans</option>
                <option>Free</option>
                <option>Pro</option>
                <option>Enterprise</option>
              </select>
              <select className="bg-surface border border-outline-variant/30 rounded text-label-sm px-2 py-1 outline-none text-on-surface-variant focus:border-primary">
                <option>Status: All</option>
                <option>Active</option>
                <option>Suspended</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-outline-variant/10 bg-surface-container-lowest/30">
                  <th className="p-4 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">User / Email</th>
                  <th className="p-4 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Plan & Role</th>
                  <th className="p-4 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Links Created</th>
                  <th className="p-4 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-center">Status</th>
                  <th className="p-4 px-6 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {/* User 1 */}
                <tr className="hover:bg-surface-container-high/50 transition-colors group">
                  <td className="p-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm border border-secondary/20">
                        JD
                      </div>
                      <div>
                        <div className="font-medium text-on-surface">Jane Doe</div>
                        <div className="text-label-sm font-label-sm text-on-surface-variant font-code-sm">jane.doe@example.com</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary w-fit border border-primary/20 tracking-wider">ENTERPRISE</span>
                      <span className="text-label-sm text-on-surface-variant">Admin</span>
                    </div>
                  </td>
                  <td className="p-4 px-6 text-right font-code-sm text-on-surface">45,291</td>
                  <td className="p-4 px-6 text-center">
                    <span className="inline-flex items-center justify-center gap-1.5 text-primary-fixed-dim text-label-sm">
                      <span className="w-2 h-2 rounded-full bg-primary-fixed-dim"></span> Active
                    </span>
                  </td>
                  <td className="p-4 px-6 text-right">
                    <button className="text-on-surface-variant hover:text-primary transition-colors p-1 opacity-0 group-hover:opacity-100 border border-transparent hover:border-primary/20 rounded">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button className="text-on-surface-variant hover:text-error transition-colors p-1 opacity-0 group-hover:opacity-100 border border-transparent hover:border-error/20 rounded ml-1">
                      <span className="material-symbols-outlined text-sm">block</span>
                    </button>
                  </td>
                </tr>
                
                {/* User 2 */}
                <tr className="hover:bg-surface-container-high/50 transition-colors group">
                  <td className="p-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-bold text-sm border border-outline-variant/30">
                        RS
                      </div>
                      <div>
                        <div className="font-medium text-on-surface">Robert Smith</div>
                        <div className="text-label-sm font-label-sm text-on-surface-variant font-code-sm">r.smith@acmecorp.dev</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-medium bg-secondary/10 text-secondary w-fit border border-secondary/20 tracking-wider">PRO</span>
                      <span className="text-label-sm text-on-surface-variant">User</span>
                    </div>
                  </td>
                  <td className="p-4 px-6 text-right font-code-sm text-on-surface">1,204</td>
                  <td className="p-4 px-6 text-center">
                    <span className="inline-flex items-center justify-center gap-1.5 text-primary-fixed-dim text-label-sm">
                      <span className="w-2 h-2 rounded-full bg-primary-fixed-dim"></span> Active
                    </span>
                  </td>
                  <td className="p-4 px-6 text-right">
                    <button className="text-on-surface-variant hover:text-primary transition-colors p-1 opacity-0 group-hover:opacity-100 border border-transparent hover:border-primary/20 rounded">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button className="text-on-surface-variant hover:text-error transition-colors p-1 opacity-0 group-hover:opacity-100 border border-transparent hover:border-error/20 rounded ml-1">
                      <span className="material-symbols-outlined text-sm">block</span>
                    </button>
                  </td>
                </tr>
                
                {/* User 3 (Suspended) */}
                <tr className="hover:bg-error/10 transition-colors group bg-error/5">
                  <td className="p-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-error/20 text-error flex items-center justify-center font-bold text-sm border border-error/30">
                        XX
                      </div>
                      <div>
                        <div className="font-medium text-on-surface">SpamBot99</div>
                        <div className="text-label-sm font-label-sm text-on-surface-variant font-code-sm">temp-392@suspicious.net</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-medium bg-surface-variant text-on-surface-variant w-fit border border-outline-variant/30 tracking-wider">FREE</span>
                      <span className="text-label-sm text-on-surface-variant">User</span>
                    </div>
                  </td>
                  <td className="p-4 px-6 text-right font-code-sm text-on-surface">0</td>
                  <td className="p-4 px-6 text-center">
                    <span className="inline-flex items-center justify-center gap-1 text-error text-label-sm font-semibold">
                      <span className="material-symbols-outlined text-[14px]">warning</span> Suspended
                    </span>
                  </td>
                  <td className="p-4 px-6 text-right">
                    <button className="text-on-surface-variant hover:text-primary transition-colors p-1 opacity-0 group-hover:opacity-100 border border-transparent hover:border-primary/20 rounded" title="Restore Account">
                      <span className="material-symbols-outlined text-sm">restore</span>
                    </button>
                    <button className="text-on-surface-variant hover:text-error transition-colors p-1 opacity-0 group-hover:opacity-100 border border-transparent hover:border-error/20 rounded ml-1" title="Delete Permanently">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-auto p-4 px-6 border-t border-outline-variant/10 flex items-center justify-between text-label-sm text-on-surface-variant bg-surface-container-lowest/30">
            <span>Showing 1-3 of 14,293 users</span>
            <div className="flex gap-1">
              <button className="px-2 py-1 rounded hover:bg-surface-container-high transition-colors disabled:opacity-50 border border-transparent hover:border-outline-variant/30" disabled>Prev</button>
              <button className="px-2 py-1 rounded bg-primary-container text-on-primary-container border border-primary/20 font-bold">1</button>
              <button className="px-2 py-1 rounded hover:bg-surface-container-high transition-colors border border-transparent hover:border-outline-variant/30">2</button>
              <button className="px-2 py-1 rounded hover:bg-surface-container-high transition-colors border border-transparent hover:border-outline-variant/30">3</button>
              <span className="px-2 py-1">...</span>
              <button className="px-2 py-1 rounded hover:bg-surface-container-high transition-colors border border-transparent hover:border-outline-variant/30">Next</button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

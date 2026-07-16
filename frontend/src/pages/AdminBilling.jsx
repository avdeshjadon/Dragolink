import React, { useState } from 'react';
import AdminTabs from '../components/AdminTabs';

export default function AdminBilling() {
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <div className="flex flex-col h-full bg-background font-sans relative">
      <AdminTabs />
      <div className="max-w-7xl mx-auto w-full p-4 md:p-6 flex flex-col gap-10">
        {/* Page Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-label-sm">admin_panel_settings</span>
              <span className="text-label-sm font-label-sm uppercase tracking-wider">Admin Settings</span>
              <span className="material-symbols-outlined text-label-sm text-outline-variant">chevron_right</span>
              <span className="text-label-sm font-label-sm text-primary">Billing</span>
            </div>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">Billing Overview</h2>
          </div>
          <div className="flex gap-4">
            <button className="border border-outline-variant/30 hover:border-primary/50 text-on-surface hover:text-primary transition-colors rounded-lg px-4 py-2 flex items-center gap-2 text-label-md font-label-md shadow-sm">
              <span className="material-symbols-outlined text-label-md">receipt_long</span>
              Update Tax Info
            </button>
          </div>
        </header>

        {/* Bento Grid: Top Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Current Plan */}
          <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 p-6 flex flex-col relative overflow-hidden group hover:border-primary/30 transition-colors">
            {/* Subtle ambient glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-container/10 rounded-full blur-3xl group-hover:bg-primary-container/20 transition-all"></div>
            
            <div className="flex items-center justify-between mb-10 relative z-10">
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Current Plan</span>
              <span className="bg-primary-container/20 text-primary border border-primary/20 px-2 py-1 rounded-full text-label-sm font-label-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Active
              </span>
            </div>
            
            <div className="mb-6 relative z-10">
              <h3 className="text-display-lg font-display-lg text-primary tracking-tight leading-none mb-2">Enterprise</h3>
              <p className="text-body-md font-body-md text-on-surface-variant flex items-baseline gap-1">
                <span className="text-headline-md font-headline-md text-on-surface">$499</span>
                <span>/ month</span>
              </p>
            </div>
            
            <div className="mt-auto pt-4 border-t border-outline-variant/10 relative z-10">
              <p className="text-label-sm font-label-sm text-on-surface-variant mb-4">Next billing date: <span className="text-on-surface">Oct 1, 2024</span></p>
              <button onClick={() => setShowCheckout(true)} className="w-full border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-colors rounded-lg py-2 px-4 text-label-md font-label-md shadow-sm hover:shadow">
                Manage Subscription
              </button>
            </div>
          </div>

          {/* Card 2: Usage Meters */}
          <div className="lg:col-span-2 bg-surface-container-low rounded-xl border border-outline-variant/10 p-6 flex flex-col gap-6 hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Current Cycle Usage</span>
              <span className="text-label-sm font-label-sm text-on-surface-variant">Resets in 12 days</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-1">
              {/* Meter: Links */}
              <div className="flex flex-col justify-center">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-label-md">link</span>
                    <span className="text-label-md font-label-md text-on-surface">Links Created</span>
                  </div>
                  <div className="text-right">
                    <span className="text-headline-md font-headline-md text-on-surface leading-none">8,420</span>
                    <span className="text-label-sm font-label-sm text-on-surface-variant">/ 10,000</span>
                  </div>
                </div>
                {/* Progress Track */}
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden shadow-inner relative">
                  <div className="absolute top-0 left-0 h-full bg-primary rounded-full w-[84%] shadow-[0_0_10px_rgba(121,219,141,0.5)]"></div>
                </div>
                <p className="text-label-sm font-label-sm text-on-surface-variant mt-1 text-right">84% utilized</p>
              </div>
              
              {/* Meter: Clicks */}
              <div className="flex flex-col justify-center">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-label-md">touch_app</span>
                    <span className="text-label-md font-label-md text-on-surface">Monthly Clicks</span>
                  </div>
                  <div className="text-right">
                    <span className="text-headline-md font-headline-md text-on-surface leading-none">2.4M</span>
                    <span className="text-label-sm font-label-sm text-on-surface-variant">/ 5.0M</span>
                  </div>
                </div>
                {/* Progress Track */}
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden shadow-inner relative">
                  <div className="absolute top-0 left-0 h-full bg-secondary rounded-full w-[48%] shadow-[0_0_10px_rgba(160,209,188,0.4)]"></div>
                </div>
                <p className="text-label-sm font-label-sm text-on-surface-variant mt-1 text-right">48% utilized</p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Row Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Method Card */}
          <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 p-6 flex flex-col gap-4">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Payment Method</span>
            <div className="bg-surface-container border border-outline-variant/20 rounded-lg p-4 flex items-center gap-4 mt-2">
              <div className="w-12 h-8 bg-surface-bright rounded flex items-center justify-center border border-outline-variant/30 shrink-0">
                <span className="text-on-surface font-headline-md italic tracking-tighter text-[16px]">VISA</span>
              </div>
              <div className="flex-1">
                <p className="text-on-surface font-code-sm text-code-sm flex items-center gap-2">
                  <span className="text-on-surface-variant tracking-[0.2em]">•••• •••• ••••</span> 4242
                </p>
                <p className="text-label-sm font-label-sm text-on-surface-variant mt-1">Expires 09/2027</p>
              </div>
            </div>
            <button className="mt-auto text-primary hover:text-primary-fixed-dim font-label-md text-label-md flex items-center gap-1 transition-colors self-start">
              <span className="material-symbols-outlined text-[16px]">edit</span>
              Update Payment Method
            </button>
          </div>

          {/* Billing Address Card */}
          <div className="lg:col-span-2 bg-surface-container-low rounded-xl border border-outline-variant/10 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Billing Details</span>
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">edit</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div>
                <p className="text-label-sm font-label-sm text-on-surface-variant mb-1">Company Name</p>
                <p className="text-body-md font-body-md text-on-surface">Acme Corporation Inc.</p>
              </div>
              <div>
                <p className="text-label-sm font-label-sm text-on-surface-variant mb-1">Billing Email</p>
                <p className="text-body-md font-body-md text-on-surface font-code-sm">accounting@acmecorp.dev</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-label-sm font-label-sm text-on-surface-variant mb-1">Address</p>
                <p className="text-body-md font-body-md text-on-surface">
                  123 Innovation Drive, Suite 400<br/>
                  San Francisco, CA 94105<br/>
                  United States
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice History Table */}
        <div className="flex flex-col gap-4 mt-4">
          <h3 className="text-headline-md font-headline-md text-on-surface">Invoice History</h3>
          <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 overflow-hidden">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-surface-container border-b border-outline-variant/10">
                <tr>
                  <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider w-1/4">Invoice Number</th>
                  <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider w-1/4">Date</th>
                  <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider w-1/4">Amount</th>
                  <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider w-1/6">Status</th>
                  <th className="p-4 text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {[
                  { id: 'INV-2024-09-01', date: 'Sep 01, 2024' },
                  { id: 'INV-2024-08-01', date: 'Aug 01, 2024' },
                  { id: 'INV-2024-07-01', date: 'Jul 01, 2024' },
                  { id: 'INV-2024-06-01', date: 'Jun 01, 2024' },
                ].map((inv) => (
                  <tr key={inv.id} className="hover:bg-surface-container/50 transition-colors group">
                    <td className="p-4 text-body-md font-code-sm text-on-surface">{inv.id}</td>
                    <td className="p-4 text-body-md font-body-md text-on-surface-variant">{inv.date}</td>
                    <td className="p-4 text-body-md font-body-md text-on-surface">$499.00</td>
                    <td className="p-4">
                      <span className="bg-primary-container/20 text-primary border border-primary/20 px-2 py-1 rounded-full text-label-sm font-label-sm inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span> Paid
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button aria-label="Download Invoice" className="text-on-surface-variant group-hover:text-primary transition-colors p-2 rounded hover:bg-surface-container-high">
                        <span className="material-symbols-outlined">download</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" onClick={() => setShowCheckout(false)}></div>
          
          <div className="relative w-full max-w-[900px] bg-surface-container-lowest rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-outline-variant/20">
            {/* LEFT COLUMN: Order Summary */}
            <div className="w-full md:w-5/12 bg-surface-container-low/50 p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-outline-variant/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
              
              <div>
                <div className="flex items-center gap-2 mb-10 relative z-10">
                  <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-lg border border-primary/20">
                    <span className="text-on-primary font-bold">L</span>
                  </div>
                  <span className="text-headline-md font-display-lg font-bold text-primary tracking-tight">DRAGOLINK</span>
                </div>
                
                <div className="mb-6">
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Subscription Upgrade</p>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Business Plan</h2>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display-lg text-display-lg text-primary tracking-tight">₹499</span>
                    <span className="font-body-md text-body-md text-on-surface-variant">/ month</span>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <p className="font-label-sm text-label-sm text-on-surface-variant">What's included:</p>
                  <ul className="space-y-3">
                    {['Unlimited active links & QR codes', 'Advanced real-time analytics dashboard', 'Custom domains & SSL certificates', 'Priority 24/7 technical support'].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-body-md font-body-md text-on-surface">
                        <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-label-sm font-label-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">shield</span>
                Secure 256-bit SSL encryption
              </div>
            </div>
            
            {/* RIGHT COLUMN: Payment Details */}
            <div className="w-full md:w-7/12 p-10 bg-surface-container-lowest">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-headline-md font-headline-md text-on-surface">Payment details</h3>
                  <p className="text-body-md font-body-md text-on-surface-variant">Complete your secure transaction.</p>
                </div>
                <button onClick={() => setShowCheckout(false)} className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="flex gap-2 p-1 bg-surface-container rounded-lg mb-6 border border-outline-variant/20">
                <button className="flex-1 py-2 rounded bg-surface-container-lowest shadow text-primary font-label-md text-label-md flex justify-center items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">credit_card</span> Card
                </button>
                <button className="flex-1 py-2 rounded text-on-surface-variant hover:text-on-surface font-label-md text-label-md flex justify-center items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">account_balance</span> UPI
                </button>
                <button className="flex-1 py-2 rounded text-on-surface-variant hover:text-on-surface font-label-md text-label-md flex justify-center items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">language</span> Netbanking
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Card number</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">credit_card</span>
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-surface-container border border-outline-variant/30 rounded-lg py-3 pl-10 pr-10 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-5 bg-surface-container-high rounded flex items-center justify-center">
                       <span className="text-[10px] font-bold text-on-surface-variant">MC</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Expiry date</label>
                    <input type="text" placeholder="MM / YY" className="w-full bg-surface-container border border-outline-variant/30 rounded-lg py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-label-sm font-label-sm text-on-surface-variant">CVV</label>
                      <span className="material-symbols-outlined text-[14px] text-on-surface-variant">help</span>
                    </div>
                    <input type="text" placeholder="123" className="w-full bg-surface-container border border-outline-variant/30 rounded-lg py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface-variant mb-1">Cardholder name</label>
                  <input type="text" placeholder="Name on card" className="w-full bg-surface-container border border-outline-variant/30 rounded-lg py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>
                
                <button type="button" className="w-full mt-6 py-3 bg-primary hover:bg-primary-fixed-dim text-on-primary rounded-lg font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm transition-colors">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  Pay ₹499 Now
                </button>
              </form>
              
              <div className="mt-4 text-center">
                <p className="text-[10px] text-on-surface-variant flex items-center justify-center gap-1 uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[12px]">security</span>
                  Payments securely processed by Dragolink Gateway
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

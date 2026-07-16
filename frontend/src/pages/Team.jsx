import React from 'react';

export default function Team() {
  return (
    <div className="flex flex-col h-full bg-background font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-on-background tracking-tight">Team Management</h2>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">Manage workspace access, roles, and pending invitations.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-container hover:bg-primary text-on-primary-container hover:text-white px-4 py-2 rounded-lg text-label-md font-label-md transition-colors duration-200 shadow-sm border border-primary-fixed/20">
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Invite Member
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-8 max-w-7xl mx-auto w-full">
        {/* Usage Overview Card */}
        <section className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-6 relative overflow-hidden group">
          {/* Hover subtle glow effect */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500 pointer-events-none"></div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="w-12 h-12 rounded-full bg-secondary-container/50 border border-secondary/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
              </div>
              <div className="flex-1">
                <h3 className="text-headline-md font-headline-md text-on-background">Seats Utilized</h3>
                <p className="text-body-md font-body-md text-on-surface-variant mt-1">You are currently using 4 out of 10 available seats on the Enterprise Tier.</p>
              </div>
            </div>
            
            <div className="w-full md:w-64 space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-headline-md font-headline-md text-primary">4</span>
                <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">/ 10 Seats</span>
              </div>
              <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[40%] transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(121,219,141,0.5)]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Active Members Grid/List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
            <h3 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-widest">Active Members</h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {/* Member Row 1 */}
            <div className="bg-surface-container border border-outline-variant/10 rounded-lg p-4 flex items-center justify-between hover:border-primary/30 hover:bg-surface-container-high transition-all duration-200 group">
              <div className="flex items-center gap-4">
                <img className="w-10 h-10 rounded-full object-cover border border-outline-variant/20" alt="Sarah Jenkins" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVev_BfAFiyJDHnwXcT2QddgUKF97Wt1kmQZNnO4d3ot8ec45sifCdEoPEKyh37EyRkgn-8VRQdEsoaG5Xefsvagfj9Ob0ETe0JSEND1zfOwtMU54rcoS3Jr3CH9mn0AKcxS9IzRQgK-np3Oxx_vqhA1nzuYd8-7v5Tb4szHHtNYYaMXITi93S4kh-USDLvfCeVEMpmZmRXbDFDMxYUGVk20mt-JmZ_G8WSR6z7rUEYzFkL_FUj0v_J2ccClwjUi7rk-sEgb6_XjAo"/>
                <div>
                  <p className="text-label-md font-label-md text-on-background">Sarah Jenkins</p>
                  <p className="text-label-sm font-label-sm text-on-surface-variant font-code-sm">sarah@dragolink.io</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-sm font-label-sm shadow-sm">
                  Owner
                </span>
                <button className="text-on-surface-variant hover:text-primary transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </div>

            {/* Member Row 2 */}
            <div className="bg-surface-container border border-outline-variant/10 rounded-lg p-4 flex items-center justify-between hover:border-primary/30 hover:bg-surface-container-high transition-all duration-200 group">
              <div className="flex items-center gap-4">
                <img className="w-10 h-10 rounded-full object-cover border border-outline-variant/20" alt="Marcus Thorne" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0-FiomA7K7ouxav24HLeKsevB04qiqKSUN1olkTLUm7K-3z-UVpchoPM5Hu2kI-eZGw10pTHzMXc_uNfXs5dKmS66mcSGj7aLbvByNXX1Rn2nzBrJyZv5SB5EjX-v87tyQo2rf8SgLdNc-V9MQ-kiLFwmw0FLsb-Wcy7FT8PwXGPim5x6RwxbTk4AU51ADsSn1OYoOg_xOx5wSvXfK1DzGhizhinqauxeH2EIlqQ0xb4UMBNYqKR5e4alX-sWeoYdsK84o6mjZTsD"/>
                <div>
                  <p className="text-label-md font-label-md text-on-background">Marcus Thorne</p>
                  <p className="text-label-sm font-label-sm text-on-surface-variant font-code-sm">marcus.t@dragolink.io</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-surface-container-highest text-on-surface text-label-sm font-label-sm">
                  Admin
                </span>
                <button className="text-on-surface-variant hover:text-primary transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </div>

            {/* Member Row 3 */}
            <div className="bg-surface-container border border-outline-variant/10 rounded-lg p-4 flex items-center justify-between hover:border-primary/30 hover:bg-surface-container-high transition-all duration-200 group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center border border-outline-variant/20">
                  <span className="text-on-tertiary-container font-label-md font-bold">EL</span>
                </div>
                <div>
                  <p className="text-label-md font-label-md text-on-background">Elena Rostova</p>
                  <p className="text-label-sm font-label-sm text-on-surface-variant font-code-sm">elena@dragolink.io</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-surface-container-highest text-on-surface text-label-sm font-label-sm">
                  Editor
                </span>
                <button className="text-on-surface-variant hover:text-primary transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pending Invitations */}
        <section className="space-y-4 pt-6">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
            <h3 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
              Pending Invitations
              <span className="bg-surface-variant text-on-surface rounded-full px-2 py-0.5 text-[10px]">1</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-surface-container-lowest border border-outline-variant/20 border-dashed rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary/50 transition-all duration-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant/20">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                </div>
                <div>
                  <p className="text-label-md font-label-md text-on-surface-variant italic">Waiting for acceptance...</p>
                  <p className="text-label-sm font-label-sm text-primary font-code-sm">j.doe@partner-agency.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-surface-container-highest text-on-surface-variant text-label-sm font-label-sm border border-outline-variant/10">
                  Analyst
                </span>
                <div className="flex-1 flex justify-end gap-2">
                  <button className="text-label-sm font-label-sm text-on-surface hover:text-primary transition-colors px-2 py-1 rounded border border-outline-variant/20 hover:border-primary/50">
                    Resend
                  </button>
                  <button className="text-label-sm font-label-sm text-error hover:text-on-error hover:bg-error transition-colors px-2 py-1 rounded border border-error/20">
                    Revoke
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

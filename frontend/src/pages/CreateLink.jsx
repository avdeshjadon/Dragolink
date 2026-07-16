import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function CreateLink() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [alias, setAlias] = useState('');
  const [tags, setTags] = useState('');

  return (
    <div className="font-sans flex flex-col h-full gap-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-1">Create Link</h2>
          <p className="text-on-surface-variant">Generate a powerful, trackable short link.</p>
        </div>
        <div className="hidden md:flex gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-lg border border-outline-variant text-primary font-label-md text-label-md hover:bg-surface-container-highest transition-colors"
          >
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg bg-primary-container text-white font-label-md text-label-md hover:bg-inverse-primary transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            Create Now
          </button>
        </div>
      </div>

      {/* Split View Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          
          {/* Destination & Basic Info */}
          <section className="tonal-card rounded-xl p-4 md:p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-outline-variant/10 pb-2 mb-4">
              <span className="material-symbols-outlined text-primary text-[20px]">link</span>
              <h3 className="font-headline-md text-[18px] text-on-surface">Destination</h3>
            </div>
            
            {/* URL Input */}
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Destination URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">language</span>
                </div>
                <input 
                  type="url" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="premium-input w-full rounded-lg pl-10 pr-4 py-2 font-code-sm text-code-sm" 
                  placeholder="https://example.com/very/long/path/to/campaign" 
                />
              </div>
            </div>
            
            {/* Title */}
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Link Title (Internal)</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="premium-input w-full rounded-lg px-4 py-2 font-body-md" 
                placeholder="e.g. Q3 Social Media Campaign" 
              />
            </div>
          </section>

          {/* Routing & Behavior */}
          <section className="tonal-card rounded-xl p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/10 pb-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">route</span>
                <h3 className="font-headline-md text-[18px] text-on-surface">Routing</h3>
              </div>
              <span className="font-label-sm text-label-sm text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Alias available
              </span>
            </div>
            
            {/* Custom Alias */}
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Custom Alias</label>
              <div className="flex flex-col sm:flex-row rounded-lg overflow-hidden border border-outline-variant focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <span className="px-4 py-2 bg-surface-container-highest text-on-surface-variant font-code-sm text-code-sm border-r border-outline-variant/50 flex items-center">
                  dragolink.io/
                </span>
                <input 
                  type="text" 
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  className="flex-1 bg-surface-container-low text-on-surface px-4 py-2 font-code-sm text-code-sm focus:outline-none" 
                  placeholder="my-custom-alias"
                />
                <button className="px-2 py-2 bg-surface-container-highest text-outline hover:text-primary transition-colors border-l border-outline-variant/50">
                  <span className="material-symbols-outlined text-[18px]">autorenew</span>
                </button>
              </div>
            </div>
            
            {/* Expiration & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Expiration Date</label>
                <div className="relative">
                  <input className="premium-input w-full rounded-lg px-4 py-2 font-body-md text-on-surface-variant" type="date" />
                </div>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Tags</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="premium-input w-full rounded-lg px-4 py-2 font-body-md" 
                    placeholder="Add tags..." 
                  />
                  {tags && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <span className="bg-surface-container-highest px-1 py-1 rounded text-[10px] text-on-surface-variant font-code-sm">
                        {tags}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Preview & Sticky Actions */}
        <div className="lg:col-span-5 xl:col-span-4 relative">
          <div className="sticky top-10 space-y-6">
            
            {/* Live Preview Card */}
            <div className="glass-panel rounded-xl overflow-hidden shadow-2xl relative">
              <div className="h-1 w-full bg-gradient-to-r from-primary via-tertiary to-primary-container"></div>
              <div className="p-4">
                <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  Live Preview
                </h3>
                
                {/* Social Card Preview */}
                <div className="bg-surface rounded-lg border border-outline-variant/30 overflow-hidden mb-6">
                  <div className="h-32 w-full bg-surface-container-highest relative flex items-center justify-center border-b border-outline-variant/30">
                    <span className="material-symbols-outlined text-outline-variant text-[48px] relative z-10">image</span>
                  </div>
                  <div className="p-2">
                    <div className="font-code-sm text-[11px] text-on-surface-variant uppercase mb-1 truncate">DRAGOLINK.IO</div>
                    <div className="font-headline-md text-[16px] text-on-surface truncate mb-1">
                      {title || 'Your Link Title'}
                    </div>
                    <div className="font-body-md text-[13px] text-on-surface-variant truncate">
                      {url || 'A preview of your destination URL will appear here.'}
                    </div>
                  </div>
                </div>
                
                {/* Resulting Link */}
                <div className="bg-surface-container-low rounded-lg p-2 border border-outline-variant/30 flex justify-between items-center group">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-[14px]">content_copy</span>
                    </div>
                    <span className="font-code-sm text-code-sm text-on-surface truncate">
                      dragolink.io/<span className="text-primary">{alias || 'alias'}</span>
                    </span>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-on-surface-variant hover:text-primary shrink-0">
                    <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Action Area */}
            <div className="md:hidden flex flex-col gap-2 mt-10">
              <button className="w-full py-4 rounded-lg bg-primary-container text-white font-label-md text-label-md hover:bg-inverse-primary transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(21,128,61,0.3)]">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                Create Link
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full py-4 rounded-lg border border-outline-variant text-primary font-label-md text-label-md hover:bg-surface-container-highest transition-colors"
              >
                Cancel
              </button>
            </div>
            
          </div>
        </div>
      </div>
      
    </div>
  );
}

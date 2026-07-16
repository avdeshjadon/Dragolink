import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

export default function QRCodes() {
  const [fgColor, setFgColor] = useState('#041711');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [patternStyle, setPatternStyle] = useState('Squares');
  const [cornerStyle, setCornerStyle] = useState('Square');

  // Dummy URL for the preview
  const previewUrl = "https://dragolink.io/campaign-x";

  return (
    <div className="flex flex-col h-full bg-background font-sans -m-4 md:-m-6">
      {/* TopAppBar Contextual */}
      <header className="h-16 border-b border-outline-variant/10 flex items-center justify-between px-6 bg-surface/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h2 className="text-headline-md font-headline-md text-on-surface">Customize QR Code</h2>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-1 rounded text-label-md font-label-md text-primary border border-outline-variant/30 hover:bg-surface-container-high transition-colors">
            Discard
          </button>
          <button className="px-4 py-1 rounded text-label-md font-label-md bg-primary-container text-on-primary-container hover:bg-primary hover:text-white transition-colors shadow-sm border border-primary-fixed/20">
            Save Changes
          </button>
        </div>
      </header>

      {/* Studio Layout */}
      <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
        {/* Left Panel: Controls */}
        <div className="w-full md:w-5/12 lg:w-1/3 border-r border-outline-variant/10 overflow-y-auto bg-surface-container-lowest p-6 space-y-10 custom-scrollbar">
          {/* Section: Colors */}
          <section>
            <h3 className="text-label-sm font-label-sm uppercase text-on-surface-variant border-b border-outline-variant/10 pb-1 mb-4">Colors</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-label-md font-label-md text-on-surface">Foreground</label>
                <div className="flex items-center gap-2">
                  <span className="text-code-sm font-code-sm text-on-surface-variant uppercase">{fgColor}</span>
                  <div className="relative w-8 h-8 rounded-full border border-outline-variant/30 ring-2 ring-transparent focus-within:ring-primary overflow-hidden shadow-sm">
                    <input 
                      type="color" 
                      value={fgColor} 
                      onChange={(e) => setFgColor(e.target.value)}
                      className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-label-md font-label-md text-on-surface">Background</label>
                <div className="flex items-center gap-2">
                  <span className="text-code-sm font-code-sm text-on-surface-variant uppercase">{bgColor}</span>
                  <div className="relative w-8 h-8 rounded-full border border-outline-variant/30 ring-2 ring-transparent focus-within:ring-primary overflow-hidden shadow-sm">
                    <input 
                      type="color" 
                      value={bgColor} 
                      onChange={(e) => setBgColor(e.target.value)}
                      className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Pattern Style */}
          <section>
            <h3 className="text-label-sm font-label-sm uppercase text-on-surface-variant border-b border-outline-variant/10 pb-1 mb-4">Pattern Style</h3>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setPatternStyle('Squares')} className={`flex flex-col items-center justify-center p-2 rounded ${patternStyle === 'Squares' ? 'border-2 border-primary bg-surface-container-high' : 'border border-outline-variant/30 hover:border-outline-variant hover:bg-surface-container-high text-on-surface-variant'} transition-colors`}>
                <span className={`material-symbols-outlined mb-1 ${patternStyle === 'Squares' ? 'text-primary' : ''}`}>grid_view</span>
                <span className={`text-label-sm font-label-sm ${patternStyle === 'Squares' ? 'text-primary' : ''}`}>Squares</span>
              </button>
              <button onClick={() => setPatternStyle('Dots')} className={`flex flex-col items-center justify-center p-2 rounded ${patternStyle === 'Dots' ? 'border-2 border-primary bg-surface-container-high' : 'border border-outline-variant/30 hover:border-outline-variant hover:bg-surface-container-high text-on-surface-variant'} transition-colors`}>
                <span className={`material-symbols-outlined mb-1 ${patternStyle === 'Dots' ? 'text-primary' : ''}`}>fiber_manual_record</span>
                <span className={`text-label-sm font-label-sm ${patternStyle === 'Dots' ? 'text-primary' : ''}`}>Dots</span>
              </button>
              <button onClick={() => setPatternStyle('Smooth')} className={`flex flex-col items-center justify-center p-2 rounded ${patternStyle === 'Smooth' ? 'border-2 border-primary bg-surface-container-high' : 'border border-outline-variant/30 hover:border-outline-variant hover:bg-surface-container-high text-on-surface-variant'} transition-colors`}>
                <span className={`material-symbols-outlined mb-1 ${patternStyle === 'Smooth' ? 'text-primary' : ''}`}>blur_on</span>
                <span className={`text-label-sm font-label-sm ${patternStyle === 'Smooth' ? 'text-primary' : ''}`}>Smooth</span>
              </button>
            </div>
          </section>

          {/* Section: Corner Markers */}
          <section>
            <h3 className="text-label-sm font-label-sm uppercase text-on-surface-variant border-b border-outline-variant/10 pb-1 mb-4">Corner Markers</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setCornerStyle('Square')} className={`flex items-center justify-center p-2 rounded gap-1 ${cornerStyle === 'Square' ? 'border-2 border-primary bg-surface-container-high text-primary' : 'border border-outline-variant/30 hover:border-outline-variant hover:bg-surface-container-high text-on-surface-variant'} transition-colors`}>
                <span className="material-symbols-outlined text-lg">check_box_outline_blank</span>
                <span className="text-label-sm font-label-sm">Square</span>
              </button>
              <button onClick={() => setCornerStyle('Rounded')} className={`flex items-center justify-center p-2 rounded gap-1 ${cornerStyle === 'Rounded' ? 'border-2 border-primary bg-surface-container-high text-primary' : 'border border-outline-variant/30 hover:border-outline-variant hover:bg-surface-container-high text-on-surface-variant'} transition-colors`}>
                <span className="material-symbols-outlined text-lg">radio_button_unchecked</span>
                <span className="text-label-sm font-label-sm">Rounded</span>
              </button>
            </div>
          </section>

          {/* Section: Logo */}
          <section>
            <h3 className="text-label-sm font-label-sm uppercase text-on-surface-variant border-b border-outline-variant/10 pb-1 mb-4">Logo</h3>
            <div className="border border-dashed border-outline-variant/50 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-surface-container-high transition-colors cursor-pointer group">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors mb-2">upload_file</span>
              <p className="text-label-md font-label-md text-on-surface mb-1">Click to upload logo</p>
              <p className="text-label-sm font-label-sm text-on-surface-variant">SVG, PNG, JPG (Max 2MB)</p>
            </div>
          </section>
        </div>

        {/* Right Panel: Preview Area */}
        <div className="flex-1 bg-surface flex flex-col relative items-center justify-center p-10 overflow-y-auto">
          {/* Background Subtle Detail */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--tw-colors-primary) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          
          <div className="z-10 w-full max-w-md flex flex-col items-center gap-6">
            {/* QR Preview Card */}
            <div className="bg-white p-6 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] ring-1 ring-black/5 relative group transition-transform duration-300 hover:scale-[1.02]">
              <div className="w-64 h-64 flex items-center justify-center">
                <QRCodeSVG 
                  value={previewUrl} 
                  size={256} 
                  fgColor={fgColor} 
                  bgColor={bgColor} 
                  level="H"
                />
              </div>
              
              {/* Hover Actions */}
              <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                <button className="bg-primary-container text-on-primary-container rounded-full p-2 shadow-md hover:scale-110 transition-transform hover:bg-primary hover:text-white">
                  <span className="material-symbols-outlined">zoom_in</span>
                </button>
              </div>
            </div>
            
            {/* Details & Download */}
            <div className="w-full bg-surface-container-low border border-outline-variant/10 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-outline-variant/10">
                <div>
                  <p className="text-label-sm font-label-sm text-on-surface-variant">Destination</p>
                  <p className="text-body-md font-body-md text-on-surface truncate max-w-[200px]">https://dragolink.io/campaign-x</p>
                </div>
                <span className="px-1 py-[2px] rounded bg-secondary-container/50 text-on-secondary-container text-code-sm font-code-sm border border-secondary/20">Dynamic</span>
              </div>
              
              <div className="flex gap-4">
                <button className="flex-1 bg-primary-container text-on-primary-container hover:bg-primary hover:text-white text-label-md font-label-md py-2 rounded flex items-center justify-center gap-1 transition-colors shadow-sm border border-primary-fixed/20">
                  <span className="material-symbols-outlined text-sm">download</span>
                  Download PNG
                </button>
                <button className="flex-1 border border-outline-variant/30 text-primary hover:bg-surface-container-high text-label-md font-label-md py-2 rounded flex items-center justify-center gap-1 transition-colors">
                  <span className="material-symbols-outlined text-sm">code</span>
                  SVG
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

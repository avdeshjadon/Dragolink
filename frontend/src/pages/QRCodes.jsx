import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import QRCodeStyling from 'qr-code-styling';
import toast from 'react-hot-toast';

export default function QRCodes() {
  const [destinationUrl, setDestinationUrl] = useState('https://dragolink.io/campaign-x');
  const [fgColor, setFgColor] = useState('#041711');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [patternStyle, setPatternStyle] = useState('square'); // 'square', 'dots', 'rounded', 'classy', 'classy-rounded', 'extra-rounded'
  const [cornerStyle, setCornerStyle] = useState('square'); // 'square', 'extra-rounded', 'dot'
  const [logoUrl, setLogoUrl] = useState('');
  
  const qrRef = useRef(null);
  const [qrCode] = useState(() => new QRCodeStyling({
    width: 256,
    height: 256,
    margin: 5,
    data: "https://dragolink.io/campaign-x",
    qrOptions: { errorCorrectionLevel: 'H' },
    imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 5 },
  }));

  useEffect(() => {
    if (qrRef.current) {
      qrCode.append(qrRef.current);
    }
  }, [qrCode, qrRef]);

  useEffect(() => {
    qrCode.update({
      data: destinationUrl || "https://dragolink.io",
      dotsOptions: {
        color: fgColor,
        type: patternStyle
      },
      backgroundOptions: {
        color: bgColor
      },
      cornersSquareOptions: {
        color: fgColor,
        type: cornerStyle
      },
      cornersDotOptions: {
        color: fgColor,
        type: cornerStyle === 'extra-rounded' ? 'dot' : 'square'
      },
      image: logoUrl
    });
  }, [qrCode, fgColor, bgColor, patternStyle, cornerStyle, logoUrl, destinationUrl]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoUrl(event.target.result);
        toast.success('Logo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const resetColors = () => {
    setFgColor('#000000');
    setBgColor('#FFFFFF');
    toast.success('Colors reset to default');
  };

  const handleDownloadPNG = () => {
    qrCode.download({ name: 'dragolink-qr', extension: 'png' });
    toast.success('QR Code downloaded as PNG');
  };

  const handleDownloadSVG = () => {
    qrCode.download({ name: 'dragolink-qr', extension: 'svg' });
    toast.success('QR Code downloaded as SVG');
  };

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
          <button className="px-4 py-1 rounded text-label-md font-label-md text-primary border border-outline-variant/30 hover:bg-surface-container-high transition-colors cursor-pointer">
            Discard
          </button>
          <button className="px-4 py-1 rounded text-label-md font-label-md bg-primary-container text-on-primary-container hover:bg-primary hover:text-white transition-colors shadow-sm border border-primary-fixed/20 cursor-pointer">
            Save Changes
          </button>
        </div>
      </header>

      {/* Studio Layout */}
      <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
        {/* Left Panel: Controls */}
        <div className="w-full md:w-5/12 lg:w-1/3 border-r border-outline-variant/10 overflow-y-auto bg-surface-container-lowest p-6 space-y-10 custom-scrollbar">
          
          {/* Section: URL */}
          <section>
            <h3 className="text-label-sm font-label-sm uppercase text-on-surface-variant border-b border-outline-variant/10 pb-1 mb-4">Destination URL</h3>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline-variant text-[18px]">link</span>
              </div>
              <input 
                type="url" 
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                className="w-full bg-surface text-on-surface border border-outline-variant/50 rounded-lg pl-10 pr-4 py-2 font-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none shadow-sm"
                placeholder="https://example.com" 
              />
            </div>
          </section>

          {/* Section: Colors */}
          <section>
            <div className="flex justify-between items-end border-b border-outline-variant/10 pb-1 mb-4">
              <h3 className="text-label-sm font-label-sm uppercase text-on-surface-variant">Colors</h3>
              <button onClick={resetColors} className="text-label-sm font-label-sm text-primary hover:underline">Reset</button>
            </div>
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
              <button onClick={() => setPatternStyle('square')} className={`flex flex-col items-center justify-center p-2 rounded cursor-pointer ${patternStyle === 'square' ? 'border-2 border-primary bg-surface-container-high' : 'border border-outline-variant/30 hover:border-outline-variant hover:bg-surface-container-high text-on-surface-variant'} transition-colors`}>
                <span className={`material-symbols-outlined mb-1 ${patternStyle === 'square' ? 'text-primary' : ''}`}>grid_view</span>
                <span className={`text-label-sm font-label-sm text-[10px] sm:text-xs ${patternStyle === 'square' ? 'text-primary' : ''}`}>Squares</span>
              </button>
              <button onClick={() => setPatternStyle('dots')} className={`flex flex-col items-center justify-center p-2 rounded cursor-pointer ${patternStyle === 'dots' ? 'border-2 border-primary bg-surface-container-high' : 'border border-outline-variant/30 hover:border-outline-variant hover:bg-surface-container-high text-on-surface-variant'} transition-colors`}>
                <span className={`material-symbols-outlined mb-1 ${patternStyle === 'dots' ? 'text-primary' : ''}`}>fiber_manual_record</span>
                <span className={`text-label-sm font-label-sm text-[10px] sm:text-xs ${patternStyle === 'dots' ? 'text-primary' : ''}`}>Dots</span>
              </button>
              <button onClick={() => setPatternStyle('extra-rounded')} className={`flex flex-col items-center justify-center p-2 rounded cursor-pointer ${patternStyle === 'extra-rounded' ? 'border-2 border-primary bg-surface-container-high' : 'border border-outline-variant/30 hover:border-outline-variant hover:bg-surface-container-high text-on-surface-variant'} transition-colors`}>
                <span className={`material-symbols-outlined mb-1 ${patternStyle === 'extra-rounded' ? 'text-primary' : ''}`}>blur_on</span>
                <span className={`text-label-sm font-label-sm text-[10px] sm:text-xs ${patternStyle === 'extra-rounded' ? 'text-primary' : ''}`}>Smooth</span>
              </button>
            </div>
          </section>

          {/* Section: Corner Markers */}
          <section>
            <h3 className="text-label-sm font-label-sm uppercase text-on-surface-variant border-b border-outline-variant/10 pb-1 mb-4">Corner Markers</h3>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => setCornerStyle('square')} className={`flex flex-col items-center justify-center p-2 rounded gap-1 cursor-pointer ${cornerStyle === 'square' ? 'border-2 border-primary bg-surface-container-high text-primary' : 'border border-outline-variant/30 hover:border-outline-variant hover:bg-surface-container-high text-on-surface-variant'} transition-colors`}>
                <span className="material-symbols-outlined text-lg">check_box_outline_blank</span>
                <span className="text-label-sm font-label-sm text-[10px] sm:text-xs">Square</span>
              </button>
              <button onClick={() => setCornerStyle('extra-rounded')} className={`flex flex-col items-center justify-center p-2 rounded gap-1 cursor-pointer ${cornerStyle === 'extra-rounded' ? 'border-2 border-primary bg-surface-container-high text-primary' : 'border border-outline-variant/30 hover:border-outline-variant hover:bg-surface-container-high text-on-surface-variant'} transition-colors`}>
                <span className="material-symbols-outlined text-lg">radio_button_unchecked</span>
                <span className="text-label-sm font-label-sm text-[10px] sm:text-xs">Rounded</span>
              </button>
              <button onClick={() => setCornerStyle('dot')} className={`flex flex-col items-center justify-center p-2 rounded gap-1 cursor-pointer ${cornerStyle === 'dot' ? 'border-2 border-primary bg-surface-container-high text-primary' : 'border border-outline-variant/30 hover:border-outline-variant hover:bg-surface-container-high text-on-surface-variant'} transition-colors`}>
                <span className="material-symbols-outlined text-lg">lens</span>
                <span className="text-label-sm font-label-sm text-[10px] sm:text-xs">Dot</span>
              </button>
            </div>
          </section>

          {/* Section: Logo */}
          <section>
            <h3 className="text-label-sm font-label-sm uppercase text-on-surface-variant border-b border-outline-variant/10 pb-1 mb-4">Logo</h3>
            <div className="relative border border-dashed border-outline-variant/50 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-surface-container-high transition-colors cursor-pointer group">
              <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleLogoUpload} />
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors mb-2">upload_file</span>
              <p className="text-label-md font-label-md text-on-surface mb-1">{logoUrl ? 'Change Logo' : 'Click to upload logo'}</p>
              <p className="text-label-sm font-label-sm text-on-surface-variant">SVG, PNG, JPG (Max 2MB)</p>
            </div>
            {logoUrl && (
              <button onClick={() => { setLogoUrl(''); toast.success('Logo removed'); }} className="mt-2 text-label-sm font-label-sm text-error hover:underline w-full text-center cursor-pointer">
                Remove Logo
              </button>
            )}
          </section>
        </div>

        {/* Right Panel: Preview Area */}
        <div className="flex-1 bg-surface flex flex-col relative items-center justify-center p-10 overflow-y-auto">
          {/* Background Subtle Detail */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--tw-colors-primary) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          
          <div className="z-10 w-full max-w-md flex flex-col items-center gap-6">
            {/* QR Preview Card */}
            <div className="bg-white p-6 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] ring-1 ring-black/5 relative group transition-transform duration-300 hover:scale-[1.02]">
              <div className="w-64 h-64 flex items-center justify-center" ref={qrRef}>
                {/* QR Code Canvas will be injected here */}
              </div>
              
              {/* Hover Actions */}
              <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 pointer-events-none">
                <button className="bg-primary-container text-on-primary-container rounded-full p-2 shadow-md hover:scale-110 transition-transform hover:bg-primary hover:text-white pointer-events-auto">
                  <span className="material-symbols-outlined">zoom_in</span>
                </button>
              </div>
            </div>
            
            {/* Details & Download */}
            <div className="w-full bg-surface-container-low border border-outline-variant/10 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-outline-variant/10">
                <div className="overflow-hidden pr-2">
                  <p className="text-label-sm font-label-sm text-on-surface-variant">Destination</p>
                  <p className="text-body-md font-body-md text-on-surface truncate">{destinationUrl || "Empty"}</p>
                </div>
                <span className="shrink-0 px-1 py-[2px] rounded bg-secondary-container/50 text-on-secondary-container text-code-sm font-code-sm border border-secondary/20">Dynamic</span>
              </div>
              
              <div className="flex gap-4">
                <button onClick={handleDownloadPNG} className="flex-1 bg-primary-container text-on-primary-container hover:bg-primary hover:text-white text-label-md font-label-md py-2 rounded flex items-center justify-center gap-1 transition-colors shadow-sm border border-primary-fixed/20 cursor-pointer">
                  <span className="material-symbols-outlined text-sm">download</span>
                  Download PNG
                </button>
                <button onClick={handleDownloadSVG} className="flex-1 border border-outline-variant/30 text-primary hover:bg-surface-container-high text-label-md font-label-md py-2 rounded flex items-center justify-center gap-1 transition-colors cursor-pointer">
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

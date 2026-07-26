import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import QRCodeStyling from "qr-code-styling";
import toast from "react-hot-toast";
import { api } from "../lib/axios";
import AsyncButton from "../components/AsyncButton";

export default function QRCodes() {
  const [destinationUrl, setDestinationUrl] = useState(
    "https://dragolink.io/campaign-x",
  );
  const [fgColor, setFgColor] = useState("#041711");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [patternStyle, setPatternStyle] = useState("square"); // 'square', 'dots', 'rounded', 'classy', 'classy-rounded', 'extra-rounded'
  const [cornerStyle, setCornerStyle] = useState("square"); // 'square', 'extra-rounded', 'dot'
  // Premium branding: dynamic colored SVG
  const [defaultSvgContent, setDefaultSvgContent] = useState("");
  const [logoMode, setLogoMode] = useState("default"); // 'default', 'custom', 'none'
  const [customLogoUrl, setCustomLogoUrl] = useState("");
  const [previousLogoMode, setPreviousLogoMode] = useState("default");

  const qrRef = useRef(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [savedShortCode, setSavedShortCode] = useState("");

  const [qrCode] = useState(
    () =>
      new QRCodeStyling({
        width: 256,
        height: 256,
        margin: 5,
        data: "https://dragolink.io/campaign-x",
        qrOptions: {
          errorCorrectionLevel: "H", // High error correction to ensure scannability with embedded logo
        },
        imageOptions: {
          hideBackgroundDots: true, // Intelligently clear modules around the logo
          imageSize: 0.25, // Perfectly balanced size
          margin: 8, // Quiet zone padding for the embedded logo
          crossOrigin: "anonymous",
        },
      }),
  );

  // Fetch the default SVG content on mount
  useEffect(() => {
    fetch("/dragolink.svg")
      .then((res) => res.text())
      .then((text) => setDefaultSvgContent(text))
      .catch((err) => console.error("Failed to load default SVG", err));
  }, []);

  // Compute the active logo URL based on mode and color
  const activeLogoUrl = React.useMemo(() => {
    if (logoMode === "none") return "";
    if (logoMode === "custom") return customLogoUrl;
    if (logoMode === "default" && defaultSvgContent) {
      // Replace the default #16803C green with the current fgColor
      const coloredSvg = defaultSvgContent.replace(/#16803C/gi, fgColor);
      const blob = new Blob([coloredSvg], { type: "image/svg+xml" });
      return URL.createObjectURL(blob);
    }
    return "";
  }, [logoMode, customLogoUrl, defaultSvgContent, fgColor]);

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
        type: patternStyle,
      },
      backgroundOptions: {
        color: bgColor,
      },
      cornersSquareOptions: {
        color: fgColor,
        type: cornerStyle,
      },
      cornersDotOptions: {
        color: fgColor,
        type: cornerStyle === "extra-rounded" ? "dot" : "square",
      },
      image: activeLogoUrl,
    });
  }, [
    qrCode,
    fgColor,
    bgColor,
    patternStyle,
    cornerStyle,
    activeLogoUrl,
    destinationUrl,
  ]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomLogoUrl(event.target.result);
        setLogoMode("custom");
        toast.success("Logo uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!destinationUrl) {
      toast.error('Destination URL is required');
      return;
    }
    
    // Check if it's already a dragolink URL
    if (destinationUrl.includes(import.meta.env.VITE_APP_URL || 'localhost:8080')) {
        setShowDownloadModal(true);
        return;
    }

    try {
      const res = await api.post('/links', { longUrl: destinationUrl, title: '[QR] Custom Code' });
      const shortCode = res.data.shortCode || res.data.customAlias || res.data.id;
      if (shortCode) {
        setSavedShortCode(shortCode);
        const shortUrl = `${import.meta.env.VITE_APP_URL || 'http://localhost:8080'}/${shortCode}`;
        setDestinationUrl(shortUrl);
        toast.success('Link saved for tracking!');
      }
      setShowDownloadModal(true);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save link for tracking');
    }
  };

  const resetSettings = () => {
    setFgColor("#041711");
    setBgColor("#FFFFFF");
    setPatternStyle("square");
    setCornerStyle("square");
    setLogoMode("default");
    setPreviousLogoMode("default");
    setCustomLogoUrl("");
    toast.success("All settings reset to default");
  };

  const handleDownloadPNG = async () => {
    try {
      await qrCode.download({ name: "dragolink-qr", extension: "png" });
      toast.success("QR Code downloaded as PNG");
    } catch (e) {
      console.error(e);
      toast.error("Failed to download QR code");
    }
  };

  const handleDownloadSVG = async () => {
    try {
      await qrCode.download({ name: "dragolink-qr", extension: "svg" });
      toast.success("QR Code downloaded as SVG");
    } catch (e) {
      console.error(e);
      toast.error("Failed to download QR code");
    }
  };

  return (
    <div className="flex flex-col h-full bg-background font-sans -m-4 md:-m-6">
      {/* TopAppBar Contextual */}
      <header className="h-16 border-b border-outline-variant/10 flex items-center justify-between px-6 bg-surface/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h2 className="text-headline-md font-headline-md text-on-surface">
            Customize QR Code
          </h2>
        </div>
        <div className="flex gap-2">
          <button onClick={resetSettings} className="px-4 py-1 rounded text-label-md font-label-md text-primary border border-outline-variant/30 hover:bg-surface-container-high transition-colors cursor-pointer">
            Reset
          </button>
          {logoMode !== "none" ? (
            <button 
              onClick={() => { 
                setPreviousLogoMode(logoMode);
                setLogoMode("none"); 
                toast.success("Logo removed"); 
              }}
              className="px-4 py-1 rounded text-label-md font-label-md border border-outline-variant/30 text-error hover:bg-error/10 transition-colors shadow-sm cursor-pointer flex items-center gap-1"
            >
              Remove Logo
            </button>
          ) : (
            <button 
              onClick={() => { 
                setLogoMode(previousLogoMode); 
                toast.success("Logo restored"); 
              }}
              className="px-4 py-1 rounded text-label-md font-label-md border border-outline-variant/30 text-primary hover:bg-primary/10 transition-colors shadow-sm cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">undo</span>
              Undo
            </button>
          )}
        </div>
      </header>

      {/* Studio Layout */}
      <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
        {/* Left Panel: Controls */}
        <div className="w-full md:w-5/12 lg:w-1/3 border-r border-outline-variant/10 overflow-y-auto bg-surface-container-lowest p-6 space-y-10 custom-scrollbar">

          {/* Section: Colors */}
          <section>
            <div className="flex justify-between items-end border-b border-outline-variant/10 pb-1 mb-4">
              <h3 className="text-label-sm font-label-sm uppercase text-on-surface-variant">
                Colors
              </h3>
              <button
                onClick={resetSettings}
                className="text-label-sm font-label-sm text-primary hover:underline"
              >
                Reset
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-label-md font-label-md text-on-surface">
                  Foreground
                </label>
                <div className="flex items-center gap-2">
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
                <label className="text-label-md font-label-md text-on-surface">
                  Background
                </label>
                <div className="flex items-center gap-2">
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
            <h3 className="text-label-sm font-label-sm uppercase text-on-surface-variant border-b border-outline-variant/10 pb-1 mb-4">
              Pattern Style
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPatternStyle("square")}
                className={`flex flex-col items-center justify-center p-2 rounded cursor-pointer ${patternStyle === "square" ? "border-2 border-primary bg-surface-container-high" : "border border-outline-variant/30 hover:border-outline-variant hover:bg-surface-container-high text-on-surface-variant"} transition-colors`}
              >
                <span
                  className={`material-symbols-outlined mb-1 ${patternStyle === "square" ? "text-primary" : ""}`}
                >
                  grid_view
                </span>
                <span
                  className={`text-label-sm font-label-sm text-[10px] sm:text-xs ${patternStyle === "square" ? "text-primary" : ""}`}
                >
                  Squares
                </span>
              </button>
              <button
                onClick={() => setPatternStyle("dots")}
                className={`flex flex-col items-center justify-center p-2 rounded cursor-pointer ${patternStyle === "dots" ? "border-2 border-primary bg-surface-container-high" : "border border-outline-variant/30 hover:border-outline-variant hover:bg-surface-container-high text-on-surface-variant"} transition-colors`}
              >
                <span
                  className={`material-symbols-outlined mb-1 ${patternStyle === "dots" ? "text-primary" : ""}`}
                >
                  fiber_manual_record
                </span>
                <span
                  className={`text-label-sm font-label-sm text-[10px] sm:text-xs ${patternStyle === "dots" ? "text-primary" : ""}`}
                >
                  Dots
                </span>
              </button>
              <button
                onClick={() => setPatternStyle("rounded")}
                className={`flex flex-col items-center justify-center p-2 rounded cursor-pointer ${patternStyle === "rounded" ? "border-2 border-primary bg-surface-container-high" : "border border-outline-variant/30 hover:border-outline-variant hover:bg-surface-container-high text-on-surface-variant"} transition-colors`}
              >
                <span
                  className={`material-symbols-outlined mb-1 ${patternStyle === "rounded" ? "text-primary" : ""}`}
                >
                  blur_on
                </span>
                <span
                  className={`text-label-sm font-label-sm text-[10px] sm:text-xs ${patternStyle === "rounded" ? "text-primary" : ""}`}
                >
                  Smooth
                </span>
              </button>
            </div>
          </section>

          {/* Section: Corner Markers */}
          <section>
            <h3 className="text-label-sm font-label-sm uppercase text-on-surface-variant border-b border-outline-variant/10 pb-1 mb-4">
              Corner Markers
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setCornerStyle("square")}
                className={`flex flex-col items-center justify-center p-2 rounded gap-1 cursor-pointer ${cornerStyle === "square" ? "border-2 border-primary bg-surface-container-high text-primary" : "border border-outline-variant/30 hover:border-outline-variant hover:bg-surface-container-high text-on-surface-variant"} transition-colors`}
              >
                <span className="material-symbols-outlined text-lg">
                  check_box_outline_blank
                </span>
                <span className="text-label-sm font-label-sm text-[10px] sm:text-xs">
                  Square
                </span>
              </button>
              <button
                onClick={() => setCornerStyle("extra-rounded")}
                className={`flex flex-col items-center justify-center p-2 rounded gap-1 cursor-pointer ${cornerStyle === "extra-rounded" ? "border-2 border-primary bg-surface-container-high text-primary" : "border border-outline-variant/30 hover:border-outline-variant hover:bg-surface-container-high text-on-surface-variant"} transition-colors`}
              >
                <span className="material-symbols-outlined text-lg">
                  radio_button_unchecked
                </span>
                <span className="text-label-sm font-label-sm text-[10px] sm:text-xs">
                  Rounded
                </span>
              </button>
              <button
                onClick={() => setCornerStyle("dot")}
                className={`flex flex-col items-center justify-center p-2 rounded gap-1 cursor-pointer ${cornerStyle === "dot" ? "border-2 border-primary bg-surface-container-high text-primary" : "border border-outline-variant/30 hover:border-outline-variant hover:bg-surface-container-high text-on-surface-variant"} transition-colors`}
              >
                <span className="material-symbols-outlined text-lg">lens</span>
                <span className="text-label-sm font-label-sm text-[10px] sm:text-xs">
                  Dot
                </span>
              </button>
            </div>
          </section>

          {/* Section: Logo */}
          <section>
            <h3 className="text-label-sm font-label-sm uppercase text-on-surface-variant border-b border-outline-variant/10 pb-1 mb-4">
              Logo
            </h3>
            <div className="relative border border-dashed border-outline-variant/50 rounded-lg p-3 flex flex-row items-center justify-center hover:bg-surface-container-high transition-colors cursor-pointer group gap-2">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleLogoUpload}
              />
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                upload_file
              </span>
              <div className="flex items-center gap-2">
                <span className="text-label-md font-label-md text-on-surface">
                  {logoMode !== "none" ? "Change Logo" : "Upload Logo"}
                </span>
                <span className="text-label-sm font-label-sm text-on-surface-variant hidden xl:inline">
                  (SVG, PNG, JPG)
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Panel: Preview Area */}
        <div className="flex-1 bg-surface flex flex-col relative items-center justify-center p-10 overflow-y-auto">
          {/* Background Subtle Detail */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(var(--tw-colors-primary) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          ></div>

          <div className="z-10 w-full max-w-md flex flex-col gap-6">
            
            {/* Moved Destination URL Section */}
            <section className="w-full">
              <h3 className="text-label-sm font-label-sm uppercase text-on-surface-variant mb-2">
                Destination URL
              </h3>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline-variant text-[18px]">
                    link
                  </span>
                </div>
                <input
                  type="url"
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  className="w-full bg-surface text-on-surface border border-outline-variant/50 rounded-lg pl-10 pr-4 py-3 font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none shadow-sm"
                  placeholder="https://example.com"
                />
              </div>
            </section>

            <div className="bg-white p-6 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] ring-1 ring-black/5 relative">
              <div
                className="w-64 h-64 mx-auto flex items-center justify-center"
                ref={qrRef}
              >
                {/* QR Code Canvas injected cleanly here */}
              </div>
            </div>

            {/* Save & Download */}
            <div className="w-full bg-surface-container-low border border-outline-variant/10 rounded-lg p-4">
              <AsyncButton
                onClick={handleSave}
                className="w-full bg-primary text-white hover:bg-primary/90 text-label-md font-label-md py-2.5 rounded flex items-center justify-center gap-2 transition-colors shadow-sm border border-primary/20 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                Save this
              </AsyncButton>
            </div>
          </div>
        </div>
      </div>


      {/* Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-surface rounded-xl shadow-2xl p-6 w-full max-w-sm border border-outline-variant/20 flex flex-col items-center">
            <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <h3 className="text-headline-md font-headline-md text-on-surface mb-2">QR Code Ready!</h3>
            <p className="text-body-md font-body-md text-on-surface-variant text-center mb-6">
              Your link is now trackable. Choose a format to download your QR code.
            </p>
            <div className="flex w-full gap-3">
              <button
                onClick={() => { handleDownloadPNG(); setShowDownloadModal(false); }}
                className="flex-1 bg-primary text-white py-2.5 rounded-lg text-label-md font-label-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">image</span>
                PNG
              </button>
              <button
                onClick={() => { handleDownloadSVG(); setShowDownloadModal(false); }}
                className="flex-1 bg-surface-container-lowest border border-outline-variant/30 text-on-surface py-2.5 rounded-lg text-label-md font-label-md hover:bg-surface-container transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">code</span>
                SVG
              </button>
            </div>
            <button
              onClick={() => setShowDownloadModal(false)}
              className="mt-4 text-label-sm font-label-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

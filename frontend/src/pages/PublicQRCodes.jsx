import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, ScanLine, PaintBucket, BarChart3, Globe, RefreshCcw, Lock, Download, ArrowRight, CheckCircle2, ShieldCheck, Settings2, Users, Zap, Cpu, Server, LinkIcon, Smartphone, MousePointerClick, Clock, TrendingUp, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { api } from '../lib/axios';

const iconMap = {
  PaintBucket, RefreshCcw, BarChart3, Globe, Lock, Download, ScanLine, QrCode,
  Smartphone, MousePointerClick, Clock, TrendingUp, Filter,
  ShieldCheck, Settings2, Users, Zap, Cpu, Server, LinkIcon
};

// Full 21×21 QR Code matrix (1=dark, 0=light) — standard structure with proper finder patterns
const QR_MATRIX = [
  [1,1,1,1,1,1,1,0,1,0,1,1,0,0,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,0,1,0,0,1,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,0,0,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,1,1,0,1,0,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0],
  [1,1,0,1,0,1,1,0,0,0,1,0,1,1,0,1,0,1,1,0,1],
  [0,0,1,0,1,0,0,1,1,0,0,1,0,0,1,0,1,0,0,1,0],
  [1,0,0,1,0,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,1],
  [0,1,1,0,1,0,0,0,1,0,1,0,0,1,0,0,1,0,0,1,0],
  [1,0,0,1,0,0,1,1,0,1,0,1,1,0,1,0,0,1,0,0,1],
  [0,0,0,0,0,0,0,0,0,1,1,0,0,1,0,0,1,0,1,0,0],
  [1,1,1,1,1,1,1,0,0,0,1,0,1,0,0,1,0,0,1,0,1],
  [1,0,0,0,0,0,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0],
  [1,0,1,1,1,0,1,0,0,1,1,0,1,0,0,1,0,1,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,0,1,0,1,1,0,1,0,1,0,0],
  [1,0,1,1,1,0,1,0,0,1,1,0,1,0,0,1,0,0,0,1,1],
  [1,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0,1,1,0,0,1],
  [1,1,1,1,1,1,1,0,0,1,1,0,1,1,0,1,0,0,1,1,0],
];

// Cells in the finder patterns (not to be used as "data" cells for flicker)
function isFinderPattern(r, c) {
  return (r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7);
}

function AnimatedQR() {
  const S = 4; // cell size in viewBox units
  const G = 0.4; // gap
  const VB = 21 * S; // 84

  // Build list of active cells with position + distance from center for stagger
  const cx = 10, cy = 10; // center of 21x21
  const activeCells = [];
  QR_MATRIX.forEach((row, r) => {
    row.forEach((val, c) => {
      if (val === 1) {
        const dist = Math.sqrt((r - cy) ** 2 + (c - cx) ** 2);
        activeCells.push({ r, c, dist, isFinder: isFinderPattern(r, c) });
      }
    });
  });
  // Sort by distance from center so cells appear center-outward
  activeCells.sort((a, b) => a.dist - b.dist);

  return (
    <div className="relative">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-3xl bg-brand/20 blur-2xl scale-75" />
      
      <motion.div
        className="relative bg-white rounded-3xl p-8 shadow-2xl border border-brand/10"
        initial={{ scale: 1.12, boxShadow: '0 0 0 3px #16803C55' }}
        animate={{ scale: 1, boxShadow: '0 0 0 0px #16803C00' }}
        transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Corner brackets — viewfinder style */}
        {[
          { top: 0, left: 0, transform: '' },
          { top: 0, right: 0, transform: 'scaleX(-1)' },
          { bottom: 0, left: 0, transform: 'scaleY(-1)' },
          { bottom: 0, right: 0, transform: 'scale(-1,-1)' },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-9 h-9 border-brand"
            style={{ ...pos, borderTopWidth: pos.bottom == null ? 3 : 0, borderLeftWidth: pos.right == null ? 3 : 0, borderBottomWidth: pos.top == null ? 3 : 0, borderRightWidth: pos.left == null ? 3 : 0, borderRadius: 0 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4, type: 'spring' }}
          />
        ))}

        <svg
          viewBox={`0 0 ${VB} ${VB}`}
          className="w-72 h-72"
          style={{ display: 'block' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Laser scan gradient */}
            <linearGradient id="laserGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16803C" stopOpacity="0" />
              <stop offset="50%" stopColor="#22c55e" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#16803C" stopOpacity="0" />
            </linearGradient>
            {/* Finder glow filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* All QR modules */}
          {activeCells.map((cell, i) => {
            const delay = 0.05 + (i / activeCells.length) * 0.8;
            const x = cell.c * S + G;
            const y = cell.r * S + G;
            const size = S - G * 2;
            const rx = cell.isFinder ? 0.6 : 0.8;

            return (
              <motion.rect
                key={`${cell.r}-${cell.c}`}
                x={x} y={y}
                width={size} height={size}
                rx={rx}
                fill="#16803C"
                filter={cell.isFinder ? 'url(#glow)' : undefined}
                initial={{ opacity: 0, scale: 0, originX: x + size / 2, originY: y + size / 2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay,
                  duration: 0.35,
                  type: 'spring',
                  stiffness: 260,
                  damping: 18,
                }}
              />
            );
          })}

          {/* Pulsing ring on finder patterns */}
          {[[1.5*S, 1.5*S], [15.5*S, 1.5*S], [1.5*S, 15.5*S]].map(([fx, fy], i) => (
            <motion.rect
              key={`fp-${i}`}
              x={fx - S * 0.5} y={fy - S * 0.5}
              width={S * 5} height={S * 5}
              rx={2}
              fill="none"
              stroke="#22c55e"
              strokeWidth={1}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: [0, 0.6, 0], scale: [0.9, 1.15, 0.9] }}
              transition={{ delay: 1.2 + i * 0.15, duration: 2.5, repeat: Infinity, repeatDelay: 0.5 }}
            />
          ))}

          {/* Laser scanning line removed */}

          {/* Subtle center corner dots — alignment patterns */}
          <motion.rect
            x={9*S+G} y={9*S+G} width={S-G*2} height={S-G*2} rx={S/2}
            fill="#16803C"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: [0, 360] }}
            transition={{ delay: 0.9, duration: 0.5, type: 'spring' }}
          />
        </svg>
      </motion.div>

    </div>
  );
}



export default function PublicQRCodes() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/public/pages/qr-codes')
      .then(res => {
        setData(JSON.parse(res.data.htmlContent));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">Loading QR Codes...</div>;
  }

  if (!data || !data.hero) {
    return <div className="min-h-screen flex items-center justify-center bg-bg-light text-text-secondary">QR Codes data not available.</div>;
  }

  const { hero, stats, featuresInfo, features, useCasesInfo, useCases } = data;

  return (
    <div className="bg-bg-light min-h-screen font-sans">

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-brand-dark mb-6 tracking-tight leading-[1.1]">
              {hero.title1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-emerald">{hero.title2}</span>
            </h1>
            <p className="text-xl text-text-secondary mb-6 leading-relaxed max-w-lg">
              {hero.subtitle}
            </p>
            <ul className="space-y-2 mb-10">
              {hero.bulletPoints.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-text-secondary text-sm">
                  <CheckCircle2 className="w-4 h-4 text-brand shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto shadow-lg shadow-brand/20">
                  Generate QR Code Free
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto bg-surface-light border-2">
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Animated QR Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center items-center"
          >
            <AnimatedQR />
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-surface-light border-y border-border-light py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="text-3xl font-extrabold text-brand-dark">{stat.value}</div>
              <div className="text-sm text-text-secondary mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">{featuresInfo.title}</h2>
          <p className="text-lg text-text-secondary">{featuresInfo.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = iconMap[feature.icon] || QrCode;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-surface-light rounded-2xl p-8 border border-border-light hover:border-brand/30 hover:shadow-lg transition-all"
              >
                <Icon className="w-8 h-8 text-brand mb-5" />
                <h3 className="text-xl font-bold text-brand-dark mb-3">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-surface-light border-y border-border-light px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">{useCasesInfo.title}</h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">{useCasesInfo.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((useCase, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-5 p-8 bg-bg-light rounded-2xl border border-border-light hover:border-brand/20 transition-colors"
              >
                <QrCode className="w-8 h-8 text-brand shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-brand-dark mb-2">{useCase.label}</h3>
                  <p className="text-text-secondary">{useCase.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-brand-dark rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-emerald opacity-20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand opacity-20 blur-[100px] rounded-full" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to create your first QR code?</h2>
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
              Start free — no credit card required. Generate your first dynamic QR code in under 60 seconds.
            </p>
            <Link to="/register">
              <Button size="lg" className="h-14 px-10 text-lg bg-brand-emerald hover:bg-brand text-brand-dark hover:text-white transition-all shadow-xl">
                Get Started for Free <ArrowRight className="ml-2 w-5 h-5 inline" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

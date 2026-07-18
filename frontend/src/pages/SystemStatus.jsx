import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Activity, Bell, ArrowRight, Server, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { api } from '../lib/axios';

export default function SystemStatus() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/public/pages/status')
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
    return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-emerald-500 font-mono">INITIALIZING MISSION CONTROL...</div>;
  }

  if (!data || !data.systems) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-500 font-mono">STATUS DATA OFFLINE.</div>;
  }

  const { systems, incidents } = data;

  const isAllOperational = systems.every(s => s.status === 'Operational');
  const mainStatusColor = isAllOperational ? 'emerald' : 'amber';
  const mainStatusText = isAllOperational ? 'All Systems Operational' : 'Partial Degradation';

  return (
    <div className="bg-[#050505] min-h-screen font-sans pb-24 text-gray-100 overflow-hidden relative selection:bg-emerald-500/30">
      
      {/* Dark Mode Background Effects */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-emerald-900/20 opacity-30 blur-[150px] rounded-full mix-blend-screen pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-brand/10 opacity-20 blur-[150px] rounded-full mix-blend-screen pointer-events-none -translate-x-1/3 translate-y-1/3" />

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none opacity-50" />

      {/* Mission Control Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
        
        {/* Main Status Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5 }}
          className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-1 overflow-hidden group shadow-[0_0_50px_rgba(16,185,129,0.1)] mb-16"
        >
          <div className={`absolute inset-0 bg-gradient-to-r from-${mainStatusColor}-500/20 via-transparent to-transparent opacity-80`} />
          
          <div className="bg-[#0a0a0a]/90 backdrop-blur-3xl rounded-[1.8rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 border border-white/5 shadow-inner">
            <div className="flex items-center gap-8">
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <div className={`absolute inset-0 rounded-full border-4 border-${mainStatusColor}-400/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]`} />
                <div className={`absolute inset-2 rounded-full border-2 border-${mainStatusColor}-500/40 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]`} />
                <div className={`w-16 h-16 rounded-full bg-${mainStatusColor}-950/80 flex items-center justify-center border border-${mainStatusColor}-500/50 backdrop-blur-md z-10 shadow-[0_0_30px_rgba(16,185,129,0.3)]`}>
                  {isAllOperational ? <ShieldCheck className={`w-8 h-8 text-${mainStatusColor}-400`} /> : <Activity className={`w-8 h-8 text-${mainStatusColor}-400`} />}
                </div>
              </div>
              
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
                  {mainStatusText}
                </h1>
                <p className={`text-${mainStatusColor}-400 font-mono text-sm font-bold tracking-widest uppercase flex items-center gap-2`}>
                  <span className={`w-2 h-2 rounded-full bg-${mainStatusColor}-400 animate-pulse`} /> Last updated: Just now
                </p>
              </div>
            </div>
            
            <div className="shrink-0 w-full md:w-auto">
               <Button variant="outline" className="h-12 px-6 border-white/20 bg-white/5 hover:bg-white/10 text-white w-full shadow-lg font-bold backdrop-blur-md transition-all">
                 <Bell className="w-4 h-4 mr-2" /> Subscribe to Updates
               </Button>
            </div>
          </div>
        </motion.div>

        {/* Real-time Systems Grid */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
             <Server className="w-6 h-6 text-emerald-400" /> Core Infrastructure
          </h2>
          <div className="text-sm font-mono font-bold text-emerald-400/80 bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-500/20 shadow-sm backdrop-blur-sm">90 DAYS UPTIME</div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-20">
          {systems.map((sys, idx) => {
            const isOp = sys.status === 'Operational';
            const statusColor = isOp ? 'emerald' : 'amber';
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.04] transition-all backdrop-blur-sm group hover:border-white/20"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <div>
                    <div className="font-bold text-white text-lg flex items-center gap-3">
                      {sys.name} 
                      <span className="text-[10px] font-bold uppercase tracking-widest font-mono bg-white/10 border border-white/10 px-2 py-0.5 rounded text-gray-400">{sys.region}</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-2 font-mono flex gap-6 font-medium">
                      <span className="flex items-center gap-1.5">Uptime: <span className="text-gray-200">{sys.uptime}</span></span>
                      <span className="flex items-center gap-1.5">Latency: <span className="text-emerald-400">{sys.ping}</span></span>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-2 bg-${statusColor}-950/40 border border-${statusColor}-500/30 text-${statusColor}-400 px-4 py-1.5 rounded-full text-sm font-bold font-mono shadow-sm`}>
                    <div className={`w-2 h-2 rounded-full bg-${statusColor}-400 ${isOp ? 'animate-pulse' : ''} shadow-[0_0_8px_currentColor]`} /> {sys.status}
                  </div>
                </div>
                
                {/* Simulated 90-day chart */}
                <div className="flex gap-1 h-10 w-full overflow-hidden">
                  {Array.from({ length: 90 }).map((_, i) => {
                    const opacity = Math.random() > 0.95 ? 'opacity-40' : 'opacity-100';
                    return (
                      <div 
                        key={i} 
                        title="Operational"
                        className={`flex-1 bg-${statusColor}-500/80 ${opacity} rounded-[2px] hover:opacity-50 transition-opacity cursor-crosshair`}
                      />
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Incident History Timeline */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
             <Clock className="w-6 h-6 text-emerald-400" /> Incident Log
          </h2>
        </div>
        
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-white/20 before:to-transparent">
          {incidents.map((inc, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#050505] bg-white/10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10 backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-gray-300" />
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 bg-white/[0.02] border border-white/10 rounded-2xl shadow-xl hover:bg-white/[0.04] transition-all backdrop-blur-sm group-hover:border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-gray-400 bg-white/5 border border-white/10 px-2 py-1 rounded">
                    {inc.date} • {inc.time}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    {inc.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{inc.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm mb-4">{inc.desc}</p>
                <div className="pt-4 border-t border-white/10">
                  <a href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-bold flex items-center">
                    Read Post-Mortem <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
      </section>
    </div>
  );
}

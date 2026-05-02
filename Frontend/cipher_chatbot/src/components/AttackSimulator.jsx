import React, { useState, useRef, useEffect } from 'react';
import { ShieldAlert, Play, Activity, Terminal, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AttackSimulator = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const scrollRef = useRef(null);

  const startSimulation = async () => {
    setIsSimulating(true);
    setResults([]);
    setSummary(null);

    try {
      const response = await fetch('http://localhost:5000/api/simulate-attack', {
        method: 'POST'
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        lines.forEach(line => {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.simulation_complete) {
                setSummary(data);
              } else {
                setResults(prev => [data, ...prev].slice(0, 30)); // Keep fewer for chatbot
              }
            } catch (e) {
              console.error("Error parsing simulation chunk:", e);
            }
          }
        });
      }
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="bg-secondary/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl overflow-hidden flex flex-col h-full max-h-[500px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-danger/20 rounded-lg">
            <ShieldAlert className="text-danger" size={18} />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-white tracking-wider uppercase">Attack Simulator</h3>
            <p className="text-[10px] text-text-sub font-body">Coordinated Burst (500 Req)</p>
          </div>
        </div>

        <button
          onClick={startSimulation}
          disabled={isSimulating}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-display font-bold text-[10px] tracking-widest transition-all duration-300 ${
            isSimulating 
              ? 'bg-white/5 text-text-sub cursor-not-allowed' 
              : 'bg-danger text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
          }`}
        >
          {isSimulating ? <Activity className="animate-spin" size={12} /> : <Play size={12} />}
          {isSimulating ? '...' : 'START'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white/5 border border-white/5 rounded-xl p-2 text-center">
          <p className="text-[8px] text-text-sub uppercase mb-0.5">Total</p>
          <p className="text-sm font-display font-bold text-white">{summary ? summary.total_requests : (isSimulating ? results.length : 0)}</p>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-xl p-2 text-center">
          <p className="text-[8px] text-text-sub uppercase mb-0.5">Attacks</p>
          <p className="text-sm font-display font-bold text-danger">{summary ? summary.detected_attacks : results.filter(r => r.attack_type !== 'None').length}</p>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-xl p-2 text-center">
          <p className="text-[8px] text-text-sub uppercase mb-0.5">Blocked</p>
          <p className="text-sm font-display font-bold text-primary">{summary ? summary.blocked_requests : results.filter(r => r.action_taken !== 'allowed').length}</p>
        </div>
      </div>

      <div className="flex-1 relative bg-black/60 border border-white/5 rounded-xl overflow-hidden min-h-[200px]">
        <div className="absolute top-0 left-0 right-0 h-6 bg-white/5 flex items-center px-3 justify-between z-10 border-b border-white/5">
          <span className="text-[8px] font-mono text-text-sub uppercase tracking-widest">Forensic Stream</span>
          {isSimulating && <span className="text-[8px] font-mono text-danger animate-pulse">LIVE</span>}
        </div>

        <div className="p-3 pt-8 h-full overflow-y-auto custom-scrollbar font-mono text-[9px]">
          <AnimatePresence initial={false}>
            {results.map((res, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className={`mb-1.5 p-1.5 rounded-lg border flex flex-col gap-0.5 ${
                  res.action_taken === 'allowed' 
                    ? 'border-white/5 bg-white/2 text-text-sub' 
                    : 'border-danger/40 bg-danger/10 text-danger'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>IP: {res.ip}</span>
                  <span className="uppercase">{res.action_taken}</span>
                </div>
                <div className="truncate opacity-80">"{res.input_text}"</div>
                {res.attack_type !== 'None' && (
                  <div className="text-[8px] font-bold text-danger/80">
                    TYPE: {res.attack_type} // RPS: {res.requests_per_second}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {!isSimulating && results.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-text-sub/20">
              <ShieldAlert size={30} />
              <p className="text-[10px] mt-2 tracking-widest">READY</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttackSimulator;

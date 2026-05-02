import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Activity } from 'lucide-react';

const ThreatFeed = ({ logs }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-80 border-l border-border bg-secondary/30 backdrop-blur-md flex flex-col h-full z-20">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-display text-sm uppercase tracking-wider text-primary glow-text-primary flex items-center gap-2">
          <Activity size={16} />
          Threat Activity Feed
        </h3>
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(0,255,159,0.8)]"></div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: 20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`p-3 rounded-lg border text-xs font-mono relative overflow-hidden group
                ${log.type === 'danger' 
                  ? 'bg-danger/5 border-danger/30 text-danger-light' 
                  : 'bg-primary/5 border-primary/20 text-primary/80'
                }
              `}
            >
              <div className="flex items-start gap-2 relative z-10">
                {log.type === 'danger' ? (
                  <ShieldAlert size={14} className="text-danger mt-0.5 shrink-0 drop-shadow-[0_0_5px_rgba(255,59,59,0.8)]" />
                ) : (
                  <ShieldCheck size={14} className="text-primary mt-0.5 shrink-0 drop-shadow-[0_0_5px_rgba(0,255,159,0.8)]" />
                )}
                <div>
                  <div className="opacity-50 text-[10px] mb-1">{new Date(log.timestamp).toLocaleTimeString()}</div>
                  <div className={`${log.type === 'danger' ? 'text-danger glow-text-danger' : 'text-text-main'}`}>
                    {log.message}
                  </div>
                </div>
              </div>
              
              {/* Scanline hover effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-current to-transparent opacity-0 group-hover:opacity-10 group-hover:animate-[scanline_2s_linear_infinite] pointer-events-none"></div>
            </motion.div>
          ))}
          {logs.length === 0 && (
            <div className="text-center text-text-sub text-xs mt-10 opacity-50 flex flex-col items-center">
              <Activity size={24} className="mb-2 opacity-30" />
              Monitoring active...
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ThreatFeed;

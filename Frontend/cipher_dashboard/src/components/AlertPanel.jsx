import React from 'react';
import { AlertTriangle, Shield, Clock } from 'lucide-react';

const AlertPanel = ({ alerts }) => {
  return (
    <div className="bg-secondary/40 backdrop-blur-md border border-slate-800/30 rounded-2xl p-6 h-full flex flex-col shadow-xl overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-display font-bold text-slate-500 uppercase tracking-[0.2em] border-l-2 border-danger pl-3">
          Critical Alerts
        </h3>
        <span className="text-[10px] font-display font-bold text-danger bg-danger/10 px-2 py-0.5 rounded border border-danger/20 animate-pulse">
          LIVE
        </span>
      </div>
      
      <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
        {(alerts || []).length > 0 ? (alerts || []).map((alert, idx) => (
          <div 
            key={idx} 
            className="group bg-danger/5 border border-danger/20 p-4 rounded-xl hover:bg-danger/10 transition-all cursor-default animate-fade-in relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-danger shadow-[0_0_10px_#ef4444]" />
            
            <div className="flex items-start gap-4">
              <div className="bg-danger/20 p-2 rounded-lg border border-danger/20 shrink-0">
                <AlertTriangle size={16} className="text-danger" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-[11px] font-display font-bold text-danger uppercase tracking-widest">
                    THREAT DETECTED
                  </h4>
                  <span className="h-1 w-1 rounded-full bg-slate-700/50" />
                  <span className="text-[9px] font-mono text-slate-500 font-bold">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] font-body text-slate-400 line-clamp-2 leading-relaxed">
                  {alert.message}
                </p>
              </div>
            </div>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <div className="w-12 h-12 rounded-full border-2 border-slate-800/30 flex items-center justify-center mb-4">
              <Shield size={24} className="text-slate-500" />
            </div>
            <p className="text-[10px] font-display font-bold uppercase tracking-widest text-slate-500">
              Clear Environment
            </p>
          </div>
        )}
      </div>
      
      <button className="mt-8 w-full py-3 rounded-xl bg-accent border border-slate-700/30 text-[10px] font-display font-bold text-slate-500 uppercase tracking-[0.2em] hover:text-foreground hover:bg-slate-700/30 transition-all active:scale-[0.98] shadow-sm">
        Clear Alert History
      </button>
    </div>
  );
};

export default AlertPanel;

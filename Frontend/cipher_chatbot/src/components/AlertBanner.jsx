import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const AlertBanner = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="mx-6 mt-4 animate-slide-up relative z-40">
      <div className="bg-danger/10 border border-danger/20 rounded-2xl p-4 flex items-center justify-between shadow-[0_0_30px_rgba(239,68,68,0.1)] backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="bg-danger/20 p-2.5 rounded-xl border border-danger/20 animate-pulse">
            <AlertTriangle className="text-danger" size={24} />
          </div>
          <div>
            <h4 className="text-sm font-display font-bold text-danger uppercase tracking-[0.2em] mb-0.5 glow-text-danger">
              ⚠️ Threat Detected
            </h4>
            <p className="text-xs font-body text-danger/80 font-medium">
              {message}
            </p>
          </div>
        </div>
        <button 
          onClick={onDismiss}
          className="text-danger/40 hover:text-danger p-2 rounded-xl hover:bg-danger/10 transition-all active:scale-90"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default AlertBanner;

import React from 'react';
import { User, Menu, X, ChevronDown } from 'lucide-react';

const Header = ({ onToggleSidebar, isSidebarOpen, username = "Admin", onLogout, userStatus }) => {
  return (
    <header className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 sm:p-6 z-50 pointer-events-none">
      <div className="flex items-center gap-4 pointer-events-auto">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-text-sub transition-colors"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-xl tracking-wide text-text-main drop-shadow-sm">
            CIPHER <span className="text-primary glow-text-primary">AI</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 pointer-events-auto">
        {userStatus && (
          <div className={`text-xs font-mono tracking-widest uppercase px-3 py-1.5 rounded-lg border ${userStatus.locked ? 'bg-danger/10 text-danger border-danger/30 animate-pulse' : 'bg-primary/10 text-primary border-primary/30'}`}>
            Tokens: {Math.max(0, userStatus.max_strikes - userStatus.strikes)}/{userStatus.max_strikes}
          </div>
        )}
        <div className="flex items-center gap-3 bg-secondary/40 backdrop-blur-xl border border-white/5 rounded-full pl-2 pr-4 py-1.5 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <User size={14} className="text-primary drop-shadow-[0_0_5px_rgba(0,255,159,0.8)]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-body font-medium text-text-main">{username}</span>
          </div>
        </div>
        {onLogout && (
          <button 
            onClick={onLogout}
            className="text-xs font-mono tracking-wider text-slate-400 hover:text-danger hover:bg-danger/10 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-danger/30 uppercase"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};


export default Header;

import React from 'react';

const StatCard = ({ label, value, icon: Icon, color, trend }) => {
  return (
    <div className="bg-secondary/40 backdrop-blur-md border border-slate-800/30 p-6 rounded-2xl hover:border-primary/30 transition-all group relative overflow-hidden shadow-sm">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`p-2.5 rounded-xl bg-accent/50 border border-slate-700/20 ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className={`text-[10px] font-display font-bold px-2 py-0.5 rounded-full ${
            trend > 0 ? 'bg-primary/10 text-primary' : 'bg-danger/10 text-danger'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-3xl font-display font-bold text-foreground mb-1 glow-text-primary tracking-tighter">
          {value}
        </p>
        <p className="text-[10px] text-slate-500 font-display font-bold uppercase tracking-widest opacity-80">
          {label}
        </p>
      </div>
      
      {/* Decorative bg glow */}
      <div className={`absolute -bottom-4 -right-4 w-24 h-24 blur-[50px] opacity-[0.05] rounded-full transition-all duration-500 group-hover:opacity-10 ${
        color === 'text-primary' ? 'bg-primary' : color === 'text-danger' ? 'bg-danger' : 'bg-blue-500'
      }`} />
    </div>
  );
};

export default StatCard;

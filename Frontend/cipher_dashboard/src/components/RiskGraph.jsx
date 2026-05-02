import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { Activity } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-3 rounded-xl shadow-2xl">
        <p className="text-[10px] font-display font-bold text-slate-400 mb-2 uppercase tracking-widest">Risk Analysis</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs font-body text-slate-300">{entry.name}:</span>
            <span className="text-xs font-mono font-bold text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const RiskGraph = ({ logs = [] }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (logs.length > 0) {
      // Map logs to graph data (take last 30 and reverse to chronological order)
      const graphData = logs.slice(0, 30).reverse().map((log, index) => ({
        time: index,
        inputRisk: log.input_risk || 0,
        outputRisk: log.output_risk || 0,
      }));
      setData(graphData);
    }
  }, [logs]);

  return (
    <div className="bg-secondary/40 backdrop-blur-md border border-slate-800/30 rounded-2xl p-6 h-full flex flex-col shadow-xl animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-1.5 rounded-lg border border-primary/20">
            <Activity size={16} className="text-primary" />
          </div>
          <h3 className="text-sm font-display font-bold text-slate-500 uppercase tracking-[0.2em] border-l-2 border-primary/0 pl-1">
            Risk Analysis Overview
          </h3>
        </div>
        <span className="text-[10px] font-display font-bold text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/50 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          STATIC
        </span>
      </div>
      
      <div className="flex-1 w-full min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorInput" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.4} />
            <XAxis dataKey="time" hide={true} />
            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }} 
              iconType="circle"
              iconSize={8}
            />
            <Area 
              type="monotone" 
              dataKey="inputRisk" 
              name="Input Risk Score" 
              stroke="#ef4444" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorInput)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#ef4444' }}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            />
            <Area 
              type="monotone" 
              dataKey="outputRisk" 
              name="Output Risk Score" 
              stroke="#22c55e" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorOutput)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#22c55e' }}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RiskGraph;

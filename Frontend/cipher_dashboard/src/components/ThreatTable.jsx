import React, { useState } from 'react';
import { Search, Shield, AlertTriangle, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const ThreatTable = ({ logs }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const filteredLogs = (logs || []).filter(log => {
    if (!log) return false;
    const matchesFilter = filter === 'all' || (filter === 'malicious' ? log.is_malicious : !log.is_malicious);
    const message = log.message || '';
    const matchesSearch = message.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const currentLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getRiskColor = (score, isMalicious) => {
    if (isMalicious || score > 70) return 'text-danger';
    if (score > 40) return 'text-amber-500';
    return 'text-primary';
  };

  return (
    <div className="bg-secondary/40 backdrop-blur-md border border-slate-800/30 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-6 border-b border-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-sm font-display font-bold text-slate-500 uppercase tracking-[0.2em]">
          Security Threat Logs
        </h3>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="Search interaction..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-background border border-slate-700/50 rounded-xl pl-9 pr-4 py-2 text-[11px] text-foreground focus:outline-none focus:border-primary/50 transition-all w-48 font-body shadow-sm"
            />
          </div>
          
          <div className="flex items-center bg-background border border-slate-700/50 rounded-xl px-2 shadow-sm">
            <Filter size={12} className="text-slate-500 ml-1" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent px-2 py-2 text-[11px] text-slate-500 focus:outline-none cursor-pointer font-display font-bold uppercase tracking-wider"
            >
              <option value="all">All</option>
              <option value="safe">Safe</option>
              <option value="malicious">Threats</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-accent/30 text-[10px] font-display font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800/30">
            <tr>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4 hidden md:table-cell">User</th>
              <th className="px-6 py-4 hidden lg:table-cell">Source IP</th>
              <th className="px-6 py-4">Interaction</th>
              <th className="px-6 py-4 hidden sm:table-cell">Attack Type</th>
              <th className="px-6 py-4">Risk Score</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30 font-body">
            {currentLogs.map((log, idx) => (
              <tr 
                key={idx} 
                className={`group transition-all duration-300 hover:bg-accent/20 ${
                  log.is_malicious ? 'bg-danger/5 border-l-4 border-danger' : 'border-l-4 border-transparent'
                }`}
              >
                <td className="px-6 py-5 text-[10px] font-mono text-slate-500 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
                </td>
                <td className="px-6 py-5 text-xs font-bold text-primary max-w-[100px] truncate uppercase tracking-wider font-display hidden md:table-cell">
                  {log.username}
                </td>
                <td className="px-6 py-5 text-[10px] font-mono text-slate-400 hidden lg:table-cell">
                  {log.ip}
                </td>
                <td className="px-6 py-5 text-xs font-medium text-foreground max-w-md truncate transition-colors">
                  {log.message}
                </td>
                <td className="px-6 py-5 text-[10px] font-mono text-danger font-bold uppercase tracking-wider hidden sm:table-cell">
                  {log.attack_type !== 'None' ? log.attack_type : '-'}
                </td>
                <td className="px-6 py-4">

                  <div className="flex flex-col gap-2">
                    {/* Input Risk */}
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-display font-bold text-slate-500 uppercase tracking-widest w-6">IN:</span>
                      <div className="w-12 h-1 bg-slate-800/50 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            log.is_malicious || (log.input_risk || 0) > 70 ? 'bg-danger' : (log.input_risk || 0) > 40 ? 'bg-amber-500' : 'bg-primary'
                          }`}
                          style={{ width: `${log.input_risk || 0}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-bold font-display w-6 text-right ${getRiskColor(log.input_risk || 0, log.is_malicious)}`}>
                        {log.input_risk || 0}
                      </span>
                    </div>
                    {/* Output Risk */}
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-display font-bold text-slate-500 uppercase tracking-widest w-6">OUT:</span>
                      <div className="w-12 h-1 bg-slate-800/50 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            (log.output_risk || 0) > 70 ? 'bg-danger' : (log.output_risk || 0) > 40 ? 'bg-amber-500' : 'bg-primary'
                          }`}
                          style={{ width: `${log.output_risk || 0}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-bold font-display w-6 text-right ${getRiskColor(log.output_risk || 0, false)}`}>
                        {log.output_risk || 0}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-display font-bold tracking-[0.1em] uppercase border ${
                    log.is_malicious 
                      ? 'bg-danger/20 text-danger border-danger/30' 
                      : 'bg-primary/10 text-primary border-primary/20'
                  }`}>
                    {log.is_malicious ? <AlertTriangle size={10} /> : <Shield size={10} />}
                    {log.is_malicious ? 'Malicious' : 'Safe'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-accent/10 flex items-center justify-between border-t border-slate-800/30">
        <span className="text-[10px] font-display font-bold text-slate-500 uppercase tracking-widest">
          Interaction Log // Page {currentPage}
        </span>
        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-2 rounded-xl border border-slate-700/50 text-slate-500 hover:text-primary disabled:opacity-20 transition-all"
          >
            <ChevronLeft size={14} />
          </button>
          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-2 rounded-xl border border-slate-700/50 text-slate-500 hover:text-primary disabled:opacity-20 transition-all"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThreatTable;

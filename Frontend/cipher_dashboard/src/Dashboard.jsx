import React, { useState, useEffect } from 'react';
import StatCard from './components/StatCard';
import ThreatTable from './components/ThreatTable';
import AlertPanel from './components/AlertPanel';
import RiskGraph from './components/RiskGraph';
import { useTheme } from './context/ThemeContext';
import { 
  Shield, MessageSquare, AlertTriangle, CheckCircle, 
  Target, ShieldCheck, RefreshCw, Sun, Moon 
} from 'lucide-react';

const Dashboard = () => {
  const { theme, toggleTheme } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setRefreshing(true);
    try {
      const response = await fetch('http://localhost:5000/api/logs');
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const result = await response.json();
      
      // Map backend log format to UI format, using the highest detected risk
      const mappedLogs = result.logs.map(log => ({
        timestamp: log.timestamp,
        username: log.username || 'anonymous',
        message: log.matched_pattern !== 'None' ? log.matched_pattern : 'Clean Interaction',
        risk_score: Math.max(log.input_risk || 0, log.output_risk || 0),
        input_risk: log.input_risk,
        output_risk: log.output_risk,
        is_malicious: log.final_status === 'BLOCKED',
        category: log.category,
        ip: log.ip || '127.0.0.1',
        attack_type: log.attack_type || 'None'
      }));


      setData({
        ...result,
        logs: mappedLogs
      });
      setError(null);
    } catch (error) {
      console.error("Dashboard failed to load:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 15000);
    return () => clearInterval(interval);
  }, []);

  // Pre-flight check: If something is critically wrong, show a fallback
  if (loading && !data) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050505] gap-6 text-center p-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse"></div>
          <Shield size={80} className="text-primary relative z-10 animate-bounce" />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-display font-bold text-white uppercase tracking-[0.5em] animate-pulse">
            System Booting
          </p>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            AI SHIELD // Forensics v2.1
          </p>
        </div>
      </div>
    );
  }

  // Handle case where data failed to load or connection error
  if (error || !data) {
    if (loading) return null; // Let the "System Booting" screen handle it
    
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0a0a0b] gap-6 text-center p-6 border-t-2 border-red-500/20">
        <div className="bg-red-500/10 p-4 rounded-full border border-red-500/20 animate-pulse">
          <AlertTriangle size={48} className="text-red-500" />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider">Security Engine Offline</h2>
          <p className="text-slate-400 font-body max-w-sm mx-auto leading-relaxed">
            AI SHIELD could not establish a secure connection to the forensic backend. 
            <span className="block mt-2 text-red-400/80 text-xs font-mono bg-black/40 py-1 rounded">ERROR: {error || 'DATA_NULL_EXC'}</span>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button 
            onClick={() => fetchData()} 
            className="flex items-center gap-2 px-8 py-3 bg-secondary border border-slate-700 rounded-xl text-primary text-xs font-bold hover:bg-white/5 hover:border-primary/50 transition-all active:scale-95"
          >
            <RefreshCw size={14} />
            RETRY CONNECTION
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-3 bg-transparent border border-slate-800 rounded-xl text-slate-500 text-xs font-bold hover:text-white transition-all"
          >
            FORCE REBOOT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body p-4 lg:p-8 transition-colors duration-300">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tighter uppercase leading-none">
              CIPHER<span className="text-primary"> AI</span>
            </h1>
            <p className="text-[9px] font-display font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">
              Live Security Monitoring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-secondary border border-slate-700/50 text-foreground hover:text-primary transition-all shadow-lg active:scale-95 flex items-center justify-center"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-display font-bold tracking-widest border bg-secondary border-slate-700/50">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-primary mr-3">SECURE MODE ON</span>
            <span className="text-slate-500 font-mono hidden sm:inline">ASH-LIVE-••••-V1X9</span>
          </div>

          <button 
            onClick={() => fetchData()}
            className={`p-2.5 rounded-xl bg-secondary border border-slate-700/50 text-slate-400 hover:text-primary transition-all ${refreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Messages" value={data?.total_messages || 0} icon={MessageSquare} color="text-blue-400" />
          <StatCard label="Threats Detected" value={data?.threats_detected || 0} icon={AlertTriangle} color="text-danger" />
          <StatCard label="Safe Requests" value={data?.safe_requests || 0} icon={CheckCircle} color="text-primary" />
          <StatCard label="Avg Risk Score" value={data?.avg_risk_score || 0} icon={Target} color="text-amber-400" />
        </div>

        <div className="w-full h-64 sm:h-80 lg:h-96">
          <RiskGraph logs={data?.logs || []} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <ThreatTable logs={data?.logs || []} />
          </div>
          <div className="lg:col-span-4 h-[600px]">
            <AlertPanel alerts={data?.logs?.filter(l => l.is_malicious) || []} />
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-16 pb-8 text-center">
        <p className="text-[9px] font-display font-bold text-slate-500 uppercase tracking-[0.5em]">
          End-to-End Security Framework // Cipher Core v2.0
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;

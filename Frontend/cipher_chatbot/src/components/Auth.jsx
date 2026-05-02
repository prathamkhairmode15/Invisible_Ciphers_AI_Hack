import React, { useState } from 'react';
import { Shield, Lock, User, Key, ArrowRight } from 'lucide-react';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        onLogin(data.username);
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection failed. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-body">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md bg-secondary/30 backdrop-blur-xl border border-slate-800/50 p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 mb-4 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
            <Shield size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white uppercase tracking-wider">
            CIPHER <span className="text-primary">AI</span>
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-2 tracking-widest uppercase">
            Secure Authentication
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-mono text-center animate-fade-in">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-display font-bold text-slate-400 uppercase tracking-widest pl-1">
              Operative ID
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full bg-black/40 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-600"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-display font-bold text-slate-400 uppercase tracking-widest pl-1">
              Security Key
            </label>
            <div className="relative">
              <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-black/40 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-600"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50 py-3 rounded-xl font-display font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 group disabled:opacity-50 mt-8"
          >
            {loading ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <>
                {isLogin ? 'Initialize Session' : 'Create Access Token'}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-wider"
          >
            {isLogin ? "Request new credentials?" : "Already have access?"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

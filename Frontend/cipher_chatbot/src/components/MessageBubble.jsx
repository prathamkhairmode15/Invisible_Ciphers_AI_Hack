import React, { useState } from 'react';
import { Copy, Check, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const MessageBubble = ({ message, isAI, riskScore, isMalicious }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full mb-6 ${isAI ? 'justify-start' : 'justify-end'}`}
    >
      <div className={`flex max-w-[85%] sm:max-w-[75%] gap-3 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {isAI && (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center border border-white/5 shadow-sm self-end mb-1">
            <span className="font-display font-bold text-primary text-sm">C</span>
          </div>
        )}

        <div className="flex flex-col gap-1.5 relative">
          <div className={`relative group p-4 rounded-2xl shadow-sm border transition-all duration-300 ${
            isAI 
              ? 'bg-secondary/30 backdrop-blur-xl border-white/5 text-text-main rounded-bl-sm hover:shadow-[0_4px_20px_rgba(0,255,159,0.05)]' 
              : 'bg-white/5 border-transparent text-text-main rounded-br-sm'
          } ${isMalicious ? 'border-danger/30 bg-danger/5 shadow-[0_0_15px_rgba(255,71,87,0.1)]' : ''}`}>
            
            {isMalicious && (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-danger mb-2 bg-danger/10 w-fit px-2 py-1 rounded-md border border-danger/20">
                <ShieldAlert size={12} />
                <span>Potential prompt injection detected</span>
              </div>
            )}

            <p className="text-[15px] font-body leading-relaxed whitespace-pre-wrap selection:bg-primary/20">
              {message}
            </p>
            
            {isAI && (
              <button 
                onClick={handleCopy}
                className="absolute -right-10 top-1/2 -translate-y-1/2 p-2 rounded-full text-text-sub opacity-0 group-hover:opacity-100 transition-all hover:text-text-main hover:bg-white/5"
                title="Copy message"
              >
                {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
